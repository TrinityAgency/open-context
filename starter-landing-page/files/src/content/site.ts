// The site's facts live here, once. Pages and components read them; they never copy them.
// Every value below is sample data: replace it with your own before the site goes live.
// Text comes in both languages (`en`, `de`); src/content/locale.ts picks one. Facts (name, address) are not text:
// they exist once.
import type { FooterColumn } from '@/components/site-footer/site-footer';
import type { ContactFacts, LinkItem } from '@/components/site-footer/site-types';
import type { Cta, NavItem, SiteIdentity } from '@/components/site-header/site-types';
import type { ConsentCategory } from '@/modules/site-cookie-consent';
import type { Locale } from './locale';

export const SITE = {
  name: 'Samplework Inc.',
  description: 'We plan, build and look after what you need, with one team and one point of contact.',
  /** The public origin without a trailing slash; SITE_URL in the environment overrides it. */
  url: 'https://example.com',
} satisfies SiteIdentity;

/** The site's public origin: SITE_URL, or SITE.url when it is not set. */
export function siteUrl(): string {
  return (process.env.SITE_URL?.trim() || SITE.url).replace(/\/+$/, '');
}

export const CONTACT = {
  email: 'hello@example.com',
  phone: '+1 555 0100',
  address: { street: '1 Sample Street', postalCode: '12345', city: 'Sampletown', country: 'US' },
} satisfies ContactFacts;

/** The main navigation, in this order. Each entry is a section of the home page until its own page exists. */
export const NAV: Record<Locale, NavItem[]> = {
  en: [
    { href: '/#features', label: 'Features' },
    { href: '/#pricing', label: 'Pricing' },
    { href: '/#faq', label: 'Questions' },
  ],
  de: [
    { href: '/#features', label: 'Leistungen' },
    { href: '/#pricing', label: 'Preise' },
    { href: '/#faq', label: 'Fragen' },
  ],
};

/** The call to action beside the navigation. */
export const CTA: Record<Locale, Cta> = {
  en: { href: '/#contact', label: 'Get in touch', variant: 'primary' },
  de: { href: '/#contact', label: 'Kontakt aufnehmen', variant: 'primary' },
};

/** The footer's link columns. */
export const FOOTER_COLUMNS: Record<Locale, FooterColumn[]> = {
  en: [
    {
      title: 'Product',
      links: [
        { href: '/#features', label: 'Features' },
        { href: '/#pricing', label: 'Pricing' },
      ],
    },
    {
      title: 'Help',
      links: [
        { href: '/#faq', label: 'Questions' },
        { href: '/#contact', label: 'Contact' },
      ],
    },
  ],
  de: [
    {
      title: 'Angebot',
      links: [
        { href: '/#features', label: 'Leistungen' },
        { href: '/#pricing', label: 'Preise' },
      ],
    },
    {
      title: 'Hilfe',
      links: [
        { href: '/#faq', label: 'Fragen' },
        { href: '/#contact', label: 'Kontakt' },
      ],
    },
  ],
};

/** The legal pages, linked in the footer. Their routes are src/app/imprint, privacy and terms. */
export const LEGAL: Record<Locale, LinkItem[]> = {
  en: [
    { href: '/imprint', label: 'Imprint' },
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
  ],
  de: [
    { href: '/imprint', label: 'Impressum' },
    { href: '/privacy', label: 'Datenschutz' },
    { href: '/terms', label: 'AGB' },
  ],
};

/**
 * What the cookie banner asks for. `necessary` is always on; `media` is for anything loaded from another host (a map,
 * a video), shown inside ConsentGate. Nothing uses `media` yet: AGENTS.md says how to gate an embed, or how to drop
 * the consent provider when the site never stores or loads anything from another host.
 */
export const CONSENT_CATEGORIES: Record<Locale, ConsentCategory[]> = {
  en: [
    { id: 'necessary', label: 'Necessary', description: 'Remembers your choice on this banner. Always on.', required: true },
    { id: 'media', label: 'External media', description: 'Maps and videos from other providers, which may set their own cookies.', required: false },
  ],
  de: [
    { id: 'necessary', label: 'Notwendig', description: 'Speichert Ihre Auswahl in diesem Banner. Immer aktiv.', required: true },
    { id: 'media', label: 'Externe Medien', description: 'Karten und Videos anderer Anbieter, die eigene Cookies setzen können.', required: false },
  ],
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
