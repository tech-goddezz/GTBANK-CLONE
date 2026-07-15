// 6-digit code sent to the user's registered phone number.

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import OTPInput from '../../components/ui/OTPInput';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

export default function ForgotOTPScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(RESEND_SECONDS);

  const isComplete = otp.every((d) => d !== '');

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

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

        <Text style={styles.title}>6- digit code</Text>
        <Text style={styles.subtitle}>
          We've sent a verification code to your registered phone number.
          Enter the code below to continue.
        </Text>

        <View style={styles.otpWrapper}>
          <OTPInput length={OTP_LENGTH} value={otp} onChange={setOtp} />
        </View>

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Didn't get the code? Resend in </Text>
          <Text style={styles.resendTimer}>
            {countdown > 0 ? `${countdown} sec` : ''}
          </Text>
          {countdown <= 0 && (
            <TouchableOpacity onPress={() => setCountdown(RESEND_SECONDS)}>
              <Text style={styles.resendLink}>Resend</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.buttonWrap}>
          <TouchableOpacity
            style={[styles.button, !isComplete && { opacity: 0.5 }]}
            onPress={() => isComplete && router.push('/(forgot-password)/identity')}
            disabled={!isComplete}
          >
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
  otpWrapper: { marginBottom: spacing.xl },
  resendRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  resendText: { fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textGrey },
  resendTimer: { fontSize: fontSize.body, fontFamily: fontFamily.semibold, color: colors.orange },
  resendLink: { fontSize: fontSize.body, fontFamily: fontFamily.semibold, color: colors.orange },
  buttonWrap: { alignItems: 'flex-end', marginTop: spacing.xxxl },
  button: {
    backgroundColor: colors.orange, paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md, borderRadius: radius.button,
  },
  buttonText: { fontSize: fontSize.body, fontFamily: fontFamily.semibold, color: colors.white },
});