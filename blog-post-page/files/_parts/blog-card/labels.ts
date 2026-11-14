export type BlogCardLabels = {
  /** The reading time, from the post's readingMinutes. */
  minutes: (n: number) => string;
  /** Before the author names. */
  by: string;
};

export const BLOG_CARD_LABELS: BlogCardLabels = {
  minutes: (n) => `${n} min read`,
  by: 'By',
};
