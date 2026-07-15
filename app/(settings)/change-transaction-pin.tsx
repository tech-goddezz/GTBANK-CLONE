import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import InputField from '../../components/InputField';

type Step = 'form' | 'success';

export default function ChangeTransactionPINScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('form');
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const handleProceed = () => {
    if (oldPin.length < 4) { setError('Enter your old transaction PIN'); return; }
    if (newPin.length < 4) { setError('Enter a new PIN'); return; }
    if (newPin !== confirmPin) { setError('PINs do not match'); return; }
    setError('');
    setStep('success');
  };

  if (step === 'success') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContent}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={48} color={colors.textDark} />
          </View>
          <Text style={styles.successTitle}>You're All Set!</Text>
          <Text style={styles.successSub}>
            Your transaction PIN has been successfully reset. Use it to authorize payments and verify account changes.
          </Text>
        </View>
        <View style={styles.buttonArea}>
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scroll}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.title}>Change Transaction Pin</Text>
        <Text style={styles.subtitle}>Secure and enhance your transaction preferences.</Text>
        <InputField placeholder="Enter your old Transaction PIN" value={oldPin} onChangeText={setOldPin} secureTextEntry keyboardType="number-pad" maxLength={6} />
        <InputField placeholder="Enter new Transaction Pin" value={newPin} onChangeText={setNewPin} secureTextEntry keyboardType="number-pad" maxLength={6} />
        <InputField placeholder="Re-enter your new Transaction Pin" value={confirmPin} onChangeText={setConfirmPin} secureTextEntry keyboardType="number-pad" maxLength={6} error={error} />
        <View style={styles.buttonWrap}>
          <TouchableOpacity style={styles.button} onPress={handleProceed}>
            <Text style={styles.buttonText}>Proceed</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { flex: 1, paddingHorizontal: spacing.xl },
  backButton: { marginTop: 56, marginBottom: spacing.xl, width: 40, height: 40, justifyContent: 'center' },
  title: { fontSize: fontSize.heading1, fontFamily: fontFamily.bold, color: colors.textDark, marginBottom: spacing.xs },
  subtitle: { fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textGrey, marginBottom: spacing.xl },
  buttonWrap: { alignItems: 'flex-end', marginTop: spacing.xl },
  buttonArea: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  button: { backgroundColor: colors.orange, paddingHorizontal: spacing.xxl, paddingVertical: spacing.md, borderRadius: radius.button, alignItems: 'center' },
  buttonText: { fontSize: fontSize.body, fontFamily: fontFamily.semibold, color: colors.white },
  successContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  successIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.pageBackground, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl, borderWidth: 2, borderColor: colors.borderLight },
  successTitle: { fontSize: fontSize.heading1, fontFamily: fontFamily.bold, color: colors.textDark, textAlign: 'center', marginBottom: spacing.sm },
  successSub: { fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textGrey, textAlign: 'center', lineHeight: 22 },
});