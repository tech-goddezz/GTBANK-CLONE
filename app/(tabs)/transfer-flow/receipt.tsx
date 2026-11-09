// app/(tabs)/transfer-flow/receipt.tsx
//
// "Receipts" (S70 in "Dashboard flow + transfer flow.pdf"), opened from View
// Receipt on "Credited to Recipient". Grey details panel and a Share button.
// The back arrow goes to Home, so you can't land back on "Initiating Transfer".

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Share } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import { fontSize, fontFamily, lineHeight } from '../../../constants/typography';
import { layout } from '../../../constants/layout';
import ScreenHeader from '../../../components/ScreenHeader';
import Button from '../../../components/Button';
import { getCurrentUserId, fetchProfile } from '../../../services/auth';

const formatAmount = (n: number) =>
  n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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

export default function ReceiptScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    amount: string;
    accountName: string;
    accountNumber: string;
    bank: string;
    narration: string;
    reference?: string;
    dateTime?: string;
  }>();
  const [myAccountNumber, setMyAccountNumber] = useState('');

  // Reference and date come from "Funds Sent" so all the screens show the same ones
  const [reference] = useState(() =>
    params.reference || 'TRX' + Math.floor(100000000 + Math.random() * 900000000)
  );
  const [dateTime] = useState(() => params.dateTime || new Date().toLocaleString('en-NG'));

  useEffect(() => {
    const loadProfile = async () => {
      const id = await getCurrentUserId();
      const result = await fetchProfile(id);
      if (result.success && result.profile) setMyAccountNumber(result.profile.account_number ?? '');
    };
    loadProfile();
  }, []);

  const amountText = formatAmount(parseFloat(params.amount ?? '0') || 0);
  const recipientName = params.accountName || params.bank || '';

  const handleShare = async () => {
    const message =
      `GTBank Transfer Receipt\n\nAmount: ${amountText}\nTo: ${recipientName}\n` +
      `${params.bank} • ${params.accountNumber}\nFrom: Main Account ${myAccountNumber}\n` +
      `Reference Id: ${reference}\nDate and Time: ${dateTime}\n\nThank you for banking with us.`;
    try {
      await Share.share({ message });
    } catch (error) {
      console.log('Share failed:', error);
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Receipts"
        subtitle="Review your transfer processes here."
        onBack={() => router.replace('/(tabs)/home')}
        onBellPress={() => router.push('/(tabs)/notifications')}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.panel}>
          <Row label="Amount: " value={amountText} />
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
          <Row label="Reference Id:" value={reference} />
          <Row label="Date and Time:">
            <Text style={styles.rowDate} numberOfLines={1}>{dateTime}</Text>
          </Row>
        </View>

        <View style={styles.shareWrap}>
          <Button
            label="Share"
            variant="secondary"
            onPress={handleShare}
            style={styles.share}
            textStyle={styles.shareText}
          />
          <View style={styles.shareIcon} pointerEvents="none">
            <MaterialIcons name="share" size={layout.receiptShareIcon} color={colors.chatIcon} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  scroll: {
    paddingTop: layout.receiptPanelTop,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.tabBarHeight,
  },
  panel: {
    paddingTop: layout.fundsPanelPadTop,
    paddingBottom: layout.fundsPanelPadBottom,
    paddingHorizontal: layout.confirmRowLineInset,
    backgroundColor: colors.inputBackground,
    // Same very soft shadow as the other transfer panels
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
  // Orange border sits just outside the normal button width, as in the design
  shareWrap: { marginTop: layout.receiptShareTop, marginHorizontal: -1 },
  share: { height: layout.creditedReceiptHeight },
  shareText: { marginLeft: layout.receiptShareTextShift },
  shareIcon: {
    position: 'absolute',
    left: layout.receiptShareIconLeft,
    top: (layout.creditedReceiptHeight - layout.receiptShareIcon) / 2,
  },
});
