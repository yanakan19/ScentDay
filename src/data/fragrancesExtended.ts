import type { Fragrance } from '@/types';

// ─── Auto-scoring helpers ──────────────────────────────────────────────────

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function autoScore(id: string, top: string[], mid: string[], base: string[]) {
  const all = [...top, ...mid, ...base].map(n => n.toLowerCase());
  const has = (...kws: string[]) => kws.some(k => all.some(n => n.includes(k)));

  const isHeavy   = has('oud','tobacco','leather','smoke','tar','incense','agarwood');
  const isWarm    = has('amber','vanilla','tonka','resin','balsam','caramel','chocolate','praline','honey','cinnamon','nutmeg','clove','coffee');
  const isFresh   = has('bergamot','lemon','lime','grapefruit','mandarin','orange','citrus','mint','green apple');
  const isAquatic = has('aquatic','sea notes','ocean','marine','calone','water');
  const isFloral  = has('rose','jasmine','violet','lily','peony','iris','lavender','geranium','neroli','blossom','ylang','tuberose','freesia','orchid');
  const isWoody   = has('cedar','sandalwood','vetiver','guaiac','wood','patchouli');
  const isGourmand= has('vanilla','caramel','chocolate','praline','coffee','almond','coconut','marzipan');
  const isSpicy   = has('pepper','cardamom','saffron','ginger','cinnamon','nutmeg','clove','spice');

  const longevity  = isHeavy ? 5 : isWarm ? 4 : isFresh && !isWoody ? 3 : 4;
  const projection = isHeavy ? 5 : isSpicy ? 4 : isAquatic ? 3 : isWarm ? 4 : 3;

  const Spring = isFloral ? 80 : isFresh ? 75 : isAquatic ? 65 : isHeavy ? 35 : 60;
  const Summer = isAquatic ? 90 : isFresh ? 85 : isFloral ? 70 : isHeavy ? 25 : 50;
  const Autumn = isHeavy ? 90 : isWarm && isSpicy ? 82 : isWarm ? 75 : isFloral ? 60 : 65;
  const Winter = isHeavy ? 95 : isGourmand ? 88 : isWarm ? 78 : isFresh ? 35 : 55;

  const Morning  = isFresh ? 85 : isAquatic ? 78 : isFloral ? 70 : isHeavy ? 35 : 60;
  const Daytime  = isAquatic ? 88 : isFresh ? 80 : isFloral ? 75 : isHeavy ? 40 : 65;
  const Evening  = isHeavy ? 90 : isWarm ? 82 : isSpicy ? 80 : isFloral ? 70 : 68;
  const Night    = isHeavy ? 95 : isGourmand ? 88 : isWarm ? 78 : isFresh ? 35 : 58;

  const h = hashCode(id);
  const rating = Math.round((3.8 + (h % 11) / 10) * 10) / 10;
  const votes  = 500 + (hashCode(id + 'v') % 9500);

  return { rating, votes, perf: { longevity, projection }, season: { Spring, Summer, Autumn, Winter }, time: { Morning, Daytime, Evening, Night } };
}

// ─── Compact entry type ───────────────────────────────────────────────────
// [id, brand, name, color, capColor, concentration, perfumer, year, top[], mid[], base[]]
type R = [string, string, string, string, string, string, string, number, string[], string[], string[]];

let _trend = 2000;
function expand(rows: R[]): Fragrance[] {
  return rows.map(([id, brand, name, color, capColor, conc, perfumer, year, top, mid, base]) => {
    const s = autoScore(id, top, mid, base);
    return {
      id, brand, name, color, capColor,
      trend: _trend++,
      concentration: conc as Fragrance['concentration'],
      perfumer, year,
      rating: s.rating, votes: s.votes,
      notes: { top, mid, base },
      perf: s.perf, season: s.season, time: s.time,
      buy: [{ vendor: brand, tag: 'Official site', price: 'POA', ic: '🏛️', official: true }],
    };
  });
}

// ─── ARMAF ────────────────────────────────────────────────────────────────
const ARMAF: R[] = [
  ['arm-cdni-man','Armaf','Club de Nuit Intense Man','#0a0a1a','#d4af37','Eau de Toilette','House of Armaf',2015,['Pineapple','Bergamot','Black Currant','Apple'],['Birch','Jasmine','Rose','Patchouli'],['Musk','Oakmoss','Ambergris','Vanilla']],
  ['arm-cdni-woman','Armaf','Club de Nuit Intense Woman','#1a0a2d','#e8c4c4','Eau de Parfum','House of Armaf',2015,['Pineapple','Peach','Black Currant'],['Rose','Jasmine','Muguet'],['Vanilla','Musk','Patchouli','Amber']],
  ['arm-cdni-milestone','Armaf','Club de Nuit Milestone','#0a1a0a','#c0e0a0','Eau de Parfum','House of Armaf',2020,['Bergamot','Lemon','Grapefruit'],['Lavender','Iris','Vetiver'],['Amberwood','Musk','Sandalwood']],
  ['arm-cdni-blue','Armaf','Club de Nuit Blue','#001428','#a0c8e0','Eau de Toilette','House of Armaf',2019,['Bergamot','Lime','Grapefruit'],['Sea Notes','Jasmine','Geranium'],['Sandalwood','Cedar','Musk']],
  ['arm-cdni-untold','Armaf','Club de Nuit Untold','#1a1a1a','#c8a96e','Eau de Parfum','House of Armaf',2017,['Cardamom','Bergamot','Grapefruit'],['Rose','Geranium','Patchouli'],['Amber','Leather','Oud','Musk']],
  ['arm-niche-oud','Armaf','Niche Oud','#0d0800','#d4af37','Eau de Parfum','House of Armaf',2016,['Saffron','Bergamot'],['Oud','Rose','Agarwood'],['Amber','Sandalwood','Musk']],
  ['arm-perfume-club','Armaf','Perfume Club Night','#0a0a2d','#c0c0e0','Eau de Parfum','House of Armaf',2018,['Bergamot','Lemon','Apple'],['Cinnamon','Violet','Iris'],['Vetiver','Cedarwood','Amber','Musk']],
  ['arm-tres-nuit','Armaf','Tres Nuit','#1a1a3a','#a0a0e0','Eau de Parfum','House of Armaf',2016,['Bergamot','Lavender','Lemon'],['Sage','Violet','Patchouli'],['Sandalwood','Amber','Musk']],
  ['arm-voyage','Armaf','Voyage','#001428','#80c8e0','Eau de Toilette','House of Armaf',2016,['Hawthorn','Lemon','Cardamom'],['Iris','Patchouli','Geranium'],['Sandalwood','Cedar','Musk']],
  ['arm-italian-beaute','Armaf','Italian Beaute','#f5e0e0','#e8c4c4','Eau de Parfum','House of Armaf',2017,['Bergamot','Lemon','Mandarin'],['Rose','Jasmine','Iris'],['Musk','Sandalwood','Amber']],
];

// ─── AJMAL ────────────────────────────────────────────────────────────────
const AJMAL: R[] = [
  ['ajm-evoke','Ajmal','Evoke Silver Edition','#c0c8d0','#a0a8b0','Eau de Parfum','Ajmal Perfumes',2019,['Bergamot','Grapefruit','Apple'],['Rose','Jasmine','Patchouli'],['Amber','Musk','Sandalwood']],
  ['ajm-aurum','Ajmal','Aurum','#f5d080','#c8a020','Eau de Parfum','Ajmal Perfumes',2008,['Lemon','Bergamot','Black Currant'],['Jasmine','Peach','Lily of the Valley'],['Sandalwood','Musk','Amber','Cedar']],
  ['ajm-wisal','Ajmal','Wisal','#f0e8d0','#d4af37','Eau de Parfum','Ajmal Perfumes',2011,['Peach','Bergamot'],['Rose','Violet','Lily'],['Sandalwood','Amber','Musk','Vetiver']],
  ['ajm-sacrifice','Ajmal','Sacrifice for Him','#0a0a1a','#c8c8d8','Eau de Parfum','Ajmal Perfumes',2016,['Lemon','Bergamot','Cardamom'],['Geranium','Iris','Jasmine'],['Patchouli','Amber','Musk','Oud']],
  ['ajm-amber-wood','Ajmal','Amber Wood','#2d1a00','#c8a96e','Eau de Parfum','Ajmal Perfumes',2014,['Cardamom','Pepper','Bergamot'],['Amber','Rose','Oud'],['Sandalwood','Musk','Vanilla']],
  ['ajm-purely','Ajmal','Purely Orient Oud','#0d0800','#d4af37','Eau de Parfum','Ajmal Perfumes',2015,['Saffron','Rose'],['Oud','Patchouli','Amber'],['Sandalwood','Musk','Leather']],
  ['ajm-dahn-oud','Ajmal','Dahn Al Oud Malaki','#1a0d00','#c8a020','Eau de Parfum','Ajmal Perfumes',2013,['Oud','Rose'],['Amber','Sandalwood'],['Musk','Leather','Patchouli']],
  ['ajm-cedar-rose','Ajmal','Cedar Rose','#2d0010','#e8c4c4','Eau de Parfum','Ajmal Perfumes',2018,['Bergamot','Mandarin'],['Rose','Cedar','Jasmine'],['Sandalwood','Musk','Amber']],
];

// ─── ZIMAYA ────────────────────────────────────────────────────────────────
const ZIMAYA: R[] = [
  ['zim-taraf-black','Zimaya','Taraf Black','#0a0a0a','#d4af37','Eau de Parfum','Afnan',2020,['Bergamot','Pepper','Lavender'],['Rose','Oud','Amber'],['Sandalwood','Musk','Leather']],
  ['zim-taraf-white','Zimaya','Taraf White','#f5f0e8','#c8c8c0','Eau de Parfum','Afnan',2020,['Bergamot','Lemon','Neroli'],['Jasmine','Rose','Lily'],['White Musk','Sandalwood','Amber']],
  ['zim-hawwa-intense','Zimaya','Hawwa Intense','#3d0010','#e8c4c4','Eau de Parfum','Afnan',2019,['Peach','Saffron','Bergamot'],['Rose','Jasmine','Violet'],['Vanilla','Amber','Musk','Patchouli']],
  ['zim-maahir-black','Zimaya','Maahir Black','#0a0a1a','#c0c0d0','Eau de Parfum','Afnan',2021,['Bergamot','Cardamom','Grapefruit'],['Geranium','Amber','Oud'],['Sandalwood','Musk','Leather']],
  ['zim-bold','Zimaya','Bold','#1a0a00','#c8a020','Eau de Parfum','Afnan',2020,['Bergamot','Cinnamon','Cardamom'],['Oud','Rose','Amber'],['Sandalwood','Musk','Leather','Vanilla']],
  ['zim-pride','Zimaya','Pride','#0a1a0a','#a0c8a0','Eau de Parfum','Afnan',2021,['Bergamot','Lemon','Mint'],['Jasmine','Vetiver','Cedar'],['Sandalwood','Amber','Musk']],
];

// ─── ORIENTICA ─────────────────────────────────────────────────────────────
const ORIENTICA: R[] = [
  ['ori-amber-noir','Orientica','Amber Noir','#1a0800','#c8a020','Eau de Parfum','Orientica',2019,['Bergamot','Cardamom','Black Pepper'],['Amber','Oud','Rose'],['Sandalwood','Musk','Leather','Vanilla']],
  ['ori-velvet-gold','Orientica','Velvet Gold','#d4af37','#c8a020','Eau de Parfum','Orientica',2020,['Saffron','Rose','Bergamot'],['Amber','Oud','Jasmine'],['Sandalwood','Musk','Vanilla']],
  ['ori-royal-oud','Orientica','Royal Oud','#0d0800','#d4af37','Eau de Parfum','Orientica',2019,['Oud','Cardamom','Saffron'],['Rose','Amber','Patchouli'],['Sandalwood','Musk','Leather']],
  ['ori-oud-saffron','Orientica','Oud Saffron','#2d1a00','#d4af37','Eau de Parfum','Orientica',2020,['Saffron','Bergamot'],['Oud','Rose','Amber'],['Sandalwood','Musk','Vanilla']],
  ['ori-white-musk','Orientica','White Musk','#f5f0e8','#c8c8c0','Eau de Parfum','Orientica',2021,['Bergamot','Lemon','Neroli'],['Jasmine','Rose','Lily'],['White Musk','Sandalwood','Amber']],
  ['ori-crystal-oud','Orientica','Crystal Oud','#0a0a2d','#c0c0e0','Eau de Parfum','Orientica',2021,['Bergamot','Lavender'],['Oud','Cedar','Geranium'],['Amber','Musk','Sandalwood']],
];

// ─── AL-REHAB ──────────────────────────────────────────────────────────────
const AL_REHAB: R[] = [
  ['alr-crown','Al-Rehab','Crown','#0a0a0a','#d4af37','Eau de Parfum','Al-Rehab',2010,['Bergamot','Lemon'],['Rose','Jasmine','Sandalwood'],['Amber','Musk','Oud']],
  ['alr-silver','Al-Rehab','Silver','#c0c8d0','#a0b0c0','Eau de Parfum','Al-Rehab',2012,['Bergamot','Citrus','Lemon'],['Jasmine','Rose'],['Musk','Sandalwood','Cedar']],
  ['alr-khaliji','Al-Rehab','Khaliji','#d4af37','#c8a020','Eau de Parfum','Al-Rehab',2008,['Bergamot','Saffron'],['Rose','Oud','Amber'],['Sandalwood','Musk','Vanilla']],
  ['alr-choco-musk','Al-Rehab','Choco Musk','#2d1000','#c8a020','Eau de Parfum','Al-Rehab',2015,['Chocolate','Bergamot'],['Rose','Vanilla','Caramel'],['Musk','Sandalwood','Amber']],
  ['alr-nadeen','Al-Rehab','Nadeen','#f0e8d0','#d4af37','Eau de Parfum','Al-Rehab',2011,['Citrus','Bergamot'],['Rose','Jasmine','Lily'],['Musk','Sandalwood','Amber']],
  ['alr-sondos','Al-Rehab','Sondos','#1a1a3a','#c0c0e0','Eau de Parfum','Al-Rehab',2009,['Bergamot','Lemon'],['Oud','Rose','Patchouli'],['Amber','Musk','Sandalwood']],
];

// ─── CHANEL ────────────────────────────────────────────────────────────────
const CHANEL: R[] = [
  ['cha-no5','Chanel','No. 5','#f5f0e0','#c8c8c0','Eau de Parfum','Ernest Beaux',1921,['Aldehydes','Bergamot','Lemon','Neroli'],['Iris','Rose','Lily of the Valley','Jasmine','Ylang-Ylang'],['Civet','Oakmoss','Sandalwood','Vetiver','Vanilla']],
  ['cha-bleu','Chanel','Bleu de Chanel','#001428','#a0b8c8','Eau de Parfum','Olivier Polge',2010,['Lemon','Mint','Pink Pepper','Bergamot'],['Ginger','Nutmeg','Jasmine','Iso E Super'],['Incense','Vetiver','Cedar','Sandalwood','Patchouli','Labdanum','White Musk']],
  ['cha-coco-mademoiselle','Chanel','Coco Mademoiselle','#0d0800','#d4af37','Eau de Parfum','Jacques Polge',2001,['Orange','Bergamot','Grapefruit'],['Rose','Jasmine','Mimosa'],['Patchouli','Vetiver','Vanilla','White Musk','Opoponax']],
  ['cha-allure-homme-sport','Chanel','Allure Homme Sport','#1a2d3a','#a0b8c8','Eau de Toilette','Jacques Polge',2004,['Bergamot','Aldehydes','Mandarin','Sea Notes'],['Pepper','Vetiver','Elemi'],['White Musk','Tonka Bean','Cedar']],
  ['cha-chance','Chanel','Chance','#e8d0f0','#d0b8e0','Eau de Toilette','Jacques Polge',2002,['Pink Pepper','Bergamot'],['Iris','Jasmine','Hyacinth'],['Iris','Patchouli','White Musk','Vetiver','Amber']],
  ['cha-gabrielle','Chanel','Gabrielle','#f5f0e8','#c8c8c0','Eau de Parfum','Olivier Polge',2017,['Grapefruit','Blackcurrant','Mandarin'],['Jasmine','Ylang-Ylang','Tuberose','Orange Blossom'],['White Musk','Sandalwood','Cedar']],
  ['cha-egoiste','Chanel','Égoïste','#2d1a00','#c8a020','Eau de Toilette','Jacques Polge',1990,['Bergamot','Lemon','Mandarin'],['Rose','Coriander','Sandalwood','Vetiver'],['Amber','Civet','Oakmoss','Styrax']],
  ['cha-antaeus','Chanel','Antaeus','#1a1a1a','#c0c0c0','Eau de Toilette','Jacques Polge',1981,['Bergamot','Lemon'],['Leather','Oakmoss','Patchouli'],['Amber','Labdanum','Vetiver','Civet']],
];

// ─── GUERLAIN ──────────────────────────────────────────────────────────────
const GUERLAIN: R[] = [
  ['gue-homme','Guerlain','Guerlain Homme','#0a1428','#80c0e0','Eau de Parfum','Thierry Wasser',2008,['Bergamot','Lemon Zest','Ginger'],['Iris','Cedar','Patchouli'],['Vetiver','White Musk','Amber']],
  ['gue-imperiale','Guerlain','Eau de Cologne Impériale','#f5e0a0','#d4af37','Eau de Cologne','Pierre-François Pascal Guerlain',1853,['Lemon','Bergamot','Orange'],['Mandarin','Rosemary','Jasmine'],['Amber','Sandalwood','Musk']],
  ['gue-samsara','Guerlain','Samsara','#f0d880','#c8a020','Eau de Parfum','Jean-Paul Guerlain',1989,['Bergamot','Peach'],['Ylang-Ylang','Jasmine','Iris','Rose','Narcissus'],['Sandalwood','Cedarwood','Vetiver','Tonka Bean']],
  ['gue-heritage','Guerlain','Héritage','#c8a020','#d4af37','Eau de Toilette','Jean-Paul Guerlain',1992,['Bergamot','Lemon','Coriander'],['Geranium','Rose','Oakmoss','Clary Sage'],['Sandalwood','Vetiver','Leather','Amber']],
  ['gue-insolence','Guerlain','Insolence','#9060c0','#c0a0e0','Eau de Toilette','Sylvaine Delacourte',2006,['Bergamot','Mandarin'],['Violet','Iris','Rose'],['Violet','Sandalwood','Musk','Amber']],
  ['gue-habit-rouge','Guerlain','Habit Rouge','#8b0000','#c8a020','Eau de Toilette','Jean-Paul Guerlain',1965,['Bergamot','Lemon','Mandarin'],['Rose','Iris','Carnation','Cinnamon'],['Vanilla','Leather','Oakmoss','Sandalwood','Amber']],
  ['gue-vetiver','Guerlain','Vétiver','#2d2800','#c8a020','Eau de Toilette','Jean-Paul Guerlain',1959,['Bergamot','Lemon','Coriander'],['Geranium','Tobacco','Cedar'],['Vetiver','Oakmoss','Sandalwood','Tobacco']],
];

// ─── PRADA ─────────────────────────────────────────────────────────────────
const PRADA: R[] = [
  ['pra-luna-rossa','Prada','Luna Rossa','#001428','#80c0e0','Eau de Toilette','Daniela Andrier',2012,['Bergamot','Grapefruit','Lemon'],['Lavender','Myrtle'],['White Musk','Amber','Cedar']],
  ['pra-luna-rossa-carbon','Prada','Luna Rossa Carbon','#0a0a0a','#a0a0a0','Eau de Toilette','Daniela Andrier',2017,['Bergamot','Patchouli','Aldehydes'],['Iris','Lavender'],['White Musk','Mineral Amber','Cedar']],
  ['pra-luna-rossa-ocean','Prada','Luna Rossa Ocean','#001a3d','#6090c0','Eau de Parfum','Daniela Andrier',2021,['Bergamot','Sea Notes'],['Iris','Sage'],['Oakmoss','White Musk','Vetiver']],
  ['pra-candy','Prada','Candy','#e0a0b0','#d0a0c0','Eau de Parfum','Daniela Andrier',2011,['Bergamot'],['Caramel','White Musk'],['Benzyl Benzoate','Patchouli','Musks']],
  ['pra-infusion-iris','Prada','Infusion d\'Iris','#d0d0f0','#b0b0d0','Eau de Parfum','Daniela Andrier',2007,['Bergamot','Mandarin','Galbanum'],['Iris','Cedar','Orange Blossom'],['Vetiver','Benzoin','Incense']],
  ['pra-amber-pour-homme','Prada','Amber Pour Homme','#c8a020','#d4af37','Eau de Toilette','Daniela Andrier',2006,['Neroli','Bergamot','Mandarin'],['Saffron','Myrrh','Cinnamon','Patchouli'],['Labdanum','Amber','Leather','Sandalwood']],
];

// ─── HERMÈS ────────────────────────────────────────────────────────────────
const HERMES: R[] = [
  ['her-terre','Hermès','Terre d\'Hermès','#c87820','#d4af37','Eau de Toilette','Jean-Claude Ellena',2006,['Grapefruit','Orange','Flint'],['Pepper','Pelargonium'],['Vetiver','Cedar','Benzoin','Iso E Super','Flint']],
  ['her-eau-sauvage','Hermès','Eau Sauvage (Hermès)','#f0e8d0','#d4af37','Eau de Parfum','Jean-Claude Ellena',2014,['Grapefruit','Orange'],['Vetiver','Cedar','Pepper'],['Iso E Super','Flint','Mineral Notes']],
  ['her-voyage','Hermès','Voyage d\'Hermès','#d0e8f0','#90b8c0','Eau de Toilette','Jean-Claude Ellena',2010,['Cardamom','Pepper','Grapefruit','Cedar'],['Myrrh','Frankincense'],['White Cedar','Vetiver','Musk']],
  ['her-un-jardin','Hermès','Un Jardin sur le Nil','#80c080','#60a060','Eau de Toilette','Jean-Claude Ellena',2005,['Green Mango','Grapefruit','Lotus'],['Blue Lotus','Iris','Peony'],['Incense','Papyrus Wood','Sycamore']],
  ['her-eau-orange','Hermès','Eau d\'Orange Verte','#80d080','#60b060','Eau de Cologne','Françoise Caron',1979,['Mandarin','Orange','Mint','Lemon'],['Blackcurrant','Cypress','Coriander'],['Oakmoss','Patchouli','Vetiver']],
  ['her-twilly','Hermès','Twilly d\'Hermès','#e0d0c0','#c8b8a0','Eau de Parfum','Floris Robert',2017,['Ginger','Pink Pepper'],['Tuberose','Rose'],['Sandalwood','Cedar','Musk']],
  ['her-galop','Hermès','Galop d\'Hermès','#8b4000','#c87820','Eau de Parfum','Christine Nagel',2016,['Rose','Pepper'],['Leather','Cedar'],['Musk','Vetiver']],
];

// ─── RABANNE ──────────────────────────────────────────────────────────────
const RABANNE: R[] = [
  ['rab-1-million','Rabanne','1 Million','#c8a020','#d4af37','Eau de Toilette','Christophe Raynaud',2008,['Blood Mandarin','Grapefruit','Mint'],['Rose','Cinnamon','Spicy Notes'],['Leather','Amber','Patchouli','Woody Notes']],
  ['rab-invictus','Rabanne','Invictus','#c0c0c0','#d0d0d0','Eau de Toilette','Olivier Polge',2013,['Grapefruit','Marine Notes','Mandarin'],['Jasmine','Guaiac Wood','Oak Accord'],['Ambergris','Patchouli','Musk']],
  ['rab-phantom','Rabanne','Phantom','#e0e0e0','#c0c0c0','Eau de Toilette','Dora Baghriche',2021,['Lemon','Cardamom','Lavender','Apple'],['Vetiver','Patchouli'],['Cashmeran','Woody Notes','Musk']],
  ['rab-million-lucky','Rabanne','1 Million Lucky','#d4af37','#c8a020','Eau de Toilette','Ilias Ermenidis',2018,['Grapefruit','Plum','Fresh Leaves'],['Clary Sage','Ginger','Tonka Bean'],['Patchouli','Amber','Vetiver']],
  ['rab-invictus-aqua','Rabanne','Invictus Aqua','#001428','#6090c8','Eau de Toilette','Christian Dussoulier',2015,['Grapefruit','Sea Notes','Neroli'],['Jasmine','Aquatic Notes','Guaiac Wood'],['Ambergris','Patchouli','White Musk']],
  ['rab-fame','Rabanne','Fame','#f5f0e0','#e0d0b0','Eau de Parfum','Marie Salamagne',2022,['Mango','Bergamot'],['Jasmine','Ylang-Ylang'],['Vanilla','Musk','Woody Notes']],
];

// ─── INITIO PARFUMS PRIVÉS ────────────────────────────────────────────────
const INITIO: R[] = [
  ['ini-oud-savaqe','Initio','Oud for Greatness','#0d0800','#d4af37','Eau de Parfum','Initio Lab',2018,['Papyrus','Nutmeg','Saffron'],['Oud','Cypriol','Patchouli'],['Ambergris','Sandalwood','Musk']],
  ['ini-rehab','Initio','Rehab','#f5f0e8','#d4af37','Eau de Parfum','Initio Lab',2015,['Bergamot','Mint','Peppermint'],['Lavender','Musk','Cypress'],['Sandalwood','Vetiver','Cedar']],
  ['ini-psychedelic-love','Initio','Psychedelic Love','#d080a0','#c060a0','Eau de Parfum','Initio Lab',2019,['Grapefruit','Bergamot','Cinnamon'],['Rose','Jasmine','Cashmeran'],['Amber','Musk','Sandalwood','Labdanum']],
  ['ini-atomic-rose','Initio','Atomic Rose','#e08080','#c06060','Eau de Parfum','Initio Lab',2020,['Bergamot','Pink Pepper'],['Rose','Patchouli','Cashmeran'],['Amber','Musk','Sandalwood']],
  ['ini-black-gold','Initio','Black Gold Project','#0a0a0a','#d4af37','Eau de Parfum','Initio Lab',2015,['Bergamot','Cardamom','Black Pepper'],['Oud','Rose','Amber'],['Sandalwood','Musk','Leather']],
  ['ini-side-effect','Initio','Side Effect','#c8a020','#d4af37','Eau de Parfum','Initio Lab',2018,['Rum','Black Pepper','Cinnamon'],['Cypriol','Tobacco'],['Amber','Musk','Vanilla','Vetiver']],
];

// ─── MONTALE ──────────────────────────────────────────────────────────────
const MONTALE: R[] = [
  ['mon-black-aoud','Montale','Black Aoud','#0a0a0a','#c8a020','Eau de Parfum','Pierre Montale',2006,['Rose','Raspberry'],['Oud','Patchouli'],['Musk','Amber','Leather']],
  ['mon-intense-cafe','Montale','Intense Café','#1a0800','#c8a020','Eau de Parfum','Pierre Montale',2013,['Rose','Coffee'],['Vanilla','Patchouli'],['Musk','Sandalwood','Amber']],
  ['mon-arabians-tonka','Montale','Arabians Tonka','#1a1000','#c8a020','Eau de Parfum','Pierre Montale',2014,['Bergamot','Lemon'],['Tonka Bean','Hazelnut','Licorice'],['Sandalwood','Vanilla','Amber']],
  ['mon-honey-aoud','Montale','Honey Aoud','#d4a020','#c8a020','Eau de Parfum','Pierre Montale',2012,['Honey','Bergamot'],['Rose','Oud','Amber'],['Musk','Sandalwood','Vanilla']],
  ['mon-rose-musk','Montale','Rose Musk','#e0c0c0','#c8a0a0','Eau de Parfum','Pierre Montale',2010,['Rose','Bergamot'],['Rose','Jasmine'],['Musk','Sandalwood','Amber']],
  ['mon-aqua-gold','Montale','Aqua Gold','#d4af37','#c8a020','Eau de Parfum','Pierre Montale',2017,['Bergamot','Grapefruit'],['Rose','Jasmine','Tuberose'],['Amber','Musk','Sandalwood']],
  ['mon-wild-aoud','Montale','Wild Aoud','#0d0800','#d4af37','Eau de Parfum','Pierre Montale',2011,['Bergamot','Saffron','Cardamom'],['Oud','Rose','Leather'],['Amber','Sandalwood','Musk']],
  ['mon-full-incense','Montale','Full Incense','#1a1000','#c8a020','Eau de Parfum','Pierre Montale',2012,['Incense','Saffron'],['Oud','Rose','Amber'],['Sandalwood','Musk','Vanilla']],
  ['mon-starry-night','Montale','Starry Nights','#001428','#6090c8','Eau de Parfum','Pierre Montale',2010,['Lemon','Bergamot','Basil'],['Rose','Jasmine','Sandalwood'],['Amber','Musk','Vanilla']],
  ['mon-chocolate-greedy','Montale','Chocolate Greedy','#1a0800','#c87820','Eau de Parfum','Pierre Montale',2011,['Coffee','Bergamot'],['Caramel','Chocolate','Vanilla'],['Tonka Bean','Musk','Sandalwood']],
];

// ─── NISHANE ──────────────────────────────────────────────────────────────
const NISHANE: R[] = [
  ['nis-hacivat','Nishane','Hacivat','#003a2d','#80c0a0','Extrait de Parfum','Nishane Lab',2017,['Pineapple','Bergamot','Grapefruit'],['Oakmoss','Jasmine','Rose'],['Ambergris','Patchouli','Musk','Incense']],
  ['nis-ani','Nishane','Ani','#f0e8c0','#d4af37','Extrait de Parfum','Nishane Lab',2017,['Bergamot','Cardamom','Lemon'],['Rose','Lily of the Valley','Jasmine'],['Sandalwood','Musk','Cedarwood','Ambergris']],
  ['nis-wulong-cha','Nishane','Wulong Cha','#80c080','#60a060','Extrait de Parfum','Nishane Lab',2017,['Green Tea','Bergamot'],['Oolong Tea','Jasmine'],['Sandalwood','Cedarwood','Musk']],
  ['nis-ambra-calabria','Nishane','Ambra Calabria','#c87820','#d4af37','Extrait de Parfum','Nishane Lab',2017,['Bergamot','Bitter Orange'],['Orris','Rosewood'],['Amber','Labdanum','Sandalwood','Musk']],
  ['nis-nanshe','Nishane','Nanshe','#0a1a0a','#60a060','Extrait de Parfum','Nishane Lab',2019,['Aldehydes','Bergamot','Rhubarb'],['Iris','Violet','Rose'],['Musk','Sandalwood','Ambergris','Oakmoss']],
  ['nis-ege','Nishane','Ege','#001428','#6090c8','Extrait de Parfum','Nishane Lab',2017,['Bergamot','Grapefruit','Lemon'],['Sea Notes','Green Notes'],['Ambergris','Musk','Cedar']],
  ['nis-tennis-club','Nishane','Tennis Club Istanbul','#a0c8a0','#80a880','Extrait de Parfum','Nishane Lab',2018,['Lemon','Bergamot','Grapefruit'],['Mint','Lavender','Green Tea'],['Cedarwood','Oakmoss','Musk']],
];

// ─── MAISON MARGIELA (additional) ─────────────────────────────────────────
const MARGIELA_EXT: R[] = [
  ['mm-beach-walk','Maison Margiela','Beach Walk','#f5e0a0','#e0c880','Eau de Toilette','Louise Turner',2018,['Bergamot','Lemon','Coconut'],['Sea Salt','Jasmine'],['Sandalwood','Driftwood','Musk']],
  ['mm-by-the-fireplace','Maison Margiela','By the Fireplace','#1a0800','#c87820','Eau de Toilette','Aliénor Massenet',2015,['Clove','Pink Pepper','Orange'],['Chestnut','Guaiac Wood','Cashmeran'],['Vanilla','Peru Balsam','White Musk']],
  ['mm-flower-market','Maison Margiela','Flower Market','#f0e0f0','#d0c0e0','Eau de Toilette','Marie Salamagne',2020,['Peony','Rose','Lemon'],['Rose','Peony','Lily'],['Musk','White Cedar','Sandalwood']],
  ['mm-springtime-in-park','Maison Margiela','Springtime in a Park','#a0d0a0','#80c080','Eau de Toilette','Dominique Ropion',2019,['Green Notes','Bergamot','Grapefruit'],['Lily of the Valley','Peony'],['White Musk','Sandalwood']],
  ['mm-under-the-lemon-tree','Maison Margiela','Under the Lemon Trees','#e0f0a0','#c0d880','Eau de Toilette','Alienor Massenet',2017,['Lemon','Grapefruit','Bergamot'],['Jasmine','Rose'],['Sandalwood','White Musk','Cedar']],
];

// ─── LE LABO ──────────────────────────────────────────────────────────────
const LE_LABO: R[] = [
  ['ll-santal33','Le Labo','Santal 33','#c8a020','#d4af37','Eau de Parfum','Frank Voelkl',2011,['Cardamom','Iris','Violet'],['Ambrox','Papyrus'],['Sandalwood','Cedar','Leather','Musk']],
  ['ll-rose31','Le Labo','Rose 31','#e0c0c0','#c8a0a0','Eau de Parfum','Frank Voelkl',2006,['Cumin','Coriander','Bergamot'],['Rose'],['Gaiac Wood','Cedar','Musk','Amber']],
  ['ll-another13','Le Labo','Another 13','#f5f0e8','#d4af37','Eau de Parfum','Frank Voelkl',2010,['Moss','Ambrox'],['Jasmine Sambac'],['Musk','Ambrox']],
  ['ll-the-noir29','Le Labo','The Noir 29','#0a1000','#60a060','Eau de Parfum','Mark Buxton',2006,['Tea','Pepper','Cardamom'],['Fig','Laurel'],['Musk','Cedar','Vetiver']],
  ['ll-bergamote22','Le Labo','Bergamote 22','#e0d080','#c0b060','Eau de Parfum','Alienor Massenet',2006,['Bergamot','Petitgrain','Neroli'],['Jasmine','Galbanum'],['White Musk','Cedar','Amber']],
  ['ll-vetiver46','Le Labo','Vetiver 46','#2d2800','#c8a020','Eau de Parfum','Frank Voelkl',2006,['Bergamot','Lemon'],['Vetiver','Rose','Geranium'],['Sandalwood','Musk','Amber']],
  ['ll-noir6','Le Labo','Noir 29 (Exclusive)','#0a0a0a','#c0c0c0','Eau de Parfum','Frank Voelkl',2006,['Tea','Bergamot','Pepper'],['Fig','Jasmine'],['Cedar','Musk','Amber']],
];

// ─── BYREDO ────────────────────────────────────────────────────────────────
const BYREDO: R[] = [
  ['byr-gypsy-water','Byredo','Gypsy Water','#f5f0e8','#d4af37','Eau de Parfum','Jérôme Epinette',2008,['Bergamot','Lemon','Pepper','Juniper Berries'],['Incense','Orris','Pine Needles'],['Amber','Vanilla','Sandalwood']],
  ['byr-bal-dafrique','Byredo','Bal d\'Afrique','#f0e8c0','#d4af37','Eau de Parfum','Jérôme Epinette',2009,['Bergamot','Lemon','Neroli'],['African Violet','Cyclamen','Jasmine'],['Musk','Vetiver','Amber','Moroccan Cedarwood']],
  ['byr-mojave-ghost','Byredo','Mojave Ghost','#e8d0b0','#c8b080','Eau de Parfum','Jérôme Epinette',2014,['Magnolia','Ambrette'],['Sandalwood','Violet'],['Cedarwood','Amber','White Musk']],
  ['byr-super-cedar','Byredo','Super Cedar','#2d1a00','#c8a020','Eau de Parfum','Jérôme Epinette',2014,['Bergamot'],['Rose','Cedar'],['Vetiver','Amber','Musk']],
  ['byr-blanche','Byredo','Blanche','#f5f5f5','#e0e0e0','Eau de Parfum','Jérôme Epinette',2006,['Pink Pepper','Neroli','Aldehydes'],['Peony','Rose','Iris'],['Sandalwood','White Musk']],
  ['byr-sunday-cologne','Byredo','Sunday Cologne','#c0d8f0','#a0b8d8','Eau de Parfum','Jérôme Epinette',2010,['Lime','Bergamot','Neroli'],['Clary Sage','Lavender'],['Sandalwood','Musk','Cedar']],
];

// ─── PENHALIGON'S ──────────────────────────────────────────────────────────
const PENHALIGONS: R[] = [
  ['pen-halfeti','Penhaligon\'s','Halfeti','#0d0800','#d4af37','Eau de Parfum','Alberto Morillas',2017,['Grapefruit','Bergamot'],['Rose','Oud','Jasmine'],['Leather','Sandalwood','Amber','Musk']],
  ['pen-empressa','Penhaligon\'s','Empressa','#f0d8e0','#e0b8c0','Eau de Parfum','Christian Carbonnel',2019,['Peach','Bergamot'],['Osmanthus','Rose'],['Sandalwood','Amber','Musk']],
  ['pen-artemisia','Penhaligon\'s','Artemisia','#c0d8c0','#a0b8a0','Eau de Parfum','Christian Carbonnel',2014,['Bergamot','Artemisia','Lemon'],['Rose','Jasmine'],['Amber','Musk','Cedar']],
  ['pen-quercus','Penhaligon\'s','Quercus','#2d2800','#c8a020','Eau de Cologne','Various',1978,['Bergamot','Galbanum','Lemon'],['Geranium','Jasmine','Lily of the Valley'],['Oakmoss','Vetiver','Musk']],
  ['pen-juniper-sling','Penhaligon\'s','Juniper Sling','#a0c8d0','#80b0b8','Eau de Toilette','Alberto Morillas',2011,['Juniper','Pink Pepper','Bergamot'],['Ginger','Sage','Myrtle'],['Sandalwood','White Musk','Cedar']],
  ['pen-vaara','Penhaligon\'s','Vaara','#f5e8f0','#e0d0e8','Eau de Parfum','Yann Vasnier',2017,['Cardamom','Bergamot'],['Rose','Jasmine','Vetiver'],['Sandalwood','Oud','Amber']],
];

// ─── GIVENCHY ──────────────────────────────────────────────────────────────
const GIVENCHY: R[] = [
  ['giv-gentleman','Givenchy','Gentleman','#0a0a0a','#c0c0c0','Eau de Parfum','Nathalie Lorson',2017,['Pear','Bergamot'],['Iris','Lavender','Sage'],['Tonka Bean','Vetiver','Vanilla']],
  ['giv-pi','Givenchy','Pi','#1a0d2d','#c0a0d0','Eau de Parfum','Alberto Morillas',1998,['Bergamot','Mandarin','Anise'],['Rose','Geranium'],['Vanilla','Sandalwood','Amber']],
  ['giv-pour-homme','Givenchy','Pour Homme','#1a2d3d','#90b0c0','Eau de Toilette','Guy Robert',1959,['Bergamot','Lemon','Aldehyde'],['Jasmine','Iris','Lavender'],['Amber','Sandalwood','Musk','Oakmoss']],
  ['giv-irresistible','Givenchy','Irrésistible','#e0c0d0','#c0a0b0','Eau de Parfum','Dominique Ropion',2020,['Bergamot','Rhubarb'],['Rose','Freesia','Peony'],['White Musk','Sandalwood']],
  ['giv-live-irresistible','Givenchy','Live Irrésistible','#d0a0b0','#c09098','Eau de Parfum','Dominique Ropion',2015,['Pear','Cardamom','Bergamot'],['Rose','Patchouli','Peony'],['Sandalwood','White Musk']],
];

// ─── MUGLER (additional) ─────────────────────────────────────────────────
const MUGLER_EXT: R[] = [
  ['mug-alien','Mugler','Alien','#d0c040','#c0b020','Eau de Parfum','Dominique Ropion',2005,['Jasmine Sambac'],['Cashmeran Wood'],['White Amber']],
  ['mug-a-men','Mugler','A*Men','#0a0a0a','#a0a0a0','Eau de Toilette','Jacques Huclier',1996,['Mint','Lavender','Coffee'],['Caramel','Malt','Patchouli'],['Vanilla','Sandalwood','Amber']],
  ['mug-cologne','Mugler','Cologne','#a0d0e0','#80b8c8','Eau de Cologne','Jacques Huclier',2001,['Bergamot','Neroli','Green Notes'],['Jasmine','Cedar'],['Musk','Amber']],
  ['mug-angel-elixir','Mugler','Angel Elixir','#9060c0','#7040a0','Eau de Parfum','Daphné Bugey',2022,['Cotton Candy','Red Fruits'],['Caramel','Patchouli'],['Vanilla','Musk','Amber']],
];

// ─── KAYALI ────────────────────────────────────────────────────────────────
const KAYALI: R[] = [
  ['kay-vanilla-28','Kayali','Vanilla 28','#f5e0b0','#d4a020','Eau de Parfum','Mona Kattan',2018,['Bergamot','Coconut'],['Caramel','Vanilla Orchid'],['Musk','Sandalwood','Amber']],
  ['kay-elixir-08','Kayali','Elixir 08','#c8a020','#d4af37','Eau de Parfum','Mona Kattan',2019,['Cardamom','Bergamot'],['Rose','Oud','Amber'],['Sandalwood','Musk','Vanilla']],
  ['kay-musk-12','Kayali','Musk 12','#f5f0e8','#d4af37','Eau de Parfum','Mona Kattan',2018,['Bergamot','Lemon'],['Jasmine','Rose'],['Sandalwood','Musk','Amber']],
  ['kay-citrus-08','Kayali','Citrus 08','#f0e080','#d0c040','Eau de Parfum','Mona Kattan',2018,['Bergamot','Lemon','Mandarin'],['Neroli','Jasmine'],['White Musk','Sandalwood']],
  ['kay-yum-pistachio','Kayali','Yum Pistachio Gelato 33','#c0d8b0','#a0b880','Eau de Parfum','Mona Kattan',2022,['Pistachio','Bergamot'],['Heliotrope','Tonka Bean'],['Sandalwood','Musk','Vanilla']],
  ['kay-utopia-vanilla','Kayali','Utopia Vanilla Coco 21','#f0e8c0','#d4af37','Eau de Parfum','Mona Kattan',2022,['Bergamot','Vanilla'],['Coconut','Tiare Flower'],['Musk','Sandalwood','Amber']],
];

// ─── BURBERRY ──────────────────────────────────────────────────────────────
const BURBERRY: R[] = [
  ['bur-hero','Burberry','Hero','#0a1428','#80b0c0','Eau de Parfum','Quentin Bisch',2021,['Bergamot','Bergamot','Mandarin'],['Cedar','Sage'],['Vetiver','Cedarwood','Musk']],
  ['bur-brit-rhythm','Burberry','Brit Rhythm','#1a1a1a','#c0c0c0','Eau de Toilette','Fabrice Pellegrin',2013,['Bergamot','Lavender','Thyme'],['Leather','Rosemary'],['Vetiver','Guaiac Wood','Amber']],
  ['bur-her','Burberry','Her','#e0c0d0','#c0a0b0','Eau de Parfum','Francis Kurkdjian',2018,['Blueberry','Strawberry','Lemon'],['Jasmine','Violet'],['Amber','Musk','Sandalwood']],
  ['bur-my-burberry','Burberry','My Burberry','#d4af37','#c8a020','Eau de Parfum','Francis Kurkdjian',2014,['Sweet Pea','Bergamot'],['Geranium','Golden Quince','Freesia'],['Patchouli','Rose','Sandalwood']],
];

// ─── MAISON CRIVELLI ──────────────────────────────────────────────────────
const MAISON_CRIVELLI: R[] = [
  ['mcr-iris-cendre','Maison Crivelli','Iris Cendré','#d0d0e0','#b0b0c0','Eau de Parfum','Constance Geze',2019,['Bergamot','Incense'],['Iris','Vetiver'],['Musk','Cedar','Amber']],
  ['mcr-oud-al-mamun','Maison Crivelli','Oud al Mamun','#0d0800','#d4af37','Eau de Parfum','Constance Geze',2019,['Saffron','Bergamot'],['Oud','Rose','Incense'],['Sandalwood','Musk','Amber']],
  ['mcr-hibiscus-mahajád','Maison Crivelli','Hibiscus Mahajád','#e07080','#c05060','Eau de Parfum','Constance Geze',2020,['Bergamot','Hibiscus'],['Rose','Jasmine'],['Musk','Sandalwood','Cedar']],
  ['mcr-pineapple-punch','Maison Crivelli','Pineapple Punch','#f0c840','#d4a020','Eau de Parfum','Constance Geze',2020,['Pineapple','Bergamot','Lemon'],['Jasmine','Neroli'],['Musk','Sandalwood']],
];

// ─── AL HARAMAIN ──────────────────────────────────────────────────────────
const AL_HARAMAIN: R[] = [
  ['alh-amber-oud','Al Haramain','Amber Oud','#c8a020','#d4af37','Eau de Parfum','Al Haramain',2016,['Bergamot','Cinnamon','Saffron'],['Amber','Oud','Rose'],['Sandalwood','Musk','Vanilla']],
  ['alh-amber-oud-gold','Al Haramain','Amber Oud Gold Edition','#d4af37','#c8a020','Eau de Parfum','Al Haramain',2019,['Bergamot','Saffron','Cardamom'],['Oud','Amber','Rose'],['Sandalwood','Vanilla','Musk']],
  ['alh-amber-oud-carbon','Al Haramain','Amber Oud Carbon Edition','#0a0a0a','#c0c0c0','Eau de Parfum','Al Haramain',2020,['Bergamot','Cardamom','Pepper'],['Oud','Amber','Rose'],['Sandalwood','Musk','Leather']],
  ['alh-l-aventure','Al Haramain','L\'Aventure','#c0c8d0','#a0b0c0','Eau de Parfum','Al Haramain',2018,['Bergamot','Lavender','Lemon'],['Sage','Vetiver','Patchouli'],['Amber','Musk','Cedar']],
  ['alh-l-aventure-blanche','Al Haramain','L\'Aventure Blanche','#f5f0e8','#e0e0d8','Eau de Parfum','Al Haramain',2020,['Bergamot','Lemon','Neroli'],['Jasmine','Rose','Lily'],['Musk','Sandalwood','Vanilla']],
  ['alh-madinah','Al Haramain','Madinah','#d4af37','#c8a020','Eau de Parfum','Al Haramain',2012,['Rose','Saffron'],['Oud','Amber'],['Musk','Sandalwood','Patchouli']],
  ['alh-noble','Al Haramain','Noble House','#0a0a0a','#d4af37','Eau de Parfum','Al Haramain',2018,['Bergamot','Pepper','Cardamom'],['Rose','Oud','Amber'],['Sandalwood','Leather','Musk']],
];

// ─── RASASI ────────────────────────────────────────────────────────────────
const RASASI: R[] = [
  ['ras-la-yuqawam','Rasasi','La Yuqawam','#c8a020','#d4af37','Eau de Parfum','Rasasi',2014,['Grapefruit','Bergamot','Lemon'],['Rose','Geranium','Jasmine'],['Cedarwood','Musk','Amber']],
  ['ras-hawas','Rasasi','Hawas','#001428','#6090c8','Eau de Parfum','Rasasi',2019,['Bergamot','Cardamom','Sea Notes'],['Jasmine','Patchouli','Geranium'],['Musk','Amber','Cedarwood']],
  ['ras-decades','Rasasi','Decades','#0a0a0a','#c0c0c0','Eau de Parfum','Rasasi',2015,['Bergamot','Lavender','Lemon'],['Rose','Amber','Musk'],['Oud','Sandalwood','Cedar']],
  ['ras-madain','Rasasi','Madain','#d4af37','#c8a020','Eau de Parfum','Rasasi',2015,['Cardamom','Saffron','Rose'],['Oud','Amber','Patchouli'],['Sandalwood','Musk','Vanilla']],
  ['ras-egra','Rasasi','Egra','#f0e8c0','#d4af37','Eau de Parfum','Rasasi',2014,['Bergamot','Lemon'],['Rose','Jasmine','Lily'],['Musk','Amber','Sandalwood']],
];

// ─── PARIS CORNER ─────────────────────────────────────────────────────────
const PARIS_CORNER: R[] = [
  ['pc-nero','Paris Corner','Nero','#0a0a0a','#d4af37','Eau de Parfum','Paris Corner',2018,['Bergamot','Black Pepper','Lavender'],['Rose','Oud','Amber'],['Sandalwood','Musk','Leather']],
  ['pc-pendora-gold','Paris Corner','Pendora Gold','#d4af37','#c8a020','Eau de Parfum','Paris Corner',2019,['Bergamot','Saffron','Cardamom'],['Rose','Amber','Jasmine'],['Sandalwood','Musk','Vanilla']],
  ['pc-pocket-lace','Paris Corner','Pocket Lace','#f0e0f0','#d0c0e0','Eau de Parfum','Paris Corner',2020,['Bergamot','Lemon','Peach'],['Rose','Jasmine','Lily'],['Musk','Sandalwood','Vanilla']],
  ['pc-eternia-man','Paris Corner','Eternia Man','#0a1428','#6090c8','Eau de Parfum','Paris Corner',2020,['Bergamot','Mint','Lavender'],['Geranium','Jasmine','Amber'],['Sandalwood','Musk','Cedar']],
];

// ─── KHADLAJ ──────────────────────────────────────────────────────────────
const KHADLAJ: R[] = [
  ['khd-hareem-gold','Khadlaj','Hareem Al Sultan Gold','#d4af37','#c8a020','Eau de Parfum','Khadlaj',2015,['Saffron','Rose','Bergamot'],['Oud','Amber','Patchouli'],['Sandalwood','Musk','Vanilla']],
  ['khd-musk-malaki','Khadlaj','Musk Malaki','#f5f0e8','#d4af37','Eau de Parfum','Khadlaj',2016,['Bergamot','Lemon'],['White Musk','Rose'],['Sandalwood','Amber','Vanilla']],
  ['khd-khas-oud','Khadlaj','Khas Oud','#0d0800','#d4af37','Eau de Parfum','Khadlaj',2017,['Saffron','Rose'],['Oud','Amber'],['Sandalwood','Musk','Patchouli']],
  ['khd-waalaa','Khadlaj','Waalaa','#e0c0d0','#c0a0b0','Eau de Parfum','Khadlaj',2018,['Bergamot','Peach'],['Rose','Jasmine'],['Musk','Amber','Sandalwood']],
];

// ─── MAISON ALHAMBRA ──────────────────────────────────────────────────────
const MAISON_ALHAMBRA: R[] = [
  ['mah-exclusif-oud','Maison Alhambra','Exclusif Oud','#0d0800','#d4af37','Eau de Parfum','Maison Alhambra',2019,['Saffron','Bergamot'],['Oud','Rose','Amber'],['Sandalwood','Musk','Vanilla']],
  ['mah-amber-blaze','Maison Alhambra','Amber Blaze','#c87820','#d4af37','Eau de Parfum','Maison Alhambra',2020,['Bergamot','Cardamom','Pepper'],['Amber','Rose','Oud'],['Sandalwood','Musk','Leather']],
  ['mah-porto','Maison Alhambra','Porto','#001428','#6090c8','Eau de Parfum','Maison Alhambra',2020,['Bergamot','Lavender','Lemon'],['Geranium','Vetiver'],['Amber','Musk','Sandalwood']],
  ['mah-drift-wood','Maison Alhambra','Drift Wood','#2d2800','#c8a020','Eau de Parfum','Maison Alhambra',2019,['Bergamot','Lemon'],['Vetiver','Cedar','Sandalwood'],['Musk','Amber','Oakmoss']],
  ['mah-jade','Maison Alhambra','Jade','#80c080','#60a060','Eau de Parfum','Maison Alhambra',2021,['Bergamot','Lemon','Mint'],['Green Tea','Jasmine','Rose'],['Musk','Sandalwood','Cedar']],
];

// ─── ZOOLOGIST ─────────────────────────────────────────────────────────────
const ZOOLOGIST: R[] = [
  ['zoo-bat','Zoologist','Bat','#0a0a0a','#404040','Eau de Parfum','Ellen Covey',2014,['Tobacco','Cognac','Birch Tar'],['Oud','Mushroom','Leather'],['Smoke','Ambergris','Musk']],
  ['zoo-hummingbird','Zoologist','Hummingbird','#80d0a0','#60b080','Eau de Parfum','Ellen Covey',2014,['Bergamot','Lime','Ylang-Ylang'],['Jasmine','Tropical Fruits'],['Sandalwood','Musk','Amber']],
  ['zoo-camel','Zoologist','Camel','#c8a020','#d4af37','Eau de Parfum','Ellen Covey',2014,['Incense','Myrrh','Cardamom'],['Leather','Tobacco','Oud'],['Amber','Sandalwood','Musk']],
  ['zoo-rhinoceros','Zoologist','Rhinoceros','#808080','#606060','Eau de Parfum','Ellen Covey',2016,['Vetiver','Earth','Pepper'],['Cedarwood','Patchouli'],['Musk','Amber','Leather']],
];

// ─── EX NIHILO ─────────────────────────────────────────────────────────────
const EX_NIHILO: R[] = [
  ['exn-fleur-narcotique','Ex Nihilo','Fleur Narcotique','#e080c0','#c060a0','Eau de Parfum','Olivier Pescheux',2014,['Lemon','Mandarin','Bergamot'],['Peony','Rose','Jasmine','Lily of the Valley'],['Sandalwood','White Musk','Ambrox']],
  ['exn-lust-in-paradise','Ex Nihilo','Lust in Paradise','#d0a0e0','#b080c0','Eau de Parfum','Olivier Pescheux',2014,['Bergamot','Cassis','Violet'],['Jasmine','Orris','Rose'],['Sandalwood','Musk','Benzoin']],
  ['exn-cologne-82','Ex Nihilo','Cologne 1982','#f0e080','#d0c040','Eau de Cologne','Benoist Lapouza',2017,['Bergamot','Lemon','Neroli'],['Jasmine','Petitgrain'],['Musk','Sandalwood','Cedar']],
];

// ─── ACQUA DI PARMA ────────────────────────────────────────────────────────
const ACQUA_DI_PARMA: R[] = [
  ['adp-colonia','Acqua di Parma','Colonia','#f5e080','#d4a020','Eau de Cologne','Various',1916,['Lemon','Bergamot','Lavender'],['Rosemary','Verbena','Iris'],['Sandalwood','Vetiver','Musk']],
  ['adp-colonia-oud','Acqua di Parma','Colonia Oud','#1a0800','#c8a020','Eau de Cologne','Various',2013,['Bergamot','Lemon'],['Oud','Rose','Cardamom'],['Amber','Sandalwood','Musk']],
  ['adp-magnolia-nobile','Acqua di Parma','Magnolia Nobile','#f0e8d8','#d4af37','Eau de Parfum','Various',2013,['Bergamot','Neroli','Peach'],['Magnolia','Rose','Jasmine'],['Sandalwood','Musk','Amber']],
  ['adp-peonia-nobile','Acqua di Parma','Peonia Nobile','#f0d8e8','#d4af37','Eau de Parfum','Various',2009,['Bergamot','Neroli'],['Peony','Rose','Jasmine'],['Musk','Sandalwood','Cedar']],
  ['adp-iris-nobile','Acqua di Parma','Iris Nobile','#d0d0f0','#b0b0d0','Eau de Parfum','Various',2004,['Grapefruit','Bergamot'],['Iris','Jasmine','Rose'],['Sandalwood','Musk','Amber']],
];

// ─── RALPH LAUREN ──────────────────────────────────────────────────────────
const RALPH_LAUREN: R[] = [
  ['rl-polo-green','Ralph Lauren','Polo Green','#003a00','#20a020','Eau de Toilette','Carlos Benaim',1978,['Artemisia','Bergamot','Juniper'],['Pine','Tobacco','Leather','Basil'],['Oakmoss','Patchouli','Vetiver']],
  ['rl-polo-blue','Ralph Lauren','Polo Blue','#001428','#6090c8','Eau de Toilette','Olivier Cresp',2003,['Melon','Cucumber','Sage'],['Suede','Basil'],['Musk','Vetiver','Oakmoss']],
  ['rl-polo-red','Ralph Lauren','Polo Red','#8b0000','#c84040','Eau de Toilette','Olivier Pescheux',2013,['Grapefruit','Cranberry','Lemon'],['Sage','Saffron'],['Labdanum','Musk','Cedarwood']],
  ['rl-romance','Ralph Lauren','Romance','#d0c0e0','#b0a0c8','Eau de Parfum','Harry Frémont',1998,['Cactus','Bergamot'],['Freesia','Violet','Iris'],['Musk','White Musk','Oak','Sandalwood']],
];

// ─── HUGO BOSS ─────────────────────────────────────────────────────────────
const HUGO_BOSS: R[] = [
  ['hb-boss-bottled','Hugo Boss','Boss Bottled','#c87820','#d4a020','Eau de Toilette','Annick Menardo',1998,['Apple','Plum','Bergamot','Lemon'],['Cinnamon','Mahogany','Carnation','Geranium'],['Sandalwood','Vetiver','Vanilla','Cedar']],
  ['hb-hugo-man','Hugo Boss','Hugo Man','#002060','#4080c0','Eau de Toilette','Various',1995,['Apple','Red Berries','Lavender'],['Mint','Juniper'],['Oakmoss','Vetiver','Musk']],
  ['hb-boss-infinite','Hugo Boss','Boss Infinite','#c0c0c0','#a0a0a0','Eau de Parfum','Various',2021,['Bergamot','Cardamom'],['Jasmine','Iris','Leather'],['Sandalwood','Vetiver','White Musk']],
  ['hb-the-scent','Hugo Boss','The Scent','#0a0a0a','#c0c0c0','Eau de Toilette','Ilias Ermenidis',2015,['Ginger','Maninka Fruit'],['Birch'],['Leather']],
  ['hb-alive','Hugo Boss','Alive','#e0a0c0','#c08090','Eau de Parfum','Loc Dong',2020,['Bergamot','Pink Pepper'],['Jasmine','Lily','Rose'],['Sandalwood','Musk','Amber']],
];

// ─── LATTAFA ──────────────────────────────────────────────────────────────
const LATTAFA: R[] = [
  ['lat-oud-mood','Lattafa','Oud Mood','#0d0800','#d4af37','Eau de Parfum','Lattafa',2016,['Saffron','Rose'],['Oud','Amber','Patchouli'],['Sandalwood','Musk','Leather']],
  ['lat-raghba','Lattafa','Raghba','#c8a020','#d4af37','Eau de Parfum','Lattafa',2017,['Bergamot','Cardamom','Saffron'],['Rose','Oud','Amber'],['Sandalwood','Musk','Vanilla']],
  ['lat-raghba-wood','Lattafa','Raghba Wood Intense','#1a0800','#c8a020','Eau de Parfum','Lattafa',2020,['Cardamom','Pepper','Bergamot'],['Oud','Amber','Rose'],['Sandalwood','Leather','Musk']],
  ['lat-oud-al-layl','Lattafa','Oud Al Layl','#0a0a0a','#d4af37','Eau de Parfum','Lattafa',2018,['Rose','Saffron'],['Oud','Amber'],['Sandalwood','Musk','Patchouli']],
  ['lat-khamrah','Lattafa','Khamrah','#c8a020','#d4af37','Eau de Parfum','Lattafa',2020,['Rum','Bergamot','Cardamom'],['Amber','Cinnamon','Oud'],['Sandalwood','Vanilla','Musk']],
  ['lat-yara','Lattafa','Yara','#f0e0f0','#d0c0e0','Eau de Parfum','Lattafa',2021,['Bergamot','Lemon','Peach'],['Rose','Jasmine','Orchid'],['Musk','Sandalwood','Amber']],
  ['lat-asad','Lattafa','Asad','#c87820','#d4af37','Eau de Parfum','Lattafa',2019,['Bergamot','Cardamom','Pepper'],['Amber','Rose','Jasmine'],['Sandalwood','Leather','Musk']],
  ['lat-ana-abiyedh','Lattafa','Ana Abiyedh','#f5f0e8','#e0e0d8','Eau de Parfum','Lattafa',2021,['Bergamot','Lemon'],['White Musk','Rose','Jasmine'],['Sandalwood','Vanilla','Amber']],
  ['lat-oud-mood-bloom','Lattafa','Oud Mood Bloom','#e0c0d0','#c0a0b0','Eau de Parfum','Lattafa',2021,['Peach','Bergamot','Saffron'],['Rose','Oud','Jasmine'],['Amber','Musk','Sandalwood']],
];

// ─── AFNAN ────────────────────────────────────────────────────────────────
const AFNAN: R[] = [
  ['afn-supremacy-noir','Afnan','Supremacy Noir','#0a0a0a','#d4af37','Eau de Parfum','Afnan',2016,['Bergamot','Pepper'],['Oud','Amber','Jasmine'],['Sandalwood','Musk','Leather']],
  ['afn-supremacy-silver','Afnan','Supremacy Silver','#c0c8d0','#a0b0c0','Eau de Parfum','Afnan',2017,['Bergamot','Lemon','Apple'],['Rose','Jasmine'],['Sandalwood','Musk','Cedar']],
  ['afn-9pm','Afnan','9 PM','#0a0a2d','#c0c0e0','Eau de Parfum','Afnan',2019,['Apple','Bergamot','Cinnamon'],['Orange Blossom','Licorice','Tonka Bean'],['Musk','Vanilla','Patchouli']],
  ['afn-inara-white','Afnan','Inara White','#f5f0e8','#e0e0d8','Eau de Parfum','Afnan',2020,['Bergamot','Lemon','Neroli'],['Jasmine','Rose','Lily'],['Musk','Sandalwood','Amber']],
  ['afn-tribute-white','Afnan','Tribute White','#f0e8d0','#d4af37','Eau de Parfum','Afnan',2021,['Bergamot','Lemon'],['Rose','Jasmine','Amber'],['Musk','Sandalwood','Vanilla']],
];

// ─── SWISS ARABIAN ─────────────────────────────────────────────────────────
const SWISS_ARABIAN: R[] = [
  ['sa-shaghaf-oud','Swiss Arabian','Shaghaf Oud','#0d0800','#d4af37','Eau de Parfum','Swiss Arabian',2015,['Saffron','Rose'],['Oud','Amber','Patchouli'],['Sandalwood','Musk','Vanilla']],
  ['sa-dehan-al-oud-hindi','Swiss Arabian','Dehan Al Oud Hindi','#1a0800','#c8a020','Eau de Parfum','Swiss Arabian',2010,['Oud','Rose'],['Amber','Saffron'],['Sandalwood','Musk','Leather']],
  ['sa-layali-rouge','Swiss Arabian','Layali Rouge','#8b0000','#c84040','Eau de Parfum','Swiss Arabian',2016,['Bergamot','Saffron','Cardamom'],['Rose','Oud','Amber'],['Sandalwood','Musk','Vanilla']],
  ['sa-wardi','Swiss Arabian','Wardi','#e0c0c0','#c0a0a0','Eau de Parfum','Swiss Arabian',2014,['Rose','Bergamot'],['Rose','Jasmine'],['Musk','Sandalwood','Amber']],
  ['sa-kashkha','Swiss Arabian','Kashkha','#d4af37','#c8a020','Eau de Parfum','Swiss Arabian',2010,['Rose','Saffron','Bergamot'],['Oud','Amber'],['Sandalwood','Musk','Patchouli']],
];

// ─── AMOUAGE (additional) ──────────────────────────────────────────────────
const AMOUAGE_EXT: R[] = [
  ['am-reflection-man','Amouage','Reflection Man','#f5f0e8','#d4af37','Eau de Parfum','Lucas Sieuzac',2007,['Bergamot','Neroli','Pepper'],['Rose','Jasmine','Geranium'],['Sandalwood','Musk','Amber']],
  ['am-epic-man','Amouage','Epic Man','#2d1a00','#d4af37','Eau de Parfum','Pierre Negrin',2009,['Black Pepper','Elemi','Cardamom'],['Incense','Orris','Papyrus'],['Sandalwood','Leather','Oud','Amber']],
  ['am-lyric-man','Amouage','Lyric Man','#1a0d2d','#c0a0d0','Eau de Parfum','Daniel Maurel',2008,['Bergamot','Cardamom','Black Pepper'],['Rose','Jasmine','Incense'],['Sandalwood','Amber','Musk']],
  ['am-memoir-man','Amouage','Memoir Man','#0a1a0a','#60a060','Eau de Parfum','Daniel Maurel',2010,['Wormwood','Basil','Pepper'],['Incense','Tobacco','Leather'],['Sandalwood','Amber','Frankincense']],
];

// ─── MATIERE PREMIERE ──────────────────────────────────────────────────────
const MATIERE_PREMIERE: R[] = [
  ['mp-radical-rose','Matiere Premiere','Radical Rose','#e08080','#c06060','Eau de Parfum','Aurélien Guichard',2019,['Bergamot'],['Turkish Rose','Geranium'],['Musk','Patchouli','Amber']],
  ['mp-parisian-musc','Matiere Premiere','Parisian Musc','#f0e8f0','#d0c8e0','Eau de Parfum','Aurélien Guichard',2019,['Aldehydes','Bergamot'],['Rose','Jasmine'],['Musks','Sandalwood']],
  ['mp-french-flower','Matiere Premiere','French Flower','#f0e0c0','#d4af37','Eau de Parfum','Aurélien Guichard',2020,['Bergamot','Lemon'],['Jasmine','Ylang-Ylang'],['Musk','Sandalwood']],
  ['mp-bois-darmenie','Matiere Premiere','Bois d\'Arménie','#1a0800','#c8a020','Eau de Parfum','Aurélien Guichard',2020,['Bergamot','Cardamom'],['Incense','Rose'],['Benzoin','Sandalwood','Amber']],
];

// ─── ROJA PARFUMS ──────────────────────────────────────────────────────────
const ROJA_PARFUMS: R[] = [
  ['roj-elysium','Roja Parfums','Elysium','#c0d8e0','#a0b8c8','Eau Intense','Roja Dove',2017,['Grapefruit','Lemon','Bergamot'],['Vetiver','Fougere'],['Sandalwood','Musk','Amber']],
  ['roj-enigma','Roja Parfums','Enigma','#0a0a0a','#d4af37','Parfum','Roja Dove',2017,['Bergamot','Lemon'],['Oud','Rose','Leather'],['Amber','Sandalwood','Musk']],
  ['roj-scandal','Roja Parfums','Scandal Pour Homme','#c8a020','#d4af37','Parfum','Roja Dove',2017,['Grapefruit','Bergamot'],['Rose','Jasmine'],['Amber','Oud','Musk','Sandalwood']],
  ['roj-apex','Roja Parfums','Apex','#001428','#6090c8','Parfum','Roja Dove',2019,['Bergamot','Cardamom'],['Rose','Amber','Oud'],['Sandalwood','Musk','Leather']],
];

// ─── KILIAN (additional) ─────────────────────────────────────────────────
const KILIAN_EXT: R[] = [
  ['kil-love','Kilian','Love, Don\'t Be Shy','#f5e0f0','#e0c0e0','Eau de Parfum','Calice Becker',2007,['Orange Blossom','Rose'],['Caramel','Marshmallow'],['Musk','Amber','Sandalwood']],
  ['kil-black-phantom','Kilian','Black Phantom','#0a0a0a','#c8a020','Eau de Parfum','Calice Becker',2015,['Rum','Bergamot'],['Caramel','Coffee','Vanilla'],['Musk','Amber','Sandalwood']],
  ['kil-straight-to-heaven','Kilian','Straight to Heaven','#f5f0e8','#d4af37','Eau de Parfum','Calice Becker',2007,['Pink Pepper','Coriander'],['Rum','Patchouli'],['Musk','Sandalwood','Vanilla']],
];

// ─── MAISON FRANCIS KURKDJIAN (additional) ────────────────────────────────
const MFK_EXT: R[] = [
  ['mfk-gentle-fluidity-gold','Maison Francis Kurkdjian','Gentle Fluidity Gold','#d4af37','#c8a020','Eau de Parfum','Francis Kurkdjian',2019,['Bergamot','Cardamom'],['Musks','Juniper Berries'],['Amber','Vanilla','Sandalwood']],
  ['mfk-grand-soir','Maison Francis Kurkdjian','Grand Soir','#1a0800','#c87820','Eau de Parfum','Francis Kurkdjian',2016,['Bergamot'],['Amber','Benzoin'],['Vanilla','Tonka Bean','White Musk']],
  ['mfk-aqua-celestia','Maison Francis Kurkdjian','Aqua Celestia','#a0c8f0','#80a8d0','Eau de Parfum','Francis Kurkdjian',2018,['Blackcurrant','Bergamot'],['Mimosa','Jasmine'],['Musk','Driftwood']],
  ['mfk-724','Maison Francis Kurkdjian','724','#f0e8c0','#d4af37','Eau de Parfum','Francis Kurkdjian',2022,['Bergamot','Mandarin'],['Jasmine','Heliotrope'],['White Musk','Sandalwood']],
];

// ─── CREED (additional) ───────────────────────────────────────────────────
const CREED_EXT: R[] = [
  ['cr-millesime-imperial','Creed','Millesime Imperial','#f5f0e0','#d4af37','Eau de Parfum','Olivier Creed',1995,['Bergamot','Lemon','Mandarin'],['Sea Notes','Iris'],['Musk','Ambergris','Sandalwood']],
  ['cr-silver-mountain','Creed','Silver Mountain Water','#c0d8f0','#a0b8d8','Eau de Parfum','Olivier Creed',1995,['Bergamot','Mandarin','Green Tea'],['Violet Leaves','Blackcurrant'],['Musk','Sandalwood','Galbanum']],
  ['cr-royal-oud','Creed','Royal Oud','#d4af37','#c8a020','Eau de Parfum','Olivier Creed',2011,['Bergamot','Cardamom','Pink Pepper'],['Cedar','Oud','Leather'],['Musk','Sandalwood','Amber']],
];

// ─── TOM FORD (additional) ────────────────────────────────────────────────
const TF_EXT: R[] = [
  ['tf-neroli-portofino','Tom Ford','Neroli Portofino','#f0e880','#d4a020','Eau de Parfum','Rodrigo Flores-Roux',2011,['Bergamot','Lemon','Mandarin','Myrtle'],['Neroli','Jasmine','Lavender'],['Amber','Oakmoss','White Musk']],
  ['tf-soleil-neige','Tom Ford','Soleil Neige','#f5f0e8','#d4af37','Eau de Parfum','Yann Vasnier',2017,['Bergamot','Mandarin'],['Musk','Jasmine'],['Sandalwood','Vetiver','Benzoin']],
  ['tf-fucking-fabulous','Tom Ford','Fucking Fabulous','#f5f0e8','#d4af37','Eau de Parfum','Louise Turner',2017,['Clary Sage','Lavender'],['Leather','Orris'],['Tonka Bean','Cashmeran','Vanilla']],
  ['tf-noir-extreme','Tom Ford','Noir Extreme','#0a0a0a','#c0c0c0','Eau de Parfum','Sonia Constant',2015,['Nutmeg','Cardamom','Mandarin'],['Amber','Neroli','Rose'],['Vanilla','Sandalwood','Oud']],
  ['tf-grey-vetiver','Tom Ford','Grey Vetiver','#808080','#606060','Eau de Parfum','Ilias Ermenidis',2009,['Grapefruit','Pepper','Sage'],['Vetiver','Oakmoss','Cedar'],['Sandalwood','Amber','Tonka Bean']],
  ['tf-tuscan-leather','Tom Ford','Tuscan Leather','#8b4000','#c87820','Eau de Parfum','Calice Becker',2007,['Raspberry'],['Thyme'],['Leather','Saffron','Jasmine','Amber']],
];

// ─── XERJOFF (additional) ────────────────────────────────────────────────
const XERJOFF_EXT: R[] = [
  ['xer-forty-knots','Xerjoff','Forty Knots','#001428','#6090c8','Eau de Parfum','Various',2016,['Gin','Bergamot','Juniper Berries'],['Sea Salt','Jasmine'],['Driftwood','Musk','Ambergris']],
  ['xer-casamorati-dama-blanca','Xerjoff','Dama Blanca','#f5f0e8','#e0e0d8','Eau de Parfum','Various',2013,['Bergamot','Lemon'],['Rose','Jasmine','Iris'],['Musk','Sandalwood','Amber']],
  ['xer-opera-i','Xerjoff','Opera I','#f5e8c0','#d4af37','Eau de Parfum','Various',2013,['Bergamot','Cardamom'],['Rose','Iris'],['Sandalwood','Musk','Vanilla']],
  ['xer-casamorati-lira','Xerjoff','Lira','#d4af37','#c8a020','Eau de Parfum','Various',2013,['Bergamot','Lemon'],['Rose','Jasmine'],['Musk','Sandalwood','Amber']],
  ['xer-uden','Xerjoff','Uden','#0d0800','#d4af37','Eau de Parfum','Various',2012,['Bergamot','Pepper'],['Oud','Rose','Amber'],['Sandalwood','Musk','Leather']],
];

// ─── DIOR (additional) ────────────────────────────────────────────────────
const DIOR_EXT: R[] = [
  ['dior-miss-dior','Dior','Miss Dior','#f5e8f0','#d4af37','Eau de Parfum','François Demachy',2012,['Peony','Pink Pepper'],['Grasse Rose','Peony'],['Patchouli','Musk','Sandalwood']],
  ['dior-j-adore','Dior','J\'adore','#f0e080','#d4a020','Eau de Parfum','Calice Becker',1999,['Calabrian Bergamot','Melon','Peach'],['Orchid','Violet','Lily of the Valley','Rose Centifolia','Tuberose','Jasmine'],['Sandalwood','Blackberry Musk','Amber']],
  ['dior-bois-rose','Dior','Bois de Rose','#e0c0c0','#c8a0a0','Eau de Parfum','François Demachy',2012,['Bergamot'],['Rose','Jasmine'],['Sandalwood','Musk','Amber']],
  ['dior-poison','Dior','Poison','#7a1f7a','#c060c0','Eau de Toilette','Edouard Fléchier',1985,['Plum','Bergamot','Coriander'],['Tuberose','Jasmine','Rose'],['Sandalwood','Vetiver','Musk','Civet']],
  ['dior-fahrenheit','Dior','Fahrenheit','#c87820','#d4a020','Eau de Toilette','Jean-Louis Sieuzac',1988,['Mandarin','Bergamot','Hawthorn'],['Violet','Leather'],['Sandalwood','Musk','Amber','Cedar']],
  ['dior-homme-sport','Dior','Dior Homme Sport','#001428','#6090c8','Eau de Toilette','François Demachy',2008,['Bergamot','Grapefruit','Elemi'],['Iris','Cardamom','Vetiver'],['Sandalwood','Amber','Cedar']],
  ['dior-lucky','Dior','Lucky','#c0d8c0','#a0b8a0','Eau de Toilette','Various',2000,['Bergamot','Lemon','Lime'],['Jasmine','Rose'],['Musk','Sandalwood','Cedar']],
];

// ─── PARFUMS DE MARLY (additional) ────────────────────────────────────────
const PDM_EXT: R[] = [
  ['pdm-percival','Parfums de Marly','Percival','#003a2d','#80c0a0','Eau de Parfum','Hamid Merati-Kashani',2017,['Bergamot','Grapefruit'],['Vetiver','Mint','Violet'],['Oakmoss','Cedar','Musk']],
  ['pdm-hamdani','Parfums de Marly','Hamdani','#d4af37','#c8a020','Eau de Parfum','Hamid Merati-Kashani',2018,['Saffron','Rose','Bergamot'],['Amber','Oud'],['Sandalwood','Musk','Vanilla']],
  ['pdm-galloway','Parfums de Marly','Galloway','#f0e8c0','#d4af37','Eau de Parfum','Hamid Merati-Kashani',2019,['Bergamot','Lemon'],['Iris','Violet','Jasmine'],['Musk','Sandalwood','Amber']],
  ['pdm-carlisle','Parfums de Marly','Carlisle','#1a0d2d','#c0a0d0','Eau de Parfum','Hamid Merati-Kashani',2015,['Cardamom','Bergamot'],['Jasmine','Violet','Orris'],['Sandalwood','Amber','Musk']],
  ['pdm-greenley','Parfums de Marly','Greenley','#003a00','#60a060','Eau de Parfum','Hamid Merati-Kashani',2019,['Bergamot','Grapefruit','Lemon'],['Grass','Violet','Iris'],['Vetiver','Musk','Sandalwood']],
];

// ─── MANCERA (additional) ─────────────────────────────────────────────────
const MANCERA_EXT: R[] = [
  ['man-instant-crush','Mancera','Instant Crush','#c0d8e0','#a0b8c8','Eau de Parfum','Pierre Montale',2019,['Bergamot','Lemon','Mandarin'],['Rose','Jasmine','Peony'],['Musk','Sandalwood','Cedar']],
  ['man-blue-amber','Mancera','Blue Amber','#001428','#6090c8','Eau de Parfum','Pierre Montale',2016,['Bergamot','Citrus'],['Amber','Jasmine'],['Sandalwood','Musk','Vanilla']],
  ['man-tropical-wood','Mancera','Tropical Wood','#80c060','#60a040','Eau de Parfum','Pierre Montale',2014,['Bergamot','Mandarin','Lime'],['Pineapple','Coconut','Jasmine'],['Sandalwood','Musk','Cedar']],
  ['man-figure-one','Mancera','Figure One','#f5f0e8','#d4af37','Eau de Parfum','Pierre Montale',2020,['Bergamot','Cardamom'],['Rose','Jasmine'],['Musk','Sandalwood','Amber']],
  ['man-line-voyage','Mancera','Ligne Voyage','#001428','#6090c8','Eau de Parfum','Pierre Montale',2015,['Bergamot','Lemon','Mint'],['Sea Notes','Jasmine'],['Musk','Sandalwood','Cedar']],
  ['man-rose-de-amber','Mancera','Rose de Amber','#c87820','#d4af37','Eau de Parfum','Pierre Montale',2011,['Rose','Bergamot'],['Amber','Rose','Jasmine'],['Sandalwood','Musk','Vanilla']],
  ['man-Hindu-kush','Mancera','Hindu Kush','#2d2800','#c8a020','Eau de Parfum','Pierre Montale',2013,['Bergamot','Black Pepper','Cardamom'],['Rose','Oud'],['Sandalwood','Amber','Musk','Leather']],
];

// ─── ZARA ──────────────────────────────────────────────────────────────────
const ZARA: R[] = [
  ['zar-wonder-rose','Zara','Wonder Rose','#e0c0d0','#c0a0b0','Eau de Toilette','Zara',2021,['Bergamot','Lemon'],['Rose','Jasmine'],['Musk','Sandalwood']],
  ['zar-gourmand','Zara','Gourmand','#f5e0b0','#d4a020','Eau de Toilette','Zara',2020,['Bergamot','Lemon'],['Vanilla','Caramel'],['Musk','Sandalwood']],
  ['zar-dusk-rose','Zara','Dusk Rose','#f0d8e8','#d0b8c8','Eau de Toilette','Zara',2022,['Bergamot','Peach'],['Rose','Peony'],['Musk','Sandalwood']],
  ['zar-rich-warm-addictive','Zara','Rich Warm Addictive','#c87820','#d4a020','Eau de Parfum','Zara',2020,['Bergamot','Cardamom'],['Amber','Oud'],['Sandalwood','Musk','Vanilla']],
  ['zar-oriental','Zara','Oriental','#d4af37','#c8a020','Eau de Parfum','Zara',2019,['Bergamot','Saffron'],['Rose','Amber'],['Sandalwood','Musk','Oud']],
];

// ─── ORTO PARISI ──────────────────────────────────────────────────────────
const ORTO_PARISI: R[] = [
  ['op-seminalis','Orto Parisi','Seminalis','#f5e0b0','#d4a020','Eau de Parfum','Alessandro Gualtieri',2014,['Bergamot','Nutmeg'],['Ambrette','Oud','Incense'],['Musk','Amber','Sandalwood']],
  ['op-boccanera','Orto Parisi','Boccanera','#0a0a0a','#404040','Eau de Parfum','Alessandro Gualtieri',2014,['Incense','Smoke','Birch Tar'],['Leather','Tobacco'],['Amber','Musk','Sandalwood']],
  ['op-cuoium','Orto Parisi','Cuoium','#8b4000','#c87820','Eau de Parfum','Alessandro Gualtieri',2014,['Leather','Birch Tar'],['Tobacco','Oud'],['Amber','Musk','Sandalwood']],
];

// ─── TOSKOVAT' ─────────────────────────────────────────────────────────────
const TOSKOVAT: R[] = [
  ['tsk-persona','Toskovat\'','Persona','#1a1a3a','#6060a0','Eau de Parfum','Toskovat',2019,['Bergamot','Cardamom','Pink Pepper'],['Iris','Vetiver','Amber'],['Sandalwood','Musk','Cedar']],
  ['tsk-theory','Toskovat\'','Theory','#f5f0e8','#d4af37','Eau de Parfum','Toskovat',2019,['Bergamot','Lemon'],['Rose','Jasmine'],['Sandalwood','Musk','Amber']],
  ['tsk-intension','Toskovat\'','Intension','#0a0a2d','#4040a0','Eau de Parfum','Toskovat',2020,['Bergamot','Lavender'],['Amber','Oud'],['Sandalwood','Musk','Leather']],
];

// ─── BESPOKE LONDON ────────────────────────────────────────────────────────
const BESPOKE_LONDON: R[] = [
  ['bl-oud-noir','Bespoke London','Oud Noir','#0a0a0a','#d4af37','Eau de Parfum','Bespoke London',2018,['Bergamot','Saffron'],['Oud','Rose'],['Sandalwood','Amber','Musk']],
  ['bl-amber-elixir','Bespoke London','Amber Elixir','#c87820','#d4af37','Eau de Parfum','Bespoke London',2019,['Bergamot','Cardamom'],['Amber','Rose'],['Sandalwood','Musk','Vanilla']],
  ['bl-white-flowers','Bespoke London','White Flowers','#f5f0e8','#e0e0d8','Eau de Parfum','Bespoke London',2020,['Bergamot','Lemon'],['Jasmine','Rose','Lily'],['Musk','Sandalwood']],
];

// ─── RAYHAAN ──────────────────────────────────────────────────────────────
const RAYHAAN: R[] = [
  ['ray-abyat','Rayhaan','Abyat','#f5f0e8','#d4af37','Eau de Parfum','Rayhaan',2016,['Bergamot','Lemon'],['Rose','Jasmine'],['Musk','Sandalwood','Amber']],
  ['ray-riwayat','Rayhaan','Riwayat','#d4af37','#c8a020','Eau de Parfum','Rayhaan',2017,['Saffron','Rose','Bergamot'],['Oud','Amber'],['Sandalwood','Musk','Vanilla']],
];

// ─── STREET ORIGINS ────────────────────────────────────────────────────────
const STREET_ORIGINS: R[] = [
  ['so-oud-noir','Street Origins','Oud Noir','#0a0a0a','#d4af37','Eau de Parfum','Street Origins',2019,['Bergamot','Pepper'],['Oud','Rose'],['Sandalwood','Amber','Musk']],
  ['so-urban-musk','Street Origins','Urban Musk','#f0e8d0','#d4af37','Eau de Parfum','Street Origins',2020,['Bergamot','Lemon'],['Musk','Jasmine'],['Sandalwood','Amber','Vanilla']],
];

// ─── FRENCH AVENUE ────────────────────────────────────────────────────────
const FRENCH_AVENUE: R[] = [
  ['fa-oud-intense','French Avenue','Oud Intense','#0d0800','#d4af37','Eau de Parfum','French Avenue',2018,['Bergamot','Saffron'],['Oud','Amber','Rose'],['Sandalwood','Musk','Vanilla']],
  ['fa-amber-veil','French Avenue','Amber Veil','#c87820','#d4af37','Eau de Parfum','French Avenue',2019,['Bergamot','Cardamom'],['Amber','Jasmine'],['Sandalwood','Musk','Vanilla']],
];

// ─── MYKONOS ──────────────────────────────────────────────────────────────
const MYKONOS: R[] = [
  ['myk-sunlit','Mykonos','Sunlit','#f0d880','#d4a020','Eau de Parfum','Mykonos',2020,['Bergamot','Lemon','Mandarin'],['Neroli','Jasmine'],['Musk','Sandalwood','Amber']],
  ['myk-aegean','Mykonos','Aegean Blue','#001428','#6090c8','Eau de Parfum','Mykonos',2020,['Bergamot','Sea Notes','Grapefruit'],['Jasmine','Iris'],['Musk','Sandalwood','Cedar']],
  ['myk-island-breeze','Mykonos','Island Breeze','#c0e8f0','#a0c8d8','Eau de Parfum','Mykonos',2021,['Bergamot','Lime','Mint'],['Sea Notes','Jasmine'],['Musk','Sandalwood']],
];

// ─── ASSAF ────────────────────────────────────────────────────────────────
const ASSAF: R[] = [
  ['ass-oud-khashab','Assaf','Oud Khashab','#0d0800','#d4af37','Eau de Parfum','Assaf',2017,['Oud','Rose'],['Amber','Saffron'],['Sandalwood','Musk','Leather']],
  ['ass-musk-noir','Assaf','Musk Noir','#0a0a0a','#d4af37','Eau de Parfum','Assaf',2018,['Bergamot','Pepper'],['Musk','Rose'],['Sandalwood','Amber','Leather']],
];

// ─── AHMED AL MAGHRIBI ────────────────────────────────────────────────────
const AHMED_AL_MAGHRIBI: R[] = [
  ['aam-maktoub','Ahmed Al Maghribi','Maktoub','#d4af37','#c8a020','Eau de Parfum','Ahmed Al Maghribi',2016,['Saffron','Rose','Bergamot'],['Oud','Amber'],['Sandalwood','Musk','Vanilla']],
  ['aam-mukhallat','Ahmed Al Maghribi','Mukhallat Hayati','#c8a020','#d4af37','Eau de Parfum','Ahmed Al Maghribi',2018,['Bergamot','Cardamom'],['Rose','Oud','Amber'],['Sandalwood','Musk','Leather']],
];

// ─── MAISON ASRAR ─────────────────────────────────────────────────────────
const MAISON_ASRAR: R[] = [
  ['mas-grand-epic','Maison Asrar','Grand Epic','#0d0800','#d4af37','Eau de Parfum','Maison Asrar',2018,['Saffron','Bergamot','Cardamom'],['Oud','Rose','Amber'],['Sandalwood','Musk','Vanilla']],
  ['mas-shayan','Maison Asrar','Shayan','#c8a020','#d4af37','Eau de Parfum','Maison Asrar',2019,['Bergamot','Lemon'],['Rose','Jasmine','Amber'],['Sandalwood','Musk','Vanilla']],
];

// ─── RASASI (additional) ─────────────────────────────────────────────────
const RASASI_EXT: R[] = [
  ['ras-junoon','Rasasi','Junoon','#8b0000','#c84040','Eau de Parfum','Rasasi',2014,['Bergamot','Cardamom','Saffron'],['Rose','Oud','Amber'],['Sandalwood','Musk','Vanilla']],
  ['ras-nafaeis','Rasasi','Nafaeis Al Shaghaf','#c8a020','#d4af37','Eau de Parfum','Rasasi',2013,['Bergamot','Saffron','Cardamom'],['Oud','Amber','Rose'],['Sandalwood','Musk','Leather']],
];

// ─── KHADLAJ (additional) ─────────────────────────────────────────────────
const KHADLAJ_EXT: R[] = [
  ['khd-palazzo','Khadlaj','Palazzo','#f5f0e8','#d4af37','Eau de Parfum','Khadlaj',2019,['Bergamot','Lemon'],['Jasmine','Rose'],['Musk','Sandalwood','Amber']],
  ['khd-iris-rose','Khadlaj','Iris Rose','#d0c0f0','#b0a0d0','Eau de Parfum','Khadlaj',2020,['Bergamot'],['Iris','Rose'],['Musk','Sandalwood']],
];

// ─── D'ORSAY ──────────────────────────────────────────────────────────────
const DORSAY: R[] = [
  ['dor-intrigant-patchouli','D\'Orsay','Intrigant Patchouli','#2d2800','#c8a020','Eau de Parfum','D\'Orsay',2008,['Bergamot','Mandarin'],['Patchouli','Rose'],['Amber','Sandalwood','Musk']],
  ['dor-dandy','D\'Orsay','Dandy','#1a1a3a','#8080b0','Eau de Parfum','D\'Orsay',2012,['Bergamot','Lemon'],['Iris','Violet','Cedar'],['Amber','Sandalwood','Musk']],
];

// ─── JEAN PAUL GAULTIER (additional) ────────────────────────────────────
const JPG_EXT: R[] = [
  ['jpg-scandal','Jean Paul Gaultier','Scandal','#d4af37','#c8a020','Eau de Parfum','Dora Baghriche',2017,['Bergamot','Blood Orange'],['Honey','Gardenia'],['Patchouli','Sandalwood']],
  ['jpg-le-beau','Jean Paul Gaultier','Le Beau','#a0c8f0','#80a8d0','Eau de Parfum','Quentin Bisch',2019,['Bergamot','Lime'],['Tonka Bean','Aquatic Notes'],['Sandalwood','Cedar','Musk']],
];

// ─── VERSACE (additional) ─────────────────────────────────────────────────
const VERSACE_EXT: R[] = [
  ['ver-eros-edp','Versace','Eros EDP','#001428','#6090c8','Eau de Parfum','Anne Flipo',2021,['Mint','Lemon','Apple'],['Tonka Bean','Geranium'],['Vanilla','Vetiver','Oakmoss']],
  ['ver-dylan-blue','Versace','Dylan Blue','#001428','#4060b0','Eau de Toilette','Alberto Morillas',2016,['Grapefruit','Fig Leaf','Bergamot'],['Violet','Saffron','Papyrus','Patchouli'],['Musk','Incense','Ambergris']],
  ['ver-bright-crystal','Versace','Bright Crystal','#c0d8f0','#a0b8d8','Eau de Toilette','Olivier Polge',2006,['Pomegranate','Yuzu','Frosted Accord'],['Magnolia','Lotus','Peony'],['Musk','Mahogany','Amber']],
];

// ─── DOLCE & GABBANA (additional) ────────────────────────────────────────
const DG_EXT: R[] = [
  ['dg-the-one-man','Dolce & Gabbana','The One for Men','#d4af37','#c8a020','Eau de Toilette','Various',2008,['Tobacco','Grapefruit','Basil','Coriander'],['Ginger','Cardamom','Orange Blossom'],['Cedar','Amber','Musk']],
  ['dg-light-blue-w','Dolce & Gabbana','Light Blue Women','#001428','#80c0e0','Eau de Toilette','Olivier Cresp',2001,['Sicilian Lemon','Apple','Cedar','Bellflower'],['Bamboo','Jasmine','White Rose'],['Cedar','Musk','Amber']],
];

// ─── GIORGIO ARMANI (additional) ─────────────────────────────────────────
const GA_EXT: R[] = [
  ['ga-adg-profumo','Giorgio Armani','Acqua di Giò Profumo','#0a0a0a','#c0c0c0','Eau de Parfum','Alberto Morillas',2015,['Sea Notes','Bergamot'],['Incense','Geranium'],['Patchouli','Mineral Accord','Musk']],
  ['ga-si','Giorgio Armani','Sì','#e0c0d0','#c0a0b0','Eau de Parfum','Julie Massé',2013,['Blackcurrant Nectar','Bergamot'],['Rose','Freesia'],['Patchouli','Vanilla','Amber']],
  ['ga-si-passione','Giorgio Armani','Sì Passione','#8b0020','#c04060','Eau de Parfum','Various',2017,['Jasmine','Pear','Cassis'],['Rose','Jasmine'],['Patchouli','Vanilla','Musk']],
];

// ─── YSL (additional) ────────────────────────────────────────────────────
const YSL_EXT: R[] = [
  ['ysl-opium','Yves Saint Laurent','Opium','#8b0000','#c8a020','Eau de Parfum','Jean-Louis Sieuzac',1977,['Clove','Black Pepper','Bay Leaf','Plum'],['Jasmine','Rose','Lily of the Valley','Carnation'],['Sandalwood','Cedarwood','Opoponax','Labdanum','Myrrh','Vetiver']],
  ['ysl-kouros','Yves Saint Laurent','Kouros','#f0e080','#d0c040','Eau de Toilette','Pierre Bourdon',1981,['Aldehydes','Bergamot','Clary Sage','Artemisia'],['Jasmine','Iris','Geranium','Carnation','Cyclamen'],['Civet','Vetiver','Amber','Oakmoss']],
];

// ─── GUERLAIN (additional) ────────────────────────────────────────────────
const GUERLAIN_EXT: R[] = [
  ['gue-mon-guerlain','Guerlain','Mon Guerlain','#e0c8f0','#c0a8d0','Eau de Parfum','Thierry Wasser',2017,['Bergamot'],['Lavender','Jasmine'],['Vanilla','Sandalwood','White Musk']],
  ['gue-lheure-bleue','Guerlain','L\'Heure Bleue','#d0c0e0','#b0a0c8','Eau de Parfum','Jacques Guerlain',1912,['Anise','Bergamot'],['Iris','Violet','Rose','Carnation'],['Vanilla','Amber','Sandalwood','Musk']],
];

// ─── DOLCE & GABBANA (more) ───────────────────────────────────────────────
const DG_MORE: R[] = [
  ['dg-intenso','Dolce & Gabbana','The One Intenso','#0a0a0a','#c0c0c0','Eau de Parfum','Various',2014,['Basil','Pimento','Bergamot'],['Tobacco','Incense'],['Musk','Amber','Oud']],
];

// ─── MAISON MARGIELA EXTRA ────────────────────────────────────────────────
const MARGIELA_MORE: R[] = [
  ['mm-sailing-day','Maison Margiela','Sailing Day','#001428','#6090c8','Eau de Toilette','Honorine Blanc',2017,['Sea Notes','Bergamot','Lemon'],['Jasmine','Cedar'],['Musk','Sandalwood','Driftwood']],
];

// ─── Merge and export ──────────────────────────────────────────────────────
export const EXTENDED_FRAGRANCES: Fragrance[] = [
  ...expand(ARMAF),
  ...expand(AJMAL),
  ...expand(ZIMAYA),
  ...expand(ORIENTICA),
  ...expand(AL_REHAB),
  ...expand(CHANEL),
  ...expand(GUERLAIN),
  ...expand(PRADA),
  ...expand(HERMES),
  ...expand(RABANNE),
  ...expand(INITIO),
  ...expand(MONTALE),
  ...expand(NISHANE),
  ...expand(MARGIELA_EXT),
  ...expand(LE_LABO),
  ...expand(BYREDO),
  ...expand(PENHALIGONS),
  ...expand(GIVENCHY),
  ...expand(MUGLER_EXT),
  ...expand(KAYALI),
  ...expand(BURBERRY),
  ...expand(MAISON_CRIVELLI),
  ...expand(AL_HARAMAIN),
  ...expand(RASASI),
  ...expand(PARIS_CORNER),
  ...expand(KHADLAJ),
  ...expand(MAISON_ALHAMBRA),
  ...expand(ZOOLOGIST),
  ...expand(EX_NIHILO),
  ...expand(ACQUA_DI_PARMA),
  ...expand(RALPH_LAUREN),
  ...expand(HUGO_BOSS),
  ...expand(LATTAFA),
  ...expand(AFNAN),
  ...expand(SWISS_ARABIAN),
  ...expand(AMOUAGE_EXT),
  ...expand(MATIERE_PREMIERE),
  ...expand(ROJA_PARFUMS),
  ...expand(KILIAN_EXT),
  ...expand(MFK_EXT),
  ...expand(CREED_EXT),
  ...expand(TF_EXT),
  ...expand(XERJOFF_EXT),
  ...expand(DIOR_EXT),
  ...expand(PDM_EXT),
  ...expand(MANCERA_EXT),
  ...expand(ZARA),
  ...expand(ORTO_PARISI),
  ...expand(TOSKOVAT),
  ...expand(BESPOKE_LONDON),
  ...expand(RAYHAAN),
  ...expand(STREET_ORIGINS),
  ...expand(FRENCH_AVENUE),
  ...expand(MYKONOS),
  ...expand(ASSAF),
  ...expand(AHMED_AL_MAGHRIBI),
  ...expand(MAISON_ASRAR),
  ...expand(RASASI_EXT),
  ...expand(KHADLAJ_EXT),
  ...expand(DORSAY),
  ...expand(JPG_EXT),
  ...expand(VERSACE_EXT),
  ...expand(DG_EXT),
  ...expand(GA_EXT),
  ...expand(YSL_EXT),
  ...expand(GUERLAIN_EXT),
  ...expand(DG_MORE),
  ...expand(MARGIELA_MORE),
];
