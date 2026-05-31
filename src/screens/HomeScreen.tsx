import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import { Screen, TopBar } from '@/components/ui';
import BottleSVG from '@/components/BottleSVG';
import { useStore } from '@/store/useStore';
import { fragById } from '@/data/fragrances';
import { MOCK_NEWS } from '@/data/seed';
import type { Review } from '@/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const VERDICT: Record<string, string> = { buy: '✅ Buy', try: '🤔 Try', skip: '❌ Skip' };

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const reviews = useStore((s) => s.reviews);
  const posts = useStore((s) => s.posts);

  // Flatten + most-recent reviews
  const latestReviews: { review: Review; fragId: string }[] = Object.entries(reviews)
    .flatMap(([fragId, list]) => list.map((review) => ({ review, fragId })))
    .sort((a, b) => b.review.id - a.review.id)
    .slice(0, 10);

  const latestPhotos = [...posts.filter((p) => p.photo), ...posts.filter((p) => !p.photo).sort((a, b) => b.votes - a.votes)].slice(0, 10);

  return (
    <Screen>
      <TopBar />
      <View style={styles.headerRow}>
        <Text style={styles.h1}>ScentDay</Text>
        <TouchableOpacity style={styles.suggestBtn} onPress={() => navigation.navigate('SuggestFragrance')}>
          <Text style={styles.suggestText}>+ Suggest Fragrance</Text>
        </TouchableOpacity>
      </View>

      {/* Latest Reviews */}
      <Text style={styles.sectionLabel}>Latest Reviews</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
        {latestReviews.map(({ review, fragId }) => {
          const f = fragById(fragId);
          return (
            <TouchableOpacity key={`${fragId}-${review.id}`} style={styles.reviewCard} onPress={() => navigation.navigate('FragranceDetail', { fragId })}>
              <Text style={styles.stars}>{'★'.repeat(review.rating)}</Text>
              <Text style={styles.cardFrag} numberOfLines={1}>{f?.name ?? fragId}</Text>
              <Text style={styles.cardBrand} numberOfLines={1}>{f?.brand}</Text>
              <Text style={styles.cardText} numberOfLines={3}>{review.text}</Text>
              <Text style={styles.cardUser}>{`@${review.user} · ${VERDICT[review.verdict]}`}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Latest Photos */}
      <Text style={styles.sectionLabel}>Latest Photos</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
        {latestPhotos.map((p) => {
          const f = fragById(p.fragId);
          return (
            <TouchableOpacity key={p.id} style={styles.photoCard} onPress={() => navigation.navigate('FragranceDetail', { fragId: p.fragId })}>
              <View style={styles.photoImg}>
                {p.photo ? <Image source={{ uri: p.photo }} style={{ width: 120, height: 120 }} /> : f ? <BottleSVG fragrance={f} size={70} /> : null}
              </View>
              <Text style={styles.photoLabel} numberOfLines={1}>{f?.name ?? p.fragId}</Text>
              <Text style={styles.photoUser}>{`@${p.user}`}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* News */}
      <Text style={[styles.sectionLabel, { marginTop: 14 }]}>Fragrance News</Text>
      <View style={{ paddingHorizontal: 18 }}>
        {MOCK_NEWS.map((n, i) => (
          <View key={i} style={styles.newsItem}>
            <Text style={styles.newsTitle}>
              {n.title} <Text style={styles.newsTag}>{` ${n.tag} `}</Text>
            </Text>
            <Text style={styles.newsMeta}>{`${n.source} · ${n.time}`}</Text>
          </View>
        ))}
      </View>
      <View style={{ height: 16 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 14 },
  h1: { color: colors.text, fontSize: 18, fontWeight: '900' },
  suggestBtn: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  suggestText: { color: colors.textDim, fontSize: 12, fontWeight: '700' },
  sectionLabel: { color: colors.textDim, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: '800', paddingHorizontal: 18, paddingTop: 14, paddingBottom: 10 },
  hScroll: { gap: 10, paddingHorizontal: 18, paddingBottom: 4 },
  reviewCard: { width: 160, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: 12 },
  stars: { color: colors.star, fontSize: 12, marginBottom: 4 },
  cardFrag: { color: colors.text, fontSize: 12, fontWeight: '800', marginBottom: 2 },
  cardBrand: { color: colors.textDim, fontSize: 10, marginBottom: 6 },
  cardText: { color: colors.textDim, fontSize: 11, lineHeight: 15 },
  cardUser: { color: colors.textDim, fontSize: 10, marginTop: 8, fontWeight: '700' },
  photoCard: { width: 120, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  photoImg: { width: 120, height: 120, alignItems: 'center', justifyContent: 'center' },
  photoLabel: { color: colors.text, padding: 8, fontSize: 11, fontWeight: '700' },
  photoUser: { color: colors.textDim, paddingHorizontal: 8, paddingBottom: 8, fontSize: 10 },
  newsItem: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: 12, marginBottom: 8 },
  newsTitle: { color: colors.text, fontSize: 13, fontWeight: '700', lineHeight: 18 },
  newsTag: { color: colors.accent, fontSize: 10, fontWeight: '700' },
  newsMeta: { color: colors.textDim, fontSize: 11, marginTop: 4 },
});
