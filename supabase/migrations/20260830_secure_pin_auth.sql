-- 20260830_secure_pin_auth.sql
--
-- Moves PIN verification out of the client and into Postgres, and removes
-- plaintext credential storage.
--
-- Context: an earlier version of this schema stored the user's signup password
-- in profiles.demo_password so that PIN login could replay it to create a
-- session. It also stored the PIN as a raw string and a CVV alongside card
-- records. Row Level Security restricted each user to their own row — but that
-- row contained their password, so a single compromised session exposed real
-- credentials.

-- ---------------------------------------------------------------------------
-- 1. Hashing support
-- ---------------------------------------------------------------------------

-- Supabase installs extensions into the `extensions` schema, not `public`.
-- Every function below therefore sets search_path = public, extensions.
-- Omitting `extensions` makes crypt() and gen_salt() invisible inside the
-- function body and every call fails with:
--   ERROR: 42883: function crypt(text, text) does not exist
create extension if not exists pgcrypto;

alter table profiles add column if not exists pin_hash text;

-- Migrate any existing plaintext PINs to bcrypt hashes before the plaintext
-- column is dropped. Safe to re-run: the WHERE clause skips rows already done.
update profiles
set pin_hash = crypt(pin, gen_salt('bf'))
where pin is not null
  and pin_hash is null;

-- ---------------------------------------------------------------------------
-- 2. PIN write path
-- ---------------------------------------------------------------------------

-- The plaintext PIN reaches the database and is hashed here. It is never
-- written to a column and never stored in any readable form.
create or replace function set_pin(p_user_id uuid, p_pin text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  update profiles
  set pin_hash = crypt(p_pin, gen_salt('bf'))
  where id = p_user_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. PIN read path
-- ---------------------------------------------------------------------------

-- Returns a boolean only. The hash never leaves the database.
--
-- crypt(p_pin, stored) passes the stored hash in as the salt, so the incoming
-- PIN is hashed with the same salt and cost as the original. Equal PINs
-- therefore produce equal strings. This is a hash-to-hash comparison; the
-- plaintext PIN is never compared to anything and never persisted.
--
-- SECURITY DEFINER lets the function read pin_hash even though RLS prevents
-- the client reading that column directly. The client can ask "is this PIN
-- correct?" and cannot ask "what is the hash?".
create or replace function verify_pin_by_id(p_user_id uuid, p_pin text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  stored text;
begin
  select pin_hash into stored from profiles where id = p_user_id;

  if stored is null then
    return false;
  end if;

  return stored = crypt(p_pin, stored);
end;
$$;

-- Phone-based lookup, retained for a future flow that resolves phone to user
-- server-side. Not currently called by the client: the app verifies against
-- the authenticated session's user id instead, so a caller cannot probe
-- another user's PIN by phone number.
create or replace function verify_pin(p_phone text, p_pin text)
returns table (user_id uuid, email text)
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  return query
  select p.id, p.email
  from profiles p
  where p.phone_number = p_phone
    and p.pin_hash is not null
    and p.pin_hash = crypt(p_pin, p.pin_hash);
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Remove plaintext credential storage
-- ---------------------------------------------------------------------------

-- Irreversible, and intentionally so. Run after the migration in step 1.
--
-- profiles.demo_password — the user's real signup password. Supabase Auth
--   already stores it hashed; this column was a second, readable copy.
-- profiles.pin          — superseded by pin_hash.
-- cards.cvv             — PCI-DSS prohibits retaining CVV after authorisation,
--                         with no exemption for test data.
alter table profiles drop column if exists demo_password;
alter table profiles drop column if exists pin;
alter table cards    drop column if exists cvv;
