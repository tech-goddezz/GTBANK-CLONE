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

  // "TODAY" / "YESTERDAY" headings on the History screen.
  textDateHeading: '#45464D',

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
  debitCard: '#FF823B',
  balanceCard: '#1E1E21',
  balanceLabel: '#E3E5E6',
  balanceSymbol: '#E6E6E6',
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

  // Green stripes of the small Nigerian flag on the phone number screen.
  flagGreen: '#14B53A',

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

  // The line under the screen header's title, and its small menu icon.
  headerDivider: '#E2E8F0',
  headerMenuIcon: '#757575',

  // Transactions tab cards: background colours, the see-through white text box,
  // and the small arrow.
  cardLoans: '#FBC774',
  cardMoneyMarket: '#F9829E',
  cardDollarFund: '#D0C358',
  cardTextBox: 'rgba(255, 255, 255, 0.45)',
  cardArrow: '#262020',

  // Transfers tab (S36): the step colours (also used in the ring chart), the
  // grey part of the ring chart, and the orange chat button icon.
  stepInitial: '#55C3B1',
  stepSent: '#C35557',
  stepTransit: '#000000',
  stepCredited: '#FF6130',
  chartGrey: '#D9D9D9',
  chatIcon: '#F24822',

  // Settings tab (S37): the faint panel behind the switches, its thin lines,
  // and the "off" switch (grey track, darker outline and knob).
  settingsPanel: 'rgba(248, 246, 246, 0.25)',
  settingsLine: 'rgba(0, 0, 0, 0.08)',
  switchOffTrack: '#E6E0E9',
  switchOffOutline: '#79747E',

  // Send page (S38–S42): grey choice rows and the grey circle of a row that isn't picked.
  sendRow: '#F5F5F5',
  sendCircle: '#979C9E',

  // Light orange outline of the History search box while it's tapped.
  searchFocusBorder: '#FFD6B3',

  // Thin ring around the profile photo on the home screen.
  avatarRing: '#E8E8E8',

  // Dashed ring around the fingerprint on the 4-digit code screen (S59–S65).
  fingerprintRing: '#F77963',

  // The "Copy" link on the Congrats pop-up.
  copyLink: '#9A2E02',

  // The 6-digit code boxes: thin outline, and the grey fill of the active box.
  codeBoxBorder: 'rgba(0, 0, 0, 0.25)',
  codeBoxActive: '#D9D9D9',
  // Face scan screen (Identity Verification): the coral "recording" icon,
  // the dark red dashed ring around the face, and the two progress bars.
  recordIcon: '#FF7866',
  scanRing: '#880606',
  scanProgress: '#FF9D3A',
  scanProgressRest: '#CC6600',
  // Light grey outline of the white input boxes ("Account number" on Reset Password).
  inputOutline: '#D9D9D9',
  // The design says pure black, but it sits half a pixel off-grid so on screen it
  // shows as a softer grey. The owner chose to match that look (2026-11-07).
  codeBoxActiveBorder: 'rgba(0, 0, 0, 0.5)',

  // "Password Updated!" tick picture: grey disc, dark tick, and three rings (inner → outer).
  successDisc: '#D9DCE3',
  successTick: '#626672',
  successRingInner: '#C1C6D4',
  successRingMiddle: '#C8CBD4',
  successRingOuter: '#EEF0F8',
  tierCard: '#F9F4F4',        // "GTBank Tier 1" card on the Wait a moment screen

  // The highlighted option in the "from SMS / Tokens" switch.
  segmentActive: '#F5F5F5',

  // Onboarding page dots: the current slide and the others.
  // (Slide 1 in the design uses a lighter #FF9D3A; the owner chose to use
  // slides 2–5's deeper orange on every slide for consistency.)
  dotActive: '#F58220',
  dotInactive: '#E3E5E6',

  // Digits on the number keypad (measured from the design's keypad picture).
  keypadDigit: '#292731',

  // "Cancel" and "OK" in the date pickers.
  datePickerAction: '#FB551F',

  // ── Bare utilities ─────────────────────────────────────────────
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

} as const;
// "as const" just tells TypeScript: treat these as fixed values, not editable strings.
// It gives us autocomplete and prevents accidental typos when we use colors.orange etc.

export default colors;
