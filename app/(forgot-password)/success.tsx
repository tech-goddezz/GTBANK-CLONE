// Password updated confirmation — matches the last screen of "forget password.pdf":
// a big grey tick with rings in the top-left corner, left-aligned text,
// and a full-width Sign In button that goes to the phone-number login screen.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Ellipse, Polyline } from 'react-native-svg';
import colors from '../../constants/colors';
import { fontSize, fontFamily, lineHeight } from '../../constants/typography';
import { layout } from '../../constants/layout';
import Button from '../../components/Button';

export default function ForgotSuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Tick picture. The drawing uses the design's own positions (viewBox starts at y 56). */}
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
          <Polyline
            points="46.4,140.3 63.67,157.51 100.62,120.55"
            stroke={colors.successTick}
            strokeWidth={7}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </View>

      <Text style={styles.title}>Password Updated!</Text>
      <Text style={styles.subtitle}>
        Your password has been successfully reset. You can now sign in using your new password.
      </Text>

      <View style={styles.spacer} />

      <Button label="Sign In" onPress={() => router.replace('/(auth)/phone')} style={styles.button} />
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
    marginTop: layout.successSubtitleGap,
  },
  spacer: { flex: 1 },
  button: {
    paddingHorizontal: 0,
    marginBottom: layout.successButtonBottom,
  },
});
