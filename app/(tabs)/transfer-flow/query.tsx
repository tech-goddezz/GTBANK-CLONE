// app/(tabs)/transfer-flow/query.tsx
//
// "Query – Querying NIBSS" (S73 in "Dashboard flow + transfer flow.pdf"), opened
// from "Query Transfer" on the Transfers tab. Shows the query's progress steps.
// There is no real NIBSS query: the steps are fixed, and the first two show the
// time the page was opened.

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import { fontSize, fontFamily, lineHeight } from '../../../constants/typography';
import { layout } from '../../../constants/layout';
import ScreenHeader from '../../../components/ScreenHeader';
import { TransferStep, TransferStepsPanel, formatTransferDateTime } from '../../../components/TransferSteps';

export default function QueryScreen() {
  const router = useRouter();
  const [dateTime] = useState(() => formatTransferDateTime(new Date()));

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Query"
        subtitle="Track your transfers in minutes."
        onBack={() => router.replace('/(tabs)/transfer-flow')}
        onBellPress={() => router.push('/(tabs)/notifications')}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Querying NIBSS..</Text>

        <Text style={styles.intro}>
          {'Generating your status from NIBSS database.\nPlease wait for a moment...'}
        </Text>

        <TransferStepsPanel style={styles.panel}>
          <TransferStep state="done" title="No Credit Confirmation received" sub={dateTime} />
          <TransferStep state="done" title="Query sent to NIBSS" sub={dateTime} />
          <TransferStep state="current" title="Waiting for NIBSS response" sub="In Progress..." />
          <TransferStep state="pending" title="Response received" sub="Pending..." last />
        </TransferStepsPanel>

        <View style={styles.note}>
          <MaterialIcons name="error-outline" size={layout.fundsNoteIcon} color={colors.infoBlue} />
          <Text style={styles.noteText} numberOfLines={1}>This usually takes less than a minute.</Text>
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
  noteText: {
    marginLeft: layout.fundsNoteTextGap,
    fontSize: fontSize.large,
    fontFamily: fontFamily.regular,
    color: colors.textLightDark,
  },
});
