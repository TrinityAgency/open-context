import type { Metadata } from 'next';
import { BlogIndexPage } from '@/components/blog/blog-index';
import { BLOG, BLOG_TEXT, blog, blogMetadata, paths } from '@/content/blog';
import { LOCALE } from '@/content/locale';
import { pageParams } from '@/utils/blog-content/collection';

type Props = { params: Promise<{ page: string }> };

// Pages 2… are built ahead from the posts; any other number (and /page/1) answers 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  return pageParams((await blog.getPosts()).length, BLOG.perPage);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  const t = BLOG_TEXT[LOCALE].index;
  return blogMetadata({
    path: paths.index(Number(page)),
    title: `${t.meta.title} – ${t.page(Number(page))}`,
    description: t.meta.description,
  });
}

export default async function Page({ params }: Props) {
  const { page } = await params;
  return <BlogIndexPage locale={LOCALE} page={Number(page)} />;
}
