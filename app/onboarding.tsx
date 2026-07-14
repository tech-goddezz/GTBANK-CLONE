// app/onboarding.tsx
//
// The 5-slide intro carousel — wording, layout, and order copied exactly
// from "On boarding flow.pdf" in the design file. Same cube graphic on
// every slide, only the heading changes. Last slide has no "Skip" and its
// button says "Let's start" instead of "Next".

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
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../constants/typography';
import CubeIllustration from '../components/CubeIllustration';

const { width } = Dimensions.get('window');

// 📚 Quick concept: why titles are an array of strings, not objects
// Every slide shares the exact same layout — only these words change. Storing
// them as a flat array (instead of one JSX block copy-pasted 5 times) means if
// the copy changes again, you edit one line here instead of hunting through
// five near-identical components.
const slides = [
  { id: '1', title: 'GT World\nAll fresh and clean' },
  { id: '2', title: 'All inclusive\nfinancial platform' },
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
          </View>
        )}
      />

      {/* Design has two distinct bottom layouts, not one shared pattern:
          - Slides 1-4: dots on the left, a circular orange button with a
            white arrow icon on the right (no "Next" text anywhere).
          - Slide 5 (last): no dots, no skip - just a full-width orange
            "Let's start" button. */}
      {isLastSlide ? (
        <View style={styles.bottomRowFinal}>
          <TouchableOpacity
            style={styles.buttonFull}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonFullLabel}>Let's start</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.bottomRow}>
          <View style={styles.dotsRow}>
            {slides.map((_, i) => (
              <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
            ))}
          </View>

          <TouchableOpacity
            style={styles.buttonCircle}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-forward" size={22} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
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
    top: spacing.xl,
    right: spacing.xl,
    zIndex: 10,
  },
  skipText: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.regular,
    color: colors.orange,
  },
  slide: {
    width,
    paddingTop: 64,
    paddingHorizontal: spacing.xl,
  },
  // Heading is left-aligned in the design, not centered.
  title: {
    fontSize: fontSize.heading1,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
    lineHeight: 34,
    marginTop: spacing.xl,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
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
  // Circular "Next" button, slides 1-4 — solid orange, white arrow icon.
  buttonCircle: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Full-width "Let's start" button, slide 5 only — no dots alongside it.
  bottomRowFinal: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  buttonFull: {
    height: 54,
    borderRadius: radius.button,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonFullLabel: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.semibold,
    color: colors.white,
  },
});