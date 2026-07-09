// components/TransactionItem.tsx
//
// A single row in the transaction list.
// Shows merchant logo (or a colored initial if no logo),
// merchant name, category, amount, and a status badge if pending/declined.

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../constants/typography';
import { Transaction } from '../types';
import { formatCurrency, formatDate } from '../constants/mockData';

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const isCredit = transaction.type === 'credit';

  // Figure out what color the amount should be
  const amountColor =
    transaction.status === 'declined'
      ? colors.red
      : isCredit
      ? colors.green
      : colors.textDark;

  const amountPrefix = isCredit ? '+' : '-';

  return (
    <View style={styles.row}>
      {/* Left: logo or initial avatar */}
      <View style={styles.logoContainer}>
        {transaction.logoUrl ? (
          <Image
            source={{ uri: transaction.logoUrl }}
            style={styles.logo}
            // If the image fails to load, it just shows nothing — no crash
          />
        ) : (
          // No logo? Show the first letter of the merchant name on a colored circle
          <View style={styles.logoFallback}>
            <Text style={styles.logoInitial}>
              {transaction.merchantName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Middle: merchant name + category */}
      <View style={styles.details}>
        <Text style={styles.merchantName} numberOfLines={1}>
          {transaction.merchantName}
        </Text>
        <Text style={styles.category} numberOfLines={1}>
          {transaction.status !== 'completed'
            ? transaction.status.charAt(0).toUpperCase() +
              transaction.status.slice(1)
            : transaction.category}
        </Text>
      </View>

      {/* Right: amount + date */}
      <View style={styles.right}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {transaction.status === 'declined'
            ? formatCurrency(transaction.amount)
            : `${amountPrefix}${formatCurrency(transaction.amount)}`}
        </Text>
        <Text style={styles.date}>{formatDate(transaction.date)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.cardBackground,
  },
  logoContainer: {
    marginRight: spacing.md,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.borderLight,
  },
  logoFallback: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.orangeFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInitial: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.bold,
    color: colors.orange,
  },
  details: {
    flex: 1,
    marginRight: spacing.sm,
  },
  merchantName: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    color: colors.textDark,
    marginBottom: 2,
  },
  category: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    marginBottom: 2,
  },
  date: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
});