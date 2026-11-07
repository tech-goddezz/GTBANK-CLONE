// components/UserAvatar.tsx
//
// The white circle with a small person icon at the top of the
// "Enter password" and "Log in with fingerprint" screens.
// The icon is traced exactly from the design (16 x 16).

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import colors from '../constants/colors';
import { layout } from '../constants/layout';

const PERSON_ICON =
  'M7.99 8.46C8.47 8.46 8.94 8.37 9.37 8.18C9.81 8 10.21 7.74 10.54 7.4C10.87 7.07 11.14 6.67 11.32 6.24C11.5 5.8 11.59 5.33 11.59 4.86C11.59 4.39 11.5 3.92 11.32 3.48C11.14 3.04 10.87 2.65 10.54 2.31C10.21 1.98 9.81 1.71 9.37 1.53C8.94 1.35 8.47 1.26 7.99 1.26C7.04 1.26 6.12 1.64 5.45 2.31C4.77 2.99 4.39 3.9 4.39 4.86C4.39 5.81 4.77 6.73 5.45 7.4C6.12 8.08 7.04 8.46 7.99 8.46ZM8 0C9.05 0 10.08 0.35 10.92 0.99C11.75 1.63 12.36 2.52 12.63 3.54C12.91 4.56 12.84 5.64 12.45 6.61C12.05 7.59 11.34 8.41 10.43 8.94C13.38 9.83 15.6 12.31 16 15.4C16.03 15.7 15.82 15.96 15.51 16C15.2 16.03 14.92 15.83 14.88 15.53C14.45 12.18 11.55 9.66 8.03 9.66C4.49 9.66 1.55 12.18 1.12 15.53C1.08 15.83 0.8 16.03 0.49 16C0.19 15.96 -0.03 15.7 0 15.4C0.4 12.33 2.63 9.84 5.58 8.95C4.67 8.42 3.96 7.6 3.56 6.62C3.16 5.65 3.09 4.57 3.37 3.55C3.64 2.53 4.24 1.63 5.08 0.99C5.92 0.35 6.95 0 8 0Z';

export default function UserAvatar({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.circle, style]}>
      <Svg width={layout.avatarIconSize} height={layout.avatarIconSize} viewBox="0 0 16 16">
        <Path d={PERSON_ICON} fill={colors.textBalance} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: layout.avatarSize,
    height: layout.avatarSize,
    borderRadius: layout.avatarSize / 2,
    borderWidth: layout.avatarBorder,
    borderColor: colors.black,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
