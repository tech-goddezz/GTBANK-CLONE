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
import { KaushanScript_400Regular } from '@expo-google-fonts/kaushan-script';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

export default function RootLayout() {
  // Load the Inter font before showing any screen, otherwise the phone's
  // default font is used instead. The icon font loads here too: left to load
  // itself, a slow connection makes it crash with a "6000ms timeout" error.
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    KaushanScript_400Regular,
    ...Ionicons.font,
  });

  // If a font is too slow or fails, still show the app rather than a blank page.
  if (!fontsLoaded && !fontError) return null;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.white } }} />
  );
}

