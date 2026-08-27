import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import { payBill, getCurrentUserId } from '../../services/auth';

const BILL_TYPES = ['Airtime', 'Electricity', 'Cable TV', 'Internet'];

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
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={22} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pay a Bill</Text>
        <View style={{ width: 22 }} />
      </View>

      <Text style={styles.sectionLabel}>Select bill type</Text>
      <View style={[styles.billList, { flexDirection: "row", flexWrap: "wrap" }]}>
        {BILL_TYPES.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.billOption, selectedBill === item && styles.billOptionActive]}
            onPress={() => setSelectedBill(item)}
          >
            <Text style={[styles.billText, selectedBill === item && styles.billTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Amount</Text>
      <View style={styles.inputRow}>
        <Text style={styles.currencyPrefix}>₦</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          placeholderTextColor={colors.textFaded}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.payButton} onPress={handlePay} disabled={loading}>
        <Text style={styles.payButtonText}>{loading ? 'Processing...' : 'Pay Now'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.darkNavy, paddingHorizontal: spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: {
    fontSize: fontSize.heading2,
    fontFamily: fontFamily.bold,
    color: colors.white,
  },
  sectionLabel: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.medium,
    color: colors.base,
    marginBottom: spacing.sm,
  },
  billList: { marginBottom: spacing.xl },
  billOption: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.button,
    marginRight: spacing.sm,
  },
  billOptionActive: { backgroundColor: colors.orange, borderColor: colors.orange },
  billText: { fontFamily: fontFamily.medium, color: colors.white },
  billTextActive: { color: colors.white },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 6,
    backgroundColor: colors.navyCard,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  currencyPrefix: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    color: colors.white,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.white,
  },
  error: {
    fontSize: fontSize.small,
    color: colors.red,
    marginBottom: spacing.md,
  },
  payButton: {
    backgroundColor: colors.orange,
    borderRadius: 6,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  payButtonText: {
    color: colors.white,
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.body,
  },
});
