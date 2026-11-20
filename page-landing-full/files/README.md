# Landing Page (Full)

A full landing page for a Next app: a hero, a row of logos, features, figures, testimonials, plans and prices,
questions and a call to action. It installs as a route folder at `app/page-landing-full` (served at
`/page-landing-full`); rename the folder for another path, or move its files to `app/` to make it the home page.
The sections are server components with typed content, and the pricing switch is plain CSS, so the whole page
renders on the server and ships no JavaScript of its own.

## Usage

1. Edit `content.ts`: the page's title and description (`META`) and every visible string (`CONTENT`). The sample
   content is invented (Samplework Inc.); keep the shapes and replace the text, the pictures and the plans.
2. Pick the language: `LOCALE` in `content.ts` is `'en'` (the default) or `'de'` (the German sample set). It also
   picks the pricing labels and the way prices are written (`$29.50` or `29,50 €`). Set `lang` on `<html>` in your
   root layout to match.

Prices are minor units with an ISO currency code (`priceMinor: 2950, currency: 'USD'` is $29.50, and a whole
amount shows no decimals: `2900` is $29; a zero-decimal currency such as JPY counts whole units). A price of `0`
shows the "free" label. Plans in more than one interval
(month, year, once) get a switch.

The page body is `LandingPage({ locale })` in `landing-page.tsx`; `page.tsx` only renders it with `LOCALE`. A site
that keeps its locale elsewhere renders the body itself:

```tsx
import { LandingPage } from '@/app/page-landing-full/landing-page';

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
| `_sections/<name>` | copies of `section-hero`, `-logo-cloud`, `-features`, `-stats`, `-testimonials`, `-pricing`, `-faq` and `-cta` 3.0.0, byte for byte; each folder has its own README |

The `_sections` folders start with an underscore, so Next never serves them as routes. The sections carry the ids
`features`, `pricing`, `faq` and `contact`, so links such as `#pricing` jump to them.

## Layouts

Every section takes a `layout` prop; each section's README lists its layouts (`_sections/<name>/README.md`). Leaving
it out draws what 1.x drew, so this page looks as before. To change one, pass it where `landing-page.tsx` calls the
section, e.g. `<StatsSection layout="band" content={c.stats} />`.

## Brand

The page draws nothing of its own: each section in `_sections/` reads the design tokens of the Open Context token
contract (version 1; see its README). Unset, each falls back to its neutral value, so the page looks the same as
before with no design system loaded.

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark, and checks every pair the page draws) and the
`design-system-seed` skill.

## Labels

The pricing section's fixed strings (the switch, "per month", "Most popular", "Free") come from its label sets:
`landing-page.tsx` passes `PRICING_LABELS` or `PRICING_LABELS_DE` by locale. Everything else comes from
`content.ts`.

## Keyboard and screen readers

- The page is one `main` landmark (`id="main"`, the target of a skip link) with exactly one `h1`, the hero's title.
- Each section is a region named by its `h2`.
- The pricing switch is a `fieldset` of radio buttons: arrow keys move between intervals.
- The questions are native `details` elements: Enter or Space opens one.

## Client islands

None.

## Notes

- Every colour is a design token (Brand), with every margin and box set on the element, so the page looks the
  same with or without Tailwind's preflight. A word wider than the screen breaks instead of running off it.
- **From 1.x:** the props, the route and `content.ts` are the same; the sections draw in your design tokens, and every
  section takes `layout`.
- The sample pictures and logos are inline SVG, so the page loads nothing from another host. Replace them with your
  own files; with `next/image`, pass an `ImageComponent` to the sections that show images (see their READMEs).
- To change a section beyond its content, edit its copy under `_sections/`; it is your code now.
