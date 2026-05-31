import { create } from 'zustand';
import type {
  Community,
  CommunityPost,
  FriendSotd,
  Post,
  PostType,
  Review,
  Scope,
  Verdict,
  WardrobeItem,
} from '@/types';
import { SEED_POSTS } from '@/data/posts';
import { SEED_WARDROBE, SEED_FRIEND_SOTDS, INITIAL_SAVED, INITIAL_DROPS, DROP_POINTS } from '@/data/seed';
import { SEED_COMMUNITIES, SEED_COMMUNITY_POSTS } from '@/data/communities';
import { SEED_REVIEWS_MAP } from '@/data/reviews';
import { INITIAL_FOLLOWING, INITIAL_FOLLOWERS, ME } from '@/data/users';

interface ProfileState {
  displayName: string;
  username: string;
  about: string;
  avatarUri: string | null;
  usernameChangedAt: number;
}

interface DropsState {
  total: number;
  breakdown: Record<string, number>;
}

export interface SubmitPostArgs {
  type: PostType;
  fragId: string;
  scope: Scope;
  photo: string | null;
  communityId?: number;
  reviewRating?: number;
  verdict?: Verdict;
  reviewText?: string;
  questionText?: string;
}

interface ScentDayState {
  // ── data ──
  posts: Post[];
  wardrobe: WardrobeItem[];
  communities: Community[];
  communityPosts: Record<number, CommunityPost[]>;
  reviews: Record<string, Review[]>;
  following: string[];
  followers: string[];
  savedIds: string[];
  wishlistIds: string[];
  friendSotds: FriendSotd[];
  mySotd: string | null;
  sotdNotifDismissed: boolean;
  drops: DropsState;
  profile: ProfileState;

  // ── id counters ──
  _postId: number;
  _commentId: number;
  _reviewId: number;

  // ── relationship helpers ──
  isFollowing: (uid: string) => boolean;
  isFollower: (uid: string) => boolean;
  isFriend: (uid: string) => boolean;
  isSaved: (id: string) => boolean;
  isWishlisted: (id: string) => boolean;
  dropsTotal: () => number;

  // ── actions ──
  toggleVote: (postId: number) => void;
  addComment: (postId: number, text: string) => void;
  voteComment: (postId: number, commentId: number) => void;
  toggleSave: (fragId: string) => void;
  toggleWishlist: (fragId: string) => void;
  updateProfile: (p: Partial<Omit<ProfileState, 'usernameChangedAt'>>) => boolean;
  setSotdReaction: (user: string, emoji: string) => void;
  toggleFollow: (uid: string) => void;
  addToCollection: (fragId: string) => void;
  removeFromCollection: (fragId: string) => void;
  checkInSotd: (fragId: string) => void;
  toggleSotdLike: (user: string) => void;
  dismissSotdNotif: () => void;
  submitPost: (args: SubmitPostArgs) => void;
  submitReview: (fragId: string, rating: number, verdict: Verdict, text: string) => void;
  thumbReview: (fragId: string, reviewId: number, dir: 'up' | 'down') => void;
  joinCommunity: (id: number) => void;
  likeCommunityPost: (commId: number, postId: number) => void;
  submitSuggestion: () => void;
  addDrops: (key: string, count?: number) => void;
}

export const useStore = create<ScentDayState>((set, get) => ({
  posts: SEED_POSTS.map((p) => ({ ...p, comments: [...p.comments] })),
  wardrobe: [...SEED_WARDROBE],
  communities: SEED_COMMUNITIES.map((c) => ({ ...c })),
  communityPosts: Object.fromEntries(
    Object.entries(SEED_COMMUNITY_POSTS).map(([k, v]) => [Number(k), v.map((p) => ({ ...p }))])
  ),
  reviews: Object.fromEntries(
    Object.entries(SEED_REVIEWS_MAP).map(([k, v]) => [k, v.map((r) => ({ ...r }))])
  ),
  following: [...INITIAL_FOLLOWING],
  followers: [...INITIAL_FOLLOWERS],
  savedIds: [...INITIAL_SAVED],
  wishlistIds: [],
  profile: { displayName: ME.name, username: 'yanakan_s', about: ME.about, avatarUri: null, usernameChangedAt: 0 },
  friendSotds: SEED_FRIEND_SOTDS.map((s) => ({ ...s })),
  mySotd: null,
  sotdNotifDismissed: false,
  drops: { total: INITIAL_DROPS.total, breakdown: { ...INITIAL_DROPS.breakdown } },

  _postId: 100,
  _commentId: 200,
  _reviewId: 500,

  isFollowing: (uid) => get().following.includes(uid),
  isFollower: (uid) => get().followers.includes(uid),
  isFriend: (uid) => get().following.includes(uid) && get().followers.includes(uid),
  isSaved: (id) => get().savedIds.includes(id),
  isWishlisted: (id) => get().wishlistIds.includes(id),
  dropsTotal: () => get().drops.total,

  addDrops: (key, count = 1) =>
    set((s) => {
      const pts = (DROP_POINTS[key] || 0) * count;
      return {
        drops: {
          total: s.drops.total + pts,
          breakdown: { ...s.drops.breakdown, [key]: (s.drops.breakdown[key] || 0) + count },
        },
      };
    }),

  toggleVote: (postId) =>
    set((s) => ({
      posts: s.posts.map((p) =>
        p.id === postId ? { ...p, voted: !p.voted, votes: p.votes + (p.voted ? -1 : 1) } : p
      ),
    })),

  addComment: (postId, text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const id = get()._commentId + 1;
    set((s) => ({
      _commentId: id,
      posts: s.posts.map((p) =>
        p.id === postId
          ? { ...p, comments: [...p.comments, { id, user: 'you', text: trimmed, votes: 0, voted: false, time: 'now' }] }
          : p
      ),
    }));
    get().addDrops('comment');
  },

  voteComment: (postId, commentId) =>
    set((s) => ({
      posts: s.posts.map((p) =>
        p.id !== postId
          ? p
          : {
              ...p,
              comments: p.comments.map((c) =>
                c.id === commentId ? { ...c, voted: !c.voted, votes: c.votes + (c.voted ? -1 : 1) } : c
              ),
            }
      ),
    })),

  toggleSave: (fragId) => {
    const has = get().savedIds.includes(fragId);
    set((s) => ({
      savedIds: has ? s.savedIds.filter((x) => x !== fragId) : [...s.savedIds, fragId],
    }));
    if (!has) get().addDrops('save');
  },

  toggleWishlist: (fragId) =>
    set((s) => ({
      wishlistIds: s.wishlistIds.includes(fragId)
        ? s.wishlistIds.filter((x) => x !== fragId)
        : [...s.wishlistIds, fragId],
    })),

  // username editable at most once per week; returns false if blocked.
  updateProfile: (p) => {
    let ok = true;
    set((s) => {
      const next = { ...s.profile };
      if (p.displayName !== undefined) next.displayName = p.displayName;
      if (p.about !== undefined) next.about = p.about;
      if (p.avatarUri !== undefined) next.avatarUri = p.avatarUri;
      if (p.username !== undefined && p.username !== s.profile.username) {
        const WEEK = 7 * 24 * 60 * 60 * 1000;
        if (s.profile.usernameChangedAt !== 0 && Date.now() - s.profile.usernameChangedAt < WEEK) {
          ok = false;
        } else {
          next.username = p.username;
          next.usernameChangedAt = Date.now();
        }
      }
      return { profile: next };
    });
    return ok;
  },

  setSotdReaction: (user, emoji) =>
    set((s) => ({
      friendSotds: s.friendSotds.map((x) =>
        x.user === user ? { ...x, reaction: x.reaction === emoji ? null : emoji, liked: (x.reaction === emoji ? false : emoji === '❤️') } : x
      ),
    })),

  toggleFollow: (uid) =>
    set((s) => {
      const following = new Set(s.following);
      const followers = new Set(s.followers);
      if (following.has(uid)) {
        following.delete(uid);
        if (Math.random() < 0.3) followers.delete(uid); // they may unfollow back
      } else {
        following.add(uid);
        if (!followers.has(uid) && Math.random() < 0.4) followers.add(uid); // they may follow back
      }
      return { following: [...following], followers: [...followers] };
    }),

  addToCollection: (fragId) =>
    set((s) =>
      s.wardrobe.some((w) => w.fragId === fragId)
        ? s
        : { wardrobe: [...s.wardrobe, { fragId, wornCount: 0, lastWorn: 'Never' }] }
    ),

  removeFromCollection: (fragId) =>
    set((s) => ({ wardrobe: s.wardrobe.filter((w) => w.fragId !== fragId) })),

  checkInSotd: (fragId) => {
    set((s) => ({
      mySotd: fragId,
      sotdNotifDismissed: true,
      friendSotds: [{ user: 'you', fragId, time: 'now', liked: false }, ...s.friendSotds],
      wardrobe: s.wardrobe.map((w) =>
        w.fragId === fragId ? { ...w, wornCount: w.wornCount + 1, lastWorn: 'Today' } : w
      ),
    }));
    get().addDrops('sotd');
  },

  toggleSotdLike: (user) =>
    set((s) => ({
      friendSotds: s.friendSotds.map((x) => (x.user === user ? { ...x, liked: !x.liked } : x)),
    })),

  dismissSotdNotif: () => set({ sotdNotifDismissed: true }),

  submitReview: (fragId, rating, verdict, text) => {
    const id = get()._reviewId + 1;
    set((s) => ({
      _reviewId: id,
      reviews: {
        ...s.reviews,
        [fragId]: [
          { id, user: 'you', rating, verdict, text, upvotes: 1, downvotes: 0, upvoted: false, downvoted: false, date: 'Just now' },
          ...(s.reviews[fragId] || []),
        ],
      },
    }));
    get().addDrops('review');
  },

  submitPost: ({ type, fragId, scope, photo, communityId, reviewRating, verdict, reviewText, questionText }) => {
    if (type === 'review' && reviewText && reviewText.trim()) {
      get().submitReview(fragId, reviewRating || 3, verdict || 'try', reviewText.trim());
    }
    const postId = get()._postId + 1;
    const newPost: Post = { id: postId, user: 'you', fragId, scope, votes: 1, voted: true, photo, time: 'now', comments: [] };
    set((s) => ({ _postId: postId, posts: [newPost, ...s.posts] }));

    if (communityId) {
      const cpId = get()._postId + 1;
      set((s) => ({
        _postId: cpId,
        communityPosts: {
          ...s.communityPosts,
          [communityId]: [
            { id: cpId, user: 'you', fragId, text: (questionText && questionText.trim()) || 'Check out what I am wearing today!', time: 'now', likes: 0, liked: false },
            ...(s.communityPosts[communityId] || []),
          ],
        },
      }));
    }

    const dropKey = type === 'review' ? 'review' : type === 'question' ? 'comment' : 'post';
    get().addDrops(dropKey);
    if (type === 'sotd') get().addDrops('sotd');

    set((s) => ({
      wardrobe: s.wardrobe.map((w) =>
        w.fragId === fragId ? { ...w, wornCount: w.wornCount + 1, lastWorn: 'Today' } : w
      ),
    }));
  },

  thumbReview: (fragId, reviewId, dir) =>
    set((s) => ({
      reviews: {
        ...s.reviews,
        [fragId]: (s.reviews[fragId] || []).map((r) => {
          if (r.id !== reviewId) return r;
          const next = { ...r };
          if (dir === 'up') {
            if (next.upvoted) {
              next.upvoted = false;
              next.upvotes--;
            } else {
              if (next.downvoted) {
                next.downvoted = false;
                next.downvotes--;
              }
              next.upvoted = true;
              next.upvotes++;
            }
          } else {
            if (next.downvoted) {
              next.downvoted = false;
              next.downvotes--;
            } else {
              if (next.upvoted) {
                next.upvoted = false;
                next.upvotes--;
              }
              next.downvoted = true;
              next.downvotes++;
            }
          }
          return next;
        }),
      },
    })),

  joinCommunity: (id) =>
    set((s) => ({ communities: s.communities.map((c) => (c.id === id ? { ...c, joined: !c.joined } : c)) })),

  likeCommunityPost: (commId, postId) =>
    set((s) => ({
      communityPosts: {
        ...s.communityPosts,
        [commId]: (s.communityPosts[commId] || []).map((p) =>
          p.id === postId ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p
        ),
      },
    })),

  submitSuggestion: () => get().addDrops('suggest'),
}));
