import type { Metadata } from 'next';
import { LOCALE, META } from './content';
import { PrivacyPage } from './legal-document';

export const metadata: Metadata = META[LOCALE];

export default function Page() {
  return <PrivacyPage locale={LOCALE} />;
}
