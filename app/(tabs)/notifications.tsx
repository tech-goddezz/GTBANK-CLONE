import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing } from '../../constants/typography';

const NOTIFICATIONS = [
  { id: '1', title: 'Welcome to GTBank', body: 'Your account has been created successfully.', icon: 'checkmark-circle-outline' },
  { id: '2', title: 'Complete your profile', body: 'Add your details to unlock all features.', icon: 'person-circle-outline' },
  { id: '3', title: 'Stay secure', body: 'Never share your PIN or password with anyone.', icon: 'shield-checkmark-outline' },
];

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={22} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Ionicons name={item.icon as any} size={22} color={colors.orange} />
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.rowBody}>{item.body}</Text>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, paddingHorizontal: spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: {
    fontSize: fontSize.heading2,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  rowText: { flex: 1 },
  rowTitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    color: colors.textDark,
  },
  rowBody: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
});
