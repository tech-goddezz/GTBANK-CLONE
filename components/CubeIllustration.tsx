// components/CubeIllustration.tsx
//
// The floating-cubes graphic used on every onboarding slide. Same asset on
// all 5 slides — only the heading underneath changes.
//
// The source PNG is a tall crop, taller than the illustration area we want
// on screen. resizeMode="cover" fills the full width with zero side gaps
// and just crops the excess off the top/bottom — that's what we want here,
// not "contain" (which shrinks the whole image down to avoid cropping,
// and that's what was causing the side gaps before).

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const illustration = require('../assets/images/onboarding-illustration.png');

export default function CubeIllustration() {
  return (
    <View style={styles.container} pointerEvents="none">
      <Image source={illustration} style={styles.image} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 260,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});