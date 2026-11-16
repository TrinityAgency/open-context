import type { Metadata } from 'next';
import { CategoryPage } from '@/components/blog/category-page';
import { BLOG, BLOG_TEXT, blog, blogMetadata, paths } from '@/content/blog';
import { LOCALE } from '@/content/locale';
import { pageParams } from '@/utils/blog-content/collection';

type Props = { params: Promise<{ category: string; page: string }> };

// Pages 2… of every category are built ahead; any other number (and /page/1) answers 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const categories = await blog.getCategories();
  const perCategory = await Promise.all(
    categories.map(async (category) => {
      const posts = await blog.getPosts({ category: category.id });
      return pageParams(posts.length, BLOG.perPage).map(({ page }) => ({ category: category.id, page }));
    }),
  );
  return perCategory.flat();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: id, page } = await params;
  const category = await blog.getCategory(id);
  if (!category) return {};
  const t = BLOG_TEXT[LOCALE].category;
  return blogMetadata({
    path: paths.category(category.id, Number(page)),
    title: `${category.name} – ${t.page(Number(page))}`,
    description: category.description ?? t.description,
  });
}

export default async function Page({ params }: Props) {
  const { category, page } = await params;
  return <CategoryPage locale={LOCALE} category={category} page={Number(page)} />;
}
