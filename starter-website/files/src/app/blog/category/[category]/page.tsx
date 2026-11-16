import type { Metadata } from 'next';
import { CategoryPage } from '@/components/blog/category-page';
import { BLOG_TEXT, blog, blogMetadata, paths } from '@/content/blog';
import { LOCALE } from '@/content/locale';

type Props = { params: Promise<{ category: string }> };

// Every category in categories.yaml gets a page, empty ones too; any other id answers 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await blog.getCategories()).map((category) => ({ category: category.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: id } = await params;
  const category = await blog.getCategory(id);
  if (!category) return {};
  return blogMetadata({
    path: paths.category(category.id),
    title: category.name,
    description: category.description ?? BLOG_TEXT[LOCALE].category.description,
  });
}

// One category, page 1. Its view: src/components/blog/category-page.tsx.
export default async function Page({ params }: Props) {
  const { category } = await params;
  return <CategoryPage locale={LOCALE} category={category} page={1} />;
}
