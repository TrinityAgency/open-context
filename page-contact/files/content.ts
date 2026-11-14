// The page's sample content, in English and German. Replace it with your own; keep the shapes.
import type { ContactContent } from './contact-view';

/** The page's language: picks the text and the labels. Set it to 'de' for the German set (and `lang` in your root layout). */
export const LOCALE = 'en' as 'en' | 'de';

export const META: Record<'en' | 'de', { title: string; description: string }> = {
  en: {
    title: 'Contact – Samplework Inc.',
    description: 'Write to us, call us or visit us. We answer within one working day.',
  },
  de: {
    title: 'Kontakt – Beispielwerk GmbH',
    description: 'Schreiben Sie uns, rufen Sie an oder besuchen Sie uns. Wir antworten innerhalb eines Werktags.',
  },
};

export const CONTENT: Record<'en' | 'de', ContactContent> = {
  en: {
    title: 'Contact',
    intro: 'Write to us, call us or visit us. We answer within one working day.',
    contact: {
      email: 'hello@example.com',
      phone: '+1 555 0100',
      address: { street: '1 Sample Street', postalCode: '12345', city: 'Sampletown', country: 'US' },
    },
    privacy: { href: '/privacy', label: 'Privacy policy' },
    map: { href: 'https://www.openstreetmap.org/search?query=1%20Sample%20Street%2C%20Sampletown', label: 'Open the map' },
  },
  de: {
    title: 'Kontakt',
    intro: 'Schreiben Sie uns, rufen Sie an oder besuchen Sie uns. Wir antworten innerhalb eines Werktags.',
    contact: {
      email: 'hallo@example.com',
      phone: '+49 30 0000000',
      address: { street: 'Musterstraße 1', postalCode: '12345', city: 'Musterstadt', country: 'DE' },
    },
    privacy: { href: '/privacy', label: 'Datenschutzerklärung' },
    map: { href: 'https://www.openstreetmap.org/search?query=Musterstra%C3%9Fe%201%2C%20Musterstadt', label: 'Karte öffnen' },
  },
};
