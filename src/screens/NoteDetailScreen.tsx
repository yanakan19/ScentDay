import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, radius } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import { Screen, BackHeader, EmptyState } from '@/components/ui';
import { FragRow } from '@/components/FragRow';
import { NOTES_DB } from '@/data/notes';
import { fragsWithNote } from '@/services/catalog';
import type { NoteInfo } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'NoteDetail'>;

export default function NoteDetailScreen({ route, navigation }: Props) {
  const { noteName } = route.params;
  let note: NoteInfo | undefined;
  for (const list of Object.values(NOTES_DB)) {
    const found = list.find((n) => n.name === noteName);
    if (found) {
      note = found;
      break;
    }
  }

  if (!note) {
    return (
      <Screen>
        <BackHeader />
        <EmptyState>Note not found.</EmptyState>
      </Screen>
    );
  }

  const frags = fragsWithNote(noteName, 8);

  return (
    <Screen>
      <BackHeader />
      <View style={styles.hero}>
        <Text style={styles.icon}>{note.icon}</Text>
        <Text style={styles.name}>{note.name}</Text>
        <Text style={styles.origin}>{note.origin}</Text>
      </View>

      <Card title="What it smells like">{note.smells}</Card>
      <Card title="Origin & Background">{note.description}</Card>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{`Popular fragrances with ${note.name}`}</Text>
        {frags.length ? (
          frags.map((f) => <FragRow key={f.id} fragrance={f} sub={f.brand} onPress={() => navigation.push('FragranceDetail', { fragId: f.id })} thumbSize={36} />)
        ) : (
          <Text style={styles.dim}>No matches in database yet.</Text>
        )}
      </View>
      <View style={{ height: 16 }} />
    </Screen>
  );
}

function Card({ title, children }: { title: string; children: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.body}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingHorizontal: 18, paddingTop: 10, paddingBottom: 4 },
  icon: { fontSize: 52, marginBottom: 10 },
  name: { color: colors.text, fontSize: 20, fontWeight: '800' },
  origin: { color: colors.textDim, fontSize: 13, marginTop: 4 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.xl, padding: 16, marginHorizontal: 16, marginVertical: 6 },
  cardTitle: { color: colors.textDim, fontSize: 13, textTransform: 'uppercase', fontWeight: '800', marginBottom: 8 },
  body: { color: colors.text, fontSize: 13, lineHeight: 21 },
  dim: { color: colors.textDim, fontSize: 13 },
});
