// app/(auth)/success.tsx
// "Wait a moment" processing screen — shown right after identity capture
// while the (simulated) account-opening request is submitted. This is
// what the Figma frame actually shows at this point in the flow: a
// pulsing clock icon, a status message, and a tier/limits card — not a
// "Congrats, here's your account number" screen. It auto-advances to PIN
// setup after a short delay, same as a real loading screen would.

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';

export default function SuccessScreen() {
  const router = useRouter();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Gentle looping pulse on the outer rings, echoing the design's
    // concentric-circle "processing" motif.
    Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    ).start();

    // Next step is setting up a transaction PIN before landing on the
    // dashboard — a real bank wouldn't drop you into the app with no PIN set.
    const timer = setTimeout(() => {
      router.replace('/(auth)/pin');
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Animated.View
          style={[styles.ring, { transform: [{ scale: ringScale }], opacity: ringOpacity }]}
        />
        <View style={styles.ringStatic} />
        <View style={styles.clockCircle}>
          <Ionicons name="time-outline" size={36} color={colors.textGrey} />
        </View>
      </View>

      <Text style={styles.title}>Wait a moment</Text>
      <Text style={styles.subtitle}>
        Your GTBank account opening request is in progress. You can view the applicable limits of
        your accounts below.
      </Text>

      <View style={styles.tierCard}>
        <View>
          <Text style={styles.tierLabel}>GTBank Tier 1</Text>
          <View style={styles.showDetailsRow}>
            <Text style={styles.showDetails}>show details</Text>
            <Ionicons name="chevron-down" size={14} color={colors.textGrey} />
          </View>
        </View>

        {/* Small tier icon — a simplified stand-in for the design's 3D
            orange gem graphic, since there's no exported asset for it yet. */}
        <View style={styles.tierIconBox}>
          <View style={styles.tierGemTop} />
          <View style={styles.tierGemBottom} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xl,
    paddingTop: 100,
  },
  iconWrap: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxxl,
  },
  ring: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  ringStatic: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  clockCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.pageBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    lineHeight: 22,
    marginBottom: spacing.xxl,
  },
  tierCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.pageBackground,
    borderRadius: radius.card,
    padding: spacing.lg,
  },
  tierLabel: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.semibold,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  showDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  showDetails: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  tierIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.button,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tierGemTop: {
    position: 'absolute',
    width: 22,
    height: 22,
    backgroundColor: colors.orange,
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
    top: 6,
  },
  tierGemBottom: {
    position: 'absolute',
    width: 22,
    height: 12,
    backgroundColor: colors.orangePressed,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    top: 20,
  },
});