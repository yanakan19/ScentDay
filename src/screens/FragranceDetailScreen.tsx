import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, BackHeader, SectionCard, Chip, Bar, Quad, Avatar, EmptyState } from '@/components/ui';
import BottleSVG from '@/components/BottleSVG';
import { SaveWishlistButtons } from '@/components/FragRow';
import { colors, radius, spacing, verdictColors } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import type { Fragrance, BuyOption, Review } from '@/types';
import { useStore } from '@/store/useStore';
import { fragById } from '@/data/fragrances';
import { getAISummary } from '@/data/reviews';
import { getVibeRecs } from '@/services/recommendations';
import { userById } from '@/data/users';

type Props = NativeStackScreenProps<RootStackParamList, 'FragranceDetail'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

const REC_LABELS = ['Budget pick', 'Mid-range', 'Premium'];

function parsePrice(price: string): number {
  return parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
}

/** Estimated UK shipping cost per vendor (£). 0 = free delivery. */
function shippingCost(vendor: string): number {
  const v = vendor.toLowerCase();
  if (
    v.includes('boots') || v.includes('allbeauty') || v.includes('justmylook') ||
    v.includes('beautybase') || v.includes('fragrance shop') || v.includes('perfume shop') ||
    v.includes('lookfantastic') || v.includes('john lewis') || v.includes('amazon') ||
    v.includes('sephora') || v.includes('selfridges') || v.includes('debenhams') ||
    v.includes('harvey nichols') || v.includes('argos') || v.includes('superdrug') ||
    v.includes('flannels') || v.includes('fenwick')
  ) return 0;
  if (v.includes('notino')) return 3;
  return 5; // brand official sites
}

function totalPrice(b: BuyOption): number {
  return parsePrice(b.price) + shippingCost(b.vendor);
}

/** All UK retailers we always display. trusted = green badge. */
const MASTER_RETAILERS: { name: string; url: string; trusted?: boolean }[] = [
  { name: 'allbeauty',          url: 'allbeauty.com',           trusted: true },
  { name: 'Argos',              url: 'argos.co.uk' },
  { name: 'Boots',              url: 'boots.com',               trusted: true },
  { name: 'Debenhams',          url: 'debenhams.com' },
  { name: 'Fenwick',            url: 'fenwick.co.uk' },
  { name: 'Flannels',           url: 'flannels.com' },
  { name: 'Harvey Nichols',     url: 'harveynichols.com' },
  { name: 'John Lewis',         url: 'johnlewis.com',           trusted: true },
  { name: 'justmylook',         url: 'justmylook.com',          trusted: true },
  { name: 'Lookfantastic',      url: 'lookfantastic.com' },
  { name: 'notino',             url: 'notino.co.uk',            trusted: true },
  { name: 'Selfridges',         url: 'selfridges.com' },
  { name: 'Sephora',            url: 'sephora.co.uk' },
  { name: 'Superdrug',          url: 'superdrug.com' },
  { name: 'The Fragrance Shop', url: 'thefragranceshop.co.uk',  trusted: true },
  { name: 'The Perfume Shop',   url: 'theperfumeshop.com',      trusted: true },
];

function logoUri(url: string) {
  return `https://logo.clearbit.com/${url}`;
}

function RetailerLogo({ url, name }: { url: string; name: string }) {
  const [err, setErr] = useState(false);
  if (err || !url) {
    // Fallback: initials badge
    return (
      <View style={styles.logoFallback}>
        <Text style={styles.logoFallbackText}>{name.slice(0, 2).toUpperCase()}</Text>
      </View>
    );
  }
  return (
    <Image
      source={{ uri: logoUri(url) }}
      style={styles.retailerLogo}
      resizeMode="contain"
      onError={() => setErr(true)}
    />
  );
}

/** Find the buy option (if any) that matches a master retailer name. */
function matchBuy(buy: BuyOption[], retailerName: string): BuyOption | undefined {
  const key = retailerName.toLowerCase();
  return buy.find((b) => b.vendor.toLowerCase().includes(key) || key.includes(b.vendor.toLowerCase()));
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

  const [buyExpanded, setBuyExpanded] = useState(false);

  const saved = savedIds.includes(f.id);
  const recs = getVibeRecs(f);
  const aiSummary = getAISummary(f.id);
  const reviews = reviewsMap[f.id] || [];

  return (
    <Screen>
      <BackHeader />

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroBottle}>
          <BottleSVG fragrance={f} size={100} />
          <View style={styles.heroActions}>
            <SaveWishlistButtons fragId={f.id} />
          </View>
        </View>
        <Text style={styles.heroName}>{f.name}</Text>
        <Text style={styles.heroBrand}>{`${f.brand} · ${f.concentration}`}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingBig}>{f.rating}</Text>
          <Text style={styles.ratingMax}>/ 5</Text>
        </View>
        <Text style={styles.votes}>{`${f.votes.toLocaleString()} votes`}</Text>
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
          <Text style={styles.reputableSub}>Prices include estimated UK delivery · sorted cheapest first</Text>
        </View>
        {(() => {
          // Build priced rows (matched buy options) sorted by total price
          const priced: { retailer: typeof MASTER_RETAILERS[0]; buy: BuyOption }[] = [];
          // Also include any buy options NOT in MASTER_RETAILERS (e.g. official brand site)
          const extraBuy = f.buy.filter(
            (b) => !MASTER_RETAILERS.some((r) => matchBuy([b], r.name))
          );
          MASTER_RETAILERS.forEach((r) => {
            const buy = matchBuy(f.buy, r.name);
            if (buy) priced.push({ retailer: r, buy });
          });
          priced.sort((a, b) => totalPrice(a.buy) - totalPrice(b.buy));

          const allPriced = [
            ...extraBuy.map((b) => ({ retailer: { name: b.vendor, ic: b.ic, url: '', trusted: b.official }, buy: b })),
            ...priced,
          ].sort((a, b) => totalPrice(a.buy) - totalPrice(b.buy));

          const unpriced = MASTER_RETAILERS.filter((r) => !matchBuy(f.buy, r.name))
            .sort((a, b) => a.name.localeCompare(b.name));

          const shownPriced = buyExpanded ? allPriced : allPriced.slice(0, 3);

          return (
            <>
              {shownPriced.map(({ retailer, buy }, i) => (
                <View key={`${retailer.name}-${i}`} style={[styles.buyRow, buy.official && styles.buyRowOfficial]}>
                  <RetailerLogo url={retailer.url || ''} name={retailer.name} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.buyVendor}>{retailer.name}</Text>
                    <Text style={styles.buyTag}>{retailer.url || buy.tag}</Text>
                    {retailer.trusted && (
                      <View style={styles.trustedPill}><Text style={styles.trustedText}>TRUSTED</Text></View>
                    )}
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.buyPrice}>{`£${parsePrice(buy.price).toFixed(0)}`}</Text>
                    <Text style={styles.buyDelivery}>{shippingCost(buy.vendor) === 0 ? 'Free delivery' : `+£${shippingCost(buy.vendor)} delivery`}</Text>
                    <Text style={styles.buyTotal}>{`Total £${totalPrice(buy).toFixed(0)}`}</Text>
                  </View>
                </View>
              ))}

              {allPriced.length > 3 && (
                <TouchableOpacity style={styles.expandBtn} onPress={() => setBuyExpanded((v) => !v)}>
                  <Text style={styles.expandBtnText}>
                    {buyExpanded ? '▲ Show less' : `▼ See all ${allPriced.length} priced options`}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Unlisted retailers — alphabetical with "—" */}
              {unpriced.length > 0 && (
                <>
                  <View style={styles.buyDivider} />
                  <Text style={styles.unlistedHeader}>Not currently listed on:</Text>
                  {unpriced.map((r) => (
                    <View key={r.name} style={styles.buyRow}>
                      <RetailerLogo url={r.url} name={r.name} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.buyVendor, { color: colors.textDim }]}>{r.name}</Text>
                        <Text style={styles.buyTag}>{r.url}</Text>
                      </View>
                      <Text style={styles.buyPriceDash}>—</Text>
                    </View>
                  ))}
                </>
              )}
            </>
          );
        })()}
      </SectionCard>

      {/* Vibe recommendations */}
      <VibeRecSection title="🔥 If you like warm vibes" list={recs.warm} nav={nav} />
      <VibeRecSection title="❄️ If you prefer fresh vibes" list={recs.fresh} nav={nav} />

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

function NoteGroup({ label, notes }: { label: string; notes: string[] }) {
  if (!notes.length) return null;
  return (
    <View style={styles.noteGroup}>
      <Text style={styles.noteGroupLabel}>{label}</Text>
      <View style={styles.noteWrap}>
        {notes.map((n, i) => (
          <Chip key={`${n}-${i}`} label={n} />
        ))}
      </View>
    </View>
  );
}

function VibeRecSection({ title, list, nav }: { title: string; list: Fragrance[]; nav: Nav }) {
  if (!list.length) return null;
  return (
    <SectionCard title={title}>
      {list.map((f, i) => (
        <TouchableOpacity
          key={f.id}
          style={styles.recRow}
          onPress={() => nav.navigate('FragranceDetail', { fragId: f.id })}
          activeOpacity={0.7}
        >
          <BottleSVG fragrance={f} size={30} />
          <View style={{ flex: 1 }}>
            <Text style={styles.recLabel}>{REC_LABELS[i] ?? ''}</Text>
            <Text style={styles.recName}>{f.name}</Text>
            <Text style={styles.recBrand}>{f.brand}</Text>
          </View>
          <Text style={styles.recRating}>{`★ ${f.rating}`}</Text>
        </TouchableOpacity>
      ))}
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
  heartBtn: {
    position: 'absolute',
    top: -6,
    right: -36,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  heroName: { color: colors.text, fontSize: 26, fontWeight: '900', letterSpacing: -0.5, marginTop: spacing.md, textAlign: 'center' },
  heroBrand: { color: colors.textDim, fontSize: 14, marginTop: 4, textAlign: 'center' },
  ratingRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: spacing.md },
  ratingBig: { color: colors.accent, fontSize: 44, fontWeight: '900', letterSpacing: -1 },
  ratingMax: { color: colors.textDim, fontSize: 18, fontWeight: '700', marginBottom: 8, marginLeft: 4 },
  votes: { color: colors.textDim, fontSize: 13, marginTop: 2 },
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
  retailerLogo: { width: 32, height: 32, borderRadius: 6, backgroundColor: '#fff' },
  logoFallback: { width: 32, height: 32, borderRadius: 6, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  logoFallbackText: { color: colors.textDim, fontSize: 10, fontWeight: '800' },
  buyDelivery: { color: colors.textDim, fontSize: 10, marginTop: 1 },
  buyTotal: { color: colors.text, fontSize: 11, fontWeight: '700', marginTop: 1 },
  buyPriceDash: { color: colors.textDim, fontSize: 18, fontWeight: '300', paddingRight: 4 },
  expandBtn: { alignItems: 'center', paddingVertical: 10, marginTop: 4 },
  expandBtnText: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  trustedPill: { alignSelf: 'flex-start', backgroundColor: '#166534', borderRadius: radius.sm, paddingHorizontal: 6, paddingVertical: 2, marginTop: 3 },
  trustedText: { color: '#4ade80', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  unlistedHeader: { color: colors.textDim, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 },
  recRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  recLabel: { color: colors.textDim, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  recName: { color: colors.text, fontSize: 14, fontWeight: '800', marginTop: 1 },
  recBrand: { color: colors.textDim, fontSize: 12, marginTop: 1 },
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
