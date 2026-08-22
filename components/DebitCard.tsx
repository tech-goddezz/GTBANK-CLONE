// components/DebitCard.tsx
// The orange debit card shown on Card Management. Pulls directly from
// useAccountStore, same pattern as BalanceCard — no props needed, it's
// self-contained and reads/writes the global card state.

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import colors from '../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../constants/typography';
import { formatCurrency } from '../constants/mockData';

interface DebitCardProps {
  card: any;
  balance: number;
}

// Splits a raw digit string into groups of 4 for readable display —
// "2342456487654782" becomes "2342 4564 8765 4782".
const formatCardNumber = (raw: string): string => {
  const digitsOnly = raw.replace(/\s/g, '');
  return digitsOnly.match(/.{1,4}/g)?.join(' ') ?? raw;
};

// When hidden, we only ever show the last 4 digits — never the full
// number by default. This matches how every real banking app behaves;
// showing the full number by default would be a real security smell.
const maskCardNumber = (raw: string): string => {
  const digitsOnly = raw.replace(/\s/g, '');
  const last4 = digitsOnly.slice(-4);
  return `•••• •••• •••• ${last4}`;
};

export default function DebitCard({ card, balance }: DebitCardProps) {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!card) return null;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(card.masked_number.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View>
      <View style={styles.card}>
        {/* Top row: chip icon + VISA wordmark */}
        <View style={styles.topRow}>
          <View style={styles.chip} />
          <Text style={styles.visaText}>VISA</Text>
        </View>

        {/* Balance is only shown once details are revealed — matches
            the Figma's masked ($ *****) vs revealed ($147,000.00) states */}
        

        <Text style={styles.balanceLabel}>Card Balance</Text>
<Text style={styles.balance}>
  {detailsVisible ? formatCurrency(balance) : '₦ *****'}
</Text>

<Text style={styles.cardNumber}>
  {detailsVisible
    ? formatCardNumber(card.masked_number)
    : maskCardNumber(card.masked_number)}
</Text>

<View style={styles.bottomRow}>
  <View>
    <Text style={styles.fieldLabel}>Expires</Text>
    <Text style={styles.fieldValue}>{card.expiry_date}</Text>
  </View>
  <View>
    <Text style={styles.fieldLabel}>CVV</Text>
    <Text style={styles.fieldValue}>
      {detailsVisible ? card.cvv : '•••'}
    </Text>
  </View>
</View>

        {/* Frozen overlay — a real visual cue, not just a toggle changing
            color elsewhere. Makes "this card can't be used right now"
            unmistakable at a glance. */}
        {card.is_frozen && (
          <View style={styles.frozenOverlay}>
            <Ionicons name="snow-outline" size={28} color={colors.white} />
            <Text style={styles.frozenText}>Card Frozen</Text>
          </View>
        )}
      </View>

      {/* Details / Copy buttons, side by side under the card */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setDetailsVisible((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={detailsVisible ? 'Hide card details' : 'Show card details'}
        >
          <Ionicons
            name={detailsVisible ? 'eye-off-outline' : 'eye-outline'}
            size={18}
            color={colors.textDark}
          />
          <Text style={styles.actionLabel}>
            {detailsVisible ? 'Hide' : 'Details'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCopy}
          accessibilityRole="button"
          accessibilityLabel="Copy card number"
        >
          <Ionicons
            name={copied ? 'checkmark' : 'copy-outline'}
            size={18}
            color={colors.textDark}
          />
          <Text style={styles.actionLabel}>{copied ? 'Copied' : 'Copy'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.orange,
    borderRadius: radius.card,
    padding: spacing.xl,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  chip: {
    width: 36,
    height: 26,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  visaText: {
    fontSize: fontSize.heading3,
    fontFamily: fontFamily.bold,
    color: colors.white,
    letterSpacing: 1,
  },
  balanceLabel: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 2,
  },
  balance: {
    fontSize: 26,
    fontFamily: fontFamily.bold,
    color: colors.white,
    marginBottom: spacing.lg,
  },
  cardNumber: {
    fontSize: fontSize.heading3,
    fontFamily: fontFamily.semibold,
    color: colors.white,
    letterSpacing: 2,
    marginBottom: spacing.lg,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: spacing.xxl,
  },
  fieldLabel: {
    fontSize: fontSize.tiny,
    fontFamily: fontFamily.regular,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    color: colors.white,
  },
  frozenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(36,36,36,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  frozenText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    color: colors.white,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    height: 46,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.white,
  },
  actionLabel: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.medium,
    color: colors.textDark,
  },
});
