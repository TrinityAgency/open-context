# Careers Page

A careers page for a Next app: a hero, why people work with you, the open positions, how you hire and a call to
action. Each position opens in place (a native `details`) with its description, its requirements and an apply link.
It installs as a route folder at `app/page-careers` (served at `/page-careers`); rename the folder for another path,
e.g. `app/careers`. Everything is a server component with typed content, so the page renders on the server and ships
no JavaScript of its own.

## Usage

1. Edit `content.ts`: the page's title and description (`META`) and every visible string (`CONTENT`). The sample
   content is invented (Samplework Inc.); keep the shapes and replace the text.
2. Pick the language: `LOCALE` in `content.ts` is `'en'` (the default) or `'de'` (the German sample set). Set
   `lang` on `<html>` in your root layout to match.

The positions are `CONTENT[locale].openings.items`, each a `JobOpening`:

```ts
type JobOpening = {
  id: string; // `#<id>` scrolls to it: a letter first, then letters, digits and hyphens
  title: string;
  location?: string; // shown with `kind` in one line under the title
  kind?: string; // e.g. "Full-time"
  description: string[]; // one paragraph per entry
  requirements?: string[]; // a list under `requirementsLabel`
  apply: { href: string; label: string }; // an email address, your form or a job board
};
```

With no positions (`items: []`) the page shows `openings.noOpenings` in their place and keeps everything else. The
hero's call links to `#openings`, the section of positions. A link to `/page-careers#<id>` scrolls to that position,
still closed; the visitor opens it. Each `id` must be unique on the page and none of the page's own ids: `main`,
`benefits`, `openings`, `hiring` and `contact`.

The page body is `CareersPage({ locale })` in `careers-page.tsx`; `page.tsx` only renders it with `LOCALE`. A site
that keeps its locale elsewhere renders the body itself:

```tsx
import { CareersPage } from '@/app/page-careers/careers-page';

export default function Careers() {
  return <CareersPage locale="de" />;
}
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

## What is inside

| File | |
|---|---|
| `page.tsx` | the route: `metadata` and the page, in `LOCALE` |
| `careers-page.tsx` | `CareersPage({ locale })`: the sections in order, with Next's `Link` for links |
| `openings.tsx` | `OpeningsSection`: the open positions as an accordion, or the text for none |
| `content.ts` | `LOCALE`, `META`, `CONTENT` (English and German) and the `JobOpening` type |
| `_sections/hero`, `_sections/features`, `_sections/process`, `_sections/cta` | copies of `section-hero`, `section-features` and `section-cta` 3.0.0 and `section-process` 1.0.0, byte for byte; each folder has its own README |
| `_parts/accordion` | a copy of `component-accordion` 2.0.0 |

The `_sections` and `_parts` folders start with an underscore, so Next never serves them as routes.

## Layouts

The page draws the hero `centered`, the reasons to join as a `grid`, the hiring steps as `rows` (each step's number
beside its text) and the call to action `centered`. Every section takes a `layout` prop; each section's README lists
its layouts (`_sections/<name>/README.md`). To change one, pass another where `careers-page.tsx` calls the section,
e.g. `<ProcessSection layout="grid" … />`.

## Brand

The page's own markup, the positions (`openings.tsx`), reads these design tokens (CSS custom properties of the Open
Context token contract, version 1); each section in `_sections/` and the accordion read their own (see their
READMEs). Unset, each falls back to the neutral value in brackets, so the page has a plain neutral look with no design
system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-ink` | the heading, the requirements' label | `oklch(20.5% 0 none)` |
| `--oc-ink-body` | the intro, the descriptions, the requirements, the text for no positions | `oklch(37.1% 0 none)` |
| `--oc-ink-muted` | a position's place and kind | `oklch(43.9% 0 none)` |
| `--oc-brand`, `--oc-on-brand` | the apply button and its label | `oklch(20.5% 0 none)`, `#fff` |
| `--oc-brand-hover` | the apply button under the pointer | `oklch(37.1% 0 none)` |
| `--oc-focus` | the focus ring | `oklch(20.5% 0 none)` |
| `--oc-radius` | the apply button's corners (1.5 times it) | `0.25rem` |
| `--oc-font-heading` | the heading and each position's title | the page's font |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark, and checks every pair the page draws) and the
`design-system-seed` skill.

## Props

`OpeningsSection`:

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `{ title, intro?, requirementsLabel, noOpenings, items: JobOpening[] }` | | an empty `items` shows `noOpenings` |
| `LinkComponent` | `LinkComponent` | plain `a` | renders the apply links, e.g. `next/link` |
| `id` | `string` | | the section's id (`openings` on the page) |
| `className` | `string` | | added to the section |

## Labels

None: every string on the page comes from `content.ts`.

## Keyboard and screen readers

- The page is one `main` landmark (`id="main"`, the target of a skip link) with exactly one `h1`, the hero's title.
- Each section is a region named by its `h2`; the hiring steps are an ordered list.
- Each position is a native `details`: Tab reaches its title, Enter or Space opens and closes it, with no
  JavaScript; the apply link inside is an ordinary link with a visible focus ring. Give each apply link its own text
  ("Apply as site lead"), so a list of links still says which position each one is for.

## Client islands

None.

## Notes

- Every colour is a design token (Brand), with every margin and box set on the element, so the page looks the same
  with or without Tailwind's preflight. A word wider than the screen breaks instead of running off it, in a title,
  a description and the apply button alike.
- To change a section beyond its content, edit its copy under `_sections/`; it is your code now.

## From 1.x

2.0.0 is a new page, not an update of 1.x: the route, the content and the look are all new.

- It installs at `app/page-careers` (1.x: `app/careers`); rename the folder to keep your old path.
- No filters and no search: a small company's few positions need none, and the page ships no client JavaScript.
- No dialog per position: each opens in place, and `#<id>` scrolls to it (closed). Apply by its link.
- 1.x's `Job` fields: `applyUrl` is now `apply: { href, label }`, `type` is `kind`, `shortDescription` and
  `fullDescription` become the paragraphs of `description`, `location` and `requirements` stay. `department` is
  gone (put it in `kind`, e.g. "Workshop, full-time", if you need it), and so are the per-position `benefits` (the
  reasons to join are one section for every position) and the posting dates.
- The look comes from your design tokens (no `lucide-react`, no `cn` helper, no dark-mode classes).
