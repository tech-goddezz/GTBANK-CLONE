import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  // For sheets that draw their own top and edges, like the date pickers.
  bare?: boolean;
  topRadius?: number;
  // For cards rounded on all four corners, like the fingerprint pop-up.
  bottomRadius?: number;
  children: React.ReactNode;
}

export default function BottomSheet({ visible, onClose, title, bare, topRadius, bottomRadius, children }: BottomSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            bare && styles.sheetBare,
            topRadius !== undefined && { borderTopLeftRadius: topRadius, borderTopRightRadius: topRadius },
            bottomRadius !== undefined && { borderBottomLeftRadius: bottomRadius, borderBottomRightRadius: bottomRadius },
          ]}
          onPress={() => {}}
        >
          {!bare && (
            <View style={styles.header}>
              {title ? <Text style={styles.title}>{title}</Text> : <View />}
              <TouchableOpacity onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
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
  backdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingHorizontal: spacing.xl, paddingTop: spacing.xxl, paddingBottom: spacing.xxxl, maxHeight: '85%' },
  sheetBare: { paddingHorizontal: 0, paddingTop: 0, paddingBottom: 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  title: { fontSize: fontSize.heading2, fontFamily: fontFamily.semibold, color: colors.textDark },
});
