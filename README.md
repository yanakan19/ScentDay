# ScentDay 📸🧴

A cross-platform (iOS + Android) **React Native + Expo** app for fragrance enthusiasts — migrated from the original single-file HTML prototype into a modular, typed, production-ready codebase you can keep iterating on.

Features ported 1:1 from the prototype: a multi-scope **Feed** (Global / Country / Following / Friends) with voting & comments, **Scent of the Day** check-ins, **Discover** (fragrances / notes / brands / social search), rich **fragrance detail** pages (notes, performance, season/time, where-to-buy, vibe recs, AI review summary + community reviews), **Rankings**, **Communities**, **Profile** with the **Drops** karma system, **My Collection** with a **collection-value** estimate and an **AI Analysis** tab, the **ScentBlend™** layering lab, post composition (SOTD / Review / Question with camera/photo), suggest-a-fragrance, calendar post history, and per-user profiles with a follow graph.

---

## ✅ Prerequisites

> **Heads-up:** this machine does **not** currently have Node.js installed, so the project was authored by hand (not via `create-expo-app`) and **has not been `npm install`-ed or type-checked here yet.** Do the install + typecheck step below first.

- **Node.js 18 LTS or newer** — install from <https://nodejs.org> (includes `npm`/`npx`).
- The **Expo Go** app on your phone (iOS App Store / Google Play) for the fastest way to run it.
- *(Optional, for native builds)* Xcode (iOS) and/or Android Studio, or an [Expo](https://expo.dev) account for cloud builds via EAS.

---

## 🚀 Run it locally

```bash
# 1. From the project folder, install dependencies
npm install

# 2. (recommended) reconcile native module versions with the Expo SDK
npx expo install

# 3. (optional) type-check — should be clean
npm run typecheck

# 4. Start the dev server
npx expo start
```

Then:
- **Phone:** scan the QR code with **Expo Go**.
- **iOS simulator:** press `i`   ·   **Android emulator:** press `a`   ·   **Web preview:** press `w`

Shortcut scripts are also available: `npm run ios`, `npm run android`, `npm run web`.

---

## 📦 Build for iOS / Android (EAS)

```bash
# one-time setup
npm install -g eas-cli
eas login
eas build:configure

# cloud builds (no local Xcode/Android Studio needed)
eas build --platform ios
eas build --platform android
eas build --platform all
```

Prefer local native builds instead? With Xcode / Android Studio installed:

```bash
npx expo run:ios
npx expo run:android
```

> Bundle identifiers are preset in `app.json` (`com.scentday.app`). Camera/photo permission strings are configured there and via the `expo-image-picker` plugin.

---

## 🗂 Project structure

```
ScentDay Trial/
├─ App.tsx                 # Root component (providers + navigator)
├─ index.ts                # registerRootComponent entry
├─ app.json               # Expo config (icons, permissions, plugins)
├─ package.json
├─ tsconfig.json          # strict TS + "@/*" path alias
├─ babel.config.js        # expo preset + module-resolver for "@/"
└─ src/
   ├─ theme/index.ts          # Design tokens (ported from CSS :root vars)
   ├─ types/index.ts          # All domain models (Fragrance, Post, User, …)
   ├─ data/                   # Seed data (swap for an API later)
   │  ├─ fragrances.ts        #   representative catalog subset + loader
   │  ├─ users.ts  posts.ts  communities.ts
   │  ├─ reviews.ts  notes.ts  prices.ts  seed.ts
   ├─ store/useStore.ts       # Zustand store: all app state + actions
   ├─ services/               # Pure business logic
   │  ├─ catalog.ts           #   trending, search, leaderboards
   │  └─ recommendations.ts   #   vibe recs, AI analysis, layering, value
   ├─ hooks/                  # useDrops, useFragrances
   ├─ navigation/             # React Navigation (tabs + native stack)
   │  ├─ index.tsx  BottomTabs.tsx  types.ts
   ├─ components/             # Reusable UI
   │  ├─ ui.tsx               #   Screen, TopBar, ScopeTabs, Card, Chip, …
   │  ├─ BottleSVG.tsx        #   ~50 brand-specific bottle illustrations
   │  ├─ FragRow.tsx  FeedCard.tsx  SotdStrip.tsx  Fab.tsx
   └─ screens/                # One file per screen (18 total)
      ├─ HomeScreen  FeedScreen  DiscoverScreen  RankingsScreen  LayeringScreen   (tabs)
      ├─ FragranceDetailScreen  NoteDetailScreen  BrandDetailScreen
      ├─ PostScreen  ProfileScreen  PostHistoryScreen  WardrobeScreen
      ├─ CommunitiesScreen  CommunityDetailScreen  SavedScreen
      └─ SuggestFragranceScreen  SuggestDoneScreen  UserProfileScreen
```

---

## 🧠 Architecture notes (built for extensibility)

- **State** lives in one Zustand store (`src/store/useStore.ts`). Every mutation from the prototype (votes, comments, follow graph with reciprocity, SOTD, drops, wardrobe, reviews, community posts) is a typed action. Screens subscribe with selectors so they re-render precisely.
- **Data layer** (`src/data/*`) is intentionally isolated. It's seed data today; replace each module with an API call (see the `TODO` markers) and the rest of the app is unaffected. The catalog is a **representative subset** of the prototype's ~600 fragrances — the data shape is identical, so dropping the remaining entries into `RAW_FRAGRANCES` is all that's needed.
- **Business logic** (search, trending, leaderboards, AI collection analysis, layering partner-matching, vibe recommendations, collection valuation) is pure functions in `src/services/*` — easy to unit-test and reuse.
- **Theme** (`src/theme`) is a direct port of the CSS custom properties. Change tokens once to re-skin everything; there's a `TODO` for adding light mode via a provider.
- **Bottle illustrations** are rendered with `react-native-svg` (`BottleSVG.tsx`) — one distinct silhouette per brand, driven by each fragrance's glass/cap colours. Swap in real product photos there when you have them (marked with a `TODO`).
- `TODO` comments flag every natural backend / customisation seam.

## ⚠️ Known caveats

- **Not yet installed/type-checked on this machine** (no Node here). Run `npm install` then `npm run typecheck` — it's expected to pass; fix anything environment-specific that surfaces.
- The fragrance catalog, reviews, follow graph, etc. are **in-memory seed data** and reset on reload (no persistence/backend yet). Add `@react-native-async-storage/async-storage` or a real API when ready.
- App icon / splash use solid-colour defaults (no bespoke image assets bundled). Drop your artwork into `assets/` and reference it from `app.json`.
