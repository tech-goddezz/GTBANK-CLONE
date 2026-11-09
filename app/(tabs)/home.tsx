// app/(tabs)/home.tsx
// Dashboard home screen (S32 in "Dashboard flow + transfer flow.pdf").

import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import { layout } from '../../constants/layout';
import { headerIcons } from '../../constants/headerIcons';
import { homeIcons } from '../../constants/homeIcons';
import { useState, useEffect } from 'react';
import { fetchTransactions, getCurrentUserId, fetchProfile } from '../../services/auth';
import BalanceCard from '../../components/BalanceCard';
import TransactionItem from '../../components/TransactionItem';
import profilePhoto from '../../assets/images/profilePhoto.png';

const QUICK_ACTIONS = [
  { id: 'send', label: 'Send' },
  { id: 'pay', label: 'Pay' },
  { id: 'topup', label: 'Top up' },
  { id: 'more', label: 'More' },
] as const;

function DesignIcon({ icon, color }: { icon: { width: number; height: number; path: string; fillRule: 'nonzero' | 'evenodd' }; color: string }) {
  return (
    <Svg width={icon.width} height={icon.height} viewBox={`0 0 ${icon.width} ${icon.height}`}>
      <Path d={icon.path} fill={color} fillRule={icon.fillRule} />
    </Svg>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
  if (id === 'send') router.push('/(tabs)/transfer-flow/send');
  if (id === 'pay') router.push('/(tabs)/pay');
  if (id === 'topup') router.push('/(tabs)/topup');
  if (id === 'more') router.push('/(tabs)/more');
};

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* White top area: status bar space, photo, greeting, bell, then the menu strip */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, layout.statusBarHeight) }]}>
          <View style={styles.identityStrip}>
            <View style={styles.avatarRing}>
              <Image source={profilePhoto} style={styles.avatar} />
            </View>
            <Text style={styles.greeting}>Hi,</Text>
            <Text style={styles.userName} numberOfLines={1}>{firstName}</Text>
            <TouchableOpacity
              style={styles.bell}
              onPress={() => router.push('/(tabs)/notifications')}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <DesignIcon icon={headerIcons.bell} color={colors.textDark} />
            </TouchableOpacity>
            <View style={styles.divider} />
          </View>

          {/* Menu icon (left) and History (right). The design doesn't say what the menu opens. */}
          <View style={styles.menuStrip}>
            <View style={styles.menuIcon}>
              <DesignIcon icon={headerIcons.menu} color={colors.headerMenuIcon} />
            </View>
            <TouchableOpacity
              style={styles.history}
              onPress={() => router.push('/(tabs)/history')}
              activeOpacity={0.7}
            >
              <Text style={styles.historyLabel}>History</Text>
            </TouchableOpacity>
          </View>
        </View>

        <BalanceCard />

        {/* Send / Pay / Top up / More */}
        <View style={styles.quickActionsRow}>
          {QUICK_ACTIONS.map((action) => {
            const icon = homeIcons[action.id];
            return (
              <TouchableOpacity
                key={action.id}
                style={styles.quickAction}
                onPress={() => handleQuickAction(action.id)}
                activeOpacity={0.7}
              >
                <View style={styles.quickActionCircle}>
                  <View style={{ position: 'absolute', left: icon.left, top: icon.top }}>
                    <DesignIcon icon={icon} color={colors.textLightDark} />
                  </View>
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Recent transactions */}
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.pageBackground },

  scroll: { flex: 1 },

  scrollContent: { paddingBottom: spacing.xxxl },

  header: { backgroundColor: colors.white },

  identityStrip: { height: layout.homeHeaderHeight },

  avatarRing: {
    position: 'absolute',
    left: layout.homeAvatarLeft,
    top: layout.homeAvatarTop,
    width: layout.homeAvatarRing,
    height: layout.homeAvatarRing,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.avatarRing,
    overflow: 'hidden',
  },
  avatar: { width: '100%', height: '100%' },

  greeting: {
    position: 'absolute',
    left: layout.homeNameLeft,
    top: layout.homeGreetingTop,
    fontSize: fontSize.body,
    lineHeight: 17,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  userName: {
    position: 'absolute',
    left: layout.homeNameLeft,
    right: layout.homeBellRight + spacing.xxl,
    top: layout.homeNameTop,
    fontSize: fontSize.heading2,
    lineHeight: 29,
    fontFamily: fontFamily.medium,
    color: colors.black,
  },
  bell: {
    position: 'absolute',
    right: layout.homeBellRight,
    top: layout.homeBellTop,
  },
  divider: {
    position: 'absolute',
    left: layout.homeDividerLeft,
    top: layout.homeDividerTop,
    width: layout.homeDividerWidth,
    height: layout.homeDividerHeight,
    backgroundColor: colors.borderLight,
  },

  menuStrip: { height: layout.headerMenuHeight, justifyContent: 'center' },
  menuIcon: { paddingLeft: layout.homeMenuLeft },
  history: {
    position: 'absolute',
    right: layout.homeHistoryRight,
    top: layout.homeHistoryTop,
  },
  historyLabel: {
    fontSize: fontSize.body,
    lineHeight: 17,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },

  quickActionsRow: {
    flexDirection: 'row',
    paddingHorizontal: layout.homeActionsSidePadding,
    marginTop: layout.homeActionsTop,
  },
  quickAction: { flex: 1, alignItems: 'center' },
  quickActionCircle: {
    width: layout.homeActionCircle,
    height: layout.homeActionCircle,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    // Soft grey glow all round, as in the design
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  quickActionLabel: {
    marginTop: layout.homeActionLabelGap,
    fontSize: fontSize.body,
    lineHeight: 17,
    fontFamily: fontFamily.regular,
    color: colors.textNavy,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.balanceCardSideMargin,
    marginTop: layout.homeRecentTop,
  },
  sectionTitle: {
    fontSize: fontSize.heading3,
    lineHeight: 22,
    fontFamily: fontFamily.bold,
    color: colors.textLightDark,
  },
  seeAll: {
    fontSize: fontSize.large,
    lineHeight: 19,
    fontFamily: fontFamily.regular,
    color: colors.orangeDark,
  },
  transactionsList: {
    marginHorizontal: layout.balanceCardSideMargin,
    marginTop: layout.homeListTop,
    gap: layout.homeListGap,
  },
  emptyText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    textAlign: 'center',
    padding: spacing.xl,
  },
});
