// app/(tabs)/transfer-flow/confirm.tsx
// Shows full transfer summary before the user commits.

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../../constants/typography';
import { useAccountStore } from '../../../store/useAccountStore';
import { sendMoney, getCurrentUserId, fetchProfile } from '../../../services/auth';

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, bold && { fontFamily: fontFamily.bold }]}>{value}</Text>
    </View>
  );
}

export default function ConfirmTransferScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    accountNumber: string; accountName: string;
    bank: string; amount: string; narration: string;
  }>();
  const { account, addTransaction, deductBalance } = useAccountStore();
const [loading, setLoading] = useState(false);
const [senderName, setSenderName] = useState('');

useEffect(() => {
  const loadSenderName = async () => {
    const id = await getCurrentUserId();
    const result = await fetchProfile(id);
    if (result.success && result.profile) {
      setSenderName(`${result.profile.first_name ?? ''} ${result.profile.last_name ?? ''}`.trim());
    }
  };
  loadSenderName();
}, []);

  const amountNum = parseFloat(params.amount ?? '0');
  const fee = 0;
  const total = amountNum + fee;

  const formatAmt = (n: number) => `₦${n.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

  const handleProceed = async () => {
  setLoading(true);
  const senderId = await getCurrentUserId();
  const result = await sendMoney(senderId, params.accountNumber ?? '', amountNum, params.narration ?? '');
  setLoading(false);

    if (result.success) {
    router.replace(
      `/(tabs)/transfer-flow/processing?amount=${amountNum}&accountName=${params.accountName}&accountNumber=${params.accountNumber}&bank=${params.bank}&narration=${params.narration}`
    );
  } else {
    console.log('Transfer failed:', result.message);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>

        <Text style={styles.title}>Confirm Transfer</Text>
        <Text style={styles.subtitle}>Review the details before proceeding</Text>

        {/* Amount highlight card */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Transfer Amount</Text>
          <Text style={styles.amountValue}>{formatAmt(amountNum)}</Text>
        </View>

        {/* Details */}
        <View style={styles.detailsCard}>
          <Row label="From" value={senderName} />
          <Row label="To" value={params.accountName ?? ''} />
          <Row label="Account Number" value={params.accountNumber ?? ''} />
          <Row label="Bank" value={params.bank ?? ''} />
          <Row label="Narration" value={params.narration || 'No narration'} />
          <Row label="Transaction Fee" value={formatAmt(fee)} />
          <Row label="Total" value={formatAmt(total)} bold />
        </View>

        <TouchableOpacity
          style={[styles.proceedButton, loading && { opacity: 0.7 }]}
          onPress={handleProceed}
          disabled={loading}
        >
          <Text style={styles.proceedText}>{loading ? 'Processing...' : 'Proceed'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  backButton: { marginTop: spacing.xl, marginBottom: spacing.lg, width: 40, height: 40, justifyContent: 'center' },
  title: { fontSize: fontSize.heading1, fontFamily: fontFamily.bold, color: colors.textDark, marginBottom: spacing.xs },
  subtitle: { fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textGrey, marginBottom: spacing.xl },
  amountCard: {
    backgroundColor: colors.orange, borderRadius: radius.card, padding: spacing.xl,
    alignItems: 'center', marginBottom: spacing.lg,
  },
  amountLabel: { fontSize: fontSize.small, fontFamily: fontFamily.regular, color: 'rgba(255,255,255,0.8)', marginBottom: spacing.xs },
  amountValue: { fontSize: 32, fontFamily: fontFamily.bold, color: colors.white },
  detailsCard: {
    backgroundColor: colors.white, borderRadius: radius.card, borderWidth: 1,
    borderColor: colors.borderLight, marginBottom: spacing.xl, overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  rowLabel: { fontSize: fontSize.small, fontFamily: fontFamily.regular, color: colors.textGrey },
  rowValue: { fontSize: fontSize.small, fontFamily: fontFamily.medium, color: colors.textDark, maxWidth: '60%', textAlign: 'right' },
  proceedButton: {
    backgroundColor: colors.orange, height: 54, borderRadius: radius.button,
    alignItems: 'center', justifyContent: 'center',
  },
  proceedText: { fontSize: fontSize.large, fontFamily: fontFamily.semibold, color: colors.white },
});
