// app/(tabs)/cards.tsx
// Card Management screen. Lives inside the (tabs) group so the bottom
// tab bar stays visible, but it's reached via Settings, not its own
// tab button — our TabBar component only renders buttons for routes
// it recognizes, so "cards" being here doesn't add a 5th tab.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import { useAccountStore } from '../../store/useAccountStore';
import { formatCurrency } from '../../constants/mockData';
import DebitCard from '../../components/DebitCard';

export default function CardsScreen() {
  const router = useRouter();
  const { card, toggleCardFreeze } = useAccountStore();

  if (!card) return null;

  // How far into the monthly limit the user has spent, clamped to 100%
  // so an edge case (spending exactly at or somehow over the limit)
  // never renders a bar wider than its container.
  const spendPercentage = Math.min(
    (card.monthlySpent / card.monthlyLimit) * 100,
    100
  );
  const remaining = card.monthlyLimit - card.monthlySpent;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>Card Management</Text>
          <Text style={styles.subtitle}>
            Manage your digital and physical payment method
          </Text>
        </View>
        <Ionicons name="notifications-outline" size={22} color={colors.textDark} />
      </View>

      <DebitCard />

      {/* Freeze toggle */}
      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>Freeze Card</Text>
          <Text style={styles.rowSubtitle}>Instantly block transactions</Text>
        </View>
        <Switch
          value={card.isFrozen}
          onValueChange={toggleCardFreeze}
          trackColor={{ false: colors.borderLight, true: colors.orange }}
          thumbColor={colors.white}
        />
      </View>

      {/* Monthly spending limit with progress bar */}
      <View style={styles.limitCard}>
        <View style={styles.limitHeader}>
          <Text style={styles.limitLabel}>Monthly Spending Limit</Text>
          <Text style={styles.limitAmount}>{formatCurrency(card.monthlyLimit)}</Text>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${spendPercentage}%` }]} />
        </View>

        <View style={styles.limitFooter}>
          <Text style={styles.limitFooterText}>
            Spent: {formatCurrency(card.monthlySpent)}
          </Text>
          <Text style={styles.limitFooterText}>
            Remaining: {formatCurrency(remaining)}
          </Text>
        </View>
      </View>

      {/* Static reference rows — matching the Figma's Daily Limit / ATM
          Withdrawal labels. Not editable yet since there's no backend
          to persist changes to; showing real mock values is more honest
          than fake "tap to edit" rows that don't do anything. */}
      <View style={styles.staticRow}>
        <Text style={styles.staticLabel}>Daily Limit</Text>
        <Text style={styles.staticValue}>{formatCurrency(1000)}</Text>
      </View>
      <View style={styles.staticRow}>
        <Text style={styles.staticLabel}>ATM Withdrawal</Text>
        <Text style={styles.staticValue}>{formatCurrency(500)}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 56,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  backButton: { width: 24 },
  headerText: { flex: 1 },
  title: {
    fontSize: fontSize.heading2,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
  },
  subtitle: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.pageBackground,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  rowText: { flex: 1, marginRight: spacing.md },
  rowTitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    color: colors.textDark,
    marginBottom: 2,
  },
  rowSubtitle: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  limitCard: {
    backgroundColor: colors.pageBackground,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  limitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  limitLabel: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.medium,
    color: colors.textGrey,
  },
  limitAmount: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
  },
  progressTrack: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.borderLight,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.orange,
  },
  limitFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  limitFooterText: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  staticRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  staticLabel: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
  },
  staticValue: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    color: colors.textDark,
  },
});