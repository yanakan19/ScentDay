import React, { useState } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, BackHeader, SectionCard, Chip, Bar, Quad, Avatar, EmptyState } from '@/components/ui';
import BottleSVG from '@/components/BottleSVG';
import { SaveWishlistButtons } from '@/components/FragRow';
import { colors, radius, spacing, verdictColors } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import type { Fragrance, Review } from '@/types';
import { useStore } from '@/store/useStore';
import { fragById } from '@/data/fragrances';
import { getAISummary } from '@/data/reviews';
import { getNoteBasedRecs } from '@/services/recommendations';
import type { NoteRec } from '@/services/recommendations';
import { retailerLogoUris, brandLogoUris } from '@/data/brandLogos';
import { LogoImage } from '@/components/LogoImage';
import { getBuyListings } from '@/services/priceService';
import type { BuyListing } from '@/services/priceService';
import { userById } from '@/data/users';

type Props = NativeStackScreenProps<RootStackParamList, 'FragranceDetail'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

const REC_LABELS = ['Budget pick', 'Mid-range', 'Premium'];

function parsePrice(price: string): number {
  return parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
}

export default function FragranceDetailScreen({ route }: Props) {
  const { fragId } = route.params;
  const nav = useNavigation<Nav>();
  const f = fragById(fragId);

  const savedIds = useStore((s) => s.savedIds);
  const toggleSave = useStore((s) => s.toggleSave);
  const reviewsMap = useStore((s) => s.reviews);
  const thumbReview = useStore((s) => s.thumbReview);

  if (!f) {
    return (
      <Screen>
        <BackHeader />
        <EmptyState>Fragrance not found.</EmptyState>
      </Screen>
    );
  }

  const saved = savedIds.includes(f.id);
  const aiSummary = getAISummary(f.id);
  const reviews = reviewsMap[f.id] || [];

  return (
    <Screen>
      <BackHeader />

      {/* Hero */}
      <View style={styles.hero}>
        {/* Bottle + save/wishlist */}
        <View style={styles.heroBottle}>
          <BottleSVG fragrance={f} size={100} />
          <View style={styles.heroActions}>
            <SaveWishlistButtons fragId={f.id} />
          </View>
        </View>

        {/* Name + concentration */}
        <Text style={styles.heroName}>{f.name}</Text>
        <Text style={styles.heroConc}>{f.concentration}</Text>

        {/* Brand (tappable) ← left   |   Rating block → right */}
        <View style={styles.heroMeta}>
          {/* Brand */}
          <TouchableOpacity
            style={styles.heroBrandRow}
            onPress={() => nav.navigate('BrandDetail', { brand: f.brand })}
            activeOpacity={0.7}
          >
            <LogoImage uris={brandLogoUris(f.brand)} name={f.brand} size={28} radius={6} />
            <Text style={styles.heroBrand}>{f.brand}</Text>
          </TouchableOpacity>

          {/* Rating block */}
          <View style={styles.heroRatingBlock}>
            <Text style={styles.ratingBig}>{f.rating}</Text>
            <StarScale rating={f.rating} />
            <Text style={styles.votes}>{`${f.votes.toLocaleString()} votes`}</Text>
            <Text style={styles.noteCount}>
              {`${f.notes.top.length + f.notes.mid.length + f.notes.base.length} notes`}
            </Text>
          </View>
        </View>
      </View>

      {/* Notes */}
      <SectionCard
        title="Notes"
        right={
          <View style={styles.officialBadge}>
            <Text style={styles.officialBadgeText}>OFFICIAL</Text>
          </View>
        }
      >
        <NoteGroup label="Top" notes={f.notes.top} />
        <NoteGroup label="Heart" notes={f.notes.mid} />
        <NoteGroup label="Base" notes={f.notes.base} />
        <Text style={styles.perfumerLine}>{`${f.perfumer} · ${f.year}`}</Text>
      </SectionCard>

      {/* Performance */}
      <SectionCard title="Performance">
        <Bar label="Longevity" value={f.perf.longevity} />
        <Bar label="Projection" value={f.perf.projection} />
      </SectionCard>

      {/* Best Season */}
      <SectionCard title="Best Season">
        <Quad data={f.season} />
      </SectionCard>

      {/* Best Time of Day */}
      <SectionCard title="Best Time of Day">
        <Quad data={f.time} />
      </SectionCard>

      {/* Where to Buy */}
      <SectionCard title="Where to Buy">
        <View style={styles.reputableBanner}>
          <Text style={styles.reputableTitle}>✅ Get legitimate products here</Text>
          <Text style={styles.reputableSub}>Tap any row to open the retailer · prices include estimated UK delivery · sorted cheapest first</Text>
        </View>
        <BuySection frag={f} />
      </SectionCard>

      {/* Note-based recommendations */}
      <NoteRecsSection frag={f} nav={nav} />

      {/* Reviews */}
      {aiSummary && (
        <View style={styles.aiCard}>
          <Text style={styles.aiHeading}>✨ AI Review Summary</Text>
          <Text style={styles.aiBody}>{aiSummary}</Text>
        </View>
      )}

      <SectionCard title="Reviews">
        {reviews.length === 0 ? (
          <EmptyState>No reviews yet.</EmptyState>
        ) : (
          reviews.map((r: Review) => <ReviewRow key={r.id} review={r} fragId={f.id} thumbReview={thumbReview} />)
        )}
      </SectionCard>
    </Screen>
  );
}

// ─── Buy section ──────────────────────────────────────────────────────────

function buyShipping(vendor: string): number {
  const v = vendor.toLowerCase();
  if (['boots','allbeauty','justmylook','fragrance shop','perfume shop','lookfantastic',
       'john lewis','amazon','sephora','selfridges','debenhams','harvey nichols','argos',
       'superdrug','flannels','fenwick'].some(k => v.includes(k))) return 0;
  if (v.includes('notino')) return 3;
  return 5;
}

function BuySection({ frag }: { frag: Fragrance }) {
  const [expanded, setExpanded] = useState(false);
  const listings: BuyListing[] = getBuyListings(frag);

  // Sort: official first, then by total (price + shipping), cheapest first
  const official = listings.filter(l => l.official);
  const retailers = listings
    .filter(l => !l.official)
    .sort((a, b) => {
      const pa = parsePrice(a.price) + buyShipping(a.vendor);
      const pb = parsePrice(b.price) + buyShipping(b.vendor);
      return pa - pb;
    });

  const sorted = [...official, ...retailers];
  const shown = expanded ? sorted : sorted.slice(0, 3);

  const openUrl = (url: string) => {
    if (url) Linking.openURL(url).catch(() => {});
  };

  return (
    <>
      {shown.map((listing, i) => {
        const ship = buyShipping(listing.vendor);
        const base = parsePrice(listing.price);
        const total = base + ship;
        const logoUris = listing.official
          ? brandLogoUris(listing.vendor)
          : retailerLogoUris(listing.tag);
        return (
          <TouchableOpacity
            key={`${listing.vendor}-${i}`}
            style={[styles.buyRow, listing.official && styles.buyRowOfficial]}
            onPress={() => openUrl(listing.url)}
            activeOpacity={0.75}
          >
            <LogoImage uris={logoUris} name={listing.vendor} size={36} radius={8} />
            <View style={{ flex: 1 }}>
              <Text style={styles.buyVendor}>{listing.vendor}</Text>
              <Text style={styles.buyTag}>{listing.tag}</Text>
              {listing.official && (
                <View style={styles.officialPill}><Text style={styles.officialPillText}>OFFICIAL</Text></View>
              )}
              {listing.trusted && !listing.official && (
                <View style={styles.trustedPill}><Text style={styles.trustedText}>TRUSTED</Text></View>
              )}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.buyPrice}>{listing.price}</Text>
              <Text style={styles.buyDelivery}>{ship === 0 ? 'Free delivery' : `+£${ship} delivery`}</Text>
              {ship > 0 && <Text style={styles.buyTotal}>{`Total £${total}`}</Text>}
              <Text style={styles.buyTap}>↗</Text>
            </View>
          </TouchableOpacity>
        );
      })}

      {sorted.length > 3 && (
        <TouchableOpacity style={styles.expandBtn} onPress={() => setExpanded(v => !v)}>
          <Text style={styles.expandBtnText}>
            {expanded ? '▲ Show less' : `▼ See all ${sorted.length} options`}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
}

/** Five-star gold scale — filled, half-filled, empty stars from a 0–5 rating. */
function StarScale({ rating }: { rating: number }) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = rating - i;
    if (filled >= 0.85) return 'full';
    if (filled >= 0.35) return 'half';
    return 'empty';
  });
  return (
    <View style={starStyles.row}>
      {stars.map((s, i) => (
        <Text key={i} style={[starStyles.star, s === 'empty' && starStyles.empty]}>
          {s === 'full' ? '★' : s === 'half' ? '⯨' : '☆'}
        </Text>
      ))}
    </View>
  );
}

const starStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 1, marginVertical: 3 },
  star: { color: '#F5C518', fontSize: 13 },
  empty: { color: '#555' },
});

function NoteGroup({ label, notes }: { label: string; notes: string[] }) {
  const nav = useNavigation<Nav>();
  if (!notes.length) return null;
  return (
    <View style={styles.noteGroup}>
      <Text style={styles.noteGroupLabel}>{label}</Text>
      <View style={styles.noteWrap}>
        {notes.map((n, i) => (
          <TouchableOpacity key={`${n}-${i}`} activeOpacity={0.7} onPress={() => nav.navigate('NoteDetail', { noteName: n })}>
            <Chip label={n} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function NoteRecsSection({ frag, nav }: { frag: Fragrance; nav: Nav }) {
  const [expanded, setExpanded] = useState(false);
  const allRecs: NoteRec[] = getNoteBasedRecs(frag, 10);
  if (!allRecs.length) return null;
  const shown = expanded ? allRecs : allRecs.slice(0, 3);
  return (
    <SectionCard title="If you like this, you'd like">
      {shown.map(({ fragrance: x, sharedCount, sharedNotes }) => (
        <TouchableOpacity
          key={x.id}
          style={styles.recRow}
          onPress={() => nav.navigate('FragranceDetail', { fragId: x.id })}
          activeOpacity={0.7}
        >
          <BottleSVG fragrance={x} size={32} />
          <View style={{ flex: 1 }}>
            <Text style={styles.recName}>{x.name}</Text>
            <Text style={styles.recBrand}>{x.brand}</Text>
            <Text style={styles.recShared}>
              {`${sharedCount} note${sharedCount !== 1 ? 's' : ''} in common · ${sharedNotes.join(', ')}`}
            </Text>
          </View>
          <Text style={styles.recRating}>{`★ ${x.rating}`}</Text>
        </TouchableOpacity>
      ))}
      {allRecs.length > 3 && (
        <TouchableOpacity style={styles.expandBtn} onPress={() => setExpanded(v => !v)}>
          <Text style={styles.expandBtnText}>
            {expanded ? '▲ Show less' : `▼ See ${allRecs.length - 3} more`}
          </Text>
        </TouchableOpacity>
      )}
    </SectionCard>
  );
}

function ReviewRow({
  review,
  fragId,
  thumbReview,
}: {
  review: Review;
  fragId: string;
  thumbReview: (fragId: string, reviewId: number, dir: 'up' | 'down') => void;
}) {
  const user = userById(review.user);
  const vc = verdictColors[review.verdict];
  return (
    <View style={styles.reviewRow}>
      <View style={styles.reviewHead}>
        <Avatar name={user?.name ?? review.user} size={30} />
        <View style={{ flex: 1 }}>
          <Text style={styles.reviewUser}>{`@${review.user}`}</Text>
          <Text style={styles.reviewDate}>{review.date}</Text>
        </View>
        <View style={[styles.verdictPill, { backgroundColor: vc.bg }]}>
          <Text style={[styles.verdictText, { color: vc.text }]}>{review.verdict.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.reviewStars}>{'★'.repeat(review.rating) + '☆'.repeat(Math.max(0, 5 - review.rating))}</Text>
      <Text style={styles.reviewText}>{review.text}</Text>
      <View style={styles.thumbRow}>
        <TouchableOpacity
          style={[styles.thumbBtn, review.upvoted && styles.thumbBtnActive]}
          onPress={() => thumbReview(fragId, review.id, 'up')}
          activeOpacity={0.7}
        >
          <Text style={[styles.thumbText, review.upvoted && { color: colors.accent }]}>{`👍 ${review.upvotes}`}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.thumbBtn, review.downvoted && styles.thumbBtnActive]}
          onPress={() => thumbReview(fragId, review.id, 'down')}
          activeOpacity={0.7}
        >
          <Text style={[styles.thumbText, review.downvoted && { color: colors.accent }]}>{`👎 ${review.downvotes}`}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.lg },
  heroBottle: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  heroActions: { position: 'absolute', top: -2, right: -54 },
  heroName: { color: colors.text, fontSize: 26, fontWeight: '900', letterSpacing: -0.5, marginTop: spacing.md, textAlign: 'center' },
  heroConc: { color: colors.textDim, fontSize: 13, fontWeight: '500', marginTop: 4, textAlign: 'center', letterSpacing: 0.2 },
  /* Row: brand pill on left, rating block on right */
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 14,
    paddingHorizontal: 4,
  },
  heroBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flex: 1,
    marginRight: 12,
  },
  heroBrand: { color: colors.text, fontSize: 14, fontWeight: '700', flexShrink: 1 },
  heroRatingBlock: { alignItems: 'flex-end' },
  ratingBig: { color: colors.accent, fontSize: 38, fontWeight: '900', letterSpacing: -1, lineHeight: 42 },
  votes: { color: colors.textDim, fontSize: 11, marginTop: 1 },
  noteCount: { color: colors.textDim, fontSize: 11, marginTop: 1 },
  officialBadge: { backgroundColor: colors.accentSoft, borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 3 },
  officialBadgeText: { color: colors.accent, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  noteGroup: { marginBottom: 12 },
  noteGroupLabel: { color: colors.textDim, fontSize: 12, fontWeight: '700', marginBottom: 8 },
  noteWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  perfumerLine: { color: colors.textDim, fontSize: 13, marginTop: 4 },
  reputableBanner: {
    backgroundColor: '#0d2e1a',
    borderWidth: 1,
    borderColor: '#22c55e44',
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 10,
  },
  reputableTitle: { color: '#4ade80', fontSize: 13, fontWeight: '800' },
  reputableSub: { color: '#86efac', fontSize: 11, marginTop: 3 },
  reputableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#0d2e1a',
    borderWidth: 1,
    borderColor: '#22c55e33',
    borderRadius: radius.md,
    marginBottom: 6,
  },
  reputableIc: { fontSize: 20 },
  reputableName: { color: '#4ade80', fontSize: 14, fontWeight: '800' },
  reputableDesc: { color: '#86efac', fontSize: 12, marginTop: 2 },
  reputableBadge: { backgroundColor: '#166534', borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 3 },
  reputableBadgeText: { color: '#4ade80', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  buyDivider: { height: 1, backgroundColor: colors.line, marginVertical: 10 },
  buyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    marginBottom: 6,
  },
  buyRowOfficial: { backgroundColor: colors.accentSoft },
  buyIc: { fontSize: 20 },
  buyVendor: { color: colors.text, fontSize: 14, fontWeight: '700' },
  buyTag: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  buyPrice: { color: colors.accent, fontSize: 15, fontWeight: '800' },
  buyDelivery: { color: colors.textDim, fontSize: 10, marginTop: 1 },
  buyTotal: { color: colors.text, fontSize: 11, fontWeight: '700', marginTop: 1 },
  buyPriceDash: { color: colors.textDim, fontSize: 18, fontWeight: '300', paddingRight: 4 },
  expandBtn: { alignItems: 'center', paddingVertical: 10, marginTop: 4 },
  expandBtnText: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  trustedPill: { alignSelf: 'flex-start', backgroundColor: '#166534', borderRadius: radius.sm, paddingHorizontal: 6, paddingVertical: 2, marginTop: 3 },
  trustedText: { color: '#4ade80', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  officialPill: { alignSelf: 'flex-start', backgroundColor: colors.accentSoft, borderRadius: radius.sm, paddingHorizontal: 6, paddingVertical: 2, marginTop: 3 },
  officialPillText: { color: colors.accent, fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  buyTap: { color: colors.textDim, fontSize: 14, marginTop: 2 },
  unlistedHeader: { color: colors.textDim, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 },
  recRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  recName: { color: colors.text, fontSize: 14, fontWeight: '800' },
  recBrand: { color: colors.textDim, fontSize: 12, marginTop: 1 },
  recShared: { color: colors.accent, fontSize: 11, marginTop: 3, fontWeight: '600' },
  recRating: { color: colors.star, fontSize: 13, fontWeight: '700' },
  aiCard: {
    backgroundColor: '#1e1b4b',
    borderWidth: 1,
    borderColor: '#7c3aed44',
    borderRadius: radius.lg,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 9,
  },
  aiHeading: { color: '#a78bfa', fontSize: 13, fontWeight: '800', marginBottom: 8, letterSpacing: 0.3 },
  aiBody: { color: '#e9d5ff', fontSize: 13, lineHeight: 20 },
  reviewRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.line },
  reviewHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  reviewUser: { color: colors.text, fontSize: 13, fontWeight: '800' },
  reviewDate: { color: colors.textDim, fontSize: 11, marginTop: 1 },
  verdictPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.sm },
  verdictText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  reviewStars: { color: colors.star, fontSize: 14, marginBottom: 6 },
  reviewText: { color: colors.text, fontSize: 13, lineHeight: 20 },
  thumbRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  thumbBtn: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  thumbBtnActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  thumbText: { color: colors.textDim, fontSize: 12, fontWeight: '700' },
});
