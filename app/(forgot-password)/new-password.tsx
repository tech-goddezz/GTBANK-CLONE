// Create new password — must differ from the previous one.

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import InputField from '../../components/InputField';

export default function NewPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleReset = () => {
    const newErrors: Record<string, string> = {};
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirm) newErrors.confirm = 'Passwords do not match';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    router.replace('/(forgot-password)/success');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>

        <Text style={styles.title}>Create New Password</Text>
        <Text style={styles.subtitle}>
          Your new password must be different from your previous password.
        </Text>

        <InputField
          placeholder="New Password"
          value={password}
          onChangeText={(t) => { setPassword(t); if (errors.password) setErrors((e) => ({ ...e, password: '' })); }}
          secureTextEntry
          error={errors.password}
        />

        <InputField
          placeholder="Confirm Password"
          value={confirm}
          onChangeText={(t) => { setConfirm(t); if (errors.confirm) setErrors((e) => ({ ...e, confirm: '' })); }}
          secureTextEntry
          error={errors.confirm}
        />

        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  backButton: { marginTop: 56, marginBottom: spacing.xl, width: 40, height: 40, justifyContent: 'center' },
  title: { fontSize: fontSize.heading1, fontFamily: fontFamily.bold, color: colors.textDark, marginBottom: spacing.sm },
  subtitle: { fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textGrey, marginBottom: spacing.xl, lineHeight: 22 },
  button: {
    backgroundColor: colors.orange, height: 54, borderRadius: radius.button,
    alignItems: 'center', justifyContent: 'center', marginTop: spacing.xl,
  },
  buttonText: { fontSize: fontSize.large, fontFamily: fontFamily.semibold, color: colors.white },
});