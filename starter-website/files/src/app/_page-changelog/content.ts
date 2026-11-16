// The page's sample content, in English and German. Replace it with your own; keep the shapes.
import type { ChangelogEntry } from './site-types';

/** The page's language: picks the text, the labels and the date format. Set `lang` in your root layout to match. */
export const LOCALE = 'en' as 'en' | 'de';

export const META: Record<'en' | 'de', { title: string; description: string }> = {
  en: {
    title: 'Changelog – Samplework Inc.',
    description: 'What changed in each release of the Samplework planner.',
  },
  de: {
    title: 'Änderungen – Beispielwerk GmbH',
    description: 'Was sich in jeder Version des Beispielwerk-Planers geändert hat.',
  },
};

export type ChangelogContent = { title: string; intro?: string; entries: ChangelogEntry[] };

// Versions are SemVer (`2.0.0`, `2.0.0-beta.1`); dates are `YYYY-MM-DD`. The page sorts the releases itself.
export const CONTENT: Record<'en' | 'de', ChangelogContent> = {
  en: {
    title: 'Changelog',
    intro: 'Every release of the Samplework planner, newest first.',
    entries: [
      {
        version: '2.0.0',
        date: '2026-03-01',
        title: 'A new plan view',
        changes: [
          { kind: 'added', text: 'A timeline view for every plan.' },
          { kind: 'added', text: 'Export a plan as a PDF.' },
          { kind: 'changed', text: 'Plans open in the timeline view by default.' },
          { kind: 'removed', text: 'The old list view.' },
        ],
      },
      {
        version: '2.0.0-beta.1',
        date: '2026-02-10',
        changes: [{ kind: 'added', text: 'A first look at the timeline view.' }],
      },
      {
        version: '1.4.1',
        date: '2026-01-20',
        changes: [
          { kind: 'fixed', text: 'Dates at the end of March showed the wrong week.' },
          { kind: 'security', text: 'Shared links now expire after 30 days.' },
        ],
      },
      {
        version: '1.4.0',
        date: '2026-01-05',
        title: 'Shared plans',
        changes: [
          { kind: 'added', text: 'Share a plan with a link.' },
          { kind: 'deprecated', text: 'The old list view; it goes in 2.0.0.' },
        ],
      },
    ],
  },
  de: {
    title: 'Änderungen',
    intro: 'Jede Version des Beispielwerk-Planers, die neueste zuerst.',
    entries: [
      {
        version: '2.0.0',
        date: '2026-03-01',
        title: 'Eine neue Planansicht',
        changes: [
          { kind: 'added', text: 'Eine Zeitleiste für jeden Plan.' },
          { kind: 'added', text: 'Pläne als PDF exportieren.' },
          { kind: 'changed', text: 'Pläne öffnen standardmäßig in der Zeitleiste.' },
          { kind: 'removed', text: 'Die alte Listenansicht.' },
        ],
      },
      {
        version: '2.0.0-beta.1',
        date: '2026-02-10',
        changes: [{ kind: 'added', text: 'Ein erster Blick auf die Zeitleiste.' }],
      },
      {
        version: '1.4.1',
        date: '2026-01-20',
        changes: [
          { kind: 'fixed', text: 'Daten am Ende des März zeigten die falsche Woche.' },
          { kind: 'security', text: 'Geteilte Links laufen jetzt nach 30 Tagen ab.' },
        ],
      },
      {
        version: '1.4.0',
        date: '2026-01-05',
        title: 'Geteilte Pläne',
        changes: [
          { kind: 'added', text: 'Einen Plan per Link teilen.' },
          { kind: 'deprecated', text: 'Die alte Listenansicht; sie entfällt mit 2.0.0.' },
        ],
      },
    ],
  },
};
