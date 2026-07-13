// components/ui/OTPInput.tsx
// A reusable 6-digit (or custom length) code input.
// Handles auto-advancing to the next box as you type, and auto-going-back
// to the previous box on backspace — so any screen that needs a numeric
// code entry (OTP, PIN reset, etc.) can just drop this in instead of
// rebuilding the focus-management logic from scratch.

import React, { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import { fontSize, fontFamily, radius } from '../../constants/typography';

interface OTPInputProps {
  // How many digit boxes to render. Defaults to 6 since that's what
  // GTCO's OTP flow uses, but this lets a 4-digit PIN reuse it too.
  length?: number;
  // The current digits, one per box. Owned by the parent screen (not
  // this component) so the parent can read the full code, validate it,
  // and reset it whenever it needs to.
  value: string[];
  // Called every time a digit changes. Always sends back the FULL array,
  // not just the one digit — keeps the parent's state update simple.
  onChange: (otp: string[]) => void;
}

export default function OTPInput({ length = 6, value, onChange }: OTPInputProps) {
  // We keep a ref to every box so we can imperatively call .focus() on
  // whichever one should get keyboard focus next. This can't be done
  // with plain state — focus is a direct instruction to the OS keyboard.
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    // Strip anything that isn't a digit, and only keep the last character
    // typed — this guards against paste events dumping multiple digits
    // into one box.
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...value];
    newOtp[index] = digit;
    onChange(newOtp);

    // Auto-advance: the moment a digit is entered, jump to the next box.
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    // If the box is already empty and the user hits backspace again,
    // jump back a box — this mimics how native OTP inputs feel on iOS/Android.
    if (key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {Array.from({ length }).map((_, index) => {
        const digit = value[index] ?? '';
        return (
          <TextInput
            key={index}
            ref={(ref) => { inputRefs.current[index] = ref; }}
            style={[styles.box, digit !== '' && styles.boxFilled]}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            selectTextOnFocus
            accessibilityLabel={`Digit ${index + 1} of ${length}`}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    width: 48,
    height: 56,
    borderRadius: radius.input,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    backgroundColor: colors.inputBackground,
    fontSize: fontSize.heading2,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
  },
  boxFilled: {
    borderColor: colors.orange,
    backgroundColor: colors.white,
  },
});