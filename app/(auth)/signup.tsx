import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import { useAuthStore } from '../../store/useAuthStore';
import { signUp, fetchProfile } from '../../services/auth';

export default function SignupScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError('');
    setLoading(true);

    const result = await signUp(email, password);

    setLoading(false);

    if (result.success) {
  const profileResult = await fetchProfile(result.userId ?? '');
  const realUser = {
    id: result.userId ?? '',
    firstName: profileResult.profile?.first_name ?? '',
    lastName: profileResult.profile?.last_name ?? '',
    phoneNumber: profileResult.profile?.phone_number ?? '',
    accountNumber: profileResult.profile?.account_number ?? '',
    tier: (profileResult.profile?.tier ?? 1) as 1 | 2 | 3,
  };
  login(realUser, 'mock-token-abc123');
  router.replace('/(auth)/personal-info');
} else {
  setError(result.message);
}
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.avatarCircle}>
        <Ionicons name="person-add-outline" size={26} color={colors.textGrey} />
      </View>

      <Text style={styles.title}>Create your account</Text>

      <TextInput
        style={styles.inputBox}
        placeholder="Email"
        placeholderTextColor={colors.textFaded}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordRow}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor={colors.textFaded}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color={colors.textGrey}
          />
        </TouchableOpacity>
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={styles.signupButton}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.signupButtonText}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: colors.base,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxxl + 50,
  },
  title: {
    fontSize: fontSize.heading1,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
    marginTop: spacing.xl,
  },
  inputBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 6,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
    marginTop: spacing.lg,
  },
  passwordRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 6,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
  },
  signupButton: {
    width: '100%',
    backgroundColor: colors.orange,
    borderRadius: 6,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  signupButtonText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    color: colors.white,
  },
  error: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.red,
    marginTop: spacing.sm,
  },
});
