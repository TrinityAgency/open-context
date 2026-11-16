import type { Metadata } from 'next';
import { HomePage } from '@/components/home-page';
import { blogMetadata } from '@/content/blog';
import { HOME } from '@/content/home';
import { LOCALE } from '@/content/locale';

export const metadata: Metadata = blogMetadata({
  path: '/',
  title: HOME[LOCALE].meta.title,
  description: HOME[LOCALE].meta.description,
});

// The home page's view: src/components/home-page.tsx; its text: HOME in src/content/home.ts.
export default function Home() {
  return <HomePage locale={LOCALE} />;
}
