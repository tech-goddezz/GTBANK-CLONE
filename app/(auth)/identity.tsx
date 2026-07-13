// app/(auth)/identity.tsx
// Selfie/identity verification step. SIMULATED capture — no real camera
// wired in yet (that needs the expo-camera package + device permissions,
// which is a bigger, separate step). Visually matches the Figma flow:
// frame → "Wait a moment" → detected/confirmed.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing } from '../../constants/typography';
import Button from '../../components/Button';

type CaptureState = 'idle' | 'processing' | 'done';

export default function IdentityScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    dob: string;
    verificationType: string;
    verificationNumber: string;
    state: string;
    city: string;
  }>();

  const [captureState, setCaptureState] = useState<CaptureState>('idle');

  const handleCapture = () => {
    setCaptureState('processing');
    // Simulates the time a real face-match API call would take.
    // Replace this timeout with an actual expo-camera capture + API
    // call when you're ready to wire up the real thing.
    setTimeout(() => {
      setCaptureState('done');
    }, 1800);
  };

  const handleContinue = () => {
    router.push(
      `/(auth)/success?dob=${params.dob}&verificationType=${params.verificationType}&verificationNumber=${params.verificationNumber}&state=${params.state}&city=${params.city}`
    );
  };

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

      <View style={styles.header}>
        <Text style={styles.title}>Identity Verification</Text>
        <Text style={styles.subtitle}>
          {captureState === 'idle' && 'Position your face within the frame and tap capture'}
          {captureState === 'processing' && 'Wait a moment while we verify your identity'}
          {captureState === 'done' && 'Identity confirmed successfully'}
        </Text>
      </View>

      {/* The circular frame — dashed border while idle, solid green once
          "confirmed" so the state change is obvious at a glance. */}
      <View style={styles.frameWrapper}>
        <View
          style={[
            styles.frame,
            captureState === 'done' && styles.frameConfirmed,
          ]}
        >
          {captureState === 'idle' && (
            <Ionicons name="person-outline" size={64} color={colors.textFaded} />
          )}
          {captureState === 'processing' && (
            <ActivityIndicator color={colors.orange} size="large" />
          )}
          {captureState === 'done' && (
            <Ionicons name="checkmark" size={64} color={colors.green} />
          )}
        </View>
      </View>

      <View style={styles.buttonArea}>
        {captureState !== 'done' ? (
          <Button
            label="Take Selfie"
            onPress={handleCapture}
            loading={captureState === 'processing'}
            disabled={captureState === 'processing'}
          />
        ) : (
          <Button label="Continue" onPress={handleContinue} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, paddingHorizontal: spacing.xl },
  backButton: {
    marginTop: 56,
    marginBottom: spacing.xl,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  header: { marginBottom: spacing.xxxl, alignItems: 'center' },
  title: {
    fontSize: fontSize.heading1,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    textAlign: 'center',
    lineHeight: 22,
  },
  frameWrapper: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  frame: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 3,
    borderColor: colors.borderLight,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pageBackground,
  },
  frameConfirmed: {
    borderStyle: 'solid',
    borderColor: colors.green,
    backgroundColor: colors.greenFaint,
  },
  buttonArea: { marginTop: 'auto', marginBottom: spacing.xxxl },
});