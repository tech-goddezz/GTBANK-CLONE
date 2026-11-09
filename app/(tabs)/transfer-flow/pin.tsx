// app/(tabs)/transfer-flow/pin.tsx
//
// "Enter your 4 digit code" (S59–S65 in "Screens inside the home screen.pdf"):
// opened by Confirm Transfer on the Initiating Transfer page. Pay checks your
// 4-digit PIN with the app's existing PIN check, then sends the money (the same
// send code that used to run on Confirm Transfer) and opens the progress screen.
//
// "Pay with Fingerprint instead" and the fingerprint picture open the same
// look-only fingerprint pop-up as the login screen; they don't pay. A real
// fingerprint check would need an extra package.

import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import colors from '../../../constants/colors';
import { fontSize, fontFamily, lineHeight } from '../../../constants/typography';
import { layout } from '../../../constants/layout';
import Button from '../../../components/Button';
import FingerprintSheet from '../../../components/FingerprintSheet';
import { sendMoney, getCurrentUserId, signInWithPin } from '../../../services/auth';

const fingerprint = require('../../../assets/images/fingerprint.png');

const PIN_LENGTH = 4;

// Stops Chrome drawing its orange focus ring around the box.
const noOutline = Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null;

export default function PayPinScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    accountNumber: string; accountName: string;
    bank: string; amount: string; narration: string;
  }>();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sheetVisible, setSheetVisible] = useState(false);

  const amountNum = parseFloat(params.amount ?? '0') || 0;

  const handlePay = async () => {
    if (pin.length !== PIN_LENGTH) {
      setError('Enter your 4-digit code');
      return;
    }
    setError('');
    setLoading(true);

    const check = await signInWithPin('', pin);
    if (!check.success) {
      setLoading(false);
      setError(check.message || 'Incorrect PIN');
      return;
    }

    const senderId = await getCurrentUserId();
    const result = await sendMoney(senderId, params.accountNumber ?? '', amountNum, params.narration ?? '');
    setLoading(false);

    if (result.success) {
      router.replace(
        `/(tabs)/transfer-flow/processing?amount=${amountNum}&accountName=${params.accountName}&accountNumber=${params.accountNumber}&bank=${params.bank}&narration=${params.narration}`
      );
    } else {
      setError(result.message || 'Transfer failed. Please try again.');
    }
  };

  const r = layout.payPinRingRadius;
  const c = layout.payPinRing / 2;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, layout.statusBarHeight) }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Enter your 4 digit code.</Text>
        <Text style={styles.subtitle}>
          Make sure you confirm your transaction before entering the code.
        </Text>

        <TextInput
          style={[styles.box, noOutline]}
          placeholder="Enter your transaction code "
          placeholderTextColor={colors.textGrey}
          value={pin}
          onChangeText={(t) => {
            setPin(t.replace(/[^0-9]/g, '').slice(0, PIN_LENGTH));
            if (error) setError('');
          }}
          keyboardType="number-pad"
          maxLength={PIN_LENGTH}
          secureTextEntry
        />

        <Button label="Pay" onPress={handlePay} loading={loading} style={styles.payButton} />
        {!!error && <Text style={styles.error}>{error}</Text>}

        <Text style={[styles.note, styles.firstNote]}>
          Or use your fingerprint for your secure transactions.{' '}
        </Text>
        <Text style={[styles.note, styles.secondNote]}>Make sure your transactions are secure.</Text>

        <TouchableOpacity onPress={() => setSheetVisible(true)} accessibilityRole="button">
          <Text style={styles.link}>Pay with Fingerprint instead</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ringWrap}
          onPress={() => setSheetVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Pay with fingerprint"
        >
          <Svg width={layout.payPinRing} height={layout.payPinRing} style={StyleSheet.absoluteFill}>
            {/* Dashed ring: 8 dashes, one centred at each 45° */}
            <Circle
              cx={c}
              cy={c}
              r={r}
              stroke={colors.fingerprintRing}
              strokeWidth={layout.payPinRingStroke}
              strokeLinecap="round"
              strokeDasharray={`${layout.payPinRingDash} ${layout.payPinRingGap}`}
              strokeDashoffset={layout.payPinRingDash / 2}
              fill="none"
            />
          </Svg>
          <Image source={fingerprint} style={styles.picture} accessibilityIgnoresInvertColors />
        </TouchableOpacity>
      </ScrollView>

      <FingerprintSheet visible={sheetVisible} onCancel={() => setSheetVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.tabBarHeight,
  },
  title: {
    marginTop: layout.payPinTitleTop,
    marginLeft: 1,
    fontSize: fontSize.heading2,
    lineHeight: lineHeight.heading2,
    fontFamily: fontFamily.medium,
    color: colors.black,
  },
  subtitle: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  box: {
    marginTop: layout.payPinBoxTop,
    height: layout.inputHeight,
    paddingHorizontal: layout.screenPadding,
    backgroundColor: colors.inputBackground,
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  payButton: { marginTop: layout.payPinButtonTop },
  error: {
    marginTop: 8,
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.red,
  },
  note: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  firstNote: { marginTop: layout.payPinNoteTop },
  secondNote: { marginTop: layout.payPinNoteGap },
  link: {
    marginTop: layout.payPinLinkTop,
    textAlign: 'center',
    fontSize: fontSize.large,
    lineHeight: layout.payPinLinkLineHeight,
    fontFamily: fontFamily.regular,
    color: colors.textFaded,
  },
  ringWrap: {
    marginTop: layout.payPinRingTop,
    width: layout.payPinRing,
    height: layout.payPinRing,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  picture: {
    width: layout.payPinPicture,
    height: layout.payPinPicture,
  },
});
