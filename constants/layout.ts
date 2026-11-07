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
  // 6-digit code screen. Gaps are measured from the design.
  backArrowSize: 16,     // Thin black back arrow
  backArrowTop: 26,      // Below the status bar → arrow
  backArrowLeft: 1,      // Extra left margin (17 from the screen edge)
  codeTitleGap: 33,      // Arrow → "6- digit code"
  codeTabsGap: 14,       // Title → "from SMS / Tokens" switch
  codeTabsHeight: 46,
  codeTabsPadV: 5,       // Space around the highlighted option inside the switch
  codeTabsPadH: 8,
  codeTabSmsWidth: 177,  // "from SMS" option
  codeTabTokensWidth: 160, // "Tokens" option
  codeTabHeight: 36,
  codeSubtitleGap: 17,   // Switch → "Enter the 6 digit code…"
  codeBoxesGap: 39,      // Text → code boxes
  codeResendGap: 36,     // Code boxes → "Didn't get the code?"
  // Enter password / fingerprint screens. Gaps are measured from the design.
  avatarSize: 80,        // White circle with the person icon
  avatarBorder: 0.8,     // Its thin black outline
  avatarIconSize: 16,
  avatarTop: 36,         // Below the status bar → circle
  passwordLabelGap: 56,  // Circle → grey "Enter password" block
  passwordLabelWidth: 200,
  passwordLabelHeight: 36,
  passwordKeypadGap: 56, // Grey block → keypad
  passwordLinksGap: 62,  // Keypad → bottom links
  passwordLinkLeft: 13,  // "Forget password?" (29 from the screen edge)
  passwordLink2Left: 180, // "Login with Fingerprint" (196 from the screen edge)
  fingerprintPicGap: 92,     // Circle → red fingerprint picture (fingerprint login screen)
  fingerprintHintGap: 1,     // Picture → "Click to log in with Fingerprint"
  fingerprintButtonGap: 23,  // That text → orange button
  fingerprintButtonWidth: 230,
  fingerprintLinksGap: 305,  // Orange button → bottom links
  fingerprintLink2Left: 185, // "Login with Password" (201 from the screen edge)
  // Requirements checklist (forgot password). Gaps are measured from the design.
  reqSubtitleGap: 12,     // Title → grey subtitle
  reqHeadingGap: 34,      // Subtitle → "Requirements"
  reqHeadingLine: 32,     // Line height of the 24px "Requirements"
  reqReadyTop: 8,         // "0/4 ready" sits a little lower than "Requirements"
  reqReadyRight: 18,      // Gap after "0/4 ready" (377 → 359 in the design)
  reqListGap: 16,         // "Requirements" → list box
  reqSubtitleLeft: 1.5,   // The subtitle starts slightly right of the title
  reqRowHeight: 35.6,     // One row in the list box (5 rows + 1px border top and bottom = 180)
  reqRowPadding: 9,       // Text / icon inset inside the box (10 minus the 1px border)
  reqButtonBottom: 101,   // Proceed button → bottom of the screen
  // Reset Password (forgot password). Gaps are measured from the design.
  resetSubtitleGap: 11,   // Title → grey subtitle
  resetBoxGap: 32,        // Subtitle → "Account number" box
  resetBoxWidth: 363,     // The boxes stick out 1 past the normal margin on each side
  resetBoxLeft: -1,
  resetBoxHeight: 48,
  resetBoxBorder: 2,
  resetBoxSpacing: 10,    // Between the two boxes
  resetTextLeft: 7,       // Text inset inside the border (24 from the screen edge)
  resetPhoneShift: -18,   // Flag / +234 / arrow / number reuse the "Hello!" screen positions, moved left by this
  resetProceedGap: 42,    // Phone box → Proceed button
  resetProceedRight: 1,   // The button ends 17 from the screen edge
  // 6-digit code (forgot password). Gaps are measured from the design.
  forgotCodeSubtitleGap: 11,  // Title → grey subtitle
  forgotCodeSubtitleLeft: 1,  // The subtitle starts 17 from the screen edge
  forgotCodeBoxesGap: 31,     // Subtitle → code boxes
  forgotCodeResendGap: 35,    // Code boxes → "Didn't get the code?"
  forgotCodeProceedGap: 65,   // "Didn't get the code?" → Proceed button
  // Identity Verification (camera + face scan). Gaps are measured from the design.
  helpLinkTop: 19,          // Below the status bar → "Need help?" (Poppins)
  helpLinkRight: 8,         // Extra right margin of "Need help?"
  idTitleGap: 36,           // Back arrow → "Identity Verification"
  idTitleLeft: 1,           // Title and most text start 17 from the screen edge
  idSubtitleGap: 17,        // Title → subtitle (camera screen)
  idCameraGap: 39,          // Subtitle → camera picture
  idCameraLeft: -10,        // The picture starts 6 from the screen edge
  idCameraWidth: 381,
  idCameraHeight: 291,
  idConsentGap: 24,         // Camera picture → consent text
  idStartGap: 53,           // Consent text → Start button
  idStartWidth: 102,
  idScanSubtitleGap: 23,    // Title → subtitle (face scan screen)
  idIconsGap: 14,           // Subtitle → recording icon / close X row
  idIconSize: 16,
  idRecordSize: 14,         // Coral "recording" icon
  idRecordLeft: 2,
  idCloseRight: 1,
  idRingGap: 12,            // Icons → dashed ring
  idRingSize: 368,          // Dashed ring, including its thickness
  idRingLeft: -3,
  idRingRadius: 180,
  idRingStroke: 8,
  idRingDash: 47.7,           // 12 dashes with rounded ends around the circle
  idRingGapLength: 46.55,
  idFaceSize: 318,          // Face photo inside the ring
  idBarsGap: 12,            // Ring → progress bars
  idBarsLeft: 50,
  idBarLong: 193,
  idBarShort: 56,
  idBarSpacing: 12,
  idBarHeight: 8,
  idInstructionGap: 11,     // Progress bars → "Don't blink…"
  idNextGap: 13,            // "Don't blink…" → Next button
  idNextWidth: 100,
  // Create New Password (forgot password). No back arrow in the design.
  newPwTitleTop: 56,        // Below the status bar → title
  newPwSubtitleGap: 16.5,   // Title → subtitle
  newPwBoxGap: 33.5,        // Subtitle → "New Password" box (boxes reuse the reset* sizes)
  newPwButtonGap: 48,       // "Confirm Password" box → Reset Password button
  newPwButtonWidth: 187,
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
  codeBoxGap: 16,      // Space between the code boxes
  keypadSidePadding: 12.7, // Number keypad: digit columns centred at 74, 196.5 and 319
  keypadKeyHeight: 89.6,
  keypadDigitOffset: 18.7, // Digits sit a little below the middle of each key in the design
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
