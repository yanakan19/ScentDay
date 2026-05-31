import type { NavigatorScreenParams } from '@react-navigation/native';
import type { PostType } from '@/types';

/** Bottom tab routes (Discover / Feed / Home / Blend / Ranks). */
export type TabParamList = {
  Home: undefined;
  Feed: undefined;
  Discover: undefined;
  Blend: undefined; // ScentBlend / Layering lab
  Ranks: undefined;
};

/** Root stack — tabs plus all pushed detail/modal screens. */
export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  FragranceDetail: { fragId: string };
  NoteDetail: { noteName: string };
  BrandDetail: { brand: string };
  Post: { type: PostType; prefillFragId?: string };
  Profile: undefined;
  PostHistory: undefined;
  Communities: undefined;
  CommunityDetail: { communityId: number };
  Saved: undefined;
  Wardrobe: undefined;
  SuggestFragrance: undefined;
  SuggestDone: undefined;
  UserProfile: { userId: string };
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
