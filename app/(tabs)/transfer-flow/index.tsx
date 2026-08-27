// app/(tabs)/transfer-flow/index.tsx
// Transfer landing — shows the "Quickly Transfer" CTA and option to
// select GT Bank or Other Banks.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../../constants/typography';

export default function TransferLandingScreen() {
  const router = useRouter();
  const [showOptions, setShowOptions] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transfers</Text>
        <Text style={styles.subtitle}>Send money instantly to any account</Text>
      </View>

      {/* Illustration placeholder */}
      <View style={styles.illustrationArea}>
        <View style={styles.illustrationCircle}>
          <Ionicons name="swap-horizontal" size={64} color={colors.orange} />
        </View>
        <Text style={styles.illustrationText}>
          Transfer funds to GTBank accounts instantly, or to other banks within seconds.
        </Text>
      </View>

      <View style={styles.buttonArea}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setShowOptions(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Quickly Transfer</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={styles.secondaryButton}
  onPress={() => router.push('/(tabs)/transfer-flow/income-verification')}
>
  <Text style={styles.secondaryButtonText}>Apply for more</Text>
</TouchableOpacity>
      </View>

      {/* Bank type selector sheet */}
      <Modal
        visible={showOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowOptions(false)}
        >
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Select Transfer Type</Text>

            <TouchableOpacity
              style={styles.sheetOption}
              onPress={() => {
                setShowOptions(false);
                router.push('/(tabs)/transfer-flow/details?bank=gtbank');
              }}
            >
              <View style={styles.sheetOptionIcon}>
                <Ionicons name="business-outline" size={22} color={colors.orange} />
              </View>
              <View style={styles.sheetOptionText}>
                <Text style={styles.sheetOptionLabel}>GT Bank</Text>
                <Text style={styles.sheetOptionSub}>Transfer to GTBank accounts</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textFaded} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetOption}
              onPress={() => {
                setShowOptions(false);
                router.push('/(tabs)/transfer-flow/details?bank=other');
              }}
            >
              <View style={styles.sheetOptionIcon}>
                <Ionicons name="swap-horizontal-outline" size={22} color={colors.orange} />
              </View>
              <View style={styles.sheetOptionText}>
                <Text style={styles.sheetOptionLabel}>Other Banks</Text>
                <Text style={styles.sheetOptionSub}>Transfer to any Nigerian bank</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textFaded} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowOptions(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.darkNavy },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
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
  illustrationArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  illustrationCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.orangeFaint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  illustrationText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.base,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonArea: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.orange,
    height: 54,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.semibold,
    color: colors.white,
  },
  secondaryButton: {
    height: 54,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.orange,
  },
  secondaryButtonText: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.semibold,
    color: colors.orange,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  sheetTitle: {
    fontSize: fontSize.heading3,
    fontFamily: fontFamily.semibold,
    color: colors.textDark,
    marginBottom: spacing.lg,
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: spacing.md,
  },
  sheetOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.orangeFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetOptionText: { flex: 1 },
  sheetOptionLabel: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    color: colors.textDark,
  },
  sheetOptionSub: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: 2,
  },
  cancelButton: {
    marginTop: spacing.lg,
    alignItems: 'center',
    padding: spacing.md,
  },
  cancelText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.medium,
    color: colors.textGrey,
  },
});
