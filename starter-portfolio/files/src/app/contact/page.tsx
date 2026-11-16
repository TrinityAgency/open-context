import type { Metadata } from 'next';
import Link from 'next/link';
import { blogMetadata } from '@/content/blog';
import { contactContent } from '@/content/contact';
import { LOCALE } from '@/content/locale';
import { CONTACT_PAGE } from '@/content/pages';
import { ContactView } from '../_page-contact/contact-view';
import { CONTACT_LABELS_DE } from '../_page-contact/labels.de';
import { CONTACT_LABELS } from '../_page-contact/labels';

// Rendered per request, so the form's time trap starts when the visitor opens the page, not at build time.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = blogMetadata({ path: '/contact', ...CONTACT_PAGE[LOCALE].meta });

/** The time of this request. A server component renders once per request, so this is stable for the page. */
const requestTime = () => Date.now();

// The view and the form are a part (src/app/_page-contact); the facts come from src/content/site.ts and the text from
// CONTACT_PAGE in src/content/pages.ts. Messages go to deliver() in src/app/_page-contact/deliver.ts: replace it.
export default function Contact() {
  return (
    <ContactView
      content={contactContent(LOCALE)}
      startedAt={requestTime()}
      labels={{ en: CONTACT_LABELS, de: CONTACT_LABELS_DE }[LOCALE]}
      LinkComponent={Link}
    />
  );
}
