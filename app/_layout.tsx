// app/_layout.tsx
// Root layout — loads fonts and sets up the navigation stack for the whole app.

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import ErrorBoundary from '../components/ErrorBoundary';
import { View, ActivityIndicator } from 'react-native';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import colors from '../constants/colors';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white }}>
        <ActivityIndicator color={colors.orange} />
      </View>
    );
  }

  return (
  <ErrorBoundary>
    <StatusBar style="dark" />
    <Stack screenOptions={{ headerShown: false }} />
  </ErrorBoundary>
);
}