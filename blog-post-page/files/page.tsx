import type { Metadata } from 'next';
import { pageMetadata } from './_parts/site-seo/metadata';
import { LOCALE, OG_LOCALE, SITE } from './content';
import { PostPage, defaultBlog, paths } from './post-page';

type Props = { params: Promise<{ slug: string }> };

// Every visible post is built ahead; any other slug (a draft, a scheduled post, a typo) answers 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await defaultBlog.getPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const loaded = await defaultBlog.getPost(slug);
  if (!loaded) return {};
  const { post } = loaded;
  const authors = await defaultBlog.getAuthors();
  return pageMetadata({
    site: SITE[LOCALE],
    path: paths.post(post.slug),
    title: post.title,
    description: post.description,
    image: post.image,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authors: post.authorIds.flatMap((id) => authors.filter((author) => author.id === id).map((author) => author.name)),
    locale: OG_LOCALE[LOCALE],
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <PostPage locale={LOCALE} slug={slug} />;
}
