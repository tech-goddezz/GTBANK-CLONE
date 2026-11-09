// app/(tabs)/pay.tsx
//
// Pay page (S43 in "Screens inside the home screen.pdf"), opened from Home → Pay.
// A list of nine bills; the tapped bill turns orange.
//
// The design has no screen for what comes after picking a bill, so (owner's
// choice) an amount box and a Pay button appear under the list once a bill is
// picked. Paying still uses the same payBill code as before.

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '../../constants/colors';
import { fontSize, fontFamily } from '../../constants/typography';
import { layout } from '../../constants/layout';
import ScreenHeader from '../../components/ScreenHeader';
import Button from '../../components/Button';
import { payBill, getCurrentUserId } from '../../services/auth';

const BILLS = [
  'School Fees Payment',
  'Generating Teller for Bank Transactions',
  'Water Bill Payment',
  'Gas Bill Payment',
  'Internet Subscription Renewal',
  'Electricity Bill Payment',
  'Cable TV Subscription Payment',
  'Property Tax Payment',
  'Health Insurance Premium Payment',
];

export default function PayScreen() {
  const router = useRouter();
  const [selectedBill, setSelectedBill] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async () => {
    if (!selectedBill) {
      setError('Please select a bill type');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }
    setError('');
    setLoading(true);
    const id = await getCurrentUserId();
    const result = await payBill(id, selectedBill, parseFloat(amount));
    setLoading(false);
    if (result.success) {
      router.replace('/(tabs)/home');
    } else {
      setError(result.message);
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Pay"
        subtitle="Pay your bills with ease."
        onBellPress={() => router.push('/(tabs)/notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.list}>
          {BILLS.map((bill) => {
            const active = selectedBill === bill;
            return (
              <TouchableOpacity
                key={bill}
                style={styles.row}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => {
                  setSelectedBill(bill);
                  setError('');
                }}
              >
                <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>
                  {bill}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {!!selectedBill && (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Enter the Amount"
              placeholderTextColor={colors.textGrey}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
            {!!error && <Text style={styles.error}>{error}</Text>}
            <Button label="Pay" onPress={handlePay} loading={loading} style={styles.payButton} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: {
    paddingTop: layout.payListTop,
    paddingHorizontal: layout.sendRowSide,
    paddingBottom: layout.tabBarHeight,
  },
  list: { gap: layout.payRowGap },
  row: {
    height: layout.payRowHeight,
    justifyContent: 'center',
    paddingLeft: layout.payLabelLeft,
    paddingRight: layout.sendRowSide,
    backgroundColor: colors.white,
    // Same very soft shadow as the Send rows
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  labelActive: { color: colors.orange },
  form: { marginTop: layout.payFormTop },
  input: {
    height: layout.payRowHeight,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: layout.sendRowSide,
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.black,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null),
  },
  error: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.red,
    marginTop: 8,
  },
  payButton: { marginTop: layout.payFormGap },
});
