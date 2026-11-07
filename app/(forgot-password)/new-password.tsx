// Create new password — must differ from the previous one.
// Matches the 6th screen of "forget password.pdf": no back arrow, and two
// white boxes with a light grey outline (same look as Reset Password).

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import colors from '../../constants/colors';
import { fontSize, fontFamily, lineHeight, spacing } from '../../constants/typography';
import { layout } from '../../constants/layout';
import Button from '../../components/Button';

export default function NewPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleReset = () => {
    const newErrors: Record<string, string> = {};
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirm) newErrors.confirm = 'Passwords do not match';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    router.replace('/(forgot-password)/success');
  };

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
        <Text style={styles.title}>Create New Password</Text>
        <Text style={styles.subtitle}>
          Your new password must be different from your previous password
        </Text>

        <View style={[styles.box, styles.firstBox]}>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor={colors.textGrey}
            value={password}
            onChangeText={(t) => { setPassword(t); if (errors.password) setErrors((e) => ({ ...e, password: '' })); }}
            secureTextEntry
          />
        </View>
        {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <View style={[styles.box, styles.secondBox]}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={colors.textGrey}
            value={confirm}
            onChangeText={(t) => { setConfirm(t); if (errors.confirm) setErrors((e) => ({ ...e, confirm: '' })); }}
            secureTextEntry
          />
        </View>
        {!!errors.confirm && <Text style={styles.errorText}>{errors.confirm}</Text>}

        <Button label="Reset Password" onPress={handleReset} style={styles.button} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { flexGrow: 1, paddingHorizontal: layout.screenPadding, paddingBottom: spacing.xxxl },
  title: {
    fontSize: fontSize.heading1,
    lineHeight: lineHeight.heading1,
    fontFamily: fontFamily.medium,
    color: colors.black,
    marginTop: layout.newPwTitleTop,
  },
  subtitle: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.paragraph,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: layout.newPwSubtitleGap,
    marginLeft: layout.idTitleLeft,
  },
  box: {
    width: layout.resetBoxWidth,
    height: layout.resetBoxHeight,
    marginLeft: layout.resetBoxLeft,
    borderWidth: layout.resetBoxBorder,
    borderColor: colors.inputOutline,
    justifyContent: 'center',
  },
  firstBox: { marginTop: layout.newPwBoxGap },
  secondBox: { marginTop: layout.resetBoxSpacing },
  input: {
    height: lineHeight.phoneRow,
    marginLeft: layout.resetTextLeft,
    padding: 0,
    borderWidth: 0,
    fontSize: fontSize.large,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
    outlineStyle: 'none',
  } as any,
  errorText: { fontSize: fontSize.small, fontFamily: fontFamily.regular, color: colors.red, marginTop: spacing.xs },
  button: {
    alignSelf: 'flex-end',
    width: layout.newPwButtonWidth,
    paddingHorizontal: 0,
    marginTop: layout.newPwButtonGap,
  },
});
