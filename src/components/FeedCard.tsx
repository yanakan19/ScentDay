import React, { useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius, spacing } from '@/theme';
import type { Comment, Post, Scope } from '@/types';
import { fragById } from '@/data/fragrances';
import { useStore } from '@/store/useStore';
import { Avatar } from '@/components/ui';
import BottleSVG from '@/components/BottleSVG';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SCOPE_LABEL: Record<Scope, string> = {
  global: '🌍 Global',
  country: '🇬🇧 Country',
  local: '📍 Local',
};

export function FeedCard({ post }: { post: Post }) {
  const navigation = useNavigation<Nav>();
  const toggleVote = useStore((s) => s.toggleVote);
  const addComment = useStore((s) => s.addComment);
  const voteComment = useStore((s) => s.voteComment);
  const dropsTotal = useStore((s) => s.dropsTotal);

  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState('');
  const [zoom, setZoom] = useState(false);

  const frag = fragById(post.fragId);
  const fragName = frag?.name ?? post.fragName ?? 'Unknown';
  const brand = frag?.brand ?? '';

  const openDetail = () => navigation.push('FragranceDetail', { fragId: post.fragId });

  const userLabel = post.user === 'you' ? `you 💧${dropsTotal()}` : post.user;

  const sendComment = () => {
    if (!draft.trim()) return;
    addComment(post.id, draft);
    setDraft('');
  };

  const shown = post.comments.slice(0, 2);
  const extra = post.comments.length - shown.length;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Avatar name={post.user} size={34} />
        <View style={{ flex: 1 }}>
          <Text style={styles.user}>{userLabel}</Text>
          <Text style={styles.time}>{`${post.time} ago`}</Text>
        </View>
      </View>

      {/* Media — tapping a real photo enlarges it standalone; placeholder falls back to the profile */}
      <TouchableOpacity activeOpacity={0.9} onPress={() => (post.photo ? setZoom(true) : openDetail())}>
        {post.photo ? (
          <Image source={{ uri: post.photo }} style={styles.media} resizeMode="cover" />
        ) : (
          <View style={[styles.media, styles.placeholder]}>
            {frag ? <BottleSVG fragrance={frag} size={90} /> : null}
            <Text style={styles.placeholderLabel}>{brand}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Body — only the fragrance name opens the perfume profile */}
      <View style={styles.body}>
        <TouchableOpacity onPress={openDetail} activeOpacity={0.7}>
          <Text style={styles.fragLine}>
            {fragName}
            {brand ? <Text style={styles.brandDim}>{` · ${brand}`}</Text> : null}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Enlarged photo viewer */}
      {post.photo ? (
        <Modal visible={zoom} transparent animationType="fade" onRequestClose={() => setZoom(false)}>
          <Pressable style={styles.zoomBackdrop} onPress={() => setZoom(false)}>
            <Image source={{ uri: post.photo }} style={styles.zoomImg} resizeMode="contain" />
          </Pressable>
        </Modal>
      ) : null}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.voteBtn} onPress={() => toggleVote(post.id)}>
          <Text style={[styles.voteText, post.voted && { color: colors.accent }]}>
            {`${post.voted ? '▲' : '△'} ${post.votes}`}
          </Text>
        </TouchableOpacity>
        <View style={styles.scopePill}>
          <Text style={styles.scopePillText}>{SCOPE_LABEL[post.scope]}</Text>
        </View>
      </View>

      {/* Comments toggle */}
      <TouchableOpacity onPress={() => setExpanded((v) => !v)}>
        <Text style={styles.commentToggle}>
          {`💬 ${post.comments.length} comments — tap to ${expanded ? 'hide' : 'view'}`}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.commentsWrap}>
          {shown.map((c: Comment) => (
            <View key={c.id} style={styles.commentRow}>
              <Avatar name={c.user} size={26} />
              <View style={{ flex: 1 }}>
                <Text style={styles.commentUser}>{`@${c.user}`}</Text>
                <Text style={styles.commentText}>{c.text}</Text>
                <Text style={styles.commentTime}>{`${c.time} ago`}</Text>
              </View>
              <TouchableOpacity onPress={() => voteComment(post.id, c.id)} style={styles.heartBtn}>
                <Text style={[styles.heartText, c.voted && { color: colors.heart }]}>
                  {`❤️ ${c.votes}`}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
          {extra > 0 && <Text style={styles.moreComments}>{`+${extra} more comments`}</Text>}

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment…"
              placeholderTextColor={colors.textDim}
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={sendComment}
              returnKeyType="send"
            />
            <TouchableOpacity style={styles.sendBtn} onPress={sendComment}>
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xl,
    marginVertical: 14,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: spacing.md },
  user: { color: colors.text, fontSize: 14, fontWeight: '700' },
  time: { color: colors.textDim, fontSize: 12 },
  media: { width: '100%', aspectRatio: 1, backgroundColor: colors.surface2 },
  placeholder: { alignItems: 'center', justifyContent: 'center', gap: 8 },
  placeholderLabel: { color: colors.textDim, fontSize: 13, fontWeight: '600' },
  body: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  fragLine: { color: colors.text, fontSize: 15, fontWeight: '700' },
  brandDim: { color: colors.textDim, fontWeight: '500' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: spacing.md },
  voteBtn: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  voteText: { color: colors.text, fontSize: 13, fontWeight: '700' },
  scopePill: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  scopePillText: { color: colors.textDim, fontSize: 12, fontWeight: '600' },
  commentToggle: {
    color: colors.textDim,
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  commentsWrap: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    padding: spacing.md,
    gap: 12,
  },
  commentRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  commentUser: { color: colors.text, fontSize: 13, fontWeight: '700' },
  commentText: { color: colors.text, fontSize: 13, marginTop: 2 },
  commentTime: { color: colors.textDim, fontSize: 11, marginTop: 2 },
  heartBtn: { paddingLeft: 6 },
  heartText: { color: colors.textDim, fontSize: 12, fontWeight: '600' },
  moreComments: { color: colors.textDim, fontSize: 12, fontWeight: '600' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: {
    flex: 1,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.text,
    fontSize: 13,
  },
  sendBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  sendText: { color: '#000', fontSize: 13, fontWeight: '700' },
  zoomBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', alignItems: 'center', justifyContent: 'center' },
  zoomImg: { width: '100%', height: '100%' },
});
