// components/StatusBadge.tsx
//
// A small pill-shaped badge used on transaction details and filter sheets.
// Green for completed, amber for pending, red for declined.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../constants/typography';

interface StatusBadgeProps {
  status: 'completed' | 'pending' | 'declined';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    completed: {
      bg: colors.greenFaint,
      text: colors.green,
      label: 'Completed',
    },
    pending: {
      bg: colors.amberFaint,
      text: colors.amber,
      label: 'Pending',
    },
    declined: {
      bg: colors.redFaint,
      text: colors.red,
      label: 'Declined',
    },
  };

  const { bg, text, label } = config[status];

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.semibold,
  },
});