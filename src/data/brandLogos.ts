/**
 * Brand → domain mapping for logo fetching via Clearbit.
 * Usage: logoUri(BRAND_DOMAINS['Dior']) → https://logo.clearbit.com/dior.com
 */
export const BRAND_DOMAINS: Record<string, string> = {
  'Acqua di Parma':         'acquadiparma.com',
  'Afnan':                  'afnanperfumes.com',
  'Ahmed Al Maghribi':      'ahmedalmaghribi.com',
  'Al Haramain':            'alharamainfragrances.com',
  'Amouage':                'amouage.com',
  'Assaf':                  'assafperfumes.com',
  'Avon':                   'avon.com',
  'Bespoke London':         'bespokelondon.com',
  'Burberry':               'burberry.com',
  'Chanel':                 'chanel.com',
  'Creed':                  'creedfragrances.com',
  "D'Orsay":                'dorsay.fr',
  'Dior':                   'dior.com',
  'Dolce & Gabbana':        'dolcegabbana.com',
  'Ex Nihilo':              'exnihiloparis.com',
  'French Avenue':          'frenchavenue.com',
  'Giorgio Armani':         'armani.com',
  'Givenchy':               'givenchy.com',
  'Gucci':                  'gucci.com',
  'Guerlain':               'guerlain.com',
  'Jean Paul Gaultier':     'jeanpaulgaultier.com',
  'Kayali':                 'kayali.com',
  'Khadlaj':                'khadlajperfumes.com',
  'Kilian':                 'bykilian.com',
  'Lancome':                'lancome.com',
  'Maison Alhambra':        'maisonalhambra.com',
  'Maison Asrar':           'maisonasrar.com',
  'Maison Crivelli':        'maisoncrivelli.com',
  'Maison Francis Kurkdjian': 'mfk.com',
  'Mancera':                'manceraparfums.com',
  'Matiere Premiere':       'matierepremiereofficial.com',
  'Montblanc':              'montblanc.com',
  'Mugler':                 'mugler.com',
  'Mykonos':                'mykonosfragrances.com',
  'Next':                   'next.co.uk',
  'Orto Parisi':            'ortoparisi.com',
  'Paris Corner':           'pariscorner.com',
  'Parfums de Marly':       'parfumsdemarly.com',
  'Prada':                  'prada.com',
  'Ralph Lauren':           'ralphlauren.com',
  'Rasasi':                 'rasasi.com',
  'Rayhaan':                'rayhaanperfumes.com',
  'Roja Parfums':           'rojaparfums.com',
  'Selfridges':             'selfridges.com',
  'Street Origins':         'streetorigins.com',
  'Swiss Arabian':          'swissarabian.com',
  'Tom Ford':               'tomford.com',
  "Toskovat'":              'toskovat.com',
  'Versace':                'versace.com',
  'Xerjoff':                'xerjoff.com',
  'Yves Saint Laurent':     'yslbeauty.com',
  'Zara':                   'zara.com',
  'Zoologist':              'zoologistperfumes.com',
};

/**
 * Returns an ordered list of logo URL candidates to try (most reliable first).
 * The LogoImage component tries them in order, falling back to initials on failure.
 */
export function brandLogoUris(brand: string): string[] {
  const domain = BRAND_DOMAINS[brand];
  if (!domain) return [];
  return [
    // Google's favicon service — used in Chrome, extremely reliable, returns square icons
    `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=64`,
    // Clearbit as secondary
    `https://logo.clearbit.com/${domain}`,
  ];
}

/** Convenience: first candidate or null */
export function brandLogoUri(brand: string): string | null {
  return brandLogoUris(brand)[0] ?? null;
}

/** Domain → logo URIs for retailer URLs (not brand names) */
export function retailerLogoUris(domain: string): string[] {
  if (!domain) return [];
  return [
    `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=64`,
    `https://logo.clearbit.com/${domain}`,
  ];
}
