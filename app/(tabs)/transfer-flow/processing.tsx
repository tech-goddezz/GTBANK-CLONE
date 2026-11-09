// app/(tabs)/transfer-flow/processing.tsx
//
// The three tracking pages after "Confirmed Transfer" (Dashboard flow + transfer
// flow.pdf). You move between them by tapping a button:
//   Funds Sent (S67) → Done → In Transit via NIBSS (S68) → Proceed →
//   Credited to Recipient (S69) → Done → Home, or View Receipt → receipt.

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import { fontSize, fontFamily, lineHeight } from '../../../constants/typography';
import { layout } from '../../../constants/layout';
import ScreenHeader from '../../../components/ScreenHeader';
import Button from '../../../components/Button';
import { TransferStep, TransferStepsPanel, formatTransferDateTime } from '../../../components/TransferSteps';
import { getCurrentUserId, fetchProfile } from '../../../services/auth';

type Stage = 'sent' | 'transit' | 'credited';

const formatAmount = (n: number) =>
  n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const TITLES: Record<Stage, string> = {
  sent: 'Funds Sent',
  transit: 'In Transit via NIBSS',
  credited: 'Credited to Recipient',
};

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

export default function ProcessingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    amount: string; accountName: string; accountNumber: string; bank: string; narration: string;
  }>();
  const [stage, setStage] = useState<Stage>('sent');
  const [myAccountNumber, setMyAccountNumber] = useState('');
  // Made once here and passed to the receipt, so both show the same ones
  const [reference] = useState(() => 'TRX' + Math.floor(100000000 + Math.random() * 900000000));
  const [dateTime] = useState(() => formatTransferDateTime(new Date()));

  useEffect(() => {
    const loadProfile = async () => {
      const id = await getCurrentUserId();
      const result = await fetchProfile(id);
      if (result.success && result.profile) setMyAccountNumber(result.profile.account_number ?? '');
    };
    loadProfile();
  }, []);

  const amountNum = parseFloat(params.amount ?? '0') || 0;
  const fee = 0;
  const recipientName = params.accountName || params.bank || '';

  const goToReceipt = () =>
    router.replace(
      `/(tabs)/transfer-flow/receipt?amount=${params.amount}&accountName=${params.accountName}&accountNumber=${params.accountNumber}&bank=${params.bank}&narration=${params.narration}&reference=${reference}&dateTime=${encodeURIComponent(dateTime)}`
    );

  // White details panel, shared by Funds Sent (with fee row) and Credited to Recipient (without)
  const detailsPanel = (showFee: boolean, extraStyle?: object) => (
    <View style={[styles.panel, extraStyle]}>
      <Row label="Amount: " value={formatAmount(amountNum)} />
      <Row label="To:" twoLine>
        <View style={styles.twoLineValue}>
          <Text style={styles.toName} numberOfLines={1}>{recipientName}</Text>
          <Text style={styles.toSub} numberOfLines={1}>
            {params.bank}  • {params.accountNumber}
          </Text>
        </View>
      </Row>
      <Row label="From:" twoLine>
        <View style={styles.fromValue}>
          <Text style={styles.fromName}>Main Account</Text>
          <Text style={styles.fromNumber}>{myAccountNumber}</Text>
        </View>
      </Row>
      {showFee && <Row label="Transaction fee:" value={formatAmount(fee)} />}
      <Row label="Reference Id:" value={reference} />
      <Row label="Date and Time:">
        <Text style={styles.rowDate} numberOfLines={1}>{dateTime}</Text>
      </Row>
    </View>
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={TITLES[stage]}
        subtitle="Review your transfer processes here."
        onBellPress={() => router.push('/(tabs)/notifications')}
      />

      {stage === 'sent' ? (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.circle}>
            <Image
              source={require('../../../assets/images/transfer-success-tick.png')}
              style={styles.tick}
            />
          </View>

          {detailsPanel(true, styles.fundsPanelGap)}

          <View style={styles.note}>
            <MaterialIcons name="error-outline" size={layout.fundsNoteIcon} color={colors.infoIcon} />
            <Text style={styles.noteText} numberOfLines={1}>Recipient will be credited shortly.</Text>
          </View>

          <Button label="Done" onPress={() => setStage('transit')} style={styles.button} />
        </ScrollView>
      ) : stage === 'transit' ? (
        <ScrollView contentContainerStyle={styles.transitScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.intro}>{'Your transfer is being processed securely by\nNIBSS'}</Text>

          <TouchableOpacity
            style={styles.helpLink}
            onPress={() => router.push('/(settings)/get-help')}
            accessibilityRole="link"
          >
            <Text style={styles.helpText}>Need help?</Text>
          </TouchableOpacity>

          <TransferStepsPanel style={styles.stepsPanel}>
            <TransferStep state="done" title="Funds Sent" sub={dateTime} />
            <TransferStep state="current" title="In Transit via NIBSS" sub="Processing...." />
            <TransferStep state="pending" title="Credited to Recipient" sub="Pending..." last />
          </TransferStepsPanel>

          <View style={[styles.note, styles.transitNote]}>
            <MaterialIcons name="error-outline" size={layout.fundsNoteIcon} color={colors.infoIcon} />
            <Text style={styles.noteText} numberOfLines={1}>This takes few seconds.</Text>
          </View>

          <Button label="Proceed" onPress={() => setStage('credited')} style={styles.proceed} />
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.creditedScroll} showsVerticalScrollIndicator={false}>
          {detailsPanel(false)}

          <View style={[styles.note, styles.creditedNote]}>
            <MaterialIcons name="error-outline" size={layout.fundsNoteIcon} color={colors.infoIcon} />
            <Text style={styles.noteText} numberOfLines={1}>Thank you for banking with us.</Text>
          </View>

          <Button label="Done" onPress={() => router.replace('/(tabs)/home')} style={styles.creditedDone} />
          <Button label="View Receipt" variant="secondary" onPress={goToReceipt} style={styles.viewReceipt} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  scroll: {
    paddingTop: layout.fundsCircleTop,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.tabBarHeight,
  },
  circle: {
    alignSelf: 'center',
    width: layout.fundsCircle,
    height: layout.fundsCircle,
    borderRadius: layout.fundsCircle / 2,
    backgroundColor: colors.successCircle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tick: { width: layout.fundsTick, height: layout.fundsTick },
  fundsPanelGap: { marginTop: layout.fundsPanelTop },
  panel: {
    marginHorizontal: layout.fundsPanelSide - layout.screenPadding,
    paddingTop: layout.fundsPanelPadTop,
    paddingBottom: layout.fundsPanelPadBottom,
    paddingHorizontal: layout.confirmRowLineInset,
    backgroundColor: colors.white,
    // Same very soft shadow as the Initiating Transfer panel
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
  fromNumber: {
    fontSize: fontSize.body,
    lineHeight: layout.fundsFromLineHeight,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  note: {
    marginTop: layout.fundsNoteTop,
    height: layout.inputHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: layout.fundsNoteIconLeft,
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
  button: { marginTop: layout.fundsButtonTop },
  // In Transit via NIBSS (S68)
  transitScroll: {
    paddingTop: layout.transitIntroTop,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.tabBarHeight,
  },
  intro: {
    marginLeft: layout.transitIntroLeft,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  helpLink: {
    alignSelf: 'flex-end',
    marginTop: layout.transitHelpTop,
    marginRight: layout.transitHelpRight,
  },
  helpText: {
    fontSize: layout.transitHelpSize,
    lineHeight: layout.transitHelpLineHeight,
    fontFamily: fontFamily.regular,
    color: colors.orange,
  },
  stepsPanel: { marginTop: layout.transitPanelTop },
  transitNote: { marginTop: layout.transitNoteTop, height: layout.transitNoteHeight },
  proceed: {
    alignSelf: 'flex-end',
    width: layout.transitButtonWidth,
    marginTop: layout.transitButtonTop,
  },
  // Credited to Recipient (S69)
  creditedScroll: {
    paddingTop: layout.creditedPanelTop,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.tabBarHeight,
  },
  creditedNote: { marginTop: layout.creditedNoteTop, height: layout.transitNoteHeight },
  creditedDone: { marginTop: layout.creditedButtonTop },
  // Orange border sits just outside the normal button width, as in the design
  viewReceipt: {
    marginTop: layout.creditedReceiptTop,
    marginHorizontal: -1,
    height: layout.creditedReceiptHeight,
  },
});
