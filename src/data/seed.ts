import type { DropRule, FriendSotd, NewsItem, WardrobeItem } from '@/types';

/** Starter collection — most worn first (verbatim port). */
export const SEED_WARDROBE: WardrobeItem[] = [
  { fragId: 'ysl-y-edp', wornCount: 47, lastWorn: 'Today' },
  { fragId: 'man-cedrat-boise', wornCount: 32, lastWorn: 'Yesterday' },
  { fragId: 'ysl-libre', wornCount: 28, lastWorn: '2 days ago' },
  { fragId: 'dior-sauvage-edt', wornCount: 24, lastWorn: '3 days ago' },
  { fragId: 'man-red-tobacco', wornCount: 19, lastWorn: '5 days ago' },
  { fragId: 'ysl-myslf', wornCount: 14, lastWorn: '1 week ago' },
  { fragId: 'pdm-layton', wornCount: 11, lastWorn: '2 weeks ago' },
  { fragId: 'man-black-gold', wornCount: 8, lastWorn: '3 weeks ago' },
];

export const SEED_FRIEND_SOTDS: FriendSotd[] = [
  { user: 'olivia_scents', fragId: 'ysl-libre', time: '10m', liked: false },
  { user: 'the_nose_uk', fragId: 'man-cedrat-boise', time: '25m', liked: false },
  { user: 'marco_p', fragId: 'dior-sauvage-edt', time: '1h', liked: true },
  { user: 'niche_nina', fragId: 'pdm-delina', time: '2h', liked: false },
  { user: 'scentsmith_uk', fragId: 'man-red-tobacco', time: '3h', liked: false },
  { user: 'londoner_luke', fragId: 'ysl-myslf', time: '4h', liked: false },
];

export const INITIAL_SAVED: string[] = ['ysl-y-edp', 'ysl-libre'];

export const MOCK_NEWS: NewsItem[] = [
  { title: "Dior Sauvage Elixir wins Men's Fragrance of the Year at FiFi Awards 2025", source: 'Fragrance Foundation', time: '2h ago', tag: 'Award' },
  { title: 'Tom Ford Beauty announces discontinuation of Black Orchid EDP — final batches hitting shelves', source: 'WWD Beauty', time: '5h ago', tag: 'News' },
  { title: 'Xerjoff launches Naxos Intense: everything you need to know about the new concentration', source: 'The Perfume Society', time: '1d ago', tag: 'Launch' },
  { title: 'Amouage Interlude Man reformulation confirmed: house says character unchanged', source: 'Basenotes', time: '2d ago', tag: 'Update' },
  { title: 'Parfums de Marly Layton EDP rumoured for 2026: inside sources speak', source: 'Fragrantica News', time: '3d ago', tag: 'Rumour' },
];

/** Drops (karma) rule table. */
export const DROP_RULES: DropRule[] = [
  { key: 'post', label: 'Feed Post', icon: '📸', pts: 5, desc: 'Per photo post to the feed' },
  { key: 'review', label: 'Review', icon: '✍️', pts: 10, desc: 'Per review written' },
  { key: 'comment', label: 'Comment', icon: '💬', pts: 2, desc: 'Per comment posted' },
  { key: 'suggest', label: 'Fragrance Suggestion', icon: '➕', pts: 20, desc: 'Per fragrance suggested to database' },
  { key: 'sotd', label: 'Scent of the Day', icon: '🌅', pts: 3, desc: 'Per daily SOTD check-in' },
  { key: 'save', label: 'Saved a Fragrance', icon: '❤️', pts: 1, desc: 'Per fragrance saved' },
  { key: 'like', label: 'Post Liked', icon: '▲', pts: 1, desc: 'When your post receives a vote' },
];

export const DROP_POINTS: Record<string, number> = Object.fromEntries(
  DROP_RULES.map((r) => [r.key, r.pts])
);

export const INITIAL_DROPS = {
  total: 83,
  breakdown: { post: 5, review: 2, comment: 8, suggest: 0, sotd: 4, save: 12, like: 14 } as Record<string, number>,
};

/** Post-history calendar (May 2025). day → { fragId, votes, scope }. */
export const POST_HISTORY: Record<number, { fragId: string; votes: number; scope: 'global' | 'country' | 'local' }> = {
  3: { fragId: 'ysl-y-edp', votes: 18, scope: 'global' },
  9: { fragId: 'man-cedrat-boise', votes: 34, scope: 'country' },
  14: { fragId: 'ysl-libre', votes: 22, scope: 'global' },
  20: { fragId: 'man-red-tobacco', votes: 41, scope: 'local' },
  26: { fragId: 'man-aoud-cafe', votes: 15, scope: 'global' },
};
