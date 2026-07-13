// app/(auth)/login-password.tsx
//
// This is the "welcome back" screen for a RETURNING user — different from
// pin.tsx, which is for creating a brand-new PIN during signup/KYC. Here,
// the person already has an account, and just needs to type their password
// to get back in. Matches the "Enter password" screen from the Sign In
// design, including the on-screen keypad with a fingerprint shortcut and
// the "Login with Fingerprint" toggle at the bottom.

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import { useAuthStore } from '../../store/useAuthStore';
import { mockUser } from '../../constants/mockData';
import NumericKeypad from '../../components/NumericKeypad';

const PASSWORD_LENGTH = 4;

export default function LoginPasswordScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [password, setPassword] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleKey = (key: string) => {
    if (key === 'del') {
      setPassword((prev) => prev.slice(0, -1));
      setError('');
      return;
    }
    if (password.length >= PASSWORD_LENGTH) return;

    const next = [...password, key];
    setPassword(next);

    // Same auto-submit pattern as the PIN screen: no separate "Proceed"
    // button needed once the last digit is entered.
    if (next.length === PASSWORD_LENGTH) {
      handleSubmit(next.join(''));
    }
  };

  const handleSubmit = (entered: string) => {
    // Mock validation — swap this for a real API call once the backend exists.
    if (entered === '1234') {
      login(mockUser, 'mock-token-abc123');
      router.replace('/(tabs)/home');
    } else {
      setError('Incorrect password. Try 1234 for demo.');
      setPassword([]);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Avatar placeholder — the design shows a generic outlined person
          icon here, not the user's real photo, since at this point we
          haven't loaded their profile yet. */}
      <View style={styles.avatarCircle}>
        <Ionicons name="person-outline" size={28} color={colors.textGrey} />
      </View>

      {/* This "input" is actually just a label — tapping the keypad below
          is what fills it, there's no real text cursor here, matching
          how the design shows a plain grey pill rather than a live input. */}
      <View style={styles.passwordPill}>
        <Text style={styles.passwordPillText}>
          {password.length > 0 ? '•'.repeat(password.length) : 'Enter password'}
        </Text>
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.keypadArea}>
        <NumericKeypad
          onKeyPress={handleKey}
          bottomLeftIcon="finger-print-outline"
          onBottomLeftPress={() => router.replace('/(auth)/login-biometric')}
        />
      </View>

      {/* Bottom links */}
      <View style={styles.linkRow}>
        <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
          <Text style={styles.linkOrange}>Forget password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(auth)/login-biometric')}>
          <Text style={styles.linkGrey}>Login with Fingerprint</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBackground,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxxl,
    backgroundColor: colors.cardBackground,
  },
  passwordPill: {
    marginTop: spacing.xxl,
    backgroundColor: colors.inputBackground,
    borderRadius: radius.button,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
  },
  passwordPillText: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.medium,
    color: colors.textDark,
    letterSpacing: 4,
  },
  error: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.red,
    marginTop: spacing.md,
  },
  keypadArea: {
    width: '100%',
    marginTop: 'auto',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: spacing.xl,
  },
  linkOrange: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    color: colors.orange,
  },
  linkGrey: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
});