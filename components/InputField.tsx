// components/InputField.tsx
//
// The standard text input used across the whole app —
// phone number screen, transfer amount, narration, everything.
// It handles its own focus state (border turns orange when active)
// and shows a red error message below when something's wrong.

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import colors from '../constants/colors';
import { fontSize, fontFamily, radius, spacing } from '../constants/typography';

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

  export default function InputField({
  label,
  error,
  containerStyle,
  style,
  ...rest
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
  style={[
    styles.input,
    focused && styles.inputFocused,
    !!error && styles.inputError,
    style,
  ]}
        placeholderTextColor={colors.textFaded}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />

      {/* Only renders when there's an error message to show */}
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.medium,
    color: colors.textGrey,
    marginBottom: spacing.xs,
  },
  input: {
    height: 52,
    backgroundColor: colors.inputBackground,
    borderRadius: radius.input,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    paddingHorizontal: spacing.lg,
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
  },
  inputFocused: {
    borderColor: colors.borderActive,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.red,
  },
  errorText: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.red,
    marginTop: spacing.xs,
  },
});