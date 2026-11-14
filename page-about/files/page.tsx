import type { Metadata } from 'next';
import { AboutPage } from './about-page';
import { LOCALE, META } from './content';

export const metadata: Metadata = META[LOCALE];

export default function Page() {
  return <AboutPage locale={LOCALE} />;
}
