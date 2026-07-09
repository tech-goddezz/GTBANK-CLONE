// app/(tabs)/home.tsx
// The main dashboard screen users see after logging in.

import React from 'react';
import {
  View,
  Text,
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
import BalanceCard from '../../components/BalanceCard';
import TransactionItem from '../../components/TransactionItem';

// The 4 quick action buttons under the balance card
const QUICK_ACTIONS = [
  { id: 'transfer', label: 'Transfer', icon: 'swap-horizontal-outline' },
  { id: 'bills', label: 'Pay Bills', icon: 'receipt-outline' },
  { id: 'airtime', label: 'Airtime', icon: 'phone-portrait-outline' },
  { id: 'more', label: 'More', icon: 'grid-outline' },
];

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { transactions } = useAccountStore();

  // Only show the 5 most recent transactions on the home screen
  const recentTransactions = transactions.slice(0, 5);

  const handleQuickAction = (id: string) => {
    if (id === 'transfer') {
      router.push('/(tabs)/transfer');
    }
  };

  // Get first name only for the greeting
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top bar: greeting + notification bell */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Good day,</Text>
            <Text style={styles.userName}>{firstName} 👋</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={colors.textDark} />
            {/* Red dot to indicate unread notifications */}
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Balance card — pulls from account store */}
        <BalanceCard />

        {/* Quick actions row */}
        <View style={styles.quickActionsCard}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickAction}
              onPress={() => handleQuickAction(action.id)}
              activeOpacity={0.7}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons
                  name={action.icon as any}
                  size={22}
                  color={colors.orange}
                />
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
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsList}>
            {recentTransactions.length === 0 ? (
              <Text style={styles.emptyText}>No transactions yet</Text>
            ) : (
              recentTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background ?? colors.white,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  greeting: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  userName: {
    fontSize: fontSize.heading2,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
  },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.red,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  quickActionsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  quickAction: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.orangeFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.medium,
    color: colors.textDark,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
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
  transactionsList: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    marginHorizontal: spacing.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    textAlign: 'center',
    padding: spacing.xl,
  },
});