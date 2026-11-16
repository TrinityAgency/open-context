import type { Metadata } from 'next';
import { ContactPage } from './contact-view';
import { LOCALE, META } from './content';

// Rendered per request, so the form's time trap starts when the visitor opens the page, not at build time.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = META[LOCALE];

/** The time of this request. A server component renders once per request, so this is stable for the page. */
const requestTime = () => Date.now();

export default function Page() {
  return <ContactPage locale={LOCALE} startedAt={requestTime()} />;
}
