// app/(tabs)/home.tsx
// Dashboard home screen — matches the Figma design exactly.

import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import { useAuthStore } from '../../store/useAuthStore';
import { useAccountStore } from '../../store/useAccountStore';
import { formatCurrency, formatDate } from '../../constants/mockData';
import BalanceCard from '../../components/BalanceCard';
import TransactionItem from '../../components/TransactionItem';

const QUICK_ACTIONS = [
  { id: 'send', label: 'Send', icon: 'paper-plane-outline' },
  { id: 'pay', label: 'Pay', icon: 'card-outline' },
  { id: 'topup', label: 'Top up', icon: 'add-circle-outline' },
  { id: 'more', label: 'More', icon: 'grid-outline' },
];

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { transactions } = useAccountStore();

  const recentTransactions = transactions.slice(0, 5);

  // Group transactions under TODAY / YESTERDAY / date labels
  const sections = recentTransactions.reduce
    <{ label: string; items: typeof recentTransactions }[]
  >((acc, txn) => {
    const label = formatDate(txn.date).toUpperCase();
    const existing = acc.find((s) => s.label === label);
    if (existing) {
      existing.items.push(txn);
    } else {
      acc.push({ label, items: [txn] });
    }
    return acc;
  }, []);

  const handleQuickAction = (id: string) => {
    if (id === 'send') router.push('/(tabs)/transfer-flow/');
  };

  const firstName = user?.firstName ?? 'there';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top bar: avatar + greeting + notification bell */}
        <View style={styles.topBar}>
          <View style={styles.identity}>
            {user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Ionicons name="person-outline" size={18} color={colors.textGrey} />
              </View>
            )}
            <View>
              <Text style={styles.greeting}>Hi,</Text>
              <Text style={styles.userName}>{firstName}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bellButton}>
            <Ionicons name="notifications-outline" size={22} color={colors.textDark} />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>

        {/* Balance card */}
        <BalanceCard />

        {/* Quick actions — sit directly on page background, no card wrapper */}
        <View style={styles.quickActionsRow}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickAction}
              onPress={() => handleQuickAction(action.id)}
              activeOpacity={0.7}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name={action.icon as any} size={22} color={colors.textDark} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {sections.length === 0 ? (
            <Text style={styles.emptyText}>No transactions yet</Text>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.pageBackground },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xxxl },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  identity: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: { width: 40, height: 40, borderRadius: radius.pill },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  userName: {
    fontSize: fontSize.heading3,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
  },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  bellDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.red,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },
  quickAction: { alignItems: 'center', gap: spacing.xs },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.iconGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.medium,
    color: colors.textDark,
  },
  section: { marginTop: spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    color: colors.textDark,
  },
  seeAll: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.medium,
    color: colors.orange,
  },
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