// Simulated identity verification — same pattern as the KYC identity screen.

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';

type State = 'idle' | 'processing' | 'done';

export default function ForgotIdentityScreen() {
  const router = useRouter();
  const [state, setState] = useState<State>('idle');

  const handleStart = () => {
    setState('processing');
    setTimeout(() => setState('done'), 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.title}>Identity Verification</Text>
          <Text style={styles.subtitle}>
            {state === 'idle'
              ? 'Now find a well lit spot and take a photo of your face so we know its really you. To proceed, click "Start" or select another method if you are unable to take a photo.'
              : state === 'processing'
              ? "Don't blink your eyes while on the camera. Camera automatically captures."
              : 'Identity verified successfully.'}
          </Text>
        </View>

        <View style={[styles.frame, state === 'done' && styles.frameConfirmed]}>
          {state === 'idle' && (
            <Ionicons name="camera-outline" size={56} color={colors.textFaded} />
          )}
          {state === 'processing' && (
            <ActivityIndicator color={colors.orange} size="large" />
          )}
          {state === 'done' && (
            <Ionicons name="checkmark" size={56} color={colors.green} />
          )}
        </View>

        {/* Two-segment progress bar — matches Figma */}
        {state !== 'idle' && (
          <View style={styles.progressBar}>
            <View style={[styles.progressSegment, styles.progressActive]} />
            <View style={[styles.progressSegment, state === 'done' && styles.progressActive]} />
          </View>
        )}
      </View>

      <View style={styles.buttonArea}>
        {state !== 'done' ? (
          <TouchableOpacity
            style={[styles.button, state === 'processing' && { opacity: 0.6 }]}
            onPress={handleStart}
            disabled={state === 'processing'}
          >
            <Text style={styles.buttonText}>{state === 'idle' ? 'Start' : 'Processing...'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/(forgot-password)/new-password')}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  inner: { flex: 1, alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.xxxl },
  header: { marginBottom: spacing.xxxl, alignItems: 'center' },
  title: { fontSize: fontSize.heading1, fontFamily: fontFamily.bold, color: colors.textDark, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textGrey, textAlign: 'center', lineHeight: 22 },
  frame: {
    width: 220, height: 220, borderRadius: 110,
    borderWidth: 3, borderColor: colors.red, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.pageBackground, marginBottom: spacing.xl,
  },
  frameConfirmed: { borderStyle: 'solid', borderColor: colors.green, backgroundColor: colors.greenFaint },
  progressBar: { flexDirection: 'row', gap: spacing.sm, width: 120 },
  progressSegment: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.borderLight },
  progressActive: { backgroundColor: colors.orange },
  buttonArea: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  button: {
    backgroundColor: colors.orange, height: 54, borderRadius: radius.button,
    alignItems: 'center', justifyContent: 'center',
  },
  buttonText: { fontSize: fontSize.large, fontFamily: fontFamily.semibold, color: colors.white },
});