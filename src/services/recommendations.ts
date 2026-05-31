import type { Fragrance, PriceTier, WardrobeItem } from '@/types';
import { FRAGRANCES, fragById } from '@/data/fragrances';
import { PRICE_RANGES } from '@/data/prices';

/* ─────────────────────────── Pricing / collection value ─────────────────────────── */

export function getAvgPrice(fragId: string): number {
  const f = fragById(fragId);
  if (!f) return 120;
  const pr = PRICE_RANGES[f.brand];
  if (!pr) return 120;
  return Math.round((pr.min + pr.max) / 2);
}

export interface CollectionValue {
  total: number;
  avg: number;
  min: number;
  max: number;
  items: number;
}

export function getCollectionValue(wardrobe: WardrobeItem[]): CollectionValue {
  if (!wardrobe.length) return { total: 0, avg: 0, min: 0, max: 0, items: 0 };
  const prices = wardrobe.map((w) => getAvgPrice(w.fragId)).filter((p) => p > 0);
  const total = prices.reduce((a, b) => a + b, 0);
  return {
    total,
    avg: Math.round(total / prices.length),
    min: Math.min(...prices),
    max: Math.max(...prices),
    items: prices.length,
  };
}

/* ─────────────────────────── Vibe recommendations (detail screen) ─────────────────────────── */

export interface VibeRecs {
  warm: Fragrance[];
  fresh: Fragrance[];
}

export function getVibeRecs(f: Fragrance): VibeRecs {
  const warmPool = FRAGRANCES.filter((x) => x.id !== f.id && (x.season.Autumn > 70 || x.season.Winter > 70)).sort((a, b) => b.votes - a.votes);
  const freshPool = FRAGRANCES.filter((x) => x.id !== f.id && (x.season.Spring > 70 || x.season.Summer > 70)).sort((a, b) => b.votes - a.votes);
  const pick = (pool: Fragrance[]) =>
    [
      pool.filter((x) => x.votes < 3000)[0],
      pool.filter((x) => x.votes >= 3000 && x.votes < 8000)[0],
      pool.filter((x) => x.votes >= 8000)[0],
    ].filter((x): x is Fragrance => !!x);
  return { warm: pick(warmPool), fresh: pick(freshPool) };
}

/* ─────────────────────────── AI collection analysis ─────────────────────────── */

export interface RecTier {
  key: PriceTier;
  label: string;
  emoji: string;
  similar: Fragrance[];
  contrast: Fragrance[];
}

export interface AIAnalysis {
  empty: boolean;
  topNotes: [string, number][];
  maxCount: number;
  avgPrice: number;
  minP: number;
  maxP: number;
  tendencies: string[];
  tier: string;
  recs: RecTier[];
}

const TIER_CONF: { key: PriceTier; label: string; emoji: string; brands: string[] }[] = [
  { key: 'mideast', label: 'Middle Eastern', emoji: '🌙', brands: ['Amouage', 'Xerjoff', 'Swiss Arabian', 'Ahmed Al Maghribi'] },
  { key: 'designer', label: 'Designer', emoji: '💎', brands: ['Yves Saint Laurent', 'Dior', 'Tom Ford'] },
  { key: 'niche', label: 'Niche', emoji: '🎩', brands: ['Mancera', 'Parfums de Marly', 'Matiere Premiere', 'Xerjoff'] },
];

export function getAIAnalysis(wardrobe: WardrobeItem[]): AIAnalysis {
  const myFrags = wardrobe.map((w) => fragById(w.fragId)).filter((f): f is Fragrance => !!f);
  if (!myFrags.length) {
    return { empty: true, topNotes: [], maxCount: 1, avgPrice: 0, minP: 0, maxP: 0, tendencies: [], tier: 'designer', recs: [] };
  }

  const noteCounts: Record<string, number> = {};
  myFrags.forEach((f) => {
    [...f.notes.top, ...f.notes.mid, ...f.notes.base].forEach((n) => {
      const k = n.trim().toLowerCase();
      noteCounts[k] = (noteCounts[k] || 0) + 1;
    });
  });
  const topNotes = Object.entries(noteCounts).sort((a, b) => b[1] - a[1]).slice(0, 8) as [string, number][];
  const maxCount = topNotes[0]?.[1] || 1;

  const prices = wardrobe.map((w) => getAvgPrice(w.fragId));
  const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);

  const c = (k: string) => noteCounts[k] || 0;
  const tendencies: string[] = [];
  if (c('oud') > 1 || c('agarwood (oud)') > 0) tendencies.push('Oriental/Oud lover');
  if (c('rose') + c('jasmine') + c('iris') > 2) tendencies.push('Floral-oriented');
  if (c('vanilla') + c('tonka bean') + c('caramel') > 1) tendencies.push('Gourmand tendencies');
  if (c('bergamot') + c('lemon') + c('citrus') + c('grapefruit') > 2) tendencies.push('Fresh/Citrus preference');
  if (c('patchouli') + c('oakmoss') + c('vetiver') > 2) tendencies.push('Earthy/Woody character');
  if (c('leather') + c('tobacco') > 1) tendencies.push('Dark/Smoky draw');
  if (!tendencies.length) tendencies.push('Eclectic and adventurous');
  const tier = avgPrice < 130 ? 'designer' : avgPrice < 200 ? 'niche' : 'luxury niche';

  const myIds = new Set(wardrobe.map((w) => w.fragId));
  const myNoteSet = new Set(Object.keys(noteCounts));
  const score = (f: Fragrance, mode: 'similar' | 'contrast') => {
    const fNotes = [...f.notes.top, ...f.notes.mid, ...f.notes.base].map((n) => n.toLowerCase());
    return mode === 'similar'
      ? fNotes.filter((n) => myNoteSet.has(n)).length
      : fNotes.filter((n) => !myNoteSet.has(n)).length;
  };
  const topFor = (brands: string[], mode: 'similar' | 'contrast', n: number) =>
    FRAGRANCES.filter((f) => !myIds.has(f.id) && brands.includes(f.brand))
      .map((f) => ({ f, s: score(f, mode) }))
      .sort((a, b) => b.s - a.s || b.f.rating - a.f.rating || b.f.votes - a.f.votes)
      .slice(0, n)
      .map((x) => x.f);

  const recs: RecTier[] = TIER_CONF.map((t) => ({
    key: t.key,
    label: t.label,
    emoji: t.emoji,
    similar: topFor(t.brands, 'similar', 3),
    contrast: topFor(t.brands, 'contrast', 3),
  }));

  return { empty: false, topNotes, maxCount, avgPrice, minP, maxP, tendencies, tier, recs };
}

/* ─────────────────────────── Layering (ScentBlend) ─────────────────────────── */

export interface LayerResult {
  partner: Fragrance;
  shared: string[];
  onlyBase: string[];
  onlyPartner: string[];
  vibe: string;
  blendedSeason: { label: string; value: number }[];
}

function generateLayerVibe(f1: Fragrance, f2: Fragrance, shared: string[]): string {
  const allNotes = [...f1.notes.top, ...f1.notes.mid, ...f1.notes.base, ...f2.notes.top, ...f2.notes.mid, ...f2.notes.base]
    .join(' ')
    .toLowerCase();
  let mood = 'versatile and well-rounded';
  let season = 'autumn and winter evenings';
  let vibe = 'sophisticated';
  if (allNotes.includes('oud') || allNotes.includes('leather')) {
    mood = 'dark, mysterious and deeply sensual';
    season = 'cold winter nights';
    vibe = 'bold and daring';
  } else if (allNotes.includes('vanilla') || allNotes.includes('tonka')) {
    mood = 'warm, gourmand and comforting';
    season = 'cosy autumn and winter days';
    vibe = 'approachable and inviting';
  } else if (allNotes.includes('bergamot') || allNotes.includes('citrus') || allNotes.includes('lemon')) {
    mood = 'fresh, bright and energising';
    season = 'spring mornings and summer days';
    vibe = 'clean and confident';
  } else if (allNotes.includes('rose') || allNotes.includes('jasmine')) {
    mood = 'romantic, floral and elegant';
    season = 'spring evenings and date nights';
    vibe = 'graceful and refined';
  }
  const intro =
    shared.length > 0
      ? `The shared ${shared[0]} note creates a seamless bridge between the two fragrances. `
      : 'These two contrast beautifully, each bringing something the other lacks. ';
  return `${intro}Together, ${f1.name} and ${f2.name} create a ${mood} accord. The combination shifts the overall profile to something more ${vibe}, best suited for ${season}.`;
}

export function getLayerResult(baseId: string, wardrobe: WardrobeItem[]): LayerResult | null {
  const base = fragById(baseId);
  if (!base) return null;
  const baseNotes = new Set([...base.notes.top, ...base.notes.mid, ...base.notes.base].map((n) => n.toLowerCase()));
  const candidates = wardrobe
    .filter((w) => w.fragId !== baseId)
    .map((w) => {
      const f = fragById(w.fragId);
      if (!f) return null;
      const fNotes = [...f.notes.top, ...f.notes.mid, ...f.notes.base].map((n) => n.toLowerCase());
      const shared = fNotes.filter((n) => baseNotes.has(n));
      return { f, shared, score: shared.length };
    })
    .filter((x): x is { f: Fragrance; shared: string[]; score: number } => !!x)
    .sort((a, b) => b.score - a.score);
  if (!candidates.length) return null;

  const best = candidates[0];
  const f2 = best.f;
  const onlyBase = base.notes.base.filter((n) => !best.shared.includes(n.toLowerCase())).slice(0, 3);
  const onlyPartner = f2.notes.base.filter((n) => !best.shared.includes(n.toLowerCase())).slice(0, 3);
  const titled = best.shared.map((n) => n.split(' ').map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(' '));
  const blendedSeason = (['Spring', 'Summer', 'Autumn', 'Winter'] as const).map((k) => ({
    label: k,
    value: Math.round((base.season[k] + f2.season[k]) / 2),
  }));
  return {
    partner: f2,
    shared: titled,
    onlyBase,
    onlyPartner,
    vibe: generateLayerVibe(base, f2, best.shared),
    blendedSeason,
  };
}
