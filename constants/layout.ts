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
  // KYC "Open a GTBank Account" (S21): same as above but a wider button.
  kycButtonWidth: 160,    // "Get Account" button width
  kycButtonRight: 12,     // Extra gap on its right (28 from the edge instead of 16)
  kycButtonBottom: 102,   // "Get Account" button → bottom of the screen
  // KYC "Your date of birth" (S22). Title uses idTitleGap like Identity Verification.
  dobSubtitleGap: 18,     // Title → grey subtitle
  dobBoxGap: 21.5,        // Subtitle → date box
  dobBoxWidth: 362,       // Thin black outline sits half a pixel outside the 361 box
  dobBoxHeight: 47,
  dobBoxLeft: -0.5,
  dobBoxBorder: 0.5,
  dobTextLeft: 7.5,       // "Date of birth" starts 24 from the screen edge
  dobIconRight: 8,        // Calendar icon inset from the box's right edge
  dobButtonRight: 1,      // Proceed ends 17 from the screen edge
  dobButtonBottom: 105,   // Proceed → bottom of the screen
  // KYC "Your verification number" (S24/S25). The BVN/NIN switch reuses the codeTabs* sizes.
  vnTitleGap: 21,         // Back arrow → title
  vnTabsGap: 2,           // Title → BVN/NIN switch
  vnSubtitleGap: 26,      // Switch → grey subtitle
  vnBoxGap: 22,           // Subtitle → grey number box
  vnBoxPadding: 16,       // Placeholder / number inset inside the box
  vnHintGap: 17.5,        // Box → "Dial *565*0#…" help text
  vnButtonBottom: 116,    // Proceed → bottom of the screen
  // KYC "Provide Address" (S26). Title uses idTitleGap like "Your date of birth".
  addrSubtitleGap: 29,    // Title → grey subtitle
  addrBoxGap: 21,         // Subtitle → "State" box
  addrBoxSpacing: 16,     // Between the grey boxes
  addrTextLeft: 10,       // Text inset inside each box
  addrIconRight: 12,      // Small "v" arrow inset from the box's right edge
  addrIconSize: 12,
  addrButtonRight: 1,     // Proceed ends 17 from the screen edge
  addrButtonBottom: 116,  // Proceed → bottom of the screen
  // KYC "Wait a moment" (S29). Picture and title reuse the success* values.
  waitSubtitleGap: 7,     // Title → subtitle
  waitCardGap: 41,        // Subtitle → tier card
  waitCardLeft: -4.5,     // The card starts 11.5 from the screen edge
  waitCardWidth: 370,
  waitCardHeight: 68,
  waitCardPadLeft: 16,    // "GTBank Tier 1" starts 27.5 from the screen edge
  waitCardPadRight: 8,    // Grey picture box → card edge
  waitChevronGap: 10,     // "show details" → small "v" arrow
  waitChevronSize: 12,
  waitBoxWidth: 78,
  waitBoxHeight: 60,
  waitBoxRadiusLeft: 6,
  waitCubeLeft: 6,        // Cube picture inset inside the grey box
  waitCubeWidth: 66,
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
  // Password Updated! (forgot password). The tick picture is cut off at the top
  // (just below the status bar) and on the left edge.
  successPicTop: 56,         // From the top of the screen
  successPicWidth: 207,
  successPicHeight: 216,
  successTitleTop: 335,      // From the top of the screen to the title
  successSubtitleGap: 16,    // Title → subtitle
  successButtonBottom: 106,  // Sign In button → bottom of the screen
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
  balanceCardTop: 16,       // Menu strip → balance card
  balanceLabelGap: 10,      // "Total Balance" → the amount
  // Home screen (S32). Tops are measured from just below the status bar.
  homeHeaderHeight: 77,     // White strip with the photo, name and bell
  homeAvatarRing: 50,       // Photo (48) plus its 1px ring
  homeAvatarLeft: 44.5,
  homeAvatarTop: 13,
  homeNameLeft: 101.5,      // "Hi," / name
  homeGreetingTop: 13.6,
  homeNameTop: 33.2,
  homeBellRight: 47.3,
  homeBellTop: 30.8,
  homeDividerLeft: 25.5,    // The line under the name
  homeDividerWidth: 342,
  homeDividerTop: 70,
  homeDividerHeight: 2,
  homeMenuLeft: 18.3,
  homeHistoryRight: 18,
  homeHistoryTop: 10.1,     // From the top of the menu strip
  homeActionsTop: 32,       // Balance card → Send / Pay circles
  homeActionsSidePadding: 3.67, // Circles centred at 52, 148.7, 245.3 and 342
  homeActionCircle: 52,
  homeActionLabelGap: 9.3,  // Circle → label
  homeRecentTop: 48.5,      // Labels → "Recent Transactions"
  homeListTop: 19.2,        // "Recent Transactions" → first card
  homeListGap: 8,           // Between transaction cards
  // History screen (S33)
  historySearchTop: 22,     // Menu strip → search box
  historySideMargin: 17,
  historySearchHeight: 42,
  historySearchGap: 16,     // Search box → filter circle
  historySearchIconLeft: 13.5, // Plus the box's 1px outline = 14.5
  historySearchTextGap: 12.5, // Magnifying glass → "Search"
  historyFirstHeadingTop: 37.3, // Search box → "TODAY"
  historyHeadingTop: 33.3,  // Last card of a day → next day's heading
  historyHeadingLeft: 21,
  historyHeadingGap: 13.7,  // Heading → first card
  historyNameGap: 8.6,      // Name line → "Subscription • 10:24 AM" line
  // Transactions tab (S35)
  productPanelTop: 8,       // Menu strip → white panel
  productPanelSide: 18,     // Screen edge → white panel
  productPanelPadding: 8,   // White panel edge → cards, and between cards
  productCardHeight: 269,
  productBoxInset: 13,      // Card edge → see-through text box (left and right)
  productBoxBottom: 8.5,    // Text box → bottom of the card
  productBoxPaddingTop: 7.1,
  productBoxPaddingBottom: 7.8,
  productBoxPaddingLeft: 6,
  productBoxPaddingRight: 7,
  productTitleGap: 3.4,     // Title → description
  productArrowGap: 3,       // Text → arrow
  // Transfers tab (S36). Gaps are between the bottom of one thing and the top of the next.
  trackSide: 18,            // Screen edge → text
  trackIntroTop: 16.4,      // Menu strip → "Be able to know..."
  trackBannerTop: 24.6,     // Intro → steps banner picture
  trackBannerLeft: 40.5,
  trackBannerWidth: 312,
  trackBannerHeight: 36.3,
  trackParagraphTop: 23.9,  // Banner → "Track your daily transfers..."
  trackStripTop: 24.1,      // Paragraph → white steps strip
  trackStripSide: 16,
  trackStripHeight: 65.4,
  trackStepLabelTop: 15.4,  // Strip top → step names
  trackStepCircleGap: 6.6,  // Step name → coloured circle
  trackStepCircle: 24,
  trackStepCentres: [50.6, 131, 212.4, 301.6], // Middle of each step, from the strip's left edge
  trackStepWidth: 80,
  trackRobotWidth: 16,
  trackRobotHeight: 16.4,
  trackNoteTop: 14.2,       // Strip → "NB: ..."
  trackNoteLeft: 16,
  trackMiddleHeight: 141,   // Area holding the ring chart and the two round buttons
  trackChartLeft: 21,
  trackChartTop: 34.1,
  trackButtonLeft: 319,
  trackButtonTop: 10.1,
  trackButtonSize: 56,
  trackButtonGap: 8,
  trackQueryTop: 17.1,      // "Having issues..." → Query Transfer button
  trackQuerySide: 15,
  trackQueryHeight: 48,
  // Settings tab (S37)
  settingsListTop: 36,      // Menu strip → first row
  settingsRowSide: 26,
  settingsRowHeight: 46,
  settingsRowGap: 8,
  settingsIconLeft: 8,
  settingsIcon: 16,
  settingsLabelGap: 8,      // Icon → label
  settingsArrowRight: 9.9,
  settingsPanelTop: 26,     // Last row → switch panel
  settingsPanelSide: 18,
  settingsPanelPadding: 8,  // Panel edge → label / switch
  settingsSwitchFirstTop: 9, // Panel top → first switch
  settingsSwitchTop: 23,    // Line → next switch
  settingsSwitchLineGap: 7, // Switch → line under it
  settingsLine: 2,
  switchWidth: 52,
  switchHeight: 32,
  switchKnobOn: 24,
  switchKnobOff: 16,
  switchOutline: 2,
  // Send page (S38–S42): the five choice rows
  sendListTop: 105,         // Menu strip → first row
  sendRowSide: 16,
  sendRowHeight: 56,
  sendRowGap: 8,
  sendCircleLeft: 11.5,     // Row edge → round icon
  sendCircle: 40,
  sendIcon: 16,
  sendLabelGap: 8,          // Round icon → label
  // Pay page (S43): the bill rows (same side gap and shadow as the Send rows)
  payListTop: 32,           // Menu strip → first row
  payRowHeight: 46,
  payRowGap: 8,
  payLabelLeft: 35.5,       // Row edge → bill name
  payFormTop: 24,           // Last row → amount box (not in the design)
  payFormGap: 16,           // Amount box → Pay button
  moreLabelLineHeight: 24,  // More page (S46): line spacing when a name wraps (ATM row)
  // Send forms (S47–S51): label above each grey box
  formTop: 29.5,            // Menu strip → first label
  formLabelLineHeight: 24,
  formLabelGap: 7.5,        // Label → box
  formFieldGap: 16,         // Box → next label
  formTextInset: 17.5,      // Text inside a box
  formNameTop: 18.5,        // Destination box → account name
  formNameBottom: 27.5,     // Account name → next label
  formButtonTop: 24,        // Last box → Proceed
  // Top Up page (S44/S45): AIRTIME | DATA switch, note, boxes, Proceed
  topupTabsTop: 24,         // Menu strip → switch
  topupTabsWidth: 362,
  topupTabsHeight: 52,
  topupTabsPad: 8,          // Switch edge → highlighted option
  topupTabAirtimeWidth: 178,
  topupTabDataWidth: 160,
  topupNoteTop: 20,         // Switch → "Top Up your account..."
  topupBoxesTop: 41,        // Note → first box
  topupBoxGap: 16,          // Between boxes, and last box → Proceed
  topupBoxPadding: 16,      // Hint text inset inside a box
  topupChevron: 9,
  topupChevronRight: 18,
  // Data plans grid (S53)
  planGridTop: 19,          // Note → grey panel
  planGridPadding: 8,       // Panel edge → first plan
  planGridPaddingRight: 5,  // Last column → panel edge
  planTextWidth: 66,        // Plan names may run a little past their 60px square, as in the design
  planCellWidth: 60,
  planCellHeight: 50,
  planColumnGap: 12,
  planRowGap: 8,
  planLineHeight: 11.5,
  planButtonTop: 25,        // Panel → Proceed
  // Initiating Transfer (S54–S58)
  confirmLabelTop: 20.5,    // Menu strip → "From:"
  confirmSmallLabelLineHeight: 16,
  confirmLabelGap: 15.5,    // Small label → its box
  confirmSectionGap: 8.5,   // Box / panel → next small label
  confirmBoxWidth: 362,
  confirmBoxPadding: 8,     // Box edge → round icon
  confirmPersonIcon: 17,    // Person icon in the To box
  confirmTextGap: 8,        // Round icon → name
  confirmBalanceRight: 10,
  confirmNameLineHeight: 19,
  confirmSubLineHeight: 17,
  confirmPanelSide: 18,     // Lower section (details, narration, button) side margin
  confirmPanelTop: 3.5,     // "Transfer details:" → white panel
  confirmPanelPadTop: 7,
  confirmPanelPadBottom: 17,
  confirmRowHeight: 54,
  confirmRowLineInset: 24,  // Panel edge → faint line
  confirmRowTextInset: 8,   // Line end → label / figure
  confirmRowTextBottom: 12.5, // Text → line under it
  confirmRowLine: 2,
  confirmButtonTop: 12,     // Narration box → Confirm Transfer
  // Funds Sent (S67)
  fundsCircleTop: 15,       // Menu strip → green circle
  fundsCircle: 64,          // Green circle
  fundsTick: 48,            // 3D tick picture inside the circle
  fundsPanelTop: 8,         // Green circle → white panel
  fundsPanelSide: 17.5,     // Screen edge → white panel
  fundsPanelPadTop: 1,
  fundsPanelPadBottom: 15,
  fundsRowHeight: 62,       // One row, including its faint line
  fundsLabelBottomTwoLine: 13.5, // "To:" / "From:" → line under it
  fundsValueDrop: -10,      // Two-line figures sit lower than the label
  fundsFromDrop: -11.3,
  fundsFromLineHeight: 21,
  fundsNoteTop: 8,          // White panel → blue note
  fundsNoteIconLeft: 17.5,  // Note edge → "!" icon
  fundsNoteIcon: 13,
  fundsNoteTextGap: 11.5,   // "!" icon → note text
  fundsButtonTop: 8,        // Blue note → Done
  // In Transit via NIBSS (S68)
  transitIntroTop: 24.5,    // Menu strip → "Your transfer is being processed..."
  transitIntroLeft: 2,      // Intro text sits 2px further in than the screen margin
  transitHelpTop: 22,       // Intro → "Need help?"
  transitHelpRight: 5.5,    // "Need help?" sits a little in from the right margin
  transitHelpSize: 23,
  transitHelpLineHeight: 28,
  transitPanelTop: 47.5,    // "Need help?" → steps panel
  transitPanelPadTop: 23,
  transitPanelPadBottom: 21,
  transitPanelSide: 32,     // Panel edge → step circles / end of the faint lines
  transitStepGap: 28,       // One step → the next
  transitStepTextHeight: 34, // Two lines of step text, faint line at the bottom
  transitStepLineHeight: 17,
  transitDot: 20,
  transitDotTop: 6,         // Step text top → its circle
  transitDotTick: 16,       // 3D tick inside the orange circle
  transitDotInner: 6,       // Small white dot inside the purple / grey circle
  transitDotInnerOffset: 3, // Purple circle: white dot sits near the top-left
  transitDotTextGap: 8,     // Circle → step text
  transitConnectorTop: 29,  // Step text top → thin orange line
  transitConnectorHeight: 34,
  transitConnectorWidth: 0.5,
  transitNoteTop: 88,       // Steps panel → blue note
  transitNoteHeight: 40,
  transitButtonTop: 26,     // Blue note → Proceed
  transitButtonWidth: 128,
  // Credited to Recipient (S69)
  creditedPanelTop: 25,     // Menu strip → white panel
  creditedNoteTop: 16,      // White panel → blue note
  creditedButtonTop: 16,    // Blue note → Done
  creditedReceiptTop: 14,   // Done → View Receipt (its border sits 1px outside)
  creditedReceiptHeight: 48,
  // Receipts (S70)
  receiptPanelTop: 26,      // Menu strip → grey panel
  receiptShareTop: 55,      // Grey panel → Share button
  receiptShareIcon: 16,
  receiptShareIconLeft: 32.3, // Button edge → share icon
  receiptShareTextShift: 23,  // "Share" sits a little right of centre, as in the design
  // Transfer Tracking – Still checking (S71)
  checkCircleTop: 24,       // Menu strip → orange circle
  checkCircle: 40,
  checkStopSquare: 16,      // White square inside the orange circle
  checkTitleTop: 10,        // Orange circle → "Still Checking ...."
  checkTitleLineHeight: 20,
  checkGap: 24,             // Space between most of the lines of text
  checkTimerTop: 26.3,      // "5 minutes" → "0:00"
  checkNoteIconLeft: 28.6,  // Note edge → "i" icon
  checkHelpTop: 119.4,      // "0:00" → "Need help?"
  checkHelpRight: 9.5,      // "Need help?" sits a little in from the right margin
  // Transfer failed (S72), same page
  failedBoxTop: 43,         // Menu strip → red warning box
  failedBoxHeight: 64,
  failedBoxIconLeft: 17.6,  // Box edge → "!" icon
  failedTextLineHeight: 24,
  failedCardTop: 25.8,      // "0:00" → white "money is safe" card
  failedCardHeight: 56,
  failedCardPad: 16,        // Card edge → orange circle
  failedCardTextGap: 8,     // Orange circle → card text
  failedBankIcon: 16,
  failedHelpTop: 108.6,     // White card → "Need help?"
  failedHelpRight: 6.5,
  // Query – Querying NIBSS (S73)
  queryTitleTop: 35.2,      // Menu strip → "Querying NIBSS.."
  queryIntroTop: 25.7,      // Title → "Generating your status..."
  queryIntroLeft: 21,       // Intro text sits further in than the screen margin
  queryPanelTop: 28.1,      // Intro → steps panel
  queryNoteTop: 55,         // Steps panel → blue note
  // Enter your 4 digit code (S59–S65)
  payPinTitleTop: 86.8,     // Status bar → title
  payPinBoxTop: 114,        // Subtitle → code box
  payPinButtonTop: 16,      // Code box → Pay
  payPinNoteTop: 52,        // Pay → "Or use your fingerprint..."
  payPinNoteGap: 10,        // Between the two grey lines
  payPinLinkTop: 22.3,      // Grey lines → "Pay with Fingerprint instead"
  payPinLinkLineHeight: 24,
  payPinRingTop: 29.3,      // Link → dashed ring
  payPinRing: 120,          // Dashed ring size
  payPinRingRadius: 58.5,
  payPinRingStroke: 2.5,
  payPinRingDash: 24,
  payPinRingGap: 21.95,
  payPinPicture: 122.7,     // Fingerprint picture, centred on the ring
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
  balanceCard: 0,  // Square corners in the design
  searchBox: 4,    // History search box
  productTextBox: 7, // See-through text box on the Transactions tab cards
  trackButton: 16,   // Robot and chat buttons on the Transfers tab
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
