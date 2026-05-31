import type { Fragrance, Post, WardrobeItem } from '@/types';
import { FRAGRANCES, fragById } from '@/data/fragrances';

/**
 * Trending order. The prototype shuffles the `trend` seed once at launch so the
 * trending grid / rankings aren't always identical. We compute a stable shuffled
 * order once per app session here.
 */
const trendingOrder: Fragrance[] = (() => {
  const arr = [...FRAGRANCES];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
})();

/** Pre-computed, stable "views today" numbers (derived from votes). */
const BOARD_VIEWS: Record<string, number> = {};
FRAGRANCES.forEach((f) => {
  BOARD_VIEWS[f.id] = Math.round(f.votes * (0.6 + Math.random() * 0.8));
});

export function getTrending(limit = 15): Fragrance[] {
  return trendingOrder.slice(0, limit);
}

export interface BoardEntry {
  f: Fragrance;
  score: number;
  sub: string;
}

export type BoardTab = 'votes' | 'views' | 'worn';
export type BoardPeriod = 'today' | 'month' | 'all';

// TODO: real Today/Month figures need timestamped engagement events. Until then we
// deterministically scale + jitter the all-time number so each period's list differs.
function periodScale(id: string, period: BoardPeriod): number {
  if (period === 'all') return 1;
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const base = period === 'month' ? 0.45 : 0.12;
  return base * (0.7 + (h % 60) / 100); // 0.7–1.3 jitter
}

export function getBoard(tab: BoardTab, posts: Post[], wardrobe: WardrobeItem[], period: BoardPeriod = 'all'): BoardEntry[] {
  let raw: { f: Fragrance; n: number }[];
  let unit: 'pts' | 'views' | 'worn';

  if (tab === 'votes') {
    const tally: Record<string, number> = {};
    posts.forEach((p) => {
      tally[p.fragId] = (tally[p.fragId] || 0) + p.votes;
    });
    raw = Object.keys(tally)
      .map((id) => {
        const f = fragById(id);
        return f ? { f, n: tally[id] } : null;
      })
      .filter((x): x is { f: Fragrance; n: number } => !!x);
    unit = 'pts';
  } else if (tab === 'views') {
    raw = FRAGRANCES.map((f) => ({ f, n: BOARD_VIEWS[f.id] || 0 }));
    unit = 'views';
  } else {
    const wornMap: Record<string, number> = {};
    wardrobe.forEach((w) => {
      wornMap[w.fragId] = (wornMap[w.fragId] || 0) + w.wornCount;
    });
    FRAGRANCES.forEach((f) => {
      if (!wornMap[f.id]) wornMap[f.id] = Math.round(f.votes * 0.04);
    });
    raw = Object.keys(wornMap)
      .map((id) => {
        const f = fragById(id);
        return f ? { f, n: wornMap[id] } : null;
      })
      .filter((x): x is { f: Fragrance; n: number } => !!x);
    unit = 'worn';
  }

  const label = (n: number) => (unit === 'pts' ? `${n} pts` : unit === 'views' ? `${n.toLocaleString()} views` : `${n}x worn`);
  return raw
    .map(({ f, n }) => {
      const score = Math.max(1, Math.round(n * periodScale(f.id, period)));
      return { f, score, sub: label(score) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
}

/** Search across name, brand and notes (used by Discover › Fragrances). */
export function searchFragrances(query: string): Fragrance[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return FRAGRANCES.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.brand.toLowerCase().includes(q) ||
      [...f.notes.top, ...f.notes.mid, ...f.notes.base].join(' ').toLowerCase().includes(q)
  );
}

/** Group a list of fragrances by brand (preserving insertion order). */
export function groupByBrand(list: Fragrance[]): Record<string, Fragrance[]> {
  const out: Record<string, Fragrance[]> = {};
  list.forEach((f) => {
    (out[f.brand] = out[f.brand] || []).push(f);
  });
  return out;
}

export function fragsWithNote(noteName: string, limit = 8): Fragrance[] {
  const n = noteName.toLowerCase();
  return FRAGRANCES.filter((f) =>
    [...f.notes.top, ...f.notes.mid, ...f.notes.base].some((x) => x.toLowerCase().includes(n))
  )
    .sort((a, b) => b.votes - a.votes)
    .slice(0, limit);
}

export function fragsByBrand(brand: string): Fragrance[] {
  return FRAGRANCES.filter((f) => f.brand === brand).sort((a, b) => b.votes - a.votes);
}

export function brandFragCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  FRAGRANCES.forEach((f) => {
    counts[f.brand] = (counts[f.brand] || 0) + 1;
  });
  return counts;
}
