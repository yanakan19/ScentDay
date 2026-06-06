import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme';

interface Props {
  /** Ordered list of URLs to try. Falls back to initials when all fail. */
  uris: string[];
  /** Shown as initials fallback — e.g. "Boots" → "BO" */
  name: string;
  size?: number;
  radius?: number;
}

/**
 * Logo image with automatic multi-source fallback chain.
 * Tries each URI in order; if all fail, renders a styled initials badge.
 */
export function LogoImage({ uris, name, size = 40, radius: r = 8 }: Props) {
  const [idx, setIdx] = useState(0);

  const allFailed = idx >= uris.length;
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  if (allFailed || uris.length === 0) {
    return (
      <View style={[styles.fallback, { width: size, height: size, borderRadius: r }]}>
        <Text style={[styles.initials, { fontSize: size * 0.32 }]}>{initials}</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: uris[idx] }}
      style={[styles.img, { width: size, height: size, borderRadius: r }]}
      resizeMode="contain"
      onError={() => setIdx((i) => i + 1)}
    />
  );
}

const styles = StyleSheet.create({
  img: { backgroundColor: '#fff' },
  fallback: {
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
  initials: { color: colors.textDim, fontWeight: '800' },
});
