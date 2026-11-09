// app/(tabs)/transfer-flow/confirm.tsx
//
// "Initiating Transfer" (S54–S58 in "Screens inside the home screen.pdf"): the
// review screen after Proceed on any Send form. From box (your account and
// balance), To box (recipient), Amount / fee / Total panel, narration, and
// Confirm Transfer.
//
// Confirm Transfer sends the money exactly as before. The design's "Enter your
// 4-digit code" step (S59–S65) will slot in here once it's built.

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import { fontSize, fontFamily, lineHeight } from '../../../constants/typography';
import { layout } from '../../../constants/layout';
import ScreenHeader from '../../../components/ScreenHeader';
import Button from '../../../components/Button';
import { sendMoney, getCurrentUserId, fetchProfile } from '../../../services/auth';

const formatAmount = (n: number) => n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function ConfirmTransferScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    accountNumber: string; accountName: string;
    bank: string; amount: string; narration: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [myAccountNumber, setMyAccountNumber] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  // Time shown next to your account number, as in the design
  const [time] = useState(() =>
    new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  );

  useEffect(() => {
    const loadProfile = async () => {
      const id = await getCurrentUserId();
      const result = await fetchProfile(id);
      if (result.success && result.profile) {
        setMyAccountNumber(result.profile.account_number ?? '');
        setBalance(result.profile.balance ?? 0);
      }
    };
    loadProfile();
  }, []);

  const amountNum = parseFloat(params.amount ?? '0') || 0;
  const fee = 0;
  const total = amountNum + fee;
  // Wallet forms have no account holder's name: show the bank name instead.
  const recipientName = params.accountName || params.bank || '';

  const handleConfirm = async () => {
    setError('');
    setLoading(true);
    const senderId = await getCurrentUserId();
    const result = await sendMoney(senderId, params.accountNumber ?? '', amountNum, params.narration ?? '');
    setLoading(false);

    if (result.success) {
      router.replace(
        `/(tabs)/transfer-flow/processing?amount=${amountNum}&accountName=${params.accountName}&accountNumber=${params.accountNumber}&bank=${params.bank}&narration=${params.narration}`
      );
    } else {
      setError(result.message || 'Transfer failed. Please try again.');
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Initiating  Transfer"
        subtitle="Review your transfer processes here."
        onBellPress={() => router.push('/(tabs)/notifications')}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.smallLabel}>From:</Text>
        <View style={styles.partyBox}>
          <View style={styles.circle}>
            <MaterialIcons name="account-balance" size={layout.sendIcon} color={colors.white} />
          </View>
          <View style={styles.partyText}>
            <Text style={styles.partyName} numberOfLines={1}>Main Account</Text>
            <Text style={styles.partySub} numberOfLines={1}>
              {myAccountNumber}    • {time}
            </Text>
          </View>
          <View style={styles.balance}>
            <Text style={styles.balanceAmount} numberOfLines={1}>
              {balance === null ? '' : `₦${formatAmount(balance)}`}
            </Text>
            <Text style={styles.balanceLabel}>Av. Balance</Text>
          </View>
        </View>

        <Text style={[styles.smallLabel, styles.nextLabel]}>To:</Text>
        <View style={styles.partyBox}>
          <View style={styles.circle}>
            <MaterialIcons name="person" size={layout.confirmPersonIcon} color={colors.white} />
          </View>
          <View style={styles.partyText}>
            <Text style={styles.partyName} numberOfLines={1}>{recipientName}</Text>
            <Text style={styles.partySub} numberOfLines={1}>
              {params.bank}  • {params.accountNumber}
            </Text>
          </View>
        </View>

        <View style={styles.lower}>
          <Text style={[styles.smallLabel, styles.nextLabel]}>Transfer details:</Text>
          <View style={styles.panel}>
            <DetailRow label="Amount: " value={formatAmount(amountNum)} />
            <DetailRow label="Transaction fee:" value={formatAmount(fee)} />
            <DetailRow label="Total:" value={formatAmount(total)} />
          </View>

          <Text style={[styles.smallLabel, styles.nextLabel]}>Narration:</Text>
          <View style={styles.narrationBox}>
            <Text style={styles.narrationText} numberOfLines={1}>
              {params.narration || 'No narration'}
            </Text>
          </View>

          <Button
            label="Confirm Transfer"
            onPress={handleConfirm}
            loading={loading}
            style={styles.button}
          />
          {!!error && <Text style={styles.error}>{error}</Text>}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  scroll: {
    paddingTop: layout.confirmLabelTop,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.tabBarHeight,
  },
  smallLabel: {
    fontSize: fontSize.small,
    lineHeight: layout.confirmSmallLabelLineHeight,
    fontFamily: fontFamily.regular,
    color: colors.textBalance,
    marginBottom: layout.confirmLabelGap,
  },
  nextLabel: { marginTop: layout.confirmSectionGap },
  partyBox: {
    width: layout.confirmBoxWidth,
    height: layout.inputHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.confirmBoxPadding,
    backgroundColor: colors.inputBackground,
  },
  circle: {
    width: layout.sendCircle,
    height: layout.sendCircle,
    borderRadius: layout.sendCircle / 2,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partyText: { flex: 1, marginLeft: layout.confirmTextGap },
  partyName: {
    fontSize: fontSize.large,
    lineHeight: layout.confirmNameLineHeight,
    fontFamily: fontFamily.semibold,
    color: colors.textLightDark,
  },
  partySub: {
    fontSize: fontSize.body,
    lineHeight: layout.confirmSubLineHeight,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  balance: {
    alignItems: 'flex-end',
    marginRight: layout.confirmBalanceRight - layout.confirmBoxPadding,
  },
  balanceAmount: {
    fontSize: fontSize.large,
    lineHeight: layout.confirmNameLineHeight,
    fontFamily: fontFamily.semibold,
    color: colors.textBalance,
  },
  balanceLabel: {
    fontSize: fontSize.small,
    lineHeight: layout.confirmSmallLabelLineHeight,
    fontFamily: fontFamily.regular,
    color: colors.textBalance,
  },
  // Details, narration and button sit 2px further in than the boxes above, as in the design
  lower: { marginHorizontal: layout.confirmPanelSide - layout.screenPadding },
  panel: {
    marginTop: layout.confirmPanelTop - layout.confirmLabelGap,
    paddingTop: layout.confirmPanelPadTop,
    paddingBottom: layout.confirmPanelPadBottom,
    paddingHorizontal: layout.confirmRowLineInset,
    backgroundColor: colors.white,
    // Very soft shadow all round
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 17,
    elevation: 3,
  },
  detailRow: {
    height: layout.confirmRowHeight,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: layout.confirmRowTextInset,
    paddingBottom: layout.confirmRowTextBottom,
    borderBottomWidth: layout.confirmRowLine,
    borderBottomColor: colors.settingsLine,
  },
  detailLabel: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textCharcoal,
  },
  detailValue: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.bold,
    color: colors.black,
  },
  narrationBox: {
    height: layout.inputHeight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.confirmBoxPadding,
    backgroundColor: colors.infoBlueFaint,
    borderWidth: 0.5,
    borderColor: colors.infoBlue,
  },
  narrationText: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.regular,
    color: colors.textLightDark,
  },
  button: { marginTop: layout.confirmButtonTop },
  error: {
    marginTop: 8,
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.red,
  },
});
