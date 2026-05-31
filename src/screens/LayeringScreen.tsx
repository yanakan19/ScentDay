import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius } from '@/theme';
import { Screen, TopBar, SectionCard, Quad, EmptyState } from '@/components/ui';
import BottleSVG from '@/components/BottleSVG';
import { useStore } from '@/store/useStore';
import { fragById } from '@/data/fragrances';
import { getLayerResult } from '@/services/recommendations';
import type { Fragrance } from '@/types';

export default function LayeringScreen() {
  const wardrobe = useStore((s) => s.wardrobe);
  const [baseId, setBaseId] = useState<string>('');
  const [pickerOpen, setPickerOpen] = useState(false);

  const base = baseId ? fragById(baseId) : undefined;
  const result = baseId ? getLayerResult(baseId, wardrobe) : null;
  const blendData = result ? Object.fromEntries(result.blendedSeason.map((s) => [s.label, s.value])) : {};

  return (
    <Screen>
      <TopBar />
      <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={styles.h2}>ScentBlend™</Text>
          <View style={styles.beta}>
            <Text style={styles.betaText}>BETA</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>Pick a fragrance and AI finds your best layer partner from your wardrobe.</Text>
      </View>

      {wardrobe.length < 2 ? (
        <EmptyState>Add at least 2 fragrances to your collection to get layering suggestions.</EmptyState>
      ) : (
        <>
          <SectionCard title="Base fragrance">
            <TouchableOpacity style={styles.select} onPress={() => setPickerOpen(true)}>
              <Text style={[styles.selectText, !base && { color: colors.textDim }]}>
                {base ? `${base.name} — ${base.brand}` : 'Choose from wardrobe…'}
              </Text>
              <Text style={{ color: colors.textDim }}>▾</Text>
            </TouchableOpacity>
          </SectionCard>

          {result && base && (
            <>
              <View style={styles.pair}>
                <LayerCard heading="Base" frag={base} />
                <LayerCard heading="Layer with" frag={result.partner} />
              </View>

              <SectionCard title="Shared notes">
                <View style={styles.chipsWrap}>
                  {result.shared.length ? (
                    result.shared.map((n) => (
                      <View key={n} style={styles.sharedChip}>
                        <Text style={styles.sharedChipText}>{`✨ ${n}`}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.dim}>No direct shared notes — contrasting combination</Text>
                  )}
                </View>
                <View style={styles.onlyRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.onlyLabel}>{`Only in ${base.name}`}</Text>
                    <View style={styles.chipsWrap}>
                      {result.onlyBase.map((n) => (
                        <View key={n} style={styles.onlyChip}><Text style={styles.onlyChipText}>{n}</Text></View>
                      ))}
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.onlyLabel}>{`Only in ${result.partner.name}`}</Text>
                    <View style={styles.chipsWrap}>
                      {result.onlyPartner.map((n) => (
                        <View key={n} style={styles.onlyChip}><Text style={styles.onlyChipText}>{n}</Text></View>
                      ))}
                    </View>
                  </View>
                </View>
              </SectionCard>

              <View style={styles.aiPara}>
                <Text style={styles.aiParaText}>{result.vibe}</Text>
              </View>

              <SectionCard title="Wear this combination">
                <Quad data={blendData} />
              </SectionCard>
            </>
          )}
        </>
      )}

      <Modal visible={pickerOpen} transparent animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setPickerOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.sheetTitle}>Choose a base</Text>
            <ScrollView style={{ maxHeight: 420 }}>
              {wardrobe.map((w) => {
                const f = fragById(w.fragId);
                if (!f) return null;
                return (
                  <TouchableOpacity
                    key={w.fragId}
                    style={styles.optRow}
                    onPress={() => {
                      setBaseId(w.fragId);
                      setPickerOpen(false);
                    }}
                  >
                    <View style={styles.optThumb}><BottleSVG fragrance={f} size={28} /></View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.optName}>{f.name}</Text>
                      <Text style={styles.dim}>{f.brand}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
      <View style={{ height: 16 }} />
    </Screen>
  );
}

function LayerCard({ heading, frag }: { heading: string; frag: Fragrance }) {
  return (
    <View style={styles.layerCard}>
      <Text style={styles.layerHeading}>{heading}</Text>
      <BottleSVG fragrance={frag} size={52} />
      <Text style={styles.layerName}>{frag.name}</Text>
      <Text style={styles.dim}>{frag.brand}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  h2: { color: colors.text, fontSize: 18, fontWeight: '800' },
  beta: { backgroundColor: '#7c3aed', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  betaText: { color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  subtitle: { color: colors.textDim, fontSize: 13, marginTop: 6 },
  select: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 11 },
  selectText: { color: colors.text, fontSize: 14 },
  pair: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginTop: 4 },
  layerCard: { flex: 1, backgroundColor: colors.surface2, borderRadius: radius.lg, padding: 14, alignItems: 'center', gap: 6 },
  layerHeading: { color: colors.textDim, fontSize: 13 },
  layerName: { color: colors.text, fontSize: 14, fontWeight: '800', textAlign: 'center' },
  dim: { color: colors.textDim, fontSize: 11 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  sharedChip: { backgroundColor: '#7c3aed22', borderWidth: 1, borderColor: '#7c3aed55', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  sharedChipText: { color: '#c084fc', fontSize: 12, fontWeight: '600' },
  onlyRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  onlyLabel: { color: colors.textDim, fontSize: 11, marginBottom: 6 },
  onlyChip: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.line, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  onlyChipText: { color: colors.text, fontSize: 12 },
  aiPara: { backgroundColor: colors.surface, borderLeftWidth: 3, borderLeftColor: '#7c3aed', borderRadius: 12, padding: 14, marginHorizontal: 16, marginVertical: 9 },
  aiParaText: { color: colors.text, fontSize: 13, lineHeight: 21 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18, paddingBottom: 28 },
  sheetTitle: { color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: 14 },
  optRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  optThumb: { width: 36, height: 36, borderRadius: 8, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  optName: { color: colors.text, fontSize: 14, fontWeight: '700' },
});
