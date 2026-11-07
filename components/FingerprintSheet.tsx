// components/FingerprintSheet.tsx
//
// The "Authenticating fingerprint" pop-up: a white card with rounded corners,
// a red fingerprint picture, and a grey Cancel button. It only shows the
// pop-up; it doesn't read a real fingerprint. Measured from
// design/Frame 1171276698.pdf (393 x 414).

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { fontSize, fontFamily, radius } from '../constants/typography';
import { layout } from '../constants/layout';
import BottomSheet from './ui/BottomSheet';
import Button from './Button';

const fingerprint = require('../assets/images/fingerprint.png');

interface FingerprintSheetProps {
  visible: boolean;
  onCancel: () => void;
}

export default function FingerprintSheet({ visible, onCancel }: FingerprintSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onCancel} bare topRadius={radius.sheet} bottomRadius={radius.sheet}>
      <View style={styles.card}>
        <View style={styles.textBox}>
          <Text style={styles.text}>Authenticating fingerprint</Text>
        </View>

        <Image source={fingerprint} style={styles.fingerprint} accessibilityIgnoresInvertColors />

        <View style={[styles.textBox, styles.hintBox]}>
          <Text style={styles.text}>Place your finger on the sensor</Text>
        </View>

        <Button
          label="Cancel"
          variant="grey"
          onPress={onCancel}
          style={styles.cancel}
          textStyle={styles.cancelText}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingTop: 72,
    paddingBottom: 72,
  },
  textBox: {
    height: layout.fingerprintTextBox,
    justifyContent: 'center',
  },
  hintBox: { marginTop: 14 },
  text: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.medium,
    color: colors.black,
    textAlign: 'center',
  },
  fingerprint: {
    width: layout.fingerprintSize,
    height: layout.fingerprintSize,
    marginTop: 24,
  },
  cancel: {
    width: layout.fingerprintCancelWidth,
    marginTop: 14,
  },
  cancelText: {
    fontFamily: fontFamily.regular,
  },
});
