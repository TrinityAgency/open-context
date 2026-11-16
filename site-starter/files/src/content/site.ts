// The site's facts live here, once. Pages and components read them; they never copy them.
// Every value below is sample data: replace it with your own before the site goes live.
// Text comes in both languages (`en`, `de`); src/content/locale.ts picks one. Facts (name, address) are not text:
// they exist once.
import type { Locale } from './locale';

type Link = { href: string; label: string };

export const SITE = {
  name: 'Samplework Inc.',
  description: 'Clear advice and careful work, from the first conversation to the finished result.',
  /** The public origin without a trailing slash; SITE_URL in the environment overrides it. */
  url: 'https://example.com',
} as const;

/** The site's public origin: SITE_URL, or SITE.url when it is not set. */
export function siteUrl(): string {
  return (process.env.SITE_URL?.trim() || SITE.url).replace(/\/+$/, '');
}

export const CONTACT = {
  company: 'Samplework Inc.',
  phoneDisplay: '+1 555 0100',
  phoneHref: 'tel:+15550100',
  email: 'hello@example.com',
  street: '1 Sample Street',
  zipCity: 'Sampletown 12345',
} as const;

/**
 * The main navigation, in this order. Each entry is a section of the home page until its own page exists; then point
 * it at the page (and list the page in src/app/sitemap.ts).
 */
export const NAV: Record<Locale, readonly Link[]> = {
  en: [
    { href: '/#services', label: 'Services' },
    { href: '/#about', label: 'About' },
    { href: '/#contact', label: 'Contact' },
  ],
  de: [
    { href: '/#services', label: 'Leistungen' },
    { href: '/#about', label: 'Über uns' },
    { href: '/#contact', label: 'Kontakt' },
  ],
};

type HomeText = {
  metaTitle: string;
  title: string;
  lead: string;
  services: { title: string; items: readonly { title: string; text: string }[] };
  about: { title: string; text: string };
  contact: { title: string; text: string };
};

/** The home page's text. The section ids (services, about, contact) are the targets of NAV. */
export const HOME: Record<Locale, HomeText> = {
  en: {
    metaTitle: 'Clear advice and careful work',
    title: 'Work done well, from start to finish.',
    lead: 'We listen first, plan with you and deliver what we agreed.',
    services: {
      title: 'Services',
      items: [
        { title: 'Advice', text: 'We look at where you stand and what you need, and say plainly what we would do.' },
        { title: 'Planning', text: 'We agree on the steps, the dates and the cost before any work starts.' },
        { title: 'Delivery', text: 'We do the work, keep you informed and hand over everything you need.' },
      ],
    },
    about: {
      title: 'About us',
      text: 'A small team, with one person you can call for every question.',
    },
    contact: {
      title: 'Contact',
      text: 'Call us or send us an email.',
    },
  },
  de: {
    metaTitle: 'Klare Beratung und sorgfältige Arbeit',
    title: 'Gute Arbeit, vom Anfang bis zum Ende.',
    lead: 'Wir hören zuerst zu, planen mit Ihnen und liefern, was wir vereinbart haben.',
    services: {
      title: 'Leistungen',
      items: [
        { title: 'Beratung', text: 'Wir sehen uns an, wo Sie stehen und was Sie brauchen, und sagen klar, was wir tun würden.' },
        { title: 'Planung', text: 'Wir vereinbaren Schritte, Termine und Kosten, bevor die Arbeit beginnt.' },
        { title: 'Umsetzung', text: 'Wir erledigen die Arbeit, halten Sie auf dem Laufenden und übergeben alles, was Sie brauchen.' },
      ],
    },
    about: {
      title: 'Über uns',
      text: 'Ein kleines Team, mit einer festen Ansprechperson für jede Frage.',
    },
    contact: {
      title: 'Kontakt',
      text: 'Rufen Sie uns an oder schreiben Sie uns eine E-Mail.',
    },
  },
};

/** The page shown for an address that does not exist. */
export const NOT_FOUND: Record<Locale, { title: string; text: string }> = {
  en: {
    title: 'This page does not exist',
    text: 'The link may be out of date or mistyped. Here is where to go next:',
  },
  de: {
    title: 'Diese Seite gibt es nicht',
    text: 'Der Link ist vielleicht veraltet oder falsch geschrieben. Hier geht es weiter:',
  },
};

/** The small words of the header, footer and pages. */
export const UI: Record<Locale, { skipLink: string; mainNav: string; phone: string; email: string; home: string }> = {
  en: { skipLink: 'Skip to content', mainNav: 'Main navigation', phone: 'Phone', email: 'Email', home: 'Home' },
  de: { skipLink: 'Zum Inhalt springen', mainNav: 'Hauptnavigation', phone: 'Telefon', email: 'E-Mail', home: 'Startseite' },
};

/**
 * Phrases that must not appear anywhere on the site; src/content/claims.test.ts checks every source file against
 * this list. The list (with the comments inside it) is the one place the phrases may be written: the test cuts it
 * out of this file before checking the rest, so keep examples inside the brackets.
 */
export const FORBIDDEN: RegExp[] = [
  // Put here what you never want to read on a page, one case-insensitive pattern per line:
  // a promise you cannot prove, an old address or phone number after a move, a product you no longer sell,
  // a competitor's name. For example:
  //   /risk-free/i,
  //   /guaranteed/i,
  // The list may stay empty.
];
