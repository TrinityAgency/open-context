import type { Metadata } from 'next';
import { AboutPage } from '@/components/about/about-page';
import { blogMetadata } from '@/content/blog';
import { LOCALE } from '@/content/locale';
import { ABOUT_PAGE } from '@/content/pages';

export const metadata: Metadata = blogMetadata({ path: '/about', ...ABOUT_PAGE[LOCALE].meta });

// The view: src/components/about/about-page.tsx; its text: ABOUT_PAGE in src/content/pages.ts.
export default function About() {
  return <AboutPage locale={LOCALE} />;
}
