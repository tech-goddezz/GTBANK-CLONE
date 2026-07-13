// components/NumericKeypad.tsx
//
// A reusable on-screen number pad — 1 through 9, then a custom bottom-left
// key (usually blank, but the password-login screen puts a fingerprint icon
// there) and a delete key bottom-right.
//
// Why this exists as its own component: your PIN screen (app/(auth)/pin.tsx)
// already had this exact grid hand-built inline. Rather than copy-pasting
// that block into every new screen that needs a keypad (password login,
// PIN reset, etc.), we pull it out once here. Any screen that needs digit
// entry can now just drop in <NumericKeypad onKeyPress={...} />.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { fontFamily, radius } from '../constants/typography';

interface NumericKeypadProps {
  // Called with '0'-'9', or 'del' for backspace.
  onKeyPress: (key: string) => void;
  // Optional: renders in the bottom-left slot instead of leaving it blank.
  // The password-login screen uses this to show a fingerprint shortcut.
  bottomLeftIcon?: keyof typeof Ionicons.glyphMap;
  onBottomLeftPress?: () => void;
}

const digitRows = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
];

export default function NumericKeypad({
  onKeyPress,
  bottomLeftIcon,
  onBottomLeftPress,
}: NumericKeypadProps) {
  return (
    <View style={styles.keypad}>
      {digitRows.flat().map((digit) => (
        <TouchableOpacity
          key={digit}
          style={styles.key}
          onPress={() => onKeyPress(digit)}
          activeOpacity={0.6}
        >
          <Text style={styles.keyText}>{digit}</Text>
        </TouchableOpacity>
      ))}

      {/* Bottom-left slot: either a custom icon (fingerprint) or empty spacer */}
      <TouchableOpacity
        style={styles.key}
        onPress={onBottomLeftPress}
        disabled={!bottomLeftIcon}
        activeOpacity={bottomLeftIcon ? 0.6 : 1}
      >
        {bottomLeftIcon && (
          <Ionicons name={bottomLeftIcon} size={26} color={colors.orange} />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.key}
        onPress={() => onKeyPress('0')}
        activeOpacity={0.6}
      >
        <Text style={styles.keyText}>0</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.key}
        onPress={() => onKeyPress('del')}
        activeOpacity={0.6}
      >
        <Ionicons name="backspace-outline" size={24} color={colors.textDark} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  key: {
    width: '33.33%',
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.button,
  },
  keyText: {
    fontSize: 28,
    fontFamily: fontFamily.medium,
    color: colors.textDark,
  },
});