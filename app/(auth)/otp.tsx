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
import OTPInput from '../../components/ui/OTPInput';
// import { mockUser } from '../../constants/mockData';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

// const RETURNING_USER_PHONE = mockUser.phoneNumber.replace('+', '');

export default function OTPScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [tab, setTab] = useState<'sms' | 'tokens'>('sms');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  const isComplete = otp.every((d) => d !== '');

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);


  const handleProceed = () => {
  if (!isComplete) return;
  // After OTP, always go to the PIN/password entry screen.
  // The KYC flow (requirements → DOB → BVN etc.) is only for
  // brand-new account opening, triggered separately.
  router.replace(`/(auth)/login-biometric?phone=${phone}`);
};

  // const handleProceed = () => {
  //   if (!isComplete) return;
  //   if (phone === RETURNING_USER_PHONE) {
  //     router.replace('/(auth)/login-password');
  //   } else {
  //     router.replace('/(auth)/requirements');
  //   }
  // };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(RESEND_SECONDS);
    setOtp(Array(OTP_LENGTH).fill(''));
  };

  // Format phone for display: +234 800 001 0000
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
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={colors.textDark} />
        </TouchableOpacity>

        <Text style={styles.title}>6- digit code</Text>

        {/* from SMS / Tokens toggle — white pill on active, plain on inactive */}
        <View style={styles.tabContainer}>
          {(['sms', 'tokens'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tab === t && styles.tabActive]}
              onPress={() => setTab(t)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabLabel, tab === t && styles.tabLabelActive]}>
                {t === 'sms' ? 'from SMS' : 'Tokens'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.subtitle}>
          Enter the 6 digit code sent to{'\n'}
          <Text style={styles.phoneHighlight}>{formattedPhone}</Text>
        </Text>

        <View style={styles.otpWrapper}>
          <OTPInput length={OTP_LENGTH} value={otp} onChange={setOtp} />
        </View>

        {/* Resend row — "Didn't get the code? Resend in 45 sec" */}
        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Didn't get the code? </Text>
          <TouchableOpacity onPress={handleResend} disabled={secondsLeft > 0}>
            <Text style={styles.resendHighlight}>
              {secondsLeft > 0 ? `Resend in ${secondsLeft} sec` : 'Resend'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Proceed — right-aligned compact button, matches design */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.proceedButton, !isComplete && styles.proceedDisabled]}
            onPress={handleProceed}
            disabled={!isComplete}
            activeOpacity={0.85}
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
    backgroundColor: colors.darkNavy,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    marginTop: spacing.xl,
  },
  backButton: {
    marginTop: 56,
    marginBottom: spacing.xl,
    width: 36,
    height: 36,
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.heading1,
    fontFamily: fontFamily.bold,
    color: colors.white,
    marginBottom: spacing.lg,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.button + 10,
    padding: 3,
    alignSelf: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xxxl,
  },
  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xxxl + 20,
    backgroundColor: colors.white,
  },
  tabActive: {
    backgroundColor: '#eef1fd',
    borderRadius: radius.button - 9,
  },
  tabLabel: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.medium,
    color: colors.textGrey,
  },
  tabLabelActive: {
    fontFamily: fontFamily.semibold,
    color: colors.textDark,
  },
  subtitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.base,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  phoneHighlight: {
    fontFamily: fontFamily.semibold,
    color: colors.white,
  },
  otpWrapper: {
    marginBottom: spacing.xl,
  },

  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  resendText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.base,
  },
  resendHighlight: {
    fontSize: fontSize.body,
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
  proceedDisabled: {
    opacity: 0.5,
  },
  proceedText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    color: colors.white,
  },
});
