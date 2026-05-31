import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, radius } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import { Screen, BackHeader, Avatar, EmptyState } from '@/components/ui';
import BottleSVG from '@/components/BottleSVG';
import { useStore } from '@/store/useStore';
import { fragById } from '@/data/fragrances';
import { COMMUNITY_ICONS } from '@/data/communities';

type Props = NativeStackScreenProps<RootStackParamList, 'CommunityDetail'>;

export default function CommunityDetailScreen({ route, navigation }: Props) {
  const { communityId } = route.params;
  const communities = useStore((s) => s.communities);
  const communityPosts = useStore((s) => s.communityPosts);
  const joinCommunity = useStore((s) => s.joinCommunity);
  const likeCommunityPost = useStore((s) => s.likeCommunityPost);

  const c = communities.find((x) => x.id === communityId);
  const posts = communityPosts[communityId] || [];

  if (!c) {
    return (
      <Screen>
        <BackHeader />
        <EmptyState>Community not found.</EmptyState>
      </Screen>
    );
  }

  return (
    <Screen>
      <BackHeader />
      <View style={{ paddingHorizontal: 16 }}>
        <View style={styles.header}>
          <View style={styles.icon}><Text style={{ fontSize: 26 }}>{COMMUNITY_ICONS[c.id] ?? '👥'}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{c.name}</Text>
            <Text style={styles.dim}>{`${c.members.toLocaleString()} members`}</Text>
          </View>
          <TouchableOpacity style={[styles.joinBtn, c.joined && styles.joinedBtn]} onPress={() => joinCommunity(c.id)}>
            <Text style={[styles.joinText, c.joined && { color: colors.textDim }]}>{c.joined ? 'Joined' : 'Join'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.desc}>{c.description}</Text>

        <Text style={styles.sectionLabel}>Recent Posts</Text>
        {posts.length ? (
          posts.map((p) => {
            const f = fragById(p.fragId);
            return (
              <View key={p.id} style={styles.postCard}>
                <View style={styles.postHead}>
                  <Avatar name={p.user} size={32} />
                  <View>
                    <Text style={styles.postUser}>{`@${p.user}`}</Text>
                    <Text style={styles.dim}>{`${p.time} ago`}</Text>
                  </View>
                </View>
                {f && (
                  <TouchableOpacity style={styles.fragChip} onPress={() => navigation.navigate('FragranceDetail', { fragId: f.id })}>
                    <BottleSVG fragrance={f} size={32} />
                    <View>
                      <Text style={styles.fragName}>{f.name}</Text>
                      <Text style={styles.dim}>{f.brand}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                <Text style={styles.postText}>{p.text}</Text>
                <TouchableOpacity style={styles.likeBtn} onPress={() => likeCommunityPost(c.id, p.id)}>
                  <Text style={styles.likeText}>{`${p.liked ? '❤️' : '🤍'} ${p.likes}`}</Text>
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <EmptyState>No posts yet. Be the first!</EmptyState>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4, marginBottom: 14 },
  icon: { width: 52, height: 52, borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  name: { color: colors.text, fontSize: 17, fontWeight: '800' },
  dim: { color: colors.textDim, fontSize: 11 },
  joinBtn: { backgroundColor: colors.accent, borderWidth: 1, borderColor: colors.accent, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  joinedBtn: { backgroundColor: colors.surface2, borderColor: colors.line },
  joinText: { color: '#000', fontSize: 12, fontWeight: '700' },
  desc: { color: colors.textDim, fontSize: 13, backgroundColor: colors.surface, borderRadius: 10, padding: 10, marginBottom: 14 },
  sectionLabel: { color: colors.textDim, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '800', marginBottom: 10 },
  postCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: 14, marginBottom: 10 },
  postHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  postUser: { color: colors.text, fontSize: 13, fontWeight: '700' },
  fragChip: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface2, borderRadius: 10, padding: 8, marginBottom: 10 },
  fragName: { color: colors.text, fontSize: 13, fontWeight: '700' },
  postText: { color: colors.text, fontSize: 13, lineHeight: 20 },
  likeBtn: { marginTop: 10 },
  likeText: { color: colors.textDim, fontSize: 12, fontWeight: '700' },
});
