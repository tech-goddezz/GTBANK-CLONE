// Password updated confirmation — matches the "Password Updated!" screen in the design.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';

export default function ForgotSuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="checkmark" size={56} color={colors.textDark} />
        </View>

        <Text style={styles.title}>Password Updated!</Text>
        <Text style={styles.subtitle}>
          Your password has been successfully reset. You can now sign in using your new password.
        </Text>
      </View>

      <View style={styles.buttonArea}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/onboarding')}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  iconWrap: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.pageBackground, alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.xl, borderWidth: 2, borderColor: colors.borderLight,
  },
  title: { fontSize: fontSize.heading1, fontFamily: fontFamily.bold, color: colors.textDark, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textGrey, textAlign: 'center', lineHeight: 22 },
  buttonArea: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  button: {
    backgroundColor: colors.orange, height: 54, borderRadius: radius.button,
    alignItems: 'center', justifyContent: 'center',
  },
  buttonText: { fontSize: fontSize.large, fontFamily: fontFamily.semibold, color: colors.white },
});