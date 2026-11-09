import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Polyline } from 'react-native-svg';
import colors from '../../constants/colors';
import { fontSize, fontFamily, lineHeight, spacing } from '../../constants/typography';
import { layout } from '../../constants/layout';
import { checkPhoneExists } from '../../services/auth';
import WelcomeSheet from '../../components/WelcomeSheet';
import Button from '../../components/Button';

export default function PhoneScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
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
      setWelcomeVisible(true);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: Math.max(insets.top, layout.statusBarHeight) }]}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity style={styles.needHelp} onPress={() => router.push('/(settings)/get-help')} activeOpacity={0.7}>
            <Text style={styles.needHelpText}>Need help?</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Hello!</Text>
          {/* Wording copied exactly from the design (including its double space). */}
          <Text style={styles.subtitle}>Welcome to GT World! Enter your phone number  to login or sign in</Text>

          {/* Flag, +234 and arrow, then the number box — placed at the design's exact positions */}
          <View style={styles.phoneRow}>
            <View style={styles.flag}>
              <View style={[styles.flagStripe, { backgroundColor: colors.flagGreen }]} />
              <View style={[styles.flagStripe, { backgroundColor: colors.white }]} />
              <View style={[styles.flagStripe, { backgroundColor: colors.flagGreen }]} />
            </View>
            <Text style={styles.dialCode}>+234</Text>
            <Svg
              style={styles.chevron}
              width={layout.dialChevronWidth}
              height={layout.dialChevronHeight}
              viewBox="0 0 10 6"
            >
              <Polyline points="1,1 5,5 9,1" fill="none" stroke={colors.textDark} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <TextInput
              style={styles.input}
              placeholder="Mobile number"
              placeholderTextColor={colors.textGrey}
              value={phone}
              onChangeText={handleChangeText}
              keyboardType="number-pad"
              maxLength={10}
            />
          </View>
          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <Text style={styles.disclaimer}>
            By providing your phone number , you agree to our <Text style={styles.link}>Privacy policy</Text> and{' '}
            <Text style={styles.link}>Terms of Use</Text>
          </Text>

          <Button
            label="Proceed"
            onPress={handleProceed}
            disabled={!isValid}
            loading={loading}
            style={styles.proceed}
          />
        </ScrollView>
      </SafeAreaView>
      <WelcomeSheet
        visible={welcomeVisible}
        onCancel={() => setWelcomeVisible(false)}
        onOpenAccount={() => {
          setWelcomeVisible(false);
          router.push(`/(auth)/otp?phone=${phone}&mode=signup`);
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { flexGrow: 1, paddingHorizontal: layout.screenPadding, paddingBottom: spacing.xl },
  needHelp: { alignSelf: 'flex-end', marginTop: layout.needHelpTop, marginRight: layout.needHelpRight },
  needHelpText: { fontSize: fontSize.needHelp, lineHeight: lineHeight.needHelp, fontFamily: fontFamily.regular, color: colors.orange },
  title: { fontSize: fontSize.heading1, lineHeight: lineHeight.heading1, fontFamily: fontFamily.medium, color: colors.black, marginTop: layout.phoneTitleGap },
  subtitle: { fontSize: fontSize.body, lineHeight: lineHeight.compact, fontFamily: fontFamily.regular, color: colors.textGrey, marginTop: layout.phoneSubtitleGap },
  phoneRow: { height: lineHeight.phoneRow, marginTop: layout.phoneRowGap },
  flag: { position: 'absolute', left: layout.flagLeft, top: layout.flagTop, flexDirection: 'row', height: layout.flagHeight },
  flagStripe: { width: layout.flagStripeWidth, height: layout.flagHeight },
  dialCode: { position: 'absolute', left: layout.dialCodeLeft, top: 0, fontSize: fontSize.large, lineHeight: lineHeight.phoneRow, fontFamily: fontFamily.medium, color: colors.textDark },
  chevron: { position: 'absolute', left: layout.dialChevronLeft, top: layout.dialChevronTop },
  input: {
    position: 'absolute', left: layout.mobileInputLeft, right: 0, top: 0, height: lineHeight.phoneRow,
    padding: 0, borderWidth: 0, fontSize: fontSize.large, fontFamily: fontFamily.regular, color: colors.textDark,
    outlineStyle: 'none',
  } as any,
  errorText: { fontSize: fontSize.small, fontFamily: fontFamily.regular, color: colors.red, marginTop: spacing.sm },
  disclaimer: { fontSize: fontSize.small, lineHeight: lineHeight.compact, fontFamily: fontFamily.regular, color: colors.textGrey, marginTop: layout.phoneDisclaimerGap },
  link: { fontFamily: fontFamily.semibold, color: colors.orange },
  proceed: { alignSelf: 'flex-end', width: layout.phoneProceedWidth, paddingHorizontal: 0, marginTop: layout.phoneProceedGap },
});
