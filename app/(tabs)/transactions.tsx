// app/(tabs)/transactions.tsx
//
// The "Transactions" tab (S35 in "Dashboard flow + transfer flow.pdf"):
// three picture cards (GT Loans, GT Fund Managers Money Market Fund and
// Dollar Fund) inside a white panel. Each card opens its product page at (products).
//
// NOTE: this is a different screen from History (reached via the History
// button on Home) — confirmed with Litz these are separate screens, not
// one scrolling page.

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import { layout } from '../../constants/layout';
import { cardIcons } from '../../constants/cardIcons';
import ScreenHeader from '../../components/ScreenHeader';

const CARDS = [
  {
    id: 'loans',
    title: 'Apply for loans',
    subtitle: 'Click here to apply for Quick Credit and salary advance.',
    picture: require('../../assets/images/card-loans.png'),
    background: colors.cardLoans,
  },
  {
    id: 'money-mkt',
    title: 'GT Fund Managers Money Market Fund',
    subtitle: 'Our money market is a perfect way to start your investment journey.',
    picture: require('../../assets/images/card-money-market.png'),
    background: colors.cardMoneyMarket,
  },
  {
    id: 'dollar-fund',
    title: 'GT Fund Managers Dollar Fund',
    subtitle: 'Beat the curve and make the most out of your money. Invest in our one dollar fund.',
    picture: require('../../assets/images/card-dollar-fund.png'),
    background: colors.cardDollarFund,
  },
];

export default function TransactionsScreen() {
  const router = useRouter();
  const arrow = cardIcons.arrow;

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Transactions"
        subtitle="Review and manage your financial activity"
        showBack={false}
        onBellPress={() => router.push('/(tabs)/notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.panel}>
          {CARDS.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[styles.card, { backgroundColor: card.background }]}
              activeOpacity={0.85}
              onPress={() => router.push(`/(products)/${card.id}`)}
            >
              <Image source={card.picture} style={styles.picture} resizeMode="cover" />

              {/* See-through white box with the title, description and arrow */}
              <View style={styles.textBox}>
                <View style={styles.textBlock}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{card.title}</Text>
                  <Text style={styles.cardText}>{card.subtitle}</Text>
                </View>
                <Svg width={arrow.width} height={arrow.height} viewBox={`0 0 ${arrow.width} ${arrow.height}`}>
                  <Path d={arrow.path} fill={colors.cardArrow} fillRule={arrow.fillRule} />
                </Svg>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.pageBackground },
  scrollContent: { paddingBottom: spacing.xxxl },
  panel: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    marginTop: layout.productPanelTop,
    marginHorizontal: layout.productPanelSide,
    padding: layout.productPanelPadding,
    gap: layout.productPanelPadding,
  },
  card: {
    height: layout.productCardHeight,
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  picture: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  textBox: {
    position: 'absolute',
    left: layout.productBoxInset,
    right: layout.productBoxInset,
    bottom: layout.productBoxBottom,
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.productArrowGap,
    paddingTop: layout.productBoxPaddingTop,
    paddingBottom: layout.productBoxPaddingBottom,
    paddingLeft: layout.productBoxPaddingLeft,
    paddingRight: layout.productBoxPaddingRight,
    backgroundColor: colors.cardTextBox,
    borderRadius: radius.productTextBox,
  },
  textBlock: { flex: 1 },
  cardTitle: {
    fontSize: fontSize.cardTitle,
    lineHeight: 18,
    fontFamily: fontFamily.poppinsMedium,
    color: colors.black,
    marginBottom: layout.productTitleGap,
  },
  cardText: {
    fontSize: fontSize.cardText,
    lineHeight: 16,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
  },
});
