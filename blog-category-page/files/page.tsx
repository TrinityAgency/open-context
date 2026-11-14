import type { Metadata } from 'next';
import { CategoryPage, defaultBlog } from './category-page';
import { LOCALE, META } from './content';

type Props = { params: Promise<{ category: string }> };

// Every category in categories.yaml gets a page, empty ones too; any other id answers 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await defaultBlog.getCategories()).map((category) => ({ category: category.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: id } = await params;
  const category = await defaultBlog.getCategory(id);
  if (!category) return {};
  return { title: category.name, description: category.description ?? META[LOCALE].description };
}

export default async function Page({ params }: Props) {
  const { category } = await params;
  return <CategoryPage locale={LOCALE} category={category} page={1} />;
}
