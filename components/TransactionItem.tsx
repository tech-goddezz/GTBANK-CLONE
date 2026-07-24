// components/TransactionItem.tsx
//
// A single row in the transaction list.
// Two visual variants, matching the two places this appears in the Figma:
//   - 'home' (default): merchant + category on the left, amount only on the
//      right — used in Home's "Recent Transactions" preview.
//   - 'history': merchant + "category • time" on the left, amount plus a
//      colored status word (plain text, not a pill) stacked on the right —
//      used on the History screen.

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../constants/typography';
import { Transaction } from '../types';
import { formatCurrency, formatTime } from '../constants/mockData';

interface TransactionItemProps {
  transaction: Transaction;
  variant?: 'home' | 'history';
}

export default function TransactionItem({ transaction, variant = 'home' }: TransactionItemProps) {
  const isCredit = transaction.type === 'credit';
  const isHistory = variant === 'history';

  const amountColor =
    transaction.status === 'declined'
      ? colors.red
      : isCredit
      ? colors.green
      : colors.textDark;

  const statusColor =
    transaction.status === 'declined'
      ? colors.red
      : transaction.status === 'pending'
      ? colors.amber
      : colors.green;

  const amountPrefix = isCredit ? '+' : '-';
  const statusLabel = transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1);

  return (
    <View style={styles.row}>
      <View style={styles.logoContainer}>
        {transaction.logoUrl ? (
          <Image source={{ uri: transaction.logoUrl }} style={styles.logo} />
        ) : (
          <View style={styles.logoFallback}>
            <Text style={styles.logoInitial}>
              {transaction.merchantName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.details}>
        <Text style={styles.merchantName} numberOfLines={1}>
          {transaction.merchantName}
        </Text>
        <Text style={styles.category} numberOfLines={1}>
          {isHistory
            ? `${transaction.category} • ${formatTime(transaction.date)}`
            : transaction.category}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {amountPrefix}
          {formatCurrency(transaction.amount)}
        </Text>
        {isHistory && (
          <Text style={[styles.status, { color: statusColor }]}>{statusLabel}</Text>
        )}
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
  logoContainer: { marginRight: spacing.md },
  logo: {
    width: 42,
    height: 42,
    borderRadius: radius.button,
    backgroundColor: colors.borderLight,
  },
  logoFallback: {
    width: 42,
    height: 42,
    borderRadius: radius.button,
    backgroundColor: colors.orangeFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInitial: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.bold,
    color: colors.orange,
  },
  details: { flex: 1, marginRight: spacing.sm },
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
  right: { alignItems: 'flex-end' },
  amount: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    marginBottom: 2,
  },
  status: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.medium,
  },
});