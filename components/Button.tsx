// components/Button.tsx
//
// The main button for the whole app. Five looks:
//   "primary"   — solid orange fill, white text (main CTAs like "Continue", "Send")
//   "grey"      — solid grey fill, black text (onboarding "Next")
//   "secondary" — white with an orange border (less urgent actions)
//   "ghost"     — no background, no border, just orange text (links, skippable actions)
//   "ghostGrey" — same as ghost, but grey text ("Reset Filters")
//
// And three sizes:
//   "medium" — 46 tall, square corners (almost every button)
//   "large"  — 56 tall, rounded corners, bold text ("Apply Filters")
//   "small"  — 32 tall, square corners ("Authenticating fingerprint")

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
import { layout } from '../constants/layout';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'grey' | 'secondary' | 'ghost' | 'ghostGrey';
  size?: 'medium' | 'large' | 'small';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  // Pick the right container and text style based on the variant
  const containerStyle = [
    styles.base,
    size === 'large' && styles.largeContainer,
    size === 'small' && styles.smallContainer,
    variant === 'primary' && styles.primaryContainer,
    variant === 'grey' && styles.greyContainer,
    variant === 'secondary' && styles.secondaryContainer,
    (variant === 'ghost' || variant === 'ghostGrey') && styles.ghostContainer,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const labelStyle: TextStyle = [
    styles.label,
    size === 'large' && styles.largeLabel,
    variant === 'primary' && styles.primaryLabel,
    variant === 'grey' && styles.greyLabel,
    variant === 'secondary' && styles.secondaryLabel,
    variant === 'ghost' && styles.ghostLabel,
    variant === 'ghostGrey' && styles.ghostGreyLabel,
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
    height: layout.buttonHeight,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  largeContainer: {
    height: layout.buttonHeightLarge,
    borderRadius: radius.buttonLarge,
  },
  smallContainer: {
    height: layout.buttonHeightSmall,
    paddingHorizontal: spacing.lg,
  },
  primaryContainer: {
    backgroundColor: colors.orange,
  },
  greyContainer: {
    backgroundColor: colors.light,
  },
  secondaryContainer: {
    backgroundColor: colors.white,
    borderWidth: 1,
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
    fontFamily: fontFamily.medium,
  },
  largeLabel: {
    fontFamily: fontFamily.bold,
  },
  primaryLabel: {
    color: colors.white,
  },
  greyLabel: {
    color: colors.black,
  },
  secondaryLabel: {
    color: colors.orange,
  },
  ghostLabel: {
    color: colors.orange,
  },
  ghostGreyLabel: {
    color: colors.textFaded,
    fontFamily: fontFamily.regular,
  },
});