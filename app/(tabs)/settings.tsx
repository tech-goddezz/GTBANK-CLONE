// app/(tabs)/settings.tsx
// Full settings screen. Biometrics toggle is local UI state (no real
// biometric API wired in — that needs expo-local-authentication, a
// separate step). Log Out is fully real: clears useAuthStore and sends
// the user back to onboarding. Card Management row is real navigation.
// The remaining rows are visual-only for now — see note below.

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import { useAuthStore } from '../../store/useAuthStore';
import { signOutUser } from '../../services/auth';

interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  danger?: boolean;
}

// One reusable row component instead of repeating the same JSX 8 times —
// each row is just data (icon + label + what happens on tap).
function SettingsRow({ icon, label, onPress, danger }: SettingsRowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.rowLeft}>
        <Ionicons
          name={icon}
          size={20}
          color={danger ? colors.red : colors.white}
        />
        <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>
          {label}
        </Text>
      </View>
      {!danger && (
        <Ionicons name="chevron-forward" size={18} color={colors.textFaded} />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  // Local-only for now — flip visually, doesn't persist or touch a real
  // device biometric API yet. Wiring the real thing needs
  // expo-local-authentication, which is a reasonable next step later.
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [showProgress, setShowProgress] = useState(true);

  const handleLogout = async () => {
  await signOutUser();
  logout();
  router.replace('/onboarding');
};

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>

      <View style={styles.section}>
        <SettingsRow
          icon="lock-closed-outline"
          label="Change PIN"
          onPress={() => router.push('/(settings)/change-mpin')}
        />
        <SettingsRow
          icon="keypad-outline"
          label="Change Transaction Pin"
          onPress={() => router.push('/(settings)/change-transaction-pin')}
        />
        <SettingsRow
  icon="flag-outline"
  label="Report Transaction"
  onPress={() => router.push('/(tabs)/report-transaction')}
/>
        <SettingsRow
  icon="card-outline"
  label="Card Management"
  onPress={() => router.push('/(tabs)/cards')}
/>
        <SettingsRow
  icon="person-circle-outline"
  label="Account Settings"
  onPress={() => router.push('/(auth)/personal-info')}
/>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="finger-print-outline" size={20} color={colors.textDark} />
            <Text style={styles.rowLabel}>Biometrics</Text>
          </View>
          <Switch
            value={biometricsEnabled}
            onValueChange={setBiometricsEnabled}
            trackColor={{ false: colors.borderLight, true: colors.orange }}
            thumbColor={colors.white}
          />
        </View>

        <SettingsRow icon="person-outline" label="Your profile" onPress={() => router.push('/(auth)/personal-info')} />

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="stats-chart-outline" size={20} color={colors.textDark} />
            <Text style={styles.rowLabel}>Show progress</Text>
          </View>
          <Switch
            value={showProgress}
            onValueChange={setShowProgress}
            trackColor={{ false: colors.borderLight, true: colors.orange }}
            thumbColor={colors.white}
          />
        </View>

        <SettingsRow
          icon="help-circle-outline"
          label="Get Help"
          onPress={() => router.push('/(settings)/get-help')}
        />
      </View>

      <View style={styles.section}>
        <SettingsRow
          icon="log-out-outline"
          label="Log Out"
          onPress={handleLogout}
          danger
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.darkNavy },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  header: { marginTop: 56, marginBottom: spacing.xl },
  title: {
    fontSize: fontSize.heading1,
    fontFamily: fontFamily.bold,
    color: colors.white,
  },
  subtitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.base,
    marginTop: spacing.xs,
  },
  section: {
    backgroundColor: colors.navyCard,
    borderRadius: radius.card,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowLabel: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.white,
  },
  rowLabelDanger: {
    color: colors.red,
    fontFamily: fontFamily.medium,
  },
});
