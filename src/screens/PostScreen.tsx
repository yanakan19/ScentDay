import React, { useMemo, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { colors, radius } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import { Screen, BackHeader, PrimaryButton } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { FRAGRANCES, fragById } from '@/data/fragrances';
import type { Scope, Verdict } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Post'>;

const TITLES: Record<string, string> = { sotd: 'Scent of the Day', review: 'Write a Review', question: 'Ask a Question' };
const VERDICTS: { v: Verdict; label: string }[] = [
  { v: 'buy', label: '✅ Buy It' },
  { v: 'try', label: '🤔 Try First' },
  { v: 'skip', label: '❌ Skip It' },
];

export default function PostScreen({ route, navigation }: Props) {
  const { type, prefillFragId } = route.params;
  const wardrobe = useStore((s) => s.wardrobe);
  const communities = useStore((s) => s.communities);
  const submitPost = useStore((s) => s.submitPost);

  const [photo, setPhoto] = useState<string | null>(null);
  const [fragId, setFragId] = useState<string>(prefillFragId ?? '');
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<Scope>('global');
  const [communityId, setCommunityId] = useState<number | undefined>(undefined);
  const [rating, setRating] = useState(0);
  const [verdict, setVerdict] = useState<Verdict | ''>('');
  const [reviewText, setReviewText] = useState('');
  const [questionText, setQuestionText] = useState('');

  const wardrobeIds = useMemo(() => new Set(wardrobe.map((w) => w.fragId)), [wardrobe]);
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return FRAGRANCES.filter((f) => f.name.toLowerCase().includes(q) || f.brand.toLowerCase().includes(q))
      .sort((a, b) => Number(wardrobeIds.has(b.id)) - Number(wardrobeIds.has(a.id)))
      .slice(0, 12);
  }, [query, wardrobeIds]);

  const chosen = fragId ? fragById(fragId) : undefined;
  const joined = communities.filter((c) => c.joined);

  const pickPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Please allow photo access to attach an image.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!res.canceled && res.assets[0]) setPhoto(res.assets[0].uri);
  };

  const canSubmit = !!fragId && (!!photo || type === 'review');

  const onSubmit = () => {
    if (type === 'review' && !reviewText.trim()) {
      Alert.alert('Add your review', 'Please write your review before posting.');
      return;
    }
    submitPost({
      type,
      fragId,
      scope,
      photo,
      communityId,
      reviewRating: rating || undefined,
      verdict: verdict || undefined,
      reviewText: reviewText || undefined,
      questionText: questionText || undefined,
    });
    navigation.navigate('Tabs', { screen: 'Feed' });
  };

  return (
    <Screen>
      <BackHeader />
      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        <Text style={styles.title}>{TITLES[type]}</Text>

        {/* Photo */}
        <TouchableOpacity style={styles.drop} onPress={pickPhoto} activeOpacity={0.85}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.dropImg} />
          ) : (
            <>
              <Text style={{ fontSize: 40 }}>📷</Text>
              <Text style={styles.dropText}>Tap to take or choose a photo</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Fragrance search */}
        <Text style={styles.label}>Fragrance (from your collection first)</Text>
        {chosen ? (
          <View style={styles.chosen}>
            <Text style={styles.chosenName}>{`${chosen.name} — ${chosen.brand}`}</Text>
            <TouchableOpacity onPress={() => setFragId('')}>
              <Text style={{ color: colors.textDim, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Search your collection or all fragrances…"
              placeholderTextColor={colors.textDim}
              value={query}
              onChangeText={setQuery}
            />
            {results.length > 0 && (
              <View style={styles.results}>
                {results.map((f) => (
                  <TouchableOpacity
                    key={f.id}
                    style={styles.resultRow}
                    onPress={() => {
                      setFragId(f.id);
                      setQuery('');
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.resultName}>{f.name}</Text>
                      <Text style={styles.dim}>{f.brand}</Text>
                    </View>
                    {wardrobeIds.has(f.id) && <Text style={styles.inColl}>In collection</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        {/* Review fields */}
        {type === 'review' && (
          <>
            <Text style={styles.label}>Your Rating</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity key={n} onPress={() => setRating(n)}>
                  <Text style={[styles.star, n <= rating && { color: colors.star }]}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Write your review</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Share your honest thoughts on this fragrance…"
              placeholderTextColor={colors.textDim}
              value={reviewText}
              onChangeText={setReviewText}
              multiline
            />
            <Text style={styles.label}>Verdict</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {VERDICTS.map((vd) => (
                <TouchableOpacity
                  key={vd.v}
                  style={[styles.verdictBtn, verdict === vd.v && styles.verdictBtnActive]}
                  onPress={() => setVerdict(vd.v)}
                >
                  <Text style={[styles.verdictText, verdict === vd.v && { color: colors.accent }]}>{vd.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Question field */}
        {type === 'question' && (
          <>
            <Text style={styles.label}>Your Question</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Ask the community anything about this fragrance…"
              placeholderTextColor={colors.textDim}
              value={questionText}
              onChangeText={setQuestionText}
              multiline
            />
          </>
        )}

        {/* Scope */}
        <Text style={styles.label}>Post to</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {(['global', 'country', 'local'] as Scope[]).map((s) => (
            <TouchableOpacity key={s} style={[styles.scopeBtn, scope === s && styles.scopeBtnActive]} onPress={() => setScope(s)}>
              <Text style={[styles.scopeText, scope === s && { color: colors.accent }]}>
                {s === 'global' ? '🌍 Global' : s === 'country' ? '🇬🇧 Country' : '📍 Local'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Community */}
        {type !== 'review' && joined.length > 0 && (
          <>
            <Text style={styles.label}>Also post to a community?</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <TouchableOpacity style={[styles.commChip, !communityId && styles.commChipActive]} onPress={() => setCommunityId(undefined)}>
                <Text style={[styles.commChipText, !communityId && { color: colors.accent }]}>No community</Text>
              </TouchableOpacity>
              {joined.map((c) => (
                <TouchableOpacity key={c.id} style={[styles.commChip, communityId === c.id && styles.commChipActive]} onPress={() => setCommunityId(c.id)}>
                  <Text style={[styles.commChipText, communityId === c.id && { color: colors.accent }]}>{c.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <PrimaryButton label="Post" onPress={onSubmit} disabled={!canSubmit} style={{ marginTop: 22 }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 18, fontWeight: '700', marginVertical: 12 },
  drop: {
    width: '100%',
    aspectRatio: 1,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.line,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    overflow: 'hidden',
  },
  dropImg: { width: '100%', height: '100%' },
  dropText: { color: colors.textDim },
  label: { color: colors.textDim, fontSize: 13, fontWeight: '600', marginTop: 16, marginBottom: 7 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12, color: colors.text, fontSize: 14 },
  textarea: { minHeight: 90, textAlignVertical: 'top' },
  results: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, marginTop: 4, overflow: 'hidden' },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  resultName: { color: colors.text, fontSize: 13, fontWeight: '700' },
  dim: { color: colors.textDim, fontSize: 11 },
  inColl: { color: colors.accent, fontSize: 10, fontWeight: '700' },
  chosen: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface2, borderRadius: radius.md, padding: 12 },
  chosenName: { color: colors.text, fontSize: 13, fontWeight: '700', flex: 1 },
  star: { fontSize: 28, color: colors.line },
  verdictBtn: { flex: 1, paddingVertical: 9, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, alignItems: 'center' },
  verdictBtnActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  verdictText: { color: colors.textDim, fontSize: 12, fontWeight: '700' },
  scopeBtn: { flex: 1, paddingVertical: 11, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, alignItems: 'center' },
  scopeBtnActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  scopeText: { color: colors.textDim, fontSize: 13, fontWeight: '600' },
  commChip: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: colors.line, borderRadius: 20, backgroundColor: colors.surface },
  commChipActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  commChipText: { color: colors.textDim, fontSize: 12, fontWeight: '600' },
});
