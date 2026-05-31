import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, TopBar, ScopeTabs, EmptyState } from '@/components/ui';
import { FragRow } from '@/components/FragRow';
import BottleSVG from '@/components/BottleSVG';
import { Avatar } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import type { Fragrance } from '@/types';
import { useStore } from '@/store/useStore';
import { getTrending, searchFragrances, groupByBrand, brandFragCounts } from '@/services/catalog';
import { NOTES_DB } from '@/data/notes';
import { BRAND_TIERS, BRAND_ICONS, BRAND_DEFAULT_ICON } from '@/data/prices';
import { COMMUNITY_ICONS } from '@/data/communities';
import { ALL_USERS } from '@/data/users';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Tab = 'frags' | 'notes' | 'brands' | 'social';

const TABS = [
  { key: 'frags', label: '🧴 Fragrances' },
  { key: 'notes', label: '🌿 Notes' },
  { key: 'brands', label: '🏷️ Brands' },
  { key: 'social', label: '👥 Social' },
];

const TIER_LABELS: { key: keyof typeof BRAND_TIERS; label: string }[] = [
  { key: 'designer', label: 'Designer' },
  { key: 'niche', label: 'Niche' },
  { key: 'mideast', label: 'Middle Eastern' },
];

export default function DiscoverScreen() {
  const nav = useNavigation<Nav>();
  const [tab, setTab] = useState<Tab>('frags');

  return (
    <Screen>
      <TopBar />
      <ScopeTabs tabs={TABS} active={tab} onChange={(k) => setTab(k as Tab)} />
      {tab === 'frags' && <FragsTab nav={nav} />}
      {tab === 'notes' && <NotesTab nav={nav} />}
      {tab === 'brands' && <BrandsTab nav={nav} />}
      {tab === 'social' && <SocialTab nav={nav} />}
    </Screen>
  );
}

/* ───────────────────────── Search input ───────────────────────── */
function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (t: string) => void; placeholder: string }) {
  return (
    <TextInput
      style={styles.search}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={colors.textDim}
      autoCorrect={false}
      autoCapitalize="none"
    />
  );
}

/* ───────────────────────── Fragrances tab ───────────────────────── */
function FragsTab({ nav }: { nav: Nav }) {
  const [q, setQ] = useState('');
  const query = q.trim();

  if (!query) {
    const trending = getTrending(15);
    return (
      <View>
        <SearchInput value={q} onChange={setQ} placeholder="Search fragrances, brands, notes…" />
        <View style={styles.grid}>
          {trending.map((f, i) => (
            <TouchableOpacity
              key={f.id}
              style={styles.gridCell}
              onPress={() => nav.navigate('FragranceDetail', { fragId: f.id })}
              activeOpacity={0.7}
            >
              <BottleSVG fragrance={f} size={80} />
              <Text style={styles.gridRank}>{`#${i + 1} 🔥`}</Text>
              <Text style={styles.gridName} numberOfLines={1}>{f.name}</Text>
              <Text style={styles.gridBrand} numberOfLines={1}>{f.brand}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  const grouped = groupByBrand(searchFragrances(query));
  const brands = Object.keys(grouped);
  return (
    <View>
      <SearchInput value={q} onChange={setQ} placeholder="Search fragrances, brands, notes…" />
      {brands.length === 0 ? (
        <EmptyState>No fragrances match “{query}”.</EmptyState>
      ) : (
        brands.map((brand) => (
          <View key={brand}>
            <Text style={styles.groupHeader}>{brand}</Text>
            {grouped[brand].map((f: Fragrance) => (
              <FragRow key={f.id} fragrance={f} onPress={() => nav.navigate('FragranceDetail', { fragId: f.id })} />
            ))}
          </View>
        ))
      )}
    </View>
  );
}

/* ───────────────────────── Notes tab ───────────────────────── */
function NotesTab({ nav }: { nav: Nav }) {
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();

  return (
    <View>
      <SearchInput value={q} onChange={setQ} placeholder="Search notes…" />
      {Object.entries(NOTES_DB).map(([category, notes]) => {
        const filtered = query ? notes.filter((n) => n.name.toLowerCase().includes(query)) : notes;
        if (filtered.length === 0) return null;
        return (
          <View key={category}>
            <Text style={styles.groupHeader}>{category}</Text>
            <View style={styles.wrap}>
              {filtered.map((n) => (
                <TouchableOpacity
                  key={n.name}
                  style={styles.notePill}
                  onPress={() => nav.navigate('NoteDetail', { noteName: n.name })}
                  activeOpacity={0.7}
                >
                  <Text style={styles.notePillText}>{`${n.icon} ${n.name}`}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

/* ───────────────────────── Brands tab ───────────────────────── */
function BrandRow({ brand, count, onPress }: { brand: string; count: number; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.brandRow} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.brandIcon}>{BRAND_ICONS[brand] || BRAND_DEFAULT_ICON}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.brandName}>{brand}</Text>
        <Text style={styles.brandSub}>{`${count} fragrances`}</Text>
      </View>
    </TouchableOpacity>
  );
}

function BrandsTab({ nav }: { nav: Nav }) {
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();
  const counts = brandFragCounts();

  if (!query) {
    return (
      <View>
        <SearchInput value={q} onChange={setQ} placeholder="Search brands…" />
        {TIER_LABELS.map(({ key, label }) => (
          <View key={key}>
            <Text style={styles.groupHeader}>{label}</Text>
            {BRAND_TIERS[key].map((brand) => (
              <BrandRow
                key={brand}
                brand={brand}
                count={counts[brand] || 0}
                onPress={() => nav.navigate('BrandDetail', { brand })}
              />
            ))}
          </View>
        ))}
      </View>
    );
  }

  const allBrands = Object.values(BRAND_TIERS).flat();
  const filtered = allBrands.filter((b) => b.toLowerCase().includes(query));
  return (
    <View>
      <SearchInput value={q} onChange={setQ} placeholder="Search brands…" />
      {filtered.length === 0 ? (
        <EmptyState>No brands match “{q.trim()}”.</EmptyState>
      ) : (
        filtered.map((brand) => (
          <BrandRow
            key={brand}
            brand={brand}
            count={counts[brand] || 0}
            onPress={() => nav.navigate('BrandDetail', { brand })}
          />
        ))
      )}
    </View>
  );
}

/* ───────────────────────── Social tab ───────────────────────── */
function SocialTab({ nav }: { nav: Nav }) {
  const [q, setQ] = useState('');
  const [showAllPeople, setShowAllPeople] = useState(false);
  const [showAllComms, setShowAllComms] = useState(false);
  const query = q.trim().toLowerCase();

  const communities = useStore((s) => s.communities);
  const following = useStore((s) => s.following);
  const followers = useStore((s) => s.followers);
  const toggleFollow = useStore((s) => s.toggleFollow);

  const isFollowing = (uid: string) => following.includes(uid);
  const isFriend = (uid: string) => following.includes(uid) && followers.includes(uid);

  const people = ALL_USERS.filter((u) => {
    if (!query) return true;
    return (
      u.id.toLowerCase().includes(query) ||
      u.name.toLowerCase().includes(query) ||
      u.bio.toLowerCase().includes(query) ||
      u.location.toLowerCase().includes(query)
    );
  });
  const comms = communities.filter((c) => {
    if (!query) return true;
    return c.name.toLowerCase().includes(query) || c.description.toLowerCase().includes(query);
  });

  const shownPeople = showAllPeople ? people : people.slice(0, 5);
  const shownComms = showAllComms ? comms : comms.slice(0, 5);

  return (
    <View>
      <SearchInput value={q} onChange={setQ} placeholder="Search people & communities…" />

      <Text style={styles.groupHeader}>People</Text>
      {shownPeople.length === 0 ? (
        <EmptyState>No people match “{q.trim()}”.</EmptyState>
      ) : (
        shownPeople.map((u) => {
          const friend = isFriend(u.id);
          const followingThem = isFollowing(u.id);
          const followLabel = friend ? '👫 Friends' : followingThem ? 'Following' : '+ Follow';
          return (
            <TouchableOpacity
              key={u.id}
              style={styles.personRow}
              onPress={() => nav.navigate('UserProfile', { userId: u.id })}
              activeOpacity={0.7}
            >
              <Avatar name={u.name} />
              <View style={{ flex: 1 }}>
                <Text style={styles.personName}>{`@${u.id}`}</Text>
                <Text style={styles.personSub} numberOfLines={1}>
                  {`${u.location} · 💧${u.drops} · ${u.fragCount} bottles`}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.followBtn, (friend || followingThem) && styles.followBtnActive]}
                onPress={() => toggleFollow(u.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.followBtnText, (friend || followingThem) && { color: colors.accent }]}>{followLabel}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })
      )}
      {people.length > 5 && (
        <TouchableOpacity style={styles.showMore} onPress={() => setShowAllPeople((v) => !v)}>
          <Text style={styles.showMoreText}>{showAllPeople ? 'Show less' : `Show more (${people.length - 5})`}</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.groupHeader}>Communities</Text>
      {shownComms.length === 0 ? (
        <EmptyState>No communities match “{q.trim()}”.</EmptyState>
      ) : (
        shownComms.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={styles.personRow}
            onPress={() => nav.navigate('CommunityDetail', { communityId: c.id })}
            activeOpacity={0.7}
          >
            <Text style={styles.commIcon}>{COMMUNITY_ICONS[c.id] || '👥'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.personName}>{c.name}</Text>
              <Text style={styles.personSub} numberOfLines={1}>{`${c.members.toLocaleString()} members`}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
      {comms.length > 5 && (
        <TouchableOpacity style={styles.showMore} onPress={() => setShowAllComms((v) => !v)}>
          <Text style={styles.showMoreText}>{showAllComms ? 'Show less' : `Show more (${comms.length - 5})`}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    color: colors.text,
    fontSize: 15,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  groupHeader: {
    color: colors.textDim,
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.sm,
  },
  gridCell: {
    width: '33.33%',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  gridRank: { color: colors.flame, fontSize: 12, fontWeight: '800', marginTop: 6 },
  gridName: { color: colors.text, fontSize: 12, fontWeight: '700', textAlign: 'center', marginTop: 2 },
  gridBrand: { color: colors.textDim, fontSize: 11, textAlign: 'center', marginTop: 1 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: spacing.lg },
  notePill: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  notePillText: { color: colors.text, fontSize: 13, fontWeight: '600' },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    marginHorizontal: spacing.sm,
    borderRadius: radius.lg,
  },
  brandIcon: { fontSize: 26, width: 34, textAlign: 'center' },
  brandName: { color: colors.text, fontSize: 15, fontWeight: '800', letterSpacing: -0.3 },
  brandSub: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    marginHorizontal: spacing.sm,
    borderRadius: radius.lg,
  },
  commIcon: { fontSize: 26, width: 34, textAlign: 'center' },
  personName: { color: colors.text, fontSize: 14, fontWeight: '800' },
  personSub: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  followBtn: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  followBtnActive: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  followBtnText: { color: colors.textDim, fontSize: 12, fontWeight: '700' },
  showMore: { alignItems: 'center', paddingVertical: 10 },
  showMoreText: { color: colors.accent, fontSize: 13, fontWeight: '700' },
});
