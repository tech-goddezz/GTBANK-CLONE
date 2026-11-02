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
import { layout } from '../constants/layout';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { fetchProfile, getCurrentUserId } from '../services/auth';

export default function BalanceCard() {
  const [balance, setBalance] = useState(0);
  const [balanceHidden, setBalanceHidden] = useState(false);

  useFocusEffect(
  useCallback(() => {
    const loadBalance = async () => {
      const realId = await getCurrentUserId();
      const result = await fetchProfile(realId);
      if (result.success && result.profile) {
        setBalance(result.profile.balance ?? 0);
      }
    };
    loadBalance();
  }, [])
);

  const toggleBalance = () => setBalanceHidden((prev) => !prev);

  return (
    <View style={styles.card}>
      {/* Top row: label + eye toggle */}
      <View style={styles.topRow}>
        <Text style={styles.accountLabel}>Total Balance</Text>
        <TouchableOpacity onPress={toggleBalance} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons
            name={balanceHidden ? 'eye-off-outline' : 'eye-outline'}
            size={16}
            color={colors.white}
          />
        </TouchableOpacity>
      </View>

      {/* The balance itself — hidden or shown. The ₦ symbol is deliberately
          much smaller than the digits, matching the design (it's easy to
          miss this if you just use one Text with one fontSize). */}
      <View style={styles.balanceRow}>
        <Text style={styles.currencySymbol}>₦</Text>
        <Text style={styles.balance}>
          {balanceHidden
            ? '*****'
            : balance.toLocaleString('en-NG', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.balanceCard,
    borderRadius: radius.balanceCard,
    height: layout.balanceCardHeight,
    paddingHorizontal: spacing.xl,
    paddingTop: 32,
    marginHorizontal: layout.balanceCardSideMargin,
    marginTop: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 9, // Eye icon sits 29 from the card's right edge
    marginBottom: 13,
  },
  accountLabel: {
    fontSize: fontSize.small,
    lineHeight: 16,
    fontFamily: fontFamily.regular,
    color: colors.balanceLabel,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  balance: {
    fontSize: fontSize.display,
    fontFamily: fontFamily.semibold,
    color: colors.white,
  },
  currencySymbol: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.semibold,
    color: colors.balanceSymbol,
    marginRight: 9,
  },
});
