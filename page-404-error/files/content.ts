// The pages' sample content, in English and German. Replace it with your own; keep the shapes. Point the links at
// pages your site has: a link to a missing page from the not-found page is a dead end.
import type { LinkItem } from './site-types';

/** The pages' language: picks the text and the labels. Set `lang` in your root layout to match. */
export const LOCALE = 'en' as 'en' | 'de';

export type NotFoundContent = { title: string; text: string; linksLabel: string; links: LinkItem[] };
export type ErrorContent = { title: string; text: string; home: LinkItem };

export const NOT_FOUND: Record<'en' | 'de', NotFoundContent> = {
  en: {
    title: 'Page not found',
    text: 'The page you are looking for does not exist or has moved.',
    linksLabel: 'Where to go next',
    links: [
      { href: '/', label: 'Home' },
      { href: '/#contact', label: 'Contact' },
    ],
  },
  de: {
    title: 'Seite nicht gefunden',
    text: 'Die gesuchte Seite gibt es nicht, oder sie ist umgezogen.',
    linksLabel: 'Weiter geht es hier',
    links: [
      { href: '/', label: 'Startseite' },
      { href: '/#contact', label: 'Kontakt' },
    ],
  },
};

export const ERROR: Record<'en' | 'de', ErrorContent> = {
  en: {
    title: 'Something went wrong',
    text: 'This page could not be shown. Try again, or go back to the home page.',
    home: { href: '/', label: 'Back to the home page' },
  },
  de: {
    title: 'Etwas ist schiefgelaufen',
    text: 'Diese Seite konnte nicht angezeigt werden. Versuchen Sie es erneut, oder gehen Sie zur Startseite.',
    home: { href: '/', label: 'Zur Startseite' },
  },
};
