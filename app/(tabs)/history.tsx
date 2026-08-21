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
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, fontWeight, radius } from '../../constants/typography';
import { useEffect } from 'react';
import { fetchTransactions, getCurrentUserId } from '../../services/auth';
import { formatDate } from '../../constants/mockData';
import TransactionItem from '../../components/TransactionItem';

export default function HistoryScreen() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
const [query, setQuery] = useState('');

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
    if (!query.trim()) return transactions;
    const q = query.trim().toLowerCase();
    return transactions.filter((t) => t.merchantName.toLowerCase().includes(q));
  }, [transactions, query]);

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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
           
          </TouchableOpacity>
          <View style={styles.headerTitleBlock}>
            <Text style={styles.title}>History</Text>
            <Text style={styles.subtitle}>Review and manage your financial activity</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={22} color={colors.textDark}/>
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={colors.textFaded} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor={colors.textFaded}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={18} color={colors.textDark} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {sections.length === 0 ? (
          <Text style={styles.emptyText}>No transactions found</Text>
        ) : (
          sections.map((section) => (
            <View key={section.label}>
              <Text style={styles.dateLabel}>{section.label}</Text>
              <View style={styles.transactionsList}>
                {section.items.map((t) => (
                  <TransactionItem key={t.id} transaction={t} />
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.pageBackground },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.pageBackground,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },

  headerTitleBlock: { 
    flex: 1,
    marginLeft: -10,
   },

  title: {
    fontSize: fontSize.heading1,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
    marginTop: spacing.xxxl + 10,
  },
  subtitle: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: 2,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.white,
    borderRadius: radius.button,
    paddingHorizontal: spacing.md,
    height: 44,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  searchInput: {
    flex: 1,
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: radius.button,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xxxl },
  dateLabel: {
    fontSize: fontSize.tiny ?? 10,
    fontFamily: fontFamily.medium,
    color: colors.textFaded,
    letterSpacing: 0.5,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  transactionsList: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  emptyText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    textAlign: 'center',
    padding: spacing.xl,
  },
});
