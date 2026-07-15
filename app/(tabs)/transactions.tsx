// app/(tabs)/transactions.tsx
// "Frequent Transactions" tab — shows GT banking product cards
// (Loans, Pensions, Dollar Fund, Money Mkt) that the user can apply for.
// Each card opens its own requirements/form flow.

import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import { useAuthStore } from '../../store/useAuthStore';

const PRODUCTS = [
  {
    id: 'loans',
    title: 'GT Loans',
    subtitle: 'Access quick loans with competitive rates',
    icon: 'cash-outline' as const,
    color: '#E85D24',
  },
  {
    id: 'pensions',
    title: 'GT Pensions',
    subtitle: 'Secure your retirement with our pension plans',
    icon: 'umbrella-outline' as const,
    color: '#3B82F6',
  },
  {
    id: 'dollar-fund',
    title: 'GT Dollar Fund',
    subtitle: 'Invest in foreign currency funds',
    icon: 'trending-up-outline' as const,
    color: '#10B981',
  },
  {
    id: 'money-mkt',
    title: 'GT Money Mkt',
    subtitle: 'Earn returns on your money market account',
    icon: 'bar-chart-outline' as const,
    color: '#8B5CF6',
  },
];

export default function FrequentTransactionsScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const firstName = user?.firstName ?? 'Emmanuel';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Financial Products</Text>
          <Text style={styles.subtitle}>
            Welcome {firstName}, explore our financial services
          </Text>
        </View>

        {PRODUCTS.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.card}
            onPress={() => router.push(`/(products)/${product.id}`)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconCircle, { backgroundColor: product.color + '20' }]}>
              <Ionicons name={product.icon} size={28} color={product.color} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{product.title}</Text>
              <Text style={styles.cardSubtitle}>{product.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textFaded} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.pageBackground },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  header: { paddingTop: spacing.xl, marginBottom: spacing.xl },
  title: { fontSize: fontSize.heading1, fontFamily: fontFamily.bold, color: colors.textDark },
  subtitle: { fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textGrey, marginTop: spacing.xs },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    borderRadius: radius.card, padding: spacing.lg, marginBottom: spacing.md,
    gap: spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  iconCircle: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  cardText: { flex: 1 },
  cardTitle: { fontSize: fontSize.body, fontFamily: fontFamily.semibold, color: colors.textDark, marginBottom: 3 },
  cardSubtitle: { fontSize: fontSize.small, fontFamily: fontFamily.regular, color: colors.textGrey, lineHeight: 18 },
});