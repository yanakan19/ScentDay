import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import { Screen, BackHeader, EmptyState } from '@/components/ui';
import { FragRow } from '@/components/FragRow';
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
      <Text style={styles.h2}>🔖 Saved Fragrances</Text>
      {saved.length ? (
        saved.map((f) => <FragRow key={f.id} fragrance={f} onPress={() => navigation.navigate('FragranceDetail', { fragId: f.id })} />)
      ) : (
        <EmptyState>No saved fragrances yet.{'\n'}Tap 🔖 on any fragrance to save it.</EmptyState>
      )}
      <Text style={styles.h2}>🛍️ Wishlist</Text>
      {wishlist.length ? (
        wishlist.map((f) => <FragRow key={f.id} fragrance={f} onPress={() => navigation.navigate('FragranceDetail', { fragId: f.id })} />)
      ) : (
        <EmptyState>Your wishlist is empty.{'\n'}Tap 🛍️ on any fragrance to add it.</EmptyState>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  h2: { color: colors.text, fontSize: 16, fontWeight: '700', paddingHorizontal: 16, paddingVertical: 14 },
});
