// app/index.tsx
//
// Entry point / splash screen — matches the design's first onboarding-flow
// frame exactly: just the GTCO logo centered on white, nothing else (no
// spinner, no text). Checks login state in the background and redirects
// once the short splash delay is up.

import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import colors from '../constants/colors';

export default function Index() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1);
    }, 400);
    return () => clearInterval(dotInterval);
  }, []);

  useEffect(() => {
    // 📚 Quick concept: why a timer at all?
    // Without it, the redirect can fire before the router is ready, and the
    // logo would flash for one frame then vanish — this guarantees the
    // splash is visible for a beat, like the design intends.
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/onboarding');
      }
        }, 2200);
    return () => clearTimeout(timer);
  }, [isLoggedIn]);
  return (
    <View style={styles.container}>
      <Image source={require('../assets/icon.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.dots}>{'.'.repeat(dotCount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: colors.darkNavy,
    justifyContent: 'center',
    alignItems: 'center',
  },
    logo: {
    width: 120,
    height: 120,
    borderRadius: 28,
  },
  dots: {
    color: colors.orange,
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
    letterSpacing: 4,
  },
})
