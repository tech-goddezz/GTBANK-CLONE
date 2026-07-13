// app/(auth)/otp.tsx
// OTP verification — matches the "6-digit code" screen from the sign-in
// design: from SMS / Tokens tab toggle, live resend countdown, 6-box code.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import Button from '../../components/Button';
import OTPInput from '../../components/ui/OTPInput';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

export default function OTPScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [tab, setTab] = useState<'sms' | 'tokens'>('sms');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  const isComplete = otp.every((d) => d !== '');

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleVerify = () => {
    if (!isComplete) return;
    setLoading(true);
    router.replace('/(auth)/requirements');
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(RESEND_SECONDS);
    // In production this re-triggers the SMS/token send via the API.
  };

  const formattedPhone = phone
    ? `+${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6, 9)} ${phone.slice(9)}`
    : '+234 800 001 0000';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>

        <Text style={styles.title}>6-digit code</Text>

        {/* SMS / Tokens tab toggle */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, tab === 'sms' && styles.tabActive]}
            onPress={() => setTab('sms')}
          >
            <Text style={[styles.tabLabel, tab === 'sms' && styles.tabLabelActive]}>
              from SMS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'tokens' && styles.tabActive]}
            onPress={() => setTab('tokens')}
          >
            <Text style={[styles.tabLabel, tab === 'tokens' && styles.tabLabelActive]}>
              Tokens
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Enter the 6 digit code sent to{'\n'}
          <Text style={styles.phoneHighlight}>{formattedPhone}</Text>
        </Text>

        <View style={styles.otpWrapper}>
          <OTPInput length={OTP_LENGTH} value={otp} onChange={setOtp} />
        </View>

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Didn't get the code? </Text>
          <TouchableOpacity onPress={handleResend} disabled={secondsLeft > 0}>
            <Text style={styles.resendLink}>
              {secondsLeft > 0 ? `Resend in ${secondsLeft} sec` : 'Resend'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonArea}>
          <Button
            label="Proceed"
            onPress={handleVerify}
            disabled={!isComplete}
            loading={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
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
  title: {
    fontSize: fontSize.heading1,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
    marginBottom: spacing.lg,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.inputBackground,
    borderRadius: radius.button,
    padding: 4,
    marginBottom: spacing.lg,
    alignSelf: 'flex-start',
  },
  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button - 4,
  },
  tabActive: {
    backgroundColor: colors.white,
  },
  tabLabel: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.medium,
    color: colors.textGrey,
  },
  tabLabelActive: {
    color: colors.textDark,
    fontFamily: fontFamily.semibold,
  },
  subtitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  phoneHighlight: {
    fontFamily: fontFamily.semibold,
    color: colors.textDark,
  },
  otpWrapper: { marginBottom: spacing.xl },
  resendRow: {
    flexDirection: 'row',
    marginBottom: spacing.xxxl,
  },
  resendText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  resendLink: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    color: colors.orange,
  },
  buttonArea: { marginTop: 'auto' },
});