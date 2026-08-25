import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';

export default function PhoneScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const isValid = /^[789][01]\d{8}$/.test(phone);

  const handleProceed = () => {
    if (!isValid) {
      setError('Please enter a valid phone number');
      return;
    }
    setError('');
    router.push(`/(auth)/otp?phone=234${phone}`);
  };

  const handleChangeText = (text: string) => {
    const digits = text.replace(/[^0-9]/g, '').slice(0, 10);
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
        showsVerticalScrollIndicator={false}
      >
        {/* Need help — top right, orange, no back arrow on this screen */}
        <View style={styles.topRow}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Need help">
            <Text style={styles.needHelp}>Need help?</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Hello!</Text>
        <Text style={styles.subtitle}>
          Welcome to GT World! Enter your phone number to login or sign in
        </Text>

        {/* Country code + number input — underline style, no card border */}
        <View style={[styles.inputRow, !!error && styles.inputRowError]}>
          <Text style={styles.flag}>🇳🇬</Text>
          <Text style={styles.dialCode}>+234</Text>
          <Text style={styles.chevron}>›</Text>
          <View style={styles.divider} />
          <TextInput
            style={styles.input}
            placeholder="Mobile number"
            placeholderTextColor={colors.textFaded}
            value={phone}
            onChangeText={handleChangeText}
            keyboardType="number-pad"
            maxLength={10}
            accessibilityLabel="Mobile number input"
          />
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={styles.link}>New here? Sign up</Text>
        </TouchableOpacity>
        {/* Legal disclaimer with orange links */}
        <Text style={styles.disclaimer}>
          By providing your phone number , you agree to our{' '}
          <Text style={styles.link}>Privacy policy</Text>
          {' '}and{' '}
          <Text style={styles.link}>Terms of Use</Text>
        </Text>

        {/* Proceed button — compact, right-aligned, matching the design */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.proceedButton, !isValid && styles.proceedButtonDisabled]}
            onPress={handleProceed}
            disabled={!isValid}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Proceed"
          >
            <Text style={styles.proceedText}>Proceed</Text>
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
  topRow: {
    alignItems: 'flex-end',
    marginTop: 56,
    marginBottom: spacing.xxl,
  },
  needHelp: {
    fontSize: fontSize.body + 3,
    fontFamily: fontFamily.semibold,
    color: colors.orange,
    paddingTop: spacing.xxl,
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
    lineHeight: 20,
    marginBottom: spacing.xxxl,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: colors.borderLight,
    paddingBottom: spacing.md,
  },
  inputRowError: {
    borderBottomColor: colors.red,
  },
  flag: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  dialCode: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.medium,
    color: colors.textDark,
  },
  chevron: {
    fontSize: fontSize.body,
    color: colors.textGrey,
    marginLeft: spacing.xs,
    transform: [{ rotate: '90deg' }],
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: fontSize.large,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
    padding: 0,
  },
  errorText: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.red,
    marginTop: spacing.sm,
  },
  disclaimer: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    lineHeight: 18,
    marginTop: spacing.lg,
  },
  link: {
    fontFamily: fontFamily.semibold,
    color: colors.orange,
  },
  buttonRow: {
    alignItems: 'flex-end',
    marginTop: 'auto',
    paddingTop: spacing.xxxl,
  },
  proceedButton: {
    backgroundColor: colors.orange,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radius.button - 10,
    marginBottom: 250,
    height: 44,
  },
  proceedButtonDisabled: {
    opacity: 0.5,
  },
  proceedText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    color: colors.white,
  },
});
