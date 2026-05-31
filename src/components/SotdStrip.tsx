import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius } from '@/theme';
import { useStore } from '@/store/useStore';
import { fragById } from '@/data/fragrances';
import { userById } from '@/data/users';
import BottleSVG from '@/components/BottleSVG';
import { SOTD_REACTIONS, type FriendSotd, type FeedTab } from '@/types';

/**
 * Friends' Scent-of-the-Day strip (Feed).
 * #10: list is synced to the Feed's current tab (no separate filter).
 * #11: tap a bubble to pick an emoji reaction; the reaction renders on top of
 *      the bottle image (not clipped) and images are ~2x larger.
 */
export function SotdStrip({ onCheckIn, feedTab }: { onCheckIn: () => void; feedTab: FeedTab }) {
  const friendSotds = useStore((s) => s.friendSotds);
  const mySotd = useStore((s) => s.mySotd);
  const setSotdReaction = useStore((s) => s.setSotdReaction);
  const isFriend = useStore((s) => s.isFriend);
  const isFollowing = useStore((s) => s.isFollowing);
  const [pickerFor, setPickerFor] = useState<string | null>(null);

  const shown: FriendSotd[] =
    feedTab === 'friends'
      ? friendSotds.filter((s) => isFriend(s.user) || s.user === 'you')
      : feedTab === 'following'
      ? friendSotds.filter((s) => isFollowing(s.user) || s.user === 'you')
      : friendSotds; // global / country → everyone

  const myName = mySotd ? fragById(mySotd)?.name : undefined;
  const reactionOf = (s: FriendSotd) => s.reaction ?? (s.liked ? '❤️' : null);

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Text style={styles.title}>Friends SOTD</Text>
        {myName ? <Text style={styles.today}>{`Today: ${myName}`}</Text> : null}
      </View>

      {shown.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bubbleRow}>
          {shown.map((s) => {
            const frag = fragById(s.fragId);
            const label = s.user === 'you' ? 'You' : userById(s.user)?.name ?? s.user;
            const reaction = reactionOf(s);
            return (
              <TouchableOpacity key={s.user + s.fragId} style={styles.bubble} activeOpacity={0.8} onPress={() => setPickerFor(s.user)}>
                <View style={styles.avatar}>{frag ? <BottleSVG fragrance={frag} size={64} /> : null}</View>
                {/* reaction badge rendered OUTSIDE the clipped avatar */}
                <View style={styles.reactBadge}>
                  <Text style={styles.reactBadgeText}>{reaction ?? '＋'}</Text>
                </View>
                <Text style={styles.name} numberOfLines={1}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <Text style={styles.emptyHint}>Nobody in this group has checked in yet.</Text>
      )}

      {!mySotd && (
        <TouchableOpacity style={styles.checkin} onPress={onCheckIn}>
          <Text style={{ fontSize: 24 }}>🌅</Text>
          <View>
            <Text style={styles.checkinText}>Check in your scent today</Text>
            <Text style={styles.checkinSub}>What are you wearing right now?</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Emoji reaction picker (overlay — never clipped) */}
      <Modal visible={pickerFor !== null} transparent animationType="fade" onRequestClose={() => setPickerFor(null)}>
        <Pressable style={styles.pickerBackdrop} onPress={() => setPickerFor(null)}>
          <View style={styles.pickerBar}>
            {SOTD_REACTIONS.map((e) => (
              <TouchableOpacity
                key={e}
                style={styles.pickerEmojiBtn}
                onPress={() => {
                  if (pickerFor) setSotdReaction(pickerFor, e);
                  setPickerFor(null);
                }}
              >
                <Text style={styles.pickerEmoji}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingTop: 6 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { color: colors.textDim, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
  today: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  bubbleRow: { gap: 14, paddingBottom: 6, paddingTop: 4 },
  bubble: { width: 104, alignItems: 'center', gap: 6 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  reactBadge: {
    position: 'absolute',
    top: 64,
    right: 6,
    minWidth: 30,
    height: 30,
    borderRadius: 15,
    paddingHorizontal: 4,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    elevation: 5,
  },
  reactBadgeText: { fontSize: 15 },
  name: { fontSize: 11, color: colors.textDim, maxWidth: 96 },
  emptyHint: { color: colors.textDim, fontSize: 13, paddingVertical: 4 },
  checkin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.line,
    borderRadius: radius.xl,
    padding: 12,
    marginTop: 10,
  },
  checkinText: { color: colors.text, fontSize: 13, fontWeight: '600' },
  checkinSub: { color: colors.textDim, fontSize: 11, marginTop: 2 },
  pickerBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  pickerBar: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pickerEmojiBtn: { padding: 4 },
  pickerEmoji: { fontSize: 30 },
});
