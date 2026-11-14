export type ConsentLabels = {
  /** The banner's heading, which also names its region. */
  bannerTitle: string;
  /** The banner's one paragraph. */
  bannerText: string;
  acceptAll: string;
  rejectAll: string;
  /** The banner button that opens the dialog. */
  settings: string;
  /** The dialog's heading, which also names it. */
  dialogTitle: string;
  /** The dialog's save button. */
  save: string;
  /** The dialog's close button (closes without saving). */
  close: string;
  /** Shown beside a required category. */
  alwaysOn: string;
};

export const CONSENT_LABELS: ConsentLabels = {
  bannerTitle: 'Cookies',
  bannerText:
    'This site uses cookies it needs to work. With your consent it also uses others, described in the settings.',
  acceptAll: 'Accept all',
  rejectAll: 'Reject all',
  settings: 'Settings',
  dialogTitle: 'Cookie settings',
  save: 'Save choices',
  close: 'Close',
  alwaysOn: 'Always on',
};
