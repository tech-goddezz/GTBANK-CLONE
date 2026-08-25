// components/TransactionTicker.tsx
//
// A single-line rotating display showing recent transactions one at a
// time, cycling automatically, with the receiver's real name resolved
// and a formatted date/time.
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../constants/typography';
import { lookupAccountName } from '../services/auth';

interface TransactionTickerProps {
  transactions: any[];
}

export default function TransactionTicker({ transactions }: TransactionTickerProps) {
  const [index, setIndex] = useState(0);
  const [names, setNames] = useState<Record<string, string>>({});
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const resolveNames = async () => {
      const resolved: Record<string, string> = {};
      for (const t of transactions.slice(0, 5)) {
  if (!t.merchantName) continue;
  const result = await lookupAccountName(t.merchantName);
  resolved[t.id] = result.success && result.name ? result.name : t.merchantName;
}
      setNames(resolved);
    };
    if (transactions.length > 0) resolveNames();
  }, [transactions]);

  useEffect(() => {
    if (transactions.length < 2) return;

    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIndex((prev) => (prev + 1) % transactions.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [transactions.length, fadeAnim]);

  if (transactions.length === 0) return null;

  const current = transactions[index];
  const displayName = names[current.id] || current.merchantName;
const formattedDate = new Date(current.date).toLocaleString('en-NG', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.container}>
      <Ionicons name="swap-horizontal-outline" size={16} color={colors.textGrey} />
      <Animated.View style={[styles.textWrap, { opacity: fadeAnim }]}>
        <Text style={styles.text} numberOfLines={1}>
  {current.category} · To {displayName} · ₦{current.amount} · {formattedDate}
</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: radius.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  textWrap: {
    flex: 1,
  },
  text: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
});
