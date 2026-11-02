// components/PromoCarousel.tsx
//
// A horizontal auto-cycling promo banner. Renders one card at a time
// with a fade+slide animation, cycling every few seconds — avoids
// FlatList + scrollToIndex, which proved unreliable on web (same
// lesson learned from the onboarding carousel).
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import colors from '../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../constants/typography';
import { layout } from '../constants/layout';

// Not in the design; the owner chose to keep it, so it uses the app's own colours.
const PROMOS = [
  { id: '1', title: 'Enable Interest', subtitle: 'Earn on your balance daily', color: colors.orange },
  { id: '2', title: 'Refer & Earn', subtitle: 'Invite friends, get rewards', color: colors.balanceCard },
  { id: '3', title: 'Cashback', subtitle: 'Up to ₦30 cashback on bills', color: colors.orangeDark },
];

export default function PromoCarousel() {
  const [index, setIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(slideAnim, {
        toValue: -30,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setIndex((prev) => (prev + 1) % PROMOS.length);
        slideAnim.setValue(30);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [slideAnim]);

  const current = PROMOS[index];

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.card,
          { backgroundColor: current.color, transform: [{ translateX: slideAnim }] },
        ]}
      >
        <Text style={styles.cardTitle}>{current.title}</Text>
        <Text style={styles.cardSubtitle}>{current.subtitle}</Text>
      </Animated.View>
      <View style={styles.dotsRow}>
        {PROMOS.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: spacing.lg,
  },
  card: {
    height: 90,
    borderRadius: radius.card,
    marginHorizontal: layout.balanceCardSideMargin,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  cardTitle: {
    color: colors.white,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.large,
  },
  cardSubtitle: {
    color: colors.white,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.body,
    marginTop: spacing.xs,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: colors.light,
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.orange,
  },
});
