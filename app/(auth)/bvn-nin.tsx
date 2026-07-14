// app/(auth)/bvn-nin.tsx
// Verification number entry — user picks BVN or NIN, then enters the
// 11-digit number. Both are real Nigerian identity verification numbers,
// so we validate length only (not authenticity — that needs a real backend).
//
// Matches the Figma "Your verification number" frame: no back arrow, no
// "Need help?" link on this screen — just the two tabs, a heading that
// changes with the active tab, the dial-code instructions, the input, and
// a compact right-aligned Proceed button (not full-width, unlike most
// other screens in this flow).

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
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

type VerificationType = 'bvn' | 'nin';

const COPY: Record<VerificationType, { heading: string; instructions: string }> = {
  bvn: {
    heading: 'Bank verification number (BVN)',
    instructions:
      'Dial *565*0# on your mobile number to view your unique 11 digit bank verification number (BVN)',
  },
  nin: {
    heading: 'National Identification number (NIN)',
    instructions:
      'To retrieve your NIN, dial *346# on your mobile number to view your unique 11 digit National Identification number (NIN)',
  },
};

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
        <View style={styles.header}>
          <Text style={styles.title}>Your verification{'\n'}number</Text>
          <Text style={styles.subtitle}>This will help you complete the process faster.</Text>
        </View>

        {/* Tab toggle: BVN / NIN — two independent pills, not a shared
            segmented-control bar. Active tab gets a light grey background;
            inactive tab is transparent. Both use dark text. */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'bvn' && styles.tabActive]}
            onPress={() => handleTabChange('bvn')}
          >
            <Text style={styles.tabLabel}>BVN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'nin' && styles.tabActive]}
            onPress={() => handleTabChange('nin')}
          >
            <Text style={styles.tabLabel}>NIN</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.fieldHeading}>{COPY[activeTab].heading}</Text>
        <Text style={styles.instructions}>{COPY[activeTab].instructions}</Text>

        <InputField
          placeholder="Your number"
          keyboardType="number-pad"
          value={number}
          onChangeText={handleChangeNumber}
          error={error}
          maxLength={11}
        />

        {/* Compact, right-aligned button — matches the design's "Proceed"
            sizing on this screen (content-width, not full-width). */}
        <View style={styles.buttonArea}>
          <Button
            label="Proceed"
            onPress={handleProceed}
            disabled={!isValid}
            style={styles.compactButton}
          />
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
    paddingTop: 64,
    paddingBottom: spacing.xxxl,
  },
  header: { marginBottom: spacing.xl },
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
    gap: spacing.xl,
    marginBottom: spacing.xl,
  },
  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
  },
  tabActive: {
    backgroundColor: colors.pageBackground,
  },
  tabLabel: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.medium,
    color: colors.textDark,
  },
  fieldHeading: {
    fontSize: fontSize.heading3,
    fontFamily: fontFamily.semibold,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  instructions: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  buttonArea: {
    marginTop: spacing.xxl,
    alignItems: 'flex-end',
  },
  compactButton: {
    paddingHorizontal: spacing.xxl,
  },
});