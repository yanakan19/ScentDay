import React, { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/theme';
import type { Fragrance } from '@/types';
import BottleSVG from '@/components/BottleSVG';

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
        <Text style={styles.sub}>{sub ?? `${fragrance.concentration} · ${fragrance.year}`}</Text>
      </View>
      {right ?? <Text style={styles.star}>★ {fragrance.rating}</Text>}
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
