// app/(auth)/login-biometric.tsx
//
// The fingerprint version of the returning-user login screen. Same avatar
// placeholder up top as login-password.tsx, but instead of a keypad, this
// screen shows a fingerprint icon the user taps, then a button that reads
// "Authenticating fingerprint" while the (mocked, for now) check runs.

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import { useAuthStore } from '../../store/useAuthStore';
import { mockUser } from '../../constants/mockData';

export default function LoginBiometricScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [authenticating, setAuthenticating] = useState(false);

  const handleFingerprintTap = () => {
    if (authenticating) return;
    setAuthenticating(true);

    // 📚 Quick concept: this is a MOCK biometric check. Real Face ID /
    // fingerprint auth would use the expo-local-authentication package,
    // which isn't installed yet — flagging that below. For now we just
    // simulate the short delay a real scan would have, so the flow feels
    // real when you demo it.
    setTimeout(() => {
      login(mockUser, 'mock-token-abc123');
      router.replace('/(tabs)/home');
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.avatarCircle}>
        <Ionicons name="person-outline" size={28} color={colors.textGrey} />
      </View>

      <View style={styles.center}>
        <TouchableOpacity onPress={handleFingerprintTap} activeOpacity={0.7}>
          <View style={styles.fingerprintCircle}>
            <Ionicons name="finger-print" size={48} color={colors.orange} />
          </View>
        </TouchableOpacity>

        <Text style={styles.helperText}>
          {authenticating ? 'Authenticating fingerprint' : 'Click to log in with Fingerprint'}
        </Text>
      </View>

      <View style={styles.linkRow}>
        <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
          <Text style={styles.linkOrange}>Forget password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(auth)/login-password')}>
          <Text style={styles.linkGrey}>Login with Password</Text>
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fingerprintCircle: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    backgroundColor: colors.orangeFaint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  helperText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
    marginBottom: spacing.xl,
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