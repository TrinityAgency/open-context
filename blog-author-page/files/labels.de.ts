import type { AuthorPageLabels } from './labels';

export const AUTHOR_PAGE_LABELS_DE: AuthorPageLabels = {
  website: 'Website',
  posts: (name) => `Beiträge von ${name}`,
  empty: 'Noch keine Beiträge.',
  all: 'Alle Beiträge',
};
