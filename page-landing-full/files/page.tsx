import type { Metadata } from 'next';
import { LOCALE, META } from './content';
import { LandingPage } from './landing-page';

export const metadata: Metadata = META[LOCALE];

export default function Page() {
  return <LandingPage locale={LOCALE} />;
}
