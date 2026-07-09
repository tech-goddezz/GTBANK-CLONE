// app/(tabs)/_layout.tsx
// Wires up the 4 tabs and plugs in our custom TabBar.

import { Tabs } from 'expo-router';
import TabBar from '../../components/TabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="transactions" />
      <Tabs.Screen name="transfer" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}