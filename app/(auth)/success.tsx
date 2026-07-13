// app/(auth)/success.tsx
// "Account Created" celebration screen. Copy button uses expo-clipboard
// to actually copy the account number — a small real interaction rather
// than a decorative button that does nothing when tapped.

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import Button from '../../components/Button';
import { mockAccount } from '../../constants/mockData';

export default function SuccessScreen() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(mockAccount.accountNumber);
    setCopied(true);
    // Reverts the label back to "Copy" after a couple seconds so the
    // button doesn't permanently say "Copied" if they tap it again later.
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    // Next step is setting up a transaction PIN before landing on the
    // dashboard — a real bank wouldn't drop you into the app with no PIN set.
    router.push('/(auth)/pin');
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="checkmark-circle" size={88} color={colors.green} />
      </View>

      <Text style={styles.title}>Congrats!</Text>
      <Text style={styles.subtitle}>
        Your GTBank account has been created successfully
      </Text>

      <View style={styles.accountCard}>
        <Text style={styles.accountLabel}>Account Number</Text>
        <View style={styles.accountRow}>
          <Text style={styles.accountNumber}>{mockAccount.accountNumber}</Text>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={handleCopy}
            accessibilityRole="button"
            accessibilityLabel="Copy account number"
          >
            <Ionicons
              name={copied ? 'checkmark' : 'copy-outline'}
              size={16}
              color={colors.orange}
            />
            <Text style={styles.copyText}>{copied ? 'Copied' : 'Copy'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonArea}>
        <Button label="Continue" onPress={handleContinue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: { marginBottom: spacing.xl },
  title: {
    fontSize: fontSize.heading1,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
    lineHeight: 22,
  },
  accountCard: {
    width: '100%',
    backgroundColor: colors.pageBackground,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.xxxl,
  },
  accountLabel: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.medium,
    color: colors.textGrey,
    marginBottom: spacing.xs,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountNumber: {
    fontSize: fontSize.heading2,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
    letterSpacing: 1,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.orangeFaint,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  copyText: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.semibold,
    color: colors.orange,
  },
  buttonArea: { width: '100%' },
});