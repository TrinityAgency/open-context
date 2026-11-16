import type { Metadata } from 'next';
import { LOCALE, META } from './content';
import { ImprintPage } from './legal-document';

export const metadata: Metadata = META[LOCALE];

export default function Page() {
  return <ImprintPage locale={LOCALE} />;
}
