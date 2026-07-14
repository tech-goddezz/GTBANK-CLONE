// app/(auth)/requirements.tsx
// Shown right after OTP verification. Tells the user what's coming next
// (DOB, address, identity check) before we ask for any of it — reduces
// the "why are you asking me this" friction of a cold form.

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import Button from '../../components/Button';

// Each requirement item is intentionally just data — if the bank ever adds
// or removes a KYC step, this array is the only thing that needs editing.
const requirements = [
  {
    icon: 'calendar-outline' as const,
    title: 'Date of birth',
    subtitle: 'Confirm you meet the minimum age requirement',
  },
  {
    icon: 'card-outline' as const,
    title: 'BVN/NIN',
    subtitle: 'Your bank verification or national ID number',
  },
  {
    icon: 'location-outline' as const,
    title: 'Residential address',
    subtitle: 'Where you currently live',
  },
  {
    icon: 'finger-print-outline' as const,
    title: 'Identity verification',
    subtitle: 'A quick selfie to confirm it\'s really you',
  },
];

export default function RequirementsScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/(auth)/date-of-birth');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scroll}
    >
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="arrow-back" size={24} color={colors.textDark} />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Open a GTBank{'\n'}Account</Text>
        <Text style={styles.subtitle}>
          Please verify the list of requirements before proceeding
        </Text>
      </View>

      {/* "Requirements" section label with its "0/4 ready" counter - present
          in the design just above the checklist, was missing entirely before. */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionLabel}>Requirements</Text>
        <Text style={styles.sectionCounter}>0/{requirements.length} ready</Text>
      </View>

      {/* Checklist */}
      <View style={styles.list}>
        {requirements.map((item) => (
          <View key={item.title} style={styles.listItem}>
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon} size={20} color={colors.orange} />
            </View>
            <View style={styles.listItemText}>
              <Text style={styles.listItemTitle}>{item.title}</Text>
              <Text style={styles.listItemSubtitle}>{item.subtitle}</Text>
            </View>
            {/* Green checkmark signals "this is required", not "already done" —
                a first-time user hasn't completed any of these yet. We're using
                it here to match the Figma design, which uses it as a bullet
                marker rather than a completion indicator. */}
            <Ionicons name="checkmark-circle" size={22} color={colors.green} />
          </View>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.buttonArea}>
        <Button label="Get Account" onPress={handleContinue} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
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
  header: {
    marginBottom: spacing.xxxl,
  },
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
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.semibold,
    color: colors.textDark,
  },
  sectionCounter: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.medium,
    color: colors.textGrey,
  },
  list: {
    gap: spacing.lg,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.pageBackground,
    borderRadius: radius.card,
    padding: spacing.lg,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.orangeFaint,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  listItemText: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.semibold,
    color: colors.textDark,
    marginBottom: 2,
  },
  listItemSubtitle: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  buttonArea: {
    marginTop: spacing.xxxl,
  },
});