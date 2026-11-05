// components/FilterTransactionsSheet.tsx
//
// The "Filter Transactions" pop-up on History. There are three groups of pill
// buttons (date range, type, status), and one pill per group can be picked.
// Tapping a picked pill again un-picks it. "Reset Filters" clears every group,
// which is the design's "Reset filters" state. Measured from design/Menu.pdf.

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import colors from '../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../constants/typography';
import { layout } from '../constants/layout';
import { closeIconPath, calendarIconPaths } from '../constants/filterIcons';
import BottomSheet from './ui/BottomSheet';
import Button from './Button';

export type DateRangeFilter = '30days' | '3months' | 'custom';

export interface TransactionFilters {
  dateRange: DateRangeFilter | null;
  type: 'credit' | 'debit' | null;
  status: 'pending' | 'completed' | 'declined' | null;
}

export const noFilters: TransactionFilters = { dateRange: null, type: null, status: null };

interface FilterTransactionsSheetProps {
  visible: boolean;
  // The filters currently in use, so the pop-up opens showing them.
  filters: TransactionFilters;
  onApply: (filters: TransactionFilters) => void;
  onClose: () => void;
}

const dateOptions: { value: DateRangeFilter; label: string }[] = [
  { value: '30days', label: 'Last 30 Days' },
  { value: '3months', label: 'Last 3 Months' },
  { value: 'custom', label: 'Custom' },
];
const typeOptions = [
  { value: 'credit' as const, label: 'Credit' },
  { value: 'debit' as const, label: 'Debit' },
];
const statusOptions = [
  { value: 'pending' as const, label: 'Pending' },
  { value: 'completed' as const, label: 'Completed' },
  { value: 'declined' as const, label: 'Declined' },
];

export default function FilterTransactionsSheet({ visible, filters, onApply, onClose }: FilterTransactionsSheetProps) {
  // Choices made in the pop-up only take effect when "Apply Filters" is tapped.
  const [draft, setDraft] = useState<TransactionFilters>(filters);

  useEffect(() => {
    if (visible) setDraft(filters);
  }, [visible, filters]);

  // Pick a pill, or un-pick it if it's already picked.
  const toggle = <K extends keyof TransactionFilters>(group: K, value: TransactionFilters[K]) => {
    setDraft((prev) => ({ ...prev, [group]: prev[group] === value ? null : value }));
  };

  const renderPill = <K extends keyof TransactionFilters>(
    group: K,
    value: NonNullable<TransactionFilters[K]>,
    label: string,
    pillStyle: ViewStyle,
  ) => {
    const selected = draft[group] === value;
    const tint = selected ? colors.orangeDark : colors.textLabel;
    return (
      <TouchableOpacity
        key={String(value)}
        style={[styles.pill, pillStyle, selected && styles.pillSelected]}
        onPress={() => toggle(group, value as TransactionFilters[K])}
        accessibilityRole="button"
        accessibilityState={{ selected }}
      >
        {value === 'custom' && (
          <Svg width={13} height={14.34} viewBox="0 0 13 14.34" style={styles.calendar}>
            <Path d={calendarIconPaths.dash} fill={tint} />
            <Path d={calendarIconPaths.outline} fill={tint} fillRule="evenodd" />
          </Svg>
        )}
        <Text style={[styles.pillText, { color: tint }]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} bare topRadius={radius.sheet}>
      <View style={styles.header}>
        <Text style={styles.title}>Filter Transactions</Text>
        <TouchableOpacity
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Svg width={layout.iconSize} height={layout.iconSize} viewBox="0 0 24 24">
            <Path d={closeIconPath} fill={colors.textDark} />
          </Svg>
        </TouchableOpacity>
      </View>

      <Text style={[styles.groupLabel, styles.firstGroupLabel]}>DATE RANGE</Text>
      <View style={[styles.pillRow, styles.firstPillRow]}>
        {dateOptions.map((o) => renderPill('dateRange', o.value, o.label, styles.pillShared))}
      </View>

      <Text style={[styles.groupLabel, styles.typeGroupLabel]}>TRANSACTION TYPE</Text>
      <View style={styles.pillRow}>
        {typeOptions.map((o) => renderPill('type', o.value, o.label, styles.pillNarrow))}
      </View>

      <Text style={[styles.groupLabel, styles.statusGroupLabel]}>STATUS</Text>
      <View style={styles.pillRow}>
        {statusOptions.map((o) => renderPill('status', o.value, o.label, styles.pillShared))}
      </View>

      <View style={styles.divider} />

      <Button label="Apply Filters" size="large" onPress={() => onApply(draft)} style={styles.applyButton} />
      <Button label="Reset Filters" variant="ghostGrey" onPress={() => setDraft(noFilters)} style={styles.resetButton} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: fontSize.heading2,
    lineHeight: 32,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
  },
  groupLabel: {
    marginLeft: spacing.xl,
    fontSize: fontSize.small,
    lineHeight: 16,
    fontFamily: fontFamily.regular,
    color: colors.textLabel,
  },
  // Gaps between the groups, measured from the design.
  firstGroupLabel: { marginTop: 33.5 },
  typeGroupLabel: { marginTop: 22.5 },
  statusGroupLabel: { marginTop: 20.5 },
  pillRow: {
    flexDirection: 'row',
    gap: layout.filterPillGap,
    paddingHorizontal: layout.filterSidePadding,
    marginTop: 9.5,
  },
  firstPillRow: { marginTop: 11.5 },
  pill: {
    height: layout.filterPillHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.textFaded,
    borderRadius: radius.filterPill,
  },
  pillShared: { flex: 1 },
  pillNarrow: { width: layout.filterPillWidthNarrow },
  pillSelected: { borderColor: colors.orangeDark },
  pillText: {
    fontSize: fontSize.small,
    lineHeight: 16,
    fontFamily: fontFamily.regular,
  },
  calendar: { marginRight: 9 },
  divider: {
    alignSelf: 'center',
    width: layout.dividerWidth,
    maxWidth: '100%',
    height: 1,
    marginTop: 35,
    backgroundColor: colors.lighter,
  },
  applyButton: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.xl,
  },
  resetButton: {
    height: layout.cancelAreaHeight,
    marginBottom: layout.homeBarSpace,
  },
});
