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
import { layout } from '../constants/layout';
import { Transaction } from '../types';
import { formatTime } from '../constants/mockData';

interface TransactionItemProps {
  transaction: Transaction;
  variant?: 'home' | 'history';
}

export default function TransactionItem({ transaction, variant = 'home' }: TransactionItemProps) {
  const isCredit = transaction.type === 'credit';
  const isHistory = variant === 'history';

  const statusColor =
    transaction.status === 'declined'
      ? colors.red
      : transaction.status === 'pending'
      ? colors.textFaded
      : colors.green;

  // Home always shows a dark grey amount; History colours it by status.
  const amountColor = isHistory ? statusColor : colors.textLightDark;

  const amountPrefix = isCredit ? '+' : '-';
  // "- ₦50": whole amounts have no decimals, but kobo are still shown when there are any.
  const decimals = Number.isInteger(transaction.amount) ? 0 : 2;
  const amountText = `₦${transaction.amount.toLocaleString('en-NG', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
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

      <View style={[styles.details, !isHistory && styles.detailsHome]}>
        <Text style={[styles.merchantName, isHistory ? styles.merchantNameHistory : styles.merchantNameHome]} numberOfLines={1}>
          {transaction.merchantName}
        </Text>
        <Text style={[styles.category, styles.categoryHome]} numberOfLines={1}>
          {isHistory
            ? `${transaction.category} • ${formatTime(transaction.date)}`
            : transaction.category}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={[styles.amount, isHistory ? styles.amountHistory : styles.amountHome, { color: amountColor }]}>
          {amountPrefix} {amountText}
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
    minHeight: layout.transactionRowHeight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.cardBackground,
    borderRadius: radius.card,
  },

  logoContainer: { marginRight: spacing.md },

  logo: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.borderLight,
  },

  logoFallback: {
    width: 40,
    height: 40,
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
  details: { flex: 1, marginRight: spacing.sm },

 merchantName: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.medium,
    color: colors.textLightDark,
    marginBottom: 2,
  },
  // History screen (S33): bigger bold name, bigger amount.
  merchantNameHistory: {
    fontSize: fontSize.large,
    lineHeight: 19,
    fontFamily: fontFamily.bold,
    marginBottom: layout.historyNameGap,
  },
  amountHistory: {
    fontSize: fontSize.large,
    lineHeight: 19,
    marginBottom: layout.historyNameGap,
  },
  category: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },

  right: { alignItems: 'flex-end' },

  amount: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.medium,
    marginBottom: 2,
  },

  // Home screen (S32): semi-bold name, regular amount, names sit 1px above centre.
  detailsHome: { paddingBottom: 3 },
  merchantNameHome: {
    fontFamily: fontFamily.semibold,
    lineHeight: 17,
    marginBottom: 5,
  },
  categoryHome: { lineHeight: 17 },
  amountHome: {
    fontFamily: fontFamily.regular,
    marginBottom: 0,
  },

  status: {
    fontSize: fontSize.small,
    lineHeight: 15,
    fontFamily: fontFamily.medium,
  },
});