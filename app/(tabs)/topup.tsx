// app/(tabs)/topup.tsx
//
// Top Up page (S44 Airtime / S45 Data in "Screens inside the home screen.pdf"),
// opened from Home → Top up. AIRTIME | DATA switch, then grey boxes and Proceed.
//
// - Network provider opens the "Select action" pop-up with the four networks
//   (the design doesn't show this list).
// - Airtime Proceed still does what the old "Top Up" button did: it adds the
//   amount to the balance (owner's choice; the money code is unchanged).
// - Data: Proceed (after network + phone) swaps the boxes for the plans grid
//   (S53). Tapping a plan turns it orange. Proceed under the grid does nothing
//   yet: buying data isn't in the backend. Tapping DATA again shows the boxes.

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, lineHeight } from '../../constants/typography';
import { layout } from '../../constants/layout';
import ScreenHeader from '../../components/ScreenHeader';
import Button from '../../components/Button';
import SelectActionSheet from '../../components/SelectActionSheet';
import { topUpBalance, getCurrentUserId } from '../../services/auth';

type TopUpTab = 'airtime' | 'data';

const TABS = [
  { key: 'airtime', label: 'AIRTIME', width: layout.topupTabAirtimeWidth },
  { key: 'data', label: 'DATA', width: layout.topupTabDataWidth },
] as const;

const NETWORKS = ['MTN', 'Airtel', 'Glo', '9mobile'];

// The 30 plans, with the design's exact wording and line breaks (S53).
const DATA_PLANS = [
  ['Basic Plan', '200MB -', '₦200'],
  ['Starter Pack', '500MB -', '₦1,000'],
  ['Value Bundle', '1GB -', '₦2,500'],
  ['Daily Boost', '2GB - ₦5,000'],
  ['Weekly Promo', '3GB - ₦7,500'],
  ['Connect Plan', '4GB -', '₦10,000'],
  ['MegaStream', '5GB -', '₦15,000'],
  ['Power Pack', '8GB -', '₦20,000'],
  ['Family Plan', '10GB -', '₦25,000'],
  ['Speed Deal', '12GB -', '₦30,000'],
  ['Ultra Pack', '15GB -', '₦35,000'],
  ['Max Bundle', '20GB -', '₦40,000'],
  ['Daily Saver', '25GB -', '₦45,000'],
  ['Flexi Plan', '30GB -', '₦50,000'],
  ['Super Deal', '35GB -', '₦60,000'],
  ['Turbo Pack', '40GB -', '₦70,000'],
  ['Elite Plan', '50GB -', '₦80,000'],
  ['Pro Bundle', '60GB -', '₦90,000'],
  ['Ultra Saver', '70GB -', '₦100,000'],
  ['Mega Flex', '80GB -', '₦110,000'],
  ['Max Speed', '90GB -', '₦115,000'],
  ['Power Boost', '100GB -', '₦120,000'],
  ['Turbo Flex', '110GB -', '₦125,000'],
  ['Elite Max', '120GB -', '₦130,000'],
  ['Pro Turbo', '130GB -', '₦135,000'],
  ['Ultra Max', '140GB -', '₦140,000'],
  ['Super Turbo', '145GB -', '₦145,000'],
  ['Ultimate', 'Plan 148GB', '- ₦147,500'],
  ['MegaStream', '5GB -', '₦150,000'],
  ['HyperMax', '150GB -', '₦150,000'],
];

// Stops Chrome drawing its orange focus ring around the boxes.
const noOutline = Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null;

export default function TopUpScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<TopUpTab>('airtime');
  const [network, setNetwork] = useState('');
  const [showNetworks, setShowNetworks] = useState(false);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Data tab: 'details' = network + phone boxes, 'plans' = the plans grid
  const [dataStep, setDataStep] = useState<'details' | 'plans'>('details');
  const [plan, setPlan] = useState<number | null>(null);

  const handleProceed = async () => {
    if (tab === 'data') {
      if (dataStep === 'details') {
        if (!network || phone.trim().length < 11) {
          setError('Pick a network and enter a phone number');
          return;
        }
        setError('');
        setDataStep('plans');
      }
      // Buying the picked plan isn't in the backend yet.
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }
    setError('');
    setLoading(true);
    const id = await getCurrentUserId();
    const result = await topUpBalance(id, parseFloat(amount));
    setLoading(false);
    if (result.success) {
      router.replace('/(tabs)/home');
    } else {
      setError(result.message);
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Top Up"
        subtitle="Recharge your airtime and data in a few taps."
        onBellPress={() => router.push('/(tabs)/notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tabs}>
          {TABS.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, { width: t.width }, tab === t.key && styles.tabActive]}
              onPress={() => {
                setTab(t.key);
                setError('');
                setDataStep('details');
              }}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === t.key }}
            >
              <Text style={styles.tabLabel}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.note}>Top Up your account as soon as possible.</Text>

        {tab === 'data' && dataStep === 'plans' ? (
          <>
            <View style={styles.planGrid}>
              {DATA_PLANS.map((lines, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.planCell}
                  onPress={() => setPlan(i)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: plan === i }}
                  accessibilityLabel={lines.join(' ')}
                >
                  <Text style={[styles.planText, plan === i && styles.planTextActive]}>
                    {lines.join('\n')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Button label="Proceed" onPress={handleProceed} style={styles.planButton} />
          </>
        ) : (
        <View style={styles.boxes}>
          <TouchableOpacity
            style={[styles.box, styles.selectBox]}
            onPress={() => setShowNetworks(true)}
            accessibilityRole="button"
          >
            <Text style={[styles.boxText, !network && styles.hint]}>
              {network || 'Enter Network Provider'}
            </Text>
            <MaterialIcons name="expand-more" size={layout.topupChevron} color={colors.black} />
          </TouchableOpacity>

          <TextInput
            style={[styles.box, styles.boxText, noOutline]}
            placeholder="Enter Your Phone number"
            placeholderTextColor={colors.textGrey}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          {tab === 'airtime' && (
            <TextInput
              style={[styles.box, styles.boxText, noOutline]}
              placeholder="Enter the Amount"
              placeholderTextColor={colors.textGrey}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          )}

          <Button label="Proceed" onPress={handleProceed} loading={loading} />
          {!!error && <Text style={styles.error}>{error}</Text>}
        </View>
        )}
      </ScrollView>

      <SelectActionSheet
        visible={showNetworks}
        title="Select network"
        onCancel={() => setShowNetworks(false)}
        options={NETWORKS.map((n) => ({
          label: n,
          onPress: () => {
            setNetwork(n);
            setShowNetworks(false);
          },
        }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: {
    paddingTop: layout.topupTabsTop,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.tabBarHeight,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: layout.topupTabsWidth,
    height: layout.topupTabsHeight,
    padding: layout.topupTabsPad,
    backgroundColor: colors.white,
  },
  tab: {
    height: layout.codeTabHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: { backgroundColor: colors.segmentActive },
  tabLabel: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  note: {
    marginTop: layout.topupNoteTop,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  boxes: {
    marginTop: layout.topupBoxesTop,
    gap: layout.topupBoxGap,
  },
  box: {
    height: layout.inputHeight,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: layout.topupBoxPadding,
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: layout.topupChevronRight,
  },
  boxText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    // Typed and picked text stays grey, as in the filled-in design (S52)
    color: colors.textGrey,
  },
  hint: { color: colors.textGrey },
  planGrid: {
    marginTop: layout.planGridTop,
    width: layout.contentWidth,
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: layout.planColumnGap,
    rowGap: layout.planRowGap,
    padding: layout.planGridPadding,
    paddingRight: layout.planGridPaddingRight,
    backgroundColor: colors.inputBackground,
  },
  planCell: {
    width: layout.planCellWidth,
    height: layout.planCellHeight,
    justifyContent: 'center',
  },
  planText: {
    width: layout.planTextWidth,
    fontSize: fontSize.plan,
    lineHeight: layout.planLineHeight,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  planTextActive: { color: colors.orange },
  planButton: { marginTop: layout.planButtonTop },
  error: {
    marginTop: -8,
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.red,
  },
});
