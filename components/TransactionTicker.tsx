// components/TransactionTicker.tsx
//
// A bold, eye-catching single-line rotating display showing recent
// transactions, cycling with a slide+fade animation.
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
  const slideAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);
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
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -12, duration: 250, useNativeDriver: true }),
      ]).start(() => {
        setIndex((prev) => (prev + 1) % transactions.length);
        slideAnim.setValue(12);
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
        ]).start();
      });
    }, 3200);
    return () => clearInterval(interval);
  }, [transactions.length, fadeAnim, slideAnim]);

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
            <Animated.View style={[styles.iconCircle, { transform: [{ scale: pulseAnim }] }]}>
                <Ionicons name="swap-horizontal" size={16} color={colors.white} />
      </Animated.View>
      <Animated.View style={[styles.textWrap, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
        <Text style={styles.text} numberOfLines={1}>
          {current.category} · To <Text style={styles.bold}>{displayName}</Text> · <Text style={styles.amount}>₦{current.amount}</Text> · {formattedDate}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.navyCard,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: colors.orange,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  text: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.medium,
    color: colors.base,
  },
  bold: {
    color: colors.white,
    fontFamily: fontFamily.semibold,
  },
  amount: {
    color: colors.orange,
    fontFamily: fontFamily.semibold,
  },
});
