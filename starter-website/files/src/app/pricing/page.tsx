import type { Metadata } from 'next';
import { PricingPage } from '@/components/pricing/pricing-page';
import { blogMetadata } from '@/content/blog';
import { LOCALE } from '@/content/locale';
import { PRICING_PAGE } from '@/content/pages';

export const metadata: Metadata = blogMetadata({ path: '/pricing', ...PRICING_PAGE[LOCALE].meta });

// The view: src/components/pricing/pricing-page.tsx; its text: PRICING_PAGE in src/content/pages.ts.
export default function Pricing() {
  return <PricingPage locale={LOCALE} />;
}
