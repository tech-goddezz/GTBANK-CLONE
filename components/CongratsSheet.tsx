// components/CongratsSheet.tsx
//
// The "Congrats!" pop-up shown when an account has been opened. The design has
// two copies that differ by one word, so the screen passes in "Tier 1" or "Loan".

import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Svg, { Path } from 'react-native-svg';
import colors from '../constants/colors';
import { fontSize, fontFamily, radius, spacing } from '../constants/typography';
import { layout } from '../constants/layout';
import { congratsArt } from '../constants/congratsArt';
import BottomSheet from './ui/BottomSheet';
import Button from './Button';

const cubes = require('../assets/images/congrats-cubes.png');

interface CongratsSheetProps {
  visible: boolean;
  accountType: 'Tier 1' | 'Loan';
  accountNumber: string;
  onViewDashboard: () => void;
}

export default function CongratsSheet({ visible, accountType, accountNumber, onViewDashboard }: CongratsSheetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <BottomSheet visible={visible} onClose={onViewDashboard} bare topRadius={radius.congrats}>
      <View style={styles.sheet}>
        <Svg style={styles.art} width={layout.screenWidth} height={240} viewBox={`0 0 ${layout.screenWidth} 240`}>
          {congratsArt.map((shape, index) => (
            <Path key={index} d={shape.path} fill={shape.fill} fillRule={shape.fillRule} />
          ))}
        </Svg>

        <Text style={styles.title}>Congrats!</Text>
        <Text style={styles.message}>
          Your GTBank {accountType} account has been successfully opened.
        </Text>

        <View style={styles.accountBox}>
          <View>
            <Text style={styles.accountLabel}>Account number</Text>
            <Text style={styles.accountNumber}>{accountNumber}</Text>
          </View>
          <TouchableOpacity onPress={handleCopy} accessibilityRole="button" accessibilityLabel="Copy account number">
            <Text style={styles.copy}>{copied ? 'Copied' : 'Copy'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.upgradeBox}>
          <Text style={styles.upgradeText}>Get higher limits when you{'\n'}upgrade your account.</Text>
          <Button label="View dashboard" onPress={onViewDashboard} style={styles.dashboardButton} />
          <View style={styles.cubesClip}>
            <Image source={cubes} style={styles.cubes} resizeMode="stretch" />
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    height: layout.congratsHeight,
    overflow: 'hidden',
    borderTopLeftRadius: radius.congrats,
    borderTopRightRadius: radius.congrats,
  },
  art: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  title: {
    position: 'absolute',
    top: 256,
    left: layout.screenPadding,
    fontSize: fontSize.heading1,
    lineHeight: 34,
    fontFamily: fontFamily.medium,
    color: colors.black,
  },
  message: {
    position: 'absolute',
    top: 299,
    left: layout.screenPadding,
    right: layout.screenPadding,
    fontSize: fontSize.body,
    lineHeight: 16,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  accountBox: {
    position: 'absolute',
    top: 335,
    left: layout.screenPadding,
    right: layout.screenPadding,
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: radius.codeBox,
    paddingLeft: 29,
    paddingRight: spacing.xl,
  },
  accountLabel: {
    fontSize: fontSize.small,
    lineHeight: 16,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  accountNumber: {
    fontSize: fontSize.body,
    lineHeight: 18,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  copy: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.medium,
    color: colors.copyLink,
  },
  upgradeBox: {
    position: 'absolute',
    top: 410,
    left: layout.screenPadding,
    right: layout.screenPadding,
    height: 114,
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: radius.codeBox,
  },
  upgradeText: {
    position: 'absolute',
    top: 18,
    left: spacing.lg - 1,
    fontSize: fontSize.small,
    lineHeight: 16,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  dashboardButton: {
    position: 'absolute',
    top: 51,
    left: spacing.lg - 1,
    width: 207,
    paddingHorizontal: 0,
  },
  cubesClip: {
    position: 'absolute',
    top: 7,
    left: 238,
    width: 114,
    height: 98,
    overflow: 'hidden',
    borderTopLeftRadius: radius.congratsCubesLeft,
    borderBottomLeftRadius: radius.congratsCubesLeft,
    borderTopRightRadius: radius.congratsCubesRight,
    borderBottomRightRadius: radius.congratsCubesRight,
  },
  cubes: {
    position: 'absolute',
    top: -18,
    left: 0,
    width: 114,
    height: 134.5,
  },
});
