export type TermsLabels = {
  /** Read by screen readers before each placeholder. */
  placeholder: string;
  /** The name of the table of contents. */
  contents: string;
  /** Before the date of the last update. */
  updated: string;
};

export const TERMS_LABELS: TermsLabels = {
  placeholder: 'Placeholder:',
  contents: 'Contents',
  updated: 'Last updated',
};
