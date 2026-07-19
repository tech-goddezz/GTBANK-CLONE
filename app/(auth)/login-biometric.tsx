import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
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
    setTimeout(() => {
      login(mockUser, 'mock-token-abc123');
      router.replace('/(auth)/requirements');
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Avatar at top */}
      <View style={styles.avatarCircle}>
        <Ionicons name="person-outline" size={28} color={colors.textGrey} />
      </View>

      {/* Center: fingerprint icon + helper text */}
      <View style={styles.center}>
        <TouchableOpacity
          onPress={handleFingerprintTap}
          activeOpacity={0.7}
          disabled={authenticating}
          accessibilityRole="button"
          accessibilityLabel="Tap to authenticate with fingerprint"
        >
          {/* Red/orange fingerprint — matches design's reddish-orange tint */}
          <View style={styles.fingerprintWrap}>
            <Ionicons name="finger-print" size={64} color="#D94F2B" />
          </View>
        </TouchableOpacity>

        <Text style={styles.helperText}>
          Click to log in with Fingerprint
        </Text>

        {/* Orange button only appears while authenticating */}
        {authenticating && (
          <View style={styles.authenticatingButton}>
            <Text style={styles.authenticatingText}>Authenticating fingerprint</Text>
          </View>
        )}
      </View>

      {/* Bottom links */}
      <View style={styles.linkRow}>
        <TouchableOpacity
          onPress={() => router.push('/(forgot-password)/requirements')}
          accessibilityRole="button"
        >
          <Text style={styles.linkOrange}>Forget password?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace('/(auth)/login-password')}
          accessibilityRole="button"
        >
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
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxxl + 50,
    marginBottom: spacing.xxxl - 180,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  fingerprintWrap: {
    width: 100,
    height: 100,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm - 20,
  },
  helperText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
  },
  authenticatingButton: {
    backgroundColor: colors.orange,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xxl,
    borderRadius: 4,
    marginTop: spacing.md - 40,
  },
  authenticatingText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    color: colors.white,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    marginBottom: spacing.xxxl + 35,
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