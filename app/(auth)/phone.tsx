// app/(auth)/phone.tsx
// Phone number entry — first step of the auth flow.
// Matches the "Hello!" screen from the GTCO sign-in design: country-code
// prefixed input, Need help link, legal disclaimer, Proceed button.

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
import Button from '../../components/Button';

export default function PhoneScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  // User types the number after +234, e.g. 801 234 5678 (10 digits)
  const isValid = phone.length === 10;

  const handleContinue = () => {
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
      >
        {/* Need help link, top right — matches design instead of a back arrow */}
        <View style={styles.topRow}>
          <TouchableOpacity>
            <Text style={styles.needHelp}>Need help?</Text>
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Hello!</Text>
          <Text style={styles.subtitle}>
            Welcome to GT World! Enter your phone number to login or sign in
          </Text>
        </View>

        {/* Phone input with country code prefix */}
        <View style={[styles.inputRow, !!error && styles.inputRowError]}>
          <Text style={styles.flag}>🇳🇬</Text>
          <Text style={styles.dialCode}>+234</Text>
          <Text style={styles.chevron}>⌄</Text>
          <View style={styles.divider} />
          <TextInput
            style={styles.input}
            placeholder="Mobile number"
            placeholderTextColor={colors.textFaded}
            value={phone}
            onChangeText={handleChangeText}
            keyboardType="number-pad"
            maxLength={10}
          />
        </View>
        {!!error && <Text style={styles.error}>{error}</Text>}

        {/* Legal disclaimer */}
        <Text style={styles.disclaimer}>
          By providing your phone number, you agree to our{' '}
          <Text style={styles.disclaimerLink}>Privacy policy</Text> and{' '}
          <Text style={styles.disclaimerLink}>Terms of Use</Text>
        </Text>

        {/* Proceed button */}
        <View style={styles.buttonArea}>
          <Button
            label="Proceed"
            onPress={handleContinue}
            disabled={!isValid}
          />
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 56,
    marginBottom: spacing.lg,
  },
  needHelp: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    color: colors.orange,
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
    lineHeight: 20,
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
  },
  divider: {
    width: 1,
    height: 24,
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
  error: {
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
  disclaimerLink: {
    fontFamily: fontFamily.semibold,
    color: colors.orange,
  },
  buttonArea: {
    marginTop: 'auto',
    paddingTop: spacing.xxxl,
  },
});