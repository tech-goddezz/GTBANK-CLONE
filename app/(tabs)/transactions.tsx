// app/(tabs)/transactions.tsx
// Full transaction history with search, quick filter chips, and a
// detailed filter sheet (Date Range / Type / Status) matching the
// Figma "Filter Transaction" modal.

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import { useAccountStore } from '../../store/useAccountStore';
import TransactionItem from '../../components/TransactionItem';
import { formatCurrency } from '../../constants/mockData';
import { Transaction } from '../../types';
import BottomSheet from '../../components/ui/BottomSheet';
import Button from '../../components/Button';

type FilterType = 'all' | 'credit' | 'debit';
type DateRange = '30d' | '3m' | 'custom';
type Status = 'pending' | 'completed' | 'declined';

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Money In', value: 'credit' },
  { label: 'Money Out', value: 'debit' },
];

const DATE_RANGES: { label: string; value: DateRange }[] = [
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 3 Months', value: '3m' },
  { label: 'Custom', value: 'custom' },
];

const STATUSES: { label: string; value: Status }[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Declined', value: 'declined' },
];

// Default state for the advanced filter sheet — separate from the quick
// chips above so opening the sheet doesn't clobber whatever the user
// already picked with one tap.
const DEFAULT_DATE_RANGE: DateRange = '30d';
const DEFAULT_STATUSES: Status[] = ['pending', 'completed', 'declined'];

export default function TransactionsScreen() {
  const { transactions } = useAccountStore();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Sheet visibility + its draft state. We use "draft" values that only
  // get committed to the real applied filters when the user taps
  // "Apply Filters" — so closing the sheet by tapping outside doesn't
  // silently change what's on screen.
  const [sheetVisible, setSheetVisible] = useState(false);
  const [draftDateRange, setDraftDateRange] = useState<DateRange>(DEFAULT_DATE_RANGE);
  const [draftStatuses, setDraftStatuses] = useState<Status[]>(DEFAULT_STATUSES);

  // Applied filters — what's actually affecting the list right now.
  const [appliedDateRange, setAppliedDateRange] = useState<DateRange>(DEFAULT_DATE_RANGE);
  const [appliedStatuses, setAppliedStatuses] = useState<Status[]>(DEFAULT_STATUSES);

  const totals = useMemo(() => {
    const credited = transactions
      .filter((t) => t.type === 'credit' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    const debited = transactions
      .filter((t) => t.type === 'debit' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    return { credited, debited };
  }, [transactions]);

  const toggleDraftStatus = (status: Status) => {
    setDraftStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const openSheet = () => {
    // Load the sheet's draft with whatever's currently applied, so
    // reopening it shows your last choices instead of resetting silently.
    setDraftDateRange(appliedDateRange);
    setDraftStatuses(appliedStatuses);
    setSheetVisible(true);
  };

  const handleApply = () => {
    setAppliedDateRange(draftDateRange);
    setAppliedStatuses(draftStatuses);
    setSheetVisible(false);
  };

  const handleReset = () => {
    setDraftDateRange(DEFAULT_DATE_RANGE);
    setDraftStatuses(DEFAULT_STATUSES);
  };

  // Turns "30d" / "3m" into an actual cutoff date to compare transactions against.
  const isWithinDateRange = (dateString: string): boolean => {
    if (appliedDateRange === 'custom') return true; // no custom picker yet — show everything
    const txDate = new Date(dateString);
    const now = new Date();
    const daysBack = appliedDateRange === '30d' ? 30 : 90;
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - daysBack);
    return txDate >= cutoff;
  };

  const filtered = useMemo(() => {
    return transactions.filter((t: Transaction) => {
      const matchesSearch = t.merchantName
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesQuickFilter =
        activeFilter === 'all' || t.type === activeFilter;
      const matchesStatus = appliedStatuses.includes(t.status);
      const matchesDate = isWithinDateRange(t.date);
      return matchesSearch && matchesQuickFilter && matchesStatus && matchesDate;
    });
  }, [transactions, search, activeFilter, appliedStatuses, appliedDateRange]);

  // Shows a small orange dot on the filter icon whenever the applied
  // filters differ from the defaults — a quiet signal that something
  // is currently narrowing the list.
  const hasActiveAdvancedFilters =
    appliedDateRange !== DEFAULT_DATE_RANGE ||
    appliedStatuses.length !== DEFAULT_STATUSES.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
      </View>

      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <View style={styles.summaryIconWrap}>
            <Ionicons name="arrow-down-outline" size={16} color={colors.green} />
          </View>
          <View>
            <Text style={styles.summaryLabel}>Money In</Text>
            <Text style={[styles.summaryAmount, { color: colors.green }]}>
              {formatCurrency(totals.credited)}
            </Text>
          </View>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <View style={[styles.summaryIconWrap, { backgroundColor: colors.redFaint }]}>
            <Ionicons name="arrow-up-outline" size={16} color={colors.red} />
          </View>
          <View>
            <Text style={styles.summaryLabel}>Money Out</Text>
            <Text style={[styles.summaryAmount, { color: colors.red }]}>
              {formatCurrency(totals.debited)}
            </Text>
          </View>
        </View>
      </View>

      {/* Search bar + filter icon */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={colors.textGrey} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            placeholderTextColor={colors.textFaded}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.textGrey} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.filterIconButton}
          onPress={openSheet}
          accessibilityRole="button"
          accessibilityLabel="Open filter options"
        >
          <Ionicons name="options-outline" size={20} color={colors.textDark} />
          {hasActiveAdvancedFilters && <View style={styles.filterDot} />}
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.filterChip,
              activeFilter === filter.value && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(filter.value)}
          >
            <Text
              style={[
                styles.filterLabel,
                activeFilter === filter.value && styles.filterLabelActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color={colors.borderLight} />
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Advanced filter sheet */}
      <BottomSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        title="Filter Transactions"
      >
        <Text style={styles.sectionLabel}>Date Range</Text>
        <View style={styles.chipGroup}>
          {DATE_RANGES.map((range) => (
            <TouchableOpacity
              key={range.value}
              style={[
                styles.sheetChip,
                draftDateRange === range.value && styles.sheetChipActive,
              ]}
              onPress={() => setDraftDateRange(range.value)}
            >
              <Text
                style={[
                  styles.sheetChipLabel,
                  draftDateRange === range.value && styles.sheetChipLabelActive,
                ]}
              >
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Status</Text>
        <View style={styles.chipGroup}>
          {STATUSES.map((status) => (
            <TouchableOpacity
              key={status.value}
              style={[
                styles.sheetChip,
                draftStatuses.includes(status.value) && styles.sheetChipActive,
              ]}
              onPress={() => toggleDraftStatus(status.value)}
            >
              <Text
                style={[
                  styles.sheetChipLabel,
                  draftStatuses.includes(status.value) && styles.sheetChipLabelActive,
                ]}
              >
                {status.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button label="Apply Filters" onPress={handleApply} style={styles.applyButton} />

        <TouchableOpacity onPress={handleReset} style={styles.resetLink}>
          <Text style={styles.resetLinkText}>Reset Filters</Text>
        </TouchableOpacity>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background ?? colors.white },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.heading1,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
  },
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  summaryIconWrap: {
    width: 32, height: 32, borderRadius: radius.pill,
    backgroundColor: colors.greenFaint, alignItems: 'center', justifyContent: 'center',
  },
  summaryLabel: { fontSize: fontSize.small, fontFamily: fontFamily.regular, color: colors.textGrey },
  summaryAmount: { fontSize: fontSize.body, fontFamily: fontFamily.bold },
  summaryDivider: { width: 1, backgroundColor: colors.borderLight, marginHorizontal: spacing.md },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    height: 46,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  searchInput: { flex: 1, fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textDark },
  filterIconButton: {
    width: 46,
    height: 46,
    borderRadius: radius.input,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.orange,
  },
  filterRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.sm, marginBottom: spacing.md },
  filterChip: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, borderRadius: radius.pill,
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderLight,
  },
  filterChipActive: { backgroundColor: colors.orange, borderColor: colors.orange },
  filterLabel: { fontSize: fontSize.small, fontFamily: fontFamily.medium, color: colors.textGrey },
  filterLabelActive: { color: colors.white },
  listContent: {
    backgroundColor: colors.white, marginHorizontal: spacing.lg, borderRadius: radius.card,
    overflow: 'hidden', paddingBottom: spacing.xxxl,
  },
  separator: { height: 1, backgroundColor: colors.borderLight, marginLeft: 74 },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxl, gap: spacing.md },
  emptyText: { fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textGrey },
  sectionLabel: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    color: colors.textDark,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  sheetChip: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.pill,
    backgroundColor: colors.pageBackground, borderWidth: 1, borderColor: colors.borderLight,
  },
  sheetChipActive: { backgroundColor: colors.orangeFaint, borderColor: colors.orange },
  sheetChipLabel: { fontSize: fontSize.small, fontFamily: fontFamily.medium, color: colors.textGrey },
  sheetChipLabelActive: { color: colors.orange, fontFamily: fontFamily.semibold },
  applyButton: { marginTop: spacing.lg },
  resetLink: { alignItems: 'center', marginTop: spacing.lg },
  resetLinkText: { fontSize: fontSize.body, fontFamily: fontFamily.medium, color: colors.textGrey },
});