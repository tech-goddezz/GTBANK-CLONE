import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import { fetchTransactions, reportTransaction, getCurrentUserId } from '../../services/auth';

export default function ReportTransactionScreen() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadTransactions = async () => {
      const id = await getCurrentUserId();
      const result = await fetchTransactions(id);
      if (result.success) {
        setTransactions(result.transactions);
      }
    };
    loadTransactions();
  }, []);

  const isValid = !!selectedTransaction && reason.trim().length > 5;

  const handleSubmit = async () => {
    if (!isValid) {
      setError('Please select a transaction and describe the issue');
      return;
    }
    setError('');
    setLoading(true);
    const id = await getCurrentUserId();
    const result = await reportTransaction(id, selectedTransaction.id, reason);
    setLoading(false);
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.message);
    }
  };

  if (success) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.successBox}>
          <Ionicons name="checkmark-circle" size={64} color={colors.orange} />
          <Text style={styles.successTitle}>Report Submitted</Text>
          <Text style={styles.successSubtitle}>
            We'll review your report and get back to you shortly.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={22} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Transaction</Text>
        <View style={{ width: 22 }} />
      </View>

      <Text style={styles.sectionLabel}>Select Transaction</Text>
      <TouchableOpacity
        style={styles.dropdownField}
        onPress={() => setPickerOpen((prev) => !prev)}
      >
        <Text style={selectedTransaction ? styles.dropdownValue : styles.dropdownPlaceholder}>
          {selectedTransaction
            ? `₦${selectedTransaction.amount} — ${selectedTransaction.receiver_account_number}`
            : 'Choose a transaction'}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.textGrey} />
      </TouchableOpacity>

      {pickerOpen && (
        <View style={styles.inlinePicker}>
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            style={{ maxHeight: 250 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.txnRow}
                onPress={() => {
                  setSelectedTransaction(item);
                  setPickerOpen(false);
                  setError('');
                }}
              >
                <Text style={styles.txnRowText}>
                  ₦{item.amount} — {item.receiver_account_number}
                </Text>
                <Text style={styles.txnRowDate}>
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No transactions found</Text>
            }
          />
        </View>
      )}

      <Text style={styles.sectionLabel}>Describe the Issue</Text>
      <TextInput
        style={styles.textArea}
        placeholder="What went wrong with this transaction?"
        placeholderTextColor={colors.textFaded}
        value={reason}
        onChangeText={setReason}
        multiline
        numberOfLines={4}
      />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={[styles.button, !isValid && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading || !isValid}
      >
        <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit Report'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, paddingHorizontal: spacing.xl },
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
    color: colors.textDark,
  },
  sectionLabel: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.medium,
    color: colors.textGrey,
    marginBottom: spacing.sm,
  },
  dropdownField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.input,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  dropdownValue: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
  },
  dropdownPlaceholder: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textFaded,
  },
  inlinePicker: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.input,
    marginBottom: spacing.md,
  },
  txnRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  txnRowText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.medium,
    color: colors.textDark,
  },
  txnRowDate: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: 2,
  },
  emptyText: {
    padding: spacing.lg,
    textAlign: 'center',
    color: colors.textGrey,
    fontFamily: fontFamily.regular,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 6,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: spacing.lg,
  },
  error: { fontSize: fontSize.small, color: colors.red, marginBottom: spacing.md },
  button: {
    backgroundColor: colors.orange,
    borderRadius: 6,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: colors.white, fontFamily: fontFamily.semibold, fontSize: fontSize.body },
  successBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  successTitle: {
    fontSize: fontSize.heading2,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: spacing.sm,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});
