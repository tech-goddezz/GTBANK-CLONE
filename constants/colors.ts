// constants/colors.ts
//
// Every color the app uses lives here. This way, if GTCO ever
// tweaks their brand orange, you change it in one place and
// the whole app updates — not hunting through 40 files.
//
// Values are measured from the design PDFs in design/.

const colors = {

  // The main GTCO orange. Used on buttons, links ("Need help?", "Forget password?"),
  // and orange icons — anything the user needs to tap or pay attention to.
  orange: '#FF6130',

  // Darker orange used on the active bottom-tab label/icon and "See All".
  orangeDark: '#D96A0B',

  // The orange inside the GTCO logo and onboarding artwork.
  orangeLogo: '#F58220',

  // A slightly darker orange for when a button is being pressed.
  // That small color shift gives the user physical feedback — it "feels" tappable.
  orangePressed: '#C44D1A',

  // A very pale orange wash. Good for info banners and subtle highlight areas.
  orangeFaint: '#FFF0EA',

  // ── Text colors ────────────────────────────────────────────────

  // Near-black. Dark text: status-bar time, phone numbers, amounts, input text.
  // (Big screen titles like "Hello!" use pure black — colors.black.)
  textDark: '#090A0A',

  // Dark grey for "Enter password" and list item titles.
  textLightDark: '#303437',

  // Transaction names.
  textCharcoal: '#333333',

  // Account detail values (account name / number on transfer screens).
  textNearBlack: '#222222',

  // The balance amount on the home screen.
  textBalance: '#202325',

  // Labels in the Filter Transactions sheet.
  textLabel: '#404446',

  // Send / Pay / Top up / More labels on the home screen.
  textNavy: '#060F27',

  // Get Help article titles and article text.
  textHelpTitle: '#0B1C30',
  textHelpBody: '#76777D',

  // Medium grey. The most common body text: subtitles, descriptions, labels.
  textGrey: '#72777A',

  // Light grey. Inactive tab labels, secondary links ("Login with Fingerprint").
  textFaded: '#979C9E',

  // Placeholder text inside search boxes.
  textPlaceholder: '#6C7072',

  // Pure white text. Used when text sits on top of the orange background.
  textWhite: '#FFFFFF',

  // ── Page and surface backgrounds ───────────────────────────────

  // Light grey used for input boxes and some screen backgrounds.
  pageBackground: '#F5F5F5',

  // Off-white background of the home/dashboard screens and transaction rows.
  background: '#FAFAFA',

  // White. Used on cards, modals, and most screen backgrounds.
  cardBackground: '#FFFFFF',

  // The dark charcoal card on the home screen that shows the balance.
  darkCard: '#444444',
  darkNavy: '#003057',
  navyDark: '#0a1628',
  navyCard: '#0d1f3c',
  brandGold: '#EEB211',

  lightest: '#F7F9FA',

  lighter: '#F2F4F5',

  light: '#E3E5E5',

  base: '#CDCFD0',

  dark: '#979C9E',

  // Neutral light-grey circle background used behind the Send/Pay/Top up/More
  // icons on the home screen. Design does NOT tint these orange.
  iconGrey: '#F2F2F2',

  // Grey input boxes — same grey as pageBackground in the design.
  inputBackground: '#F5F5F5',

  // Blue info banner ("Recipient will be credited shortly") and its accent.
  infoBlueFaint: '#EBF0FD',
  infoBlue: '#5484FF',

  // The "Unread" label on notifications.
  unreadBlue: '#0C349A',

  // Dimmed see-through layer behind pop-ups and bottom sheets.
  overlay: 'rgba(9, 10, 10, 0.4)',

  // ── Status colors ──────────────────────────────────────────────

  pink: '#F4B4C8',

  pinkFaint: '#FDF0F4',

  // Green for successful transactions and completed states.
  green: '#0DBF66',
  greenFaint: '#DCFCE7',

  // Green tick icons on the sign-in / KYC / forgot-password screens.
  greenTick: '#14B53A',

  // Red for failed transactions, money-out amounts and error messages.
  red: '#CC1800',
  redFaint: '#FEE2E2',

  // Brighter red for "Log Out", darker red for "Transfer failed".
  redBright: '#E50F0F',
  redDark: '#93000A',

  // Amber for pending / in-transit states.
  amber: '#FF8F00',
  amberFaint: '#FEF3C7',

  // ── Borders ────────────────────────────────────────────────────

  // A light grey line. Used between list items, around cards, around inputs.
  // The design draws these as #E2E8F0 at 60% see-through.
  borderLight: 'rgba(226, 232, 240, 0.6)',

  // Orange border — appears on an input field when the user taps into it.
  borderActive: '#E85D24',

  // ── Bare utilities ─────────────────────────────────────────────
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

} as const;
// "as const" just tells TypeScript: treat these as fixed values, not editable strings.
// It gives us autocomplete and prevents accidental typos when we use colors.orange etc.

export default colors;
