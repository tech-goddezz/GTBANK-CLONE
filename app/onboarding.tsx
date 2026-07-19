// app/onboarding.tsx
//
// 5-slide intro carousel. The splash frame from Figma lives at app/index.tsx
// (logo, 900ms, redirect) — this screen starts straight at slide 1.

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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import colors from '../constants/colors';
import { fontSize, fontFamily, spacing } from '../constants/typography';
import CubeIllustration from '../components/CubeIllustration';

const { width } = Dimensions.get('window');

const slides = [
  { id: '1', title: 'GT World\nAll fresh and\nclean' },
  { id: '2', title: 'All inclusive\nfinancial\nplatform' },
  { id: '3', title: 'More\nefficient\nways to pay' },
  { id: '4', title: 'Save for\nretirement with\npensions' },
  { id: '5', title: 'A friendly\nfinancial\nservices app' },
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

  const goToAuth = () => router.replace('/(auth)/phone');

  const handleNext = () => {
    if (isLastSlide) {
      goToAuth();
    } else {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {!isLastSlide && (
        <TouchableOpacity style={styles.skipButton} onPress={goToAuth} hitSlop={12}>
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
            <CubeIllustration />
            <Text style={styles.title}>{item.title}</Text>

            <View style={styles.controlsRow}>
              <View style={styles.dotsRow}>
                {slides.map((_, i) => (
                  <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
                ))}
              </View>

              <TouchableOpacity
                style={isLastSlide ? styles.letsStartButton : styles.nextButton}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <Text style={isLastSlide ? styles.letsStartButtonLabel : styles.nextButtonLabel}>
                  {isLastSlide ? "Let's start" : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  skipButton: {
    position: 'absolute',
    top: spacing.xxl + 30,
    right: spacing.xl,
    zIndex: 10,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  skipText: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.regular,
    color: colors.orange,
  },
  slide: {
    width,
    paddingTop: 64,
  },
  title: {
    fontSize: fontSize.heading1,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
    lineHeight: 34,
    marginTop: spacing.xxxl + 50,
    paddingHorizontal: spacing.xl,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xxxl,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.borderLight,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.orange,
  },
  nextButton: {
    height: 44,
    paddingHorizontal: spacing.xxl + 20,
    borderRadius: 3,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonLabel: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    color: colors.textDark,
  },
  letsStartButton: {
    height: 44,
    paddingHorizontal: spacing.xxl,
    borderRadius: 3,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letsStartButtonLabel: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    color: colors.white,
  },
});