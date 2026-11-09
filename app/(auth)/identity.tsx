// app/(auth)/identity.tsx
// KYC identity verification (S27 camera / S28 face scan in Kyc flow.pdf).
// SIMULATED — no real camera yet (that needs expo-camera + permissions).
// Same look as the approved forgot-password identity screens. "Next" marks
// identity as done and returns to the requirements checklist.

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import colors from '../../constants/colors';
import { fontSize, fontFamily, lineHeight, spacing } from '../../constants/typography';
import { layout } from '../../constants/layout';
import Button from '../../components/Button';
import { useKycStore } from '../../store/useKycStore';
import { useAuthStore } from '../../store/useAuthStore';
import { updateIdentityVerified } from '../../services/auth';

type Step = 'camera' | 'scan';

const RING_CENTER = layout.idRingSize / 2;

export default function IdentityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>('camera');
  const markIdentityDone = useKycStore((state) => state.markIdentityDone);
  const userId = useAuthStore((state) => state.user?.id);

  // Last step in the chain — mark this requirement done and go back to
  // the requirements screen so the user sees it ticked off.
  const handleContinue = async () => {
    await updateIdentityVerified(userId ?? '');
    markIdentityDone();
    router.replace('/(auth)/requirements');
  };

  // On the face scan screen the back arrow returns to the camera screen.
  const handleBack = () => (step === 'scan' ? setStep('camera') : router.back());

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.scroll, { paddingTop: Math.max(insets.top, layout.statusBarHeight) }]}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <MaterialIcons name="arrow-back" size={layout.backArrowSize} color={colors.black} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.helpLink, { top: Math.max(insets.top, layout.statusBarHeight) + layout.helpLinkTop }]}>
        <Text style={styles.helpText}>Need help?</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Identity Verification</Text>

      {step === 'camera' ? (
        <>
          {/* Line breaks copied from the design */}
          <Text style={styles.subtitle}>
            {'Now find a well lit spot and take a photo of your face\nso we know its really you. To proceed, click “Start” or select another method if you are unable to take a\nphoto'}
          </Text>

          <Image
            source={require('../../assets/images/camera-illustration.png')}
            style={styles.cameraImage}
            resizeMode="contain"
          />

          <Text style={styles.consent}>
            By pressing start, I give my consent to the collection and processing of my personal data
          </Text>

          <Button label="Start" onPress={() => setStep('scan')} style={styles.startButton} />
        </>
      ) : (
        <>
          <Text style={[styles.subtitle, styles.scanSubtitle]}>
            Please follow all the instructions given below
          </Text>

          {/* Coral "recording" icon on the left, close X on the right */}
          <View style={styles.iconRow}>
            <Svg width={layout.idRecordSize} height={layout.idRecordSize} viewBox="0 0 14 14" style={styles.recordIcon}>
              <Circle cx={7} cy={7} r={6.5} stroke={colors.recordIcon} strokeWidth={1} fill="none" />
              <Rect x={4} y={4} width={6} height={6} rx={1} fill={colors.recordIcon} />
            </Svg>
            <TouchableOpacity
              onPress={() => setStep('camera')}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Cancel face scan"
              style={styles.closeButton}
            >
              {/* Bold X, shape copied from the design */}
              <Svg width={layout.idIconSize} height={layout.idIconSize} viewBox="-8 -8 16 16">
                <Path
                  d="M1.69 0L4.52 2.82L2.82 4.52L0 1.7L-2.84 4.53L-4.53 2.83L-1.7 0L-4.53 -2.83L-2.84 -4.53L0 -1.7L2.83 -4.52L4.52 -2.82Z"
                  fill={colors.textDark}
                />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* Face photo inside a ring of 12 rounded red dashes */}
          <View style={styles.ring}>
            <Svg width={layout.idRingSize} height={layout.idRingSize} style={StyleSheet.absoluteFill}>
              <Circle
                cx={RING_CENTER}
                cy={RING_CENTER}
                r={layout.idRingRadius}
                stroke={colors.scanRing}
                strokeWidth={layout.idRingStroke}
                strokeLinecap="round"
                strokeDasharray={`${layout.idRingDash} ${layout.idRingGapLength}`}
                strokeDashoffset={layout.idRingDash / 2}
                fill="none"
              />
            </Svg>
            <Image
              source={require('../../assets/images/verification-face.png')}
              style={styles.faceImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.barsRow}>
            <View style={[styles.bar, styles.barLong]} />
            <View style={[styles.bar, styles.barShort]} />
          </View>

          <Text style={styles.instruction}>
            Don't blink your eyes while on the camera. Camera automatically captures
          </Text>

          <Button
            label="Next"
            onPress={handleContinue}
            style={styles.nextButton}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { flexGrow: 1, paddingHorizontal: layout.screenPadding, paddingBottom: spacing.xxxl },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: layout.backArrowTop,
    marginLeft: layout.backArrowLeft,
  },
  helpLink: {
    position: 'absolute',
    right: layout.screenPadding + layout.helpLinkRight,
  },
  helpText: {
    fontSize: fontSize.needHelp,
    lineHeight: lineHeight.needHelp,
    fontFamily: fontFamily.poppinsRegular,
    color: colors.orange,
  },
  title: {
    fontSize: fontSize.heading2,
    lineHeight: lineHeight.heading2,
    fontFamily: fontFamily.medium,
    color: colors.black,
    marginTop: layout.idTitleGap,
    marginLeft: layout.idTitleLeft,
  },
  subtitle: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: layout.idSubtitleGap,
  },
  cameraImage: {
    width: layout.idCameraWidth,
    height: layout.idCameraHeight,
    marginTop: layout.idCameraGap,
    marginLeft: layout.idCameraLeft,
  },
  consent: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: layout.idConsentGap,
  },
  startButton: { alignSelf: 'flex-end', paddingHorizontal: 0, width: layout.idStartWidth, marginTop: layout.idStartGap },
  scanSubtitle: { marginTop: layout.idScanSubtitleGap, marginLeft: layout.idTitleLeft },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: layout.idIconSize,
    marginTop: layout.idIconsGap,
  },
  recordIcon: { marginLeft: layout.idRecordLeft },
  closeButton: { marginRight: layout.idCloseRight },
  ring: {
    width: layout.idRingSize,
    height: layout.idRingSize,
    marginTop: layout.idRingGap,
    marginLeft: layout.idRingLeft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceImage: {
    width: layout.idFaceSize,
    height: layout.idFaceSize,
    borderRadius: layout.idFaceSize / 2,
  },
  barsRow: {
    flexDirection: 'row',
    gap: layout.idBarSpacing,
    marginTop: layout.idBarsGap,
    marginLeft: layout.idBarsLeft,
  },
  bar: { height: layout.idBarHeight, borderRadius: layout.idBarHeight / 2 },
  barLong: { width: layout.idBarLong, backgroundColor: colors.scanProgress },
  barShort: { width: layout.idBarShort, backgroundColor: colors.scanProgressRest },
  instruction: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: layout.idInstructionGap,
    marginLeft: layout.idTitleLeft,
  },
  nextButton: { alignSelf: 'flex-end', paddingHorizontal: 0, width: layout.idNextWidth, marginTop: layout.idNextGap },
});
