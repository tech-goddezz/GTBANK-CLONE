// components/TransferSteps.tsx
//
// The white panel of progress steps used on the transfer tracking pages
// ("In Transit via NIBSS" S68, "Query" S73). Each step has a circle, two lines
// of text and a faint line under it, and thin orange lines join the circles:
//   done    = orange circle with a 3D tick
//   current = purple circle (the step happening now)
//   pending = grey circle (not reached yet)

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import colors from '../constants/colors';
import { fontSize, fontFamily } from '../constants/typography';
import { layout } from '../constants/layout';

export type StepState = 'done' | 'current' | 'pending';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// "May 24,2026. 9:11AM", written the way the design writes it
export const formatTransferDateTime = (d: Date) => {
  const h = d.getHours() % 12 || 12;
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = d.getHours() < 12 ? 'AM' : 'PM';
  return `${MONTHS[d.getMonth()]} ${d.getDate()},${d.getFullYear()}. ${h}:${m}${ampm}`;
};

// One step: circle, two lines of text, faint line under
export function TransferStep({ state, title, sub, last }: {
  state: StepState; title: string; sub: string; last?: boolean;
}) {
  return (
    <View style={[styles.step, !last && styles.stepGap]}>
      <View style={styles.dotColumn}>
        <View
          style={[
            styles.dot,
            state === 'done' && styles.dotDone,
            state === 'current' && styles.dotCurrent,
            state === 'pending' && styles.dotPending,
          ]}
        >
          {state === 'done' ? (
            <Image
              source={require('../assets/images/transfer-success-tick.png')}
              style={styles.dotTick}
            />
          ) : (
            <View style={[styles.dotInner, state === 'current' && styles.dotInnerCurrent]} />
          )}
        </View>
        {!last && <View style={styles.connector} />}
      </View>
      <View style={styles.stepText}>
        <Text style={[styles.stepTitle, state !== 'pending' && styles.stepTitleBold]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.stepSub} numberOfLines={1}>{sub}</Text>
      </View>
    </View>
  );
}

// The white panel the steps sit in
export function TransferStepsPanel({ style, children }: { style?: object; children: React.ReactNode }) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  panel: {
    paddingTop: layout.transitPanelPadTop,
    paddingBottom: layout.transitPanelPadBottom,
    paddingHorizontal: layout.transitPanelSide,
    backgroundColor: colors.white,
    // Very soft shadow, the same as the other transfer panels
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 17,
    elevation: 3,
  },
  step: { flexDirection: 'row' },
  stepGap: { marginBottom: layout.transitStepGap },
  dotColumn: { width: layout.transitDot, marginRight: layout.transitDotTextGap },
  dot: {
    marginTop: layout.transitDotTop,
    width: layout.transitDot,
    height: layout.transitDot,
    borderRadius: layout.transitDot / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: { backgroundColor: colors.orange },
  dotCurrent: { backgroundColor: colors.stepCurrent },
  dotPending: { backgroundColor: colors.stepPending },
  dotTick: { width: layout.transitDotTick, height: layout.transitDotTick },
  dotInner: {
    width: layout.transitDotInner,
    height: layout.transitDotInner,
    borderRadius: layout.transitDotInner / 2,
    backgroundColor: colors.white,
  },
  dotInnerCurrent: {
    position: 'absolute',
    top: layout.transitDotInnerOffset,
    left: layout.transitDotInnerOffset,
  },
  connector: {
    position: 'absolute',
    top: layout.transitConnectorTop,
    left: (layout.transitDot - layout.transitConnectorWidth) / 2,
    width: layout.transitConnectorWidth,
    height: layout.transitConnectorHeight,
    backgroundColor: colors.amber,
  },
  stepText: {
    flex: 1,
    height: layout.transitStepTextHeight,
    borderBottomWidth: layout.confirmRowLine,
    borderBottomColor: colors.stepDivider,
  },
  stepTitle: {
    fontSize: fontSize.body,
    lineHeight: layout.transitStepLineHeight,
    fontFamily: fontFamily.regular,
    color: colors.textCharcoal,
  },
  stepTitleBold: { fontFamily: fontFamily.bold },
  stepSub: {
    fontSize: fontSize.body,
    lineHeight: layout.transitStepLineHeight,
    fontFamily: fontFamily.regular,
    color: colors.textCharcoal,
  },
});
