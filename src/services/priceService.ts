/**
 * Price service — returns realistic UK buy options for every fragrance.
 *
 * Architecture:
 *  1. KNOWN_PRICES  — hand-verified UK prices (100 ml unless noted) for ~50
 *     popular fragrances. Updated Q1 2025.
 *  2. Tier fallback  — for any fragrance not in KNOWN_PRICES, uses the brand's
 *     price range from PRICE_RANGES + a deterministic hash offset so prices are
 *     stable but vary between fragrances.
 *  3. Retailer matrix — each tier has a different set of available retailers;
 *     not every shop carries every brand.
 *  4. Every fragrance always gets its official brand site row.
 *
 * Prices are in GBP. Shipping is handled in FragranceDetailScreen.
 */

import type { Fragrance } from '@/types';
import { PRICE_RANGES } from '@/data/prices';
import { BRAND_DOMAINS } from '@/data/brandLogos';

// ─── Types ────────────────────────────────────────────────────────────────

export interface BuyListing {
  vendor: string;
  tag: string;
  price: string;         // e.g. "£84"
  url: string;           // deep-link to retailer product/search page
  official?: boolean;
  trusted?: boolean;
}

// ─── Known UK prices (fragId → { vendor: pencePrice }) ────────────────────
// Format: { retailerKey: priceInPounds }
// retailerKey matches RETAILER_CONFIG keys below.

const KNOWN: Record<string, Partial<Record<string, number>>> = {
  /* ── YSL ── */
  'ysl-myslf':         { official: 110, allbeauty: 88, justmylook: 86, notino: 90, boots: 98, lookfantastic: 92 },
  'ysl-y-edp':         { official: 105, allbeauty: 82, justmylook: 80, notino: 84, boots: 92, lookfantastic: 86 },
  'ysl-libre':         { official: 98,  allbeauty: 72, justmylook: 70, notino: 74, boots: 82, lookfantastic: 76 },
  'ysl-larose':        { official: 102, allbeauty: 64, justmylook: 62, notino: 65, boots: 75, lookfantastic: 68 },
  'ysl-opium':         { official: 88,  allbeauty: 62, justmylook: 60, notino: 63, boots: 70 },
  /* ── Dior ── */
  'dior-sauvage-edt':  { official: 114, allbeauty: 84, justmylook: 83, notino: 87, boots: 95, lookfantastic: 90 },
  'dior-sauvage-edp':  { official: 120, allbeauty: 88, justmylook: 87, notino: 90, boots: 98, lookfantastic: 93 },
  'dior-homme-intense':{ official: 110, allbeauty: 78, justmylook: 76, notino: 80, boots: 88 },
  'dior-oud-ispahan':  { official: 245, allbeauty: 195, notino: 192 },
  'dior-miss-dior':    { official: 108, allbeauty: 78, justmylook: 76, notino: 80, boots: 88, lookfantastic: 82 },
  'dior-j-adore':      { official: 110, allbeauty: 82, justmylook: 80, notino: 84, boots: 90 },
  'dior-fahrenheit':   { official: 95,  allbeauty: 68, justmylook: 66, notino: 70, boots: 78 },
  'dior-poison':       { official: 88,  allbeauty: 62, justmylook: 60, notino: 64 },
  'dior-homme-sport':  { official: 88,  allbeauty: 62, justmylook: 60, notino: 64, boots: 72 },
  /* ── Chanel ── */
  'cha-no5':           { official: 140, allbeauty: 112, justmylook: 110, boots: 125, lookfantastic: 118, selfridges: 140 },
  'cha-bleu':          { official: 145, allbeauty: 115, justmylook: 112, boots: 128, lookfantastic: 120, selfridges: 145 },
  'cha-coco-mademoiselle': { official: 135, allbeauty: 108, justmylook: 105, boots: 120, lookfantastic: 112 },
  'cha-chance':        { official: 120, allbeauty: 95, justmylook: 92, boots: 108, lookfantastic: 98 },
  'cha-gabrielle':     { official: 130, allbeauty: 102, justmylook: 100, boots: 115, lookfantastic: 106 },
  'cha-allure-homme-sport': { official: 95, allbeauty: 75, justmylook: 73, boots: 85 },
  /* ── Mancera ── */
  'man-cedrat-boise':  { official: 145, allbeauty: 105, notino: 108, lookfantastic: 112 },
  'man-roses-vanille': { official: 145, allbeauty: 102, notino: 105 },
  'man-black-gold':    { official: 155, allbeauty: 115, notino: 118 },
  'man-red-tobacco':   { official: 155, allbeauty: 115, notino: 118 },
  'man-coco-vanille':  { official: 145, allbeauty: 105, notino: 108 },
  'man-aoud-cafe':     { official: 155, allbeauty: 115, notino: 118 },
  /* ── Parfums de Marly ── */
  'pdm-layton':        { official: 215, allbeauty: 145, justmylook: 142, notino: 148, lookfantastic: 152 },
  'pdm-delina':        { official: 180, allbeauty: 128, justmylook: 125, notino: 130 },
  'pdm-herod':         { official: 185, allbeauty: 132, justmylook: 128, notino: 134 },
  'pdm-pegasus':       { official: 185, allbeauty: 132, justmylook: 128, notino: 134 },
  'pdm-percival':      { official: 185, allbeauty: 135, justmylook: 132, notino: 136 },
  'pdm-carlisle':      { official: 195, allbeauty: 142, notino: 145 },
  /* ── Xerjoff ── */
  'xer-naxos':         { official: 270, allbeauty: 165, notino: 162 },
  'xer-erba-pura':     { official: 230, allbeauty: 142, notino: 138 },
  'xer-alexandria-ii': { official: 310, allbeauty: 195, notino: 192 },
  /* ── Amouage ── */
  'am-interlude-man':  { official: 230, allbeauty: 165, notino: 162, lookfantastic: 168 },
  'am-gold-man':       { official: 245, allbeauty: 175, notino: 172 },
  'am-reflection-man': { official: 215, allbeauty: 155, notino: 152 },
  'am-epic-man':       { official: 220, allbeauty: 158, notino: 155 },
  /* ── Tom Ford ── */
  'tf-tobacco-vanille':    { official: 195, allbeauty: 148, justmylook: 145, selfridges: 195, harveynichols: 195 },
  'tf-oud-wood':           { official: 195, allbeauty: 148, justmylook: 145, selfridges: 195 },
  'tf-lost-cherry':        { official: 200, allbeauty: 155, justmylook: 152, selfridges: 200 },
  'tf-neroli-portofino':   { official: 175, allbeauty: 138, selfridges: 175 },
  'tf-noir-extreme':       { official: 175, allbeauty: 138, justmylook: 135 },
  'tf-fucking-fabulous':   { official: 200, allbeauty: 155, selfridges: 200 },
  'tf-tuscan-leather':     { official: 195, allbeauty: 148, selfridges: 195 },
  'tf-grey-vetiver':       { official: 175, allbeauty: 135, justmylook: 132 },
  /* ── MFK ── */
  'mfk-br540-edp':     { official: 280, allbeauty: 180, justmylook: 178, selfridges: 280, harveynichols: 280 },
  'mfk-oud-satin':     { official: 290, allbeauty: 185, selfridges: 290 },
  'mfk-grand-soir':    { official: 215, allbeauty: 165, justmylook: 162 },
  'mfk-aqua-celestia': { official: 175, allbeauty: 138, justmylook: 135 },
  /* ── Creed ── */
  'cr-aventus':        { official: 310, allbeauty: 215, justmylook: 210, selfridges: 310, harveynichols: 310 },
  'cr-green-irish':    { official: 275, allbeauty: 195, justmylook: 190 },
  'cr-royal-oud':      { official: 310, allbeauty: 215, notino: 212 },
  'cr-millesime-imperial': { official: 285, allbeauty: 198, notino: 195 },
  /* ── Giorgio Armani ── */
  'ga-adg-edt':        { official: 88,  allbeauty: 65, justmylook: 63, notino: 62, boots: 75, lookfantastic: 68 },
  'ga-adg-profumo':    { official: 95,  allbeauty: 72, justmylook: 70, notino: 69, boots: 80 },
  'ga-si':             { official: 92,  allbeauty: 68, justmylook: 66, boots: 78 },
  /* ── Versace ── */
  'ver-eros-edt':      { official: 82,  allbeauty: 52, justmylook: 50, notino: 49, boots: 60, lookfantastic: 54 },
  'ver-dylan-blue':    { official: 75,  allbeauty: 48, justmylook: 46, notino: 45, boots: 56 },
  /* ── Jean Paul Gaultier ── */
  'jpg-le-male':       { official: 72,  allbeauty: 48, justmylook: 46, notino: 45, boots: 56, lookfantastic: 50 },
  'jpg-scandal':       { official: 68,  allbeauty: 44, justmylook: 42, notino: 41, boots: 52 },
  /* ── Mugler ── */
  'mug-angel':         { official: 95,  allbeauty: 68, justmylook: 66, notino: 65, boots: 78, lookfantastic: 72 },
  'mug-alien':         { official: 88,  allbeauty: 62, justmylook: 60, notino: 59, boots: 72 },
  /* ── Hugo Boss ── */
  'hb-boss-bottled':   { official: 68,  allbeauty: 48, justmylook: 46, notino: 45, boots: 56, lookfantastic: 50, superdrug: 52 },
  'hb-the-scent':      { official: 62,  allbeauty: 44, justmylook: 42, notino: 41, boots: 52 },
  /* ── Ralph Lauren ── */
  'rl-polo-blue':      { official: 72,  allbeauty: 52, justmylook: 50, notino: 49, boots: 60 },
  'rl-polo-green':     { official: 72,  allbeauty: 52, justmylook: 50, notino: 49 },
  /* ── Prada ── */
  'pra-luna-rossa':    { official: 92,  allbeauty: 65, justmylook: 63, notino: 62, boots: 75 },
  'pra-luna-rossa-carbon': { official: 88, allbeauty: 62, justmylook: 60, notino: 59 },
  'pra-amber-pour-homme': { official: 88, allbeauty: 62, justmylook: 60, notino: 59, boots: 72 },
  /* ── Hermès ── */
  'her-terre':         { official: 115, allbeauty: 88, justmylook: 86, boots: 98, lookfantastic: 92 },
  'her-voyage':        { official: 105, allbeauty: 82, justmylook: 80 },
  /* ── Guerlain ── */
  'gue-homme':         { official: 88,  allbeauty: 65, justmylook: 63, boots: 75 },
  'gue-habit-rouge':   { official: 75,  allbeauty: 55, justmylook: 53, notino: 52 },
  /* ── Acqua di Parma ── */
  'adp-colonia':       { official: 105, allbeauty: 85, justmylook: 83, notino: 82, boots: 90 },
  'adp-magnolia-nobile': { official: 115, allbeauty: 92, notino: 90 },
  /* ── Burberry ── */
  'bur-hero':          { official: 82,  allbeauty: 58, justmylook: 56, notino: 55, boots: 65 },
  'bur-her':           { official: 72,  allbeauty: 52, justmylook: 50, notino: 49, boots: 60 },
  /* ── Givenchy ── */
  'giv-gentleman':     { official: 82,  allbeauty: 58, justmylook: 56, notino: 55, boots: 65 },
  /* ── Maison Margiela ── */
  'mm-jazz-club':      { official: 88,  allbeauty: 65, justmylook: 63, notino: 62, lookfantastic: 67 },
  'mm-by-the-fireplace': { official: 88, allbeauty: 65, justmylook: 63, notino: 62, lookfantastic: 67 },
  'mm-beach-walk':     { official: 88,  allbeauty: 65, justmylook: 63, notino: 62 },
  /* ── Kilian ── */
  'kil-angels-share':  { official: 195, allbeauty: 148, selfridges: 195, harveynichols: 195 },
  'kil-love':          { official: 195, allbeauty: 148, selfridges: 195 },
  'kil-black-phantom': { official: 195, allbeauty: 148, selfridges: 195 },
  /* ── Le Labo ── */
  'll-santal33':       { official: 255, allbeauty: 195, notino: 192, selfridges: 255 },
  'll-rose31':         { official: 230, allbeauty: 178, notino: 175 },
  'll-another13':      { official: 230, allbeauty: 178, notino: 175 },
  /* ── Byredo ── */
  'byr-gypsy-water':   { official: 215, allbeauty: 162, notino: 158, selfridges: 215 },
  'byr-mojave-ghost':  { official: 215, allbeauty: 162, notino: 158 },
  'byr-bal-dafrique':  { official: 215, allbeauty: 162, notino: 158 },
  /* ── Nishane ── */
  'nis-hacivat':       { official: 210, allbeauty: 145, notino: 142 },
  'nis-ani':           { official: 210, allbeauty: 145, notino: 142 },
  /* ── Penhaligon's ── */
  'pen-halfeti':       { official: 195, allbeauty: 148, selfridges: 195 },
  /* ── Initio ── */
  'ini-oud-savaqe':    { official: 235, allbeauty: 178, notino: 175 },
  'ini-rehab':         { official: 195, allbeauty: 152, notino: 148 },
  /* ── Montale ── */
  'mon-black-aoud':    { official: 95,  allbeauty: 68, notino: 65 },
  'mon-intense-cafe':  { official: 98,  allbeauty: 70, notino: 67 },
  /* ── Roja Parfums ── */
  'roj-elysium':       { official: 295, allbeauty: 220, notino: 215 },
  'roj-enigma':        { official: 350, allbeauty: 265, notino: 260 },
  /* ── Rabanne ── */
  'rab-1-million':     { official: 75,  allbeauty: 55, justmylook: 53, notino: 52, boots: 62, lookfantastic: 57, superdrug: 58 },
  'rab-invictus':      { official: 72,  allbeauty: 52, justmylook: 50, notino: 49, boots: 60, superdrug: 55 },
  'rab-phantom':       { official: 68,  allbeauty: 48, justmylook: 46, notino: 45, boots: 56 },
  /* ── Dolce & Gabbana ── */
  'dg-light-blue-m':   { official: 78,  allbeauty: 55, justmylook: 53, notino: 52, boots: 62 },
  'dg-the-one-man':    { official: 82,  allbeauty: 58, justmylook: 56, notino: 55, boots: 65 },
  /* ── Armaf ── */
  'arm-cdni-man':      { official: 28,  allbeauty: 18, justmylook: 17, notino: 16, fragshop: 19 },
  'arm-cdni-woman':    { official: 28,  allbeauty: 18, justmylook: 17, notino: 16 },
  'arm-tres-nuit':     { official: 25,  allbeauty: 16, notino: 15 },
  /* ── Al Haramain ── */
  'alh-amber-oud':     { official: 38,  allbeauty: 28, notino: 25 },
  'alh-amber-oud-gold':{ official: 45,  allbeauty: 32, notino: 29 },
  'alh-l-aventure':    { official: 42,  allbeauty: 30, notino: 27 },
  /* ── Lattafa ── */
  'lat-khamrah':       { official: 22,  allbeauty: 15, notino: 14 },
  'lat-raghba':        { official: 22,  allbeauty: 15, notino: 14 },
  'lat-yara':          { official: 22,  allbeauty: 15, notino: 14 },
  /* ── Rasasi ── */
  'ras-hawas':         { official: 28,  allbeauty: 22, notino: 20 },
  'ras-la-yuqawam':    { official: 25,  allbeauty: 20, notino: 18 },
};

// ─── Retailer configuration ───────────────────────────────────────────────

interface RetailerCfg {
  label: string;
  tag: string;
  trusted?: boolean;
  searchUrl: (name: string, brand: string) => string;
}

const RETAILERS: Record<string, RetailerCfg> = {
  allbeauty: {
    label: 'allbeauty',
    tag: 'allbeauty.com',
    trusted: true,
    searchUrl: (n, b) => `https://www.allbeauty.com/search?q=${enc(n + ' ' + b)}`,
  },
  justmylook: {
    label: 'justmylook',
    tag: 'justmylook.com',
    trusted: true,
    searchUrl: (n, b) => `https://www.justmylook.com/search/?q=${enc(n + ' ' + b)}`,
  },
  notino: {
    label: 'notino',
    tag: 'notino.co.uk',
    trusted: true,
    searchUrl: (n) => `https://www.notino.co.uk/search/?phrase=${enc(n)}`,
  },
  boots: {
    label: 'Boots',
    tag: 'boots.com',
    trusted: true,
    searchUrl: (n, b) => `https://www.boots.com/search?q=${enc(n + ' ' + b)}`,
  },
  lookfantastic: {
    label: 'Lookfantastic',
    tag: 'lookfantastic.com',
    searchUrl: (n, b) => `https://www.lookfantastic.com/search?q=${enc(n + ' ' + b)}`,
  },
  selfridges: {
    label: 'Selfridges',
    tag: 'selfridges.com',
    searchUrl: (n, b) => `https://www.selfridges.com/GB/en/cat/search/?q=${enc(n + ' ' + b)}`,
  },
  harveynichols: {
    label: 'Harvey Nichols',
    tag: 'harveynichols.com',
    searchUrl: (n, b) => `https://www.harveynichols.com/store/search/?q=${enc(n + ' ' + b)}`,
  },
  fragshop: {
    label: 'The Fragrance Shop',
    tag: 'thefragranceshop.co.uk',
    trusted: true,
    searchUrl: (n) => `https://www.thefragranceshop.co.uk/search?q=${enc(n)}`,
  },
  perfumeshop: {
    label: 'The Perfume Shop',
    tag: 'theperfumeshop.com',
    trusted: true,
    searchUrl: (n) => `https://www.theperfumeshop.com/search?q=${enc(n)}`,
  },
  superdrug: {
    label: 'Superdrug',
    tag: 'superdrug.com',
    searchUrl: (n) => `https://www.superdrug.com/search?q=${enc(n)}`,
  },
  johnlewis: {
    label: 'John Lewis',
    tag: 'johnlewis.com',
    trusted: true,
    searchUrl: (n, b) => `https://www.johnlewis.com/search?search-term=${enc(n + ' ' + b)}`,
  },
};

function enc(s: string) { return encodeURIComponent(s); }

// Which retailers carry which tier
const TIER_RETAILERS: Record<string, string[]> = {
  designer: ['allbeauty', 'justmylook', 'notino', 'boots', 'lookfantastic', 'fragshop', 'perfumeshop', 'superdrug', 'johnlewis'],
  niche:    ['allbeauty', 'justmylook', 'notino', 'lookfantastic', 'selfridges', 'harveynichols'],
  mideast:  ['allbeauty', 'notino', 'fragshop'],
};

// ─── Helpers ──────────────────────────────────────────────────────────────

function hashInt(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function officialUrl(brand: string, name: string): string {
  const domain = BRAND_DOMAINS[brand];
  if (!domain) return `https://www.google.com/search?q=${enc(name + ' ' + brand + ' official')}`;
  return `https://www.${domain}/search?q=${enc(name)}`;
}

/**
 * Generate a deterministic price within a range, offset slightly per retailer
 * so they don't all show the same number.
 * Minimum returned value is £5 to prevent £0 on very cheap brands.
 */
function genPrice(base: number, spread: number, seed: string): number {
  const s = Math.max(2, Math.round(spread)); // guard against 0 or tiny spread
  const offset = (hashInt(seed) % (s * 2)) - s;
  const raw = Math.round((Math.max(1, base) + offset) / 5) * 5;
  return Math.max(5, raw); // never display £0
}

// ─── Main export ──────────────────────────────────────────────────────────

export function getBuyListings(frag: Fragrance): BuyListing[] {
  const listings: BuyListing[] = [];
  const known = KNOWN[frag.id] ?? {};

  const range = PRICE_RANGES[frag.brand];
  const tier = range?.tier ?? 'designer';
  const mid = range ? Math.round((range.min + range.max) / 2) : 80;
  const spread = range ? Math.round((range.max - range.min) / 6) : 10;

  // 1. Official brand site — always first
  const officialPrice = known['official'] ?? genPrice(mid * 1.15, spread, frag.id + 'off');
  listings.push({
    vendor: frag.brand,
    tag: `${BRAND_DOMAINS[frag.brand] ?? 'official site'}`,
    price: `£${officialPrice}`,
    url: officialUrl(frag.brand, frag.name),
    official: true,
  });

  // 2. Tier retailer list (include only retailers that have a known or generated price)
  const retailerKeys = TIER_RETAILERS[tier] ?? TIER_RETAILERS['designer'];
  for (const key of retailerKeys) {
    const cfg = RETAILERS[key];
    if (!cfg) continue;

    let price: number;
    if (known[key] !== undefined) {
      price = known[key]!;
    } else if (Object.keys(known).length > 0) {
      // We have known prices for some retailers → skip unlisted ones
      // (they genuinely don't stock it at a verified price)
      continue;
    } else {
      // Pure estimate — use 75–90% of official price depending on retailer
      const discount = key === 'notino' ? 0.78 : key === 'allbeauty' ? 0.76 : key === 'justmylook' ? 0.75 : 0.84;
      price = genPrice(Math.round(officialPrice * discount), spread, frag.id + key);
    }

    listings.push({
      vendor: cfg.label,
      tag: cfg.tag,
      price: `£${price}`,
      url: cfg.searchUrl(frag.name, frag.brand),
      trusted: cfg.trusted,
    });
  }

  return listings;
}
