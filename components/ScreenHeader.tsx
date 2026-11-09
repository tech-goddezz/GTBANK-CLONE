// components/ScreenHeader.tsx
//
// The two white strips at the top of most in-app screens:
//   - top strip: optional back arrow, title, subtitle, and the bell on the right
//   - second strip: the small menu icon
// Screens that show something other than the bell pass it in as `right`.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import colors from '../constants/colors';
import { fontSize, fontFamily, spacing } from '../constants/typography';
import { layout } from '../constants/layout';
import { headerIcons } from '../constants/headerIcons';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  // Tab pages like History have no back arrow.
  showBack?: boolean;
  onBack?: () => void;
  onBellPress?: () => void;
  // Replaces the bell, e.g. the + on Complaints.
  right?: React.ReactNode;
  // Small orange number on the bell (only the Notification page uses it).
  bellBadge?: number;
}

function HeaderIcon({ icon, color }: { icon: keyof typeof headerIcons; color: string }) {
  const { width, height, path, fillRule } = headerIcons[icon];
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Path d={path} fill={color} fillRule={fillRule} />
    </Svg>
  );
}

export default function ScreenHeader({
  title,
  subtitle,
  showBack = true,
  onBack,
  onBellPress,
  right,
  bellBadge,
}: ScreenHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, layout.statusBarHeight) }]}>
      <View style={styles.topStrip}>
        {showBack && (
          <TouchableOpacity
            style={styles.back}
            onPress={onBack ?? (() => router.back())}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <HeaderIcon icon="back" color={colors.black} />
          </TouchableOpacity>
        )}

        <View style={[styles.titleBlock, showBack && styles.titleBlockWithBack]}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {!!subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
        </View>

        <View style={styles.right}>
          {right ?? (
            <TouchableOpacity
              onPress={onBellPress}
              disabled={!onBellPress}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <HeaderIcon icon="bell" color={colors.textDark} />
              {!!bellBadge && (
                <View style={styles.badge} pointerEvents="none">
                  <Text style={styles.badgeText}>{bellBadge}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* The design doesn't say what this opens, so for now it's only shown. */}
      <View style={styles.menuStrip}>
        <HeaderIcon icon="menu" color={colors.headerMenuIcon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  topStrip: {
    height: layout.headerHeight,
    borderBottomWidth: 1,
    borderBottomColor: colors.headerDivider,
  },
  back: {
    position: 'absolute',
    left: 22,
    top: 27,
  },
  titleBlock: {
    paddingTop: spacing.xs,
    paddingLeft: 22,
    paddingRight: 44, // Room up to just before the bell (some subtitles run close to it)
  },
  titleBlockWithBack: {
    paddingLeft: 41,
  },
  title: {
    fontSize: fontSize.heading2,
    lineHeight: 30,
    fontFamily: fontFamily.medium,
    color: colors.black,
  },
  subtitle: {
    fontSize: fontSize.body,
    lineHeight: 18,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: 8,
  },
  right: {
    position: 'absolute',
    right: 22,
    top: 25,
  },
  badge: {
    position: 'absolute',
    left: layout.headerBadgeLeft,
    top: layout.headerBadgeTop,
    width: layout.headerBadge,
    height: layout.headerBadge,
    borderRadius: layout.headerBadge / 2,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: fontSize.small,
    lineHeight: layout.headerBadge,
    fontFamily: fontFamily.medium,
    color: colors.white,
  },
  menuStrip: {
    height: layout.headerMenuHeight,
    justifyContent: 'center',
    paddingLeft: 20,
  },
});
