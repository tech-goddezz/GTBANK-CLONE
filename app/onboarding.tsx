// app/onboarding.tsx
//
// 5-slide intro carousel. Renders ONE slide at a time based on an index —
// no horizontal scrolling FlatList, since that combination proved unreliable
// across web browsers (Safari/Chrome), even though it worked in Expo Go.
//
// Layout measured from design/On boarding  flow.pdf (393 x 852 frame):
// cubes picture edge to edge, title under it, then dots + "Next" button.
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import colors from '../constants/colors';
import { fontSize, fontFamily, lineHeight, spacing } from '../constants/typography';
import { layout } from '../constants/layout';
import CubeIllustration from '../components/CubeIllustration';
import Button from '../components/Button';

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
    <View style={styles.container}>
      {!isLastSlide && (
        <TouchableOpacity style={styles.skipButton} onPress={goToAuth} hitSlop={12}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <View style={styles.art}>
        <CubeIllustration />
      </View>

      <Text style={styles.title}>{currentSlide.title}</Text>

      <View style={styles.controlsRow}>
        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
          ))}
        </View>

        {isLastSlide ? (
          <TouchableOpacity style={styles.letsStartButton} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.letsStartButtonLabel}>Let's start</Text>
          </TouchableOpacity>
        ) : (
          <Button
            label="Next"
            variant="grey"
            onPress={handleNext}
            style={styles.nextButton}
          />
        )}
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
    top: layout.skipTop,
    right: layout.skipRight,
    zIndex: 10,
  },
  skipText: {
    fontSize: fontSize.skip,
    lineHeight: lineHeight.skip,
    fontFamily: fontFamily.regular,
    color: colors.orange,
  },
  art: {
    marginTop: layout.onboardingArtTop,
  },
  title: {
    fontSize: fontSize.display,
    lineHeight: lineHeight.display,
    fontFamily: fontFamily.semibold,
    color: colors.textDark,
    marginTop: layout.onboardingTitleGap,
    paddingHorizontal: layout.screenPadding,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: layout.onboardingControlsGap,
    paddingHorizontal: layout.screenPadding,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: layout.onboardingDotGap,
    marginTop: layout.onboardingControlsGap,
  },
  dot: {
    height: layout.onboardingDotHeight,
    width: layout.onboardingDotWidth,
    borderRadius: layout.onboardingDotHeight / 2,
    backgroundColor: colors.dotInactive,
  },
  dotActive: {
    width: layout.onboardingDotActiveWidth,
    backgroundColor: colors.dotActive,
  },
  nextButton: {
    width: layout.onboardingNextWidth,
    paddingHorizontal: 0,
  },
  // "Let's start" on the last slide is restyled at screen S6.
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
