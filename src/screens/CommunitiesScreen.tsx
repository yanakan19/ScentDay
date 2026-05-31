import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import { Screen, BackHeader } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { COMMUNITY_ICONS } from '@/data/communities';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function CommunitiesScreen() {
  const navigation = useNavigation<Nav>();
  const communities = useStore((s) => s.communities);
  const communityPosts = useStore((s) => s.communityPosts);
  const joinCommunity = useStore((s) => s.joinCommunity);

  return (
    <Screen>
      <BackHeader />
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={styles.h2}>Communities</Text>
        {communities.map((c) => (
          <TouchableOpacity key={c.id} style={styles.card} activeOpacity={0.8} onPress={() => navigation.navigate('CommunityDetail', { communityId: c.id })}>
            <View style={styles.row}>
              <View style={styles.icon}>
                <Text style={{ fontSize: 20 }}>{COMMUNITY_ICONS[c.id] ?? '👥'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{c.name}</Text>
                <Text style={styles.dim}>{`${c.members.toLocaleString()} members · ${(communityPosts[c.id] || []).length} recent posts`}</Text>
              </View>
              <TouchableOpacity
                style={[styles.joinBtn, c.joined && styles.joinedBtn]}
                onPress={() => joinCommunity(c.id)}
              >
                <Text style={[styles.joinText, c.joined && { color: colors.textDim }]}>{c.joined ? 'Joined' : 'Join'}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.desc}>{c.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  h2: { color: colors.text, fontSize: 18, fontWeight: '800', marginVertical: 12 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: 14, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  icon: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  name: { color: colors.text, fontSize: 14, fontWeight: '700' },
  dim: { color: colors.textDim, fontSize: 11 },
  joinBtn: { backgroundColor: colors.accent, borderWidth: 1, borderColor: colors.accent, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  joinedBtn: { backgroundColor: colors.surface2, borderColor: colors.line },
  joinText: { color: '#000', fontSize: 12, fontWeight: '700' },
  desc: { color: colors.textDim, fontSize: 12, lineHeight: 18 },
});
