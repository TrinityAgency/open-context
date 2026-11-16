import type { Metadata } from 'next';
import { WorkIndex } from '@/components/work/work-index';
import { blogMetadata } from '@/content/blog';
import { LOCALE } from '@/content/locale';
import { WORK_TEXT, work, workPaths } from '@/content/work';

type Props = { params: Promise<{ category: string }> };

// Every discipline with a visible project gets a page; any other id answers 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const [projects, disciplines] = await Promise.all([work.getPosts(), work.getCategories()]);
  return disciplines
    .filter((discipline) => projects.some((project) => project.category === discipline.id))
    .map((discipline) => ({ category: discipline.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: id } = await params;
  const discipline = await work.getCategory(id);
  if (!discipline) return {};
  return blogMetadata({
    path: workPaths.category(discipline.id),
    title: discipline.name,
    description: discipline.description ?? WORK_TEXT[LOCALE].index.meta.description,
  });
}

// One discipline's projects. Its view: src/components/work/work-index.tsx.
export default async function Page({ params }: Props) {
  const { category } = await params;
  return <WorkIndex locale={LOCALE} category={category} />;
}
