// app/(tabs)/transfer-flow/checking.tsx
//
// Transfer Tracking pages (Dashboard flow + transfer flow.pdf), opened from
// "Check Status" on the Transfers tab:
//   Still checking (S71) → tap the orange stop circle → Transfer failed (S72).
// There is no real NIBSS check: the tap only shows the next design. Both pages
// have a timer that counts up from 0:00.

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import { fontSize, fontFamily, lineHeight } from '../../../constants/typography';
import { layout } from '../../../constants/layout';
import ScreenHeader from '../../../components/ScreenHeader';
import { getCurrentUserId, fetchTransactions, lookupAccountName } from '../../../services/auth';

type Stage = 'checking' | 'failed';

// 75 seconds → "1:15"
const formatTimer = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

export default function CheckingScreen() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('checking');
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

  // The timer counts up while the page is open, and starts again on each stage
  useEffect(() => {
    setSeconds(0);
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [stage]);

  const helpLink = (style: object) => (
    <TouchableOpacity
      style={[styles.helpLink, style]}
      onPress={() => router.push('/(settings)/get-help')}
      accessibilityRole="link"
    >
      <Text style={styles.helpText}>Need help?</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Transfer Tracking"
        subtitle="Track your transfers in minutes."
        onBack={() => router.replace('/(tabs)/transfer-flow')}
        onBellPress={() => router.push('/(tabs)/notifications')}
      />

      {stage === 'checking' ? (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.circle}
            onPress={() => setStage('failed')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Stop checking"
          >
            <View style={styles.stopSquare} />
          </TouchableOpacity>

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

          {helpLink(styles.checkHelp)}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.failedScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.failedBox}>
            <MaterialIcons name="error-outline" size={layout.fundsNoteIcon} color={colors.redDark} />
            <Text style={styles.failedText}>{'Transfer failed.Checking NIBSS\ndatabase'}</Text>
          </View>

          <Text style={[styles.text, styles.gap]}>NIBSS confirms the transfer was not successful.</Text>
          <Text style={[styles.text, styles.gap]}>Automatic reversal setting up....</Text>
          <Text style={[styles.text, styles.gap]}>Estimated time for complete reversal ...</Text>
          <Text style={[styles.text, styles.minutes, styles.gap]}>30 minutes</Text>

          <Text style={styles.timer}>{formatTimer(seconds)}</Text>

          <View style={styles.safeCard}>
            <View style={styles.bankCircle}>
              <MaterialIcons name="account-balance" size={layout.failedBankIcon} color={colors.white} />
            </View>
            <Text style={styles.safeText}>
              {"Don't worry your money is safe.We are\nautomatically reversing your transfers."}
            </Text>
          </View>

          {helpLink(styles.failedHelp)}
        </ScrollView>
      )}
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
  helpLink: { alignSelf: 'flex-end' },
  checkHelp: { marginTop: layout.checkHelpTop, marginRight: layout.checkHelpRight },
  helpText: {
    fontSize: layout.transitHelpSize,
    lineHeight: layout.transitHelpLineHeight,
    fontFamily: fontFamily.regular,
    color: colors.orange,
  },
  // Transfer failed (S72)
  failedScroll: {
    paddingTop: layout.failedBoxTop,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.tabBarHeight,
  },
  failedBox: {
    height: layout.failedBoxHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: layout.failedBoxIconLeft,
    backgroundColor: colors.failedBox,
    borderWidth: 0.5,
    borderColor: colors.failedBorder,
  },
  failedText: {
    marginLeft: layout.fundsNoteTextGap,
    fontSize: fontSize.large,
    lineHeight: layout.failedTextLineHeight,
    fontFamily: fontFamily.regular,
    color: colors.redDark,
  },
  safeCard: {
    marginTop: layout.failedCardTop,
    height: layout.failedCardHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.failedCardPad,
    backgroundColor: colors.white,
  },
  bankCircle: {
    width: layout.checkCircle,
    height: layout.checkCircle,
    borderRadius: layout.checkCircle / 2,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeText: {
    marginLeft: layout.failedCardTextGap,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  failedHelp: { marginTop: layout.failedHelpTop, marginRight: layout.failedHelpRight },
});
