// app/(tabs)/more.tsx
//
// More page (S46 in "Screens inside the home screen.pdf"), opened from Home → More.
// Nine services in white rows, built the same way as the Pay page rows. The
// tapped row turns orange; none of these services have screens yet, so tapping
// does nothing else for now.

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '../../constants/colors';
import { fontSize, fontFamily } from '../../constants/typography';
import { layout } from '../../constants/layout';
import ScreenHeader from '../../components/ScreenHeader';

const SERVICES = [
  'Domestic Fund Transfer',
  'International Wire Transfer',
  'Foreign Currency Exchange',
  'SWIFT Payment Processing',
  'Automated Teller Machine (ATM) Withdrawal',
  'Mobile Check Deposit',
  'Bank Statement Request',
  'Loan Repayment',
  'Standing Order Setup',
];

export default function MoreScreen() {
  const router = useRouter();
  const [picked, setPicked] = useState('');

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="More"
        subtitle="Explore new financial horizons."
        onBellPress={() => router.push('/(tabs)/notifications')}
      />

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {SERVICES.map((service) => {
          const active = picked === service;
          return (
            <TouchableOpacity
              key={service}
              style={styles.row}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setPicked(service)}
            >
              {/* Long names (the ATM one) wrap onto two lines inside the row, as in the design */}
              <Text style={[styles.label, active && styles.labelActive]} numberOfLines={2}>
                {service}
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
    paddingTop: layout.payListTop,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.tabBarHeight,
    gap: layout.payRowGap,
  },
  row: {
    height: layout.payRowHeight,
    justifyContent: 'center',
    paddingLeft: layout.payLabelLeft,
    paddingRight: layout.screenPadding,
    backgroundColor: colors.white,
    // Same very soft shadow as the Send and Pay rows
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: fontSize.large,
    lineHeight: layout.moreLabelLineHeight,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  labelActive: { color: colors.orange },
});
