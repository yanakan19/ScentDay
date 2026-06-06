import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import type { PostType } from '@/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const OPTIONS: { type: PostType; label: string; icon: string }[] = [
  { type: 'sotd',     label: 'Scent of the Day', icon: '📸' },
  { type: 'review',  label: 'Write a Review',    icon: '✍️' },
  { type: 'question',label: 'Ask a Question',    icon: '❓' },
];

const SPRING = { useNativeDriver: true, tension: 200, friction: 20 };

/**
 * Floating action button with spring-animated radial post menu.
 * No Modal — uses an absolute overlay so animations run on the native thread.
 */
export function Fab() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const [open, setOpen] = useState(false);

  // Master progress: 0 = closed, 1 = open
  const progress = useRef(new Animated.Value(0)).current;
  // Per-option spring values
  const optAnims = useRef(OPTIONS.map(() => new Animated.Value(0))).current;

  const openMenu = useCallback(() => {
    setOpen(true);
    Animated.parallel([
      Animated.spring(progress, { toValue: 1, ...SPRING }),
      ...optAnims.map((a, i) =>
        Animated.spring(a, {
          toValue: 1,
          delay: i * 40,
          ...SPRING,
        })
      ),
    ]).start();
  }, []);

  const closeMenu = useCallback(() => {
    Animated.parallel([
      Animated.spring(progress, { toValue: 0, ...SPRING }),
      ...optAnims.map((a, i) =>
        Animated.spring(a, {
          toValue: 0,
          delay: (OPTIONS.length - 1 - i) * 30,
          ...SPRING,
        })
      ),
    ]).start(() => setOpen(false));
  }, []);

  const choose = (type: PostType) => {
    closeMenu();
    setTimeout(() => navigation.navigate('Post', { type }), 180);
  };

  // FAB rotates + → ×
  const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] });
  const backdropOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 0.55] });

  const fabBottom = 76 + insets.bottom;
  const optionsBottom = fabBottom + 64;

  return (
    <>
      {/* Backdrop — only in tree when open so it doesn't block touches */}
      {open && (
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
          pointerEvents="box-only"
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />
        </Animated.View>
      )}

      {/* Option buttons */}
      {open && (
        <View style={[styles.optionsWrap, { bottom: optionsBottom }]}>
          {OPTIONS.map((o, i) => {
            const translateY = optAnims[i].interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            });
            const opacity = optAnims[i];
            const scale = optAnims[i].interpolate({
              inputRange: [0, 1],
              outputRange: [0.85, 1],
            });
            return (
              <Animated.View
                key={o.type}
                style={[styles.optionRow, { opacity, transform: [{ translateY }, { scale }] }]}
              >
                <TouchableOpacity style={styles.optionLabel} onPress={() => choose(o.type)}>
                  <Text style={styles.optionLabelText}>{o.label}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionIcon} onPress={() => choose(o.type)}>
                  <Text style={{ fontSize: 18 }}>{o.icon}</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      )}

      {/* FAB button */}
      <TouchableOpacity
        style={[styles.fab, { bottom: fabBottom }]}
        onPress={open ? closeMenu : openMenu}
        activeOpacity={0.85}
      >
        <Animated.Text style={[styles.fabPlus, { transform: [{ rotate }] }]}>+</Animated.Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    zIndex: 40,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 60,
    shadowColor: '#fff',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  fabPlus: { color: '#000', fontSize: 30, fontWeight: '800', marginTop: -2 },
  optionsWrap: {
    position: 'absolute',
    right: 20,
    alignItems: 'flex-end',
    gap: 12,
    zIndex: 55,
  },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  optionLabel: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  optionLabelText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});
