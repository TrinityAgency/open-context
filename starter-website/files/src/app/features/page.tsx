import type { Metadata } from 'next';
import { FeaturesPage } from '@/components/features-page';
import { blogMetadata } from '@/content/blog';
import { LOCALE } from '@/content/locale';
import { FEATURES_PAGE } from '@/content/pages';

export const metadata: Metadata = blogMetadata({ path: '/features', ...FEATURES_PAGE[LOCALE].meta });

// The view: src/components/features-page.tsx; its text: FEATURES_PAGE in src/content/pages.ts.
export default function Features() {
  return <FeaturesPage locale={LOCALE} />;
}
