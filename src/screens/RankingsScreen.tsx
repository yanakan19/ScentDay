import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import { Screen, TopBar, ScopeTabs, EmptyState } from '@/components/ui';
import BottleSVG from '@/components/BottleSVG';
import { useStore } from '@/store/useStore';
import { getBoard, type BoardTab, type BoardPeriod } from '@/services/catalog';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TABS = [
  { key: 'votes', label: '🏆 Most Voted' },
  { key: 'views', label: '👁 Most Viewed' },
  { key: 'worn', label: '🧴 Most Worn' },
];
const PERIODS = [
  { key: 'today', label: 'Today' },
  { key: 'month', label: 'This Month' },
  { key: 'all', label: 'All Time' },
];
const MEDALS = ['#f59e0b', '#9ca3af', '#cd7c2e'];
const PODIUM_H = [108, 88, 74];
const PODIUM_LABEL = ['🥇 1st', '🥈 2nd', '🥉 3rd'];

export default function RankingsScreen() {
  const navigation = useNavigation<Nav>();
  const [tab, setTab] = useState<BoardTab>('votes');
  const [period, setPeriod] = useState<BoardPeriod>('all');
  const posts = useStore((s) => s.posts);
  const wardrobe = useStore((s) => s.wardrobe);
  const ranked = getBoard(tab, posts, wardrobe, period);

  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);
  // podium display order: 2nd, 1st, 3rd
  const order = top3.length >= 3 ? [1, 0, 2] : top3.map((_, i) => i);

  return (
    <Screen>
      <TopBar />
      <Text style={styles.h2}>Rankings</Text>
      <ScopeTabs tabs={TABS} active={tab} onChange={(k) => setTab(k as BoardTab)} />
      <ScopeTabs tabs={PERIODS} active={period} onChange={(k) => setPeriod(k as BoardPeriod)} />

      {!ranked.length ? (
        <EmptyState>No data yet.</EmptyState>
      ) : (
        <>
          <View style={styles.podium}>
            {order.map((idx) => {
              const e = top3[idx];
              if (!e) return <View key={idx} style={{ flex: 1 }} />;
              const place = idx; // 0=1st,1=2nd,2=3rd
              return (
                <TouchableOpacity key={e.f.id} style={styles.podCol} onPress={() => navigation.navigate('FragranceDetail', { fragId: e.f.id })}>
                  <Text style={styles.podScore}>{e.sub}</Text>
                  <BottleSVG fragrance={e.f} size={place === 0 ? 54 : 42} />
                  <Text style={styles.podName} numberOfLines={1}>{e.f.name}</Text>
                  <Text style={styles.podBrand} numberOfLines={1}>{e.f.brand}</Text>
                  <View style={[styles.podBlock, { height: PODIUM_H[place], backgroundColor: MEDALS[place] }]}>
                    <Text style={styles.podPlace}>{PODIUM_LABEL[place]}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.divider} />
          {rest.map((e, i) => (
            <TouchableOpacity key={e.f.id} style={styles.row} onPress={() => navigation.navigate('FragranceDetail', { fragId: e.f.id })}>
              <Text style={styles.rank}>{i + 4}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowName}>{e.f.name}</Text>
                <Text style={styles.rowBrand}>{e.f.brand}</Text>
              </View>
              <Text style={styles.rowScore}>{e.sub}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}
      <View style={{ height: 16 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  h2: { color: colors.text, fontSize: 18, fontWeight: '900', paddingHorizontal: 18, paddingTop: 14 },
  podium: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, paddingHorizontal: 12, paddingTop: 14 },
  podCol: { flex: 1, alignItems: 'center', gap: 4 },
  podScore: { color: colors.accent, fontSize: 11, fontWeight: '800' },
  podName: { color: colors.text, fontSize: 11, fontWeight: '800', maxWidth: 80 },
  podBrand: { color: colors.textDim, fontSize: 9, maxWidth: 80 },
  podBlock: { width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8, alignItems: 'center', paddingTop: 8 },
  podPlace: { color: '#fff', fontWeight: '900', fontSize: 13 },
  divider: { height: 1, backgroundColor: colors.line, marginHorizontal: 16, marginVertical: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 10 },
  rank: { width: 40, textAlign: 'center', color: colors.textDim, fontSize: 15, fontWeight: '900' },
  rowName: { color: colors.text, fontSize: 15, fontWeight: '800' },
  rowBrand: { color: colors.textDim, fontSize: 12 },
  rowScore: { color: colors.accent, fontSize: 13, fontWeight: '800' },
});
