// What the contact page shows: its text (CONTACT_PAGE in src/content/pages.ts), the company's email, phone and address
// (CONTACT in src/content/site.ts) and the privacy link (LEGAL). The part's own content.ts
// (src/app/_page-contact/content.ts) is not read: the facts live once, in site.ts.
import type { ContactContent } from '@/app/_page-contact/contact-view';
import type { Locale } from './locale';
import { CONTACT_PAGE } from './pages';
import { CONTACT, LEGAL } from './site';

/** The contact page's content in one language, for ContactView. */
export function contactContent(locale: Locale): ContactContent {
  const { title, intro, map } = CONTACT_PAGE[locale];
  const privacy = LEGAL[locale].find((link) => link.href === '/privacy');
  if (!privacy) throw new Error('src/content/site.ts: LEGAL has no /privacy link, which the contact form names');
  return { title, intro, contact: CONTACT, privacy, map };
}
