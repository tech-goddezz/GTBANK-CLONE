import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, FlatList } from 'react-native';
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
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={colors.textDark} />
      </TouchableOpacity>

      <Text style={styles.title}>Pay a Bill</Text>

      <FlatList
        data={BILL_TYPES}
        keyExtractor={(item) => item}
        horizontal
        style={styles.billList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.billOption, selectedBill === item && styles.billOptionActive]}
            onPress={() => setSelectedBill(item)}
          >
            <Text style={[styles.billText, selectedBill === item && styles.billTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.payButton} onPress={handlePay} disabled={loading}>
        <Text style={styles.payButtonText}>{loading ? 'Processing...' : 'Pay Now'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, paddingHorizontal: spacing.xl },
  backButton: { marginTop: 70, marginBottom: spacing.xl, width: 40, height: 40, justifyContent: 'center' },
  title: { fontSize: fontSize.heading1, fontFamily: fontFamily.bold, color: colors.textDark, marginBottom: spacing.xl },
  billList: { marginBottom: spacing.lg },
  billOption: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.button, marginRight: spacing.sm },
  billOptionActive: { backgroundColor: colors.orange, borderColor: colors.orange },
  billText: { fontFamily: fontFamily.medium, color: colors.textDark },
  billTextActive: { color: colors.white },
  input: { borderWidth: 1, borderColor: colors.borderLight, borderRadius: 6, padding: spacing.lg, fontSize: fontSize.body, marginBottom: spacing.lg },
  error: { color: colors.red, marginBottom: spacing.md },
  payButton: { backgroundColor: colors.orange, borderRadius: 6, paddingVertical: spacing.md, alignItems: 'center' },
  payButtonText: { color: colors.white, fontFamily: fontFamily.semibold, fontSize: fontSize.body },
});
