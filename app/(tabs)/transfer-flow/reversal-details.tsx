// app/(tabs)/transfer-flow/reversal-details.tsx
//
// "Auto-reversal" (S77 in "Dashboard flow + transfer flow.pdf"), opened by tapping
// a card on the Notification page. Shows the details of a reversed transfer.
// The app has no real reversals yet: the amount is the design's sample 5,000.00,
// the money goes back to your own account, and the reference and date are made
// when the page opens. View Receipt opens the reversal receipt (S78, receipt.tsx).

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import colors from '../../../constants/colors';
import { fontSize, fontFamily, lineHeight } from '../../../constants/typography';
import { layout } from '../../../constants/layout';
import ScreenHeader from '../../../components/ScreenHeader';
import Button from '../../../components/Button';
import { formatTransferDateTime } from '../../../components/TransferSteps';
import { getCurrentUserId, fetchProfile } from '../../../services/auth';

function Row({ label, value, twoLine, children }: {
  label: string; value?: string; twoLine?: boolean; children?: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, twoLine && styles.rowLabelTwoLine]}>{label}</Text>
      {children ?? <Text style={styles.rowValue} numberOfLines={1}>{value}</Text>}
    </View>
  );
}

export default function ReversalDetailsScreen() {
  const router = useRouter();
  const [myName, setMyName] = useState('');
  const [myAccountNumber, setMyAccountNumber] = useState('');
  const [reference] = useState(() => 'TRX' + Math.floor(100000000 + Math.random() * 900000000));
  const [dateTime] = useState(() => formatTransferDateTime(new Date()));

  // The reversed money comes back to you, so "Reversed to" is your own account
  useEffect(() => {
    const loadProfile = async () => {
      const id = await getCurrentUserId();
      const result = await fetchProfile(id);
      if (result.success && result.profile) {
        const p = result.profile;
        setMyName([p.first_name, p.last_name].filter(Boolean).join(' '));
        setMyAccountNumber(p.account_number ?? '');
      }
    };
    loadProfile();
  }, []);

  // The receipt shows the same reference and date as this page
  const openReceipt = () =>
    router.push(
      `/transfer-flow/receipt?type=reversal&amount=5000&reference=${reference}&dateTime=${encodeURIComponent(dateTime)}`
    );

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Auto-reversal" subtitle="Review your transfer processes here." />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          {'Reversing 5,000 NGN from NIBSS. Estimated time is\n2 hours.'}
        </Text>

        <View style={styles.panel}>
          <Row label="Amount: " value="5,000.00" />
          <Row label="Reversed to:" twoLine>
            <View style={styles.twoLineValue}>
              <Text style={styles.toName} numberOfLines={1}>{myName}</Text>
              <Text style={styles.toSub} numberOfLines={1}>GTBank• {myAccountNumber}</Text>
            </View>
          </Row>
          <Row label="From:" twoLine>
            <View style={styles.fromValue}>
              <Text style={styles.fromName}>NIBSS</Text>
              <Text style={styles.fromSub}>C/O GTbank.</Text>
            </View>
          </Row>
          <Row label="Reference Id:" value={reference} />
          <Row label="Date and Time:">
            <Text style={styles.rowDate} numberOfLines={1}>{dateTime}</Text>
          </Row>
        </View>

        <View style={styles.note}>
          <MaterialIcons name="error-outline" size={layout.fundsNoteIcon} color={colors.infoIcon} />
          <Text style={styles.noteText} numberOfLines={1}>Thank you for banking with us.</Text>
        </View>

        <Button label="View Receipt" variant="secondary" onPress={openReceipt} style={styles.viewReceipt} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  scroll: {
    paddingTop: layout.autoIntroTop,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.tabBarHeight,
  },
  intro: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  // Same white panel as "Funds Sent" / "Credited to Recipient"
  panel: {
    marginTop: layout.autoPanelTop,
    marginHorizontal: layout.fundsPanelSide - layout.screenPadding,
    paddingTop: layout.fundsPanelPadTop,
    paddingBottom: layout.fundsPanelPadBottom,
    paddingHorizontal: layout.confirmRowLineInset,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 17,
    elevation: 3,
  },
  row: {
    height: layout.fundsRowHeight,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: layout.confirmRowTextInset,
    paddingBottom: layout.confirmRowTextBottom,
    borderBottomWidth: layout.confirmRowLine,
    borderBottomColor: colors.settingsLine,
  },
  rowLabel: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textCharcoal,
  },
  rowLabelTwoLine: {
    marginBottom: layout.fundsLabelBottomTwoLine - layout.confirmRowTextBottom,
  },
  rowValue: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.bold,
    color: colors.black,
  },
  rowDate: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.semibold,
    color: colors.textCharcoal,
  },
  twoLineValue: { alignItems: 'flex-end', marginBottom: layout.fundsValueDrop, flexShrink: 1 },
  toName: {
    fontSize: fontSize.large,
    lineHeight: layout.confirmNameLineHeight,
    fontFamily: fontFamily.semibold,
    color: colors.textLightDark,
  },
  toSub: {
    fontSize: fontSize.body,
    lineHeight: layout.confirmSubLineHeight,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  fromValue: { alignItems: 'flex-end', marginBottom: layout.fundsFromDrop },
  fromName: {
    fontSize: fontSize.body,
    lineHeight: layout.fundsFromLineHeight,
    fontFamily: fontFamily.bold,
    color: colors.black,
  },
  fromSub: {
    fontSize: fontSize.body,
    lineHeight: layout.fundsFromLineHeight,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  note: {
    marginTop: layout.creditedNoteTop,
    height: layout.autoNoteHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: layout.failedBoxIconLeft,
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
  // Orange border sits just outside the normal button width, as in the design
  viewReceipt: {
    marginTop: layout.autoReceiptTop,
    marginHorizontal: -1,
    height: layout.creditedReceiptHeight,
  },
});
