# FAQ Page

A page of frequently asked questions for a Next app: a hero, a list of the topics, one section of questions per
topic, a call to action, and the questions once more as schema.org `FAQPage` data for search engines. It installs as
a route folder at `app/page-faq` (served at `/page-faq`); rename the folder for another path, e.g. `app/faq`.
Everything is a server component with typed content, so the page renders on the server and ships no JavaScript of its
own.

## Usage

1. Edit `content.ts`: the page's title and description (`META`) and every visible string (`CONTENT`). The sample
   content is invented (Samplework Inc.); keep the shapes and replace the text.
2. Pick the language: `LOCALE` in `content.ts` is `'en'` (the default) or `'de'` (the German sample set). Set
   `lang` on `<html>` in your root layout to match.

The questions are grouped in `categories`, each `{ id, title, intro?, items }`, where an item is
`{ question, answer }` and a blank line in an answer starts a new paragraph. Each category becomes a section whose
`id` is the category's, so the topic list (and any other page) links to it as `/page-faq#prices`. An `id` starts with
a letter and holds letters, digits and hyphens; keep it when you translate the title. Each `id` must be unique on the
page and none of the page's own ids, `main` (the page) and `contact` (the call to action): a category `contact` would
take the link meant for the call to action. With one category the page draws no topic list.

The page body is `FaqPage({ locale })` in `faq-page.tsx`; `page.tsx` only renders it with `LOCALE`. A site that keeps
its locale elsewhere renders the body itself:

```tsx
import { FaqPage } from '@/app/page-faq/faq-page';

export default function Questions() {
  return <FaqPage locale="de" />;
}
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

## What is inside

| File | |
|---|---|
| `page.tsx` | the route: `metadata` and the page, in `LOCALE` |
| `faq-page.tsx` | `FaqPage({ locale })`: the hero, the topic list, a section per category, the call to action and the `FAQPage` data |
| `category-nav.tsx` | `CategoryNav`: the topic list, a link to each category's section |
| `content.ts` | `LOCALE`, `META` and `CONTENT` (English and German) |
| `_sections/hero`, `_sections/faq`, `_sections/cta` | copies of `section-hero` and `section-cta` 3.0.0 and `section-faq` 3.0.1, byte for byte; each folder has its own README |
| `_parts/site-seo` | a copy of `site-seo` 1.0.0: `faqPageJsonLd` and `JsonLd` write the structured data |

The `_sections` and `_parts` folders start with an underscore, so Next never serves them as routes.

## Layouts

The page draws the hero `centered` (no image), each category's questions `split` (the topic's title and intro beside
its questions from `lg`, above them below it) and the call to action `centered`. Every section takes a `layout` prop;
each section's README lists its layouts (`_sections/<name>/README.md`). To change one, pass another where
`faq-page.tsx` calls the section, e.g. `layout="centered"` on `FaqSection` for one column of questions.

## Brand

The page's own markup, the topic list (`category-nav.tsx`), reads these design tokens (CSS custom properties of the
Open Context token contract, version 1); each section in `_sections/` reads its own (see its README). Unset, each
falls back to the neutral value in brackets, so the page has a plain neutral look with no design system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-ink` | the topic links | `oklch(20.5% 0 none)` |
| `--oc-ink-muted` | a topic link under the pointer | `oklch(43.9% 0 none)` |
| `--oc-focus` | the focus ring | `oklch(20.5% 0 none)` |
| `--oc-radius` | the focus ring's corners | `0.25rem` |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark, and checks every pair the page draws) and the
`design-system-seed` skill.

## Props

`CategoryNav`:

| Prop | Type | Default | |
|---|---|---|---|
| `label` | `string` | | the list's accessible name (`content.nav`) |
| `categories` | `{ id, title }[]` | | one link per category, to `#<id>`; fewer than two draw nothing |
| `className` | `string` | | added to the `nav` |

## Labels

None: every string on the page comes from `content.ts`.

## Keyboard and screen readers

- The page is one `main` landmark (`id="main"`, the target of a skip link) with exactly one `h1`, the hero's title.
- The topic list is a `nav` named by `content.nav`; its links are ordinary links with a visible focus ring, and
  following one moves to that topic's section.
- Each category is a region named by its `h2`. Each question is a native `details`: Tab reaches it, Enter or Space
  opens and closes the answer, with no JavaScript.
- A browser's find-in-page searches the questions; Chromium-based browsers also search the closed answers and open
  the one that matches.

## Client islands

None.

## Notes

- The `FAQPage` data holds every question and answer of every category, once per page, as search engines expect.
  `<`, `>` and `&` are written escaped, so no answer can end the script element.
- Every colour is a design token (Brand), with every margin and box set on the element, so the page looks the same
  with or without Tailwind's preflight. A word wider than the screen breaks instead of running off it.
- To change a section beyond its content, edit its copy under `_sections/`; it is your code now.

## From 1.x

2.0.0 is a new page, not an update of 1.x: the route, the content and the look are all new.

- It installs at `app/page-faq` (1.x: `app/faq`); rename the folder to keep your old path.
- The questions moved from a list in the page into `content.ts`, grouped by category, in English and German.
- The search box and the category filter are gone, and with them the page's client JavaScript: the answers are
  native `details`, find-in-page searches them, and each category is a section the topic list links to.
- The look comes from your design tokens (no `lucide-react`, no `cn` helper, no dark-mode classes; a design system
  with a dark theme switches the tokens), and the page adds `FAQPage` structured data.
