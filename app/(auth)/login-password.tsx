import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import colors from '../../constants/colors';
import { fontSize, fontFamily, lineHeight, spacing } from '../../constants/typography';
import { layout } from '../../constants/layout';
import { useAuthStore } from '../../store/useAuthStore';
import { signIn, signInWithPin, fetchProfile } from '../../services/auth';
import { supabase } from '../../lib/supabase';
import ScreenScroll from '../../components/ScreenScroll';
import UserAvatar from '../../components/UserAvatar';
import NumericKeypad from '../../components/NumericKeypad';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

const PIN_LENGTH = 4;

export default function LoginPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ phone: string }>();
  const login = useAuthStore((state) => state.login);

  // 'checking' while we look for a saved sign-in. 'pin' shows the design's keypad.
  // 'email' is the fallback for someone who has never signed in on this device:
  // the PIN check only works after one email + password sign-in.
  const [mode, setMode] = useState<'checking' | 'pin' | 'email'>('checking');
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setMode(data.session ? 'pin' : 'email'));
  }, []);

  const finishLogin = async (userId: string, token: string) => {
    const profileResult = await fetchProfile(userId);
    login(
      {
        id: userId,
        firstName: profileResult.profile?.first_name ?? '',
        lastName: profileResult.profile?.last_name ?? '',
        phoneNumber: profileResult.profile?.phone_number ?? '',
        accountNumber: profileResult.profile?.account_number ?? '',
        tier: (profileResult.profile?.tier ?? 1) as 1 | 2 | 3,
      },
      token,
    );
    router.replace('/(tabs)/home');
  };

  const submitPin = async (entered: string) => {
    setLoading(true);
    const phoneNumber = (params.phone ?? '').replace(/^234/, '');
    const result = await signInWithPin(phoneNumber, entered);
    setLoading(false);
    if (result.success) {
      await finishLogin(result.userId ?? '', 'real-session');
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  const handleKey = (key: string) => {
    if (loading) return;
    setError('');
    if (key === 'del') {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (pin.length >= PIN_LENGTH) return;
    const next = pin + key;
    setPin(next);
    if (next.length === PIN_LENGTH) submitPin(next);
  };

  const handleEmailLogin = async () => {
    setError('');
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.success) {
      await finishLogin(result.userId ?? '', 'mock-token-abc123');
    } else {
      setError(result.message);
    }
  };

  return (
    <ScreenScroll>
      <View style={[styles.container, { paddingTop: Math.max(insets.top, layout.statusBarHeight) }]}>
        <UserAvatar style={styles.avatar} />

        {/* Grey "Enter password" block — fills with dots as the PIN is typed */}
        <View style={styles.label}>
          <Text style={[styles.labelText, pin.length > 0 && styles.labelDots]}>
            {pin.length > 0 ? '●'.repeat(pin.length) : 'Enter password'}
          </Text>
        </View>
        {!!error && <Text style={styles.error}>{error}</Text>}

        {mode === 'checking' && (
          <View style={styles.middle}>
            <ActivityIndicator color={colors.orange} />
          </View>
        )}

        {mode === 'pin' && (
          <View style={[styles.middle, styles.keypad]}>
            <NumericKeypad onKeyPress={handleKey} />
            {loading && <ActivityIndicator style={styles.pinSpinner} color={colors.orange} />}
          </View>
        )}

        {mode === 'email' && (
          <View style={[styles.middle, styles.emailForm]}>
            <InputField
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <InputField placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Button label="Sign In" onPress={handleEmailLogin} loading={loading} disabled={!email || !password} />
          </View>
        )}

        {/* Bottom links */}
        <View style={styles.links}>
          <TouchableOpacity
            style={styles.linkLeft}
            onPress={() => router.push('/(forgot-password)/reset-password')}
            accessibilityRole="button"
          >
            <Text style={styles.linkOrange}>Forget password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkRight}
            onPress={() => router.replace('/(auth)/login-biometric')}
            accessibilityRole="button"
          >
            <Text style={styles.linkGrey}>Login with Fingerprint</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingBottom: spacing.xxxl,
  },
  avatar: {
    alignSelf: 'center',
    marginTop: layout.avatarTop,
  },
  label: {
    alignSelf: 'center',
    width: layout.passwordLabelWidth,
    height: layout.passwordLabelHeight,
    marginTop: layout.passwordLabelGap,
    backgroundColor: colors.lighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textLightDark,
  },
  labelDots: {
    letterSpacing: spacing.sm,
    paddingLeft: spacing.sm, // balances the space added after the last dot
  },
  error: {
    position: 'absolute',
    alignSelf: 'center',
    top: layout.statusBarHeight + layout.avatarTop + layout.avatarSize + layout.passwordLabelGap + layout.passwordLabelHeight + spacing.sm,
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.red,
  },
  middle: {
    marginTop: layout.passwordKeypadGap,
    minHeight: layout.keypadKeyHeight * 4,
    justifyContent: 'center',
  },
  keypad: {
    justifyContent: 'flex-start',
  },
  pinSpinner: {
    position: 'absolute',
    alignSelf: 'center',
    top: -spacing.xxxl,
  },
  emailForm: {
    paddingHorizontal: layout.screenPadding,
  },
  links: {
    height: lineHeight.phoneRow,
    marginTop: layout.passwordLinksGap,
    marginHorizontal: layout.screenPadding,
  },
  linkLeft: {
    position: 'absolute',
    left: layout.passwordLinkLeft,
  },
  linkRight: {
    position: 'absolute',
    left: layout.passwordLink2Left,
  },
  linkOrange: {
    fontSize: fontSize.large,
    lineHeight: lineHeight.phoneRow,
    fontFamily: fontFamily.regular,
    color: colors.orange,
  },
  linkGrey: {
    fontSize: fontSize.large,
    lineHeight: lineHeight.phoneRow,
    fontFamily: fontFamily.regular,
    color: colors.textFaded,
  },
});
