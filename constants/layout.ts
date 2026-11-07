// constants/layout.ts
//
// Screen margins, standard heights and corner rounding from the design.
// Measured from the design PDFs (phone frame 393 x 852).

export const layout = {
  screenWidth: 393,
  screenPadding: 16,   // Left and right margin on almost every screen
  contentWidth: 361,   // 393 - 16 - 16
  buttonHeight: 46,    // Orange Proceed / Next / Done button
  buttonHeightLarge: 56, // "Apply Filters" button
  buttonHeightSmall: 32, // "Authenticating fingerprint" button
  inputHeight: 46,     // Grey input box (a few taller ones are 56)
  congratsHeight: 563,
  infoBannerHeight: 40,
  infoBannerHeightTall: 46, // The centred version with no icon
  statusBarHeight: 52, // Space the design leaves for the phone's clock and battery
  headerHeight: 65,    // Screen header: the strip with the title
  headerMenuHeight: 48, // Screen header: the strip with the small menu icon
  splashLogoSize: 155, // GTCO logo in the middle of the splash screen
  onboardingArtHeight: 403,// The floating cubes picture
  onboardingArtTop: 118,   // Space above the cubes picture
  onboardingTitleGap: 9,   // Picture → title
  onboardingControlsGap: 29, // Title → "Next" button; also button top → dots
  onboardingNextWidth: 139.5, // Grey "Next" button
  onboardingDotWidth: 10,
  onboardingDotActiveWidth: 27,
  onboardingDotHeight: 8,
  onboardingDotGap: 8,
  skipTop: 75,             // "Skip" link: distance from the top of the screen
  skipRight: 28,           // ...and from the right edge
  // Phone number screen ("Hello!"). Gaps are measured from the design.
  needHelpTop: 18,       // Below the status bar → "Need help?"
  needHelpRight: 13,     // Extra right margin of "Need help?" (29 from the screen edge)
  phoneTitleGap: 10,     // "Need help?" → "Hello!"
  phoneSubtitleGap: 8,   // "Hello!" → subtitle
  phoneRowGap: 36,       // Subtitle → "+234" row
  phoneDisclaimerGap: 37, // "+234" row → small print
  phoneProceedGap: 119,  // Small print → "Proceed" button
  phoneProceedWidth: 128,
  flagLeft: 25,          // Nigerian flag, from the left margin
  flagStripeWidth: 6,
  flagHeight: 13,
  flagTop: 3.5,
  dialCodeLeft: 51,      // "+234"
  dialChevronLeft: 103,  // Small down arrow after "+234"
  dialChevronTop: 7,
  dialChevronWidth: 10,
  dialChevronHeight: 6,
  mobileInputLeft: 148,  // "Mobile number"
  transactionRowHeight: 72,
  optionRowHeight: 56,   // One choice in the "Select action" pop-up
  radioSize: 26,         // Round choice button, including its 1px outline
  cancelAreaHeight: 80,  // "Cancel" strip at the bottom of the "Select action" pop-up
  dividerWidth: 375,     // Thin line above "Cancel"
  homeBarSpace: 34,      // Space the design leaves for the phone's own swipe-up bar
  filterPillHeight: 38,  // Choice buttons in the Filter Transactions pop-up
  filterPillWidthNarrow: 105.67, // The Credit / Debit pills (the 3-in-a-row pills share the width)
  filterPillGap: 10,
  filterSidePadding: 19, // Left edge of the pills
  iconSize: 24,          // Standard icon box, e.g. the close X
  fingerprintSize: 100,  // Red fingerprint picture on the fingerprint pop-up
  fingerprintCancelWidth: 117, // Grey "Cancel" button on the fingerprint pop-up
  fingerprintTextBox: 36, // Height of each line of text on the fingerprint pop-up
  debitCardWidth: 350,
  debitCardHeight: 181,
  balanceCardHeight: 130,
  balanceCardSideMargin: 18,
  tabBarHeight: 110,  // Bottom tab bar, including the space at the bottom of the phone
  tabBarSidePadding: 8.5,
  codeBoxSize: 46.4,   // The 6-digit code boxes
  keypadSidePadding: 18.5, // Number keypad: 356 wide on a 393 screen
  keypadKeyHeight: 89,
};

// Border radius values from the design. Consistent rounding across the whole app.
export const radius = {
  none: 0,
  card: 8,       // White cards
  row: 16,       // Transaction / list rows
  codeBox: 8,    // The 6-digit code boxes
  balanceCard: 18,
  button: 0,     // Buttons have square corners in the design
  buttonLarge: 8, // Except the large "Apply Filters" button
  buttonTrans: 20,
  input: 0,      // Input boxes have square corners in the design
  congrats: 32,  // Top corners of the Congrats pop-up
  congratsCubesLeft: 6,  // Grey cubes picture on the Congrats pop-up: left corners
  congratsCubesRight: 8, // ...and right corners
  debitCard: 16,
  sheet: 16,    // Top corners of pop-up sheets and the type-the-date picker
  datePicker: 32, // Top corners of the calendar date picker
  dayCell: 18.9, // The selected day in the date picker
  pill: 999,     // Badges, avatar circles — fully round
  filterPill: 9, // Choice buttons in the Filter Transactions pop-up
};
