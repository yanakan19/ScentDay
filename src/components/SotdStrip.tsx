import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius } from '@/theme';
import { useStore } from '@/store/useStore';
import { fragById } from '@/data/fragrances';
import { userById } from '@/data/users';
import BottleSVG from '@/components/BottleSVG';
import type { FriendSotd } from '@/types';

type Filter = 'friends' | 'following' | 'all';

/** Friends' Scent-of-the-Day bubble strip (Feed). */
export function SotdStrip({ onCheckIn }: { onCheckIn: () => void }) {
  const friendSotds = useStore((s) => s.friendSotds);
  const mySotd = useStore((s) => s.mySotd);
  const toggleSotdLike = useStore((s) => s.toggleSotdLike);
  const isFriend = useStore((s) => s.isFriend);
  const isFollowing = useStore((s) => s.isFollowing);
  const [filter, setFilter] = useState<Filter>('following');

  const shown: FriendSotd[] =
    filter === 'all'
      ? [...friendSotds].sort((a, b) => Number(b.liked) - Number(a.liked))
      : friendSotds.filter((s) => (filter === 'friends' ? isFriend(s.user) || s.user === 'you' : isFollowing(s.user) || s.user === 'you'));

  const myName = mySotd ? fragById(mySotd)?.name : undefined;

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Text style={styles.title}>Friends SOTD</Text>
        {myName ? <Text style={styles.today}>{`Today: ${myName}`}</Text> : null}
      </View>

      <View style={styles.filterRow}>
        {(
          [
            { k: 'friends', l: '👫 Friends' },
            { k: 'following', l: '➕ Following' },
            { k: 'all', l: '🌍 All' },
          ] as { k: Filter; l: string }[]
        ).map((f) => (
          <TouchableOpacity
            key={f.k}
            style={[styles.filterPill, filter === f.k && styles.filterPillActive]}
            onPress={() => setFilter(f.k)}
          >
            <Text style={[styles.filterText, filter === f.k && { color: '#000' }]}>{f.l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {shown.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bubbleRow}>
          {shown.map((s) => {
            const frag = fragById(s.fragId);
            const label = s.user === 'you' ? 'You' : userById(s.user)?.name ?? s.user;
            return (
              <TouchableOpacity key={s.user + s.fragId} style={styles.bubble} onPress={() => toggleSotdLike(s.user)}>
                <View style={[styles.avatar, s.liked && { borderColor: colors.heart }]}>
                  {frag ? <BottleSVG fragrance={frag} size={36} /> : null}
                  <Text style={styles.heart}>{s.liked ? '❤️' : '🤍'}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingTop: 6 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { color: colors.textDim, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
  today: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  filterRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  filterPill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  filterPillActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  filterText: { color: colors.textDim, fontSize: 11, fontWeight: '700' },
  bubbleRow: { gap: 10, paddingBottom: 4 },
  bubble: { width: 74, alignItems: 'center', gap: 5 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heart: { position: 'absolute', bottom: -2, right: -2, fontSize: 14 },
  name: { fontSize: 10, color: colors.textDim, maxWidth: 70 },
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
});
