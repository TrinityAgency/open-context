export type CategoryPageLabels = {
  /** The link back to the blog index. */
  all: string;
  /** Shown instead of the cards while the category has no visible post. */
  empty: string;
  /** Added to the browser title of the pages after the first. */
  page: (n: number) => string;
};

export const CATEGORY_PAGE_LABELS: CategoryPageLabels = {
  all: 'All posts',
  empty: 'No posts in this category yet.',
  page: (n) => `Page ${n}`,
};
