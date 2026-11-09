// app/(tabs)/transfer-flow/send.tsx
//
// Send page (S38–S42 in "Screens inside the home screen.pdf"), opened from
// Home → Send. Five choices: GTBank, Different Bank, Saved Beneficiaries,
// Fund GT Money Market and e-wallet. The picked row turns orange.
//
// Every row opens its version of the send form (S47–S51).

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import { fontSize, fontFamily } from '../../../constants/typography';
import { layout } from '../../../constants/layout';
import ScreenHeader from '../../../components/ScreenHeader';

const OPTIONS = [
  { id: 'gtbank', label: 'GTBank', route: '/(tabs)/transfer-flow/details?bank=gtbank' },
  { id: 'other', label: 'Different Bank', route: '/(tabs)/transfer-flow/details?bank=other' },
  { id: 'saved', label: 'Saved Beneficiaries', route: '/(tabs)/transfer-flow/details?bank=saved' },
  { id: 'money-market', label: 'Fund GT Money Market', route: '/(tabs)/transfer-flow/details?bank=money-market' },
  { id: 'e-wallet', label: 'e-wallet', route: '/(tabs)/transfer-flow/details?bank=e-wallet' },
] as const;

export default function SendScreen() {
  const router = useRouter();
  // GTBank is picked when the page opens, as in the design (S38).
  const [picked, setPicked] = useState<string>('gtbank');

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Send"
        subtitle="Make seamless and secure transfers."
        onBellPress={() => router.push('/(tabs)/notifications')}
      />

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {OPTIONS.map((option) => {
          const active = picked === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={styles.row}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => {
                setPicked(option.id);
                if (option.route) router.push(option.route as any);
              }}
            >
              <View style={[styles.circle, { backgroundColor: active ? colors.orange : colors.sendCircle }]}>
                <MaterialIcons name="account-balance" size={layout.sendIcon} color={colors.white} />
              </View>
              <Text style={[styles.label, { color: active ? colors.orange : colors.black }]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  list: {
    paddingTop: layout.sendListTop,
    paddingHorizontal: layout.sendRowSide,
    paddingBottom: layout.tabBarHeight,
    gap: layout.sendRowGap,
  },
  row: {
    height: layout.sendRowHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: layout.sendCircleLeft,
    backgroundColor: colors.sendRow,
    // Very soft shadow just below each row, as in the design
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  circle: {
    width: layout.sendCircle,
    height: layout.sendCircle,
    borderRadius: layout.sendCircle / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginLeft: layout.sendLabelGap,
    fontSize: fontSize.large,
    fontFamily: fontFamily.regular,
  },
});
