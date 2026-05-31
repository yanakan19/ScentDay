import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius } from '@/theme';
import { Screen, BackHeader } from '@/components/ui';
import BottleSVG from '@/components/BottleSVG';
import { fragById } from '@/data/fragrances';
import { POST_HISTORY } from '@/data/seed';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const START_OFFSET = 3; // May 2025 starts on a Thursday
const DAYS = 31;
const SCOPE_LABEL: Record<string, string> = { global: '🌍 Global', country: '🇬🇧 Country', local: '📍 Local' };

export default function PostHistoryScreen() {
  const [selected, setSelected] = useState<number | null>(null);
  const data = selected ? POST_HISTORY[selected] : null;
  const frag = data ? fragById(data.fragId) : undefined;

  const cells: (number | null)[] = [...Array(START_OFFSET).fill(null), ...Array.from({ length: DAYS }, (_, i) => i + 1)];

  return (
    <Screen>
      <BackHeader />
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={styles.h2}>Post History</Text>
        <Text style={styles.month}>May 2025</Text>

        <View style={styles.calRow}>
          {DAY_LABELS.map((d) => (
            <Text key={d} style={styles.dayLabel}>{d}</Text>
          ))}
        </View>
        <View style={styles.grid}>
          {cells.map((day, i) => {
            if (day === null) return <View key={`e${i}`} style={styles.cell} />;
            const hasPost = !!POST_HISTORY[day];
            return (
              <TouchableOpacity
                key={day}
                disabled={!hasPost}
                style={[styles.cell, styles.dayCell, hasPost && styles.hasPost]}
                onPress={() => setSelected(day)}
              >
                <Text style={[styles.dayNum, hasPost ? { color: '#000' } : { color: colors.textDim }]}>{day}</Text>
                {hasPost && <View style={styles.dot} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {data && frag && (
          <View style={styles.postCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={styles.thumb}><BottleSVG fragrance={frag} size={40} /></View>
              <View>
                <Text style={styles.fragName}>{frag.name}</Text>
                <Text style={styles.meta}>{`${frag.brand} · May ${selected}, 2025`}</Text>
                <Text style={styles.meta}>{SCOPE_LABEL[data.scope]}</Text>
              </View>
            </View>
            <Text style={styles.votes}>{`▲ ${data.votes} votes`}</Text>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  h2: { color: colors.text, fontSize: 18, fontWeight: '800', marginTop: 4 },
  month: { color: colors.textDim, fontSize: 12, marginBottom: 16 },
  calRow: { flexDirection: 'row' },
  dayLabel: { flex: 1, textAlign: 'center', color: colors.textDim, fontSize: 10, fontWeight: '600', paddingVertical: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, aspectRatio: 1, padding: 2 },
  dayCell: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderRadius: 10 },
  hasPost: { backgroundColor: colors.accent },
  dayNum: { fontSize: 13, fontWeight: '800' },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#000', marginTop: 2 },
  postCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: 14, marginTop: 20 },
  thumb: { width: 52, height: 52, borderRadius: 10, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  fragName: { color: colors.text, fontSize: 14, fontWeight: '700' },
  meta: { color: colors.textDim, fontSize: 11, marginTop: 3 },
  votes: { color: colors.accent, fontSize: 13, fontWeight: '700', marginTop: 6 },
});
