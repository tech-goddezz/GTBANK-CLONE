// app/(tabs)/transactions.tsx
//
// The "Transactions" tab — matches the design's "Transactions" frame:
// two promotional banner cards (GT Loans, GT Fund Managers Money Market
// Fund) that lead into the products/application flow at (products).
//
// NOTE: this is a different screen from History (reached via the History
// button on Home) — confirmed with Litz these are separate screens, not
// one scrolling page.

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';

const BANNERS = [
  {
    id: 'loans',
    title: 'Apply for loans',
    subtitle: 'Click here to apply for Quick Credit or salary advance.',
    icon: 'cash-outline' as const,
    background: colors.orange,
  },
  {
    id: 'money-mkt',
    title: 'GT Fund Managers Money Market Fund',
    subtitle: 'Our money market is a perfect way to start your investment journey.',
    icon: 'wallet-outline' as const,
    background: colors.pink,
  },
];

export default function TransactionsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Transactions</Text>
            <Text style={styles.subtitle}>Review and manage your financial activity</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={22} color={colors.textDark} />
          </TouchableOpacity>
        </View>

        {BANNERS.map((banner) => (
          <TouchableOpacity
            key={banner.id}
            style={[styles.banner, { backgroundColor: banner.background }]}
            activeOpacity={0.85}
            onPress={() => router.push(`/(products)/${banner.id}`)}
          >
            <View style={styles.bannerIconCircle}>
              <Ionicons name={banner.icon} size={22} color={colors.white} />
            </View>
            <View style={styles.bannerTextBlock}>
              <Text style={styles.bannerTitle}>{banner.title}</Text>
              <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color={colors.white} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.pageBackground },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  title: {
    fontSize: fontSize.heading1,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
  },
  subtitle: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: 2,
  },
  banner: {
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  bannerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTextBlock: { flex: 1 },
  bannerTitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.bold,
    color: colors.white,
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.white,
    opacity: 0.9,
    lineHeight: 18,
  },
});