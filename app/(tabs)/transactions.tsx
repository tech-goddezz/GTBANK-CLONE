// app/(tabs)/transactions.tsx
// Full transaction history with search and filter chips.

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

// Filter options
type FilterType = 'all' | 'credit' | 'debit';

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Money In', value: 'credit' },
  { label: 'Money Out', value: 'debit' },
];

export default function TransactionsScreen() {
  const { transactions } = useAccountStore();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Calculate totals for the summary bar
  const totals = useMemo(() => {
    const credited = transactions
      .filter((t) => t.type === 'credit' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    const debited = transactions
      .filter((t) => t.type === 'debit' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    return { credited, debited };
  }, [transactions]);

  // Apply search + filter
  const filtered = useMemo(() => {
    return transactions.filter((t: Transaction) => {
      const matchesSearch = t.merchantName
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFilter =
        activeFilter === 'all' || t.type === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [transactions, search, activeFilter]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
      </View>

      {/* Summary bar */}
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

      {/* Search bar */}
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

      {/* Filter chips */}
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

      {/* Transaction list */}
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
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background ?? colors.white,
  },
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
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryIconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.greenFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryLabel: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  summaryAmount: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.bold,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    height: 46,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  filterChipActive: {
    backgroundColor: colors.orange,
    borderColor: colors.orange,
  },
  filterLabel: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.medium,
    color: colors.textGrey,
  },
  filterLabelActive: {
    color: colors.white,
  },
  listContent: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: radius.card,
    overflow: 'hidden',
    paddingBottom: spacing.xxxl,
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 74,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
});