import type { Post } from '@/types';

/** Seed feed posts (faithful port; all fragIds exist in the catalog subset). */
export const SEED_POSTS: Post[] = [
  // ── GLOBAL ──
  { id: 1, user: 'olivia_scents', fragId: 'ysl-y-edp', scope: 'global', votes: 142, voted: false, photo: null, time: '1h',
    comments: [
      { id: 101, user: 'the_nose_uk', text: 'This is my signature scent, absolutely elite longevity.', votes: 12, voted: false, time: '45m' },
      { id: 102, user: 'marco_p', text: 'Agree — the cedar in the dry-down is incredibly refined.', votes: 8, voted: false, time: '30m' },
      { id: 103, user: 'niche_nina', text: 'Smells incredible on skin, better than in the bottle.', votes: 5, voted: false, time: '20m' },
    ] },
  { id: 2, user: 'scentgod_dubai', fragId: 'man-cedrat-boise', scope: 'global', votes: 98, voted: false, photo: null, time: '2h',
    comments: [
      { id: 104, user: 'fragnatic_fred', text: 'Cedrat Boise is such a crowd pleaser, projecting like crazy!', votes: 9, voted: false, time: '1h' },
      { id: 105, user: 'brumscents', text: 'The leather base is what sets it apart from other citrus scents.', votes: 6, voted: false, time: '50m' },
    ] },
  { id: 3, user: 'marco_p', fragId: 'man-red-tobacco', scope: 'global', votes: 76, voted: false, photo: null, time: '3h',
    comments: [
      { id: 106, user: 'scentsmith_uk', text: 'Red Tobacco is just ridiculously good in winter. A proper evening fragrance.', votes: 14, voted: false, time: '2h' },
      { id: 107, user: 'londoner_luke', text: 'The saffron opening is stunning. My wife keeps stealing mine.', votes: 11, voted: false, time: '1h30m' },
      { id: 108, user: 'perfume_pete', text: 'Lasts literally all day. Best Mancera in the line imo.', votes: 7, voted: false, time: '1h' },
    ] },
  { id: 4, user: 'niche_nina', fragId: 'ysl-libre', scope: 'global', votes: 54, voted: false, photo: null, time: '5h',
    comments: [
      { id: 109, user: 'olivia_scents', text: 'Libre is so underrated. That lavender-vanilla combo is genius.', votes: 8, voted: false, time: '4h' },
    ] },
  { id: 5, user: 'fragnatic_fred', fragId: 'man-black-gold', scope: 'global', votes: 31, voted: false, photo: null, time: '7h', comments: [] },
  // ── COUNTRY ──
  { id: 6, user: 'the_nose_uk', fragId: 'ysl-larose', scope: 'country', votes: 88, voted: false, photo: null, time: '1h',
    comments: [
      { id: 110, user: 'scentsmith_uk', text: 'Black Opium is one of the most recognisable scents in the UK honestly.', votes: 15, voted: false, time: '45m' },
      { id: 111, user: 'perfume_pete', text: 'Coffee note on this is so well done, not synthetic at all.', votes: 9, voted: false, time: '30m' },
    ] },
  { id: 7, user: 'londoner_luke', fragId: 'man-roses-vanille', scope: 'country', votes: 62, voted: false, photo: null, time: '2h',
    comments: [
      { id: 112, user: 'fragrance_faye', text: 'Roses Vanille is the one that got me into Mancera. Still a favourite.', votes: 11, voted: false, time: '1h30m' },
      { id: 113, user: 'coventry_carl', text: 'Does anyone know a good dupe for this? The price is eye-watering.', votes: 4, voted: false, time: '1h' },
    ] },
  { id: 8, user: 'fragrance_faye', fragId: 'man-aoud-cafe', scope: 'country', votes: 44, voted: false, photo: null, time: '4h',
    comments: [
      { id: 114, user: 'londoner_luke', text: 'The coffee and oud combo is genuinely addictive. All day wear.', votes: 7, voted: false, time: '3h' },
    ] },
  { id: 9, user: 'scentsmith_uk', fragId: 'ysl-myslf', scope: 'country', votes: 29, voted: false, photo: null, time: '6h',
    comments: [
      { id: 115, user: 'the_nose_uk', text: 'MYSLF is YSL reclaiming their masculine crown. Brilliant fragrance.', votes: 10, voted: false, time: '5h' },
      { id: 116, user: 'notts_nose', text: 'The ambroxide in the base is very distinctive. Very wearable.', votes: 5, voted: false, time: '4h30m' },
    ] },
  { id: 10, user: 'perfume_pete', fragId: 'man-coco-vanille', scope: 'country', votes: 18, voted: false, photo: null, time: '8h', comments: [] },
  // ── LOCAL ──
  { id: 11, user: 'coventry_carl', fragId: 'man-cedrat-boise', scope: 'local', votes: 22, voted: false, photo: null, time: '30m',
    comments: [{ id: 117, user: 'mids_maya', text: 'Cedrat is massive round here! Good shout.', votes: 6, voted: false, time: '20m' }] },
  { id: 12, user: 'mids_maya', fragId: 'ysl-y-edp', scope: 'local', votes: 15, voted: false, photo: null, time: '1h',
    comments: [{ id: 118, user: 'leics_lloyd', text: 'YSL Y is such a safe but brilliant choice. No wrong occasion.', votes: 4, voted: false, time: '50m' }] },
  { id: 13, user: 'brumscents', fragId: 'man-red-tobacco', scope: 'local', votes: 11, voted: false, photo: null, time: '2h', comments: [] },
  { id: 14, user: 'notts_nose', fragId: 'man-roses-vanille', scope: 'local', votes: 7, voted: false, photo: null, time: '3h', comments: [] },
  { id: 15, user: 'leics_lloyd', fragId: 'ysl-libre', scope: 'local', votes: 4, voted: false, photo: null, time: '5h', comments: [] },
];
