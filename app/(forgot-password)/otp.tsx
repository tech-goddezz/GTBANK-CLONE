// 6-digit code sent to the user's registered phone number.
// Matches the third screen of "forget password.pdf": same look as the
// sign-in code screen, without the "from SMS / Tokens" switch.

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, lineHeight, spacing } from '../../constants/typography';
import { layout } from '../../constants/layout';
import OTPInput from '../../components/ui/OTPInput';
import Button from '../../components/Button';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

export default function ForgotOTPScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: Math.max(insets.top, layout.statusBarHeight) }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialIcons name="arrow-back" size={layout.backArrowSize} color={colors.black} />
        </TouchableOpacity>

        <Text style={styles.title}>6- digit code</Text>
        <Text style={styles.subtitle}>
          We've sent a verification code to your registered phone number. Enter the code below to continue.
        </Text>

        <View style={styles.otpWrapper}>
          <OTPInput length={OTP_LENGTH} value={otp} onChange={setOtp} autoFocus />
        </View>

        {/* "Didn't get the code? Resend in 45 sec" — same look as the sign-in code screen */}
        {countdown > 0 ? (
          <Text style={styles.resendText}>
            Didn't get the code? Resend <Text style={styles.resendOrange}>in </Text>
            <Text style={styles.resendBold}>{countdown} sec</Text>
          </Text>
        ) : (
          <Text style={styles.resendText}>
            Didn't get the code?{' '}
            <Text style={styles.resendBold} onPress={() => setCountdown(RESEND_SECONDS)}>Resend</Text>
          </Text>
        )}

        {/* Always looks orange like the design; only moves on once all 6 digits are in */}
        <Button
          label="Proceed"
          onPress={() => isComplete && router.push('/(forgot-password)/identity')}
          style={styles.proceed}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { flexGrow: 1, paddingHorizontal: layout.screenPadding, paddingBottom: spacing.xxxl },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: layout.backArrowTop,
    marginLeft: layout.backArrowLeft,
  },
  title: {
    fontSize: fontSize.heading1,
    lineHeight: lineHeight.heading1,
    fontFamily: fontFamily.semibold,
    color: colors.black,
    marginTop: layout.codeTitleGap,
  },
  subtitle: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: layout.forgotCodeSubtitleGap,
    marginLeft: layout.forgotCodeSubtitleLeft,
  },
  otpWrapper: { marginTop: layout.forgotCodeBoxesGap },
  resendText: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: layout.forgotCodeResendGap,
    marginLeft: layout.forgotCodeSubtitleLeft,
  },
  resendOrange: { color: colors.orange },
  resendBold: { fontFamily: fontFamily.bold, color: colors.orange },
  proceed: {
    alignSelf: 'flex-end',
    width: layout.phoneProceedWidth,
    paddingHorizontal: 0,
    marginTop: layout.forgotCodeProceedGap,
  },
});
