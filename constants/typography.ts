// constants/typography.ts
//
// Font sizes, weights, and family names — all from the GTCO Figma design.
// Keeping these in one file means every screen uses the same text scale.
// No random 17px or 13px showing up because someone guessed.

export const fontSize = {
  display: 32,    // Onboarding headlines — "GT World All fresh and clean"
  skip: 22,       // The orange "Skip" link on the onboarding slides
  needHelp: 23,   // The orange "Need help?" link on the sign-in screens
  keypad: 32,     // Digits on the number keypad
  heading1: 28,   // Big screen titles — "Hello!", "History"
  heading2: 24,   // Section headings — "Identity Verification", "Wait a moment"
  heading3: 18,   // Sub-headings — card titles, modal titles
  large: 16,      // Prominent body text — button labels, important values
  body: 14,       // Default text — descriptions, list items
  small: 12,      // Supporting text — timestamps, category labels
  tiny: 10,       // The smallest text in the app — fine print
};

// Distance between lines of text, measured from multi-line text in the design.
export const lineHeight = {
  display: 36,    // 32px text
  skip: 26,       // 22px "Skip" link
  needHelp: 28,   // 23px "Need help?" link
  compact: 16,    // Tightly spaced 12–14px text, e.g. the sign-in subtitle and small print
  paragraph: 17,  // 14px multi-line paragraphs, e.g. the Reset Password subtitle
  phoneRow: 20,   // 16px "+234" / "Mobile number" row
  heading1: 34,   // 28px text
  heading2: 29,   // 24px text, e.g. "Identity Verification"
  body: 18,       // 14px text
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
  // Closest match to the handwriting font on the design's date pickers
  handwriting: 'KaushanScript_400Regular',
  // The rounder font on some headings, e.g. "Requirements" and "0/4 ready"
  poppinsRegular: 'Poppins_400Regular',
  poppinsMedium: 'Poppins_500Medium',
};



// Corner rounding now lives in constants/layout.ts. It's re-exported here
// so screens that already import it from this file keep working.
export { radius } from './layout';

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