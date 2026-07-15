// app/(auth)/pin.tsx
// 4-digit PIN entry with custom number pad.
// On completion, saves login state and redirects to dashboard.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import { useAuthStore } from '../../store/useAuthStore';import { mockUser } from '../../constants/mockData';

const PIN_LENGTH = 4;

const keypadKeys = [
  '1', '2', '3',
  '4', '5', '6',
  '7', '8', '9',
  '',  '0', 'del',
];

export default function PinScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [pin, setPin] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleKey = (key: string) => {
    if (key === '') return;

    if (key === 'del') {
      setPin((prev) => prev.slice(0, -1));
      setError('');
      return;
    }

    if (pin.length >= PIN_LENGTH) return;

    const newPin = [...pin, key];
    setPin(newPin);

    // Auto-submit when 4 digits are entered
    if (newPin.length === PIN_LENGTH) {
      handleSubmit(newPin.join(''));
    }
  };

  const handleSubmit = (enteredPin: string) => {
    // Mock validation — in production this hits your API
    if (enteredPin === '1234') {
        login(mockUser, 'mock-token-abc123');
      router.replace('/(tabs)/home');
    } else {
      setError('Incorrect PIN. Try 1234 for demo.');
      setPin([]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={colors.textDark} />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Enter your PIN</Text>
        <Text style={styles.subtitle}>
          Use PIN: 1234 for this demo
        </Text>
      </View>

      {/* PIN dots */}
      <View style={styles.dotsRow}>
        {Array(PIN_LENGTH).fill(null).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i < pin.length && styles.dotFilled,
            ]}
          />
        ))}
      </View>

      {/* Error message */}
      {!!error && <Text style={styles.error}>{error}</Text>}

      {/* Number pad */}
      <View style={styles.keypad}>
        {keypadKeys.map((key, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.key,
              key === '' && styles.keyInvisible,
            ]}
            onPress={() => handleKey(key)}
            disabled={key === ''}
            activeOpacity={0.6}
          >
            {key === 'del' ? (
              <Ionicons
                name="backspace-outline"
                size={24}
                color={colors.textDark}
              />
            ) : (
              <Text style={styles.keyText}>{key}</Text>
            )}
          </TouchableOpacity>
          
        ))}
        <TouchableOpacity onPress={() => router.push('/(forgot-password)/requirements')}>
      
      <Text style={{ color: colors.orange, fontSize: fontSize.body, fontFamily: fontFamily.medium }}>
      Forget password?
      </Text>
    </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xl,
  },
  backButton: {
    marginTop: 56,
    marginBottom: spacing.xl,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xxxl,
  },
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
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    marginBottom: spacing.lg,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.borderLight,
    backgroundColor: colors.transparent,
  },
  dotFilled: {
    backgroundColor: colors.orange,
    borderColor: colors.orange,
  },
  error: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.red,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.xl,
  },
  key: {
    width: '33.33%',
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.button,
  },
  keyInvisible: {
    opacity: 0,
  },
  keyText: {
    fontSize: 28,
    fontFamily: fontFamily.medium,
    color: colors.textDark,
  },
});