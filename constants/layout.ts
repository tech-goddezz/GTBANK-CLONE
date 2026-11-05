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
  onboardingArtHeight: 403,// The floating cubes picture
  transactionRowHeight: 72,
  optionRowHeight: 56,   // One choice in the "Select action" pop-up
  radioSize: 26,         // Round choice button, including its 1px outline
  cancelAreaHeight: 80,  // "Cancel" strip at the bottom of the "Select action" pop-up
  dividerWidth: 375,     // Thin line above "Cancel"
  homeBarSpace: 34,      // Space the design leaves for the phone's own swipe-up bar
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
};
