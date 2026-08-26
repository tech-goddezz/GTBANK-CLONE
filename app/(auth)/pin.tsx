// app/(auth)/pin.tsx
// 4-digit PIN creation with confirmation step, then saves the real
// PIN and redirects to the dashboard.
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import { useAuthStore } from '../../store/useAuthStore';
import { setPin as saveRealPin, getCurrentUserId, fetchProfile } from '../../services/auth';

const PIN_LENGTH = 4;
const keypadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

export default function PinScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [stage, setStage] = useState<'create' | 'confirm'>('create');
  const [firstPin, setFirstPin] = useState('');
  const [pin, setPin] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const finishSetPin = async (confirmedPin: string) => {
    setLoading(true);
    const id = await getCurrentUserId();
    const result = await saveRealPin(id, confirmedPin);
    setLoading(false);

    if (result.success) {
      const profileResult = await fetchProfile(id);
      const realUser = {
        id,
        firstName: profileResult.profile?.first_name ?? '',
        lastName: profileResult.profile?.last_name ?? '',
        phoneNumber: profileResult.profile?.phone_number ?? '',
        accountNumber: profileResult.profile?.account_number ?? '',
        tier: (profileResult.profile?.tier ?? 1) as 1 | 2 | 3,
      };
      login(realUser, 'real-session');
      router.replace('/(tabs)/home');
    } else {
      setError('Could not set PIN. Please try again.');
      setStage('create');
      setFirstPin('');
      setPin([]);
    }
  };

  const handleKey = (key: string) => {
    setError('');
    if (key === 'del') {
      setPin((prev) => prev.slice(0, -1));
      return;
    }
    if (key === '' || pin.length >= PIN_LENGTH) return;

    const next = [...pin, key];
    setPin(next);

    if (next.length === PIN_LENGTH) {
      const entered = next.join('');
      if (stage === 'create') {
        setFirstPin(entered);
        setStage('confirm');
        setPin([]);
      } else {
        if (entered === firstPin) {
          finishSetPin(entered);
        } else {
          setError('PINs do not match. Please start over.');
          setStage('create');
          setFirstPin('');
          setPin([]);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {stage === 'create' ? 'Create your PIN' : 'Confirm your PIN'}
      </Text>
      <Text style={styles.subtitle}>
        {stage === 'create'
          ? 'Choose a 4-digit PIN for quick login'
          : 'Re-enter your PIN to confirm'}
      </Text>

      <View style={styles.dotsRow}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <View key={i} style={[styles.dot, i < pin.length && styles.dotFilled]} />
        ))}
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}
      {loading && <Text style={styles.loading}>Saving...</Text>}

      <View style={styles.keypad}>
        {keypadKeys.map((key, i) => (
          <TouchableOpacity
            key={i}
            style={styles.key}
            onPress={() => handleKey(key)}
            disabled={!key || loading}
            activeOpacity={key ? 0.5 : 1}
          >
            {key === 'del' ? (
              <Ionicons name="backspace-outline" size={26} color={colors.textDark} />
            ) : (
              <Text style={[styles.keyText, !key && styles.keyTextHidden]}>{key}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, alignItems: 'center', paddingHorizontal: spacing.xl },
  title: { fontSize: fontSize.heading1, fontFamily: fontFamily.bold, color: colors.textDark, marginTop: spacing.xxxl + 40 },
  subtitle: { fontSize: fontSize.small, fontFamily: fontFamily.regular, color: colors.textGrey, marginTop: spacing.sm },
  dotsRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xxl },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: colors.borderLight },
  dotFilled: { backgroundColor: colors.orange, borderColor: colors.orange },
  error: { fontSize: fontSize.small, color: colors.red, marginTop: spacing.lg, textAlign: 'center' },
  loading: { fontSize: fontSize.small, color: colors.textGrey, marginTop: spacing.lg },
  keypad: { width: '100%', marginTop: 'auto', marginBottom: spacing.xxxl, flexDirection: 'row', flexWrap: 'wrap' },
  key: { width: '33.33%', height: 72, alignItems: 'center', justifyContent: 'center' },
  keyText: { fontSize: 28, fontFamily: fontFamily.regular, color: colors.textDark },
  keyTextHidden: { opacity: 0 },
});
