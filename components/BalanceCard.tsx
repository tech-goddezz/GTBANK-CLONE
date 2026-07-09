// components/BalanceCard.tsx
//
// The dark card at the top of the home screen.
// Shows the account balance (or hides it behind asterisks),
// account number, and the eye icon to toggle visibility.
// Pulls its data directly from the global account store.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../constants/typography';
import { useAccountStore } from '../store/useAccountStore';
import { formatCurrency } from '../constants/mockData';

export default function BalanceCard() {
  const { account, balanceHidden, toggleBalance } = useAccountStore();

  if (!account) return null;

  return (
    <View style={styles.card}>
      {/* Top row: label + eye toggle */}
      <View style={styles.topRow}>
        <Text style={styles.accountLabel}>Total Balance</Text>
        <TouchableOpacity onPress={toggleBalance} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons
            name={balanceHidden ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={colors.white}
          />
        </TouchableOpacity>
      </View>

      {/* The balance itself — hidden or shown */}
      <Text style={styles.balance}>
        {balanceHidden ? '$ *****' : formatCurrency(account.balance)}
      </Text>

      {/* Account number */}
      <Text style={styles.accountNumber}>
        {account.accountNumber}
      </Text>

      {/* Bottom row: account name + bank */}
      <View style={styles.bottomRow}>
        <Text style={styles.accountName}>{account.accountName}</Text>
        <Text style={styles.bankName}>{account.bankName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.darkCard,
    borderRadius: radius.card,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  accountLabel: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textFaded,
    letterSpacing: 0.5,
  },
  balance: {
    fontSize: 32,
    fontFamily: fontFamily.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  accountNumber: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textFaded,
    marginBottom: spacing.lg,
    letterSpacing: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountName: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    color: colors.white,
  },
  bankName: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.medium,
    color: colors.textFaded,
  },
});