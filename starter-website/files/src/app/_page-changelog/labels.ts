import type { ChangeKind } from './site-types';

export type ChangelogLabels = {
  /** The heading of each group of changes. */
  kinds: Record<ChangeKind, string>;
  /** The badge on the newest release. */
  latest: string;
  /** The accessible name of a release's permalink. */
  permalink: (version: string) => string;
};

export const CHANGELOG_LABELS: ChangelogLabels = {
  kinds: { added: 'Added', changed: 'Changed', deprecated: 'Deprecated', removed: 'Removed', fixed: 'Fixed', security: 'Security' },
  latest: 'Latest',
  permalink: (version) => `Link to version ${version}`,
};
