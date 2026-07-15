// Full transaction receipt shown after a successful transfer.

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../../constants/typography';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function ReceiptScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    amount: string; accountName: string;
    accountNumber: string; bank: string; narration: string;
  }>();

  const amount = parseFloat(params.amount ?? '5000');
  const formatAmt = (n: number) => `₦${n.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
  const refNumber = `${Date.now()}`.slice(-10);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Receipts</Text>
          <Text style={styles.subtitle}>Review your transfer process here.</Text>
        </View>

        <View style={styles.card}>
          <Row label="Amount" value={formatAmt(amount)} />
          <Row label="To" value={params.accountName ?? 'John Adewale'} />
          <Row label="From" value="Savings Account" />
          <Row label="Bank" value={params.bank ?? 'GTBank'} />
          <Row label="Account" value={params.accountNumber ?? '0GTCP35WG'} />
          <Row label="Reference Id" value={refNumber} />
          <Row label="Date and Time" value={`${dateStr}, ${timeStr}AM`} />
        </View>

        <View style={styles.thankyouCard}>
          <Text style={styles.thankyouText}>Thank you for banking with us.</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={20} color={colors.orange} />
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewReceiptButton}>
            <Text style={styles.viewReceiptText}>View Receipt</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => router.replace('/(tabs)/home')}
        >
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.pageBackground },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  header: { paddingTop: spacing.xl, marginBottom: spacing.lg },
  title: { fontSize: fontSize.heading1, fontFamily: fontFamily.bold, color: colors.textDark },
  subtitle: { fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textGrey, marginTop: spacing.xs },
  card: {
    backgroundColor: colors.white, borderRadius: radius.card, overflow: 'hidden',
    marginBottom: spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  rowLabel: { fontSize: fontSize.small, fontFamily: fontFamily.regular, color: colors.textGrey },
  rowValue: { fontSize: fontSize.small, fontFamily: fontFamily.semibold, color: colors.textDark, maxWidth: '55%', textAlign: 'right' },
  thankyouCard: {
    backgroundColor: colors.orangeFaint, borderRadius: radius.card, padding: spacing.lg,
    alignItems: 'center', marginBottom: spacing.lg,
  },
  thankyouText: { fontSize: fontSize.body, fontFamily: fontFamily.medium, color: colors.orange, textAlign: 'center' },
  actionRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  shareButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.xs, borderWidth: 1.5, borderColor: colors.orange, borderRadius: radius.button, height: 48,
  },
  shareText: { fontSize: fontSize.body, fontFamily: fontFamily.medium, color: colors.orange },
  viewReceiptButton: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: colors.borderLight, borderRadius: radius.button, height: 48,
  },
  viewReceiptText: { fontSize: fontSize.body, fontFamily: fontFamily.medium, color: colors.textDark },
  doneButton: {
    backgroundColor: colors.orange, height: 54, borderRadius: radius.button,
    alignItems: 'center', justifyContent: 'center',
  },
  doneText: { fontSize: fontSize.large, fontFamily: fontFamily.semibold, color: colors.white },
});