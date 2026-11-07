// Checklist of what the reset flow requires — matches the first screen of
// "forget password.pdf". The user sees this before any data is entered,
// setting expectations upfront: one thin black box holding all 5 steps,
// each with a "not done" circle-cross icon, and an orange Proceed button.

import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, lineHeight, radius } from '../../constants/typography';
import { layout } from '../../constants/layout';
import Button from '../../components/Button';

const STEPS = [
  'Reset Password',
  '6-Digit Verification Code',
  'Identity Verification',
  'Create New Password',
  'Password Updated',
];

export default function ForgotRequirementsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.scroll, { paddingTop: Math.max(insets.top, layout.statusBarHeight) }]}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <MaterialIcons name="arrow-back" size={layout.backArrowSize} color={colors.black} />
      </TouchableOpacity>

      <Text style={styles.title}>Open a GTBank Account</Text>
      <Text style={styles.subtitle}>
        Please verify the list of requirements before proceeding
      </Text>

      <View style={styles.headingRow}>
        <Text style={styles.heading}>Requirements</Text>
        <Text style={styles.ready}>0/{STEPS.length} ready</Text>
      </View>

      <View style={styles.list}>
        {STEPS.map((step) => (
          <View key={step} style={styles.row}>
            <Text style={styles.rowLabel}>{step}</Text>
            <MaterialIcons name="highlight-off" size={layout.backArrowSize} color={colors.black} />
          </View>
        ))}
      </View>

      <Button
        label="Proceed"
        onPress={() => router.push('/(forgot-password)/reset-password')}
        style={styles.proceed}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.reqButtonBottom,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: layout.backArrowTop,
    marginLeft: layout.backArrowLeft,
  },
  title: {
    fontSize: fontSize.heading1,
    lineHeight: lineHeight.heading1,
    fontFamily: fontFamily.regular,
    color: colors.black,
    marginTop: layout.codeTitleGap,
  },
  subtitle: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: layout.reqSubtitleGap,
    marginLeft: layout.reqSubtitleLeft,
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: layout.reqHeadingGap,
  },
  heading: {
    fontSize: fontSize.heading2,
    lineHeight: layout.reqHeadingLine,
    fontFamily: fontFamily.poppinsRegular,
    color: colors.black,
  },
  ready: {
    fontSize: fontSize.small,
    lineHeight: lineHeight.compact,
    fontFamily: fontFamily.poppinsMedium,
    color: colors.black,
    marginTop: layout.reqReadyTop,
    marginRight: layout.reqReadyRight,
  },
  list: {
    marginTop: layout.reqListGap,
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: radius.card,
    paddingHorizontal: layout.reqRowPadding,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: layout.reqRowHeight,
  },
  rowLabel: {
    flex: 1,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  proceed: {
    width: layout.phoneProceedWidth,
    alignSelf: 'flex-end',
    marginTop: 'auto',
  },
});
