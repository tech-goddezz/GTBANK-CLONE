// constants/colors.ts
//
// Every color the app uses lives here. This way, if GTCO ever
// tweaks their brand orange, you change it in one place and
// the whole app updates — not hunting through 40 files.

const colors = {

  // The main GTCO orange. Used on buttons, links, active tab icons —
  // basically anything the user needs to tap or pay attention to.
  orange: '#E85D24',

  // A slightly darker orange for when a button is being pressed.
  // That small color shift gives the user physical feedback — it "feels" tappable.
  orangePressed: '#C44D1A',

  // A very pale orange wash. Good for info banners and subtle highlight areas.
  orangeFaint: '#FFF0EA',

  // ── Text colors ────────────────────────────────────────────────

  // Near-black. Used for headings and body text — easier on the eyes than pure black.
  textDark: '#1A1A1A',

  // Medium grey. For subtitles, labels, and anything that supports the main text.
  textGrey: '#6B6B6B',

  // Light grey. Placeholders and disabled text — present but not demanding attention.
  textFaded: '#9CA3AF',

  // Pure white text. Used when text sits on top of the orange background.
  textWhite: '#FFFFFF',

  // ── Page and surface backgrounds ───────────────────────────────

  // The light grey behind everything. Makes white cards look elevated and clean.
  pageBackground: '#F5F5F5',

  background: '#F5F6FA',

  // White. Used on cards, modals, and input fields.
  cardBackground: '#FFFFFF',

  // The dark charcoal card on the home screen that shows the balance.
  // Sampled directly from the Figma export: flat #444444, no gradient.
  darkCard: '#444444',

  lightest: '#F7F9FA',

  lighter: '#F2F4F5',

  light: '#E3E5E5',

  base: '#CDCFD0',

  dark: '#979C9E',



  // Neutral light-grey circle background used behind the Send/Pay/Top up/More
  // icons on the home screen. Design does NOT tint these orange.
  iconGrey: '#F2F2F2',

  // Slightly off-white for input fields — subtle separation from a white card.
  inputBackground: '#F9F9F9',

  // ── Status colors ──────────────────────────────────────────────

  pink: '#F4B4C8',

  
  pinkFaint: '#FDF0F4',

  // Green for successful transactions and completed states.
  green: '#22C55E',
  greenFaint: '#DCFCE7',

  // Red for failed transactions and error messages.
  red: '#EF4444',
  redFaint: '#FEE2E2',

  // Amber for pending / in-transit states.
  amber: '#F59E0B',
  amberFaint: '#FEF3C7',

  // ── Borders ────────────────────────────────────────────────────

  // A light grey line. Used between list items, around cards, around inputs.
  borderLight: '#E5E7EB',

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