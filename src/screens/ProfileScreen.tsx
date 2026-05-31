import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import { Screen, BackHeader, SectionCard, Avatar } from '@/components/ui';
import BottleSVG from '@/components/BottleSVG';
import { useStore } from '@/store/useStore';
import { ME, userById } from '@/data/users';
import { fragById } from '@/data/fragrances';
import { DROP_RULES } from '@/data/seed';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type ModalKind = null | 'followers' | 'following' | 'drops';

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const wardrobe = useStore((s) => s.wardrobe);
  const posts = useStore((s) => s.posts);
  const following = useStore((s) => s.following);
  const followers = useStore((s) => s.followers);
  const drops = useStore((s) => s.drops);
  const [modal, setModal] = useState<ModalKind>(null);

  const top3 = wardrobe.slice(0, 3);
  const mine = posts.filter((p) => p.user === 'you');
  const gridPosts = (mine.length >= 3 ? mine : [...mine, ...posts.filter((p) => p.user !== 'you')]).slice(0, 3);

  return (
    <Screen>
      <BackHeader />
      <View style={{ paddingHorizontal: 18 }}>
        <View style={styles.heroCenter}>
          <View style={styles.bigAvatar}>
            <Text style={styles.bigAvatarText}>{ME.initial}</Text>
          </View>
          <Text style={styles.name}>{ME.name}</Text>
          <Text style={styles.tagline}>{ME.tagline}</Text>
          <TouchableOpacity style={styles.dropsPill} onPress={() => setModal('drops')}>
            <Text style={{ fontSize: 14 }}>💧</Text>
            <Text style={styles.dropsNum}>{drops.total}</Text>
            <Text style={styles.dropsLabel}>Drops</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsCard}>
          <Stat value={ME.postCount} label="Posts" />
          <Stat value={followers.length} label="Followers" onPress={() => setModal('followers')} />
          <Stat value={following.length} label="Following" onPress={() => setModal('following')} />
        </View>

        <SectionCard title="About">
          <Text style={styles.about}>{ME.about}</Text>
        </SectionCard>

        <SectionCard
          title="My Wardrobe"
          right={
            <TouchableOpacity onPress={() => navigation.navigate('Wardrobe')}>
              <Text style={styles.link}>See all →</Text>
            </TouchableOpacity>
          }
        >
          <View style={styles.grid}>
            {top3.map((w) => {
              const f = fragById(w.fragId);
              if (!f) return null;
              return (
                <TouchableOpacity key={w.fragId} style={styles.gridCell} onPress={() => navigation.navigate('FragranceDetail', { fragId: f.id })}>
                  <BottleSVG fragrance={f} size={44} />
                  <Text style={styles.gridName} numberOfLines={2}>{f.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </SectionCard>

        <SectionCard title="Recent Posts">
          <View style={styles.grid}>
            {gridPosts.map((p) => {
              const f = fragById(p.fragId);
              return (
                <TouchableOpacity key={p.id} style={styles.gridCell} onPress={() => navigation.navigate('PostHistory')}>
                  {f ? <BottleSVG fragrance={f} size={44} /> : <Text>🧴</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity style={styles.historyBtn} onPress={() => navigation.navigate('PostHistory')}>
            <Text style={styles.historyText}>View post history →</Text>
          </TouchableOpacity>
        </SectionCard>
      </View>

      {/* Followers / Following modal */}
      <Modal visible={modal === 'followers' || modal === 'following'} transparent animationType="slide" onRequestClose={() => setModal(null)}>
        <Pressable style={styles.backdrop} onPress={() => setModal(null)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHead}>
              <Text style={styles.sheetTitle}>
                {modal === 'followers' ? `Followers (${followers.length})` : `Following (${following.length})`}
              </Text>
              <TouchableOpacity onPress={() => setModal(null)}>
                <Text style={{ color: colors.textDim, fontSize: 22 }}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 420 }}>
              {(modal === 'followers' ? followers : following).map((uid) => {
                const u = userById(uid);
                return (
                  <View key={uid} style={styles.userRow}>
                    <Avatar name={u?.name ?? uid} size={40} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.userName}>{`@${uid}`}</Text>
                      <Text style={styles.dim}>{u?.bio}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.viewBtn}
                      onPress={() => {
                        setModal(null);
                        navigation.navigate('UserProfile', { userId: uid });
                      }}
                    >
                      <Text style={styles.viewText}>View</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Drops modal */}
      <Modal visible={modal === 'drops'} transparent animationType="slide" onRequestClose={() => setModal(null)}>
        <Pressable style={styles.backdrop} onPress={() => setModal(null)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHead}>
              <View>
                <Text style={styles.sheetTitle}>💧 Drops</Text>
                <Text style={styles.dim}>Your community contribution score</Text>
              </View>
              <Text style={styles.dropsTotalBig}>{drops.total}</Text>
            </View>
            <ScrollView style={{ maxHeight: 420 }}>
              {DROP_RULES.map((r) => {
                const count = drops.breakdown[r.key] || 0;
                const earned = count * r.pts;
                return (
                  <View key={r.key} style={styles.dropRow}>
                    <Text style={{ fontSize: 22, width: 32, textAlign: 'center' }}>{r.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.userName}>{r.label}</Text>
                      <Text style={styles.dim}>{`${r.pts} drop${r.pts !== 1 ? 's' : ''} each · ${r.desc}`}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.earned, earned ? { color: colors.accent } : { color: colors.textDim }]}>{earned}</Text>
                      <Text style={styles.dim}>{`${count} action${count !== 1 ? 's' : ''}`}</Text>
                    </View>
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

function Stat({ value, label, onPress }: { value: number; label: string; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.stat} disabled={!onPress} onPress={onPress}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  heroCenter: { alignItems: 'center', marginVertical: 16 },
  bigAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  bigAvatarText: { color: '#000', fontSize: 36, fontWeight: '800' },
  name: { color: colors.text, fontSize: 20, fontWeight: '800' },
  tagline: { color: colors.textDim, fontSize: 12, marginTop: 4 },
  dropsPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.line, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginTop: 8 },
  dropsNum: { fontWeight: '800', fontSize: 14, color: colors.text },
  dropsLabel: { fontSize: 12, color: colors.textDim },
  statsCard: { flexDirection: 'row', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.xl, padding: 16, marginBottom: 4 },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: colors.accent },
  statLabel: { fontSize: 11, color: colors.textDim, marginTop: 4 },
  about: { color: colors.text, fontSize: 13, lineHeight: 20 },
  link: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  grid: { flexDirection: 'row', gap: 8 },
  gridCell: { flex: 1, alignItems: 'center', backgroundColor: colors.surface2, borderRadius: 10, padding: 8, gap: 2 },
  gridName: { fontSize: 9, color: colors.textDim, textAlign: 'center' },
  historyBtn: { marginTop: 14, padding: 10, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, alignItems: 'center' },
  historyText: { color: colors.textDim, fontSize: 13, fontWeight: '600' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18, paddingBottom: 28 },
  sheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sheetTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.line },
  userName: { color: colors.text, fontSize: 14, fontWeight: '700' },
  dim: { color: colors.textDim, fontSize: 11 },
  viewBtn: { backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.line, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  viewText: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  dropsTotalBig: { color: colors.accent, fontSize: 28, fontWeight: '900' },
  dropRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  earned: { fontSize: 14, fontWeight: '800' },
});
