import type { Metadata } from 'next';
import { HomePage } from '@/components/home-page';
import { HOME } from '@/content/home';
import { LOCALE } from '@/content/locale';
import { SITE, siteUrl } from '@/content/site';
import { pageMetadata } from '@/utils/site-seo';

export const metadata: Metadata = pageMetadata({
  site: { ...SITE, url: siteUrl() },
  path: '/',
  title: HOME[LOCALE].meta.title,
  description: HOME[LOCALE].meta.description,
  locale: { en: 'en_US', de: 'de_DE' }[LOCALE],
});

// The sections and their text: src/components/home-page.tsx and src/content/home.ts.
export default function Home() {
  return <HomePage locale={LOCALE} />;
}
