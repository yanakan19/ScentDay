import React, { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/theme';
import type { Fragrance } from '@/types';
import BottleSVG from '@/components/BottleSVG';
import { IconBookmark } from '@/components/TabIcons';
import { useStore } from '@/store/useStore';

/** Save (ribbon) + Wishlist (bag) buttons — shown on every fragrance listing (#8). */
export function SaveWishlistButtons({ fragId }: { fragId: string }) {
  const saved = useStore((s) => s.savedIds.includes(fragId));
  const wished = useStore((s) => s.wishlistIds.includes(fragId));
  const toggleSave = useStore((s) => s.toggleSave);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  return (
    <View style={swStyles.wrap}>
      <TouchableOpacity style={[swStyles.btn, saved && swStyles.btnOn]} onPress={() => toggleSave(fragId)} hitSlop={6}>
        <IconBookmark color={saved ? colors.accent : colors.textDim} size={16} filled={saved} />
      </TouchableOpacity>
      <TouchableOpacity style={[swStyles.btn, wished && swStyles.btnOn]} onPress={() => toggleWishlist(fragId)} hitSlop={6}>
        <Text style={[swStyles.icon, { opacity: wished ? 1 : 0.45 }]}>🛍️</Text>
      </TouchableOpacity>
    </View>
  );
}

const swStyles = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: 6 },
  btn: { width: 34, height: 34, borderRadius: 9, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  btnOn: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  icon: { fontSize: 16 },
});

/**
 * Shared fragrance list row (used by Discover, Saved, Brand/Note detail, etc.).
 * `right` defaults to the star rating but can be overridden.
 */
export function FragRow({
  fragrance,
  onPress,
  sub,
  right,
  thumbSize = 40,
}: {
  fragrance: Fragrance;
  onPress: () => void;
  sub?: string;
  right?: ReactNode;
  thumbSize?: number;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.thumb}>
        <BottleSVG fragrance={fragrance} size={thumbSize} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{fragrance.name}</Text>
        <Text style={styles.sub}>{sub ?? `★ ${fragrance.rating} · ${fragrance.concentration}`}</Text>
      </View>
      {right ?? <SaveWishlistButtons fragId={fragrance.id} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 14,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { color: colors.text, fontSize: 15, fontWeight: '800', letterSpacing: -0.3 },
  sub: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  star: { color: colors.accent, fontSize: 13, fontWeight: '600' },
});
