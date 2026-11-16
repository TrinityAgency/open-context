export type PaginationLabels = {
  /** The navigation landmark's name. */
  nav: string;
  previous: string;
  next: string;
  /** The accessible name of a page link; the link shows only the number. */
  page: (n: number) => string;
  /** The visible mark for left-out pages (hidden from screen readers). */
  gap: string;
};

export const PAGINATION_LABELS: PaginationLabels = {
  nav: 'Pagination',
  previous: 'Previous',
  next: 'Next',
  page: (n) => `Page ${n}`,
  gap: '…',
};
