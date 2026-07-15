// Account number + phone number entry to identify the account.

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

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [accountNumber, setAccountNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleProceed = () => {
    const newErrors: Record<string, string> = {};
    if (accountNumber.trim().length < 10) newErrors.account = 'Enter a valid account number';
    if (phone.trim().length < 10) newErrors.phone = 'Enter a valid phone number';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    router.push('/(forgot-password)/otp');
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

        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter the account number and phone number associated with your account.
          We'll send you a code to reset your password.
        </Text>

        <InputField
          placeholder="Account number"
          value={accountNumber}
          onChangeText={(t) => {
            setAccountNumber(t.replace(/[^0-9]/g, '').slice(0, 10));
            if (errors.account) setErrors((e) => ({ ...e, account: '' }));
          }}
          keyboardType="number-pad"
          maxLength={10}
          error={errors.account}
        />

        <View style={styles.phoneRow}>
          <View style={styles.dialCode}>
            <Text style={styles.flag}>🇳🇬</Text>
            <Text style={styles.dialText}>+234</Text>
            <Ionicons name="chevron-down" size={14} color={colors.textGrey} />
          </View>
          <View style={{ flex: 1 }}>
            <InputField
              placeholder="Mobile number"
              value={phone}
              onChangeText={(t) => {
                setPhone(t.replace(/[^0-9]/g, '').slice(0, 11));
                if (errors.phone) setErrors((e) => ({ ...e, phone: '' }));
              }}
              keyboardType="phone-pad"
              maxLength={11}
              error={errors.phone}
            />
          </View>
        </View>

        <View style={styles.buttonWrap}>
          <TouchableOpacity style={styles.button} onPress={handleProceed}>
            <Text style={styles.buttonText}>Proceed</Text>
          </TouchableOpacity>
        </View>
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
  phoneRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  dialCode: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    height: 52, paddingHorizontal: spacing.md,
    backgroundColor: colors.inputBackground, borderRadius: radius.input,
    borderWidth: 1.5, borderColor: colors.borderLight,
  },
  flag: { fontSize: 18 },
  dialText: { fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textDark },
  buttonWrap: { alignItems: 'flex-end', marginTop: spacing.xxxl },
  button: {
    backgroundColor: colors.orange, paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md, borderRadius: radius.button,
  },
  buttonText: { fontSize: fontSize.body, fontFamily: fontFamily.semibold, color: colors.white },
});