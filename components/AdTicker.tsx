// components/AdTicker.tsx
//
// Vertical bottom-to-top scrolling promotional message ticker,
// cycling through marketing messages with rotating icons.
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import colors from '../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../constants/typography';

const ADS = [
  { icon: '⚡', text: 'Instant transfers to all Nigerian banks — 24/7.' },
  { icon: '🚀', text: 'Upgrade your account with BVN to unlock ₦2,000,000 limit.' },
  { icon: '💳', text: 'Buy airtime and data directly from your wallet.' },
  { icon: '🎁', text: 'Send money free — you have free transfers today!' },
  { icon: '🛡️', text: 'Your money is protected by GTCO Bank Assurance Engine.' },
];

export default function AdTicker() {
  const [index, setIndex] = useState(0);
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: -16, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        setIndex((prev) => (prev + 1) % ADS.length);
        translateY.setValue(16);
        Animated.parallel([
          Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [translateY, opacity]);

  const current = ADS[index];

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{current.icon}</Text>
      <Animated.View style={[styles.textWrap, { opacity, transform: [{ translateY }] }]}>
        <Text style={styles.text} numberOfLines={1}>{current.text}</Text>
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
    borderLeftWidth: 3,
    borderLeftColor: colors.brandGold,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  icon: {
    fontSize: 18,
  },
  textWrap: {
    flex: 1,
  },
  text: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.semibold,
    color: colors.white,
  },
});
