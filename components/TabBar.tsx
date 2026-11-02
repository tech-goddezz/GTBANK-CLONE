// components/TabBar.tsx
// Custom bottom tab bar with 4 tabs.
// Reads the active route from Expo Router and highlights the right tab orange.
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Svg, { Path } from 'react-native-svg';
import colors from '../constants/colors';
import { fontSize, fontFamily, spacing } from '../constants/typography';
import { layout } from '../constants/layout';
import { tabIcons } from '../constants/tabIcons';

const TAB_CONFIG: Record<string, { label: string; icon: keyof typeof tabIcons; inactiveColor: string }> = {
  home: { label: 'Home', icon: 'home', inactiveColor: colors.textFaded },
  transactions: { label: 'Transactions', icon: 'transactions', inactiveColor: colors.textFaded },
  // The design draws this one icon slightly darker than the others.
  'transfer-flow': { label: 'Transfers', icon: 'transfer-flow', inactiveColor: colors.textGrey },
  settings: { label: 'Settings', icon: 'settings', inactiveColor: colors.textFaded },
};

export default function TabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const config = TAB_CONFIG[route.name];
        if (!config) return null;
        const isActive = state.index === index;
        const icon = tabIcons[config.icon];
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isActive && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        return (
          <TouchableOpacity key={route.key} style={styles.tab} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.iconWrap}>
              <Svg width={icon.width} height={icon.height} viewBox={`0 0 ${icon.width} ${icon.height}`}>
                <Path
                  d={icon.path}
                  fill={isActive ? colors.orangeDark : config.inactiveColor}
                  fillRule={icon.fillRule}
                />
              </Svg>
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>{config.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: layout.tabBarHeight,
    backgroundColor: colors.background,
    paddingHorizontal: layout.tabBarSidePadding,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 25,
  },
  iconWrap: {
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm + 1,
  },
  label: {
    fontSize: fontSize.small,
    lineHeight: 16,
    fontFamily: fontFamily.regular,
    color: colors.textFaded,
  },
  labelActive: {
    color: colors.orangeDark,
  },
});
