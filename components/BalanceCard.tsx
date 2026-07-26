// components/BalanceCard.tsx
//
// The dark card at the top of the home screen.
// Shows the account balance (or hides it behind asterisks)
// and the eye icon to toggle visibility.
// Pulls its data directly from the global account store.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../constants/typography';
import { useAccountStore } from '../store/useAccountStore';

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

      {/* The balance itself — hidden or shown. The ₦ symbol is deliberately
          much smaller than the digits, matching the design (it's easy to
          miss this if you just use one Text with one fontSize). */}
      <Text style={styles.balance}>
        <Text style={styles.currencySymbol}>₦ </Text>
        {balanceHidden
          ? '*****'
          : account.balance.toLocaleString('en-NG', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
      </Text>
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
  },
  currencySymbol: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
  },
});