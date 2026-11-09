// app/(tabs)/transfer-flow/query.tsx
//
// Query pages (Dashboard flow + transfer flow.pdf), opened from "Query Transfer"
// on the Transfers tab:
//   Querying NIBSS (S73) → by itself after 5 seconds → Automatic Reversal (S74).
// There is no real NIBSS query: the steps are fixed, and the finished steps
// show the time each page appeared.

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import { fontSize, fontFamily, lineHeight } from '../../../constants/typography';
import { layout } from '../../../constants/layout';
import ScreenHeader from '../../../components/ScreenHeader';
import { TransferStep, TransferStepsPanel, formatTransferDateTime } from '../../../components/TransferSteps';

type Stage = 'query' | 'reversal';

export default function QueryScreen() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('query');
  const [queryTime] = useState(() => formatTransferDateTime(new Date()));
  const [reversalTime, setReversalTime] = useState('');

  // As if NIBSS answered: move on to the reversal page after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setReversalTime(formatTransferDateTime(new Date()));
      setStage('reversal');
    }, layout.reversalDelayMs);
    return () => clearTimeout(timer);
  }, []);

  const isQuery = stage === 'query';

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={isQuery ? 'Query' : 'Reversal'}
        subtitle="Track your transfers in minutes."
        onBack={() => router.replace('/(tabs)/transfer-flow')}
        onBellPress={() => router.push('/(tabs)/notifications')}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          {isQuery ? 'Querying NIBSS..' : 'Automatic Reversal in progress...'}
        </Text>

        <Text style={styles.intro}>
          {isQuery
            ? 'Generating your status from NIBSS database.\nPlease wait for a moment...'
            : 'Reversing your transfer from NIBSS database.\nPlease wait for a moment...'}
        </Text>

        {isQuery ? (
          <TransferStepsPanel style={styles.panel}>
            <TransferStep state="done" title="No Credit Confirmation received" sub={queryTime} />
            <TransferStep state="done" title="Query sent to NIBSS" sub={queryTime} />
            <TransferStep state="current" title="Waiting for NIBSS response" sub="In Progress..." />
            <TransferStep state="pending" title="Response received" sub="Pending..." last />
          </TransferStepsPanel>
        ) : (
          <TransferStepsPanel style={styles.reversalPanel}>
            <TransferStep state="done" title="Reversal Initiated" sub={reversalTime} />
            <TransferStep state="current" title="Processing Reversal" sub="In Progress..." />
            <TransferStep state="pending" title="Reversal Completed" sub="Pending..." last />
          </TransferStepsPanel>
        )}

        <View style={[styles.note, !isQuery && styles.reversalNote]}>
          <MaterialIcons name="error-outline" size={layout.fundsNoteIcon} color={colors.infoBlue} />
          <Text style={styles.noteText} numberOfLines={1}>
            {isQuery ? 'This usually takes less than a minute.' : 'This  takes up to 2 hours to complete.'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.pageBackground },
  scroll: {
    paddingTop: layout.queryTitleTop,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.tabBarHeight,
  },
  title: {
    textAlign: 'center',
    fontSize: fontSize.large,
    lineHeight: layout.checkTitleLineHeight,
    fontFamily: fontFamily.bold,
    color: colors.textLightDark,
  },
  intro: {
    marginTop: layout.queryIntroTop,
    marginLeft: layout.queryIntroLeft,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  panel: { marginTop: layout.queryPanelTop },
  reversalPanel: { marginTop: layout.reversalPanelTop },
  note: {
    marginTop: layout.queryNoteTop,
    height: layout.transitNoteHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: layout.failedBoxIconLeft,
    backgroundColor: colors.infoBlueFaint,
    borderWidth: 0.5,
    borderColor: colors.infoBlue,
  },
  reversalNote: { marginTop: layout.reversalNoteTop },
  noteText: {
    marginLeft: layout.fundsNoteTextGap,
    fontSize: fontSize.large,
    fontFamily: fontFamily.regular,
    color: colors.textLightDark,
  },
});
