// components/WelcomeSheet.tsx
//
// The pop-up shown when a phone number isn't linked to an account yet.
// Cancel lets the person fix their number; Open Account continues to sign up.
// The wording is copied exactly from "Frame 16.pdf".

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { fontSize, fontFamily, radius } from '../constants/typography';
import { layout } from '../constants/layout';
import BottomSheet from './ui/BottomSheet';
import Button from './Button';

const rocket = require('../assets/images/welcome-rocket.png');

interface WelcomeSheetProps {
  visible: boolean;
  onCancel: () => void;
  onOpenAccount: () => void;
}

export default function WelcomeSheet({ visible, onCancel, onOpenAccount }: WelcomeSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onCancel} bare topRadius={radius.sheet}>
      <View style={styles.sheet}>
        <Image source={rocket} style={styles.rocket} resizeMode="contain" />
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.message}>
          It looks like your phone number is not linked to an existing account with us. Lets get started by opening your new account .
        </Text>
        <View style={styles.buttons}>
          <Button label="Cancel" variant="outline" onPress={onCancel} style={styles.cancel} />
          <Button label="Open Account" onPress={onOpenAccount} style={styles.openAccount} />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    height: 509,
    paddingHorizontal: layout.screenPadding,
    paddingTop: 34,
  },
  rocket: {
    position: 'absolute',
    alignSelf: 'center',
    top: 133.5,
    width: 321,
    height: 321,
  },
  title: {
    fontSize: fontSize.heading2,
    lineHeight: 30,
    fontFamily: fontFamily.medium,
    color: colors.black,
    marginBottom: 14,
  },
  message: {
    fontSize: fontSize.body,
    lineHeight: 16,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  buttons: {
    position: 'absolute',
    top: 431,
    left: layout.screenPadding,
    right: layout.screenPadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancel: {
    width: 119,
    paddingHorizontal: 0,
  },
  openAccount: {
    width: 174,
    paddingHorizontal: 0,
  },
});
