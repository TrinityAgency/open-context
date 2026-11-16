import type { PaginationLabels } from './labels';

export const PAGINATION_LABELS_DE: PaginationLabels = {
  nav: 'Seitennavigation',
  previous: 'Zurück',
  next: 'Weiter',
  page: (n) => `Seite ${n}`,
  gap: '…',
};
