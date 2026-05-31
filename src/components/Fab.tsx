import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import type { PostType } from '@/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const OPTIONS: { type: PostType; label: string; icon: string }[] = [
  { type: 'sotd', label: 'Scent of the Day', icon: '📸' },
  { type: 'review', label: 'Write a Review', icon: '✍️' },
  { type: 'question', label: 'Ask a Question', icon: '❓' },
];

/**
 * Floating action button with a radial post menu (SOTD / Review / Question).
 * Rendered above the tab bar by the tab navigator.
 */
export function Fab() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const [open, setOpen] = useState(false);

  const choose = (type: PostType) => {
    setOpen(false);
    navigation.navigate('Post', { type });
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.fab, { bottom: 76 + insets.bottom }]}
        onPress={() => setOpen(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.fabPlus}>+</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={[styles.options, { bottom: 140 + insets.bottom }]}>
            {OPTIONS.map((o) => (
              <TouchableOpacity key={o.type} style={styles.option} onPress={() => choose(o.type)}>
                <Text style={styles.optionLabel}>{o.label}</Text>
                <View style={styles.optionIcon}>
                  <Text style={{ fontSize: 18 }}>{o.icon}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    shadowColor: '#fff',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabPlus: { color: '#000', fontSize: 30, fontWeight: '800', marginTop: -2 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  options: { position: 'absolute', right: 20, alignItems: 'flex-end', gap: 12 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  optionLabel: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    overflow: 'hidden',
  },
  optionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
