// app/(tabs)/home.tsx
// Dashboard home screen — matches the Figma design exactly.

import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, fontWeight, radius } from '../../constants/typography';
import { useAuthStore } from '../../store/useAuthStore';
import { useAccountStore } from '../../store/useAccountStore';
import { useState, useEffect } from 'react';
import { fetchTransactions, getCurrentUserId, fetchProfile } from '../../services/auth';
import BalanceCard from '../../components/BalanceCard';
import TransactionTicker from '../../components/TransactionTicker';
import PromoCarousel from '../../components/PromoCarousel';
import TransactionItem from '../../components/TransactionItem';
import profilePhoto from '../../assets/images/profilePhoto.png'; 

const QUICK_ACTIONS = [
  { id: 'send', label: 'Send', icon: 'paper-plane-outline' },
  { id: 'pay', label: 'Pay', icon: 'card-outline' },
  { id: 'topup', label: 'Top up', icon: 'add-circle-outline' },
  { id: 'more', label: 'More', icon: 'grid-outline' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('there');

useEffect(() => {
  const loadName = async () => {
    const id = await getCurrentUserId();
    const result = await fetchProfile(id);
    if (result.success && result.profile?.first_name) {
      setFirstName(result.profile.first_name);
    }
  };
  loadName();
}, []);
  const [transactions, setTransactions] = useState<any[]>([]);

useEffect(() => {
  const loadTransactions = async () => {
    const id = await getCurrentUserId();
    const result = await fetchTransactions(id);
    if (result.success) {
      const formatted = result.transactions.map((t: any) => ({
        id: t.id,
        merchantName: t.receiver_account_number,
        category: t.narration || 'Transfer',
        amount: t.amount,
        type: 'debit',
        status: 'completed',
        date: t.created_at,
      }));
      setTransactions(formatted);
    }
  };
  loadTransactions();
}, []);

const recentTransactions = transactions.slice(0, 5);

  

  const handleQuickAction = (id: string) => {
  if (id === 'send') router.push('/(tabs)/transfer-flow/');
  if (id === 'pay') router.push('/(tabs)/pay');
  if (id === 'topup') router.push('/(tabs)/topup');
  if (id === 'more') router.push('/(tabs)/more');
};

  

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top bar: avatar + greeting + notification bell */}
        <View style={styles.topBar}>
          <View style={styles.identity}>

            <Image source={profilePhoto} style={styles.avatar} />
            <View>


              <Text style={styles.greeting}>Hi,</Text>
              <Text style={styles.userName}>{firstName}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bellButton} onPress={() => router.push('/(tabs)/notifications')}>
            <Ionicons name="notifications-outline" size={22} color={colors.textDark} />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>

       {/* Thin divider, then Settings (left) / History (right) below it */}
        <View style={styles.divider} />
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => router.push('/(tabs)/settings')}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={16} color={colors.textDark} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => router.push('/(tabs)/history')}
            activeOpacity={0.7}
          >
            
            <Text style={styles.controlLabel}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Balance card */}
        <BalanceCard />
<TransactionTicker transactions={transactions} />
<PromoCarousel />

        {/* Quick actions — sit directly on page background, no card wrapper */}
        <View style={styles.quickActionsRow}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickAction}
              onPress={() => handleQuickAction(action.id)}
              activeOpacity={0.7}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name={action.icon as any} size={22} color={colors.textDark} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length === 0 ? (
            <Text style={styles.emptyText}>No transactions yet</Text>
          ) : (
            <View style={styles.transactionsList}>
              {recentTransactions.map((t) => (
                <TransactionItem key={t.id} transaction={t} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
  safeArea: { flex: 1, backgroundColor: colors.pageBackground },

  scroll: { flex: 1, backgroundColor: colors.pageBackground },

  scrollContent: { paddingBottom: spacing.xxxl, backgroundColor: colors.pageBackground },
  
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
    marginTop: spacing.xxxl + 20,
  },
  identity: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingLeft: spacing.lg, },
  
  avatar: { width: 40, height: 40, borderRadius: radius.pill },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  userName: {
    fontSize: fontSize.heading2,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.textDark,
  },
  bellButton: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  bellDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.red,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.xl,
    marginTop: spacing.sm,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.sm,
  },
  controlLabel: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.medium,
    color: colors.textDark,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },

  quickAction: { alignItems: 'center', gap: spacing.xs },

  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  quickActionLabel: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.medium,
    color: colors.textDark,
  },
  section: { marginTop: spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.semibold,
    color: colors.textLightDark,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.md, 
  },
  seeAll: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.medium,
    color: colors.orange,
    fontWeight: fontWeight.medium,
  },
  transactionsList: {
    marginHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    textAlign: 'center',
    padding: spacing.xl,
  },
});
