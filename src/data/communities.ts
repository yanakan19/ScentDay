import type { Community, CommunityPost } from '@/types';

export const SEED_COMMUNITIES: Community[] = [
  { id: 1, name: 'Fresh Fragrance Lovers', members: 1284, description: 'For those who love light, citrusy, and aquatic scents', joined: false },
  { id: 2, name: 'Niche Perfumery Enthusiasts', members: 856, description: 'Exploring indie and niche fragrances from around the world', joined: false },
  { id: 3, name: 'Fragrance Collectors UK', members: 2104, description: 'UK based collectors sharing collections and hunting rare releases', joined: true },
  { id: 4, name: 'Budget Fragrance Warriors', members: 3421, description: 'Finding quality scents without breaking the bank', joined: false },
  { id: 5, name: 'Woody and Oud Lovers', members: 642, description: 'Deep dives into complex woody and oud based fragrances', joined: false },
  { id: 6, name: 'Fragrance Photography', members: 512, description: 'Share your collection photography and styling tips', joined: false },
];

/** Emoji icon per community id. */
export const COMMUNITY_ICONS: Record<number, string> = {
  1: '🌊', 2: '🎩', 3: '🇬🇧', 4: '💰', 5: '🪵', 6: '📸',
};

export const SEED_COMMUNITY_POSTS: Record<number, CommunityPost[]> = {
  1: [
    { id: 301, user: 'olivia_scents', fragId: 'ysl-y-edp', text: 'Just discovered Y EDP — the sage and apple combo is so crisp and clean. Perfect everyday fresh scent. This community made me try it!', time: '2h', likes: 14, liked: false },
    { id: 302, user: 'fragrance_faye', fragId: 'man-coco-vanille', text: 'Coco Vanille in summer is absolutely divine. Light, tropical, and gets compliments every time. Fresh but not sharp — exactly what this community is about.', time: '5h', likes: 9, liked: false },
    { id: 303, user: 'leics_lloyd', fragId: 'dior-sauvage-edt', text: 'Starting the morning with Sauvage EDT. That bergamot blast on first spray is unmatched for freshness. The pepper adds just enough edge. Highly recommend to everyone here.', time: '1d', likes: 22, liked: true },
  ],
  2: [
    { id: 304, user: 'niche_nina', fragId: 'man-cedrat-boise', text: 'Cedrat Boisé is the gateway drug to niche perfumery. The leather-citrus paradox is exactly what separates niche from designer. If you haven\'t tried it, this is your sign.', time: '3h', likes: 31, liked: false },
    { id: 305, user: 'the_nose_uk', fragId: 'pdm-herod', text: 'Herod by Parfums de Marly is criminally underrated in this community. Tobacco, incense, vanilla — it\'s like a perfectly tailored suit. Pure niche sophistication.', time: '8h', likes: 18, liked: false },
    { id: 306, user: 'scentgod_dubai', fragId: 'man-red-tobacco', text: 'Red Tobacco legitimately changed how I think about fragrance. Mancera proves you don\'t need to spend £400 to smell extraordinary. The saffron-tobacco accord is world class.', time: '2d', likes: 26, liked: false },
  ],
  3: [
    { id: 307, user: 'scentsmith_uk', fragId: 'dior-oud-ispahan', text: 'Finally completed my Dior Private Collection shelf. Oud Ispahan is the crown jewel — the rose and oud combination is flawless. Worth every penny. Who else has the full set?', time: '1h', likes: 19, liked: false },
    { id: 308, user: 'brumscents', fragId: 'pdm-layton', text: 'Picked up Layton at the weekend from Beautybase — fantastic price vs counter. The batch code checks out too. This community\'s buying guide is invaluable, genuinely.', time: '4h', likes: 11, liked: true },
    { id: 309, user: 'coventry_carl', fragId: 'man-black-gold', text: 'Mancera Black Gold arrived today. The oud opening is stunning. Already finding a spot in the display case. 2025 collection is really shaping up.', time: '12h', likes: 8, liked: false },
  ],
  4: [
    { id: 310, user: 'perfume_pete', fragId: 'ysl-larose', text: 'Black Opium on a budget — found it £15 under RRP at an outlet. Performance is incredible for the price. This community saves me so much money. Always check the price trackers before buying!', time: '2h', likes: 34, liked: false },
    { id: 311, user: 'mids_maya', fragId: 'man-coco-vanille', text: 'Mancera Coco Vanille is the sleeper pick of the year. Lasts all day, tropical-clean drydown. Nobody talks about this one but it belongs in every budget collection.', time: '6h', likes: 12, liked: false },
    { id: 312, user: 'marco_p', fragId: 'ysl-y-edp', text: 'YSL Y EDP found for £82 — that\'s as close to budget as this gets for a flagship. The longevity is extraordinary for the price per ml. Best value mainstream fragrance right now.', time: '1d', likes: 27, liked: false },
  ],
};
