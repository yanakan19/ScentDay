import type { Review } from '@/types';
import { FRAGRANCES } from './fragrances';

/** Hand-written seed reviews for the marquee fragrances (verbatim port). */
const SEED_REVIEWS: Record<string, Omit<Review, 'upvoted' | 'downvoted'>[]> = {
  'ysl-y-edp': [
    { id: 1, user: 'the_nose_uk', rating: 5, date: 'Jan 2025', verdict: 'buy', upvotes: 34, downvotes: 2, text: "A masterclass in modern masculinity. The apple and sage combo is deceptively simple — what you get is this crisp, sophisticated scent that lasts all day. Projection is enormous for the first four hours. My office always asks what I'm wearing." },
    { id: 2, user: 'marco_p', rating: 4, date: 'Feb 2025', verdict: 'buy', upvotes: 21, downvotes: 1, text: 'Reformulated version still impressive but slightly weaker than pre-2019 bottles. The amberwood drydown is rich and worth the price alone. Versatile enough for work but interesting enough for evenings.' },
    { id: 3, user: 'fragnatic_fred', rating: 4, date: 'Mar 2025', verdict: 'try', upvotes: 12, downvotes: 4, text: 'Safe. Very safe. But sometimes safe is exactly right. Inoffensive, clean, well-made. If you want guaranteed compliments from people who know nothing about fragrance, this is your pick.' },
  ],
  'dior-sauvage-edt': [
    { id: 10, user: 'scentgod_dubai', rating: 5, date: 'Dec 2024', verdict: 'buy', upvotes: 89, downvotes: 3, text: 'The most complimented fragrance I own, full stop. The bergamot and ambroxan combination is genius — fresh, masculine, and has this almost addictive quality. Overused? Yes. Overrated? Absolutely not.' },
    { id: 11, user: 'olivia_scents', rating: 3, date: 'Jan 2025', verdict: 'try', upvotes: 44, downvotes: 8, text: 'I understand the hype but I find it a bit generic at this point. You will smell this on every man at every event. If standing out matters to you, look elsewhere. If performance and compliments are all you need, fair enough.' },
    { id: 12, user: 'londoner_luke', rating: 5, date: 'Feb 2025', verdict: 'buy', upvotes: 31, downvotes: 2, text: 'I resisted buying this for years because of the overuse reputation. Finally caved and honestly it deserves every bit of praise. The freshness lasts 8+ hours on my skin. The ambroxan base is warm and skin-like in the best way.' },
  ],
  'man-cedrat-boise': [
    { id: 20, user: 'brumscents', rating: 5, date: 'Nov 2024', verdict: 'buy', upvotes: 56, downvotes: 1, text: 'Cedrat Boise is legitimately special. The leather-citrus paradox works better than it has any right to. Longevity is phenomenal — still going 12 hours later. My most worn bottle.' },
    { id: 21, user: 'scentsmith_uk', rating: 4, date: 'Jan 2025', verdict: 'buy', upvotes: 28, downvotes: 3, text: 'Opening is stunning — that Sicilian lemon blast is unlike anything else. The drydown into oakmoss and leather is where it gets really interesting. Slightly polarising on cold spray but once it warms up, it is brilliant.' },
  ],
  'man-red-tobacco': [
    { id: 30, user: 'coventry_carl', rating: 5, date: 'Oct 2024', verdict: 'buy', upvotes: 42, downvotes: 0, text: 'Red Tobacco is one of those fragrances that changes your standard for what a perfume can be. Saffron, incense, tobacco, vanilla — all balanced perfectly. Heavy hitter for autumn and winter. Worth every penny.' },
    { id: 31, user: 'notts_nose', rating: 4, date: 'Dec 2024', verdict: 'try', upvotes: 19, downvotes: 2, text: 'Opening might be a bit much for some — the saffron is loud. But give it 30 minutes and it transforms into something genuinely beautiful. Not a beginner scent but if you like orientals, this is peak Mancera.' },
  ],
  'ysl-libre': [
    { id: 40, user: 'fragrance_faye', rating: 5, date: 'Feb 2025', verdict: 'buy', upvotes: 37, downvotes: 1, text: "Libre is my all-time favourite. The lavender and Madagascar vanilla pairing is genius — it's simultaneously masculine-coded and deeply feminine. Confident, modern, and utterly beautiful. Projection is excellent." },
    { id: 41, user: 'mids_maya', rating: 4, date: 'Mar 2025', verdict: 'buy', upvotes: 22, downvotes: 2, text: 'I was sceptical about lavender-heavy scents but Libre converted me. The orange blossom heart softens everything and the vanilla base is addictive. Longevity is 7-8 hours easily.' },
  ],
  'pdm-layton': [
    { id: 50, user: 'perfume_pete', rating: 5, date: 'Jan 2025', verdict: 'buy', upvotes: 61, downvotes: 2, text: 'Layton is the gold standard for elegant masculine fragrance at this price point. Apple, lavender, vanilla, guaiac — it should not work this well. Gets better as the day goes on. Compliment magnet of the highest order.' },
    { id: 51, user: 'leics_lloyd', rating: 5, date: 'Feb 2025', verdict: 'buy', upvotes: 44, downvotes: 1, text: 'I have tried over 200 fragrances and Layton remains in my top 3. The opening is fresh and bright, the heart is warm and creamy, the base lingers for hours. A true masterpiece from Parfums de Marly.' },
  ],
};

const SEED_SUMMARIES: Record<string, string> = {
  'ysl-y-edp': 'Reviewers consistently praise the fresh-sophisticated balance and all-day longevity. The amberwood drydown receives particular acclaim. Minor criticisms focus on reformulation concerns, though consensus is that it remains excellent value and highly versatile for professional environments.',
  'dior-sauvage-edt': 'The most polarising fragrance in the database — reviewers either consider it the pinnacle of accessible masculinity or criticise the ubiquity. Nobody disputes performance. Most agree it earns its place despite overexposure, particularly praising the ambroxan-bergamot accord.',
  'man-cedrat-boise': 'Universal praise for the leather-citrus paradox that defines this fragrance. Reviewers highlight exceptional longevity and a drydown that improves over time. Considered one of Mancera\'s best and a gateway into niche perfumery for many.',
  'man-red-tobacco': 'Consistently rated as a top-tier autumn/winter fragrance. The saffron opening divides opinion — some find it challenging initially — but the tobacco-vanilla drydown wins near-universal praise. Reviewers describe it as the definitive Oriental from Mancera.',
  'ysl-libre': 'Libre receives some of the highest emotional responses of any fragrance reviewed. The lavender-vanilla dynamic is described as groundbreaking. Strong consensus on excellent projection and longevity. Particularly praised for its gender-fluid character.',
  'pdm-layton': 'Layton dominates as the most-recommended fragrance for someone seeking a premium everyday scent. Reviewers describe it as nearly flawless. The apple-lavender-vanilla arc is praised as the perfect progression. Consistently cited in lists of all-time greats.',
};

const GENERIC_REVIEW_BANK: Omit<Review, 'id' | 'user' | 'date' | 'upvoted' | 'downvoted'>[][] = [
  [
    { rating: 4, verdict: 'buy', text: 'Solid performance and a genuinely pleasant scent. The dry-down is where it really shines — I get hours of compliment-worthy wear from a single application. Would recommend to anyone in the target demographic for this fragrance.', upvotes: 7, downvotes: 1 },
    { rating: 4, verdict: 'try', text: 'Really impressed with the quality at this price point. The notes work better on skin than they do on paper. If you get a chance to try before buying, do — but I suspect most people will love it. It has become a regular in my rotation.', upvotes: 5, downvotes: 0 },
  ],
  [
    { rating: 5, verdict: 'buy', text: 'One of the most wearable fragrances in its category. It never feels out of place regardless of occasion. I find myself reaching for it on days when I want to smell great without having to think about it. A genuine wardrobe staple.', upvotes: 11, downvotes: 2 },
    { rating: 3, verdict: 'try', text: 'Good fragrance but perhaps slightly overhyped given the price. The opening is lovely but I find the drydown a bit generic. Worth trying if you can test first. It might work better on your skin chemistry than mine — fragrance is very personal.', upvotes: 4, downvotes: 1 },
  ],
  [
    { rating: 4, verdict: 'buy', text: 'A crowd-pleasing fragrance done well. There is nothing groundbreaking here but what it does, it does excellently. Longevity is above average and projection is just right — noticeable but not overwhelming. Good buy.', upvotes: 9, downvotes: 0 },
    { rating: 4, verdict: 'buy', text: "I bought this on a recommendation and it has become one of my most-worn bottles. The balance of notes is impressive and it works across multiple seasons. If you are on the fence, just buy it — I haven't met a person who doesn't like it.", upvotes: 8, downvotes: 1 },
  ],
];

const GENERIC_SUMMARIES = [
  'Community reviewers highlight consistent performance and strong value. The fragrance receives praise for longevity and compliment-pulling ability. Minor criticisms centre on personal skin chemistry variation. Overall consensus is positive with most reviewers recommending a purchase or sample first.',
  'Reviewers consistently note this fragrance punches above its price point. The composition is described as well-balanced and versatile. Performance ratings are above average. The community recommends this as an accessible entry point into the brand.',
  'User reviews are predominantly positive, with particular praise for the drydown phase. Longevity and projection are rated highly. A small number of reviewers note the opening can be polarising, but consensus is that patience rewards — the fragrance improves significantly after the first 30 minutes.',
];

const GENERIC_USERS = ['scentsmith_uk', 'fragnatic_fred', 'marco_p', 'olivia_scents', 'niche_nina', 'the_nose_uk'];
const GENERIC_DATES = ['Jan 2025', 'Feb 2025', 'Mar 2025', 'Nov 2024', 'Dec 2024'];

/**
 * Build the full reviews + summaries maps, generating deterministic placeholder
 * content for any catalog fragrance without a hand-written entry (faithful to
 * the prototype, which populated every fragrance at load).
 */
function buildReviews(): { reviews: Record<string, Review[]>; summaries: Record<string, string> } {
  const reviews: Record<string, Review[]> = {};
  const summaries: Record<string, string> = {};

  // Seed first (add the runtime vote flags).
  for (const [id, list] of Object.entries(SEED_REVIEWS)) {
    reviews[id] = list.map((r) => ({ ...r, upvoted: false, downvoted: false }));
  }
  Object.assign(summaries, SEED_SUMMARIES);

  // Fill the gaps.
  FRAGRANCES.forEach((f, i) => {
    if (!reviews[f.id]) {
      const bank = GENERIC_REVIEW_BANK[i % GENERIC_REVIEW_BANK.length];
      reviews[f.id] = bank.map((r, ri) => ({
        ...r,
        id: 600 + i * 10 + ri,
        user: GENERIC_USERS[((i + ri) * 3) % GENERIC_USERS.length],
        date: GENERIC_DATES[(i + ri) % GENERIC_DATES.length],
        upvoted: false,
        downvoted: false,
      }));
    }
    if (!summaries[f.id]) {
      summaries[f.id] = GENERIC_SUMMARIES[i % GENERIC_SUMMARIES.length];
    }
  });

  return { reviews, summaries };
}

const built = buildReviews();
export const SEED_REVIEWS_MAP: Record<string, Review[]> = built.reviews;
export const AI_SUMMARIES: Record<string, string> = built.summaries;

export function getAISummary(fragId: string): string | undefined {
  return AI_SUMMARIES[fragId];
}
