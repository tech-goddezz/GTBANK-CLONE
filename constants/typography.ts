// constants/typography.ts
//
// Font sizes, weights, and family names — all from the GTCO Figma design.
// Keeping these in one file means every screen uses the same text scale.
// No random 17px or 13px showing up because someone guessed.

export const fontSize = {
  heading1: 28,   // Big screen titles — "Hello!", "History"
  heading2: 22,   // Section headings — "Open a GTBank Account"
  heading3: 18,   // Sub-headings — card titles, modal titles
  large: 16,      // Prominent body text — button labels, important values
  body: 14,       // Default text — descriptions, list items
  small: 12,      // Supporting text — timestamps, category labels
  tiny: 10,       // The smallest text in the app — fine print
};

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// These match the exact font names that Expo Google Fonts loads.
// If you type a wrong name here, the font silently falls back to system default —
// so keep these exactly as written.
export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};



// Border radius values from the design. Consistent rounding across the whole app.
export const radius = {
  card: 6,     // All cards and large containers
  balanceCard: 18,
  button: 4,   // Buttons and input fields
  buttonTrans: 20,
  input: 3,
  pill: 999,    // Badges, avatar circles — fully round
};

// Spacing scale. Use these instead of writing random numbers like marginTop: 17.
// Everything snaps to this grid, which keeps the layout feeling intentional.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  large: 100,
  bottom: 370,
};