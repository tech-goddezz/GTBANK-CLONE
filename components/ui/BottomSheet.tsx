// components/ui/BottomSheet.tsx
// A reusable slide-up overlay. Handles the "drawer" mechanics only —
// opening, the dimmed backdrop, closing on outside tap. Whatever content
// goes inside (filters, confirmations, pickers) is passed in as children
// by whichever screen uses it.

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';

interface BottomSheetProps {
  // Controls whether the sheet is showing. Owned by the parent screen —
  // this component never decides its own visibility.
  visible: boolean;
  // Called when the user taps the backdrop or the close (X) button.
  onClose: () => void;
  // Optional heading shown at the top of the sheet, e.g. "Filter Transactions".
  title?: string;
  // Whatever the parent screen wants to show inside the sheet.
  children: React.ReactNode;
}

export default function BottomSheet({ visible, onClose, title, children }: BottomSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Tapping the dimmed area outside the sheet closes it — standard
          mobile-modal behavior users expect without being told. */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* This inner Pressable with no onPress "catches" taps so that
            tapping INSIDE the sheet doesn't bubble up and close it. */}
        <Pressable style={styles.sheet} onPress={() => {}}>
          {(title || onClose) && (
            <View style={styles.header}>
              {title ? <Text style={styles.title}>{title}</Text> : <View />}
              <TouchableOpacity
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={22} color={colors.textDark} />
              </TouchableOpacity>
            </View>
          )}
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.heading3,
    fontFamily: fontFamily.semibold,
    color: colors.textDark,
  },
});