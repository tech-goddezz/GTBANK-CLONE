// app/(tabs)/history.tsx
//
// The History screen — reached by tapping the "History" button on Home.
// Registered inside the (tabs) group with `href: null` (see _layout.tsx)
// so it keeps the bottom tab bar visible without adding a 5th tab button.
//
// Two states live in this one screen, matching the two "History" /
// "Searching" frames in the design:
//   - default: TODAY / YESTERDAY grouped transaction list
//   - search focused: same list, filtered as the user types, keyboard up
// There's no separate "searching" screen — it's just this screen's search
// input focused, which is why the design shows it as two frames but it's
// one file here.

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import { layout } from '../../constants/layout';
import { historyIcons } from '../../constants/historyIcons';
import ScreenHeader from '../../components/ScreenHeader';
import { useEffect } from 'react';
import { fetchTransactions, getCurrentUserId } from '../../services/auth';
import { formatDate } from '../../constants/mockData';
import TransactionItem from '../../components/TransactionItem';
import FilterTransactionsSheet, { TransactionFilters, noFilters } from '../../components/FilterTransactionsSheet';

// How far back each date-range filter reaches, in days. "Custom" has no
// date chooser in the design yet, so it doesn't narrow the list.
const dateRangeDays: Record<string, number> = { '30days': 30, '3months': 91 };

function DesignIcon({ icon, color }: { icon: { width: number; height: number; path: string; fillRule: 'nonzero' | 'evenodd' }; color: string }) {
  return (
    <Svg width={icon.width} height={icon.height} viewBox={`0 0 ${icon.width} ${icon.height}`}>
      <Path d={icon.path} fill={color} fillRule={icon.fillRule} />
    </Svg>
  );
}

export default function HistoryScreen() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<TransactionFilters>(noFilters);
  const [showFilters, setShowFilters] = useState(false);
  // While the search box is tapped (S34) it gets an orange outline, and the list
  // stays hidden until the user types something.
  const [searchFocused, setSearchFocused] = useState(false);
  const hideList = searchFocused && query.trim() === '';

useEffect(() => {
  const loadTransactions = async () => {
    const id = await getCurrentUserId();
    const result = await fetchTransactions(id);
    if (result.success) {
      const formatted = result.transactions.map((t: any) => ({
        id: t.id,
        merchantName: t.receiver_account_number,
        category: t.narration || 'Transfer',
        amount: t.amount,
        type: 'debit',
        status: 'completed',
        date: t.created_at,
      }));
      setTransactions(formatted);
    }
  };
  loadTransactions();
}, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const days = filters.dateRange ? dateRangeDays[filters.dateRange] : undefined;
    const earliest = days ? Date.now() - days * 24 * 60 * 60 * 1000 : undefined;
    return transactions.filter((t) => {
      if (q && !t.merchantName.toLowerCase().includes(q)) return false;
      if (filters.type && t.type !== filters.type) return false;
      if (filters.status && t.status !== filters.status) return false;
      if (earliest && new Date(t.date).getTime() < earliest) return false;
      return true;
    });
  }, [transactions, query, filters]);

  // Group into TODAY / YESTERDAY / date sections — same logic Home used to
  // have, moved here since grouping belongs on History, not Home.
  const sections = useMemo(() => {
    return filtered.reduce<{ label: string; items: typeof filtered }[]>((acc, txn) => {
      const label = formatDate(txn.date).toUpperCase();
      const existing = acc.find((s) => s.label === label);
      if (existing) {
        existing.items.push(txn);
      } else {
        acc.push({ label, items: [txn] });
      }
      return acc;
    }, []);
  }, [filtered]);

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="History"
        subtitle="Review and manage your financial activity"
        showBack={false}
        onBellPress={() => router.push('/(tabs)/notifications')}
      />

      {/* Search box and round filter button */}
      <View style={styles.searchRow}>
        <View style={[styles.searchBar, searchFocused && styles.searchBarFocused]}>
          <DesignIcon icon={historyIcons.search} color={colors.textDark} />
          <TextInput
            style={styles.searchInput}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder={searchFocused ? '' : 'Search'}
            placeholderTextColor={colors.textPlaceholder}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
          accessibilityRole="button"
          accessibilityLabel="Filter transactions"
        >
          <DesignIcon icon={historyIcons.filter} color={colors.textDark} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {hideList ? null : sections.length === 0 ? (
          <Text style={styles.emptyText}>No transactions found</Text>
        ) : (
          sections.map((section, i) => (
            <View key={section.label}>
              <Text style={[styles.dateLabel, i > 0 && styles.dateLabelLater]}>{section.label}</Text>
              <View style={styles.transactionsList}>
                {section.items.map((t) => (
                  <TransactionItem key={t.id} transaction={t} variant="history" />
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <FilterTransactionsSheet
        visible={showFilters}
        filters={filters}
        onApply={(chosen) => {
          setFilters(chosen);
          setShowFilters(false);
        }}
        onClose={() => setShowFilters(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.historySearchGap,
    marginTop: layout.historySearchTop,
    marginHorizontal: layout.historySideMargin,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.historySearchTextGap,
    height: layout.historySearchHeight,
    paddingLeft: layout.historySearchIconLeft,
    backgroundColor: colors.lighter,
    borderRadius: radius.searchBox,
    // Invisible until tapped, so the box doesn't change size
    borderWidth: 1,
    borderColor: colors.lighter,
  },
  searchBarFocused: { borderColor: colors.searchFocusBorder },
  searchInput: {
    flex: 1,
    alignSelf: 'stretch',
    fontSize: fontSize.large,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
    outlineStyle: 'none',
  } as any,
  filterButton: {
    width: layout.historySearchHeight,
    height: layout.historySearchHeight,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    // Soft grey glow all round, as in the design
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xxxl },
  dateLabel: {
    fontSize: fontSize.body,
    lineHeight: 17,
    fontFamily: fontFamily.regular,
    color: colors.textDateHeading,
    paddingLeft: layout.historyHeadingLeft,
    marginTop: layout.historyFirstHeadingTop,
    marginBottom: layout.historyHeadingGap,
  },
  dateLabelLater: { marginTop: layout.historyHeadingTop },
  transactionsList: {
    marginHorizontal: layout.historySideMargin,
    gap: layout.homeListGap,
  },
  emptyText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    textAlign: 'center',
    padding: spacing.xl,
  },
});
