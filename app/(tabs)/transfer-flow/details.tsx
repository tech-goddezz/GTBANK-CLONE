// app/(tabs)/transfer-flow/details.tsx
//
// Send form (S47 GTBank in "Screens inside the home screen.pdf"; S48 Different
// Bank uses the same page with a bank box styled like a Send row). Reads the bank type from the URL.
//
// Labels sit above light grey boxes; the found account name shows as plain text
// under the destination box. Checks and the next step (confirm) are unchanged.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../../constants/typography';
import { layout } from '../../../constants/layout';
import ScreenHeader from '../../../components/ScreenHeader';
import Button from '../../../components/Button';

import { fetchProfile, getCurrentUserId, lookupAccountName } from '../../../services/auth';

const BANKS = [
  'Access Bank', 'Citibank Nigeria', 'Ecobank', 'Fidelity Bank', 'First Bank',
  'First City Monument Bank (FCMB)', 'Globus Bank', 'GTBank', 'Heritage Bank',
  'Jaiz Bank', 'Keystone Bank', 'Kuda Bank', 'Lotus Bank', 'Moniepoint MFB',
  'Opay', 'Optimus Bank', 'Palmpay', 'Parallex Bank', 'Polaris Bank',
  'Premium Trust Bank', 'Providus Bank', 'Signature Bank', 'Stanbic IBTC',
  'Standard Chartered Bank', 'Sterling Bank', 'SunTrust Bank', 'Suntrust Bank',
  'Taj Bank', 'Titan Trust Bank', 'Union Bank', 'United Bank for Africa (UBA)',
  'Unity Bank', 'VFD Microfinance Bank', 'Wema Bank', 'Zenith Bank',
];

// Stops Chrome drawing its orange focus ring around the boxes.
const noOutline = Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null;

export default function TransferDetailsScreen() {
  const router = useRouter();
  const { bank } = useLocalSearchParams<{ bank: string }>();
  const isGtbank = bank === 'gtbank';
  // Saved Beneficiaries (S49): the Different Bank form with 'Beneficiary' wording
  // and the name in its own white box.
  const isSaved = bank === 'saved';
  // Fund GT Money Market (S50): from your own account to a market wallet number.
  const isMarket = bank === 'money-market';
  // e-wallet (S51): from your own account to a savings wallet number.
  const isWallet = bank === 'e-wallet';
  // Forms that start with your own account number instead of a bank box
  const showsOwnAccount = isGtbank || isMarket || isWallet;
  // Wallet forms show no account holder's name
  const isWalletForm = isMarket || isWallet;
  const [realBalance, setRealBalance] = useState(0);
  const [myAccountNumber, setMyAccountNumber] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      const id = await getCurrentUserId();
      const result = await fetchProfile(id);
      if (result.success && result.profile) {
        setRealBalance(result.profile.balance ?? 0);
        setMyAccountNumber(result.profile.account_number ?? '');
      }
    };
    loadProfile();
  }, []);

  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState(
    isGtbank ? 'GTBank' : isMarket ? 'GT Money Market' : isWallet ? 'GT e-wallet' : ''
  );
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');
  const [showBankPicker, setShowBankPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resolvedName, setResolvedName] = useState('');
  const [resolvingName, setResolvingName] = useState(false);

  useEffect(() => {
    const resolveAccountName = async () => {
      if (accountNumber.length === 10) {
        setResolvingName(true);
        const result = await lookupAccountName(accountNumber);
        setResolvedName(result.success ? result.name : '');
        setResolvingName(false);
      } else {
        setResolvedName('');
      }
    };
    resolveAccountName();
  }, [accountNumber]);

  const handleContinue = () => {
    const newErrors: Record<string, string> = {};
    if (accountNumber.length !== 10) newErrors.account = 'Enter a valid 10-digit account number';
    if (!selectedBank) newErrors.bank = 'Please select a bank';
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = 'Enter a valid amount';
    if (parseFloat(amount) > realBalance) newErrors.amount = 'Insufficient balance';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    router.push(
      `/(tabs)/transfer-flow/confirm?accountNumber=${accountNumber}&accountName=${resolvedName}&bank=${selectedBank}&amount=${amount}&narration=${narration}`
    );
  };

  const showName = resolvingName || resolvedName !== '';

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Send"
        subtitle="Make seamless and secure transfers."
        onBellPress={() => router.push('/(tabs)/notifications')}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {showsOwnAccount ? (
            <>
              <Text style={styles.label}>{isMarket ? 'Checking Account' : isWallet ? 'E-Wallet Account' : 'Main Account'}</Text>
              {/* Your own account: shown, not editable */}
              <View style={[styles.box, styles.boxCentred]}>
                <Text style={styles.boxText}>{myAccountNumber}</Text>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.label}>{isSaved ? 'Beneficiary Bank' : 'Recipient Bank'}</Text>
              {/* Looks like a picked row on the Send page: grey circle until a bank is chosen */}
              <TouchableOpacity
                style={[styles.box, styles.bankBox]}
                onPress={() => setShowBankPicker(true)}
                accessibilityRole="button"
              >
                <View
                  style={[
                    styles.bankCircle,
                    { backgroundColor: selectedBank ? colors.orange : colors.sendCircle },
                  ]}
                >
                  <MaterialIcons name="account-balance" size={layout.sendIcon} color={colors.white} />
                </View>
                <Text style={[styles.boxText, styles.bankName, !selectedBank && styles.hint]} numberOfLines={1}>
                  {selectedBank || 'Select bank'}
                </Text>
              </TouchableOpacity>
              {!!errors.bank && <Text style={styles.errorText}>{errors.bank}</Text>}
            </>
          )}

          <Text style={[styles.label, styles.nextLabel]}>
            {isGtbank
              ? 'Destination Account'
              : isMarket
                ? 'Market Wallet'
                : isWallet
                  ? 'Savings Wallet'
                : isSaved
                  ? 'Beneficiary Account'
                  : 'Recipient Account'}
          </Text>
          <TextInput
            style={[styles.box, styles.boxText, noOutline]}
            placeholder={isWalletForm ? 'Enter wallet number' : 'Enter account number'}
            placeholderTextColor={colors.textGrey}
            value={accountNumber}
            onChangeText={(t) => {
              setAccountNumber(t.replace(/[^0-9]/g, '').slice(0, 10));
              if (errors.account) setErrors((e) => ({ ...e, account: '' }));
            }}
            keyboardType="number-pad"
            maxLength={10}
          />
          {!!errors.account && <Text style={styles.errorText}>{errors.account}</Text>}

          {isSaved && (
            <>
              <Text style={[styles.label, styles.nextLabel]}>Beneficiary Name</Text>
              {/* Filled in by the account lookup; can't be typed in */}
              <View style={[styles.box, styles.nameBox]}>
                {resolvingName ? (
                  <Text style={[styles.boxText, styles.hint]}>Verifying account...</Text>
                ) : (
                  <Text style={[styles.boxText, !resolvedName && styles.hint]} numberOfLines={1}>
                    {resolvedName || 'Name appears here'}
                  </Text>
                )}
              </View>
            </>
          )}

          {!isSaved && !isWalletForm && showName && (
            <View style={styles.nameRow}>
              {resolvingName ? (
                <>
                  <ActivityIndicator size="small" color={colors.orange} />
                  <Text style={[styles.name, styles.verifying]}>Verifying account...</Text>
                </>
              ) : (
                <Text style={styles.name}>{resolvedName}</Text>
              )}
            </View>
          )}

          <Text style={[styles.label, showName && !isSaved && !isWalletForm ? styles.labelAfterName : styles.nextLabel]}>
            {showsOwnAccount ? 'Amount' : 'Amount to Send'}
          </Text>
          <TextInput
            style={[styles.box, styles.boxText, noOutline]}
            placeholder="Enter the Amount"
            placeholderTextColor={colors.textGrey}
            value={amount}
            onChangeText={(t) => {
              setAmount(t.replace(/[^0-9.]/g, ''));
              if (errors.amount) setErrors((e) => ({ ...e, amount: '' }));
            }}
            keyboardType="decimal-pad"
          />
          {!!errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}

          <Text style={[styles.label, styles.nextLabel]}>Narration</Text>
          <TextInput
            style={[styles.box, styles.boxText, noOutline]}
            placeholder="What's this for?"
            placeholderTextColor={colors.textGrey}
            value={narration}
            onChangeText={setNarration}
          />

          <Button label="Proceed" onPress={handleContinue} style={styles.button} />
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
                  onPress={() => {
                    setSelectedBank(item);
                    setShowBankPicker(false);
                    if (errors.bank) setErrors((e) => ({ ...e, bank: '' }));
                  }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  scroll: {
    flexGrow: 1,
    paddingTop: layout.formTop,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.tabBarHeight,
  },
  label: {
    fontSize: fontSize.large,
    lineHeight: layout.formLabelLineHeight,
    fontFamily: fontFamily.regular,
    color: colors.textNearBlack,
    marginBottom: layout.formLabelGap,
  },
  nextLabel: { marginTop: layout.formFieldGap },
  labelAfterName: { marginTop: layout.formNameBottom },
  box: {
    height: layout.inputHeight,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: layout.formTextInset,
    // Same very soft shadow as the Send rows
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  boxCentred: { justifyContent: 'center' },
  nameBox: { justifyContent: 'center', backgroundColor: colors.white },
  bankBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: layout.sendCircleLeft,
  },
  bankCircle: {
    width: layout.sendCircle,
    height: layout.sendCircle,
    borderRadius: layout.sendCircle / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankName: { flex: 1, marginLeft: layout.sendLabelGap },
  boxText: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.regular,
    color: colors.textNearBlack,
  },
  hint: { color: colors.textGrey },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: layout.formNameTop,
    paddingLeft: layout.formTextInset,
  },
  name: {
    fontSize: fontSize.large,
    lineHeight: layout.formLabelLineHeight,
    fontFamily: fontFamily.regular,
    color: colors.textNearBlack,
    // Very faint shadow under the name, as in the design
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  verifying: { color: colors.textGrey },
  errorText: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.red,
    marginTop: spacing.xs,
  },
  button: { marginTop: layout.formButtonTop },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: colors.white, borderTopLeftRadius: radius.card, borderTopRightRadius: radius.card, maxHeight: '70%', paddingBottom: spacing.xxxl },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  modalTitle: { fontSize: fontSize.heading2, fontFamily: fontFamily.semibold, color: colors.textDark },
  bankOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  bankOptionText: { fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textDark },
});
