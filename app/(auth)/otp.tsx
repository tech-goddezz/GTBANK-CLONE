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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, lineHeight, spacing } from '../../constants/typography';
import { layout } from '../../constants/layout';
import OTPInput from '../../components/ui/OTPInput';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

export default function OTPScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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

  // The design has no Proceed button: the screen moves on by itself
  // as soon as the 6th digit is typed.
  useEffect(() => {
    if (!isComplete) return;
    // After the code, go to the "Enter password" keypad screen (as in the design).
    // The KYC flow (requirements → DOB → BVN etc.) is only for
    // brand-new account opening, triggered separately.
    router.replace(`/(auth)/login-password?phone=${phone}`);
  }, [isComplete]);

  const handleResend = () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(RESEND_SECONDS);
    setOtp(Array(OTP_LENGTH).fill(''));
  };

  // Show the number as +234 801 234 5678
  const local = (phone ?? '').replace(/^234/, '');
  const formattedPhone = local
    ? `+234 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`
    : '+234 800 001 0000';

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

        {/* from SMS / Tokens switch — the chosen option sits in a light grey block */}
        <View style={styles.tabContainer}>
          {(['sms', 'tokens'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.tab,
                { width: t === 'sms' ? layout.codeTabSmsWidth : layout.codeTabTokensWidth },
                tab === t && styles.tabActive,
              ]}
              onPress={() => setTab(t)}
              activeOpacity={0.7}
            >
              <Text style={styles.tabLabel}>{t === 'sms' ? 'from SMS' : 'Tokens'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.subtitle}>
          <Text style={styles.subtitleFirstLine}>Enter the 6 digit code sent to</Text>{'\n'}
          <Text style={styles.phoneHighlight}>{formattedPhone}</Text>
        </Text>

        <View style={styles.otpWrapper}>
          <OTPInput length={OTP_LENGTH} value={otp} onChange={setOtp} autoFocus />
        </View>

        {/* "Didn't get the code? Resend in 45 sec" */}
        {secondsLeft > 0 ? (
          <Text style={styles.resendText}>
            Didn't get the code? Resend <Text style={styles.resendOrange}>in </Text>
            <Text style={styles.resendBold}>{secondsLeft} sec</Text>
          </Text>
        ) : (
          <Text style={styles.resendText}>
            Didn't get the code?{' '}
            <Text style={styles.resendBold} onPress={handleResend}>Resend</Text>
          </Text>
        )}
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
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.xxxl,
  },
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: layout.contentWidth,
    height: layout.codeTabsHeight,
    marginLeft: 1,
    marginTop: layout.codeTabsGap,
    paddingHorizontal: layout.codeTabsPadH,
    paddingVertical: layout.codeTabsPadV,
    backgroundColor: colors.white,
  },
  tab: {
    height: layout.codeTabHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: colors.segmentActive,
  },
  tabLabel: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  subtitle: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: layout.codeSubtitleGap,
  },
  subtitleFirstLine: {
    fontFamily: fontFamily.medium,
  },
  phoneHighlight: {
    color: colors.textDark,
  },
  otpWrapper: {
    marginTop: layout.codeBoxesGap,
  },
  resendText: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: layout.codeResendGap,
  },
  resendOrange: {
    color: colors.orange,
  },
  resendBold: {
    fontFamily: fontFamily.bold,
    color: colors.orange,
  },
});
