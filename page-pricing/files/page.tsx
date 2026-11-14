import type { Metadata } from 'next';
import { LOCALE, META } from './content';
import { PricingPage } from './pricing-page';

export const metadata: Metadata = META[LOCALE];

export default function Page() {
  return <PricingPage locale={LOCALE} />;
}
