// app/(auth)/bvn-nin.tsx
// Verification number entry — user picks BVN or NIN, then enters the
// 11-digit number. Both are real Nigerian identity verification numbers,
// so we validate length only (not authenticity — that needs a real backend).

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

type VerificationType = 'bvn' | 'nin';

export default function BvnNinScreen() {
  const router = useRouter();
  const { dob } = useLocalSearchParams<{ dob: string }>();
  const [activeTab, setActiveTab] = useState<VerificationType>('bvn');
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');

  const isValid = number.length === 11;

  // Switching tabs clears the field — a half-typed BVN showing up as a
  // NIN (or vice versa) would be confusing and is easy to avoid.
  const handleTabChange = (tab: VerificationType) => {
    setActiveTab(tab);
    setNumber('');
    setError('');
  };

  const handleChangeNumber = (text: string) => {
    const digitsOnly = text.replace(/[^0-9]/g, '').slice(0, 11);
    setNumber(digitsOnly);
    if (error) setError('');
  };

  const handleProceed = () => {
    if (!isValid) {
      setError(`Please enter a valid 11-digit ${activeTab.toUpperCase()}`);
      return;
    }
    router.push(
      `/(auth)/address?dob=${dob}&verificationType=${activeTab}&verificationNumber=${number}`
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Your verification{'\n'}number</Text>
          <Text style={styles.subtitle}>
            We use this to confirm your identity with the government registry
          </Text>
        </View>

        {/* Tab toggle: BVN / NIN */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'bvn' && styles.tabActive]}
            onPress={() => handleTabChange('bvn')}
          >
            <Text style={[styles.tabLabel, activeTab === 'bvn' && styles.tabLabelActive]}>
              BVN
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'nin' && styles.tabActive]}
            onPress={() => handleTabChange('nin')}
          >
            <Text style={[styles.tabLabel, activeTab === 'nin' && styles.tabLabelActive]}>
              NIN
            </Text>
          </TouchableOpacity>
        </View>

        <InputField
          label={activeTab === 'bvn' ? 'Bank Verification Number' : 'National Identity Number'}
          placeholder="Enter 11-digit number"
          keyboardType="number-pad"
          value={number}
          onChangeText={handleChangeNumber}
          error={error}
          maxLength={11}
        />

        {/* Small educational banner — explains what these numbers are,
            since not every user filling this out knows the acronyms. */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle-outline" size={18} color={colors.orange} />
          <Text style={styles.infoText}>
            {activeTab === 'bvn'
              ? 'Your BVN is linked to your fingerprint and issued by any Nigerian bank.'
              : 'Your NIN is issued by NIMC and printed on your national ID slip.'}
          </Text>
        </View>

        <View style={styles.buttonArea}>
          <Button label="Proceed" onPress={handleProceed} disabled={!isValid} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  backButton: {
    marginTop: 56,
    marginBottom: spacing.xl,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  header: { marginBottom: spacing.xxl },
  title: {
    fontSize: fontSize.heading1,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
    marginBottom: spacing.sm,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    lineHeight: 22,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.pageBackground,
    borderRadius: radius.button,
    padding: 4,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.button - 4,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabLabel: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.medium,
    color: colors.textGrey,
  },
  tabLabelActive: {
    color: colors.orange,
    fontFamily: fontFamily.semibold,
  },
  infoBanner: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.orangeFaint,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  infoText: {
    flex: 1,
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    lineHeight: 18,
  },
  buttonArea: { marginTop: spacing.md },
});