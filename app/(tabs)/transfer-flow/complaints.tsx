// app/(tabs)/transfer-flow/complaints.tsx
//
// "Complaints" (S81/S82 in "Dashboard flow + transfer flow.pdf").
//   S81: five "Upload transfers" rows, then Complaint Form and Call a Representative.
//   S82: the empty version, only the header. Open it with ?empty=1.
// The + opens Select Transfers. The rows only show for now: the design doesn't say
// what they do. Complaint Form will open S83 and Call a Representative S84 once
// those screens are built; until then they do nothing.

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import colors from '../../../constants/colors';
import { fontSize, fontFamily, lineHeight } from '../../../constants/typography';
import { layout } from '../../../constants/layout';
import { selectIcons } from '../../../constants/selectIcons';
import { complaintIcons } from '../../../constants/complaintIcons';
import ScreenHeader from '../../../components/ScreenHeader';
import Button from '../../../components/Button';

type Shape = { width: number; height: number; fillRule: 'evenodd' | 'nonzero'; path: string };

function DesignIcon({ icon, color }: { icon: Shape; color: string }) {
  return (
    <Svg width={icon.width} height={icon.height} viewBox={`0 0 ${icon.width} ${icon.height}`}>
      <Path d={icon.path} fill={color} fillRule={icon.fillRule} />
    </Svg>
  );
}

const ROW_COUNT = 5;

export default function ComplaintsScreen() {
  const router = useRouter();
  const { empty } = useLocalSearchParams<{ empty?: string }>();
  const isEmpty = empty === '1';

  const plus = (
    <TouchableOpacity
      style={styles.plus}
      onPress={() => router.push('/transfer-flow/select')}
      accessibilityRole="button"
      accessibilityLabel="Add transfers"
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      <DesignIcon icon={complaintIcons.plus} color={colors.textDark} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Complaints" subtitle="Review your transfer processes here." right={plus} />

      {!isEmpty && (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.intro}>Upload screenshots of your transfers that are pending here.</Text>

          {Array.from({ length: ROW_COUNT }).map((_, i) => (
            <View key={i} style={[styles.row, i === 0 ? styles.firstRow : styles.rowGap]}>
              <View style={styles.circle}>
                <DesignIcon icon={selectIcons.group} color={colors.white} />
              </View>
              <Text style={styles.rowText} numberOfLines={1}>Upload transfers</Text>
              <DesignIcon icon={complaintIcons.download} color={colors.textDark} />
            </View>
          ))}

          <View style={styles.buttons}>
            <Button label="Complaint Form" onPress={() => {}} />
            <Button
              label="Call a Representative"
              variant="secondary"
              onPress={() => {}}
              style={styles.call}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  plus: {
    marginTop: layout.complaintPlusTop,
    marginRight: layout.complaintPlusRight,
  },
  scroll: {
    paddingTop: layout.complaintIntroTop,
    paddingBottom: layout.tabBarHeight,
  },
  intro: {
    marginHorizontal: layout.complaintIntroSide,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  row: {
    height: layout.complaintRowHeight,
    marginLeft: layout.complaintRowLeft,
    marginRight: layout.complaintRowRight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: layout.complaintRowPadLeft,
    paddingRight: layout.complaintRowPadRight,
    backgroundColor: colors.inputBackground,
  },
  firstRow: { marginTop: layout.complaintRowsTop },
  rowGap: { marginTop: layout.complaintRowGap },
  circle: {
    width: layout.selectCircle,
    height: layout.selectCircle,
    borderRadius: layout.selectCircle / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.orange,
  },
  rowText: {
    flex: 1,
    marginLeft: layout.complaintRowTextGap,
    fontSize: fontSize.large,
    fontFamily: fontFamily.regular,
    color: colors.textLightDark,
  },
  buttons: {
    marginTop: layout.complaintButtonsTop,
    marginHorizontal: layout.complaintButtonSide,
  },
  // Orange border sits just outside the normal button width, as in the design
  call: {
    marginTop: layout.complaintCallTop,
    marginHorizontal: -1,
    height: layout.complaintCallHeight,
  },
});
