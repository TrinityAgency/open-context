import type { Metadata } from 'next';
import { pageParams } from '../../_parts/blog-content/collection';
import { BlogIndexPage, INDEX_LABELS, defaultBlog } from '../../blog-index';
import { BLOG, LOCALE, META } from '../../content';

type Props = { params: Promise<{ page: string }> };

// Pages 2… are built ahead from the posts; any other number (and /page/1) answers 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  return pageParams((await defaultBlog.getPosts()).length, BLOG.perPage);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  const meta = META[LOCALE];
  return { ...meta, title: `${meta.title} – ${INDEX_LABELS[LOCALE].page(Number(page))}` };
}

export default async function Page({ params }: Props) {
  const { page } = await params;
  return <BlogIndexPage locale={LOCALE} page={Number(page)} />;
}
