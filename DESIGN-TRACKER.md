# Design Tracker

Progress of making the app match the design. The design PDFs in `design/` are the main reference; `design/figma-screenshots/` is backup. Phone frame size: **393 × 852**.

## Summary

| | Count |
|---|---|
| Design screens (all flows) | **124** |
| Already exist in the app (need restyling) | **91** |
| Missing (need building) | **33** |
| Shared components & foundations | 31 (19 exist, 9 missing, 3 nothing to build / to decide) |
| Screens in the app but not in the design | 6 |

Many design screens are variations of the same code file (for example the 5 onboarding slides are all `app/onboarding.tsx`), so the number of code files to work on is much smaller than 124.

**Status key:** ⬜ Not started · 🟨 In progress · ✅ Done (owner confirmed) · 🆕 Missing (needs building) · ➖ Nothing to build

**Web addresses** assume the app is running with `npx expo start --web` (http://localhost:8081). Folder names in brackets, like `(auth)`, don't appear in the address.

> ⚠️ **Address clashes to fix later:** `(auth)` and `(forgot-password)` both have `otp`, `identity`, `requirements` and `success` screens, so `/otp`, `/identity`, `/requirements` and `/success` point to only one of each pair. `(products)/index.tsx` and `app/index.tsx` both claim `/`. Rows affected are marked ⚠️. Fixing this changes navigation, so it needs the owner's OK.

---

## 1. Shared components & foundations

| # | Name | Design file | Code file | Web address | Status |
|---|---|---|---|---|---|
| C1 | Colours | all PDFs | `constants/colors.ts` | — | ✅ |
| C2 | Fonts | C2 | Fonts & text sizes | all PDFs | `constants/typography.ts` | — | ✅ | text sizes (Inter, plus Poppins for some headings) | all PDFs | `constants/typography.ts` | — | ✅ |
| C3 | Orange button (Proceed / Next / Done) | all PDFs | `components/Button.tsx` | — | ✅ |
| C4 | Grey text input field | all PDFs | `components/InputField.tsx` | — | ✅ |
| C5 | Bottom tab bar (Home, Transactions, Transfers, Settings) | Dashboard flow + transfer flow.pdf | `components/TabBar.tsx` | — | ✅ |
| C6 | Screen header (back arrow, title, subtitle, bell, ≡ icon) | most in-app screens | `components/ScreenHeader.tsx` | — | ✅ |
| C7 | 6-digit code boxes | Sign in.pdf, Kyc flow.pdf | `components/ui/OTPInput.tsx` | — | ✅ |
| C8 | Number keypad (1–9, 0) | Sign in.pdf | `components/NumericKeypad.tsx` | — | ✅ |
| C9 | Bottom sheet (pop-up base) | Menu.pdf, Frame 10837.pdf | `components/ui/BottomSheet.tsx` | — | ✅ |
| C10 | Blue info banner ("Recipient will be credited shortly") | Dashboard flow + transfer flow.pdf | `components/InfoBanner.tsx` | — | ✅ |
| C11 | "Welcome! Your number isn't linked" pop-up (rocket) | Frame 16.pdf | `components/WelcomeSheet.tsx`, opened from `app/(auth)/phone.tsx` | — | ✅ |
| C12 | Date picker – calendar | Frame 17.pdf | `app/(auth)/date-of-birth.tsx` | /date-of-birth | ✅ |
| C13 | Date picker – type the date | Frame 25.pdf | `app/(auth)/date-of-birth.tsx` | /date-of-birth | ✅ |
| C14 | "Congrats! Tier 1 account opened" card | Default.pdf / Default-1.pdf | `components/CongratsSheet.tsx` | /pin (after confirming PIN) | ✅ |
| C15 | "Congrats! Loan account opened" card | Default.pdf / Default-1.pdf | `components/CongratsSheet.tsx` | not connected until loan screens | ✅ |
| C16 | "Select action" sheet (GT Bank / Other Banks) | Frame 10837.pdf | `components/SelectActionSheet.tsx` | /transfer-flow ("Quickly Transfer") | ✅ |
| C17 | Filter Transactions sheet | Menu.pdf | `components/FilterTransactionsSheet.tsx` | /history (filter button) | ✅ |
| C18 | Filter Transactions – reset state | Reset filters.pdf | `components/FilterTransactionsSheet.tsx` | /history (filter button → Reset Filters) | ✅ |
| C19 | "Authenticating fingerprint" pop-up | Frame 1171276698.pdf | `components/FingerprintSheet.tsx` | connected at S10 (look-only, no real scan) | ✅ |
| C20 | Phone keyboards (number & letters) | Keyboard.pdf, Keyboard-1.pdf | The phone's own keyboard; nothing to build | — | ➖ |
| C21 | Small 16px icons (bullseye ×3, download) | bullseye.pdf, bullseye-1.pdf, bullseye-2.pdf, Download.pdf | Used inside other screens as needed | — | ➖ |
| C22 | Large square image (852 × 852) | Rectangle.pdf | Unclear what it's for; owner to confirm | — | ➖ |
| C23 | Transaction row | To be checked | `components/TransactionItem.tsx` | — | ✅ |
| C24 | Balance card | To be checked | `components/BalanceCard.tsx` | — | ✅ |
| C25 | Status badge | Not in the design (History uses plain text) | `components/StatusBadge.tsx` (not used by any screen) | — | ➖ |
| C26 | Debit card | To be checked | `components/DebitCard.tsx` | — | ✅ |
| C27 | Promo carousel | Not in the design; owner chose to keep it on Home | `components/PromoCarousel.tsx` | /home | ✅ |
| C28 | Ad ticker | Not in the design; owner chose to keep it on Home | `components/AdTicker.tsx` | /home | ✅ |
| C29 | Transaction ticker | Not in the design; owner chose to keep it on Home | `components/TransactionTicker.tsx` | /home | ✅ |
| C30 | Cube illustration | On boarding flow.pdf | `components/CubeIllustration.tsx` | /onboarding | ✅ |
| C31 | Crash screen (ErrorBoundary) | Not in the design | `components/ErrorBoundary.tsx` (not connected yet; connect before launch) | — | ➖ |

## 2. Onboarding — `On boarding  flow.pdf`

| # | Screen | Design file | Code file | Web address | Status |
|---|---|---|---|---|---|
| S1 | Splash (GTCO logo) | On boarding flow.pdf | `app/index.tsx` | / ⚠️ | ✅ |
| S2 | Onboarding 1 – "GT World All fresh and clean" | On boarding flow.pdf | `app/onboarding.tsx` | /onboarding | ✅ |
| S3 | Onboarding 2 – "All inclusive financial platform" | On boarding flow.pdf | `app/onboarding.tsx` | /onboarding | ✅ |
| S4 | Onboarding 3 – "More efficient ways to pay" | On boarding flow.pdf | `app/onboarding.tsx` | /onboarding | ✅ |
| S5 | Onboarding 4 – "Save for retirement with pensions" | On boarding flow.pdf | `app/onboarding.tsx` | /onboarding | ✅ |
| S6 | Onboarding 5 – "A friendly financial services app" (Let's start) | On boarding flow.pdf | `app/onboarding.tsx` | /onboarding | ✅ |

## 3. Sign in — `Sign in.pdf`

| # | Screen | Design file | Code file | Web address | Status |
|---|---|---|---|---|---|
| S7 | Input phone number ("Hello!") | Sign in.pdf | `app/(auth)/phone.tsx` | /phone | ✅ |
| S8 | 6-digit code (from SMS / Tokens) | Sign in.pdf | `app/(auth)/otp.tsx` | /otp?phone=8012345678 | ✅ |
| S9 | Enter password (number keypad) | Sign in.pdf | `app/(auth)/login-password.tsx` | /login-password | ✅ |
| S10 | Log in with fingerprint | Sign in.pdf | `app/(auth)/login-biometric.tsx` | /login-biometric | ✅ |

## 4. Forgot password — `forget password.pdf`

| # | Screen | Design file | Code file | Web address | Status |
|---|---|---|---|---|---|
| S11 | Requirements checklist | forget password.pdf | `app/(forgot-password)/requirements.tsx` | Not linked any more: owner chose (2026-11-07) that "Forget password?" goes straight to Reset password. File kept. | ✅ |
| S12 | Reset password (account number + phone) | forget password.pdf | `app/(forgot-password)/reset-password.tsx` | /reset-password | ✅ |
| S13 | 6-digit code | forget password.pdf | `app/(forgot-password)/otp.tsx` | /reset-password → fill both numbers → Proceed (/otp opens the sign-in one ⚠️) | ✅ |
| S14 | Identity verification – camera | forget password.pdf | `app/(forgot-password)/identity.tsx` | /reset-password → numbers → Proceed → any 6 digits → Proceed (/identity opens the sign-up one ⚠️) | ✅ |
| S15 | Identity verification – face scan | forget password.pdf | `app/(forgot-password)/identity.tsx` | S14 → tap Start | ✅ |
| S16 | Create new password | forget password.pdf | `app/(forgot-password)/new-password.tsx` | /new-password | ✅ |
| S17 | Password updated! | forget password.pdf | `app/(forgot-password)/success.tsx` | /new-password → same 6+ character password twice → Reset Password (/success opens the PIN one ⚠️). Sign In → /phone | ✅ |

## 5. KYC (open an account) — `Kyc flow.pdf`

| # | Screen | Design file | Code file | Web address | Status |
|---|---|---|---|---|---|
| S18 | Input phone number (same as S7) | Kyc flow.pdf | `app/(auth)/phone.tsx` | /phone | ✅ |
| S19 | 6-digit code – from SMS | Kyc flow.pdf | `app/(auth)/otp.tsx` | /otp ⚠️ | ✅ |
| S20 | 6-digit code – Tokens tab | Kyc flow.pdf | `app/(auth)/otp.tsx` | /otp ⚠️ | ✅ |
| S21 | Open a GTBank account – requirements | Kyc flow.pdf | `app/(auth)/requirements.tsx` | /requirements ⚠️ | ✅ |
| S22 | Your date of birth – empty | Kyc flow.pdf | `app/(auth)/date-of-birth.tsx` | /date-of-birth | ✅ |
| S23 | Your date of birth – second state | Kyc flow.pdf | `app/(auth)/date-of-birth.tsx` | /date-of-birth | ✅ |
| S24 | Verification number – BVN tab | Kyc flow.pdf | `app/(auth)/bvn-nin.tsx` | /bvn-nin | ✅ |
| S25 | Verification number – NIN tab | Kyc flow.pdf | `app/(auth)/bvn-nin.tsx` | /bvn-nin | ✅ |
| S26 | Provide address | Kyc flow.pdf | `app/(auth)/address.tsx` | /address | ✅ |
| S27 | Identity verification – camera | Kyc flow.pdf | `app/(auth)/identity.tsx` | /identity ⚠️ | ✅ |
| S28 | Identity verification – face scan | Kyc flow.pdf | `app/(auth)/identity.tsx` | /identity ⚠️ | ✅ |
| S29 | Wait a moment (GTBank Tier 1) | Kyc flow.pdf | `app/(auth)/success.tsx` | /success ⚠️ | ✅ |

## 6. Home / Dashboard — `Dashboard flow + transfer flow.pdf`

| # | Screen | Design file | Code file | Web address | Status |
|---|---|---|---|---|---|
| S30 | Enter password (same as S9) | Dashboard flow + transfer flow.pdf | `app/(auth)/login-password.tsx` | /login-password | ✅ |
| S31 | Log in with fingerprint (same as S10) | Dashboard flow + transfer flow.pdf | `app/(auth)/login-biometric.tsx` | /login-biometric | ✅ |
| S32 | Home (balance, Send/Pay/Top up/More, recent transactions) | Dashboard flow + transfer flow.pdf | `app/(tabs)/home.tsx` | /home | ✅ |
| S33 | History | Dashboard flow + transfer flow.pdf | `app/(tabs)/history.tsx` | /history | ✅ |
| S34 | History – searching (keyboard open) | Dashboard flow + transfer flow.pdf | `app/(tabs)/history.tsx` | /history | ✅ |
| S35 | Transactions tab (loans / money market cards) | Dashboard flow + transfer flow.pdf | `app/(tabs)/transactions.tsx` | /transactions | ✅ |
| S36 | Transfers tab (tracking steps + Query Transfer) | Dashboard flow + transfer flow.pdf | `app/(tabs)/transfer-flow/index.tsx` (old send-money page moved to `transfer-flow/send.tsx`) | /transfer-flow | ✅ |
| S37 | Settings tab | Dashboard flow + transfer flow.pdf | `app/(tabs)/settings.tsx` | /settings | ✅ |

## 7. Screens inside the home screen — `Screens inside the home screen.pdf`

| # | Screen | Design file | Code file | Web address | Status |
|---|---|---|---|---|---|
| S38 | Send – choose GTBank | Screens inside the home screen.pdf | `app/(tabs)/transfer-flow/send.tsx` | /transfer-flow/send | ✅ |
| S39 | Send – choose Different Bank | Screens inside the home screen.pdf | `app/(tabs)/transfer-flow/send.tsx` | /transfer-flow/send | ✅ |
| S40 | Send – choose Saved Beneficiaries | Screens inside the home screen.pdf | `app/(tabs)/transfer-flow/send.tsx` | /transfer-flow/send | ✅ |
| S41 | Send – choose Fund GT Money Market | Screens inside the home screen.pdf | `app/(tabs)/transfer-flow/send.tsx` | /transfer-flow/send | ✅ |
| S42 | Send – choose e-wallet | Screens inside the home screen.pdf | `app/(tabs)/transfer-flow/send.tsx` | /transfer-flow/send | ✅ |
| S43 | Pay (bill list) | Screens inside the home screen.pdf | `app/(tabs)/pay.tsx` | /pay | ✅ |
| S44 | Top Up – Airtime (empty) | Screens inside the home screen.pdf | `app/(tabs)/topup.tsx` | /topup | ✅ |
| S45 | Top Up – Data (empty) | Screens inside the home screen.pdf | `app/(tabs)/topup.tsx` | /topup | ✅ |
| S46 | More (list of services) | Screens inside the home screen.pdf | `app/(tabs)/more.tsx` | /more | ✅ |
| S47 | Send form – GTBank (own accounts) | Screens inside the home screen.pdf | `app/(tabs)/transfer-flow/details.tsx` | /transfer-flow/details | ✅ |
| S48 | Send form – Different bank | Screens inside the home screen.pdf | `app/(tabs)/transfer-flow/details.tsx` | /transfer-flow/details | ✅ |
| S49 | Send form – Saved beneficiary | Screens inside the home screen.pdf | `app/(tabs)/transfer-flow/details.tsx` | /transfer-flow/details | ✅ |
| S50 | Send form – Money market | Screens inside the home screen.pdf | `app/(tabs)/transfer-flow/details.tsx` | /transfer-flow/details | ✅ |
| S51 | Send form – e-wallet | Screens inside the home screen.pdf | `app/(tabs)/transfer-flow/details.tsx` | /transfer-flow/details | ✅ |
| S52 | Top Up – Airtime (filled in) | Screens inside the home screen.pdf | `app/(tabs)/topup.tsx` | /topup | ✅ |
| S53 | Top Up – Data plans grid | Screens inside the home screen.pdf | `app/(tabs)/topup.tsx` | /topup | ✅ |
| S54 | Initiating transfer – GTBank | Screens inside the home screen.pdf | `app/(tabs)/transfer-flow/confirm.tsx` | /transfer-flow/confirm | ✅ |
| S55 | Initiating transfer – Zenith Bank | Screens inside the home screen.pdf | `app/(tabs)/transfer-flow/confirm.tsx` | /transfer-flow/confirm | ✅ |
| S56 | Initiating transfer – Stanbic IBTC | Screens inside the home screen.pdf | `app/(tabs)/transfer-flow/confirm.tsx` | /transfer-flow/confirm | ✅ |
| S57 | Initiating transfer – GT Money Mkt | Screens inside the home screen.pdf | `app/(tabs)/transfer-flow/confirm.tsx` | /transfer-flow/confirm | ✅ |
| S58 | Initiating transfer – GT e-wallet | Screens inside the home screen.pdf | `app/(tabs)/transfer-flow/confirm.tsx` | /transfer-flow/confirm | ✅ |
| S59–S65 | Enter your 4-digit code / Pay with fingerprint (7 near-identical copies, one per transfer type) | Screens inside the home screen.pdf | `app/(tabs)/transfer-flow/pin.tsx` | /transfer-flow/pin | ✅ |

## 8. Transfer flow — `Dashboard flow + transfer flow.pdf`

| # | Screen | Design file | Code file | Web address | Status |
|---|---|---|---|---|---|
| S66 | Confirmed transfer | Dashboard flow + transfer flow.pdf | `app/(tabs)/transfer-flow/confirm.tsx` (`?confirmed=1`) | /transfer-flow/confirm?confirmed=1 | ✅ |
| S67 | Funds sent | Dashboard flow + transfer flow.pdf | `app/(tabs)/transfer-flow/processing.tsx` | /transfer-flow/processing | ⬜ |
| S68 | In transit via NIBSS | Dashboard flow + transfer flow.pdf | `app/(tabs)/transfer-flow/processing.tsx` | /transfer-flow/processing | ⬜ |
| S69 | Credited to recipient | Dashboard flow + transfer flow.pdf | `app/(tabs)/transfer-flow/processing.tsx` | /transfer-flow/processing | ⬜ |
| S70 | Receipt | Dashboard flow + transfer flow.pdf | `app/(tabs)/transfer-flow/receipt.tsx` | /transfer-flow/receipt | ⬜ |
| S71 | Transfer tracking – still checking | Dashboard flow + transfer flow.pdf | MISSING | — | 🆕 |
| S72 | Transfer tracking – failed | Dashboard flow + transfer flow.pdf | MISSING | — | 🆕 |
| S73 | Query – querying NIBSS | Dashboard flow + transfer flow.pdf | MISSING | — | 🆕 |
| S74 | Reversal – automatic reversal in progress | Dashboard flow + transfer flow.pdf | MISSING | — | 🆕 |
| S75 | Notification – 1 unread | Dashboard flow + transfer flow.pdf | `app/(tabs)/notifications.tsx` | /notifications | ⬜ |
| S76 | Notification – failed + reversed | Dashboard flow + transfer flow.pdf | `app/(tabs)/notifications.tsx` | /notifications | ⬜ |
| S77 | Auto-reversal details | Dashboard flow + transfer flow.pdf | MISSING | — | 🆕 |
| S78 | Reversal receipt | Dashboard flow + transfer flow.pdf | MISSING | — | 🆕 |
| S79 | Select transfers – individual | Dashboard flow + transfer flow.pdf | MISSING | — | 🆕 |
| S80 | Select transfers – group | Dashboard flow + transfer flow.pdf | MISSING | — | 🆕 |
| S81 | Complaints – upload transfers | Dashboard flow + transfer flow.pdf | MISSING | — | 🆕 |
| S82 | Complaints – empty | Dashboard flow + transfer flow.pdf | MISSING | — | 🆕 |
| S83 | Complaints – tracking complaint form | Dashboard flow + transfer flow.pdf | MISSING | — | 🆕 |
| S84 | Chat with GTBOT | Dashboard flow + transfer flow.pdf | MISSING | — | 🆕 |

## 9. Frequent transactions — `Frequent transaction flow.pdf`

Each product has 4 screens: requirements → details form → guarantor details → wait a moment. The existing product screens are all one file, `app/(products)/[id].tsx`.

| # | Screen | Design file | Code file | Web address | Status |
|---|---|---|---|---|---|
| S85 | GT Loans – requirements | Frequent transaction flow.pdf | `app/(products)/[id].tsx` | /loans | ⬜ |
| S86 | GT Loans – details form | Frequent transaction flow.pdf | `app/(products)/[id].tsx` | /loans | ⬜ |
| S87 | GT Loans – guarantor details | Frequent transaction flow.pdf | `app/(products)/[id].tsx` | /loans | ⬜ |
| S88 | GT Loans – wait a moment | Frequent transaction flow.pdf | `app/(products)/[id].tsx` | /loans | ⬜ |
| S89 | GT Pensions (RSA) – requirements | Frequent transaction flow.pdf | `app/(products)/[id].tsx` | /pensions | ⬜ |
| S90 | GT Pensions (RSA) – details form | Frequent transaction flow.pdf | `app/(products)/[id].tsx` | /pensions | ⬜ |
| S91 | GT Pensions (RSA) – guarantor details | Frequent transaction flow.pdf | `app/(products)/[id].tsx` | /pensions | ⬜ |
| S92 | GT Pensions (RSA) – wait a moment | Frequent transaction flow.pdf | `app/(products)/[id].tsx` | /pensions | ⬜ |
| S93 | GT Money Mkt – requirements | Frequent transaction flow.pdf | `app/(products)/[id].tsx` | /money-mkt | ⬜ |
| S94 | GT Money Mkt – details form | Frequent transaction flow.pdf | `app/(products)/[id].tsx` | /money-mkt | ⬜ |
| S95 | GT Money Mkt – guarantor details | Frequent transaction flow.pdf | `app/(products)/[id].tsx` | /money-mkt | ⬜ |
| S96 | GT Money Mkt – wait a moment | Frequent transaction flow.pdf | `app/(products)/[id].tsx` | /money-mkt | ⬜ |
| S97 | GT Dollar Fund – requirements | Frequent transaction flow.pdf | `app/(products)/[id].tsx` | /dollar-fund | ⬜ |
| S98 | GT Dollar Fund – details form | Frequent transaction flow.pdf | `app/(products)/[id].tsx` | /dollar-fund | ⬜ |
| S99 | GT Dollar Fund – guarantor details | Frequent transaction flow.pdf | `app/(products)/[id].tsx` | /dollar-fund | ⬜ |
| S100 | GT Dollar Fund – wait a moment | Frequent transaction flow.pdf | `app/(products)/[id].tsx` | /dollar-fund | ⬜ |
| S101 | Pensions 25% contribution after job loss – requirements | Frequent transaction flow.pdf | MISSING (could reuse `[id].tsx`) | — | 🆕 |
| S102 | Pensions 25% contribution after job loss – details form | Frequent transaction flow.pdf | MISSING | — | 🆕 |
| S103 | Pensions 25% contribution after job loss – guarantor details | Frequent transaction flow.pdf | MISSING | — | 🆕 |
| S104 | Pensions 25% contribution after job loss – wait a moment | Frequent transaction flow.pdf | MISSING | — | 🆕 |
| S105 | Pensions equity contribution for mortgage – requirements | Frequent transaction flow.pdf | MISSING (could reuse `[id].tsx`) | — | 🆕 |
| S106 | Pensions equity contribution for mortgage – details form | Frequent transaction flow.pdf | MISSING | — | 🆕 |
| S107 | Pensions equity contribution for mortgage – guarantor details | Frequent transaction flow.pdf | MISSING | — | 🆕 |
| S108 | Pensions equity contribution for mortgage – wait a moment | Frequent transaction flow.pdf | MISSING | — | 🆕 |

## 10. Settings — `Settings flow.pdf`

| # | Screen | Design file | Code file | Web address | Status |
|---|---|---|---|---|---|
| S109 | Change mPin | Settings flow.pdf | `app/(settings)/change-mpin.tsx` | /change-mpin | ⬜ |
| S110 | Change transaction PIN | Settings flow.pdf | `app/(settings)/change-transaction-pin.tsx` | /change-transaction-pin | ⬜ |
| S111 | Reset transaction PIN | Settings flow.pdf | MISSING | — | 🆕 |
| S112 | Card management – card hidden | Settings flow.pdf | `app/(tabs)/cards.tsx` | /cards | ⬜ |
| S113 | Card management – card shown | Settings flow.pdf | `app/(tabs)/cards.tsx` | /cards | ⬜ |
| S114 | Account settings (list) | Settings flow.pdf | MISSING (the button currently opens "personal info") | — | 🆕 |
| S115 | Biometrics (Face ID / fingerprint toggles) | Settings flow.pdf | MISSING | — | 🆕 |
| S116 | Biometrics – "You're all set!" | Settings flow.pdf | MISSING | — | 🆕 |
| S117 | Log out / delete account | Settings flow.pdf | MISSING (Log Out currently signs out straight away) | — | 🆕 |
| S118 | Get help – popular articles | Settings flow.pdf | `app/(settings)/get-help.tsx` | /get-help | ⬜ |
| S119 | Get help – still need help? | Settings flow.pdf | `app/(settings)/get-help.tsx` | /get-help | ⬜ |
| S120 | Live chat | Settings flow.pdf | `app/(settings)/get-help.tsx` | /get-help | ⬜ |
| S121 | Get help – all popular articles | Settings flow.pdf | `app/(settings)/get-help.tsx` | /get-help | ⬜ |
| S122 | mPin changed – "You're all set!" | Settings flow.pdf | `app/(settings)/change-mpin.tsx` | /change-mpin | ⬜ |
| S123 | Transaction PIN changed – "You're all set!" | Settings flow.pdf | `app/(settings)/change-transaction-pin.tsx` | /change-transaction-pin | ⬜ |
| S124 | Transaction PIN reset – "You're all set!" | Settings flow.pdf | MISSING | — | 🆕 |

## 11. Other

No other design screens. The pop-ups and small pieces are listed under section 1.

---

## Screens in the app but NOT in the design

Owner decided (6.6): restyle all of these to match the rest of the design.

| Code file | What it is | Decision |
|---|---|---|
| `app/(auth)/signup.tsx` | "Create your account" | Restyle to match |
| `app/(auth)/personal-info.tsx` | "Tell us about yourself" (also opened by Settings → Account Settings / Your profile) | Restyle to match |
| `app/(auth)/pin.tsx` | Create a PIN during sign-up | Restyle to match |
| `app/(products)/index.tsx` | "Financial Products" list | Restyle to match |
| `app/(tabs)/report-transaction.tsx` | "Report Transaction" form (similar purpose to the design's Complaints screens) | Restyle to match |
| `app/(tabs)/transfer-flow/income-verification.tsx` | "Income Verification" | Restyle to match |

## Notes

- Screen counts come from measuring the 393 × 852 phone frames in each PDF and match the Figma screenshots flow by flow. The 7 "Enter your 4-digit code" screens (S59–S65) look identical in the screenshots; their exact split is inferred.
- `Default.pdf` and `Default-1.pdf` are the two "Congrats" cards; which one is Tier 1 and which is Loan still needs a quick look.
