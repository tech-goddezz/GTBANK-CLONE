// app/(auth)/identity.tsx
// Selfie/identity verification step. SIMULATED capture — no real camera
// wired in yet (that needs the expo-camera package + device permissions).
//
// Matches the Figma "Identity Verification" frames:
//   1. Intro screen — camera illustration, consent line, "Start" button.
//   2. Capture screen — circular face frame with a dashed border, a
//      two-segment progress bar, a single instruction line, "Next" button.
// From there it hands off to success.tsx ("Wait a moment" processing screen).
// Both screens share "Need help?" top-right and no back arrow (per design).

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing } from '../../constants/typography';
import Button from '../../components/Button';
import { useKycStore } from '../../store/useKycStore';
import { useAuthStore } from '../../store/useAuthStore';
import { updateIdentityVerified } from '../../services/auth';
import Svg, { Circle } from 'react-native-svg';

type Step = 'intro' | 'capturing';

// The dashed ring color around the face frame — a dark maroon in the
// design, distinct from the app's usual orange accent.
const RING_COLOR = '#8B0A0A';

export default function IdentityScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    dob: string;
    verificationType: string;
    verificationNumber: string;
    state: string;
    city: string;
  }>();

  const [step, setStep] = useState<Step>('intro');
  const markIdentityDone = useKycStore((state) => state.markIdentityDone);
  const userId = useAuthStore((state) => state.user?.id);

  const handleContinue = async () => {
  await updateIdentityVerified(userId ?? '');
  markIdentityDone();
  router.replace('/(auth)/requirements');
};
    // Last step in the chain — mark this requirement done and go back to
    // the requirements screen so the user sees all four checked off,
    // instead of skipping straight to the "Wait a moment" screen.

  return (
    <View style={styles.container}>
      <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
      <View style={styles.topRow}>

        <TouchableOpacity>
          <Text style={styles.needHelp}>Need help?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Identity Verification</Text>
        <Text style={styles.subtitle}>
          {step === 'intro'
            ? 'Now find a well lit spot and take a photo of your face so we know its really you. To proceed, click "Start" or select another method if you are unable to take a photo'
            : 'Please follow all the instructions given below'}
        </Text>
      </View>

      {step === 'intro' ? (
        <>
          {/* Camera illustration — real asset exported from Figma */}
          <View style={styles.illustrationWrap}>
            <Image
              source={require('../../assets/images/camera-illustration.png')}
              style={styles.cameraImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.consent}>
            By pressing start, I give my consent to the collection and processing of my personal data
          </Text>

          <View style={styles.buttonArea}>
            <Button
              label="Start"
              onPress={() => setStep('capturing')}
              style={styles.compactButton}
            />
          </View>
        </>
      ) : (
        <>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setStep('intro')}
            accessibilityRole="button"
            accessibilityLabel="Cancel capture"
          >
            <Ionicons name="close" size={22} color={colors.textDark} />
          </TouchableOpacity>

          {/* Small red dot with a lighter ring around it — indicates the
              camera is "live" during capture */}
          <View style={styles.activeDotRing}>
            <View style={styles.activeDotCenter} />
          </View>

          <View style={styles.frameWrapper}>
            <View style={styles.dashedRingWrapper}>
              {/* SVG circle instead of a plain View border — this is the
                  only way to control dash LENGTH (not just width) in
                  React Native. strokeDasharray="14 10" means: draw a
                  14px dash, then leave a 10px gap, repeat. Bump the first
                  number up for longer dashes, the second for bigger gaps. */}
              <Svg
                width={300}
                height={300}
                style={StyleSheet.absoluteFill}
              >
                <Circle
                  cx={150}
                  cy={150}
                  r={148}
                  stroke={RING_COLOR}
                  strokeWidth={3}
                  strokeDasharray="40 30"
                  fill="none"
                />
              </Svg>

              <View style={styles.frame}>
                <Image
                  source={require('../../assets/images/verification-face.png')}
                  style={styles.faceImage}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>

          {/* Two-segment progress bar — matches the design's capture
              progress indicator (mostly filled, small remainder). */}
          <View style={styles.progressRow}>
            <View style={styles.progressFilled} />
            <View style={styles.progressRemaining} />
          </View>

          <Text style={styles.captureInstruction}>
            Don&apos;t blink your eyes while on the camera. Camera automatically captures
          </Text>

          <View style={styles.buttonArea}>
            <Button
              label="Next"
              onPress={handleContinue}
              style={styles.compactButton}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.darkNavy, paddingHorizontal: spacing.xl },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm - 50,
    marginBottom: spacing.lg  + 10,
  },

  backButton: {
    marginTop: 70,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  needHelp: {
    fontSize: fontSize.body + 3,
    fontFamily: fontFamily.semibold,
    color: colors.orange,
    paddingTop: spacing.sm, 
  },

  header: { marginBottom: spacing.xl },
  title: {
    fontSize: fontSize.heading1,
    fontFamily: fontFamily.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.base,
    lineHeight: 22,
  },
 illustrationWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    marginBottom: spacing.xl,
  },
  cameraImage: {
    width: 400,
    height: 400,
  },
  consent: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.base,
    lineHeight: 20,
    marginTop: spacing.sm - 30,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

 activeDotRing: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#FFBBB2',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
    marginTop: spacing.sm - 60,
  },
  activeDotCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF7866',
  },

  frameWrapper: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
 dashedRingWrapper: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: 260,
    height: 260,
    borderRadius: 130,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#161616',
    overflow: 'hidden',
  },
  faceImage: {
    width: '100%',
    height: '100%',
    borderRadius: 130,
  },

  progressRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },


  progressFilled: {
    flex: 4,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF9D3A',
  },
  progressRemaining: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CC6600',
  },


  captureInstruction: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    lineHeight: 20,
  },
  buttonArea: {
    marginTop: 'auto',
    marginBottom: spacing.xxxl + 70,
    alignItems: 'flex-end',
  },
  compactButton: {
    paddingHorizontal: spacing.xxxl,
    height: 44,
  },
});


// buttonArea: {
//     marginTop: 'auto',
//     marginBottom: spacing.xxxl + 70,
//     alignItems: 'flex-end',
//   },
//   compactButton: {
//     paddingHorizontal: spacing.xxxl,
//     height: 45,
//   },
