// app/(auth)/_layout.tsx
// Shared layout for all auth screens.
// Just a plain Stack with no header — each screen handles its own back button.

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}