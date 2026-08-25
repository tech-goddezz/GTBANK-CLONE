import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../../constants/typography';

export default function ReceiptScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    amount: string;
    accountName: string;
    accountNumber: string;
    bank: string;
    narration: string;
  }>();

  const [reference] = useState(() =>
    Math.floor(1000000000 + Math.random() * 9000000000).toString()
  );
  const [dateTime] = useState(() =>
    new Date().toLocaleString('en-NG', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  );

  const buildReceiptMessage = () => {
    return `GTBank Transfer Receipt\n\nAmount: ₦${params.amount}\nTo: ${params.accountName}\nFrom: Savings Account\nBank: ${params.bank}\nAccount: ${params.accountNumber}\nReference ID: ${reference}\nDate and Time: ${dateTime}\n\nThank you for banking with us.`;
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: buildReceiptMessage() });
    } catch (error) {
      console.log('Share failed:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom'] as any}>
      <Text style={styles.title}>Receipts</Text>
      <Text style={styles.subtitle}>Review your transfer process here.</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Amount</Text>
          <Text style={styles.rowValue}>₦{params.amount}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>To</Text>
          <Text style={styles.rowValue}>{params.accountName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>From</Text>
          <Text style={styles.rowValue}>Savings Account</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Bank</Text>
          <Text style={styles.rowValue}>{params.bank}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Account</Text>
          <Text style={styles.rowValue}>{params.accountNumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Reference Id</Text>
          <Text style={styles.rowValue}>{reference}</Text>
        </View>
        <View style={[styles.row, styles.rowLast]}>
          <Text style={styles.rowLabel}>Date and Time</Text>
          <Text style={styles.rowValue}>{dateTime}</Text>
        </View>
      </View>

      <View style={styles.thankYouBox}>
        <Text style={styles.thankYouText}>Thank you for banking with us.</Text>
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={20} color={colors.orange} />
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewReceiptButton} onPress={handleShare}>
          <Text style={styles.viewReceiptText}>View Receipt</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => router.replace('/(tabs)/home')}
      >
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, paddingHorizontal: spacing.xl },
  title: {
    fontSize: fontSize.heading1,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
    marginTop: spacing.xxxl,
  },
  subtitle: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rowLast: { borderBottomWidth: 0 },
  rowLabel: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  rowValue: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.medium,
    color: colors.textDark,
  },
  thankYouBox: {
    backgroundColor: '#FEECE3',
    borderRadius: radius.card,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  thankYouText: {
    color: colors.orange,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.small,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.orange,
    borderRadius: 6,
    paddingVertical: spacing.md,
  },
  shareText: {
    color: colors.orange,
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.body,
  },
  viewReceiptButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 6,
    paddingVertical: spacing.md,
  },
  viewReceiptText: {
    color: colors.textDark,
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.body,
  },
  doneButton: {
    backgroundColor: colors.orange,
    borderRadius: 6,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  doneButtonText: {
    color: colors.white,
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.body,
  },
});
