import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import { useAuthStore } from '../../store/useAuthStore';
import { mockUser } from '../../constants/mockData';

const PASSWORD_LENGTH = 4;

const KEYPAD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'del'],
];

export default function LoginPasswordScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [digits, setDigits] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleKey = (key: string) => {
    if (!key) return;

    if (key === 'del') {
      setDigits((prev) => prev.slice(0, -1));
      setError('');
      return;
    }

    if (digits.length >= PASSWORD_LENGTH) return;

    const next = [...digits, key];
    setDigits(next);

    if (next.length === PASSWORD_LENGTH) {
      handleSubmit(next.join(''));
    }
  };

  const handleSubmit = (entered: string) => {
    if (entered === '1234') {
      login(mockUser, 'mock-token-abc123');
      router.replace('/(auth)/requirements');
    } else {
      setError('Incorrect password. Try 1234.');
      setDigits([]);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Avatar */}
      <View style={styles.avatarCircle}>
        <Ionicons name="person-outline" size={26} color={colors.textGrey} />
      </View>

      {/* Password display pill */}
      <View style={styles.passwordPill}>
        <Text style={styles.passwordPillText}>
          {digits.length > 0 ? '•'.repeat(digits.length) : 'Enter password'}
        </Text>
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}

      {/* Keypad — plain white background, large numbers, no key backgrounds */}
      <View style={styles.keypad}>
        {KEYPAD_ROWS.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keyRow}>
            {row.map((key, keyIndex) => (
              <TouchableOpacity
                key={keyIndex}
                style={styles.key}
                onPress={() => handleKey(key)}
                disabled={!key}
                activeOpacity={key ? 0.5 : 1}
                accessibilityRole={key ? 'button' : undefined}
                accessibilityLabel={key === 'del' ? 'Delete' : key}
              >
                {key === 'del' ? (
                  <Ionicons
                    name="backspace-outline"
                    size={26}
                    color={colors.textDark}
                  />
                ) : (
                  <Text style={[styles.keyText, !key && styles.keyTextHidden]}>
                    {key}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {/* Bottom links */}
      <View style={styles.bottomLinks}>
        <TouchableOpacity
          onPress={() => router.push('/(forgot-password)/requirements')}
          accessibilityRole="button"
        >
          <Text style={styles.linkOrange}>Forget password?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace('/(auth)/login-biometric')}
          accessibilityRole="button"
        >
          <Text style={styles.linkGrey}>Login with Fingerprint</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: colors.base,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxxl + 50,
  },
  passwordPill: {
    marginTop: spacing.xxl + 30,
    marginBottom: spacing.xl + 40, 
    backgroundColor: '#f4f6fd',
    borderRadius: 4,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xxl,
    minWidth: 180,
    alignItems: 'center',
  },
  passwordPillText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    letterSpacing: 2,
  },
  error: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.red,
    marginTop: spacing.sm,
  },
  keypad: {
    width: '100%',
    marginTop: 'auto',
    paddingBottom: spacing.xxxl,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  key: {
    width: '33.33%',
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 28,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
  },
  keyTextHidden: {
    opacity: 0,
  },
  bottomLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: spacing.lg,
    marginBottom: spacing.xxxl + 60,
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