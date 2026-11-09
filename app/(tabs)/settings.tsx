// app/(tabs)/settings.tsx
// The Settings tab (S37 in "Dashboard flow + transfer flow.pdf").
//
// Log Out is fully real: signs out, clears useAuthStore and sends the user back
// to onboarding (the design's log-out pop-up, S117, comes later).
// Reset Transaction Pin and Biometrics don't open anything yet — their screens
// (S111, S115) haven't been built. The two switches only change how they look.

import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ImageSourcePropType } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius, letterSpacing } from '../../constants/typography';
import { layout } from '../../constants/layout';
import { cardIcons } from '../../constants/cardIcons';
import { useAuthStore } from '../../store/useAuthStore';
import { signOutUser } from '../../services/auth';
import ScreenHeader from '../../components/ScreenHeader';

interface SettingsRowProps {
  icon: ImageSourcePropType;
  label: string;
  onPress?: () => void;
  danger?: boolean;
}

// One white row: picture icon, spaced-out label, small arrow.
function SettingsRow({ icon, label, onPress, danger }: SettingsRowProps) {
  const arrow = cardIcons.rowArrow;
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Image source={icon} style={styles.rowIcon} />
      <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]} numberOfLines={1}>
        {label}
      </Text>
      <Svg width={arrow.width} height={arrow.height} viewBox={`0 0 ${arrow.width} ${arrow.height}`}>
        <Path d={arrow.path} fill={colors.cardArrow} fillRule={arrow.fillRule} />
      </Svg>
    </TouchableOpacity>
  );
}

// The design's switch: orange with a white knob when on; grey with an outline
// and a small grey knob when off.
function DesignSwitch({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <TouchableOpacity
      style={[styles.switchTrack, value ? styles.switchTrackOn : styles.switchTrackOff]}
      onPress={() => onChange(!value)}
      activeOpacity={0.8}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
    >
      <View style={value ? styles.switchKnobOn : styles.switchKnobOff} />
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  // Look-only for now: they flip, but don't save or change anything else.
  const [privateProfile, setPrivateProfile] = useState(true);
  const [showProgress, setShowProgress] = useState(false);

  const handleLogout = async () => {
  await signOutUser();
  logout();
  router.replace('/onboarding');
};

  const switches = [
    { label: 'Private profile', value: privateProfile, onChange: setPrivateProfile },
    { label: 'Show progress', value: showProgress, onChange: setShowProgress },
  ];

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Settings"
        subtitle="Review and manage your financial activity."
        showBack={false}
        onBellPress={() => router.push('/(tabs)/notifications')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.rows}>
          <SettingsRow
            icon={require('../../assets/images/settings-mpin.png')}
            label="Change mPin"
            onPress={() => router.push('/(settings)/change-mpin')}
          />
          <SettingsRow
            icon={require('../../assets/images/settings-mpin.png')}
            label="Change Transaction Pin"
            onPress={() => router.push('/(settings)/change-transaction-pin')}
          />
          <SettingsRow icon={require('../../assets/images/settings-reset-pin.png')} label="Reset Transaction Pin" />
          <SettingsRow
            icon={require('../../assets/images/settings-card.png')}
            label="Card Management"
            onPress={() => router.push('/(tabs)/cards')}
          />
          <SettingsRow
            icon={require('../../assets/images/settings-account.png')}
            label="Account Settings"
            onPress={() => router.push('/(auth)/personal-info')}
          />
          <SettingsRow icon={require('../../assets/images/settings-biometrics.png')} label="Biometrics" />
          <SettingsRow
            icon={require('../../assets/images/settings-logout.png')}
            label="Log  Out"
            onPress={handleLogout}
            danger
          />
        </View>

        <View style={styles.panel}>
          {switches.map((s, i) => (
            <View key={s.label}>
              <View style={[styles.switchRow, { marginTop: i === 0 ? layout.settingsSwitchFirstTop : layout.settingsSwitchTop }]}>
                <Text style={styles.switchLabel}>{s.label}</Text>
                <DesignSwitch value={s.value} onChange={s.onChange} label={s.label} />
              </View>
              <View style={styles.panelLine} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.pageBackground },
  scrollContent: { paddingBottom: spacing.xxxl },

  rows: {
    marginTop: layout.settingsListTop,
    marginHorizontal: layout.settingsRowSide,
    gap: layout.settingsRowGap,
  },
  row: {
    height: layout.settingsRowHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: layout.settingsIconLeft,
    paddingRight: layout.settingsArrowRight,
    backgroundColor: colors.white,
    // Soft shadow all round, as in the design
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  rowIcon: { width: layout.settingsIcon, height: layout.settingsIcon },
  rowLabel: {
    flex: 1,
    marginLeft: layout.settingsLabelGap,
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    letterSpacing: letterSpacing.settingsRow,
    color: colors.black,
  },
  rowLabelDanger: { color: colors.redBright },

  panel: {
    marginTop: layout.settingsPanelTop,
    marginHorizontal: layout.settingsPanelSide,
    backgroundColor: colors.settingsPanel,
    borderRadius: radius.card,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.settingsPanelPadding,
  },
  switchLabel: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.poppinsMedium,
    color: colors.textCharcoal,
  },
  panelLine: {
    height: layout.settingsLine,
    marginTop: layout.settingsSwitchLineGap,
    backgroundColor: colors.settingsLine,
  },

  switchTrack: {
    width: layout.switchWidth,
    height: layout.switchHeight,
    borderRadius: radius.pill,
    justifyContent: 'center',
  },
  switchTrackOn: {
    backgroundColor: colors.orange,
    alignItems: 'flex-end',
    paddingRight: (layout.switchHeight - layout.switchKnobOn) / 2,
  },
  switchTrackOff: {
    backgroundColor: colors.switchOffTrack,
    borderWidth: layout.switchOutline,
    borderColor: colors.switchOffOutline,
    alignItems: 'flex-start',
    paddingLeft: (layout.switchHeight - layout.switchKnobOff) / 2 - layout.switchOutline,
  },
  switchKnobOn: {
    width: layout.switchKnobOn,
    height: layout.switchKnobOn,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  switchKnobOff: {
    width: layout.switchKnobOff,
    height: layout.switchKnobOff,
    borderRadius: radius.pill,
    backgroundColor: colors.switchOffOutline,
  },
});
