export type ErrorLabels = {
  /** The button that renders the page again. */
  tryAgain: string;
  /** Before the error's reference (its digest), for support requests. */
  reference: string;
};

export const ERROR_LABELS: ErrorLabels = {
  tryAgain: 'Try again',
  reference: 'Reference',
};
