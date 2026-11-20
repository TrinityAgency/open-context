# Changelog Page

A changelog page for a Next app: releases from a typed list, newest first, each with a version badge, a title, its
date, a permalink and its changes grouped by kind (Added, Changed, Deprecated, Removed, Fixed, Security). It installs
as a route folder at `app/page-changelog` (served at `/page-changelog`); rename the folder for another path, e.g.
`app/changelog`. Everything is a server component, so the page ships no JavaScript of its own.

## Usage

1. Edit `content.ts`: the page's title and description (`META`), the title and intro, and the releases
   (`CONTENT`). The sample content is invented (Samplework Inc.).
2. Pick the language: `LOCALE` in `content.ts` is `'en'` (the default) or `'de'` (the German content, labels and
   date format). Set `lang` on `<html>` in your root layout to match.

A release is a `ChangelogEntry`:

```ts
{
  version: '2.0.0',            // SemVer: 2.0.0, 2.0.0-beta.1, 2.0.0+build.5
  date: '2026-03-01',          // YYYY-MM-DD
  title: 'A new plan view',    // optional
  changes: [{ kind: 'added', text: 'A timeline view for every plan.' }],
}
```

`kind` is one of `added`, `changed`, `deprecated`, `removed`, `fixed`, `security`. The order of the list does not
matter; the page sorts it.

The page body is `ChangelogPage({ locale })` in `changelog.tsx`, and `Changelog` renders the releases alone (for a
changelog inside another page):

```tsx
import { Changelog } from '@/app/page-changelog/changelog';
import { CHANGELOG_LABELS_DE } from '@/app/page-changelog/labels.de';

<Changelog entries={entries} locale="de" labels={CHANGELOG_LABELS_DE} />
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

## Ordering, anchors and dates

`changelog-order.ts` holds the rules, each tested:

- **Order:** by date, newest first; releases of the same day by version, highest first (`sortReleases`).
- **Versions** follow SemVer 2.0 precedence (`compareVersions`): `1.10.0` is above `1.9.0`, a prerelease is below
  its release (`1.0.0-beta.2 < 1.0.0`), prerelease parts compare as numbers or text, and build metadata is ignored
  (`1.0.0+build.5` equals `1.0.0`). A version that is not SemVer (`v2`, `next`) ranks below every SemVer one. Write
  versions without a leading `v`.
- **Anchors** (`releaseAnchors`): `v` + the version with every run of other characters than letters and digits
  turned into `-`: `1.2.0` → `#v1-2-0`, `1.0.0-beta.1` → `#v1-0-0-beta-1`. A repeated version gets `-2`, `-3`, so
  every permalink lands on its own release.
- **Dates** (`formatReleaseDate`) are written in full for the locale (`March 1, 2026`, `1. März 2026`). The day is
  read as written, so every visitor sees the same day whatever their time zone. A date that does not exist
  (`2026-02-30`) throws a `RangeError` at build time instead of showing a wrong day.

## Brand

The page reads these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset, each
falls back to the neutral value in brackets, so the page looks the same as before with no design system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-ink` | the title, the release headings, the version labels, a permalink under the pointer | `oklch(20.5% 0 none)` |
| `--oc-ink-body` | the intro and the changes | `oklch(37.1% 0 none)` |
| `--oc-ink-muted` | the dates | `oklch(43.9% 0 none)` |
| `--oc-ink-subtle` | the permalink icons | `oklch(55.6% 0 none)` |
| `--oc-ink-faint` | the dot before each change (decoration) | `oklch(70.8% 0 none)` |
| `--oc-line-strong` | the outline of a version label | `oklch(87% 0 none)` |
| `--oc-surface-sunk` | a permalink under the pointer | `oklch(97% 0 none)` |
| `--oc-brand` | the newest release's label | `oklch(20.5% 0 none)` |
| `--oc-on-brand` | its text | `#fff` |
| `--oc-focus` | the focus ring | `oklch(20.5% 0 none)` |
| `--oc-radius` | the corners (a version label and a permalink at 1.5 times it) | `0.25rem` |
| `--oc-font-heading` | the title, the release and group headings | the page's font |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark, and checks every pair the page draws) and the
`design-system-seed` skill. To set them by hand, declare them once in your global stylesheet, e.g.
`:root { --oc-ink: #1d2433; --oc-line: #dfe3ea; }`.

## Props

`Changelog`:

| Prop | Type | Default | |
|---|---|---|---|
| `entries` | `ChangelogEntry[]` | | any order |
| `locale` | `string` | `'en'` | the date format |
| `labels` | `Partial<ChangelogLabels>` | English | see below |

## Labels

`CHANGELOG_LABELS` (English, the default) and `CHANGELOG_LABELS_DE`:

| Key | English | German |
|---|---|---|
| `kinds` | Added, Changed, Deprecated, Removed, Fixed, Security | Neu, Geändert, Veraltet, Entfernt, Behoben, Sicherheit |
| `latest` | Latest | Aktuell |
| `permalink` | `` (v) => `Link to version ${v}` `` | `` (v) => `Link zu Version ${v}` `` |

`ChangelogPage` picks the set for its locale.

## Keyboard and screen readers

- The page is one `main` landmark (`id="main"`, the target of a skip link) with exactly one `h1`.
- Each release is an `article` named by its `h2` (the version and the title); each group of changes is an `h3` with
  a list.
- The permalink is a link named "Link to version 2.0.0"; its icon is hidden from screen readers.
- The date is a `time` element with the machine-readable date.

## Client islands

None.

## Notes

- Every colour is a design token (Brand), with every margin and box set on the element, so the page looks the
  same with or without Tailwind's preflight. A word wider than the screen breaks instead of running off it.
- **From 1.x:** the props, the route and `content.ts` are the same; the page draws in your design tokens, and a
  version keeps the kit's monospace (`font-mono`, as code does).
- The newest release (after sorting) carries the "Latest" badge.
