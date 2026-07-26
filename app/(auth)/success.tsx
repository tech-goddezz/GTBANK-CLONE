// app/(auth)/success.tsx
// "Wait a moment" processing screen — shown right after identity capture.
// Pulsing rings + real clock illustration, a status message, and a
// tier/limits card. Auto-advances to PIN setup after a short delay.

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';

export default function SuccessScreen() {
  const router = useRouter();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    ).start();

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
          <Image
            source={require('../../assets/images/processing-clock.png')}
            style={styles.clockImage}
            resizeMode="contain"
          />
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
    // iconWrap is 120x120 — centering a 90x90 circle inside it means
    // 15px of space on every side ((120-90)/2 = 15). Pinning it with
    // exact top/left like this guarantees it's centered no matter what,
    // instead of relying on the parent's alignItems/justifyContent,
    // which doesn't reliably center absolutely-positioned elements.
    top: 15,
    left: 15,
  },
  ringStatic: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: colors.borderLight,
    // Same idea: (120-110)/2 = 5px on every side.
    top: 5,
    left: 0,
  },

  clockCircle: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: '#D9DCE3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockImage: {
    width: 250,
    height: 250,
    left: 20,
  },
  title: {
    fontSize: fontSize.heading1,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
    marginBottom: spacing.sm,
    marginTop: spacing.large,
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
    backgroundColor: '#F9F4F4',
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
    backgroundColor: '#D9DCE3',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tierGemTop: {
    position: 'absolute',
    width: 22,
    height: 22,
    backgroundColor: '#F0744A',
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
    top: 6,
  },
  tierGemBottom: {
    position: 'absolute',
    width: 22,
    height: 12,
    backgroundColor: '#AB3510',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    top: 20,
  },
});