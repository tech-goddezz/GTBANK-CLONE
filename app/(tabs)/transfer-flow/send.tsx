// app/(tabs)/transfer-flow/send.tsx
// Send-money page (Home → Send). Moved here from the Transfers tab, which now
// shows the design's transfer-tracking page. Transfer landing — shows the "Quickly Transfer" CTA and option to
// select GT Bank or Other Banks.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../../constants/typography';
import SelectActionSheet from '../../../components/SelectActionSheet';

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
      <SelectActionSheet
        visible={showOptions}
        onCancel={() => setShowOptions(false)}
        options={[
          {
            label: 'GT Bank',
            onPress: () => {
              setShowOptions(false);
              router.push('/(tabs)/transfer-flow/details?bank=gtbank');
            },
          },
          {
            label: 'Other Banks',
            onPress: () => {
              setShowOptions(false);
              router.push('/(tabs)/transfer-flow/details?bank=other');
            },
          },
        ]}
      />
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
});
