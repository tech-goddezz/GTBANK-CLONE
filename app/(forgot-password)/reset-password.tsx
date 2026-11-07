// Account number + phone number entry to identify the account.
// Matches the second screen of "forget password.pdf": two white boxes with a
// light grey outline. The phone box reuses the flag / +234 / arrow look of
// the "Hello!" phone screen.

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Polyline } from 'react-native-svg';
import colors from '../../constants/colors';
import { fontSize, fontFamily, lineHeight, spacing } from '../../constants/typography';
import { layout } from '../../constants/layout';
import Button from '../../components/Button';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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

        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter the account number and phone number associated with your account. We'll send you a code to reset your password.
        </Text>

        <View style={[styles.box, styles.firstBox]}>
          <TextInput
            style={[styles.input, styles.accountInput]}
            placeholder="Account number"
            placeholderTextColor={colors.textGrey}
            value={accountNumber}
            onChangeText={(t) => {
              setAccountNumber(t.replace(/[^0-9]/g, '').slice(0, 10));
              if (errors.account) setErrors((e) => ({ ...e, account: '' }));
            }}
            keyboardType="number-pad"
            maxLength={10}
          />
        </View>
        {!!errors.account && <Text style={styles.errorText}>{errors.account}</Text>}

        {/* Flag, +234 and arrow, then the number — same look as the "Hello!" screen */}
        <View style={[styles.box, styles.secondBox]}>
          <View style={styles.phoneRow}>
            <View style={styles.flag}>
              <View style={[styles.flagStripe, { backgroundColor: colors.flagGreen }]} />
              <View style={[styles.flagStripe, { backgroundColor: colors.white }]} />
              <View style={[styles.flagStripe, { backgroundColor: colors.flagGreen }]} />
            </View>
            <Text style={styles.dialCode}>+234</Text>
            <Svg
              style={styles.chevron}
              width={layout.dialChevronWidth}
              height={layout.dialChevronHeight}
              viewBox="0 0 10 6"
            >
              <Polyline points="1,1 5,5 9,1" fill="none" stroke={colors.textDark} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <TextInput
              style={[styles.input, styles.phoneInput]}
              placeholder="Mobile number"
              placeholderTextColor={colors.textGrey}
              value={phone}
              onChangeText={(t) => {
                setPhone(t.replace(/[^0-9]/g, '').slice(0, 11));
                if (errors.phone) setErrors((e) => ({ ...e, phone: '' }));
              }}
              keyboardType="phone-pad"
              maxLength={11}
            />
          </View>
        </View>
        {!!errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

        <Button label="Proceed" onPress={handleProceed} style={styles.proceed} />
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
    fontFamily: fontFamily.medium,
    color: colors.black,
    marginTop: layout.codeTitleGap,
  },
  subtitle: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.paragraph,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: layout.resetSubtitleGap,
  },
  box: {
    width: layout.resetBoxWidth,
    height: layout.resetBoxHeight,
    marginLeft: layout.resetBoxLeft,
    borderWidth: layout.resetBoxBorder,
    borderColor: colors.inputOutline,
    justifyContent: 'center',
  },
  firstBox: { marginTop: layout.resetBoxGap },
  secondBox: { marginTop: layout.resetBoxSpacing },
  input: {
    height: lineHeight.phoneRow,
    padding: 0,
    borderWidth: 0,
    fontSize: fontSize.large,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
    outlineStyle: 'none',
  } as any,
  accountInput: { marginLeft: layout.resetTextLeft },
  phoneRow: { height: lineHeight.phoneRow, marginLeft: layout.resetPhoneShift },
  flag: { position: 'absolute', left: layout.flagLeft, top: layout.flagTop, flexDirection: 'row', height: layout.flagHeight },
  flagStripe: { width: layout.flagStripeWidth, height: layout.flagHeight },
  dialCode: {
    position: 'absolute', left: layout.dialCodeLeft, top: 0,
    fontSize: fontSize.large, lineHeight: lineHeight.phoneRow, fontFamily: fontFamily.medium, color: colors.textDark,
  },
  chevron: { position: 'absolute', left: layout.dialChevronLeft, top: layout.dialChevronTop },
  phoneInput: { position: 'absolute', left: layout.mobileInputLeft, right: 0, top: 0 },
  errorText: { fontSize: fontSize.small, fontFamily: fontFamily.regular, color: colors.red, marginTop: spacing.xs },
  proceed: {
    alignSelf: 'flex-end',
    width: layout.phoneProceedWidth,
    paddingHorizontal: 0,
    marginTop: layout.resetProceedGap,
    marginRight: layout.resetProceedRight,
  },
});
