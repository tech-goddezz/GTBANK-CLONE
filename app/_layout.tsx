// app/_layout.tsx
// Root layout — just a plain Stack hosting every route group.
// Each group ((auth), (tabs), (settings), etc.) manages its own
// nested layout, so this stays minimal.

import { Stack } from 'expo-router';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import colors from '../constants/colors';

export default function RootLayout() {
  // Load the Inter font before showing any screen, otherwise the phone's
  // default font is used instead.
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.white } }} />
  );
}

