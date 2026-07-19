// components/Button.tsx
//
// The main button for the whole app. Three looks:
//   "primary"   — solid orange fill, white text (main CTAs like "Continue", "Send")
//   "secondary" — white with an orange border (less urgent actions)
//   "ghost"     — no background, no border, just orange text (links, skippable actions)

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import colors from '../constants/colors';
import { fontSize, fontFamily, radius, spacing } from '../constants/typography';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  // Pick the right container and text style based on the variant
  const containerStyle = [
    styles.base,
    variant === 'primary' && styles.primaryContainer,
    variant === 'secondary' && styles.secondaryContainer,
    variant === 'ghost' && styles.ghostContainer,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const labelStyle: TextStyle = [
    styles.label,
    variant === 'primary' && styles.primaryLabel,
    variant === 'secondary' && styles.secondaryLabel,
    variant === 'ghost' && styles.ghostLabel,
  ] as unknown as TextStyle;

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        // Show a spinner instead of the label while something is processing
        <ActivityIndicator
          color={variant === 'primary' ? colors.white : colors.orange}
          size="small"
        />
      ) : (
        <Text style={labelStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 44,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  primaryContainer: {
    backgroundColor: colors.orange,
  },
  secondaryContainer: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.orange,
  },
  ghostContainer: {
    backgroundColor: colors.transparent,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.semibold,
  },
  primaryLabel: {
    color: colors.white,
  },
  secondaryLabel: {
    color: colors.orange,
  },
  ghostLabel: {
    color: colors.orange,
  },
});