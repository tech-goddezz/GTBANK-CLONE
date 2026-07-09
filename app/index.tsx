// app/index.tsx
// Entry point — checks login state and redirects. User never sees this screen.

import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import colors from '../constants/colors';

export default function Index() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/onboarding');
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isLoggedIn]);

  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.orange} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});