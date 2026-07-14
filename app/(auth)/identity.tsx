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
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing } from '../../constants/typography';
import Button from '../../components/Button';

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

  const handleContinue = () => {
    router.push(
      `/(auth)/success?dob=${params.dob}&verificationType=${params.verificationType}&verificationNumber=${params.verificationNumber}&state=${params.state}&city=${params.city}`
    );
  };

  return (
    <View style={styles.container}>
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
          {/* Camera illustration — a stand-in for the design's 3D camera
              render, since there's no exported asset for it yet. */}
          <View style={styles.illustrationWrap}>
            <Ionicons name="camera" size={130} color={colors.textDark} style={{ transform: [{ rotate: '-6deg' }] }} />
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

          <View style={styles.frameWrapper}>
            <View style={styles.frame}>
              <Ionicons name="person" size={110} color="#4A4A4A" />
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
  container: { flex: 1, backgroundColor: colors.white, paddingHorizontal: spacing.xl },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 56,
    marginBottom: spacing.lg,
  },
  needHelp: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    color: colors.orange,
  },
  header: { marginBottom: spacing.xl },
  title: {
    fontSize: fontSize.heading1,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    lineHeight: 22,
  },
  illustrationWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 220,
    marginBottom: spacing.xl,
  },
  consent: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    lineHeight: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  frameWrapper: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  frame: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: RING_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#161616',
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
    backgroundColor: colors.orange,
  },
  progressRemaining: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.orangePressed,
  },
  captureInstruction: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    lineHeight: 20,
  },
  buttonArea: {
    marginTop: 'auto',
    marginBottom: spacing.xxxl,
    alignItems: 'flex-end',
  },
  compactButton: {
    paddingHorizontal: spacing.xxl,
  },
});