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

export function getBoard(tab: BoardTab, posts: Post[], wardrobe: WardrobeItem[]): BoardEntry[] {
  if (tab === 'votes') {
    const tally: Record<string, number> = {};
    posts.forEach((p) => {
      tally[p.fragId] = (tally[p.fragId] || 0) + p.votes;
    });
    return Object.keys(tally)
      .map((id) => {
        const f = fragById(id);
        return f ? { f, score: tally[id], sub: `${tally[id]} pts` } : null;
      })
      .filter((x): x is BoardEntry => !!x)
      .sort((a, b) => b.score - a.score);
  }
  if (tab === 'views') {
    return FRAGRANCES.map((f) => {
      const v = BOARD_VIEWS[f.id] || 0;
      return { f, score: v, sub: `${v.toLocaleString()} views` };
    })
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }
  // worn
  const wornMap: Record<string, number> = {};
  wardrobe.forEach((w) => {
    wornMap[w.fragId] = (wornMap[w.fragId] || 0) + w.wornCount;
  });
  FRAGRANCES.forEach((f) => {
    if (!wornMap[f.id]) wornMap[f.id] = Math.round(f.votes * 0.04);
  });
  return Object.keys(wornMap)
    .map((id) => {
      const f = fragById(id);
      return f ? { f, score: wornMap[id], sub: `${wornMap[id]}x worn` } : null;
    })
    .filter((x): x is BoardEntry => !!x)
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
