/** Post slugs the blog's own routes use: a post may not take them. */
export const RESERVED_SLUGS = ['page', 'author', 'category'] as const;

export type BlogPaths = {
  /** The index: `/blog`, then `/blog/page/<n>` from page 2. */
  index(page?: number): string;
  /** A post: `/blog/<slug>`. */
  post(slug: string): string;
  /** An author: `/blog/author/<id>`. */
  author(id: string): string;
  /** A category: `/blog/category/<id>`, then `/blog/category/<id>/page/<n>` from page 2. */
  category(id: string, page?: number): string;
};

/** The blog's URLs under `base` (default `/blog`; lowercase segments, no trailing slash). */
export function blogPaths(base = '/blog'): BlogPaths {
  if (!/^(\/[a-z0-9-]+)+$/.test(base)) throw new RangeError(`blog base must look like /blog or /en/journal, not ${base}`);
  const paged = (path: string, page?: number) => (page === undefined || page <= 1 ? path : `${path}/page/${page}`);
  return {
    index: (page) => paged(base, page),
    post: (slug) => `${base}/${slug}`,
    author: (id) => `${base}/author/${id}`,
    category: (id, page) => paged(`${base}/category/${id}`, page),
  };
}
