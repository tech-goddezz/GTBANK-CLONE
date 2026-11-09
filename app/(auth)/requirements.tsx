// app/(auth)/requirements.tsx
// "Open a GTBank Account" checklist (S21 in Kyc flow.pdf). Same look as the
// forgot-password checklist (S11): white screen, one thin black box holding
// the 4 KYC steps, each with a "not done" circle-cross icon (green tick once
// done). Tapping a row jumps into that step. "Get Account" stays faded until
// all 4 are done.

import React, { useEffect, useState } from 'react';
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
import { useKycStore } from '../../store/useKycStore';
import { useAuthStore } from '../../store/useAuthStore';
import { fetchProfile, getCurrentUserId } from '../../services/auth';

export default function RequirementsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { dateOfBirthDone, bvnNinDone, addressDone, identityDone } = useKycStore();
  const authStoreUserId = useAuthStore((state) => state.user?.id);
  const [userId, setUserId] = useState(authStoreUserId ?? '');
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const resolveUserId = async () => {
      const realId = await getCurrentUserId();
      setUserId(realId);
    };
    resolveUserId();
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      const result = await fetchProfile(userId ?? '');
      if (result.success) {
        setProfile(result.profile);
      }
    };
    loadProfile();
  }, [userId]);

  // Each requirement is data — title, whether it's done, and where tapping
  // it should go. If the bank ever adds/removes a KYC step, this array is
  // the only thing that needs editing.
  const requirements = [
    {
      key: 'dob',
      title: 'Date of birth',
      done: dateOfBirthDone || !!profile?.date_of_birth,
      route: '/(auth)/date-of-birth' as const,
    },
    {
      key: 'bvn',
      title: 'BVN/NIN',
      done: bvnNinDone || !!profile?.bvn || !!profile?.nin,
      route: '/(auth)/bvn-nin' as const,
    },
    {
      key: 'address',
      title: 'Residential address',
      done: addressDone || !!profile?.state,
      route: '/(auth)/address' as const,
    },
    {
      key: 'identity',
      title: 'Identity verification',
      done: identityDone || !!profile?.identity_verified,
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
        <Text style={styles.ready}>
          {readyCount}/{requirements.length} ready
        </Text>
      </View>

      <View style={styles.list}>
        {requirements.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.row}
            onPress={() => router.push(item.route)}
            activeOpacity={0.6}
            accessibilityRole="button"
            accessibilityLabel={`${item.title}, ${item.done ? 'completed' : 'not completed'}`}
          >
            <Text style={styles.rowLabel}>{item.title}</Text>
            <MaterialIcons
              name={item.done ? 'check-circle' : 'highlight-off'}
              size={layout.backArrowSize}
              color={item.done ? colors.greenTick : colors.black}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Button
        label="Get Account"
        onPress={handleGetAccount}
        disabled={!allDone}
        style={styles.getAccount}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.kycButtonBottom,
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
  getAccount: {
    width: layout.kycButtonWidth,
    alignSelf: 'flex-end',
    marginRight: layout.kycButtonRight,
    marginTop: 'auto',
  },
});
