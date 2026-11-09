// app/(tabs)/transfer-flow/index.tsx
//
// The "Transfers" tab (S36 in "Dashboard flow + transfer flow.pdf"): explains how
// to track a transfer, with the four tracking steps, a ring chart in the step
// colours, the GTBOT and chat buttons, and the Query Transfer button.
//
// The old send-money page that used to live here is now transfer-flow/send.tsx
// (Home → Send opens it).
//
// Check Status opens "Still checking" (S71, checking.tsx). Query Transfer, the
// robot and the chat button don't do anything yet: their screens haven't been
// built (S72–S83 and the GTBOT chat).

import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import colors from '../../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../../constants/typography';
import { layout } from '../../../constants/layout';
import { transferIcons, transferChart } from '../../../constants/transferIcons';
import ScreenHeader from '../../../components/ScreenHeader';

type Shape = { width: number; height: number; path: string; fillRule: 'nonzero' | 'evenodd' };

function DesignIcon({ icon, color, opacity }: { icon: Shape; color: string; opacity?: number }) {
  return (
    <Svg width={icon.width} height={icon.height} viewBox={`0 0 ${icon.width} ${icon.height}`}>
      <Path d={icon.path} fill={color} fillOpacity={opacity} fillRule={icon.fillRule} />
    </Svg>
  );
}

// Initial Transfer opens the send-money page (where a transfer starts). The other
// three open the transfer progress page.
const STEPS = [
  { id: 'initial', label: 'Initial Transfer', color: colors.stepInitial, icon: transferIcons.initial, route: '/(tabs)/transfer-flow/send' },
  { id: 'sent', label: 'Funds Sent', color: colors.stepSent, icon: transferIcons.sent, route: '/(tabs)/transfer-flow/processing' },
  { id: 'transit', label: 'In Transit via NIBSS', color: colors.stepTransit, icon: transferIcons.transit, route: '/(tabs)/transfer-flow/processing' },
  { id: 'credited', label: 'Credited to Recipient', color: colors.stepCredited, icon: transferIcons.credited, route: '/(tabs)/transfer-flow/processing' },
] as const;

const CHART_PIECES = [
  { shape: transferChart.teal, color: colors.stepInitial },
  { shape: transferChart.red, color: colors.stepSent },
  { shape: transferChart.black, color: colors.stepTransit },
  { shape: transferChart.grey, color: colors.chartGrey },
];

export default function TransfersScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Transfers"
        subtitle="Review and manage your financial activity"
        showBack={false}
        onBellPress={() => router.push('/(tabs)/notifications')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.body, styles.intro]}>Be able to know at what point your funds are .</Text>

        <Image
          source={require('../../../assets/images/transfer-steps-banner.png')}
          style={styles.banner}
          resizeMode="stretch"
        />

        <Text style={[styles.body, styles.paragraph]}>
          Track your daily transfers by clicking on each step to know at what point they are, before reaching its destination point.
        </Text>

        {/* White strip with the four steps */}
        <View style={styles.strip}>
          {STEPS.map((step, i) => (
            <TouchableOpacity
              key={step.id}
              style={[styles.step, { left: layout.trackStepCentres[i] - layout.trackStepWidth / 2 }]}
              onPress={() => router.push(step.route)}
              activeOpacity={0.7}
            >
              <Text style={styles.stepLabel} numberOfLines={1}>{step.label}</Text>
              <View style={[styles.stepCircle, { backgroundColor: step.color }]}>
                <DesignIcon icon={step.icon} color={colors.white} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.body, styles.note]}>
          NB: The colours here help to indicate where funds are at the time of tracking.
        </Text>

        {/* Ring chart (left) and the GTBOT + chat buttons (right) */}
        <View style={styles.middle}>
          <View style={styles.chart}>
            <Svg width={transferChart.width} height={transferChart.height} viewBox={`0 0 ${transferChart.width} ${transferChart.height}`}>
              {CHART_PIECES.map((piece) => (
                <Path key={piece.color} d={piece.shape.path} fill={piece.color} fillRule={piece.shape.fillRule} />
              ))}
            </Svg>
          </View>

          <View style={styles.sideButtons}>
            <TouchableOpacity style={[styles.sideButton, styles.robotButton]} accessibilityLabel="Chat with GTBOT" activeOpacity={0.7}>
              <Image source={require('../../../assets/images/gtbot-robot.png')} style={styles.robot} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sideButton, styles.chatButton]} accessibilityLabel="Chat" activeOpacity={0.7}>
              <View>
                <DesignIcon icon={transferIcons.chatBubble} color={colors.chatIcon} opacity={0.3} />
                <View style={StyleSheet.absoluteFill}>
                  <DesignIcon icon={transferIcons.chatLines} color={colors.chatIcon} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.body, styles.issues]}>
          Having issues with  a transfer? <Text style={styles.checkStatus} onPress={() => router.push('/transfer-flow/checking')}>Check Status</Text> or Query the transfer process to reverse it automatically.
        </Text>

        <TouchableOpacity style={styles.queryButton} activeOpacity={0.7}>
          <Text style={styles.queryText}>Query Transfer</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.pageBackground },
  scrollContent: { paddingBottom: spacing.xxxl },

  body: {
    fontSize: fontSize.body,
    lineHeight: 18,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginHorizontal: layout.trackSide,
  },
  intro: { lineHeight: 17, marginTop: layout.trackIntroTop },
  banner: {
    marginTop: layout.trackBannerTop,
    marginLeft: layout.trackBannerLeft,
    width: layout.trackBannerWidth,
    height: layout.trackBannerHeight,
  },
  paragraph: { marginTop: layout.trackParagraphTop },

  strip: {
    height: layout.trackStripHeight,
    marginTop: layout.trackStripTop,
    marginHorizontal: layout.trackStripSide,
    backgroundColor: colors.white,
    // Soft shadow all round, as in the design
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  step: {
    position: 'absolute',
    top: layout.trackStepLabelTop,
    width: layout.trackStepWidth,
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: fontSize.stepLabel,
    lineHeight: 8,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  stepCircle: {
    width: layout.trackStepCircle,
    height: layout.trackStepCircle,
    borderRadius: radius.pill,
    marginTop: layout.trackStepCircleGap,
    alignItems: 'center',
    justifyContent: 'center',
  },

  note: {
    marginTop: layout.trackNoteTop,
    marginLeft: layout.trackNoteLeft,
  },

  middle: { height: layout.trackMiddleHeight },
  chart: {
    position: 'absolute',
    left: layout.trackChartLeft,
    top: layout.trackChartTop,
  },
  sideButtons: {
    position: 'absolute',
    left: layout.trackButtonLeft,
    top: layout.trackButtonTop,
    gap: layout.trackButtonGap,
  },
  sideButton: {
    width: layout.trackButtonSize,
    height: layout.trackButtonSize,
    borderRadius: radius.trackButton,
    alignItems: 'center',
    justifyContent: 'center',
    // Soft shadow all round, as in the design
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  robotButton: { backgroundColor: colors.light },
  chatButton: { backgroundColor: colors.white },
  robot: { width: layout.trackRobotWidth, height: layout.trackRobotHeight },

  issues: {},
  checkStatus: { color: colors.orange },

  queryButton: {
    height: layout.trackQueryHeight,
    marginTop: layout.trackQueryTop,
    marginHorizontal: layout.trackQuerySide,
    borderWidth: 1,
    borderColor: colors.redDark,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  queryText: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.regular,
    color: colors.redDark,
  },
});
