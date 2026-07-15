// Checklist of what the reset flow requires — matches Figma exactly.
// User sees this before any data is entered, setting expectations upfront.

import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';

const STEPS = [
  'Reset Password',
  '6-Digit Verification Code',
  'Identity Verification',
  'Create New Password',
  'Password Updated',
];

export default function ForgotRequirementsScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={colors.textDark} />
      </TouchableOpacity>

      <Text style={styles.title}>Open a GTBank Account</Text>
      <Text style={styles.subtitle}>
        Please verify the list of requirements before proceeding
      </Text>

      <Text style={styles.sectionLabel}>Requirements</Text>

      <View style={styles.list}>
        {STEPS.map((step, index) => (
          <View key={step} style={styles.listItem}>
            <Text style={styles.listIndex}>{index + 1}</Text>
            <Text style={styles.listLabel}>{step}</Text>
            <View style={styles.circleCheck}>
              <Ionicons name="ellipse-outline" size={20} color={colors.borderLight} />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.buttonWrap}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(forgot-password)/reset-password')}
        >
          <Text style={styles.buttonText}>Proceed</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  backButton: { marginTop: 56, marginBottom: spacing.xl, width: 40, height: 40, justifyContent: 'center' },
  title: { fontSize: fontSize.heading1, fontFamily: fontFamily.bold, color: colors.textDark, marginBottom: spacing.sm },
  subtitle: { fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textGrey, marginBottom: spacing.xl, lineHeight: 22 },
  sectionLabel: { fontSize: fontSize.body, fontFamily: fontFamily.semibold, color: colors.textDark, marginBottom: spacing.md },
  list: { gap: spacing.sm },
  listItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.md, paddingHorizontal: spacing.lg,
    backgroundColor: colors.pageBackground, borderRadius: radius.card,
    gap: spacing.md,
  },
  listIndex: { fontSize: fontSize.small, fontFamily: fontFamily.medium, color: colors.textGrey, width: 16 },
  listLabel: { flex: 1, fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textDark },
  circleCheck: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  buttonWrap: { alignItems: 'flex-end', marginTop: spacing.xxxl },
  button: {
    backgroundColor: colors.orange, paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md, borderRadius: radius.button,
  },
  buttonText: { fontSize: fontSize.body, fontFamily: fontFamily.semibold, color: colors.white },
});