// app/(auth)/phone.tsx
// Phone number entry — first step of the auth flow.
// Validates 11-digit Nigerian number before allowing navigation.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing } from '../../constants/typography';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

export default function PhoneScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const isValid = phone.length === 11;

  const handleContinue = () => {
    if (!isValid) {
      setError('Please enter a valid 11-digit phone number');
      return;
    }
    setError('');
    // Pass phone number to OTP screen as a URL param
    router.push(`/(auth)/otp?phone=${phone}`);
  };

  const handleChangeText = (text: string) => {
    // Only allow digits, max 11 characters
    const digits = text.replace(/[^0-9]/g, '').slice(0, 11);
    setPhone(digits);
    if (error) setError('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Enter your{'\n'}phone number</Text>
          <Text style={styles.subtitle}>
            We'll send a verification code to this number
          </Text>
        </View>

        {/* Input */}
        <InputField
          label="Phone number"
          placeholder="08012345678"
          value={phone}
          onChangeText={handleChangeText}
          keyboardType="phone-pad"
          error={error}
          maxLength={11}
        />

        {/* Character counter */}
        <Text style={styles.counter}>{phone.length}/11</Text>

        {/* Continue button */}
        <View style={styles.buttonArea}>
          <Button
            label="Continue"
            onPress={handleContinue}
            disabled={!isValid}
          />
        </View>

        {/* Login link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/pin')}>
            <Text style={styles.loginLink}>Log in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
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
    lineHeight: 40,
  },
  subtitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    lineHeight: 22,
  },
  counter: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    textAlign: 'right',
    marginTop: -spacing.md,
    marginBottom: spacing.lg,
  },
  buttonArea: {
    marginTop: spacing.xl,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  loginText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  loginLink: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    color: colors.orange,
  },
});