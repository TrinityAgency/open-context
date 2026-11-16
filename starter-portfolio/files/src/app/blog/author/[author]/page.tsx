import type { Metadata } from 'next';
import { AuthorPage, bioParagraphs } from '@/components/blog/author-page';
import { BLOG_TEXT, blog, blogMetadata, paths } from '@/content/blog';
import { LOCALE } from '@/content/locale';

type Props = { params: Promise<{ author: string }> };

// Every author in authors.yaml gets a page, those without posts too; any other id answers 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await blog.getAuthors()).map((author) => ({ author: author.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { author: id } = await params;
  const author = await blog.getAuthor(id);
  if (!author) return {};
  return blogMetadata({
    path: paths.author(author.id),
    title: author.name,
    description: bioParagraphs(author.bio)[0] ?? BLOG_TEXT[LOCALE].author.description,
  });
}

// One author. Its view: src/components/blog/author-page.tsx.
export default async function Page({ params }: Props) {
  const { author } = await params;
  return <AuthorPage locale={LOCALE} author={author} />;
}
