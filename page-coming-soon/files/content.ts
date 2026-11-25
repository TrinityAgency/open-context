// The page's sample content, in English and German. Replace it with your own; keep the shapes.
import type { HeroContent } from './_sections/hero/hero-section';
import type { LinkItem } from './_sections/hero/site-types';

/** The page's language: picks the text below. Set it to 'de' for the German set (and `lang` in your root layout). */
export const LOCALE = 'en' as 'en' | 'de';

export const META: Record<'en' | 'de', { title: string; description: string }> = {
  en: {
    title: 'Opening on 1 March 2027 – Samplework Inc.',
    description: 'Samplework opens its new workshop in Sampletown on 1 March 2027. Leave your address to hear when we open.',
  },
  de: {
    title: 'Eröffnung am 1. März 2027 – Beispielwerk GmbH',
    description: 'Die Beispielwerk GmbH eröffnet am 1. März 2027 ihre neue Werkstatt in Musterstadt. Hinterlassen Sie Ihre Adresse, dann sagen wir Bescheid.',
  },
};

export type ComingSoonContent = {
  /** The launch date goes in `eyebrow`, as text: no clock runs on the page. */
  hero: HeroContent;
  /** The signup: its heading, a line of text and the link to your privacy policy. */
  newsletter: { title: string; text?: string; privacy?: LinkItem };
  /** A row of links under the signup (a profile elsewhere, an address to write to); an empty list draws none. */
  links: { label: string; items: LinkItem[] };
};

export const CONTENT: Record<'en' | 'de', ComingSoonContent> = {
  en: {
    hero: {
      eyebrow: 'Opening on 1 March 2027',
      title: 'Our new workshop is almost ready',
      lead: 'Samplework is moving to a bigger workshop in Sampletown, and this website opens with it. Until then, we are a call or an email away.',
    },
    newsletter: {
      title: 'Hear when we open',
      text: 'One email on the opening day, nothing more.',
      privacy: { href: '/privacy', label: 'Privacy policy' },
    },
    links: {
      label: 'Other ways to reach us',
      items: [
        { href: 'mailto:hello@example.com', label: 'hello@example.com' },
        { href: 'tel:+15550100', label: '+1 555 0100' },
        { href: 'https://example.com/samplework', label: 'Samplework on the web' },
      ],
    },
  },
  de: {
    hero: {
      eyebrow: 'Eröffnung am 1. März 2027',
      title: 'Unsere neue Werkstatt ist fast fertig',
      lead: 'Die Beispielwerk GmbH zieht in eine größere Werkstatt in Musterstadt, und mit ihr öffnet diese Website. Bis dahin erreichen Sie uns per Telefon oder E-Mail.',
    },
    newsletter: {
      title: 'Erfahren Sie, wann wir öffnen',
      text: 'Eine E-Mail am Tag der Eröffnung, sonst nichts.',
      privacy: { href: '/privacy', label: 'Datenschutzerklärung' },
    },
    links: {
      label: 'Weitere Wege zu uns',
      items: [
        { href: 'mailto:hallo@example.com', label: 'hallo@example.com' },
        { href: 'tel:+49300000000', label: '+49 30 0000000' },
        { href: 'https://example.com/beispielwerk', label: 'Die Beispielwerk GmbH im Netz' },
      ],
    },
  },
};
