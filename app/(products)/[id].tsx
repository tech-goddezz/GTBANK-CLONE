// app/(products)/[id].tsx
// Dynamic screen for GT financial products — reads the product id from
// the URL and renders the matching requirements + form flow.
// One file instead of 4 identical ones.

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  SafeAreaView, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';

type Step = 'requirements' | 'form' | 'processing';

const PRODUCT_CONFIG: Record<string, {
  title: string;
  description: string;
  requirements: string[];
  fields: string[];
}> = {
  loans: {
    title: 'GT Loans',
    description: 'Access quick loans with competitive rates. Fill in the requirements below before proceeding.',
    requirements: ['OTP Transaction PIN', 'Provide loan account number', 'Enter the loan amount you want to borrow', 'Specify the loan tenure in months', 'Input your monthly income details', 'Guarantors Name', 'Guarantors Phone number'],
    fields: ['OTP Transaction PIN', 'Loan Account Number', 'Loan Amount', 'Loan Tenure (months)', 'Monthly Income Details', 'Guarantors Name', 'Guarantors Phone Number'],
  },
  pensions: {
    title: 'GT Pensions',
    description: 'Secure your retirement with our pension plans. Please verify requirements before proceeding.',
    requirements: ['OTP Transaction PIN', 'Provide your loan account number', 'Enter the loan amount you want to borrow', 'Specify the loan tenure in months', 'Monthly Income Details', 'Provide Guarantors Phone Number', 'Provide collateral documents'],
    fields: ['OTP Transaction PIN', 'Account Number', 'Monthly Contribution', 'Loan Tenure', 'Monthly Income', 'Guarantors Phone Number'],
  },
  'dollar-fund': {
    title: 'GT Dollar Fund',
    description: 'Invest in foreign currency funds. Complete the process to get started.',
    requirements: ['Previous Transaction PIN', 'Money Market Account', 'Desired Loan Amount', 'Preferred Loan Tenure', 'Monthly Income Details', 'Guarantors Name', 'Guarantors Phone Number'],
    fields: ['Previous Transaction PIN', 'Money Market Account', 'Investment Amount', 'Tenure', 'Monthly Income', 'Guarantors Name', 'Guarantors Phone Number'],
  },
  'money-mkt': {
    title: 'GT Money Mkt',
    description: 'Earn returns on your money market account. Fill in the details below.',
    requirements: ['Previous Transaction PIN', 'Money Market Account', 'Desired Loan Amount', 'Preferred Loan Tenure', 'Monthly Income Details', 'Guarantors Name', 'Guarantors Phone Number'],
    fields: ['Previous Transaction PIN', 'Account Number', 'Deposit Amount', 'Duration', 'Monthly Income', 'Guarantors Name', 'Guarantors Phone Number'],
  },
};

export default function ProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [step, setStep] = useState<Step>('requirements');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  const config = PRODUCT_CONFIG[id ?? 'loans'] ?? PRODUCT_CONFIG.loans;

  // Processing/wait screen
  if (step === 'processing') {
    return (
      <SafeAreaView style={styles.processingContainer}>
        <View style={styles.processingContent}>
          <View style={styles.processingIcon}>
            <Ionicons name="time-outline" size={48} color={colors.orange} />
          </View>
          <Text style={styles.processingTitle}>Wait a moment</Text>
          <Text style={styles.processingSubtitle}>
            Your {config.title} account opening request is in progress.
            You can view the applicable limits of your account below.
          </Text>

          <View style={styles.tierCard}>
            <View style={styles.tierHeader}>
              <View style={styles.tierIconWrap}>
                <Ionicons name="shield-checkmark-outline" size={20} color={colors.orange} />
              </View>
              <Text style={styles.tierTitle}>{config.title}</Text>
              <Text style={styles.tierSub}>View details →</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonArea}>
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Form screen
  if (step === 'form') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <TouchableOpacity style={styles.backButton} onPress={() => setStep('requirements')}>
              <Ionicons name="arrow-back" size={24} color={colors.textDark} />
            </TouchableOpacity>

            <Text style={styles.title}>{config.title}</Text>
            <Text style={styles.subtitle}>Review and manage your financial activity.</Text>

            {config.fields.map((field) => (
              <View key={field} style={styles.inputWrap}>
                <Text style={styles.inputLabel}>{field}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={`Enter ${field.toLowerCase()}`}
                  placeholderTextColor={colors.textFaded}
                  value={fieldValues[field] ?? ''}
                  onChangeText={(t) => setFieldValues((prev) => ({ ...prev, [field]: t }))}
                  secureTextEntry={field.toLowerCase().includes('pin')}
                  keyboardType={field.toLowerCase().includes('amount') || field.toLowerCase().includes('income') || field.toLowerCase().includes('pin') ? 'number-pad' : 'default'}
                />
              </View>
            ))}

            <TouchableOpacity
              style={styles.button}
              onPress={() => setStep('processing')}
            >
              <Text style={styles.buttonText}>Proceed</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Requirements screen (default)
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>

        <Text style={styles.title}>
          Welcome Emmanuel,{'\n'}Open a {config.title}{'\n'}Account
        </Text>
        <Text style={styles.subtitle}>{config.description}</Text>

        <View style={styles.reqHeader}>
          <Text style={styles.reqTitle}>Requirements</Text>
          <Text style={styles.reqCount}>0/{config.requirements.length} ready</Text>
        </View>

        {config.requirements.map((req, i) => (
          <View key={i} style={styles.reqRow}>
            <Text style={styles.reqText}>{req}</Text>
            <View style={styles.reqCircle}>
              <Ionicons name="ellipse-outline" size={20} color={colors.borderLight} />
            </View>
          </View>
        ))}

        <View style={styles.buttonWrap}>
          <TouchableOpacity
            style={styles.getAccountButton}
            onPress={() => setStep('form')}
          >
            <Text style={styles.getAccountText}>Get Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  backButton: { marginTop: 56, marginBottom: spacing.xl, width: 40, height: 40, justifyContent: 'center' },
  title: { fontSize: fontSize.heading2, fontFamily: fontFamily.bold, color: colors.textDark, marginBottom: spacing.sm, lineHeight: 30 },
  subtitle: { fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textGrey, marginBottom: spacing.xl, lineHeight: 22 },
  reqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  reqTitle: { fontSize: fontSize.body, fontFamily: fontFamily.semibold, color: colors.textDark },
  reqCount: { fontSize: fontSize.small, fontFamily: fontFamily.regular, color: colors.textGrey },
  reqRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  reqText: { fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textDark, flex: 1 },
  reqCircle: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  buttonWrap: { alignItems: 'flex-start', marginTop: spacing.xxl },
  getAccountButton: {
    backgroundColor: colors.orange, paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md, borderRadius: radius.button,
  },
  getAccountText: { fontSize: fontSize.body, fontFamily: fontFamily.semibold, color: colors.white },
  inputWrap: { marginBottom: spacing.lg },
  inputLabel: { fontSize: fontSize.small, fontFamily: fontFamily.medium, color: colors.textGrey, marginBottom: spacing.xs },
  input: {
    height: 52, backgroundColor: colors.inputBackground, borderRadius: radius.input,
    borderWidth: 1.5, borderColor: colors.borderLight, paddingHorizontal: spacing.lg,
    fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textDark,
  },
  button: {
    backgroundColor: colors.orange, height: 54, borderRadius: radius.button,
    alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg,
  },
  buttonText: { fontSize: fontSize.large, fontFamily: fontFamily.semibold, color: colors.white },
  processingContainer: { flex: 1, backgroundColor: colors.white },
  processingContent: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xxxl, alignItems: 'center' },
  processingIcon: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: colors.orangeFaint,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl,
  },
  processingTitle: { fontSize: fontSize.heading1, fontFamily: fontFamily.bold, color: colors.textDark, textAlign: 'center', marginBottom: spacing.sm },
  processingSubtitle: { fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textGrey, textAlign: 'center', lineHeight: 22, marginBottom: spacing.xl },
  tierCard: {
    width: '100%', backgroundColor: colors.pageBackground, borderRadius: radius.card,
    padding: spacing.lg,
  },
  tierHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  tierIconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.orangeFaint, alignItems: 'center', justifyContent: 'center' },
  tierTitle: { flex: 1, fontSize: fontSize.body, fontFamily: fontFamily.semibold, color: colors.textDark },
  tierSub: { fontSize: fontSize.small, fontFamily: fontFamily.regular, color: colors.orange },
  buttonArea: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
});