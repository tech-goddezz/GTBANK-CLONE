// components/DebitCard.tsx
// The orange debit card shown on Card Management. Pulls directly from
// useAccountStore, same pattern as BalanceCard — no props needed, it's
// self-contained and reads/writes the global card state.

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import Svg, { Path } from 'react-native-svg';
import colors from '../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../constants/typography';
import { layout } from '../constants/layout';
import { cardArt } from '../constants/cardArt';

interface DebitCardProps {
  card: any;
  balance: number;
}

// Splits a raw digit string into groups of 4 for readable display —
// "2342456487654782" becomes ["2342", "4564", "8765", "4782"].
const cardNumberGroups = (raw: string): string[] => {
  const digitsOnly = raw.replace(/\s/g, '');
  return digitsOnly.match(/.{1,4}/g) ?? [raw];
};

// When hidden, we only ever show the last 4 digits — never the full
// number by default. This matches how every real banking app behaves;
// showing the full number by default would be a real security smell.
const maskedNumberGroups = (raw: string): string[] => {
  const digitsOnly = raw.replace(/\s/g, '');
  return ['****', '****', '****', digitsOnly.slice(-4)];
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

  const numberGroups = detailsVisible
    ? cardNumberGroups(card.masked_number)
    : maskedNumberGroups(card.masked_number);

  return (
    <View>
      <View style={styles.card}>
        {/* The wavy background and the VISA / Mastercard logos, copied from the design */}
        <Svg
          style={StyleSheet.absoluteFill}
          width={layout.debitCardWidth}
          height={layout.debitCardHeight}
          viewBox={`0 0 ${layout.debitCardWidth} ${layout.debitCardHeight}`}
        >
          {cardArt.map((shape, index) => (
            <Path key={index} d={shape.path} fill={shape.fill} fillRule="evenodd" />
          ))}
        </Svg>

        {/* Balance is only shown once details are revealed — matches
            the Figma's masked (₦ *****) vs revealed (₦ 147,000.00) states */}
        <View style={styles.balanceRow}>
          <Text style={styles.currencySymbol}>₦</Text>
          <Text style={styles.balance}>
            {detailsVisible
              ? balance.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : '*****'}
          </Text>
        </View>

        <View style={styles.numberRow}>
          {numberGroups.map((group, index) => (
            <Text key={index} style={styles.numberGroup}>{group}</Text>
          ))}
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Valid Till</Text>
            <Text style={styles.fieldValue}>{detailsVisible ? card.expiry_date : '****'}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>CVV</Text>
            <Text style={styles.fieldValue}>{detailsVisible ? card.cvv : '****'}</Text>
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
          style={styles.action}
          onPress={() => setDetailsVisible((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={detailsVisible ? 'Hide card details' : 'Show card details'}
        >
          <View style={styles.actionCircle}>
            <Ionicons
              name={detailsVisible ? 'eye-off-outline' : 'eye-outline'}
              size={16}
              color={colors.textDark}
            />
          </View>
          <Text style={styles.actionLabel}>
            {detailsVisible ? 'Hide' : 'Details'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.action}
          onPress={handleCopy}
          accessibilityRole="button"
          accessibilityLabel="Copy card number"
        >
          <View style={styles.actionCircle}>
            <Ionicons
              name={copied ? 'checkmark' : 'copy-outline'}
              size={16}
              color={colors.textDark}
            />
          </View>
          <Text style={styles.actionLabel}>{copied ? 'Copied' : 'Copy'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: layout.debitCardWidth,
    height: layout.debitCardHeight,
    alignSelf: 'center',
    backgroundColor: colors.debitCard,
    borderRadius: radius.debitCard,
    overflow: 'hidden',
  },
  balanceRow: {
    position: 'absolute',
    top: 21,
    left: spacing.xl,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currencySymbol: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.semibold,
    color: colors.balanceSymbol,
    marginRight: 10,
  },
  balance: {
    fontSize: fontSize.heading2,
    lineHeight: 30,
    fontFamily: fontFamily.semibold,
    color: colors.white,
  },
  numberRow: {
    position: 'absolute',
    top: 71,
    left: spacing.xl,
    flexDirection: 'row',
  },
  numberGroup: {
    width: 58,
    fontSize: fontSize.heading3,
    lineHeight: 22,
    fontFamily: fontFamily.regular,
    color: colors.white,
  },
  bottomRow: {
    position: 'absolute',
    top: 122,
    left: spacing.xl,
    flexDirection: 'row',
  },
  field: {
    width: 68,
  },
  fieldLabel: {
    fontSize: fontSize.small,
    lineHeight: 16,
    fontFamily: fontFamily.regular,
    color: colors.white,
  },
  fieldValue: {
    fontSize: fontSize.body,
    lineHeight: 18,
    fontFamily: fontFamily.regular,
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
    justifyContent: 'center',
    gap: spacing.xxl,
    marginTop: 13,
  },
  action: {
    alignItems: 'center',
    gap: 9,
  },
  actionCircle: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  actionLabel: {
    fontSize: fontSize.body,
    lineHeight: 18,
    fontFamily: fontFamily.regular,
    color: colors.textNavy,
  },
});
