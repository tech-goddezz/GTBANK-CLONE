// app/(tabs)/transfer.tsx
// Bank transfer screen with account lookup, amount entry, and confirmation.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { useAccountStore } from '../../store/useAccountStore';

// Nigerian banks list
const BANKS = [
  'Access Bank',
  'First Bank',
  'GTBank',
  'UBA',
  'Zenith Bank',
  'Fidelity Bank',
  'FCMB',
  'Sterling Bank',
  'Union Bank',
  'Stanbic IBTC',
  'Polaris Bank',
  'Wema Bank',
  'Keystone Bank',
  'Ecobank',
  'Heritage Bank',
];

type Step = 'form' | 'confirm' | 'success';

export default function TransferScreen() {
  const { account, addTransaction, deductBalance } = useAccountStore();

  const [step, setStep] = useState<Step>('form');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');
  const [showBankPicker, setShowBankPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock account name lookup when 10 digits are entered
  const accountName =
    accountNumber.length === 10 ? 'Emmanuel Adeyemi' : '';

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (accountNumber.length !== 10)
      newErrors.accountNumber = 'Enter a valid 10-digit account number';
    if (!selectedBank) newErrors.bank = 'Please select a bank';
    if (!amount || parseFloat(amount) <= 0)
      newErrors.amount = 'Enter a valid amount';
    if (parseFloat(amount) > (account?.balance ?? 0))
      newErrors.amount = 'Insufficient balance';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) setStep('confirm');
  };

  const handleSend = () => {
    setLoading(true);
    setTimeout(() => {
      // Deduct from balance and add to transaction history
      const transferAmount = parseFloat(amount);
      deductBalance(transferAmount);
      addTransaction({
        id: Date.now().toString(),
        merchantName: accountName,
        category: 'Bank transfer',
        amount: transferAmount,
        type: 'debit',
        status: 'completed',
        date: new Date().toISOString(),
      });
      setLoading(false);
      setStep('success');
    }, 1500);
  };

  const handleReset = () => {
    setStep('form');
    setAccountNumber('');
    setSelectedBank('');
    setAmount('');
    setNarration('');
    setErrors({});
  };

  // Success screen
  if (step === 'success') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={48} color={colors.white} />
          </View>
          <Text style={styles.successTitle}>Transfer Successful!</Text>
          <Text style={styles.successSubtitle}>
            {formatAmount(amount)} has been sent to{'\n'}
            <Text style={styles.successName}>{accountName}</Text>
          </Text>
          <View style={styles.successDetails}>
            <Row label="Bank" value={selectedBank} />
            <Row label="Account" value={accountNumber} />
            <Row label="Narration" value={narration || 'No narration'} />
          </View>
          <Button label="Make another transfer" onPress={handleReset} />
        </View>
      </SafeAreaView>
    );
  }

  // Confirmation screen
  if (step === 'confirm') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setStep('form')}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textDark} />
          </TouchableOpacity>

          <Text style={styles.pageTitle}>Confirm Transfer</Text>
          <Text style={styles.pageSubtitle}>
            Please review the details before sending
          </Text>

          <View style={styles.confirmCard}>
            <Text style={styles.confirmAmount}>{formatAmount(amount)}</Text>
            <Text style={styles.confirmLabel}>Transfer amount</Text>
          </View>

          <View style={styles.detailsCard}>
            <Row label="To" value={accountName} />
            <Row label="Account number" value={accountNumber} />
            <Row label="Bank" value={selectedBank} />
            <Row label="Narration" value={narration || 'No narration'} />
            <Row label="From" value={account?.accountName ?? ''} />
          </View>

          <View style={styles.buttonArea}>
            <Button
              label="Send money"
              onPress={handleSend}
              loading={loading}
            />
            <Button
              label="Cancel"
              onPress={() => setStep('form')}
              variant="ghost"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Main form
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.pageTitle}>Send Money</Text>
        <Text style={styles.pageSubtitle}>
          Transfer to any bank in Nigeria
        </Text>

        {/* Account number */}
        <InputField
          label="Account number"
          placeholder="0000000000"
          value={accountNumber}
          onChangeText={(text) => {
            const digits = text.replace(/[^0-9]/g, '').slice(0, 10);
            setAccountNumber(digits);
            if (errors.accountNumber) {
              setErrors((e) => ({ ...e, accountNumber: '' }));
            }
          }}
          keyboardType="number-pad"
          maxLength={10}
          error={errors.accountNumber}
        />

        {/* Account name lookup result */}
        {accountName !== '' && (
          <View style={styles.accountNameBadge}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={colors.green}
            />
            <Text style={styles.accountNameText}>{accountName}</Text>
          </View>
        )}

        {/* Bank selector */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabel}>Bank</Text>
          <TouchableOpacity
            style={[
              styles.bankSelector,
              !!errors.bank && styles.bankSelectorError,
            ]}
            onPress={() => setShowBankPicker(true)}
          >
            <Text
              style={[
                styles.bankSelectorText,
                !selectedBank && styles.bankSelectorPlaceholder,
              ]}
            >
              {selectedBank || 'Select bank'}
            </Text>
            <Ionicons
              name="chevron-down"
              size={20}
              color={colors.textGrey}
            />
          </TouchableOpacity>
          {!!errors.bank && (
            <Text style={styles.errorText}>{errors.bank}</Text>
          )}
        </View>

        {/* Amount */}
        <InputField
          label="Amount (₦)"
          placeholder="0.00"
          value={amount}
          onChangeText={(text) => {
            const clean = text.replace(/[^0-9.]/g, '');
            setAmount(clean);
            if (errors.amount) setErrors((e) => ({ ...e, amount: '' }));
          }}
          keyboardType="decimal-pad"
          error={errors.amount}
        />

        {/* Balance hint */}
        {account && (
          <Text style={styles.balanceHint}>
            Available: ₦{account.balance.toLocaleString()}
          </Text>
        )}

        {/* Narration */}
        <InputField
          label="Narration (optional)"
          placeholder="What's this for?"
          value={narration}
          onChangeText={setNarration}
        />

        <View style={styles.buttonArea}>
          <Button label="Continue" onPress={handleContinue} />
        </View>
      </ScrollView>

      {/* Bank picker modal */}
      <Modal
        visible={showBankPicker}
        animationType="slide"
        transparent
        onRequestClose={() => setShowBankPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Bank</Text>
              <TouchableOpacity onPress={() => setShowBankPicker(false)}>
                <Ionicons name="close" size={24} color={colors.textDark} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={BANKS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.bankOption}
                  onPress={() => {
                    setSelectedBank(item);
                    setShowBankPicker(false);
                    if (errors.bank) setErrors((e) => ({ ...e, bank: '' }));
                  }}
                >
                  <Text style={styles.bankOptionText}>{item}</Text>
                  {selectedBank === item && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={colors.orange}
                    />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View style={styles.bankSeparator} />
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Helper to format amount with naira sign
function formatAmount(val: string) {
  const num = parseFloat(val);
  if (isNaN(num)) return '₦0.00';
  return `₦${num.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
}

// Reusable detail row
function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background ?? colors.white,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  backButton: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  pageTitle: {
    fontSize: fontSize.heading1,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },
  pageSubtitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginBottom: spacing.xl,
  },
  accountNameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.greenFaint,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
    marginTop: -spacing.md,
    marginBottom: spacing.lg,
  },
  accountNameText: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.semibold,
    color: colors.green,
  },
  fieldWrapper: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.medium,
    color: colors.textGrey,
    marginBottom: spacing.xs,
  },
  bankSelector: {
    height: 52,
    backgroundColor: colors.inputBackground,
    borderRadius: radius.input,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bankSelectorError: {
    borderColor: colors.red,
  },
  bankSelectorText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
  },
  bankSelectorPlaceholder: {
    color: colors.textFaded,
  },
  errorText: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.red,
    marginTop: spacing.xs,
  },
  balanceHint: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: -spacing.md,
    marginBottom: spacing.lg,
  },
  buttonArea: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  confirmCard: {
    backgroundColor: colors.orange,
    borderRadius: radius.card,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.lg,
  },
  confirmAmount: {
    fontSize: 36,
    fontFamily: fontFamily.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  confirmLabel: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: 'rgba(255,255,255,0.8)',
  },
  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  detailLabel: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  detailValue: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.semibold,
    color: colors.textDark,
    maxWidth: '60%',
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    maxHeight: '70%',
    paddingBottom: spacing.xxxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalTitle: {
    fontSize: fontSize.heading2,
    fontFamily: fontFamily.semibold,
    color: colors.textDark,
  },
  bankOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  bankOptionText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
  },
  bankSeparator: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.xl,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  successTitle: {
    fontSize: fontSize.heading1,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  successSubtitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  successName: {
    fontFamily: fontFamily.semibold,
    color: colors.textDark,
  },
  successDetails: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
});