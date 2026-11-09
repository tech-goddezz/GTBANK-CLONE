// app/(auth)/bvn-nin.tsx
// "Your verification number" (S24 BVN tab / S25 NIN tab in Kyc flow.pdf).
// The user picks BVN or NIN with the same switch as the 6-digit code screen,
// then types the 11-digit number into a plain grey box. We validate length
// only (not authenticity — that needs a real backend). The "Dial…" help text
// only shows on the BVN tab, as in the design.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, lineHeight, spacing } from '../../constants/typography';
import { layout } from '../../constants/layout';
import Button from '../../components/Button';
import { useKycStore } from '../../store/useKycStore';
import { useAuthStore } from '../../store/useAuthStore';
import { updateBvnNin } from '../../services/auth';

type VerificationType = 'bvn' | 'nin';

const TABS: { key: VerificationType; label: string; width: number }[] = [
  { key: 'bvn', label: 'BVN', width: layout.codeTabSmsWidth },
  { key: 'nin', label: 'NIN', width: layout.codeTabTokensWidth },
];

const COPY: Record<VerificationType, { placeholder: string; hint: string | null }> = {
  bvn: {
    placeholder: 'Bank verification number (BVN)',
    hint: 'Dial *565*0# on your mobile number to view your unique 11 digit bank verification number ( BVN)',
  },
  nin: {
    placeholder: 'National Identification number (NIN)',
    hint: null, // The design shows no help text on the NIN tab
  },
};

export default function BvnNinScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { dob } = useLocalSearchParams<{ dob: string }>();
  const markBvnNinDone = useKycStore((state) => state.markBvnNinDone);
  const userId = useAuthStore((state) => state.user?.id);
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

  const handleProceed = async () => {
    if (!isValid) {
      setError(`Please enter a valid 11-digit ${activeTab.toUpperCase()}`);
      return;
    }
    await updateBvnNin(userId ?? '', activeTab, number);
    markBvnNinDone();
    router.push(
      `/(auth)/address?dob=${dob}&verificationType=${activeTab}&verificationNumber=${number}`
    );
  };

  const hint = COPY[activeTab].hint;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: Math.max(insets.top, layout.statusBarHeight) }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialIcons name="arrow-back" size={layout.backArrowSize} color={colors.black} />
        </TouchableOpacity>

        <Text style={styles.title}>Your verification{'\n'}number</Text>

        {/* BVN / NIN switch — same look as the code screen's "from SMS / Tokens" */}
        <View style={styles.tabContainer}>
          {TABS.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, { width: t.width }, activeTab === t.key && styles.tabActive]}
              onPress={() => handleTabChange(t.key)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: activeTab === t.key }}
            >
              <Text style={styles.tabLabel}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.subtitle}>This will help you complete the process faster.</Text>

        <View style={styles.box}>
          <TextInput
            style={styles.input}
            placeholder={COPY[activeTab].placeholder}
            placeholderTextColor={colors.textGrey}
            keyboardType="number-pad"
            value={number}
            onChangeText={handleChangeNumber}
            maxLength={11}
          />
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        {!!hint && <Text style={styles.hint}>{hint}</Text>}

        <Button
          label="Proceed"
          onPress={handleProceed}
          disabled={!isValid}
          style={styles.proceed}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.vnButtonBottom,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: layout.backArrowTop,
    marginLeft: layout.backArrowLeft,
  },
  title: {
    fontSize: fontSize.heading2,
    lineHeight: lineHeight.heading2,
    fontFamily: fontFamily.regular,
    color: colors.black,
    marginTop: layout.vnTitleGap,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: layout.contentWidth,
    height: layout.codeTabsHeight,
    marginLeft: 1,
    marginTop: layout.vnTabsGap,
    paddingHorizontal: layout.codeTabsPadH,
    paddingVertical: layout.codeTabsPadV,
    backgroundColor: colors.white,
  },
  tab: {
    height: layout.codeTabHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: colors.segmentActive,
  },
  tabLabel: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  subtitle: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: layout.vnSubtitleGap,
  },
  box: {
    height: layout.inputHeight,
    marginTop: layout.vnBoxGap,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    paddingHorizontal: layout.vnBoxPadding,
  },
  input: {
    height: lineHeight.body,
    padding: 0,
    borderWidth: 0,
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.black,
    outlineStyle: 'none',
  } as any,
  errorText: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.red,
    marginTop: spacing.xs,
  },
  hint: {
    fontSize: fontSize.small,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: layout.vnHintGap,
  },
  proceed: {
    width: layout.phoneProceedWidth,
    alignSelf: 'flex-end',
    marginTop: 'auto',
  },
});
