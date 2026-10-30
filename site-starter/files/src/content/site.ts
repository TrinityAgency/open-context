// The site's facts live here, once. Pages and components read them; they never copy them.
// Every value below is sample data: replace it with your own before the site goes live.

type Link = { href: string; label: string };

export const SITE = {
  name: 'Nordlicht Immobilien',
  description: 'Beratung für Kauf, Verkauf und Vermietung von Immobilien.',
  /** The public origin without a trailing slash; SITE_URL in the environment overrides it. */
  url: 'https://example.com',
} as const;

/** The site's public origin: SITE_URL, or SITE.url when it is not set. */
export function siteUrl(): string {
  return (process.env.SITE_URL?.trim() || SITE.url).replace(/\/+$/, '');
}

export const CONTACT = {
  company: 'Nordlicht Immobilien',
  phoneDisplay: '+49 30 0000000',
  phoneHref: 'tel:+49300000000',
  email: 'hallo@example.com',
  street: 'Musterstraße 1',
  zipCity: '12345 Musterstadt',
} as const;

/** The main navigation, in this order. Each entry is a section of the home page until its own page exists. */
export const NAV: readonly Link[] = [
  { href: '/#leistungen', label: 'Leistungen' },
  { href: '/#ueber-uns', label: 'Über uns' },
  { href: '/#kontakt', label: 'Kontakt' },
];

/** The home page's text. */
export const HOME = {
  metaTitle: 'Immobilien kaufen, verkaufen und vermieten',
  title: 'Ihre Immobilie in guten Händen.',
  lead: 'Wir begleiten Sie vom ersten Gespräch bis zur Schlüsselübergabe.',
  services: {
    title: 'Leistungen',
    items: [
      { title: 'Verkaufen', text: 'Wir ermitteln den Wert Ihrer Immobilie und finden passende Käufer.' },
      { title: 'Kaufen', text: 'Wir suchen mit Ihnen das passende Objekt und prüfen die Unterlagen.' },
      { title: 'Vermieten', text: 'Wir finden Mieter und kümmern uns um Vertrag und Übergabe.' },
    ],
  },
  about: {
    title: 'Über uns',
    text: 'Nordlicht Immobilien ist ein kleines Team mit einem Ansprechpartner für jede Immobilie.',
  },
  contact: {
    title: 'Kontakt',
    text: 'Rufen Sie uns an oder schreiben Sie uns eine E-Mail.',
  },
} as const;

/** The page shown for an address that does not exist. */
export const NOT_FOUND = {
  title: 'Diese Seite gibt es nicht',
  text: 'Der Link ist vielleicht veraltet oder falsch geschrieben. Hier geht es weiter:',
} as const;

/**
 * Phrases that must not appear anywhere on the site; src/content/claims.test.ts checks every source file against
 * this list. The list (with the comments inside it) is the one place the phrases may be written: the test cuts it
 * out of this file before checking the rest, so keep examples inside the brackets.
 */
export const FORBIDDEN: RegExp[] = [
  // Put here what you never want to read on a page, one case-insensitive pattern per line:
  // a promise you cannot prove, an old address or phone number after a move, a product you no longer sell,
  // a competitor's name. For example:
  //   /kostenlos/i,
  //   /garantiert/i,
  // The list may stay empty.
];
