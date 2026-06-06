import type { Fragrance } from '@/types';
import { EXTENDED_FRAGRANCES } from './fragrancesExtended';

/**
 * FRAGRANCE CATALOG (representative subset).
 *
 * This is a faithful port of a cross-section of the prototype's ~600-entry
 * dataset, covering many brands so brand lists, notes, recommendations and the
 * bottle renderer all have real content to work with.
 *
 * TODO (data): drop the remaining catalog entries straight into RAW_FRAGRANCES
 *   below — the shape is identical to the prototype. In production this whole
 *   module would be replaced by a fetch from your API (see services/api.ts).
 */
const RAW_FRAGRANCES: Fragrance[] = [
  // ── YVES SAINT LAURENT ──
  { id: 'ysl-myslf', brand: 'Yves Saint Laurent', name: 'MYSLF', color: '#1a1a1a', capColor: '#d4af37', trend: 2, concentration: 'Eau de Parfum', perfumer: 'Quentin Bisch', year: 2023, rating: 4.3, votes: 1284,
    notes: { top: ['Bergamot'], mid: ['Orange Blossom'], base: ['Patchouli', 'Ambrofix™ Woody'] },
    perf: { longevity: 4, projection: 3 }, season: { Spring: 55, Summer: 35, Autumn: 80, Winter: 70 }, time: { Morning: 60, Daytime: 65, Evening: 85, Night: 75 },
    buy: [{ vendor: 'YSL Beauty', tag: 'Official site', price: '£110', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: '£89', ic: '✅' }, { vendor: 'Amazon', tag: 'Verified retailer', price: '£94', ic: '📦' }] },
  { id: 'ysl-y-edp', brand: 'Yves Saint Laurent', name: 'Y Eau de Parfum', color: '#3a4d8f', capColor: '#c0c0c8', trend: 1, concentration: 'Eau de Parfum', perfumer: 'Dominique Ropion', year: 2018, rating: 4.4, votes: 2901,
    notes: { top: ['Apple', 'Ginger', 'Bergamot'], mid: ['Sage', 'Juniper Berries', 'Geranium'], base: ['Amberwood', 'Tonka Bean', 'Cedar'] },
    perf: { longevity: 4, projection: 4 }, season: { Spring: 70, Summer: 55, Autumn: 75, Winter: 65 }, time: { Morning: 70, Daytime: 75, Evening: 70, Night: 60 },
    buy: [{ vendor: 'YSL Beauty', tag: 'Official site', price: '£105', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: '£82', ic: '✅' }, { vendor: 'Notino', tag: 'Verified retailer', price: '£79', ic: '🧴' }] },
  { id: 'ysl-libre', brand: 'Yves Saint Laurent', name: 'Libre', color: '#e8e2d0', capColor: '#caa64a', trend: 3, concentration: 'Eau de Parfum', perfumer: 'Anne Flipo / Carlos Benaïm', year: 2019, rating: 4.2, votes: 3450,
    notes: { top: ['Lavender', 'Mandarin Orange', 'Black Currant'], mid: ['Lavender', 'Orange Blossom', 'Jasmine'], base: ['Madagascar Vanilla', 'Musk', 'Cedar'] },
    perf: { longevity: 4, projection: 4 }, season: { Spring: 75, Summer: 50, Autumn: 70, Winter: 65 }, time: { Morning: 55, Daytime: 60, Evening: 85, Night: 80 },
    buy: [{ vendor: 'YSL Beauty', tag: 'Official site', price: '£98', ic: '🏛️', official: true }, { vendor: 'Boots', tag: 'Verified retailer', price: '£81', ic: '✅' }, { vendor: 'Amazon', tag: 'Verified retailer', price: '£85', ic: '📦' }] },
  { id: 'ysl-larose', brand: 'Yves Saint Laurent', name: 'Black Opium', color: '#0c0c0c', capColor: '#caa64a', trend: 4, concentration: 'Eau de Parfum', perfumer: 'Nathalie Lorson / Marie Salamagne', year: 2014, rating: 4.1, votes: 5210,
    notes: { top: ['Pear', 'Pink Pepper', 'Orange Blossom'], mid: ['Coffee', 'Jasmine', 'Bitter Almond'], base: ['Vanilla', 'Patchouli', 'Cedar'] },
    perf: { longevity: 5, projection: 4 }, season: { Spring: 45, Summer: 30, Autumn: 80, Winter: 90 }, time: { Morning: 40, Daytime: 45, Evening: 85, Night: 90 },
    buy: [{ vendor: 'YSL Beauty', tag: 'Official site', price: '£102', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: '£78', ic: '✅' }, { vendor: 'Notino', tag: 'Verified retailer', price: '£74', ic: '🧴' }] },

  // ── MANCERA ──
  { id: 'man-cedrat-boise', brand: 'Mancera', name: 'Cedrat Boisé', color: '#1b3a2d', capColor: '#d4af37', trend: 5, concentration: 'Eau de Parfum', perfumer: 'Pierre Montale', year: 2012, rating: 4.6, votes: 8741,
    notes: { top: ['Sicilian Citrus', 'Blackcurrant', 'Cold Spices'], mid: ['Aquatic Jasmine', 'Patchouli Leaves'], base: ['Woody Notes', 'Leather', 'Oakmoss', 'Vanilla'] },
    perf: { longevity: 5, projection: 5 }, season: { Spring: 60, Summer: 50, Autumn: 85, Winter: 80 }, time: { Morning: 55, Daytime: 65, Evening: 85, Night: 80 },
    buy: [{ vendor: 'Mancera Paris', tag: 'Official site', price: '£145', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: '£119', ic: '✅' }, { vendor: 'Notino', tag: 'Verified retailer', price: '£112', ic: '🧴' }] },
  { id: 'man-roses-vanille', brand: 'Mancera', name: 'Roses Vanille', color: '#c9a0a0', capColor: '#e8d5c4', trend: 6, concentration: 'Eau de Parfum', perfumer: 'Pierre Montale', year: 2011, rating: 4.5, votes: 6203,
    notes: { top: ['Fresh Lemon Of Calabria'], mid: ['Turkish Delight', 'Rose'], base: ['Cedarwood', 'Intense Vanilla', 'White Musk'] },
    perf: { longevity: 5, projection: 4 }, season: { Spring: 70, Summer: 55, Autumn: 65, Winter: 60 }, time: { Morning: 60, Daytime: 70, Evening: 75, Night: 65 },
    buy: [{ vendor: 'Mancera Paris', tag: 'Official site', price: '£145', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: '£116', ic: '✅' }, { vendor: 'Notino', tag: 'Verified retailer', price: '£110', ic: '🧴' }] },
  { id: 'man-black-gold', brand: 'Mancera', name: 'Black Gold', color: '#0a0a0a', capColor: '#d4af37', trend: 7, concentration: 'Eau de Parfum', perfumer: 'Pierre Montale', year: 2015, rating: 4.4, votes: 4112,
    notes: { top: ['Citrus', 'Nepalese Oud', 'Lavender', 'Cinnamon', 'Nutmeg'], mid: ['Egyptian Jasmine', 'Violet', 'Rose', 'Patchouli'], base: ['Vetiver', 'Leather', 'Amber', 'White Musk'] },
    perf: { longevity: 5, projection: 4 }, season: { Spring: 40, Summer: 30, Autumn: 80, Winter: 90 }, time: { Morning: 35, Daytime: 40, Evening: 85, Night: 90 },
    buy: [{ vendor: 'Mancera Paris', tag: 'Official site', price: '£155', ic: '🏛️', official: true }, { vendor: 'Notino', tag: 'Verified retailer', price: '£128', ic: '🧴' }] },
  { id: 'man-red-tobacco', brand: 'Mancera', name: 'Red Tobacco', color: '#7a1f1f', capColor: '#c8a96e', trend: 8, concentration: 'Eau de Parfum', perfumer: 'Pierre Montale', year: 2015, rating: 4.5, votes: 5890,
    notes: { top: ['Saffron', 'Cinnamon', 'Incense', 'Nutmeg', 'White Peach'], mid: ['Patchouli Leaves', 'Delicate Jasmine'], base: ['Precious Tobacco', 'Amber', 'Woody Notes', 'Vetiver', 'Vanilla', 'White Musk'] },
    perf: { longevity: 5, projection: 5 }, season: { Spring: 30, Summer: 20, Autumn: 85, Winter: 95 }, time: { Morning: 30, Daytime: 35, Evening: 90, Night: 95 },
    buy: [{ vendor: 'Mancera Paris', tag: 'Official site', price: '£155', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: '£124', ic: '✅' }, { vendor: 'Notino', tag: 'Verified retailer', price: '£118', ic: '🧴' }] },
  { id: 'man-coco-vanille', brand: 'Mancera', name: 'Coco Vanille', color: '#f5e6c8', capColor: '#c8a96e', trend: 9, concentration: 'Eau de Parfum', perfumer: 'Pierre Montale', year: 2011, rating: 4.3, votes: 3871,
    notes: { top: ['Coconut', 'White Peach'], mid: ['Ylang-Ylang', 'Tiare Flower', 'Egyptian Jasmine'], base: ['Woody Notes', 'Vanilla Pods', 'White Musk'] },
    perf: { longevity: 4, projection: 3 }, season: { Spring: 65, Summer: 80, Autumn: 50, Winter: 40 }, time: { Morning: 65, Daytime: 75, Evening: 70, Night: 60 },
    buy: [{ vendor: 'Mancera Paris', tag: 'Official site', price: '£145', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: '£112', ic: '✅' }] },
  { id: 'man-aoud-cafe', brand: 'Mancera', name: 'Aoud Café', color: '#3b1e08', capColor: '#d4af37', trend: 10, concentration: 'Eau de Parfum', perfumer: 'Pierre Montale', year: 2012, rating: 4.4, votes: 4567,
    notes: { top: ['Peach', 'Blackcurrant', 'Bergamot'], mid: ['Amber', 'Floral Notes', 'Black Coffee'], base: ['Oud', 'Sweet Notes', 'White Musk'] },
    perf: { longevity: 5, projection: 4 }, season: { Spring: 40, Summer: 30, Autumn: 80, Winter: 85 }, time: { Morning: 40, Daytime: 45, Evening: 85, Night: 90 },
    buy: [{ vendor: 'Mancera Paris', tag: 'Official site', price: '£155', ic: '🏛️', official: true }, { vendor: 'Notino', tag: 'Verified retailer', price: '£126', ic: '🧴' }] },

  // ── DIOR ──
  { id: 'dior-sauvage-edt', brand: 'Dior', name: 'Sauvage EDT', color: '#1a2d3d', capColor: '#d4af37', trend: 84, concentration: 'Eau de Toilette', perfumer: 'François Demachy', year: 2015, rating: 4.7, votes: 18932,
    notes: { top: ['Calabrian Bergamot', 'Pepper'], mid: ['Sichuan Pepper', 'Lavender', 'Pink Pepper', 'Vetiver', 'Patchouli', 'Geranium', 'Elemi'], base: ['Ambroxan', 'Cedar', 'Labdanum'] },
    perf: { longevity: 5, projection: 4 }, season: { Spring: 70, Summer: 90, Autumn: 40, Winter: 25 }, time: { Morning: 75, Daytime: 85, Evening: 55, Night: 40 },
    buy: [{ vendor: 'Dior', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }, { vendor: 'JustMyLook', tag: 'Verified retailer', price: '£72', ic: '💄' }] },
  { id: 'dior-sauvage-edp', brand: 'Dior', name: 'Sauvage EDP', color: '#2d0a0a', capColor: '#c0c0c8', trend: 83, concentration: 'Eau de Parfum', perfumer: 'François Demachy', year: 2018, rating: 4.6, votes: 12450,
    notes: { top: ['Bergamot'], mid: ['Sichuan Pepper', 'Lavender', 'Star Anise', 'Nutmeg'], base: ['Ambroxan', 'Vanilla'] },
    perf: { longevity: 5, projection: 3 }, season: { Spring: 70, Summer: 90, Autumn: 40, Winter: 25 }, time: { Morning: 75, Daytime: 85, Evening: 55, Night: 40 },
    buy: [{ vendor: 'Dior', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }, { vendor: 'JustMyLook', tag: 'Verified retailer', price: '£76', ic: '💄' }] },
  { id: 'dior-homme-intense', brand: 'Dior', name: 'Dior Homme Intense', color: '#3d0000', capColor: '#d4af37', trend: 68, concentration: 'Eau de Parfum', perfumer: 'François Demachy', year: 2011, rating: 4.5, votes: 4103,
    notes: { top: ['Lavender'], mid: ['Iris', 'Ambrette', 'Pear'], base: ['Virginia Cedar', 'Vetiver'] },
    perf: { longevity: 4, projection: 3 }, season: { Spring: 80, Summer: 65, Autumn: 55, Winter: 45 }, time: { Morning: 65, Daytime: 70, Evening: 80, Night: 70 },
    buy: [{ vendor: 'Dior', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }] },
  { id: 'dior-oud-ispahan', brand: 'Dior', name: 'Oud Ispahan', color: '#1a1a2d', capColor: '#c0c0c8', trend: 79, concentration: 'Eau de Parfum', perfumer: 'François Demachy', year: 2012, rating: 4.6, votes: 3456,
    notes: { top: ['Labdanum'], mid: ['Patchouli', 'Rose', 'Saffron'], base: ['Oud', 'Sandalwood', 'Cedar'] },
    perf: { longevity: 5, projection: 5 }, season: { Spring: 35, Summer: 20, Autumn: 85, Winter: 95 }, time: { Morning: 30, Daytime: 35, Evening: 90, Night: 95 },
    buy: [{ vendor: 'Dior', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }] },

  // ── PARFUMS DE MARLY ──
  { id: 'pdm-layton', brand: 'Parfums de Marly', name: 'Layton', color: '#3d0a1a', capColor: '#e8d5c4', trend: 104, concentration: 'Eau de Parfum', perfumer: 'Hamid Merati-Kashani', year: 2016, rating: 4.8, votes: 14532,
    notes: { top: ['Apple', 'Bergamot', 'Lavender'], mid: ['Jasmine', 'Violet', 'Geranium'], base: ['Vanilla', 'Pepper', 'Guaiac Wood', 'Patchouli'] },
    perf: { longevity: 5, projection: 4 }, season: { Spring: 70, Summer: 55, Autumn: 80, Winter: 75 }, time: { Morning: 65, Daytime: 70, Evening: 80, Night: 70 },
    buy: [{ vendor: 'Parfums de Marly', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }, { vendor: 'JustMyLook', tag: 'Verified retailer', price: '£145', ic: '💄' }] },
  { id: 'pdm-delina', brand: 'Parfums de Marly', name: 'Delina', color: '#0a2d2d', capColor: '#d4af37', trend: 94, concentration: 'Eau de Parfum', perfumer: 'Quentin Bisch', year: 2017, rating: 4.7, votes: 9876,
    notes: { top: ['Rhubarb', 'Lychee', 'Bergamot Essence'], mid: ['Turkish Rose', 'Peony', 'Vanilla'], base: ['Cashmeran', 'Musk', 'Vetiver'] },
    perf: { longevity: 5, projection: 3 }, season: { Spring: 75, Summer: 60, Autumn: 70, Winter: 60 }, time: { Morning: 70, Daytime: 75, Evening: 75, Night: 65 },
    buy: [{ vendor: 'Parfums de Marly', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }, { vendor: 'JustMyLook', tag: 'Verified retailer', price: '£148', ic: '💄' }] },
  { id: 'pdm-herod', brand: 'Parfums de Marly', name: 'Herod', color: '#2d1a00', capColor: '#c8a96e', trend: 102, concentration: 'Eau de Parfum', perfumer: 'Quentin Bisch', year: 2012, rating: 4.6, votes: 4567,
    notes: { top: ['Cinnamon', 'Pepper'], mid: ['Tobacco Leaf', 'Incense', 'Ciste', 'Osmanthus'], base: ['Vanilla Pods', 'Musk', 'Patchouli', 'Woody Accord', 'Vetiver'] },
    perf: { longevity: 5, projection: 5 }, season: { Spring: 35, Summer: 20, Autumn: 85, Winter: 95 }, time: { Morning: 30, Daytime: 35, Evening: 90, Night: 95 },
    buy: [{ vendor: 'Parfums de Marly', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }, { vendor: 'JustMyLook', tag: 'Verified retailer', price: '£140', ic: '💄' }] },
  { id: 'pdm-pegasus', brand: 'Parfums de Marly', name: 'Pegasus', color: '#1a0d2d', capColor: '#d4af37', trend: 110, concentration: 'Eau de Parfum', perfumer: 'Quentin Bisch', year: 2011, rating: 4.6, votes: 5678,
    notes: { top: ['Cypress', 'Bergamot', 'Heliotrope'], mid: ['Jasmine', 'Lavender', 'Bitter Almond'], base: ['Vanilla', 'Amber', 'Sandalwood'] },
    perf: { longevity: 5, projection: 4 }, season: { Spring: 70, Summer: 55, Autumn: 75, Winter: 70 }, time: { Morning: 65, Daytime: 70, Evening: 80, Night: 70 },
    buy: [{ vendor: 'Parfums de Marly', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }] },

  // ── XERJOFF ──
  { id: 'xer-naxos', brand: 'Xerjoff', name: 'Naxos', color: '#003a4a', capColor: '#c0e0d0', trend: 319, concentration: 'Eau de Parfum', perfumer: 'Chris Maurice', year: 2015, rating: 4.7, votes: 8765,
    notes: { top: ['Lavender', 'Bergamot', 'Lemon'], mid: ['Honey', 'Cinnamon', 'Cashmeran', 'Jasmine Sambac'], base: ['Tobacco Leaf', 'Vanilla', 'Tonka Bean'] },
    perf: { longevity: 5, projection: 5 }, season: { Spring: 50, Summer: 35, Autumn: 85, Winter: 90 }, time: { Morning: 40, Daytime: 45, Evening: 90, Night: 90 },
    buy: [{ vendor: 'Xerjoff', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }] },
  { id: 'xer-erba-pura', brand: 'Xerjoff', name: 'Erba Pura', color: '#003a4a', capColor: '#c0e0d0', trend: 310, concentration: 'Eau de Parfum', perfumer: 'Various', year: 2018, rating: 4.5, votes: 4321,
    notes: { top: ['Orange', 'Lemon', 'Calabrian Bergamot'], mid: ['Fruity Notes'], base: ['White Musk', 'Amber', 'Vanilla'] },
    perf: { longevity: 5, projection: 4 }, season: { Spring: 75, Summer: 90, Autumn: 45, Winter: 30 }, time: { Morning: 80, Daytime: 85, Evening: 55, Night: 40 },
    buy: [{ vendor: 'Xerjoff', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Notino', tag: 'Verified retailer', price: 'See site', ic: '🧴' }] },
  { id: 'xer-alexandria-ii', brand: 'Xerjoff', name: 'Alexandria II', color: '#1a0a00', capColor: '#d4af37', trend: 302, concentration: 'Eau de Parfum', perfumer: 'Various', year: 2012, rating: 4.6, votes: 5432,
    notes: { top: ['Lavender', 'Palisander Rosewood', 'Cinnamon', 'Apple'], mid: ['Lily of the Valley', 'Rose', 'Cedar'], base: ['Amber', 'Musk', 'Oud', 'Sandalwood', 'Vanilla'] },
    perf: { longevity: 5, projection: 5 }, season: { Spring: 35, Summer: 20, Autumn: 85, Winter: 95 }, time: { Morning: 30, Daytime: 35, Evening: 90, Night: 95 },
    buy: [{ vendor: 'Xerjoff', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }] },

  // ── AMOUAGE ──
  { id: 'am-interlude-man', brand: 'Amouage', name: 'Interlude Man', color: '#2d1a00', capColor: '#d4af37', trend: 411, concentration: 'Eau de Parfum', perfumer: 'Pierre Negrin', year: 2012, rating: 4.8, votes: 6789,
    notes: { top: ['Bergamot', 'Oregano', 'Pimento Berry'], mid: ['Amber', 'Frankincense', 'Cistus', 'Opoponax'], base: ['Leather', 'Agarwood Smoke', 'Patchouli', 'Sandalwood'] },
    perf: { longevity: 5, projection: 5 }, season: { Spring: 35, Summer: 20, Autumn: 85, Winter: 95 }, time: { Morning: 30, Daytime: 35, Evening: 90, Night: 95 },
    buy: [{ vendor: 'Amouage', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }] },
  { id: 'am-gold-man', brand: 'Amouage', name: 'Gold Man', color: '#2d1a00', capColor: '#d4af37', trend: 406, concentration: 'Eau de Parfum', perfumer: 'Guy Robert', year: 1983, rating: 4.8, votes: 5678,
    notes: { top: ['Rose', 'Lily Of The Valley', 'Frankincense'], mid: ['Myrrh', 'Orris', 'Jasmine'], base: ['Ambergris', 'Civet', 'Musk', 'Cedarwood', 'Sandalwood', 'Patchouli', 'Oakmoss'] },
    perf: { longevity: 5, projection: 5 }, season: { Spring: 35, Summer: 20, Autumn: 85, Winter: 95 }, time: { Morning: 30, Daytime: 35, Evening: 90, Night: 95 },
    buy: [{ vendor: 'Amouage', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }] },

  // ── TOM FORD ──
  { id: 'tf-tobacco-vanille', brand: 'Tom Ford', name: 'Tobacco Vanille', color: '#1a0800', capColor: '#c8a020', trend: 467, concentration: 'Eau de Parfum', perfumer: 'Olivier Gillotin', year: 2007, rating: 4.8, votes: 12450,
    notes: { top: ['Tobacco Leaf', 'Spicy Notes'], mid: ['Vanilla', 'Cacao', 'Tonka Bean', 'Tobacco Blossom'], base: ['Dried Fruits', 'Woody Notes'] },
    perf: { longevity: 5, projection: 5 }, season: { Spring: 35, Summer: 20, Autumn: 85, Winter: 95 }, time: { Morning: 30, Daytime: 35, Evening: 90, Night: 95 },
    buy: [{ vendor: 'Tom Ford', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }] },
  { id: 'tf-oud-wood', brand: 'Tom Ford', name: 'Oud Wood', color: '#0d0800', capColor: '#d4af37', trend: 464, concentration: 'Eau de Parfum', perfumer: 'Richard Herpin', year: 2007, rating: 4.7, votes: 8765,
    notes: { top: ['Rosewood', 'Cardamom', 'Chinese Pepper'], mid: ['Oud', 'Sandalwood', 'Vetiver'], base: ['Tonka Bean', 'Vanilla', 'Amber'] },
    perf: { longevity: 5, projection: 5 }, season: { Spring: 35, Summer: 20, Autumn: 85, Winter: 95 }, time: { Morning: 30, Daytime: 35, Evening: 90, Night: 95 },
    buy: [{ vendor: 'Tom Ford', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }] },
  { id: 'tf-lost-cherry', brand: 'Tom Ford', name: 'Lost Cherry', color: '#3d0010', capColor: '#e8a0a0', trend: 459, concentration: 'Eau de Parfum', perfumer: 'Louise Turner', year: 2018, rating: 4.7, votes: 6789,
    notes: { top: ['Sour Cherry', 'Bitter Almond', 'Liquor'], mid: ['Plum', 'Turkish Rose', 'Jasmine Sambac'], base: ['Tonka Bean', 'Vanilla', 'Peru Balsam', 'Cinnamon', 'Sandalwood'] },
    perf: { longevity: 5, projection: 4 }, season: { Spring: 50, Summer: 35, Autumn: 80, Winter: 90 }, time: { Morning: 40, Daytime: 45, Evening: 85, Night: 90 },
    buy: [{ vendor: 'Tom Ford', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }] },

  // ── MAISON FRANCIS KURKDJIAN ──
  { id: 'mfk-br540-edp', brand: 'Maison Francis Kurkdjian', name: 'Baccarat Rouge 540 EDP', color: '#f5f0e0', capColor: '#d0b890', trend: 703, concentration: 'Eau de Parfum', perfumer: 'Francis Kurkdjian', year: 2015, rating: 4.9, votes: 28450,
    notes: { top: ['Saffron', 'Jasmine'], mid: ['Amberwood', 'Ambergris'], base: ['Fir Resin', 'Cedar'] },
    perf: { longevity: 5, projection: 5 }, season: { Spring: 80, Summer: 65, Autumn: 55, Winter: 45 }, time: { Morning: 65, Daytime: 70, Evening: 80, Night: 70 },
    buy: [{ vendor: 'Maison Francis Kurkdjian', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }] },
  { id: 'mfk-oud-satin', brand: 'Maison Francis Kurkdjian', name: 'Oud Satin Mood EDP', color: '#f0ede8', capColor: '#c8b8a0', trend: 708, concentration: 'Eau de Parfum', perfumer: 'Francis Kurkdjian', year: 2015, rating: 4.7, votes: 5432,
    notes: { top: ['Violet', 'Geranium'], mid: ['Damask Rose', 'Turkish Rose'], base: ['Agarwood (Oud)', 'Vanilla', 'Amber'] },
    perf: { longevity: 5, projection: 5 }, season: { Spring: 35, Summer: 20, Autumn: 85, Winter: 95 }, time: { Morning: 30, Daytime: 35, Evening: 90, Night: 95 },
    buy: [{ vendor: 'Maison Francis Kurkdjian', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }] },

  // ── CREED ──
  { id: 'cr-aventus', brand: 'Creed', name: 'Aventus', color: '#f5f0e8', capColor: '#d4af37', trend: 920, concentration: 'Eau de Parfum', perfumer: 'Olivier Creed', year: 2010, rating: 4.8, votes: 25432,
    notes: { top: ['Pineapple', 'Bergamot', 'Blackcurrant', 'Apple'], mid: ['Birch', 'Patchouli', 'Moroccan Jasmine', 'Rose'], base: ['Musk', 'Oakmoss', 'Ambergris', 'Vanilla'] },
    perf: { longevity: 5, projection: 4 }, season: { Spring: 75, Summer: 90, Autumn: 45, Winter: 30 }, time: { Morning: 80, Daytime: 85, Evening: 55, Night: 40 },
    buy: [{ vendor: 'Creed', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }] },
  { id: 'cr-green-irish', brand: 'Creed', name: 'Green Irish Tweed', color: '#f5f0e8', capColor: '#d4af37', trend: 923, concentration: 'Eau de Parfum', perfumer: 'Olivier Creed', year: 1985, rating: 4.6, votes: 12450,
    notes: { top: ['Lemon Verbena', 'Iris'], mid: ['Violet Leaf'], base: ['Ambergris', 'Sandalwood'] },
    perf: { longevity: 5, projection: 4 }, season: { Spring: 75, Summer: 90, Autumn: 45, Winter: 30 }, time: { Morning: 80, Daytime: 85, Evening: 55, Night: 40 },
    buy: [{ vendor: 'Creed', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }] },

  // ── GIORGIO ARMANI ──
  { id: 'ga-adg-edt', brand: 'Giorgio Armani', name: 'Acqua di Giò EDT', color: '#0a0a0a', capColor: '#c0c0c0', trend: 750, concentration: 'Eau de Toilette', perfumer: 'Alberto Morillas', year: 1996, rating: 4.4, votes: 18432,
    notes: { top: ['Lime', 'Lemon', 'Bergamot', 'Jasmine', 'Orange'], mid: ['Sea Notes', 'Jasmine', 'Calone', 'Peach', 'Rosemary'], base: ['White Musk', 'Cedar', 'Oakmoss', 'Patchouli'] },
    perf: { longevity: 5, projection: 4 }, season: { Spring: 75, Summer: 90, Autumn: 45, Winter: 30 }, time: { Morning: 80, Daytime: 85, Evening: 55, Night: 40 },
    buy: [{ vendor: 'Giorgio Armani', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }] },

  // ── VERSACE ──
  { id: 'ver-eros-edt', brand: 'Versace', name: 'Eros EDT', color: '#0a0a0a', capColor: '#d0c0a0', trend: 1125, concentration: 'Eau de Toilette', perfumer: 'Aurelien Guichard', year: 2012, rating: 4.5, votes: 12450,
    notes: { top: ['Mint', 'Green Apple', 'Lemon'], mid: ['Tonka Bean', 'Ambroxan', 'Geranium'], base: ['Madagascar Vanilla', 'Virginian Cedar', 'Vetiver'] },
    perf: { longevity: 5, projection: 3 }, season: { Spring: 75, Summer: 90, Autumn: 45, Winter: 30 }, time: { Morning: 80, Daytime: 85, Evening: 55, Night: 40 },
    buy: [{ vendor: 'Versace', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }] },

  // ── JEAN PAUL GAULTIER ──
  { id: 'jpg-le-male', brand: 'Jean Paul Gaultier', name: 'Le Male', color: '#1a0a00', capColor: '#d4af37', trend: 834, concentration: 'Eau de Toilette', perfumer: 'Francis Kurkdjian', year: 1995, rating: 4.5, votes: 18765,
    notes: { top: ['Mint', 'Lavender', 'Artemisia', 'Bergamot'], mid: ['Cinnamon', 'Cumin', 'Orange Blossom'], base: ['Vanilla', 'Tonka Bean', 'Sandalwood', 'Cedar'] },
    perf: { longevity: 4, projection: 5 }, season: { Spring: 75, Summer: 90, Autumn: 45, Winter: 30 }, time: { Morning: 80, Daytime: 85, Evening: 55, Night: 40 },
    buy: [{ vendor: 'Jean Paul Gaultier', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }] },

  // ── MUGLER ──
  { id: 'mug-angel', brand: 'Mugler', name: 'Angel EDP', color: '#0a0a0a', capColor: '#c0c0c0', trend: 1184, concentration: 'Eau de Parfum', perfumer: 'Olivier Cresp', year: 1992, rating: 4.6, votes: 18765,
    notes: { top: ['Cotton Candy', 'Coconut', 'Cassis', 'Melon', 'Jasmine', 'Bergamot'], mid: ['Honey', 'Blackberry', 'Plum', 'Orchid', 'Peach', 'Rose'], base: ['Patchouli', 'Chocolate', 'Caramel', 'Vanilla', 'Tonka Bean', 'Amber'] },
    perf: { longevity: 5, projection: 4 }, season: { Spring: 50, Summer: 35, Autumn: 80, Winter: 90 }, time: { Morning: 40, Daytime: 45, Evening: 85, Night: 90 },
    buy: [{ vendor: 'Mugler', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }] },

  // ── KILIAN ──
  { id: 'kil-angels-share', brand: 'Kilian', name: "Angels' Share", color: '#0a0800', capColor: '#d4af37', trend: 760, concentration: 'Eau de Parfum', perfumer: 'Benoist Lapouza', year: 2020, rating: 4.7, votes: 8765,
    notes: { top: ['Cognac'], mid: ['Cinnamon', 'Tonka Bean', 'Oak'], base: ['Praline', 'Vanilla', 'Sandalwood'] },
    perf: { longevity: 4, projection: 5 }, season: { Spring: 35, Summer: 20, Autumn: 85, Winter: 95 }, time: { Morning: 30, Daytime: 35, Evening: 90, Night: 95 },
    buy: [{ vendor: 'Kilian', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }] },

  // ── MAISON MARGIELA ──
  { id: 'mm-jazz-club', brand: 'Maison Margiela', name: 'Jazz Club', color: '#0a0a0a', capColor: '#e8e8e0', trend: 1425, concentration: 'Eau de Toilette', perfumer: 'Aliénor Massenet', year: 2013, rating: 4.6, votes: 9876,
    notes: { top: ['Pink Pepper', 'Neroli', 'Lemon'], mid: ['Rum', 'Java Vetiver', 'Clary Sage'], base: ['Tobacco Leaf', 'Vanilla Bean', 'Styrax'] },
    perf: { longevity: 5, projection: 5 }, season: { Spring: 35, Summer: 20, Autumn: 85, Winter: 95 }, time: { Morning: 30, Daytime: 35, Evening: 90, Night: 95 },
    buy: [{ vendor: 'Maison Margiela', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }] },

  // ── DOLCE & GABBANA ──
  { id: 'dg-light-blue-m', brand: 'Dolce & Gabbana', name: 'Light Blue Pour Homme', color: '#001428', capColor: '#80c0e8', trend: 1339, concentration: 'Eau de Toilette', perfumer: 'Olivier Cresp', year: 2007, rating: 4.3, votes: 8765,
    notes: { top: ['Grapefruit', 'Bergamot', 'Mandarin'], mid: ['Pepper', 'Rosemary', 'Rosewood'], base: ['Musk', 'Incense', 'Oakmoss'] },
    perf: { longevity: 4, projection: 5 }, season: { Spring: 75, Summer: 90, Autumn: 45, Winter: 30 }, time: { Morning: 80, Daytime: 85, Evening: 55, Night: 40 },
    buy: [{ vendor: 'Dolce & Gabbana', tag: 'Official site', price: 'POA', ic: '🏛️', official: true }, { vendor: 'Beautybase', tag: 'Verified retailer', price: 'See site', ic: '✅' }] },
];

/** Title-case helper (the prototype applies this to every note at runtime). */
function toTitleCase(str: string): string {
  if (!str) return str;
  return str
    .split(' ')
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

/** Processed, exported catalog — notes normalised to Title Case. */
const CORE_FRAGRANCES: Fragrance[] = RAW_FRAGRANCES.map((f) => ({
  ...f,
  notes: {
    top: f.notes.top.map(toTitleCase),
    mid: f.notes.mid.map(toTitleCase),
    base: f.notes.base.map(toTitleCase),
  },
}));

export const FRAGRANCES: Fragrance[] = [...CORE_FRAGRANCES, ...EXTENDED_FRAGRANCES];

export function fragById(id: string): Fragrance | undefined {
  return FRAGRANCES.find((f) => f.id === id);
}
