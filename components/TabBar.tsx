// components/TabBar.tsx
// Custom bottom tab bar with 4 tabs.
// Reads the active route from Expo Router and highlights the right tab orange.
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { fontSize, fontFamily, spacing } from '../constants/typography';

const TAB_CONFIG: Record<string, { label: string; icon: string; activeIcon: string }> = {
  home: { label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  transactions: { label: 'Transactions', icon: 'list-outline', activeIcon: 'list' },
  'transfer-flow': { label: 'Transfer', icon: 'swap-horizontal-outline', activeIcon: 'swap-horizontal' },
  settings: { label: 'Settings', icon: 'settings-outline', activeIcon: 'settings' },
};

export default function TabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const config = TAB_CONFIG[route.name];
        if (!config) return null;
        const isActive = state.index === index;
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isActive && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        return (
          <TouchableOpacity key={route.key} style={styles.tab} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
              <Ionicons
                name={(isActive ? config.activeIcon : config.icon) as any}
                size={22}
                color={isActive ? colors.white : colors.base}
              />
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
    backgroundColor: colors.navyDark,
    borderTopWidth: 2,
    borderTopColor: colors.orange,
    paddingBottom: Platform.OS === 'ios' ? 24 : spacing.md,
    paddingTop: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    gap: 3,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.orange,
  },
  label: {
    fontSize: fontSize.tiny ?? 10,
    fontFamily: fontFamily.regular,
    color: colors.base,
  },
  labelActive: {
    fontFamily: fontFamily.semibold,
    color: colors.orange,
  },
});
