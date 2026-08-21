import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';

const MORE_OPTIONS = [
  { id: 'cards', label: 'Cards', icon: 'card-outline', route: '/(tabs)/cards' },
  { id: 'settings', label: 'Settings', icon: 'settings-outline', route: '/(tabs)/settings' },
  { id: 'history', label: 'Transaction History', icon: 'time-outline', route: '/(tabs)/history' },
];

export default function MoreScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={colors.textDark} />
      </TouchableOpacity>

      <Text style={styles.title}>More Options</Text>

      <FlatList
        data={MORE_OPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.optionRow} onPress={() => router.push(item.route as any)}>
            <Ionicons name={item.icon as any} size={22} color={colors.textDark} />
            <Text style={styles.optionText}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, paddingHorizontal: spacing.xl },
  backButton: { marginTop: 70, marginBottom: spacing.xl, width: 40, height: 40, justifyContent: 'center' },
  title: { fontSize: fontSize.heading1, fontFamily: fontFamily.bold, color: colors.textDark, marginBottom: spacing.xl },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  optionText: { fontSize: fontSize.body, fontFamily: fontFamily.medium, color: colors.textDark },
});
