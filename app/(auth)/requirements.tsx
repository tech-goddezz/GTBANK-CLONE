// app/(auth)/requirements.tsx
// Shown right after login. Matches the Figma frame: a single bordered
// list box holding all 4 requirements (no separate cards, no subtitles,
// no colored icons) — each row shows an outlined "not done" icon until
// that step is completed, then a filled green checkmark. Tapping a row
// jumps into that step. "Get Account" only proceeds once all 4 are done.

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
import { useKycStore } from '../../store/useKycStore';

export default function RequirementsScreen() {
  const router = useRouter();
  const { dateOfBirthDone, bvnNinDone, addressDone, identityDone } = useKycStore();

  // Each requirement is data — title, whether it's done, and where tapping
  // it should go. If the bank ever adds/removes a KYC step, this array is
  // the only thing that needs editing.
  const requirements = [
    {
      key: 'dob',
      title: 'Date of birth',
      done: dateOfBirthDone,
      route: '/(auth)/date-of-birth' as const,
    },
    {
      key: 'bvn',
      title: 'BVN/NIN',
      done: bvnNinDone,
      route: '/(auth)/bvn-nin' as const,
    },
    {
      key: 'address',
      title: 'Residential address',
      done: addressDone,
      route: '/(auth)/address' as const,
    },
    {
      key: 'identity',
      title: 'Identity verification',
      done: identityDone,
      route: '/(auth)/identity' as const,
    },
  ];

  const readyCount = requirements.filter((r) => r.done).length;
  const allDone = readyCount === requirements.length;

  const handleGetAccount = () => {
    if (!allDone) return;
    router.push('/(auth)/success');
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
        <Text style={styles.title}>Open a GTBank Account</Text>
        <Text style={styles.subtitle}>
          Please verify the list of requirements before proceeding
        </Text>
      </View>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionLabel}>Requirements</Text>
        <Text style={styles.sectionCounter}>
          {readyCount}/{requirements.length} ready
        </Text>
      </View>

      {/* Single bordered list box — one rectangle holding all 4 rows,
          per the Figma frame, not separate cards. */}
      <View style={styles.listBox}>
        {requirements.map((item, index) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.listRow,
              index < requirements.length - 1 && styles.listRowDivider,
            ]}
            onPress={() => router.push(item.route)}
            activeOpacity={0.6}
            accessibilityRole="button"
            accessibilityLabel={`${item.title}, ${item.done ? 'completed' : 'not completed'}`}
          >
            <Text style={styles.listRowText}>{item.title}</Text>
            <Ionicons
              name={item.done ? 'checkmark-circle' : 'close-circle-outline'}
              size={20}
              color={item.done ? colors.green : colors.textFaded}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* CTA — compact, right-aligned; disabled until every step is done */}
      <View style={styles.buttonArea}>
        <Button
          label="Get Account"
          onPress={handleGetAccount}
          disabled={!allDone}
          style={styles.compactButton}
        />
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
    marginTop: 70,
    marginBottom: spacing.xxl,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xxxl,
  },
  title: {
    fontSize: 26,
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
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: fontSize.heading2,
    fontFamily: fontFamily.semibold,
    color: colors.textDark,
  },
  sectionCounter: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.medium,
    color: colors.textGrey,
  },
  listBox: {
    borderWidth: 1,
    borderColor: colors.dark,
    borderRadius: 7,
    overflow: 'hidden',
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  listRowDivider: {
    borderBottomWidth: 0,
    borderBottomColor: colors.borderLight,
  },
  listRowText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
  },
  buttonArea: {
    marginTop: spacing.xxxl + 170,
    alignItems: 'flex-end',
  },
  compactButton: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.sm - 5,
    borderRadius: spacing.xl - 20,
    height: 44,
  },
});