export type BlogIndexLabels = {
  /** The category filter's navigation name. */
  filter: string;
  /** The filter's first link: every post. */
  all: string;
  /** Added to the browser title of the pages after the first. */
  page: (n: number) => string;
};

export const BLOG_INDEX_LABELS: BlogIndexLabels = {
  filter: 'Categories',
  all: 'All posts',
  page: (n) => `Page ${n}`,
};
