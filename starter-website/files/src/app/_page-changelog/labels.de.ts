import type { ChangelogLabels } from './labels';

export const CHANGELOG_LABELS_DE: ChangelogLabels = {
  kinds: { added: 'Neu', changed: 'Geändert', deprecated: 'Veraltet', removed: 'Entfernt', fixed: 'Behoben', security: 'Sicherheit' },
  latest: 'Aktuell',
  permalink: (version) => `Link zu Version ${version}`,
};
