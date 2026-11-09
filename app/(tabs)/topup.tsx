// app/(tabs)/topup.tsx
//
// Top Up page (S44 Airtime / S45 Data in "Screens inside the home screen.pdf"),
// opened from Home → Top up. AIRTIME | DATA switch, then grey boxes and Proceed.
//
// - Network provider opens the "Select action" pop-up with the four networks
//   (the design doesn't show this list).
// - Airtime Proceed still does what the old "Top Up" button did: it adds the
//   amount to the balance (owner's choice; the money code is unchanged).
// - Data Proceed does nothing yet: the data plans grid (S53) comes later.

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

  const handleProceed = async () => {
    // Data plans (S53) aren't built yet.
    if (tab === 'data') return;
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
              }}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === t.key }}
            >
              <Text style={styles.tabLabel}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.note}>Top Up your account as soon as possible.</Text>

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
    color: colors.black,
  },
  hint: { color: colors.textGrey },
  error: {
    marginTop: -8,
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.red,
  },
});
