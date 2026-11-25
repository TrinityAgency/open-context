import type { Metadata } from 'next';
import { LOCALE, META } from './content';
import { FaqPage } from './faq-page';

export const metadata: Metadata = META[LOCALE];

export default function Page() {
  return <FaqPage locale={LOCALE} />;
}
