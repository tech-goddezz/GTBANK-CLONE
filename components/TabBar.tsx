// components/TabBar.tsx
// Custom bottom tab bar with 4 tabs.
// Reads the active route from Expo Router and highlights the right tab orange.

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { fontSize, fontFamily, spacing } from '../constants/typography';

// Maps each route name to its label and icon
const TAB_CONFIG: Record<string, { label: string; icon: string; activeIcon: string }> = {
  home: {
    label: 'Home',
    icon: 'home-outline',
    activeIcon: 'home',
  },
  transactions: {
    label: 'Transactions',
    icon: 'list-outline',
    activeIcon: 'list',
  },
  'transfer-flow': {
    label: 'Transfer',
    icon: 'swap-horizontal-outline',
    activeIcon: 'swap-horizontal',
  },
  settings: {
    label: 'Settings',
    icon: 'settings-outline',
    activeIcon: 'settings',
  },
};

export default function TabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const config = TAB_CONFIG[route.name];
        if (!config) return null;

        const isActive = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isActive && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            onPress={onPress}
            activeOpacity={0.7}
          >
            {/* Active tab gets a small orange dot above the icon */}
            {isActive && <View style={styles.activeDot} />}

            <Ionicons
              name={(isActive ? config.activeIcon : config.icon) as any}
              size={24}
              color={isActive ? colors.orange : colors.textGrey}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {config.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingBottom: Platform.OS === 'ios' ? 24 : spacing.md,
    paddingTop: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    gap: 3,
  },
  activeDot: {
    position: 'absolute',
    top: 0,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.orange,
  },
  label: {
    fontSize: fontSize.tiny ?? 10,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  labelActive: {
    fontFamily: fontFamily.semibold,
    color: colors.orange,
  },
});