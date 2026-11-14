import type { Metadata } from 'next';
import { LOCALE, META } from './content';
import { TermsPage } from './legal-document';

export const metadata: Metadata = META[LOCALE];

export default function Page() {
  return <TermsPage locale={LOCALE} />;
}
