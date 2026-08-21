import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import { topUpBalance, getCurrentUserId } from '../../services/auth';

export default function TopUpScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTopUp = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }
    setError('');
    setLoading(true);

    const id = await getCurrentUserId();
    const result = await topUpBalance(id, parseFloat(amount));

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

      <Text style={styles.title}>Top Up Wallet</Text>

      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleTopUp} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Processing...' : 'Top Up'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, paddingHorizontal: spacing.xl },
  backButton: { marginTop: 70, marginBottom: spacing.xl, width: 40, height: 40, justifyContent: 'center' },
  title: { fontSize: fontSize.heading1, fontFamily: fontFamily.bold, color: colors.textDark, marginBottom: spacing.xl },
  input: { borderWidth: 1, borderColor: colors.borderLight, borderRadius: 6, padding: spacing.lg, fontSize: fontSize.body, marginBottom: spacing.lg },
  error: { color: colors.red, marginBottom: spacing.md },
  button: { backgroundColor: colors.orange, borderRadius: 6, paddingVertical: spacing.md, alignItems: 'center' },
  buttonText: { color: colors.white, fontFamily: fontFamily.semibold, fontSize: fontSize.body },
});
