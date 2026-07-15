// app/(tabs)/transfer-flow/details.tsx
// Account number + amount entry. Reads bank type from URL param.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../../constants/typography';
import InputField from '../../../components/InputField';
import { useAccountStore } from '../../../store/useAccountStore';

const BANKS = [
  'Access Bank', 'First Bank', 'GTBank', 'UBA', 'Zenith Bank',
  'Fidelity Bank', 'FCMB', 'Sterling Bank', 'Union Bank', 'Stanbic IBTC',
  'Polaris Bank', 'Wema Bank', 'Keystone Bank', 'Ecobank', 'Heritage Bank',
];

export default function TransferDetailsScreen() {
  const router = useRouter();
  const { bank } = useLocalSearchParams<{ bank: string }>();
  const { account } = useAccountStore();

  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState(bank === 'gtbank' ? 'GTBank' : '');
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');
  const [showBankPicker, setShowBankPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resolvedName = accountNumber.length === 10 ? 'John Adewale' : '';

  const handleContinue = () => {
    const newErrors: Record<string, string> = {};
    if (accountNumber.length !== 10) newErrors.account = 'Enter a valid 10-digit account number';
    if (!selectedBank) newErrors.bank = 'Please select a bank';
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = 'Enter a valid amount';
    if (parseFloat(amount) > (account?.balance ?? 0)) newErrors.amount = 'Insufficient balance';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    router.push(
      `/(tabs)/transfer-flow/confirm?accountNumber=${accountNumber}&accountName=${resolvedName}&bank=${selectedBank}&amount=${amount}&narration=${narration}`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.textDark} />
          </TouchableOpacity>

          <Text style={styles.title}>
            {bank === 'gtbank' ? 'GT Bank Transfer' : 'Other Banks Transfer'}
          </Text>
          <Text style={styles.subtitle}>Enter recipient details</Text>

          <InputField
            label="Account Number"
            placeholder="Enter 10-digit account number"
            value={accountNumber}
            onChangeText={(t) => {
              setAccountNumber(t.replace(/[^0-9]/g, '').slice(0, 10));
              if (errors.account) setErrors((e) => ({ ...e, account: '' }));
            }}
            keyboardType="number-pad"
            maxLength={10}
            error={errors.account}
          />

          {resolvedName !== '' && (
            <View style={styles.resolvedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={colors.green} />
              <Text style={styles.resolvedText}>{resolvedName}</Text>
            </View>
          )}

          {bank !== 'gtbank' && (
            <View style={styles.bankFieldWrapper}>
              <Text style={styles.fieldLabel}>Bank</Text>
              <TouchableOpacity
                style={[styles.bankSelector, !!errors.bank && { borderColor: colors.red }]}
                onPress={() => setShowBankPicker(true)}
              >
                <Text style={selectedBank ? styles.bankValue : styles.bankPlaceholder}>
                  {selectedBank || 'Select bank'}
                </Text>
                <Ionicons name="chevron-down" size={18} color={colors.textGrey} />
              </TouchableOpacity>
              {!!errors.bank && <Text style={styles.errorText}>{errors.bank}</Text>}
            </View>
          )}

          <InputField
            label="Amount (₦)"
            placeholder="0.00"
            value={amount}
            onChangeText={(t) => {
              setAmount(t.replace(/[^0-9.]/g, ''));
              if (errors.amount) setErrors((e) => ({ ...e, amount: '' }));
            }}
            keyboardType="decimal-pad"
            error={errors.amount}
          />

          {account && (
            <Text style={styles.balanceHint}>
              Available balance: ₦{account.balance.toLocaleString()}
            </Text>
          )}

          <InputField
            label="Narration (optional)"
            placeholder="What's this for?"
            value={narration}
            onChangeText={setNarration}
          />

          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showBankPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Bank</Text>
              <TouchableOpacity onPress={() => setShowBankPicker(false)}>
                <Ionicons name="close" size={22} color={colors.textDark} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={BANKS}
              keyExtractor={(i) => i}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.bankOption}
                  onPress={() => { setSelectedBank(item); setShowBankPicker(false); }}
                >
                  <Text style={styles.bankOptionText}>{item}</Text>
                  {selectedBank === item && <Ionicons name="checkmark" size={18} color={colors.orange} />}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.borderLight, marginHorizontal: spacing.xl }} />}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  backButton: { marginTop: spacing.xl, marginBottom: spacing.lg, width: 40, height: 40, justifyContent: 'center' },
  title: { fontSize: fontSize.heading1, fontFamily: fontFamily.bold, color: colors.textDark, marginBottom: spacing.xs },
  subtitle: { fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textGrey, marginBottom: spacing.xl },
  resolvedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: colors.greenFaint, paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: radius.pill, alignSelf: 'flex-start', marginTop: -spacing.md, marginBottom: spacing.lg,
  },
  resolvedText: { fontSize: fontSize.small, fontFamily: fontFamily.semibold, color: colors.green },
  bankFieldWrapper: { marginBottom: spacing.lg },
  fieldLabel: { fontSize: fontSize.small, fontFamily: fontFamily.medium, color: colors.textGrey, marginBottom: spacing.xs },
  bankSelector: {
    height: 52, backgroundColor: colors.inputBackground, borderRadius: radius.input,
    borderWidth: 1.5, borderColor: colors.borderLight, paddingHorizontal: spacing.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  bankValue: { fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textDark },
  bankPlaceholder: { fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textFaded },
  errorText: { fontSize: fontSize.small, fontFamily: fontFamily.regular, color: colors.red, marginTop: spacing.xs },
  balanceHint: { fontSize: fontSize.small, fontFamily: fontFamily.regular, color: colors.textGrey, marginTop: -spacing.md, marginBottom: spacing.lg },
  continueButton: {
    backgroundColor: colors.orange, height: 54, borderRadius: radius.button,
    alignItems: 'center', justifyContent: 'center', marginTop: spacing.xl,
  },
  continueText: { fontSize: fontSize.large, fontFamily: fontFamily.semibold, color: colors.white },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: colors.white, borderTopLeftRadius: radius.card, borderTopRightRadius: radius.card, maxHeight: '70%', paddingBottom: spacing.xxxl },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  modalTitle: { fontSize: fontSize.heading2, fontFamily: fontFamily.semibold, color: colors.textDark },
  bankOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  bankOptionText: { fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textDark },
});