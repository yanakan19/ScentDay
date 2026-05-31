import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius, priceTierColors } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import { Screen, BackHeader, ScopeTabs, EmptyState } from '@/components/ui';
import BottleSVG from '@/components/BottleSVG';
import { useStore } from '@/store/useStore';
import { FRAGRANCES, fragById } from '@/data/fragrances';
import { getCollectionValue, getAIAnalysis } from '@/services/recommendations';
import type { Fragrance, PriceTier } from '@/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function WardrobeScreen() {
  const navigation = useNavigation<Nav>();
  const wardrobe = useStore((s) => s.wardrobe);
  const addToCollection = useStore((s) => s.addToCollection);
  const removeFromCollection = useStore((s) => s.removeFromCollection);
  const [tab, setTab] = useState<'list' | 'ai'>('list');
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [addSearch, setAddSearch] = useState('');

  const value = getCollectionValue(wardrobe);
  const visible = wardrobe.filter((w) => {
    if (!search.trim()) return true;
    const f = fragById(w.fragId);
    const q = search.toLowerCase();
    return f && (f.name.toLowerCase().includes(q) || f.brand.toLowerCase().includes(q));
  });

  const addMatches = FRAGRANCES.filter((f) => {
    if (!addSearch.trim()) return true;
    const q = addSearch.toLowerCase();
    return f.name.toLowerCase().includes(q) || f.brand.toLowerCase().includes(q);
  }).slice(0, 30);
  const wardrobeIds = new Set(wardrobe.map((w) => w.fragId));

  return (
    <Screen>
      <BackHeader />
      <View style={styles.headerRow}>
        <Text style={styles.h2}>My Collection</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={styles.smallBtn} onPress={() => navigation.navigate('Tabs', { screen: 'Blend' })}>
            <Text style={styles.smallBtnText}>🧬 Blend</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.smallBtn, styles.addBtn]} onPress={() => setAddOpen(true)}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScopeTabs
        tabs={[{ key: 'list', label: 'My Bottles' }, { key: 'ai', label: '✨ AI Analysis' }]}
        active={tab}
        onChange={(k) => setTab(k as 'list' | 'ai')}
        scroll={false}
      />

      {tab === 'list' ? (
        <>
          <TextInput style={styles.search} placeholder="Search my collection…" placeholderTextColor={colors.textDim} value={search} onChangeText={setSearch} />
          <View style={styles.valueCard}>
            <View style={styles.valueHead}>
              <Text style={styles.valueLabel}>Collection Value</Text>
              <Text style={styles.valueTotal}>{`~£${value.total.toLocaleString()}`}</Text>
            </View>
            <View style={styles.valueGrid}>
              <ValueCell v={`£${value.avg}`} l="Avg bottle" />
              <ValueCell v={`£${value.min}`} l="Cheapest" />
              <ValueCell v={`£${value.max}`} l="Priciest" />
            </View>
            <Text style={styles.dim}>{`Based on ${value.items} bottles · avg retail estimates`}</Text>
          </View>

          {visible.length ? (
            visible.map((w) => {
              const f = fragById(w.fragId);
              if (!f) return null;
              return (
                <View key={w.fragId} style={styles.collRow}>
                  <TouchableOpacity style={styles.collThumb} onPress={() => navigation.navigate('FragranceDetail', { fragId: f.id })}>
                    <BottleSVG fragrance={f} size={36} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate('FragranceDetail', { fragId: f.id })}>
                    <Text style={styles.collName}>{f.name}</Text>
                    <Text style={styles.dim}>{f.brand}</Text>
                  </TouchableOpacity>
                  <View style={{ alignItems: 'flex-end', marginRight: 8 }}>
                    <Text style={styles.wornCount}>{`${w.wornCount}x`}</Text>
                    <Text style={styles.wornLabel}>{w.lastWorn}</Text>
                  </View>
                  <TouchableOpacity style={[styles.collBtn, styles.collBtnPrimary]} onPress={() => navigation.navigate('Post', { type: 'sotd', prefillFragId: f.id })}>
                    <Text style={styles.collBtnPrimaryText}>📸</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.collBtn} onPress={() => removeFromCollection(f.id)}>
                    <Text style={styles.collBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <EmptyState>Nothing found. Tap "+ Add" to build your collection.</EmptyState>
          )}
        </>
      ) : (
        <AIAnalysisPanel onOpen={(id) => navigation.navigate('FragranceDetail', { fragId: id })} />
      )}

      {/* Add modal */}
      <Modal visible={addOpen} transparent animationType="slide" onRequestClose={() => setAddOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setAddOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHead}>
              <Text style={styles.sheetTitle}>Add To Collection</Text>
              <TouchableOpacity onPress={() => setAddOpen(false)}>
                <Text style={{ color: colors.textDim, fontSize: 22 }}>✕</Text>
              </TouchableOpacity>
            </View>
            <TextInput style={styles.search} placeholder="Search all fragrances…" placeholderTextColor={colors.textDim} value={addSearch} onChangeText={setAddSearch} />
            <ScrollView style={{ maxHeight: 380 }}>
              {addMatches.map((f) => {
                const added = wardrobeIds.has(f.id);
                return (
                  <View key={f.id} style={styles.addRow}>
                    <View style={styles.collThumb}>
                      <BottleSVG fragrance={f} size={30} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.collName}>{f.name}</Text>
                      <Text style={styles.dim}>{f.brand}</Text>
                    </View>
                    {added ? (
                      <Text style={styles.added}>✓ Added</Text>
                    ) : (
                      <TouchableOpacity style={styles.addPill} onPress={() => addToCollection(f.id)}>
                        <Text style={styles.addPillText}>+ Add</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

function ValueCell({ v, l }: { v: string; l: string }) {
  return (
    <View style={styles.valueCell}>
      <Text style={styles.valueCellV}>{v}</Text>
      <Text style={styles.valueCellL}>{l}</Text>
    </View>
  );
}

function AIAnalysisPanel({ onOpen }: { onOpen: (id: string) => void }) {
  const wardrobe = useStore((s) => s.wardrobe);
  const a = getAIAnalysis(wardrobe);
  if (a.empty) return <EmptyState>Add fragrances to your collection to get AI analysis.</EmptyState>;

  const Tiles = ({ frags }: { frags: Fragrance[] }) => (
    <View style={styles.tiles}>
      {frags.map((f) => (
        <TouchableOpacity key={f.id} style={styles.tile} onPress={() => onOpen(f.id)}>
          <BottleSVG fragrance={f} size={36} />
          <Text style={styles.tileName} numberOfLines={2}>{f.name}</Text>
          <Text style={styles.tileBrand} numberOfLines={1}>{f.brand}</Text>
          <Text style={styles.tilePrice}>{`★ ${f.rating}`}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const TierPill = ({ tier }: { tier: PriceTier }) => {
    const c = priceTierColors[tier];
    const conf = a.recs.find((r) => r.key === tier);
    return (
      <View style={[styles.tierPill, { backgroundColor: c.bg }]}>
        <Text style={[styles.tierPillText, { color: c.text }]}>{`${conf?.emoji ?? ''} ${conf?.label ?? tier}`}</Text>
      </View>
    );
  };

  return (
    <View style={{ paddingBottom: 20 }}>
      <View style={styles.aiCard}>
        <Text style={styles.aiTitle}>✨ Profile Summary</Text>
        <Text style={styles.aiBody}>
          Your collection leans <Text style={{ fontWeight: '800', color: colors.text }}>{a.tendencies[0]}</Text>
          {a.tendencies[1] ? ` with ${a.tendencies[1].toLowerCase()}.` : '.'} Average spend ~
          <Text style={{ fontWeight: '800', color: colors.text }}>{`£${a.avgPrice}`}</Text>
          {` (£${a.minP}–£${a.maxP}), placing you in the `}
          <Text style={{ fontWeight: '800', color: colors.text }}>{a.tier}</Text> bracket.
        </Text>
      </View>

      <View style={styles.aiCard}>
        <Text style={styles.aiTitle}>🔝 Most Common Notes</Text>
        {a.topNotes.map(([n, count]) => (
          <View key={n} style={styles.noteBarRow}>
            <Text style={styles.noteBarLabel} numberOfLines={1}>{n[0].toUpperCase() + n.slice(1)}</Text>
            <View style={styles.noteBarTrack}>
              <View style={[styles.noteBarFill, { width: `${Math.round((count / a.maxCount) * 100)}%` }]} />
            </View>
            <Text style={styles.noteBarCount}>{count}</Text>
          </View>
        ))}
      </View>

      <View style={styles.aiCard}>
        <Text style={styles.aiTitle}>🎯 What You'd Like</Text>
        {a.recs.map((r) => (
          <View key={r.key} style={{ marginBottom: 10 }}>
            <TierPill tier={r.key} />
            <Tiles frags={r.similar} />
          </View>
        ))}
      </View>

      <View style={styles.aiCard}>
        <Text style={styles.aiTitle}>🌍 Expand Your Palette</Text>
        {a.recs.map((r) => (
          <View key={r.key} style={{ marginBottom: 10 }}>
            <TierPill tier={r.key} />
            <Tiles frags={r.contrast} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 4 },
  h2: { color: colors.text, fontSize: 18, fontWeight: '800' },
  smallBtn: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.line, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
  smallBtnText: { color: colors.text, fontSize: 12, fontWeight: '700' },
  addBtn: { backgroundColor: colors.accent, borderColor: colors.accent },
  addBtnText: { color: '#000', fontSize: 12, fontWeight: '700' },
  search: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 12, color: colors.text, fontSize: 14, marginHorizontal: 16, marginTop: 10 },
  valueCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: 14, marginHorizontal: 16, marginVertical: 10 },
  valueHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  valueLabel: { color: colors.textDim, fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.4 },
  valueTotal: { color: colors.accent, fontSize: 20, fontWeight: '900' },
  valueGrid: { flexDirection: 'row', gap: 8 },
  valueCell: { flex: 1, backgroundColor: colors.surface2, borderRadius: 10, padding: 8, alignItems: 'center' },
  valueCellV: { color: colors.text, fontSize: 14, fontWeight: '800' },
  valueCellL: { color: colors.textDim, fontSize: 10 },
  collRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  collThumb: { width: 48, height: 48, backgroundColor: colors.surface2, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  collName: { color: colors.text, fontSize: 14, fontWeight: '700' },
  dim: { color: colors.textDim, fontSize: 11 },
  wornCount: { color: colors.accent, fontSize: 15, fontWeight: '800' },
  wornLabel: { color: colors.textDim, fontSize: 10 },
  collBtn: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.line, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6, marginLeft: 4 },
  collBtnText: { color: colors.textDim, fontSize: 11, fontWeight: '700' },
  collBtnPrimary: { backgroundColor: colors.accent, borderColor: colors.accent },
  collBtnPrimaryText: { fontSize: 11 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18, paddingBottom: 28 },
  sheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  sheetTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  added: { color: colors.accent, fontSize: 11, fontWeight: '700' },
  addPill: { backgroundColor: colors.accent, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  addPillText: { color: '#000', fontSize: 12, fontWeight: '700' },
  aiCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: 16, marginHorizontal: 16, marginTop: 12 },
  aiTitle: { color: colors.textDim, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '800', marginBottom: 10 },
  aiBody: { color: colors.text, fontSize: 13, lineHeight: 20 },
  noteBarRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 7 },
  noteBarLabel: { color: colors.text, fontSize: 12, fontWeight: '600', width: 100 },
  noteBarTrack: { flex: 1, height: 7, backgroundColor: colors.surface2, borderRadius: 6, overflow: 'hidden' },
  noteBarFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 6 },
  noteBarCount: { color: colors.textDim, fontSize: 11, width: 22, textAlign: 'right' },
  tierPill: { alignSelf: 'flex-start', borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2, marginBottom: 8 },
  tierPillText: { fontSize: 10, fontWeight: '700' },
  tiles: { flexDirection: 'row', gap: 8 },
  tile: { flex: 1, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.line, borderRadius: 12, padding: 8, alignItems: 'center' },
  tileName: { color: colors.text, fontSize: 11, fontWeight: '800', marginTop: 6, textAlign: 'center' },
  tileBrand: { color: colors.textDim, fontSize: 9, marginTop: 2 },
  tilePrice: { color: colors.accent, fontSize: 9, fontWeight: '700', marginTop: 3 },
});
