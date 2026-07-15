import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  SafeAreaView, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';

const ARTICLES = [
  'How to reset your PIN',
  'Understanding transaction fees',
  'Setting up Apple/Google Pay',
  'How to link your GTBank card to your profile',
  'Understanding transaction fees',
  'Setting up Apple/Google Pay',
];

export default function GetHelpScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [showLiveChat, setShowLiveChat] = useState(false);

  const filtered = ARTICLES.filter((a) => a.toLowerCase().includes(search.toLowerCase()));

  if (showLiveChat) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setShowLiveChat(false)}>
            <Ionicons name="arrow-back" size={24} color={colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.chatTitle}>Live Chat Screen</Text>
        </View>
        <View style={styles.chatBody}>
          <View style={styles.chatBubbleLeft}>
            <Text style={styles.chatBubbleText}>Hi there! I'd love to help. Could you let me know what's going on?</Text>
          </View>
          <View style={styles.chatBubbleLeft}>
            <Text style={styles.chatBubbleText}>I make a payment to RecTech Solutions. Please how can I have a refund?</Text>
          </View>
          <View style={styles.chatBubbleRight}>
            <Text style={styles.chatBubbleTextRight}>That'll be great. Could you share your info please?</Text>
          </View>
          <View style={styles.chatBubbleLeft}>
            <Text style={styles.chatBubbleText}>What can our bot help you with? Please choose info</Text>
          </View>
        </View>
        <View style={styles.chatInput}>
          <TextInput style={styles.chatInputField} placeholder="Type here..." placeholderTextColor={colors.textFaded} />
          <TouchableOpacity style={styles.sendButton}>
            <Ionicons name="send" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>

        <Text style={styles.title}>Get Help</Text>
        <Text style={styles.subtitle}>Customize your preferences here.</Text>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={colors.textGrey} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={colors.textFaded}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <Text style={styles.sectionLabel}>Popular Articles</Text>

        {filtered.map((article, i) => (
          <TouchableOpacity key={i} style={styles.articleRow}>
            <Text style={styles.articleText}>{article}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textFaded} />
          </TouchableOpacity>
        ))}

        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Still need help?</Text>
          <Text style={styles.supportSub}>Our support team is available 24/7 to assist you with any inquiries.</Text>

          <TouchableOpacity style={styles.supportRow}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.textDark} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={styles.supportLabel}>Expected response: 2 mins</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportRow}>
            <Ionicons name="mail-outline" size={20} color={colors.textDark} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={styles.supportLabel}>Expected response: 3 hours</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>Contact our support team.</Text>
        <TouchableOpacity style={styles.phoneRow}>
          <Text style={styles.phoneText}>+(234)80 000 0000</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.phoneRow}>
          <Text style={styles.phoneText}>+(234) 80 000 0001</Text>
        </TouchableOpacity>

        <Text style={styles.hoursText}>Mon-Fri, 8am - 8pm</Text>

        <TouchableOpacity style={styles.liveChatButton} onPress={() => setShowLiveChat(true)}>
          <Text style={styles.liveChatText}>Start Live Chat</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  backButton: { marginTop: 56, marginBottom: spacing.xl, width: 40, height: 40, justifyContent: 'center' },
  title: { fontSize: fontSize.heading1, fontFamily: fontFamily.bold, color: colors.textDark, marginBottom: spacing.xs },
  subtitle: { fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textGrey, marginBottom: spacing.xl },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.inputBackground,
    borderRadius: radius.input, paddingHorizontal: spacing.md, height: 46, gap: spacing.sm,
    borderWidth: 1, borderColor: colors.borderLight, marginBottom: spacing.xl,
  },
  searchInput: { flex: 1, fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textDark },
  sectionLabel: { fontSize: fontSize.body, fontFamily: fontFamily.semibold, color: colors.textDark, marginBottom: spacing.md, marginTop: spacing.lg },
  articleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  articleText: { fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textDark, flex: 1 },
  supportCard: { backgroundColor: colors.pageBackground, borderRadius: radius.card, padding: spacing.lg, marginTop: spacing.xl },
  supportTitle: { fontSize: fontSize.body, fontFamily: fontFamily.semibold, color: colors.textDark, marginBottom: spacing.xs },
  supportSub: { fontSize: fontSize.small, fontFamily: fontFamily.regular, color: colors.textGrey, marginBottom: spacing.md, lineHeight: 18 },
  supportRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.borderLight },
  supportLabel: { fontSize: fontSize.small, fontFamily: fontFamily.regular, color: colors.textGrey },
  phoneRow: { paddingVertical: spacing.sm },
  phoneText: { fontSize: fontSize.body, fontFamily: fontFamily.medium, color: colors.textDark },
  hoursText: { fontSize: fontSize.small, fontFamily: fontFamily.regular, color: colors.textGrey, marginBottom: spacing.xl },
  liveChatButton: { backgroundColor: colors.orange, height: 54, borderRadius: radius.button, alignItems: 'center', justifyContent: 'center' },
  liveChatText: { fontSize: fontSize.large, fontFamily: fontFamily.semibold, color: colors.white },
  chatHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  chatTitle: { fontSize: fontSize.heading3, fontFamily: fontFamily.semibold, color: colors.textDark },
  chatBody: { flex: 1, padding: spacing.xl, gap: spacing.md },
  chatBubbleLeft: { backgroundColor: colors.pageBackground, borderRadius: radius.card, padding: spacing.md, maxWidth: '80%', alignSelf: 'flex-start' },
  chatBubbleRight: { backgroundColor: colors.orange, borderRadius: radius.card, padding: spacing.md, maxWidth: '80%', alignSelf: 'flex-end' },
  chatBubbleText: { fontSize: fontSize.small, fontFamily: fontFamily.regular, color: colors.textDark, lineHeight: 18 },
  chatBubbleTextRight: { fontSize: fontSize.small, fontFamily: fontFamily.regular, color: colors.white, lineHeight: 18 },
  chatInput: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.borderLight, gap: spacing.md },
  chatInputField: { flex: 1, height: 44, backgroundColor: colors.inputBackground, borderRadius: radius.pill, paddingHorizontal: spacing.lg, fontSize: fontSize.body, fontFamily: fontFamily.regular, color: colors.textDark },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' },
});