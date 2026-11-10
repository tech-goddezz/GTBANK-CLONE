// app/(tabs)/transfer-flow/select.tsx
//
// "Select Transfers" (S79/S80 in "Dashboard flow + transfer flow.pdf"): a switch
// between Individual transfers (S79) and Group transfers (S80), each with two
// "Add … transfers" rows. The rows and the three header icons only show for now:
// the design doesn't say what they open. The "+" on Complaints (S81/S82) opens it.

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import colors from '../../../constants/colors';
import { fontSize, fontFamily, lineHeight } from '../../../constants/typography';
import { layout } from '../../../constants/layout';
import { selectIcons } from '../../../constants/selectIcons';
import ScreenHeader from '../../../components/ScreenHeader';

type Kind = 'individual' | 'group';
type Shape = { width: number; height: number; fillRule: 'evenodd' | 'nonzero'; path: string };

function DesignIcon({ icon, color }: { icon: Shape; color: string }) {
  return (
    <Svg width={icon.width} height={icon.height} viewBox={`0 0 ${icon.width} ${icon.height}`}>
      <Path d={icon.path} fill={color} fillRule={icon.fillRule} />
    </Svg>
  );
}

const TABS: { kind: Kind; label: string; width: number; icon: Shape }[] = [
  { kind: 'individual', label: 'Individual transfers', width: layout.selectTabIndividual, icon: selectIcons.personAdd },
  { kind: 'group', label: 'Group transfers', width: layout.selectTabGroup, icon: selectIcons.group },
];

export default function SelectTransfersScreen() {
  const [kind, setKind] = useState<Kind>('individual');
  const picked = TABS.find((t) => t.kind === kind)!;
  const rowLabel = kind === 'individual' ? 'Add individual transfers' : 'Add group transfers';

  // Search, grid-with-plus and three dots take the bell's place (look only)
  const headerIcons = (
    <View style={styles.headerIcons}>
      <DesignIcon icon={selectIcons.search} color={colors.textDark} />
      <View style={{ marginLeft: layout.selectHeaderSearchGap }}>
        <DesignIcon icon={selectIcons.gridPlus} color={colors.textDark} />
      </View>
      <View style={{ marginLeft: layout.selectHeaderGridGap }}>
        <DesignIcon icon={selectIcons.more} color={colors.textLightDark} />
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Select Transfers"
        subtitle="Choose your transfer options here."
        right={headerIcons}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.pill}>
          {TABS.map((tab) => {
            const active = tab.kind === kind;
            return (
              <TouchableOpacity
                key={tab.kind}
                style={[styles.tab, { width: tab.width }, active && styles.tabActive]}
                onPress={() => setKind(tab.kind)}
                activeOpacity={0.8}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
              >
                <View style={[styles.circle, { backgroundColor: active ? colors.orange : colors.sendCircle }]}>
                  <DesignIcon icon={tab.icon} color={colors.white} />
                </View>
                <Text style={[styles.tabText, active && styles.tabTextActive]} numberOfLines={1}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {[0, 1].map((i) => (
          <View key={i} style={[styles.row, i > 0 && styles.rowGap]}>
            <View style={[styles.circle, { backgroundColor: colors.orange }]}>
              <DesignIcon icon={picked.icon} color={colors.white} />
            </View>
            <Text style={styles.rowText} numberOfLines={1}>{rowLabel}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: layout.selectHeaderRightShift,
  },
  scroll: {
    paddingTop: layout.selectPillTop,
    paddingBottom: layout.tabBarHeight,
  },
  pill: {
    height: layout.selectPillHeight,
    marginHorizontal: layout.selectPillSide,
    padding: layout.selectPillPad,
    flexDirection: 'row',
    gap: layout.selectTabGap,
    borderRadius: layout.selectPillHeight / 2,
    backgroundColor: colors.inputBackground,
  },
  tab: {
    height: layout.selectTabHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: layout.selectTabCirclePad,
    borderRadius: layout.selectTabHeight / 2,
  },
  tabActive: {
    backgroundColor: colors.white,
    // Faint shadow under the picked tab
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  circle: {
    width: layout.selectCircle,
    height: layout.selectCircle,
    borderRadius: layout.selectCircle / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    marginLeft: layout.selectTabTextGap,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  tabTextActive: { color: colors.textLightDark },
  row: {
    height: layout.selectRowHeight,
    marginTop: layout.selectRowsTop,
    marginHorizontal: layout.selectRowSide,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: layout.selectRowPadLeft,
    backgroundColor: colors.inputBackground,
  },
  rowGap: { marginTop: layout.selectRowGap },
  rowText: {
    marginLeft: layout.selectRowTextGap,
    fontSize: fontSize.large,
    fontFamily: fontFamily.regular,
    color: colors.textLightDark,
  },
});
