export type ComparisonLabels = {
  /** Read by screen readers in a cell whose plan includes the feature. */
  included: string;
  /** Read by screen readers in a cell whose plan does not include it. */
  notIncluded: string;
  /** The name of the scrollable region around the table. */
  table: string;
};

export const COMPARISON_LABELS: ComparisonLabels = {
  included: 'Included',
  notIncluded: 'Not included',
  table: 'Plan comparison',
};
