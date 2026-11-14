export type PrivacyLabels = {
  /** Read by screen readers before each placeholder. */
  placeholder: string;
  /** The name of the table of contents. */
  contents: string;
  /** The label of a section's short summary. */
  inShort: string;
  /** Before the date of the last update. */
  updated: string;
};

export const PRIVACY_LABELS: PrivacyLabels = {
  placeholder: 'Placeholder:',
  contents: 'Contents',
  inShort: 'In short',
  updated: 'Last updated',
};
