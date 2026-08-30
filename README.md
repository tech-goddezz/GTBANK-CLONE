# GTCO App — Mobile Banking Client

A React Native banking app built with Expo and TypeScript, backed by Supabase with authorisation enforced at the database layer.

The project began as a UI clone with mocked authentication and hardcoded data. This repository documents the work of replacing that with a real backend: genuine sessions, a relational schema, a full KYC onboarding flow, and access control that holds even if the client is compromised.

---

## Access control is enforced by the database, not the client

A common shortcut in mobile apps is to filter data in the client — fetch rows, then display only the user's own. That isn't access control. Anyone who inspects network traffic or extracts the anon key can query everything.

This app uses **PostgreSQL Row Level Security**. Policies attach to the tables themselves, so a session can only read or write rows belonging to that user, regardless of what the client asks for. The frontend cannot opt out, which is the entire point.

This is why the Supabase anon key can safely ship inside the app bundle: on its own it grants nothing. Without RLS on every table, that same key would expose the whole database.

---

## Credentials are never stored in plaintext

An earlier version of this codebase stored the user's signup password in the `profiles` table so that PIN login could replay it to create a session. It also stored the PIN as a raw string and a CVV alongside card records.

That design had a specific flaw worth stating plainly: RLS restricted each user to their own row, but **their own row contained their password**. A single compromised session exposed real credentials, and one misconfigured policy on `profiles` would have exposed every password in the system.

The current design:

**PINs are hashed inside Postgres.** `pgcrypto` with bcrypt salts. Two `security definer` functions handle it — `set_pin` hashes on write, `verify_pin_by_id` compares by passing the stored hash back in as the salt:

```sql
return stored = crypt(p_pin, stored);
```

The same PIN hashed with the same salt produces the same result. Because the functions run as `security definer`, the client can ask *"is this PIN correct?"* and receive a boolean, but can never read the hash.

**The PIN is an unlock, not a credential.** It previously authenticated from scratch, which is precisely why a password had to be stored — a PIN alone cannot mint a Supabase session. It now verifies against an existing session and falls back to email/password when there isn't one. This mirrors how real banking apps treat a PIN: it gates access to a session; it is not proof of identity.

**No CVV storage.** PCI-DSS prohibits retaining CVV after authorisation, with no exemption for test data.

The `demo_password`, `pin`, and `cvv` columns have been dropped. Existing PINs were migrated to hashes before the plaintext column was removed.

---

## Referential integrity

The `profiles` table extends Supabase's built-in `auth.users` rather than duplicating identity data:

- `profiles.id` is a foreign key to `auth.users.id`
- The constraint cascades on delete, so removing an auth user removes their profile atomically

This prevents orphaned profile rows — a real failure mode when account deletion and profile deletion are separate operations that can partially fail.

---

## A bug worth documenting

Database writes were intermittently failing straight after signup when email confirmation was enabled.

**Cause:** the app attempted the profile insert before the Supabase session was fully established. With RLS active, an unauthenticated request carries no user context, so the policy correctly rejected the write. It looked random because it depended on timing.

**Fix:** wait for session confirmation before performing authenticated writes, and handle the confirmation-pending state explicitly rather than assuming a session exists immediately after signup.

**The general lesson:** with RLS enabled, session lifecycle *is* part of the data layer. "Authenticated" isn't a single instant — there's a window where the user exists but the session doesn't, and writes in that window will fail.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | React Native 0.81 + Expo 54 |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| Backend | Supabase — Postgres, Auth, RLS, RPC |
| State | Zustand |
| Styling | NativeWind (Tailwind) |
| Animation | React Native Reanimated |

---

## Features

**Onboarding & KYC** — phone verification, OTP, personal details, date of birth, BVN/NIN capture, address, identity verification, PIN setup. Tier upgrades unlock higher transfer limits.

**Banking** — account balance, transfers with recipient name lookup before sending, transaction history, bill payments, wallet top-up, transaction reporting.

**Cards** — virtual card issuance, freeze and unfreeze.

**Auth** — email/password sign-in, PIN unlock, password recovery, persistent sessions across restarts.

Runs on iOS, Android, and web from a single codebase.

---

## Architecture

```
app/                      # Expo Router — file-based routes
  (auth)/                 # Signup, login, OTP, KYC flow, PIN setup
  (tabs)/                 # Home, pay, cards, history, transfers
  (products)/             # Product catalogue
  (settings)/             # PIN changes, help
  (forgot-password)/      # Recovery

services/auth.ts          # Every Supabase call — one module
lib/supabase.ts           # Client configuration
store/                    # Zustand: auth, account, KYC
components/               # Reusable UI + ErrorBoundary
types/                    # Shared TypeScript types
```

**Data access is isolated.** Every Supabase call lives in `services/auth.ts`. Screens call typed functions; they never build queries. One place to audit, one place to change, and the auth flow can be reworked without touching the screens that depend on it — as the PIN change above demonstrated: `login-biometric.tsx` needed no edits because the function contract stayed the same.

---

## Running locally

```bash
git clone https://github.com/tech-goddezz/GTBANK-CLONE.git
cd GTBANK-CLONE
npm install
```

Create `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

```bash
npx expo start
```

Scan with Expo Go, or press `i` / `a` / `w` for iOS, Android, or web.

---

## Backend requirements

A Supabase project with:

1. Email auth enabled
2. `pgcrypto` extension enabled
3. `profiles` table with a cascading FK to `auth.users` and a `pin_hash` column
4. **RLS enabled on every user data table**, with policies restricting access to `auth.uid()`
5. `set_pin` and `verify_pin_by_id` functions, both `security definer`

---

## Roadmap

- [ ] Edge Function to mint a session from a verified PIN, restoring PIN-only login without storing a password
- [ ] Move `sendMoney` into a Postgres transaction — debit, credit, and ledger insert currently run as separate statements and can partially fail
- [ ] Rate limiting on PIN attempts
- [ ] Automated tests for auth and session edge cases
- [ ] Biometric unlock

---

## Licence

See [LICENSE](LICENSE).
