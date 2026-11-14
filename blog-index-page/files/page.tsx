import type { Metadata } from 'next';
import { BlogIndexPage } from './blog-index';
import { LOCALE, META } from './content';

export const metadata: Metadata = META[LOCALE];

export default function Page() {
  return <BlogIndexPage locale={LOCALE} page={1} />;
}
