import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import type { FeedTab } from '@/types';
import { Screen, TopBar, ScopeTabs, EmptyState } from '@/components/ui';
import { FeedCard } from '@/components/FeedCard';
import { SotdStrip } from '@/components/SotdStrip';
import BottleSVG from '@/components/BottleSVG';
import { useStore } from '@/store/useStore';
import { fragById } from '@/data/fragrances';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TABS = [
  { key: 'global', label: '🌍 Global' },
  { key: 'country', label: '🇬🇧 Country' },
  { key: 'following', label: '➕ Following' },
  { key: 'friends', label: '👫 Friends' },
];

export default function FeedScreen() {
  const navigation = useNavigation<Nav>();
  const [tab, setTab] = useState<FeedTab>('global');
  const [checkInOpen, setCheckInOpen] = useState(false);

  const posts = useStore((s) => s.posts);
  const following = useStore((s) => s.following);
  const followers = useStore((s) => s.followers);
  const communities = useStore((s) => s.communities);
  const wardrobe = useStore((s) => s.wardrobe);
  const mySotd = useStore((s) => s.mySotd);
  const sotdNotifDismissed = useStore((s) => s.sotdNotifDismissed);
  const dismissSotdNotif = useStore((s) => s.dismissSotdNotif);
  const checkInSotd = useStore((s) => s.checkInSotd);
  const joinCommunity = useStore((s) => s.joinCommunity);

  const visible = posts
    .filter((p) => {
      if (tab === 'global' || tab === 'country') return p.scope === tab;
      if (tab === 'following') return following.includes(p.user) || p.user === 'you';
      return (following.includes(p.user) && followers.includes(p.user)) || p.user === 'you';
    })
    .sort((a, b) => b.votes - a.votes);

  const joined = communities.filter((c) => c.joined);
  const suggestions = communities.filter((c) => !c.joined).slice(0, 2);
  const sortedWardrobe = [...wardrobe].sort((a, b) => b.wornCount - a.wornCount);

  const doCheckIn = (fragId: string) => {
    checkInSotd(fragId);
    setCheckInOpen(false);
  };

  return (
    <Screen>
      <TopBar />
      <ScopeTabs tabs={TABS} active={tab} onChange={(k) => setTab(k as FeedTab)} />

      {/* SOTD daily notification */}
      {!mySotd && !sotdNotifDismissed && (
        <TouchableOpacity style={styles.notif} activeOpacity={0.9} onPress={() => setCheckInOpen(true)}>
          <Text style={{ fontSize: 26 }}>🌅</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.notifTitle}>Set your Scent of the Day</Text>
            <Text style={styles.notifSub}>What are you wearing today? Let your followers know</Text>
          </View>
          <Pressable style={styles.notifDismiss} onPress={dismissSotdNotif}>
            <Text style={{ color: '#fff', fontSize: 14 }}>✕</Text>
          </Pressable>
        </TouchableOpacity>
      )}

      <SotdStrip onCheckIn={() => setCheckInOpen(true)} />

      {/* Inline communities */}
      <View style={styles.commWrap}>
        <View style={styles.commHead}>
          <Text style={styles.commHeadTitle}>My Communities</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Communities')}>
            <Text style={styles.seeAll}>See all →</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {joined.length ? (
            joined.map((c) => (
              <TouchableOpacity key={c.id} style={[styles.commPill, styles.commPillJoined]} onPress={() => navigation.navigate('CommunityDetail', { communityId: c.id })}>
                <Text style={[styles.commPillText, { color: colors.accent }]}>{c.name}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.dim}>No communities joined yet.</Text>
          )}
        </ScrollView>
      </View>
      {suggestions.map((c) => (
        <View key={c.id} style={styles.suggestion}>
          <Text style={{ fontSize: 22 }}>👥</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.suggestName}>{c.name}</Text>
            <Text style={styles.dim}>{`${c.members.toLocaleString()} members`}</Text>
          </View>
          <TouchableOpacity style={styles.joinBtn} onPress={() => joinCommunity(c.id)}>
            <Text style={styles.joinBtnText}>Join</Text>
          </TouchableOpacity>
        </View>
      ))}
      <View style={styles.divider} />

      {/* Feed */}
      {visible.length ? (
        visible.map((p) => <FeedCard key={p.id} post={p} />)
      ) : (
        <EmptyState>No posts in this feed yet.{'\n'}Be the first — tap the ➕ button!</EmptyState>
      )}

      {/* Check-in modal */}
      <Modal visible={checkInOpen} transparent animationType="slide" onRequestClose={() => setCheckInOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setCheckInOpen(false)}>
          <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>What are you wearing today?</Text>
            <ScrollView style={{ maxHeight: 400 }}>
              {sortedWardrobe.map((w) => {
                const f = fragById(w.fragId);
                if (!f) return null;
                return (
                  <TouchableOpacity key={w.fragId} style={styles.fragOpt} onPress={() => doCheckIn(w.fragId)}>
                    <View style={styles.optThumb}>
                      <BottleSVG fragrance={f} size={28} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.optName}>{f.name}</Text>
                      <Text style={styles.dim}>{f.brand}</Text>
                    </View>
                    <Text style={styles.dim}>{`Worn ${w.wornCount}x`}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setCheckInOpen(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  notif: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#5b2bd6',
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: radius.lg,
    padding: 14,
  },
  notifTitle: { color: '#fff', fontSize: 14, fontWeight: '800' },
  notifSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 },
  notifDismiss: { backgroundColor: 'rgba(255,255,255,0.2)', width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  commWrap: { paddingHorizontal: 16, paddingTop: 12 },
  commHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  commHeadTitle: { color: colors.textDim, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: '700' },
  seeAll: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  commPill: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  commPillJoined: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  commPillText: { color: colors.text, fontSize: 13, fontWeight: '600' },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 10,
  },
  suggestName: { color: colors.text, fontSize: 13, fontWeight: '700' },
  dim: { color: colors.textDim, fontSize: 11 },
  joinBtn: { backgroundColor: colors.accent, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  joinBtnText: { color: '#000', fontSize: 12, fontWeight: '700' },
  divider: { height: 1, backgroundColor: colors.line, marginHorizontal: 16, marginTop: 12 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 32 },
  modalTitle: { color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: 14 },
  fragOpt: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  optThumb: { width: 36, height: 36, borderRadius: 8, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  optName: { color: colors.text, fontSize: 14, fontWeight: '700' },
  cancelBtn: { marginTop: 14, padding: 12, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, alignItems: 'center' },
  cancelText: { color: colors.textDim, fontSize: 14, fontWeight: '600' },
});
