/**
 * Domain models — typed versions of the data structures from the HTML prototype.
 * These are the shared contracts every screen, component and the store rely on.
 */

export type Scope = 'global' | 'country' | 'local';
export type FeedTab = 'global' | 'country' | 'following' | 'friends';
export type Verdict = 'buy' | 'try' | 'skip';
export type PriceTier = 'designer' | 'niche' | 'mideast';
export type PostType = 'sotd' | 'review' | 'question';

export interface BuyOption {
  vendor: string;
  tag: string;
  price: string;
  ic: string;
  official?: boolean;
}

export interface FragranceNotes {
  top: string[];
  mid: string[];
  base: string[];
}

export interface SeasonMap {
  Spring: number;
  Summer: number;
  Autumn: number;
  Winter: number;
}

export interface TimeMap {
  Morning: number;
  Daytime: number;
  Evening: number;
  Night: number;
}

export interface Fragrance {
  id: string;
  brand: string;
  name: string;
  /** Bottle glass colour (hex). */
  color: string;
  /** Bottle cap colour (hex). */
  capColor: string;
  /** Trending rank seed (lower = hotter). Shuffled at runtime. */
  trend: number;
  concentration: string;
  perfumer: string;
  year: number;
  rating: number;
  votes: number;
  notes: FragranceNotes;
  perf: { longevity: number; projection: number };
  season: SeasonMap;
  time: TimeMap;
  buy: BuyOption[];
}

export interface Comment {
  id: number;
  user: string;
  text: string;
  votes: number;
  voted: boolean;
  time: string;
}

export interface Post {
  id: number;
  user: string;
  fragId: string;
  /** Free-text fragrance name fallback when fragId is unknown. */
  fragName?: string;
  scope: Scope;
  votes: number;
  voted: boolean;
  photo: string | null;
  time: string;
  comments: Comment[];
}

export interface User {
  id: string;
  name: string;
  bio: string;
  drops: number;
  fragCount: number;
  posts: number;
  location: string;
}

export interface Community {
  id: number;
  name: string;
  members: number;
  description: string;
  joined: boolean;
}

export interface CommunityPost {
  id: number;
  user: string;
  fragId: string;
  text: string;
  time: string;
  likes: number;
  liked: boolean;
}

export interface Review {
  id: number;
  user: string;
  rating: number;
  date: string;
  verdict: Verdict;
  text: string;
  upvotes: number;
  downvotes: number;
  upvoted: boolean;
  downvoted: boolean;
}

export interface NoteInfo {
  name: string;
  icon: string;
  origin: string;
  smells: string;
  description: string;
}

export type NotesDatabase = Record<string, NoteInfo[]>;

export interface PriceRange {
  min: number;
  max: number;
  tier: PriceTier;
}

export interface WardrobeItem {
  fragId: string;
  wornCount: number;
  lastWorn: string;
}

export interface FriendSotd {
  user: string;
  fragId: string;
  time: string;
  liked: boolean;
}

export interface DropRule {
  key: string;
  label: string;
  icon: string;
  pts: number;
  desc: string;
}

export interface NewsItem {
  title: string;
  source: string;
  time: string;
  tag: string;
}
