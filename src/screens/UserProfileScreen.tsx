import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, radius } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import { Screen, BackHeader, Avatar, EmptyState } from '@/components/ui';
import BottleSVG from '@/components/BottleSVG';
import { useStore } from '@/store/useStore';
import { userById } from '@/data/users';
import { fragById } from '@/data/fragrances';

type Props = NativeStackScreenProps<RootStackParamList, 'UserProfile'>;

export default function UserProfileScreen({ route, navigation }: Props) {
  const { userId } = route.params;
  const u = userById(userId);
  const posts = useStore((s) => s.posts);
  const toggleFollow = useStore((s) => s.toggleFollow);
  const isFollowing = useStore((s) => s.isFollowing);
  const isFriend = useStore((s) => s.isFriend);

  if (!u) {
    return (
      <Screen>
        <BackHeader />
        <EmptyState>User not found.</EmptyState>
      </Screen>
    );
  }

  const userPosts = posts.filter((p) => p.user === userId).slice(0, 6);
  const followLabel = isFriend(userId) ? '👫 Friends' : isFollowing(userId) ? 'Following' : '+ Follow';
  const following = isFollowing(userId);

  return (
    <Screen>
      <BackHeader />
      <View style={{ paddingHorizontal: 18 }}>
        <View style={styles.hero}>
          <Avatar name={u.name} size={76} />
          <Text style={styles.handle}>{`@${u.id}`}</Text>
          <Text style={styles.location}>{`📍 ${u.location}`}</Text>
          <Text style={styles.bio}>{u.bio}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.followBtn, following && styles.followBtnActive]} onPress={() => toggleFollow(u.id)}>
              <Text style={[styles.followText, following && { color: colors.textDim }]}>{followLabel}</Text>
            </TouchableOpacity>
            <View style={styles.dropsPill}>
              <Text style={styles.dropsText}>{`💧 ${u.drops}`}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsCard}>
          <Stat value={u.posts} label="Posts" />
          <Stat value={u.fragCount} label="Bottles" />
          <Stat value={u.drops} label="Drops" />
        </View>

        {userPosts.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent Posts</Text>
            <View style={styles.grid}>
              {userPosts.map((p) => {
                const f = fragById(p.fragId);
                return (
                  <TouchableOpacity key={p.id} style={styles.gridCell} onPress={() => navigation.push('FragranceDetail', { fragId: p.fragId })}>
                    {f ? <BottleSVG fragrance={f} size={36} /> : <Text>🧴</Text>}
                    <Text style={styles.gridName} numberOfLines={1}>{f?.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </View>
    </Screen>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginVertical: 20 },
  handle: { color: colors.text, fontSize: 19, fontWeight: '800', marginTop: 12 },
  location: { color: colors.textDim, fontSize: 12, marginTop: 4 },
  bio: { color: colors.text, fontSize: 13, marginTop: 8, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 6, marginTop: 12 },
  followBtn: { backgroundColor: colors.accent, borderWidth: 1, borderColor: colors.accent, borderRadius: 20, paddingHorizontal: 22, paddingVertical: 9 },
  followBtnActive: { backgroundColor: colors.surface2, borderColor: colors.line },
  followText: { color: '#000', fontSize: 13, fontWeight: '700' },
  dropsPill: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.line, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9 },
  dropsText: { color: colors.text, fontSize: 13, fontWeight: '700' },
  statsCard: { flexDirection: 'row', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: 16, marginBottom: 16 },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: colors.accent },
  statLabel: { fontSize: 11, color: colors.textDim, marginTop: 4 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: 14 },
  cardTitle: { color: colors.textDim, fontSize: 12, textTransform: 'uppercase', fontWeight: '800', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gridCell: { width: '31%', alignItems: 'center', backgroundColor: colors.surface2, borderRadius: 10, padding: 8, gap: 4 },
  gridName: { fontSize: 9, color: colors.textDim, textAlign: 'center' },
});
