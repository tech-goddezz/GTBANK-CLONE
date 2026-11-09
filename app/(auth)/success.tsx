// app/(auth)/success.tsx
// "Wait a moment" processing screen (S29 in Kyc flow.pdf) — shown when all
// KYC steps are done. Same corner picture as "Password Updated" (grey disc
// with rings) but with clock hands, a status message, and the GTBank Tier 1
// card. Auto-advances to PIN setup after a short delay (the design has no button).

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Circle, Ellipse, Polygon, Rect } from 'react-native-svg';
import colors from '../../constants/colors';
import { fontSize, fontFamily, lineHeight } from '../../constants/typography';
import { layout, radius } from '../../constants/layout';

export default function SuccessScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/pin');
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Clock picture. The drawing uses the design's own positions (viewBox starts at y 56). */}
      <View style={styles.picture}>
        <Svg
          width={layout.successPicWidth}
          height={layout.successPicHeight}
          viewBox={`0 ${layout.successPicTop} ${layout.successPicWidth} ${layout.successPicHeight}`}
        >
          <Circle cx={74} cy={139} r={131.3} stroke={colors.successRingOuter} strokeWidth={1.5} fill="none" />
          <Circle cx={74.6} cy={139.6} r={111.8} stroke={colors.successRingMiddle} strokeWidth={1.5} fill="none" />
          <Ellipse cx={74.6} cy={140.1} rx={86.2} ry={89} stroke={colors.successRingInner} strokeWidth={1.5} fill="none" />
          <Circle cx={74.6} cy={140.6} r={55.75} fill={colors.successDisc} />
          {/* Clock hands, shapes copied from the design */}
          <Rect x={72.32} y={112.8} width={4.46} height={33.45} fill={colors.successTick} />
          <Polygon
            points="74.55,141.79 92.82,154.58 90.26,158.23 72.0,145.44"
            fill={colors.successTick}
          />
        </Svg>
      </View>

      <Text style={styles.title}>Wait a moment</Text>
      {/* Line breaks copied from the design */}
      <Text style={styles.subtitle}>
        {'Your GTBank account opening request is in progress.\nYou can view the applicable limits of your accounts\nbelow.'}
      </Text>

      <View style={styles.tierCard}>
        <View>
          <Text style={styles.tierLabel}>GTBank Tier 1</Text>
          <View style={styles.showDetailsRow}>
            <Text style={styles.showDetails}>show details</Text>
            <MaterialIcons
              name="expand-more"
              size={layout.waitChevronSize}
              color={colors.textBalance}
              style={styles.chevron}
            />
          </View>
        </View>

        <View style={styles.tierBox}>
          <Image
            source={require('../../assets/images/tier-cube.png')}
            style={styles.cube}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, paddingHorizontal: layout.screenPadding },
  picture: {
    position: 'absolute',
    left: 0,
    top: layout.successPicTop,
    width: layout.successPicWidth,
    height: layout.successPicHeight,
    overflow: 'hidden',
  },
  title: {
    fontSize: fontSize.heading2,
    lineHeight: lineHeight.heading2,
    fontFamily: fontFamily.medium,
    color: colors.black,
    marginTop: layout.successTitleTop,
  },
  subtitle: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: layout.waitSubtitleGap,
  },
  tierCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: layout.waitCardWidth,
    height: layout.waitCardHeight,
    marginLeft: layout.waitCardLeft,
    marginTop: layout.waitCardGap,
    paddingLeft: layout.waitCardPadLeft,
    paddingRight: layout.waitCardPadRight,
    backgroundColor: colors.tierCard,
    borderRadius: radius.card,
  },
  tierLabel: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  showDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showDetails: {
    fontSize: fontSize.small,
    lineHeight: lineHeight.compact,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  chevron: {
    marginLeft: layout.waitChevronGap,
  },
  tierBox: {
    width: layout.waitBoxWidth,
    height: layout.waitBoxHeight,
    justifyContent: 'center',
    backgroundColor: colors.successDisc,
    borderTopLeftRadius: layout.waitBoxRadiusLeft,
    borderBottomLeftRadius: layout.waitBoxRadiusLeft,
    borderTopRightRadius: radius.card,
    borderBottomRightRadius: radius.card,
  },
  cube: {
    width: layout.waitCubeWidth,
    height: layout.waitBoxHeight,
    marginLeft: layout.waitCubeLeft,
  },
});
