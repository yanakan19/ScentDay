import type { User } from '@/types';

/** Mock user directory (verbatim port from the prototype). */
export const ALL_USERS: User[] = [
  { id: 'olivia_scents', name: 'Olivia', bio: 'Addicted to florals and niche gems.', drops: 312, fragCount: 18, posts: 24, location: 'London' },
  { id: 'the_nose_uk', name: 'The Nose', bio: 'Professional reviewer. 500+ tried.', drops: 890, fragCount: 47, posts: 86, location: 'Manchester' },
  { id: 'marco_p', name: 'Marco P', bio: 'Italian nose. Oud obsessed.', drops: 445, fragCount: 31, posts: 42, location: 'Birmingham' },
  { id: 'niche_nina', name: 'Nina', bio: 'Niche only. No designers.', drops: 267, fragCount: 22, posts: 19, location: 'Edinburgh' },
  { id: 'scentsmith_uk', name: 'ScentSmith', bio: 'Collector and reviewer.', drops: 578, fragCount: 38, posts: 55, location: 'Leeds' },
  { id: 'londoner_luke', name: 'Luke', bio: 'West London scent hunter.', drops: 189, fragCount: 14, posts: 16, location: 'London' },
  { id: 'fragrance_faye', name: 'Faye', bio: 'Fragrance blogger. Pink bottle gang.', drops: 423, fragCount: 29, posts: 37, location: 'Bristol' },
  { id: 'brumscents', name: 'BrumScents', bio: 'Birmingham fragrance community.', drops: 134, fragCount: 11, posts: 12, location: 'Birmingham' },
  { id: 'coventry_carl', name: 'Carl', bio: 'Coventry lad. Budget to luxury.', drops: 98, fragCount: 8, posts: 9, location: 'Coventry' },
  { id: 'mids_maya', name: 'Maya', bio: 'Midlands fragrance lover.', drops: 156, fragCount: 12, posts: 14, location: 'Coventry' },
  { id: 'notts_nose', name: 'NottsNose', bio: 'Nottingham based collector.', drops: 201, fragCount: 16, posts: 18, location: 'Nottingham' },
  { id: 'perfume_pete', name: 'Pete', bio: 'Dad of 3, smelling good.', drops: 87, fragCount: 7, posts: 8, location: 'Sheffield' },
  { id: 'fragnatic_fred', name: 'Fred', bio: 'Fragmatic about fragrance.', drops: 334, fragCount: 25, posts: 31, location: 'Liverpool' },
  { id: 'scentgod_dubai', name: 'ScentGod', bio: 'Dubai based. Middle Eastern specialist.', drops: 712, fragCount: 52, posts: 67, location: 'Dubai' },
  { id: 'leics_lloyd', name: 'Lloyd', bio: 'Leicester fragrance community.', drops: 112, fragCount: 9, posts: 10, location: 'Leicester' },
];

export function userById(id: string): User | undefined {
  return ALL_USERS.find((u) => u.id === id);
}

/** Initial follow graph (the signed-in "you" user). */
export const INITIAL_FOLLOWING: string[] = [
  'olivia_scents', 'the_nose_uk', 'marco_p', 'niche_nina', 'scentsmith_uk', 'londoner_luke',
];

export const INITIAL_FOLLOWERS: string[] = [
  'the_nose_uk', 'marco_p', 'niche_nina', 'scentsmith_uk', 'fragrance_faye', 'coventry_carl', 'mids_maya',
];

/** The signed-in user's static profile (the prototype hardcodes "Yanakan"). */
export const ME = {
  id: 'you',
  name: 'Yanakan Sivakumar',
  initial: 'Y',
  tagline: 'UK fragrance enthusiast',
  about: 'Obsessed with quality fragrances and honest reviews. Always up for discovering something new.',
  postCount: 8,
  followers: 24,
  following: 156,
};
