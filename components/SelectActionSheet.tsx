// components/SelectActionSheet.tsx
//
// The "Select action" pop-up: a title, a list of choices with an empty round
// button on the left, and Cancel at the bottom. Tapping a choice runs its
// onPress straight away. Measured from design/Frame 10837.pdf.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../constants/typography';
import { layout } from '../constants/layout';
import BottomSheet from './ui/BottomSheet';

export interface SelectActionOption {
  label: string;
  onPress: () => void;
}

interface SelectActionSheetProps {
  visible: boolean;
  title?: string;
  options: SelectActionOption[];
  onCancel: () => void;
}

export default function SelectActionSheet({ visible, title = 'Select action', options, onCancel }: SelectActionSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onCancel} bare topRadius={radius.sheet}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.list}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.label}
            style={styles.row}
            onPress={option.onPress}
            accessibilityRole="button"
          >
            <View style={styles.radio} />
            <Text style={styles.label}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.cancel} onPress={onCancel} accessibilityRole="button">
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: spacing.xxl,
    marginLeft: spacing.xxl,
    fontSize: fontSize.heading2,
    lineHeight: 32,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
  },
  list: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  row: {
    height: layout.optionRowHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.xxl - 1,
  },
  radio: {
    width: layout.radioSize,
    height: layout.radioSize,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.base,
    backgroundColor: colors.white,
  },
  label: {
    marginLeft: 10,
    fontSize: fontSize.large,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
  },
  divider: {
    alignSelf: 'center',
    width: layout.dividerWidth,
    maxWidth: '100%',
    height: 1,
    backgroundColor: colors.lighter,
  },
  cancel: {
    height: layout.cancelAreaHeight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: layout.homeBarSpace,
  },
  cancelText: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.regular,
    color: colors.textFaded,
  },
});
