// components/InfoBanner.tsx
//
// The pale blue strip with a thin blue outline. Two versions:
//   - default: info icon and left-aligned text ("Recipient will be credited shortly.")
//   - centered: taller, no icon, centred text (the narration on Confirmed Transfer)

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import colors from '../constants/colors';
import { fontSize, fontFamily } from '../constants/typography';
import { layout } from '../constants/layout';
import { infoIcon } from '../constants/infoIcon';

interface InfoBannerProps {
  message: string;
  centered?: boolean;
  style?: ViewStyle;
}

export default function InfoBanner({ message, centered = false, style }: InfoBannerProps) {
  return (
    <View style={[styles.banner, centered && styles.bannerCentered, style]}>
      {!centered && (
        <View style={styles.icon}>
          <Svg width={infoIcon.width} height={infoIcon.height} viewBox={`0 0 ${infoIcon.width} ${infoIcon.height}`}>
            <Path d={infoIcon.path} fill={colors.infoBlue} fillRule={infoIcon.fillRule} />
          </Svg>
        </View>
      )}
      <Text style={styles.message} numberOfLines={1}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    height: layout.infoBannerHeight,
    marginHorizontal: layout.screenPadding,
    backgroundColor: colors.infoBlueFaint,
    borderWidth: 1,
    borderColor: colors.infoBlue,
    paddingLeft: 18, // With the border, the icon sits 19 from the left edge
  },
  bannerCentered: {
    height: layout.infoBannerHeightTall,
    justifyContent: 'center',
    paddingLeft: 0,
  },
  icon: {
    marginRight: 12.7, // Text starts 42 from the left edge
  },
  message: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.regular,
    color: colors.textLightDark,
  },
});
