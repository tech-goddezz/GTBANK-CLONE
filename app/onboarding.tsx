// app/onboarding.tsx
// 5-slide swipeable intro carousel. Skip button jumps straight to auth.
// Last slide shows "Let's start" instead of "Next".

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import colors from '../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../constants/typography';
import Button from '../components/Button';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Welcome to GTBank',
    subtitle: 'Your trusted partner for all your banking needs, right in your pocket.',
  },
  {
    id: '2',
    title: 'Send Money Instantly',
    subtitle: 'Transfer funds to any bank in Nigeria within seconds, anytime.',
  },
  {
    id: '3',
    title: 'Track Every Transaction',
    subtitle: 'See exactly where your money goes with detailed transaction history.',
  },
  {
    id: '4',
    title: 'Manage Your Cards',
    subtitle: 'Freeze, unfreeze, and set limits on your debit card from the app.',
  },
  {
    id: '5',
    title: 'Open an Account Today',
    subtitle: 'Create a full GTBank account in minutes with just your phone number.',
  },
];

export default function Onboarding() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === slides.length - 1;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const handleNext = () => {
    if (isLastSlide) {
      router.replace('/(auth)/phone');
    } else {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    }
  };

  const handleSkip = () => {
    router.replace('/(auth)/phone');
  };

  return (
    <View style={styles.container}>
      {!isLastSlide && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.illustrationPlaceholder}>
              <Text style={styles.illustrationEmoji}>🟠</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.buttonArea}>
        <Button
          label={isLastSlide ? "Let's start" : 'Next'}
          onPress={handleNext}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  skipButton: {
    position: 'absolute',
    top: 56,
    right: spacing.xl,
    zIndex: 10,
  },
  skipText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.medium,
    color: colors.textGrey,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  illustrationPlaceholder: {
    width: 220,
    height: 220,
    borderRadius: radius.card,
    backgroundColor: colors.orangeFaint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxxl,
  },
  illustrationEmoji: {
    fontSize: 80,
  },
  title: {
    fontSize: fontSize.heading2,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    textAlign: 'center',
    lineHeight: 22,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.borderLight,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.orange,
  },
  buttonArea: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
  },
});