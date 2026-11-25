import type { Metadata } from 'next';
import { ComingSoonPage } from './coming-soon-page';
import { LOCALE, META } from './content';

// noindex, nofollow: a page that announces a site not open yet stays out of search engines.
export const metadata: Metadata = { ...META[LOCALE], robots: { index: false, follow: false } };

export default function Page() {
  return <ComingSoonPage locale={LOCALE} />;
}
