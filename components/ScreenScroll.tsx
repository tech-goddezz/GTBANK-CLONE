// components/ScreenScroll.tsx
//
// Wraps a whole screen so it scrolls when the phone is too short to fit it.
// At full size nothing changes: the screen still fills the phone, and buttons
// pushed to the bottom stay at the bottom.

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default function ScreenScroll({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1 },
});
