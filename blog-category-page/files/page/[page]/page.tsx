import type { Metadata } from 'next';
import { pageParams } from '../../_parts/blog-content/collection';
import { CATEGORY_LABELS, CategoryPage, defaultBlog } from '../../category-page';
import { BLOG, LOCALE, META } from '../../content';

type Props = { params: Promise<{ category: string; page: string }> };

// Pages 2… of every category are built ahead; any other number (and /page/1) answers 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const categories = await defaultBlog.getCategories();
  const perCategory = await Promise.all(
    categories.map(async (category) => {
      const posts = await defaultBlog.getPosts({ category: category.id });
      return pageParams(posts.length, BLOG.perPage).map(({ page }) => ({ category: category.id, page }));
    }),
  );
  return perCategory.flat();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: id, page } = await params;
  const category = await defaultBlog.getCategory(id);
  if (!category) return {};
  return {
    title: `${category.name} – ${CATEGORY_LABELS[LOCALE].page(Number(page))}`,
    description: category.description ?? META[LOCALE].description,
  };
}

export default async function Page({ params }: Props) {
  const { category, page } = await params;
  return <CategoryPage locale={LOCALE} category={category} page={Number(page)} />;
}
