// app/onboarding.tsx
//
// 5-slide intro carousel. Renders ONE slide at a time based on an index —
// no horizontal scrolling FlatList, since that combination proved unreliable
// across web browsers (Safari/Chrome), even though it worked in Expo Go.
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import colors from '../constants/colors';
import { fontSize, fontFamily, spacing } from '../constants/typography';
import CubeIllustration from '../components/CubeIllustration';

const slides = [
  { id: '1', title: 'GT World\nAll fresh and\nclean' },
  { id: '2', title: 'All inclusive\nfinancial\nplatform' },
  { id: '3', title: 'More\nefficient\nways to pay' },
  { id: '4', title: 'Save for\nretirement with\npensions' },
  { id: '5', title: 'A friendly\nfinancial\nservices app' },
];

export default function Onboarding() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === slides.length - 1;
  const currentSlide = slides[activeIndex];

  const goToAuth = () => router.replace('/(auth)/phone');

  const handleNext = () => {
    if (isLastSlide) {
      goToAuth();
    } else {
      setActiveIndex((prev) => prev + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {!isLastSlide && (
        <TouchableOpacity style={styles.skipButton} onPress={goToAuth} hitSlop={12}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <View style={styles.slide}>
        <CubeIllustration />
        <Text style={styles.title}>{currentSlide.title}</Text>

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
    top: 60,
    right: spacing.xl,
    zIndex: 10,
  },
  skipText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.medium,
    color: colors.orange,
  },
  slide: {
    flex: 1,
    paddingTop: 64,
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: fontSize.heading1,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
    marginTop: spacing.xl,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    marginBottom: spacing.xxxl,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
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
