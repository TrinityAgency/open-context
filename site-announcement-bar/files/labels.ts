export type AnnouncementLabels = {
  /** The name of the bar's region, read by screen readers in their list of landmarks. */
  region: string;
  /** The name of the dismiss button (an icon). */
  dismiss: string;
};

export const ANNOUNCEMENT_LABELS: AnnouncementLabels = {
  region: 'Announcement',
  dismiss: 'Dismiss the announcement',
};
