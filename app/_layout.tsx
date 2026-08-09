// app/_layout.tsx
// Root layout — just a plain Stack hosting every route group.
// Each group ((auth), (tabs), (settings), etc.) manages its own
// nested layout, so this stays minimal.

import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'red' } }} />
  );
}

