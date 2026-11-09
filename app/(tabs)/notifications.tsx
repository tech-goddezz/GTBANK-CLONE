// app/(tabs)/notifications.tsx
//
// "Notification" (S75/S76 in "Dashboard flow + transfer flow.pdf"), opened from
// the bell on any screen. The app doesn't store real notifications yet, so it
// shows the design's two sample cards. Tapping a card marks it as Read and opens
// "Auto-reversal" (transfer-flow/reversal-details.tsx).

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import colors from '../../constants/colors';
import { fontSize, fontFamily, lineHeight } from '../../constants/typography';
import { layout } from '../../constants/layout';
import ScreenHeader from '../../components/ScreenHeader';

type Notification = {
  id: string;
  title: string;
  body: string;
  time: string;
  icon: 'error-outline' | 'check-circle';
  circle: string;
  unread: boolean;
};

const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: 'failed',
    title: 'Transfer Failed',
    body: 'Auto reversal in progress.Your 5,000 naria is safe\nEstimated time is 2 hours.',
    time: '9:48AM',
    icon: 'error-outline',
    circle: colors.notifFailedCircle,
    unread: true,
  },
  {
    id: 'reversed',
    title: 'Transfer Reversed',
    body: 'Reversing 5,000 NGN from NIBSS. Estimated time is 2 hours.',
    time: '9:48AM',
    icon: 'check-circle',
    circle: colors.orange,
    unread: false,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);

  // Tapping a card marks it as Read and opens the Auto-reversal details (S77)
  const openNotification = (id: string) => {
    setNotifications((list) => list.map((n) => (n.id === id ? { ...n, unread: false } : n)));
    router.push('/transfer-flow/reversal-details');
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Notification"
        subtitle="Track your transfers in minutes."
        bellBadge={notifications.length}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {notifications.map((n) => (
          <TouchableOpacity key={n.id} style={styles.card} activeOpacity={0.8} onPress={() => openNotification(n.id)}>
            <View style={[styles.circle, { backgroundColor: n.circle }]}>
              <MaterialIcons
                name={n.icon}
                size={n.icon === 'check-circle' ? 16 : layout.fundsNoteIcon}
                color={colors.white}
              />
            </View>

            <View style={styles.text}>
              <Text style={styles.title} numberOfLines={1}>{n.title}</Text>
              <Text style={styles.body} numberOfLines={1}>{n.body.replace('\n', ' ')}</Text>
            </View>

            <View style={styles.right}>
              <Text style={styles.status}>{n.unread ? 'Unread' : 'Read'}</Text>
              <Text style={styles.time}>{n.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  scroll: {
    paddingTop: layout.notifListTop,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.tabBarHeight,
    gap: layout.notifCardGap,
  },
  card: {
    height: layout.notifCardHeight,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: layout.notifCardPadLeft,
    paddingRight: layout.notifCardPadRight,
    backgroundColor: colors.white,
    // Soft shadow mostly underneath, as in the design
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  circle: {
    marginTop: (layout.notifCardHeight - layout.notifCircle) / 2,
    width: layout.notifCircle,
    height: layout.notifCircle,
    borderRadius: layout.notifCircle / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    marginLeft: layout.notifTextGap,
    marginRight: layout.notifTextRight,
    paddingTop: layout.notifTitleTop,
  },
  title: {
    fontSize: fontSize.large,
    lineHeight: layout.checkTitleLineHeight,
    fontFamily: fontFamily.semibold,
    color: colors.textLightDark,
  },
  body: {
    marginTop: layout.notifBodyTop,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  right: {
    alignItems: 'flex-end',
    paddingTop: layout.notifStatusTop,
  },
  status: {
    fontSize: fontSize.large,
    lineHeight: layout.checkTitleLineHeight,
    fontFamily: fontFamily.regular,
    color: colors.unreadBlue,
  },
  time: {
    marginTop: layout.notifTimeTop,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textCharcoal,
  },
});
