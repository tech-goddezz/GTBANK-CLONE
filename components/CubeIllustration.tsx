// components/CubeIllustration.tsx
//
// The floating-cubes graphic used on every onboarding slide. It's the exact
// same image in the design on all 5 slides — only the text under it changes.
//
// 📚 Quick concept: why this is code instead of an <Image>
// There's no exported PNG for this graphic yet, so this component fakes the
// "3D cube" look using plain Views: a rotated square split into a lighter
// "top" face and a darker "front" face, plus a small white accent square —
// same trick used on the GTCO app icon. It's a close visual stand-in, not a
// pixel-perfect copy.
//
// 🔧 To upgrade to the real design asset later:
// Export the cube graphic once from Figma (it's identical across all 5
// slides) as "onboarding-cubes.png", drop it in assets/images/, then replace
// the contents of this component with a single:
//   <Image source={require('../assets/images/onboarding-cubes.png')} style={{ width: '100%', height: 260 }} resizeMode="contain" />

import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../constants/colors';

function Cube({ size, style }: { size: number; style?: any }) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      {/* top-left face — lighter orange */}
      <View
        style={[
          styles.face,
          {
            width: size,
            height: size,
            backgroundColor: colors.orange,
            borderRadius: size * 0.18,
            transform: [{ rotate: '45deg' }],
          },
        ]}
      />
      {/* front-bottom face — darker orange, offset down to fake shading */}
      <View
        style={[
          styles.face,
          {
            width: size,
            height: size * 0.55,
            top: size * 0.45,
            backgroundColor: colors.orangePressed,
            borderBottomLeftRadius: size * 0.18,
            borderBottomRightRadius: size * 0.18,
            transform: [{ rotate: '45deg' }],
            opacity: 0.9,
          },
        ]}
      />
      {/* small white accent square, top-right of the cube (matches app icon detail) */}
      <View
        style={[
          styles.accent,
          {
            width: size * 0.16,
            height: size * 0.16,
            top: size * 0.22,
            right: size * 0.16,
            borderRadius: size * 0.03,
          },
        ]}
      />
    </View>
  );
}

export default function CubeIllustration() {
  return (
    <View style={styles.container} pointerEvents="none">
      {/* small tilted cube, upper-left */}
      <Cube size={70} style={{ position: 'absolute', top: 10, left: 0, transform: [{ rotate: '-10deg' }] }} />

      {/* the big hero cube, center-right */}
      <Cube size={190} style={{ position: 'absolute', top: 0, left: '38%' }} />

      {/* small cube lower-left */}
      <Cube size={55} style={{ position: 'absolute', top: 190, left: '18%' }} />

      {/* faint blurred cube bleeding off the right edge, for depth */}
      <Cube
        size={140}
        style={{ position: 'absolute', top: 200, right: -60, opacity: 0.35, transform: [{ rotate: '8deg' }] }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 260,
    marginBottom: 8,
  },
  face: {
    position: 'absolute',
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute',
    backgroundColor: colors.white,
  },
});