import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing } from '../../constants/typography';
import { checkPhoneExists } from '../../services/auth';

export default function PhoneScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isValid = /^[789][01]\d{8}$/.test(phone);

  const handleChangeText = (text: string) => {
    const digits = text.replace(/[^0-9]/g, '').slice(0, 10);
    setPhone(digits);
    if (error) setError('');
  };

  const handleProceed = async () => {
    if (!isValid) {
      setError('Please enter a valid phone number');
      return;
    }
    setError('');
    setLoading(true);
    const result = await checkPhoneExists(phone);
    setLoading(false);
    if (result.exists) {
      router.push(`/(auth)/otp?phone=${phone}&mode=login`);
    } else {
      router.push(`/signup?phone=${phone}`);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Hello!</Text>
          <Text style={styles.subtitle}>Welcome to GT World! Enter your phone number to continue</Text>
          <View style={[styles.inputRow, !!error && styles.inputRowError]}>
            <Text style={styles.prefix}>+234</Text>
            <TextInput style={styles.input} placeholder="Mobile number" placeholderTextColor={colors.textFaded} value={phone} onChangeText={handleChangeText} keyboardType="number-pad" maxLength={10} />
          </View>
          {!!error && <Text style={styles.errorText}>{error}</Text>}
          <Text style={styles.disclaimer}>By providing your phone number, you agree to our Terms and Privacy Policy</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.proceedButton, (!isValid || loading) && styles.proceedButtonDisabled]} onPress={handleProceed} disabled={!isValid || loading} activeOpacity={0.85}>
              <Text style={styles.proceedText}>{loading ? 'Checking...' : 'Proceed'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingTop: 60 },
  title: { fontSize: fontSize.heading1, fontFamily: fontFamily.bold, color: colors.textDark },
  subtitle: { fontSize: fontSize.small, fontFamily: fontFamily.regular, color: colors.textGrey, marginTop: spacing.sm, marginBottom: spacing.xl },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.borderLight, paddingBottom: spacing.md, gap: spacing.sm },
  inputRowError: { borderBottomColor: colors.red },
  prefix: { fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textDark },
  input: { flex: 1, fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textDark },
  errorText: { fontSize: fontSize.small, color: colors.red, marginTop: spacing.sm },
  disclaimer: { fontSize: 11, fontFamily: fontFamily.regular, color: colors.textGrey, marginTop: spacing.lg },
  buttonRow: { marginTop: 'auto', paddingVertical: spacing.xl, alignItems: 'flex-end' },
  proceedButton: { backgroundColor: colors.orange, borderRadius: 6, paddingVertical: spacing.md, paddingHorizontal: spacing.xxl },
  proceedButtonDisabled: { opacity: 0.5 },
  proceedText: { color: colors.white, fontFamily: fontFamily.semibold, fontSize: fontSize.body },
});
