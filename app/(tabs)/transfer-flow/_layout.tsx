// app/(tabs)/transfer-flow/_layout.tsx
// Wraps the transfer flow screens (index, details, confirm, processing, receipt)
// in their own Stack. Without this file, Expo Router registers the folder's
// index route as "transfer-flow/index" instead of "transfer-flow", which is
// why TAB_CONFIG['transfer-flow'] in TabBar.tsx wasn't matching.

import { Stack } from 'expo-router';

export default function TransferFlowLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}