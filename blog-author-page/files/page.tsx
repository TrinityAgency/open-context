import type { Metadata } from 'next';
import { AuthorPage, bioParagraphs, defaultBlog } from './author-page';
import { LOCALE, META } from './content';

type Props = { params: Promise<{ author: string }> };

// Every author in authors.yaml gets a page, those without posts too; any other id answers 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await defaultBlog.getAuthors()).map((author) => ({ author: author.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { author: id } = await params;
  const author = await defaultBlog.getAuthor(id);
  if (!author) return {};
  return { title: author.name, description: bioParagraphs(author.bio)[0] ?? META[LOCALE].description };
}

export default async function Page({ params }: Props) {
  const { author } = await params;
  return <AuthorPage locale={LOCALE} author={author} />;
}
