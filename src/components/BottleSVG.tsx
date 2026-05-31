// Replaces the HTML prototype's `bottleSVG()` — draws a brand-distinct perfume bottle in pure react-native-svg. TODO: real product photos could be swapped in here later.
import React from 'react';
import {
  Svg,
  Path,
  Rect,
  Ellipse,
  Circle,
  Line,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import type { Fragrance } from '@/types';

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Relative luminance (0..1) of a #rrggbb / #rgb hex colour. */
function luminance(hex: string): number {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  const r = parseInt(h.slice(0, 2), 16) || 0;
  const g = parseInt(h.slice(2, 4), 16) || 0;
  const b = parseInt(h.slice(4, 6), 16) || 0;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/** Short uppercase brand abbreviation for the label plate (2–4 chars). */
function brandAbbrev(brand: string): string {
  const map: Record<string, string> = {
    'Yves Saint Laurent': 'YSL',
    Dior: 'DIOR',
    Mancera: 'MCR',
    'Parfums de Marly': 'PdM',
    Xerjoff: 'XJ',
    Amouage: 'AMG',
    'Matiere Premiere': 'MP',
    'Tom Ford': 'TF',
    'Maison Francis Kurkdjian': 'MFK',
    Afnan: 'AFN',
    'French Avenue': 'FA',
    'Street Origins': 'SO',
    'Giorgio Armani': 'GA',
    Kilian: 'KIL',
    "Toskovat'": 'TSK',
    'Orto Parisi': 'OP',
    'Acqua di Parma': 'AdP',
    Creed: 'CR',
    'Ex Nihilo': 'XN',
    "D'Orsay": 'DOR',
    Zoologist: 'ZOO',
    'Maison Alhambra': 'MA',
    Khadlaj: 'KHJ',
    'Paris Corner': 'PC',
    Rasasi: 'RAS',
    'Al Haramain': 'AH',
    'Maison Crivelli': 'MC',
    Versace: 'VRS',
    Burberry: 'BBY',
    Kayali: 'KAY',
    Mugler: 'MGL',
    Mykonos: 'MYK',
    Givenchy: 'GIV',
    Avon: 'AVN',
    Next: 'NXT',
    'Dolce & Gabbana': 'D&G',
    'Viktor & Rolf': 'V&R',
    Diptyque: 'DPT',
    'Christian Louboutin': 'CL',
    'Frederic Malle': 'FM',
    'Maison Margiela': 'MMM',
    Chloe: 'CHL',
    Valentino: 'VAL',
    'Room 1015': '1015',
    Zara: 'ZARA',
    'Maison Asrar': 'MAS',
    'Jean Paul Gaultier': 'JPG',
    'Roja Parfums': 'ROJA',
    Rayhaan: 'RAY',
    'Bespoke London': 'BL',
    'Ralph Lauren': 'RL',
  };
  if (map[brand]) return map[brand];
  // Generic fallback: initials of up to 3 words, else first 3 letters.
  const words = brand.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return words
      .slice(0, 3)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }
  return brand.slice(0, 3).toUpperCase();
}

/** Shared props every silhouette renderer receives. */
interface ShapeProps {
  glass: string;
  cap: string;
  /** Per-brand fill for the label-plate text. */
  labelText: string;
  /** Colour for thin accent strokes/lines drawn on the glass. */
  stroke: string;
  abbrev: string;
  gradId: string;
}

/* A reusable label plate centred on the bottle body. */
function LabelPlate({
  cx,
  cy,
  w,
  h,
  text,
  textColor,
  rounded = 2,
}: {
  cx: number;
  cy: number;
  w: number;
  h: number;
  text: string;
  textColor: string;
  rounded?: number;
}): React.ReactElement {
  return (
    <>
      <Rect
        x={cx - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        rx={rounded}
        fill="#f5f3ee"
        opacity={0.94}
      />
      <SvgText
        x={cx}
        y={cy + 3}
        fontSize={9}
        fontWeight="700"
        fill={textColor}
        textAnchor="middle"
      >
        {text}
      </SvgText>
    </>
  );
}

/* The faint ground shadow placed under every bottle. */
function BaseShadow(): React.ReactElement {
  return <Ellipse cx={40} cy={110} rx={22} ry={4} fill="#000000" opacity={0.18} />;
}

/* ------------------------------------------------------------------ */
/* Per-brand silhouettes                                              */
/* Each returns the glass + cap + accents; the label plate + shadow   */
/* are composed by the wrapper so every brand stays consistent.       */
/* ------------------------------------------------------------------ */

function ShapeYSL(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={22} y={20} width={36} height={10} fill={p.cap} rx={1} />
      <Path
        d="M24 30 h32 a4 4 0 0 1 4 4 v58 a3 3 0 0 1 -3 3 H23 a3 3 0 0 1 -3 -3 V34 a4 4 0 0 1 4 -4 Z"
        fill={`url(#${p.gradId})`}
      />
    </>
  );
}

function ShapeDior(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={28} y={18} width={24} height={12} fill={p.cap} rx={1} />
      <Path
        d="M22 30 l4 -2 h28 l4 2 v58 l-4 2 H26 l-4 -2 Z"
        fill={`url(#${p.gradId})`}
      />
      {/* D-shaped inset */}
      <Path d="M34 50 h6 a8 9 0 0 1 0 18 h-6 Z" fill="#f5f3ee" opacity={0.9} />
    </>
  );
}

function ShapeMancera(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={32} y={18} width={16} height={12} fill={p.cap} rx={2} />
      <Path
        d="M18 44 q0 -14 22 -14 q22 0 22 14 v44 a4 4 0 0 1 -4 4 H22 a4 4 0 0 1 -4 -4 Z"
        fill={`url(#${p.gradId})`}
      />
      <Circle cx={40} cy={64} r={11} fill="#f5f3ee" opacity={0.92} />
      <Circle cx={40} cy={64} r={11} fill="none" stroke={p.cap} strokeWidth={1.5} />
    </>
  );
}

function ShapeParfumsDeMarly(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Ellipse cx={40} cy={20} rx={9} ry={6} fill={p.cap} />
      <Rect x={24} y={26} width={32} height={68} rx={4} fill={`url(#${p.gradId})`} />
      {/* vertical grooves */}
      <Line x1={30} y1={30} x2={30} y2={90} stroke={p.stroke} strokeWidth={1} opacity={0.35} />
      <Line x1={36} y1={30} x2={36} y2={90} stroke={p.stroke} strokeWidth={1} opacity={0.35} />
      <Line x1={44} y1={30} x2={44} y2={90} stroke={p.stroke} strokeWidth={1} opacity={0.35} />
      <Line x1={50} y1={30} x2={50} y2={90} stroke={p.stroke} strokeWidth={1} opacity={0.35} />
    </>
  );
}

function ShapeXerjoff(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Path d="M33 14 q7 -6 14 0 v8 H33 Z" fill={p.cap} />
      <Rect x={28} y={22} width={24} height={72} rx={6} fill={`url(#${p.gradId})`} />
      <Line x1={33} y1={26} x2={33} y2={90} stroke={p.stroke} strokeWidth={0.8} opacity={0.3} />
      <Line x1={40} y1={26} x2={40} y2={90} stroke={p.stroke} strokeWidth={0.8} opacity={0.3} />
      <Line x1={47} y1={26} x2={47} y2={90} stroke={p.stroke} strokeWidth={0.8} opacity={0.3} />
    </>
  );
}

function ShapeAmouage(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Path d="M26 22 q14 -10 28 0 v6 H26 Z" fill={p.cap} />
      <Rect x={20} y={28} width={40} height={66} rx={3} fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeMatierePremiere(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={35} y={16} width={10} height={12} fill={p.cap} rx={1} />
      <Rect x={31} y={28} width={18} height={66} rx={3} fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeTomFord(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={24} y={16} width={32} height={14} fill={p.cap} />
      <Rect x={22} y={30} width={36} height={64} fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeMFK(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={32} y={18} width={16} height={12} fill={p.cap} rx={2} />
      <Rect x={24} y={30} width={32} height={64} rx={8} fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeAfnan(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={33} y={16} width={14} height={12} fill={p.cap} />
      <Path d="M24 28 l32 0 l-2 66 l-28 0 Z" fill={`url(#${p.gradId})`} />
      <Line x1={32} y1={32} x2={31} y2={90} stroke={p.stroke} strokeWidth={1} opacity={0.4} />
      <Line x1={40} y1={32} x2={40} y2={90} stroke={p.stroke} strokeWidth={1} opacity={0.4} />
      <Line x1={48} y1={32} x2={49} y2={90} stroke={p.stroke} strokeWidth={1} opacity={0.4} />
    </>
  );
}

function ShapeFrenchAvenue(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={35} y={14} width={10} height={14} fill={p.cap} rx={1} />
      <Path
        d="M30 30 q2 -4 -2 -6 M28 28 q4 4 24 0 q-2 6 2 8 v56 a4 4 0 0 1 -4 4 H30 a4 4 0 0 1 -4 -4 V36 q4 -4 2 -8 Z"
        fill={`url(#${p.gradId})`}
      />
    </>
  );
}

function ShapeStreetOrigins(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={33} y={16} width={14} height={12} fill={p.cap} />
      <Path d="M26 36 l14 -8 l14 8 v50 l-14 8 l-14 -8 Z" fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeGiorgioArmani(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={30} y={16} width={20} height={12} fill={p.cap} rx={1} />
      <Path d="M24 34 l6 -6 h20 l6 6 v54 l-6 6 H30 l-6 -6 Z" fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeKilian(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={28} y={16} width={24} height={12} fill={p.cap} rx={2} />
      <Rect x={24} y={28} width={32} height={66} rx={6} fill={`url(#${p.gradId})`} />
      <Rect x={24} y={36} width={32} height={4} fill={p.cap} opacity={0.8} />
      <Rect x={24} y={84} width={32} height={4} fill={p.cap} opacity={0.8} />
    </>
  );
}

function ShapeToskovat(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Path d="M30 16 h20 l-4 12 h-12 Z" fill={p.cap} />
      <Rect x={26} y={28} width={28} height={66} fill={`url(#${p.gradId})`} />
      <Line x1={26} y1={56} x2={54} y2={52} stroke={p.stroke} strokeWidth={1.5} opacity={0.5} />
    </>
  );
}

function ShapeOrtoParisi(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={32} y={14} width={16} height={14} fill={p.cap} rx={1} />
      <Rect x={28} y={28} width={24} height={66} fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeAcquaDiParma(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Path d="M32 14 q8 -6 16 0 v10 H32 Z" fill={p.cap} />
      <Rect x={28} y={24} width={24} height={70} rx={12} fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeCreed(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={28} y={16} width={24} height={12} fill={p.cap} rx={1} />
      <Rect x={20} y={28} width={40} height={66} rx={2} fill={`url(#${p.gradId})`} />
      <Line x1={29} y1={32} x2={29} y2={90} stroke={p.stroke} strokeWidth={0.8} opacity={0.3} />
      <Line x1={40} y1={32} x2={40} y2={90} stroke={p.stroke} strokeWidth={0.8} opacity={0.3} />
      <Line x1={51} y1={32} x2={51} y2={90} stroke={p.stroke} strokeWidth={0.8} opacity={0.3} />
    </>
  );
}

function ShapeExNihilo(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={26} y={16} width={28} height={14} fill={p.cap} rx={1} />
      <Rect x={26} y={30} width={28} height={64} rx={2} fill={`url(#${p.gradId})`} />
      <Rect x={26} y={30} width={28} height={10} fill={p.cap} opacity={0.55} />
    </>
  );
}

function ShapeDOrsay(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={35} y={16} width={10} height={12} fill={p.cap} rx={1} />
      <Ellipse cx={40} cy={62} rx={13} ry={34} fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeZoologist(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={32} y={16} width={16} height={12} fill={p.cap} rx={2} />
      <Path d="M18 50 q0 -22 22 -22 q22 0 22 22 v40 a4 4 0 0 1 -4 4 H22 a4 4 0 0 1 -4 -4 Z" fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeMaisonAlhambra(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Path d="M40 12 q6 0 6 8 q0 8 -6 8 q-6 0 -6 -8 q0 -8 6 -8 Z" fill={p.cap} />
      <Path d="M22 40 q0 -12 18 -12 q18 0 18 12 v48 a4 4 0 0 1 -4 4 H26 a4 4 0 0 1 -4 -4 Z" fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeKhadlaj(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Path d="M40 12 l6 16 h-12 Z" fill={p.cap} />
      <Path d="M30 28 h20 l4 16 v46 a4 4 0 0 1 -4 4 H30 a4 4 0 0 1 -4 -4 V44 Z" fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeParisCorner(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={30} y={20} width={20} height={10} fill={p.cap} rx={1} />
      <Rect x={26} y={30} width={28} height={56} rx={2} fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeRasasi(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Path d="M32 16 q8 -6 16 0 v8 H32 Z" fill={p.cap} />
      <Path d="M20 46 q0 -22 20 -22 q20 0 20 22 v42 a4 4 0 0 1 -4 4 H24 a4 4 0 0 1 -4 -4 Z" fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeAlHaramain(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Path d="M40 10 q5 0 5 7 v5 h-10 v-5 q0 -7 5 -7 Z" fill={p.cap} />
      <Path d="M28 40 q0 -18 12 -18 q12 0 12 18 v50 a3 3 0 0 1 -3 3 H31 a3 3 0 0 1 -3 -3 Z" fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeMaisonCrivelli(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Path d="M28 18 l24 -4 v14 H28 Z" fill={p.cap} />
      <Rect x={24} y={28} width={32} height={66} fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeVersace(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={26} y={16} width={28} height={12} fill={p.cap} rx={1} />
      <Circle cx={33} cy={22} r={1.6} fill={p.stroke} />
      <Circle cx={40} cy={22} r={1.6} fill={p.stroke} />
      <Circle cx={47} cy={22} r={1.6} fill={p.stroke} />
      <Rect x={22} y={28} width={36} height={66} rx={2} fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeBurberry(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={30} y={16} width={20} height={12} fill={p.cap} rx={1} />
      <Rect x={24} y={28} width={32} height={66} rx={2} fill={`url(#${p.gradId})`} />
      <Rect x={24} y={56} width={32} height={5} fill={p.cap} opacity={0.8} />
    </>
  );
}

function ShapeKayali(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={34} y={14} width={12} height={14} fill={p.cap} rx={3} />
      <Path d="M22 52 q0 -24 18 -24 q18 0 18 24 q0 26 -18 42 q-18 -16 -18 -42 Z" fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeMugler(p: ShapeProps): React.ReactElement {
  return (
    <>
      {/* star cap */}
      <Path d="M40 10 l3 6 l7 1 l-5 5 l1 7 l-6 -3 l-6 3 l1 -7 l-5 -5 l7 -1 Z" fill={p.cap} />
      <Path d="M26 34 l14 -6 l14 6 v54 a4 4 0 0 1 -4 4 H30 a4 4 0 0 1 -4 -4 Z" fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeMykonos(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={34} y={20} width={12} height={10} fill={p.cap} rx={2} />
      <Rect x={26} y={30} width={28} height={50} rx={12} fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeGivenchy(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={30} y={16} width={20} height={12} fill={p.cap} rx={1} />
      <Path d="M22 36 l8 -8 h20 l8 8 v58 H22 Z" fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeAvon(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={35} y={18} width={10} height={10} fill={p.cap} rx={2} />
      <Ellipse cx={40} cy={62} rx={18} ry={34} fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeNext(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={30} y={16} width={20} height={10} fill={p.cap} rx={1} />
      <Path d="M30 26 h20 v6 h6 v62 H24 V32 h6 Z" fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeDolceGabbana(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={33} y={16} width={14} height={12} fill={p.cap} rx={1} />
      <Path d="M26 28 h28 v22 q-14 6 -14 12 q0 6 14 12 v8 a3 3 0 0 1 -3 3 H29 a3 3 0 0 1 -3 -3 v-8 q14 -6 14 -12 q0 -6 -14 -12 Z" fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeViktorRolf(p: ShapeProps): React.ReactElement {
  return (
    <>
      {/* faceted spiked cap */}
      <Path d="M34 28 l6 -16 l6 16 Z" fill={p.cap} />
      <Path d="M22 50 q0 -22 18 -22 q18 0 18 22 v40 a4 4 0 0 1 -4 4 H26 a4 4 0 0 1 -4 -4 Z" fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeDiptyque(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={35} y={16} width={10} height={12} fill={p.cap} rx={1} />
      <Rect x={26} y={28} width={28} height={66} rx={4} fill={`url(#${p.gradId})`} />
      <Ellipse cx={40} cy={62} rx={11} ry={14} fill="#f5f3ee" opacity={0.95} />
    </>
  );
}

function ShapeChristianLouboutin(p: ShapeProps): React.ReactElement {
  return (
    <>
      {/* red spiky cap */}
      <Path d="M34 30 l2 -18 l2 6 l2 -8 l2 8 l2 -6 l2 18 Z" fill="#c1121f" />
      <Rect x={32} y={30} width={16} height={56} fill={`url(#${p.gradId})`} />
      {/* red base accent */}
      <Rect x={32} y={86} width={16} height={6} fill="#c1121f" />
    </>
  );
}

function ShapeFredericMalle(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={34} y={14} width={12} height={14} fill={p.cap} rx={1} />
      <Rect x={32} y={28} width={16} height={66} fill={`url(#${p.gradId})`} />
      <Line x1={32} y1={44} x2={48} y2={44} stroke={p.stroke} strokeWidth={0.8} opacity={0.4} />
      <Line x1={32} y1={50} x2={48} y2={50} stroke={p.stroke} strokeWidth={0.8} opacity={0.4} />
    </>
  );
}

function ShapeMaisonMargiela(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={32} y={18} width={16} height={10} fill={p.cap} rx={1} />
      <Rect x={26} y={28} width={28} height={66} rx={2} fill={`url(#${p.gradId})`} />
      {/* dashed stitching */}
      <Line
        x1={29}
        y1={31}
        x2={29}
        y2={91}
        stroke={p.stroke}
        strokeWidth={1}
        strokeDasharray="2,3"
        opacity={0.7}
      />
      <Line
        x1={51}
        y1={31}
        x2={51}
        y2={91}
        stroke={p.stroke}
        strokeWidth={1}
        strokeDasharray="2,3"
        opacity={0.7}
      />
    </>
  );
}

function ShapeChloe(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={32} y={16} width={16} height={12} fill={p.cap} rx={3} />
      <Rect x={24} y={28} width={32} height={66} rx={12} fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeValentino(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={28} y={16} width={24} height={12} fill={p.cap} />
      <Circle cx={32} cy={22} r={1.5} fill={p.stroke} />
      <Circle cx={36} cy={22} r={1.5} fill={p.stroke} />
      <Circle cx={40} cy={22} r={1.5} fill={p.stroke} />
      <Circle cx={44} cy={22} r={1.5} fill={p.stroke} />
      <Circle cx={48} cy={22} r={1.5} fill={p.stroke} />
      <Rect x={24} y={28} width={32} height={66} fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeRoom1015(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Path d="M30 14 l18 4 l-2 10 H30 Z" fill={p.cap} />
      <Rect x={26} y={28} width={28} height={66} fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeZara(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={34} y={20} width={12} height={8} fill={p.cap} />
      <Rect x={28} y={28} width={24} height={66} fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeMaisonAsrar(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Path d="M40 12 q5 0 5 6 q0 6 -5 6 q-5 0 -5 -6 q0 -6 5 -6 Z" fill={p.cap} />
      <Path d="M18 42 q0 -18 22 -18 q22 0 22 18 v46 a4 4 0 0 1 -4 4 H22 a4 4 0 0 1 -4 -4 Z" fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeJeanPaulGaultier(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={34} y={16} width={12} height={10} fill={p.cap} rx={2} />
      <Path d="M30 26 q-2 8 -2 14 q0 8 4 14 q-4 6 -4 14 q0 8 2 14 a3 3 0 0 0 3 3 h14 a3 3 0 0 0 3 -3 q2 -6 2 -14 q0 -8 -4 -14 q4 -6 4 -14 q0 -6 -2 -14 Z" fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeRojaParfums(p: ShapeProps): React.ReactElement {
  return (
    <>
      {/* ornate stopper */}
      <Circle cx={40} cy={16} r={5} fill={p.cap} />
      <Rect x={37} y={20} width={6} height={8} fill={p.cap} />
      <Path d="M24 44 q0 -16 16 -16 q16 0 16 16 q0 8 -4 14 q4 6 4 14 v12 a4 4 0 0 1 -4 4 H28 a4 4 0 0 1 -4 -4 V72 q4 -6 4 -14 q-4 -6 -4 -14 Z" fill={`url(#${p.gradId})`} />
      {/* gold band */}
      <Rect x={26} y={60} width={28} height={4} fill="#d4af37" />
    </>
  );
}

function ShapeRayhaan(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Path d="M40 12 l5 16 h-10 Z" fill={p.cap} />
      <Rect x={30} y={28} width={20} height={66} rx={3} fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeBespokeLondon(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Path d="M32 18 l16 0 l-2 10 h-12 Z" fill={p.cap} />
      <Path d="M28 28 l24 0 l-3 6 v56 a3 3 0 0 1 -3 3 H34 a3 3 0 0 1 -3 -3 V34 Z" fill={`url(#${p.gradId})`} />
    </>
  );
}

function ShapeRalphLauren(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={32} y={16} width={16} height={12} fill={p.cap} rx={2} />
      <Rect x={24} y={28} width={32} height={66} rx={10} fill={`url(#${p.gradId})`} />
      {/* polo stripe */}
      <Line x1={24} y1={48} x2={56} y2={48} stroke="#0a3d62" strokeWidth={3} opacity={0.85} />
    </>
  );
}

function ShapeGeneric(p: ShapeProps): React.ReactElement {
  return (
    <>
      <Rect x={32} y={18} width={16} height={12} fill={p.cap} rx={1} />
      <Rect x={26} y={30} width={28} height={64} rx={3} fill={`url(#${p.gradId})`} />
    </>
  );
}

/* Map each brand to its renderer and the label-plate centre y. */
function renderShape(brand: string, p: ShapeProps): { node: React.ReactElement; labelY: number } {
  switch (brand) {
    case 'Yves Saint Laurent':
      return { node: ShapeYSL(p), labelY: 62 };
    case 'Dior':
      return { node: ShapeDior(p), labelY: 78 };
    case 'Mancera':
      return { node: ShapeMancera(p), labelY: 84 };
    case 'Parfums de Marly':
      return { node: ShapeParfumsDeMarly(p), labelY: 62 };
    case 'Xerjoff':
      return { node: ShapeXerjoff(p), labelY: 62 };
    case 'Amouage':
      return { node: ShapeAmouage(p), labelY: 62 };
    case 'Matiere Premiere':
      return { node: ShapeMatierePremiere(p), labelY: 62 };
    case 'Tom Ford':
      return { node: ShapeTomFord(p), labelY: 62 };
    case 'Maison Francis Kurkdjian':
      return { node: ShapeMFK(p), labelY: 62 };
    case 'Afnan':
      return { node: ShapeAfnan(p), labelY: 62 };
    case 'French Avenue':
      return { node: ShapeFrenchAvenue(p), labelY: 64 };
    case 'Street Origins':
      return { node: ShapeStreetOrigins(p), labelY: 62 };
    case 'Giorgio Armani':
      return { node: ShapeGiorgioArmani(p), labelY: 62 };
    case 'Kilian':
      return { node: ShapeKilian(p), labelY: 62 };
    case "Toskovat'":
      return { node: ShapeToskovat(p), labelY: 70 };
    case 'Orto Parisi':
      return { node: ShapeOrtoParisi(p), labelY: 62 };
    case 'Acqua di Parma':
      return { node: ShapeAcquaDiParma(p), labelY: 62 };
    case 'Creed':
      return { node: ShapeCreed(p), labelY: 62 };
    case 'Ex Nihilo':
      return { node: ShapeExNihilo(p), labelY: 66 };
    case "D'Orsay":
      return { node: ShapeDOrsay(p), labelY: 62 };
    case 'Zoologist':
      return { node: ShapeZoologist(p), labelY: 66 };
    case 'Maison Alhambra':
      return { node: ShapeMaisonAlhambra(p), labelY: 64 };
    case 'Khadlaj':
      return { node: ShapeKhadlaj(p), labelY: 64 };
    case 'Paris Corner':
      return { node: ShapeParisCorner(p), labelY: 58 };
    case 'Rasasi':
      return { node: ShapeRasasi(p), labelY: 66 };
    case 'Al Haramain':
      return { node: ShapeAlHaramain(p), labelY: 64 };
    case 'Maison Crivelli':
      return { node: ShapeMaisonCrivelli(p), labelY: 62 };
    case 'Versace':
      return { node: ShapeVersace(p), labelY: 64 };
    case 'Burberry':
      return { node: ShapeBurberry(p), labelY: 74 };
    case 'Kayali':
      return { node: ShapeKayali(p), labelY: 62 };
    case 'Mugler':
      return { node: ShapeMugler(p), labelY: 64 };
    case 'Mykonos':
      return { node: ShapeMykonos(p), labelY: 56 };
    case 'Givenchy':
      return { node: ShapeGivenchy(p), labelY: 64 };
    case 'Avon':
      return { node: ShapeAvon(p), labelY: 62 };
    case 'Next':
      return { node: ShapeNext(p), labelY: 64 };
    case 'Dolce & Gabbana':
      return { node: ShapeDolceGabbana(p), labelY: 44 };
    case 'Viktor & Rolf':
      return { node: ShapeViktorRolf(p), labelY: 66 };
    case 'Diptyque':
      return { node: ShapeDiptyque(p), labelY: 62 };
    case 'Christian Louboutin':
      return { node: ShapeChristianLouboutin(p), labelY: 62 };
    case 'Frederic Malle':
      return { node: ShapeFredericMalle(p), labelY: 70 };
    case 'Maison Margiela':
      return { node: ShapeMaisonMargiela(p), labelY: 62 };
    case 'Chloe':
      return { node: ShapeChloe(p), labelY: 62 };
    case 'Valentino':
      return { node: ShapeValentino(p), labelY: 64 };
    case 'Room 1015':
      return { node: ShapeRoom1015(p), labelY: 64 };
    case 'Zara':
      return { node: ShapeZara(p), labelY: 64 };
    case 'Maison Asrar':
      return { node: ShapeMaisonAsrar(p), labelY: 64 };
    case 'Jean Paul Gaultier':
      return { node: ShapeJeanPaulGaultier(p), labelY: 62 };
    case 'Roja Parfums':
      return { node: ShapeRojaParfums(p), labelY: 78 };
    case 'Rayhaan':
      return { node: ShapeRayhaan(p), labelY: 64 };
    case 'Bespoke London':
      return { node: ShapeBespokeLondon(p), labelY: 64 };
    case 'Ralph Lauren':
      return { node: ShapeRalphLauren(p), labelY: 68 };
    default:
      return { node: ShapeGeneric(p), labelY: 62 };
  }
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

function BottleSVG({ fragrance, size }: { fragrance: Fragrance; size: number }): React.ReactElement {
  const glass = fragrance.color;
  const cap = fragrance.capColor;
  const lum = luminance(glass);

  // Stroke accents readable against the glass.
  const stroke = lum > 0.5 ? '#00000055' : '#ffffff66';
  // Label text always sits on the white-ish plate -> keep it dark for contrast.
  const labelText = '#1a1a1a';
  const abbrev = brandAbbrev(fragrance.brand);

  // Unique gradient id per fragrance so multiple bottles don't clash.
  const gradId = `bg-${fragrance.id}`;

  const shapeProps: ShapeProps = { glass, cap, labelText, stroke, abbrev, gradId };
  const { node, labelY } = renderShape(fragrance.brand, shapeProps);

  const height = Math.round(size * 1.45);

  return (
    <Svg width={size} height={height} viewBox="0 0 80 116">
      <Defs>
        {/* Subtle top sheen -> solid glass at the base for a little volume. */}
        <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={glass} stopOpacity={0.88} />
          <Stop offset="1" stopColor={glass} stopOpacity={1} />
        </LinearGradient>
      </Defs>
      <BaseShadow />
      {node}
      <LabelPlate cx={40} cy={labelY} w={28} h={14} text={abbrev} textColor={labelText} />
    </Svg>
  );
}

export default React.memo(BottleSVG);
