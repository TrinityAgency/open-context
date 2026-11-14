export type PostPageLabels = {
  /** The table of contents' title and navigation name. */
  contents: string;
  /** The related posts' heading. */
  related: string;
  /** Before the publishing date. */
  published: string;
  /** Before the date of the last change. */
  updated: string;
  /** The breadcrumb trail's first link, to the home page. */
  home: string;
  /** The breadcrumb trail's link to the blog index. */
  blog: string;
};

export const POST_PAGE_LABELS: PostPageLabels = {
  contents: 'On this page',
  related: 'Related posts',
  published: 'Published',
  updated: 'Updated',
  home: 'Home',
  blog: 'Blog',
};
