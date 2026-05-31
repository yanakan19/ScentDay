/**
 * DESIGN TOKENS
 * Direct port of the CSS :root custom properties from the HTML prototype.
 * Change these to re-skin the whole app.
 *
 * TODO (extensibility): support light mode by exposing a second token set and
 *   a ThemeProvider/useTheme() hook. Everything already reads from `theme`.
 */
export const colors = {
  bg: '#000000', // clean true black
  surface: '#0d0d0f', // near-black cards
  surface2: '#161618', // slightly lifted
  line: '#262629', // cool grey hairlines
  text: '#f7f8fa', // cool white
  textDim: '#8a8c93', // muted cool grey
  accent: '#ffffff', // white accents
  accentSoft: '#1c1c20', // subtle surface for active states
  danger: '#ff5a4d',
  flame: '#ff7a18', // trending flame accent
  // semantic helpers used across screens
  black: '#000000',
  heart: '#e0644b',
  star: '#f59e0b',
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  pill: 30,
  round: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 18,
  xxl: 24,
} as const;

export const fontWeight = {
  regular: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
  black: '900',
} as const;

/** Verdict pill palettes (buy / try / skip) from the prototype. */
export const verdictColors = {
  buy: { bg: '#064e3b', text: '#6ee7b7' },
  try: { bg: '#1e3a5f', text: '#93c5fd' },
  skip: { bg: '#3b1f1f', text: '#fca5a5' },
} as const;

/** Price-tier pill palettes. */
export const priceTierColors = {
  mideast: { bg: '#1a1000', text: '#d4af37' },
  designer: { bg: '#001a10', text: '#6ee7b7' },
  niche: { bg: '#100020', text: '#c084fc' },
} as const;

export const theme = { colors, radius, spacing, fontWeight, verdictColors, priceTierColors };
export type Theme = typeof theme;
export default theme;
