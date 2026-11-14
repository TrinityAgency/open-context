# Landing Page (Short)

A short landing page for a Next app: a hero, three features and a call to action. It installs as a route folder at
`app/page-landing-hero` (served at `/page-landing-hero`); rename the folder for another path, or move its files to
`app/` to make it the home page. The sections are server components with typed content, so the whole page renders
on the server and ships no JavaScript of its own.

## Usage

1. Edit `content.ts`: the page's title and description (`META`) and every visible string (`CONTENT`). The sample
   content is invented (Samplework Inc.); keep the shapes and replace the text.
2. Pick the language: `LOCALE` in `content.ts` is `'en'` (the default) or `'de'` (the German sample set). Set
   `lang` on `<html>` in your root layout to match.

The page body is `LandingPage({ locale })` in `landing-page.tsx`; `page.tsx` only renders it with `LOCALE`. A site
that keeps its locale elsewhere renders the body itself:

```tsx
import { LandingPage } from '@/app/page-landing-hero/landing-page';

export default function Home() {
  return <LandingPage locale="de" />;
}
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

## What is inside

| File | |
|---|---|
| `page.tsx` | the route: `metadata` and the page, in `LOCALE` |
| `landing-page.tsx` | `LandingPage({ locale })`: the sections in order, with Next's `Link` for their links |
| `content.ts` | `LOCALE`, `META` and `CONTENT` (English and German) |
| `_sections/hero`, `_sections/features`, `_sections/cta` | copies of `section-hero`, `section-features` and `section-cta` 2.0.0, byte for byte; each folder has its own README |

The `_sections` folders start with an underscore, so Next never serves them as routes. The sections carry the ids
`features` and `contact`, so links such as `#contact` jump to them.

## Labels

None: every string on the page comes from `content.ts`.

## Keyboard and screen readers

- The page is one `main` landmark (`id="main"`, the target of a skip link) with exactly one `h1`, the hero's title.
- Each section is a region named by its `h2`.
- The calls to action are ordinary links in reading order, with a visible focus ring.

## Client islands

None.

## Notes

- Neutral colours only, with every margin and box set on the element, so the page looks the same with or without
  Tailwind's preflight.
- To change a section beyond its content, edit its copy under `_sections/`; it is your code now. Installing the
  section on its own (`section-hero`, …) gives you its README and a separate copy instead.
