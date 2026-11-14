import type { Metadata } from 'next';
import { BlogIndexPage } from '@/components/blog/blog-index';
import { BLOG_TEXT, blogMetadata, paths } from '@/content/blog';
import { LOCALE } from '@/content/locale';

export const metadata: Metadata = blogMetadata({
  path: paths.index(),
  title: BLOG_TEXT[LOCALE].index.meta.title,
  description: BLOG_TEXT[LOCALE].index.meta.description,
});

// The blog index, page 1. Its view: src/components/blog/blog-index.tsx.
export default function Blog() {
  return <BlogIndexPage locale={LOCALE} page={1} />;
}
