// app/(tabs)/transfer-flow/checking.tsx
//
// "Transfer Tracking – Still checking" (S71 in "Dashboard flow + transfer flow.pdf"),
// opened from "Check Status" on the Transfers tab. It shows that the latest
// transfer is still being checked with NIBSS, with a timer that counts up.
// The orange stop circle is only a picture.

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import { fontSize, fontFamily, lineHeight } from '../../../constants/typography';
import { layout } from '../../../constants/layout';
import ScreenHeader from '../../../components/ScreenHeader';
import { getCurrentUserId, fetchTransactions, lookupAccountName } from '../../../services/auth';

// 75 seconds → "1:15"
const formatTimer = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

export default function CheckingScreen() {
  const router = useRouter();
  const [recipientName, setRecipientName] = useState('your recipient');
  const [seconds, setSeconds] = useState(0);

  // Name of the person in the latest transfer, if there is one
  useEffect(() => {
    const loadRecipient = async () => {
      const id = await getCurrentUserId();
      const result = await fetchTransactions(id);
      const latest = result.transactions?.[0];
      if (!latest?.receiver_account_number) return;
      const lookup = await lookupAccountName(latest.receiver_account_number);
      setRecipientName(lookup.success && lookup.name ? lookup.name : latest.receiver_account_number);
    };
    loadRecipient();
  }, []);

  // The timer counts up while this page is open
  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Transfer Tracking"
        subtitle="Track your transfers in minutes."
        onBack={() => router.replace('/(tabs)/transfer-flow')}
        onBellPress={() => router.push('/(tabs)/notifications')}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.circle}>
          <View style={styles.stopSquare} />
        </View>

        <Text style={styles.title}>Still Checking ....</Text>

        <Text style={[styles.text, styles.gap]}>
          {`We haven’t received confirmation that\n${recipientName} has been credited yet.`}
        </Text>

        <Text style={[styles.text, styles.gap]}>Automatically checking with NIBSS for updates .</Text>

        <View style={styles.note}>
          <MaterialIcons name="error-outline" size={layout.fundsNoteIcon} color={colors.infoBlue} />
          <Text style={styles.noteText} numberOfLines={1}>You don't have to worry , we got this.</Text>
        </View>

        <Text style={[styles.text, styles.gap]}>Estimated time for complete search ...</Text>

        <Text style={[styles.text, styles.minutes, styles.gap]}>5 minutes</Text>

        <Text style={styles.timer}>{formatTimer(seconds)}</Text>

        <TouchableOpacity
          style={styles.helpLink}
          onPress={() => router.push('/(settings)/get-help')}
          accessibilityRole="link"
        >
          <Text style={styles.helpText}>Need help?</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.pageBackground },
  scroll: {
    paddingTop: layout.checkCircleTop,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.tabBarHeight,
  },
  circle: {
    alignSelf: 'center',
    width: layout.checkCircle,
    height: layout.checkCircle,
    borderRadius: layout.checkCircle / 2,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopSquare: {
    width: layout.checkStopSquare,
    height: layout.checkStopSquare,
    backgroundColor: colors.white,
  },
  title: {
    marginTop: layout.checkTitleTop,
    textAlign: 'center',
    fontSize: fontSize.large,
    lineHeight: layout.checkTitleLineHeight,
    fontFamily: fontFamily.bold,
    color: colors.textLightDark,
  },
  gap: { marginTop: layout.checkGap },
  text: {
    textAlign: 'center',
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  minutes: { fontFamily: fontFamily.bold },
  note: {
    marginTop: layout.checkGap,
    height: layout.transitNoteHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: layout.checkNoteIconLeft,
    backgroundColor: colors.infoBlueFaint,
    borderWidth: 0.5,
    borderColor: colors.infoBlue,
  },
  noteText: {
    marginLeft: layout.fundsNoteTextGap,
    fontSize: fontSize.large,
    fontFamily: fontFamily.regular,
    color: colors.textLightDark,
  },
  timer: {
    marginTop: layout.checkTimerTop,
    textAlign: 'center',
    fontSize: fontSize.large,
    lineHeight: layout.checkTitleLineHeight,
    fontFamily: fontFamily.regular,
    color: colors.timerGrey,
  },
  helpLink: {
    alignSelf: 'flex-end',
    marginTop: layout.checkHelpTop,
    marginRight: layout.checkHelpRight,
  },
  helpText: {
    fontSize: layout.transitHelpSize,
    lineHeight: layout.transitHelpLineHeight,
    fontFamily: fontFamily.regular,
    color: colors.orange,
  },
});
