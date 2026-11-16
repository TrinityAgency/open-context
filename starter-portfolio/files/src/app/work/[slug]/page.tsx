import type { Metadata } from 'next';
import { ProjectPage } from '@/components/work/project-page';
import { blogMetadata } from '@/content/blog';
import { LOCALE } from '@/content/locale';
import { work, workPaths } from '@/content/work';

type Props = { params: Promise<{ slug: string }> };

// Every visible project is built ahead; any other slug (a draft, a scheduled project, a typo) answers 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await work.getPosts()).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const loaded = await work.getPost(slug);
  if (!loaded) return {};
  const { post: project } = loaded;
  return blogMetadata({
    path: workPaths.post(project.slug),
    title: project.title,
    description: project.description,
    image: project.image,
  });
}

// One project. Its view: src/components/work/project-page.tsx.
export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <ProjectPage locale={LOCALE} slug={slug} />;
}
