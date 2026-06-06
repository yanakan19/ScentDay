/**
 * Brand → domain mapping for logo fetching.
 * LogoImage tries Google favicon service first, then Clearbit.
 */
export const BRAND_DOMAINS: Record<string, string> = {
  'Acqua di Parma':           'acquadiparma.com',
  'Afnan':                    'afnanperfumes.com',
  'Ahmed Al Maghribi':        'ahmedalmaghribi.com',
  'Ajmal':                    'ajmalperfume.com',
  'Al Haramain':              'alharamainfragrances.com',
  'Al-Rehab':                 'al-rehab.com',
  'Amouage':                  'amouage.com',
  'Armaf':                    'armaf.com',
  'Assaf':                    'assafperfumes.com',
  'Avon':                     'avon.com',
  'Bespoke London':           'bespokelondon.com',
  'Burberry':                 'burberry.com',
  'Byredo':                   'byredo.com',
  'Chanel':                   'chanel.com',
  'Creed':                    'creedfragrances.com',
  "D'Orsay":                  'dorsay.fr',
  'Dior':                     'dior.com',
  'Dolce & Gabbana':          'dolcegabbana.com',
  'Ex Nihilo':                'exnihiloparis.com',
  'French Avenue':            'frenchavenue.com',
  'Giorgio Armani':           'armani.com',
  'Givenchy':                 'givenchy.com',
  'Gucci':                    'gucci.com',
  'Guerlain':                 'guerlain.com',
  'Hermès':                   'hermes.com',
  'Hugo Boss':                'hugoboss.com',
  'Initio':                   'initio-parfums-prives.com',
  'Jean Paul Gaultier':       'jeanpaulgaultier.com',
  'Kayali':                   'kayali.com',
  'Khadlaj':                  'khadlajperfumes.com',
  'Kilian':                   'bykilian.com',
  'Lancome':                  'lancome.com',
  'Lattafa':                  'lattafa.com',
  'Le Labo':                  'lelabofragrances.com',
  'Maison Alhambra':          'maisonalhambra.com',
  'Maison Asrar':             'maisonasrar.com',
  'Maison Crivelli':          'maisoncrivelli.com',
  'Maison Francis Kurkdjian': 'mfk.com',
  'Maison Margiela':          'maisonmargiela.com',
  'Mancera':                  'manceraparfums.com',
  'Matiere Premiere':         'matierepremiereofficial.com',
  'Montale':                  'montale.com',
  'Montblanc':                'montblanc.com',
  'Mugler':                   'mugler.com',
  'Mykonos':                  'mykonosfragrances.com',
  'Next':                     'next.co.uk',
  'Nishane':                  'nishane.com',
  'Orientica':                'orientica.com',
  'Orto Parisi':              'ortoparisi.com',
  'Paris Corner':             'pariscorner.com',
  'Parfums de Marly':         'parfumsdemarly.com',
  "Penhaligon's":             'penhaligons.com',
  'Prada':                    'prada.com',
  'Rabanne':                  'rabanne.com',
  'Ralph Lauren':             'ralphlauren.com',
  'Rasasi':                   'rasasi.com',
  'Rayhaan':                  'rayhaanperfumes.com',
  'Roja Parfums':             'rojaparfums.com',
  'Selfridges':               'selfridges.com',
  'Street Origins':           'streetorigins.com',
  'Swiss Arabian':            'swissarabian.com',
  'Tom Ford':                 'tomford.com',
  "Toskovat'":                'toskovat.com',
  'Versace':                  'versace.com',
  'Xerjoff':                  'xerjoff.com',
  'Yves Saint Laurent':       'yslbeauty.com',
  'Zara':                     'zara.com',
  'Zimaya':                   'zimaya.com',
  'Zoologist':                'zoologistperfumes.com',
};

/**
 * Returns an ordered list of logo URL candidates to try (most reliable first).
 * The LogoImage component tries them in order, falling back to initials on failure.
 */
export function brandLogoUris(brand: string): string[] {
  const domain = BRAND_DOMAINS[brand];
  if (!domain) return [];
  return [
    `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=64`,
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
