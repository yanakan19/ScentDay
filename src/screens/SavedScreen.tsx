import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import { Screen, BackHeader, EmptyState } from '@/components/ui';
import { FragRow } from '@/components/FragRow';
import { IconBookmark } from '@/components/TabIcons';
import { useStore } from '@/store/useStore';
import { FRAGRANCES } from '@/data/fragrances';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function SavedScreen() {
  const navigation = useNavigation<Nav>();
  const savedIds = useStore((s) => s.savedIds);
  const wishlistIds = useStore((s) => s.wishlistIds);
  const saved = FRAGRANCES.filter((f) => savedIds.includes(f.id));
  const wishlist = FRAGRANCES.filter((f) => wishlistIds.includes(f.id));

  return (
    <Screen>
      <BackHeader />
      <View style={styles.sectionHead}>
        <IconBookmark color={colors.accent} size={18} filled />
        <Text style={styles.h2}>Saved Fragrances</Text>
      </View>
      {saved.length ? (
        saved.map((f) => <FragRow key={f.id} fragrance={f} onPress={() => navigation.navigate('FragranceDetail', { fragId: f.id })} />)
      ) : (
        <EmptyState>No saved fragrances yet.{'\n'}Tap 🔖 on any fragrance to save it.</EmptyState>
      )}
      <View style={styles.sectionHead}>
        <Text style={{ fontSize: 16 }}>🛍️</Text>
        <Text style={styles.h2}>Wishlist</Text>
      </View>
      {wishlist.length ? (
        wishlist.map((f) => <FragRow key={f.id} fragrance={f} onPress={() => navigation.navigate('FragranceDetail', { fragId: f.id })} />)
      ) : (
        <EmptyState>Your wishlist is empty.{'\n'}Tap 🛍️ on any fragrance to add it.</EmptyState>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 14 },
  h2: { color: colors.text, fontSize: 16, fontWeight: '700' },
});
