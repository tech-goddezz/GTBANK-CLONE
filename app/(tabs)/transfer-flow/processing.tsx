// app/(tabs)/transfer-flow/processing.tsx
//
// The three tracking pages after "Confirmed Transfer" (Dashboard flow + transfer
// flow.pdf). You move between them by tapping a button:
//   Funds Sent (S67) → Done → In Transit via NIBSS (S68) → Proceed →
//   Credited to Recipient (S69) → Done → receipt.
//
// S67 matches the design. S68 and S69 keep their old look until they are rebuilt.

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import { fontSize, fontFamily, lineHeight, spacing } from '../../../constants/typography';
import { layout } from '../../../constants/layout';
import ScreenHeader from '../../../components/ScreenHeader';
import Button from '../../../components/Button';
import { getCurrentUserId, fetchProfile } from '../../../services/auth';

type Stage = 'sent' | 'transit' | 'credited';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatAmount = (n: number) =>
  n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// "May 24,2026. 9:11AM", written the way the design writes it
const formatDateTime = (d: Date) => {
  const h = d.getHours() % 12 || 12;
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = d.getHours() < 12 ? 'AM' : 'PM';
  return `${MONTHS[d.getMonth()]} ${d.getDate()},${d.getFullYear()}. ${h}:${m}${ampm}`;
};

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
  const [dateTime] = useState(() => formatDateTime(new Date()));

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

          <View style={styles.panel}>
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
            <Row label="Transaction fee:" value={formatAmount(fee)} />
            <Row label="Reference Id:" value={reference} />
            <Row label="Date and Time:">
              <Text style={styles.rowDate} numberOfLines={1}>{dateTime}</Text>
            </Row>
          </View>

          <View style={styles.note}>
            <MaterialIcons name="error-outline" size={layout.fundsNoteIcon} color={colors.infoIcon} />
            <Text style={styles.noteText} numberOfLines={1}>Recipient will be credited shortly.</Text>
          </View>

          <Button label="Done" onPress={() => setStage('transit')} style={styles.button} />
        </ScrollView>
      ) : (
        // Old look, kept until S68 and S69 are rebuilt
        <View style={styles.oldContent}>
          <Ionicons
            name={stage === 'transit' ? 'swap-horizontal' : 'checkmark-circle'}
            size={72}
            color={stage === 'transit' ? colors.orange : colors.green}
          />
          <Text style={styles.oldTitle}>{TITLES[stage]}</Text>
          <Text style={styles.oldSubtitle}>
            {stage === 'transit' ? 'This takes a few seconds...' : 'Transfer completed successfully'}
          </Text>
          <Button
            label={stage === 'transit' ? 'Proceed' : 'Done'}
            onPress={stage === 'transit' ? () => setStage('credited') : goToReceipt}
            style={styles.oldButton}
          />
        </View>
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
  panel: {
    marginTop: layout.fundsPanelTop,
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
  // Old look for S68 / S69 (temporary)
  oldContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: layout.tabBarHeight,
  },
  oldTitle: {
    marginTop: spacing.xl,
    fontSize: fontSize.heading1,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
    textAlign: 'center',
  },
  oldSubtitle: {
    marginTop: spacing.sm,
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    textAlign: 'center',
  },
  oldButton: { alignSelf: 'stretch', marginTop: spacing.xxxl },
});
