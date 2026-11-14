import type { Metadata } from 'next';
import { PostPage } from '@/components/blog/post-page';
import { blog, blogMetadata, paths } from '@/content/blog';
import { LOCALE } from '@/content/locale';

type Props = { params: Promise<{ slug: string }> };

// Every visible post is built ahead; any other slug (a draft, a scheduled post, a typo) answers 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await blog.getPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const loaded = await blog.getPost(slug);
  if (!loaded) return {};
  const { post } = loaded;
  const authors = await blog.getAuthors();
  return blogMetadata({
    path: paths.post(post.slug),
    title: post.title,
    description: post.description,
    image: post.image,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authors: post.authorIds.flatMap((id) => authors.filter((author) => author.id === id).map((author) => author.name)),
  });
}

// One post. Its view: src/components/blog/post-page.tsx.
export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <PostPage locale={LOCALE} slug={slug} />;
}
