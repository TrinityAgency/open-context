export type AuthorPageLabels = {
  /** The author's website link (Author.url). */
  website: string;
  /** The heading over the author's posts. */
  posts: (name: string) => string;
  /** Shown instead of the cards while the author has no visible post. */
  empty: string;
  /** The link back to the blog index. */
  all: string;
};

export const AUTHOR_PAGE_LABELS: AuthorPageLabels = {
  website: 'Website',
  posts: (name) => `Posts by ${name}`,
  empty: 'No posts yet.',
  all: 'All posts',
};
