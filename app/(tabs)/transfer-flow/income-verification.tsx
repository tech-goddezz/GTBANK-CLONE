import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../../constants/typography';
import { applyForHigherLimit, getCurrentUserId } from '../../../services/auth';

const EMPLOYMENT_OPTIONS = ['Employed', 'Self-employed', 'Business Owner', 'Student', 'Unemployed'];

export default function IncomeVerificationScreen() {
  const router = useRouter();
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isValid = !!employmentStatus && !!monthlyIncome && parseFloat(monthlyIncome) > 0;

  const handleSubmit = async () => {
    if (!isValid) {
      setError('Please fill in employment status and monthly income');
      return;
    }
    setError('');
    setLoading(true);
    const id = await getCurrentUserId();
    const result = await applyForHigherLimit(
      id,
      employmentStatus,
      parseFloat(monthlyIncome),
      employerName
    );
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
          <Text style={styles.successTitle}>Verification Complete</Text>
          <Text style={styles.successSubtitle}>
            Your transfer limit has been increased to ₦2,000,000
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace('/(tabs)/transfer-flow')}
          >
            <Text style={styles.buttonText}>Back to Transfers</Text>
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
        <Text style={styles.headerTitle}>Income Verification</Text>
        <View style={{ width: 22 }} />
      </View>

      <Text style={styles.subtitle}>
        Verify your income to increase your transfer limit
      </Text>

      <Text style={styles.sectionLabel}>Employment Status</Text>
      <View style={styles.optionsRow}>
        {EMPLOYMENT_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, employmentStatus === option && styles.optionActive]}
            onPress={() => setEmploymentStatus(option)}
          >
            <Text style={[styles.optionText, employmentStatus === option && styles.optionTextActive]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Monthly Income</Text>
      <View style={styles.inputRow}>
        <Text style={styles.currencyPrefix}>₦</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          placeholderTextColor={colors.textFaded}
          value={monthlyIncome}
          onChangeText={setMonthlyIncome}
          keyboardType="decimal-pad"
        />
      </View>

      <Text style={styles.sectionLabel}>Employer Name (optional)</Text>
      <TextInput
        style={styles.textInput}
        placeholder="e.g. Acme Corp"
        placeholderTextColor={colors.textFaded}
        value={employerName}
        onChangeText={setEmployerName}
      />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={[styles.button, !isValid && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading || !isValid}
      >
        <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit for Verification'}</Text>
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
    marginBottom: spacing.md,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: {
    fontSize: fontSize.heading2,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
  },
  subtitle: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.medium,
    color: colors.textGrey,
    marginBottom: spacing.sm,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  option: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.button,
  },
  optionActive: { backgroundColor: colors.orange, borderColor: colors.orange },
  optionText: { fontFamily: fontFamily.medium, color: colors.textDark, fontSize: fontSize.small },
  optionTextActive: { color: colors.white },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 6,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  currencyPrefix: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    color: colors.textDark,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 6,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
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
