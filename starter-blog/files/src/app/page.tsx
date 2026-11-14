import type { Metadata } from 'next';
import { HomePage } from '@/components/home-page';
import { BLOG_TEXT, blogMetadata } from '@/content/blog';
import { LOCALE } from '@/content/locale';

export const metadata: Metadata = blogMetadata({
  path: '/',
  title: BLOG_TEXT[LOCALE].home.meta.title,
  description: BLOG_TEXT[LOCALE].home.meta.description,
});

// The home page's view: src/components/home-page.tsx; its text: BLOG_TEXT in src/content/blog.ts.
export default function Home() {
  return <HomePage locale={LOCALE} />;
}
