# Coming Soon Page

A page that announces a site or an opening before it is ready, for a Next app: a hero with the launch date, a
newsletter signup and a row of links. It installs as a route folder at `app/page-coming-soon` (served at
`/page-coming-soon`); rename the folder for another path. The page tells search engines not to index it or follow its
links. Everything is a server component with typed content but the signup form, which works with and without
JavaScript.

## Usage

1. Edit `content.ts`: the page's title and description (`META`) and every visible string (`CONTENT`). The sample
   content is invented (Samplework Inc.); keep the shapes and replace the text. The launch date is text in the
   hero's `eyebrow`, written as your visitors read dates.
2. **Replace `subscribe()` in `subscribe.ts`** with a call to your newsletter provider before the site goes live.
   Until then it logs the address in development and refuses in production, so the form says it did not work rather
   than dropping addresses in silence.
3. Pick the language: `LOCALE` in `content.ts` is `'en'` (the default) or `'de'` (the German sample set). Set
   `lang` on `<html>` in your root layout to match.

**The whole site as coming soon:** render the body from your home page, keep it out of search engines there too, and
leave the route out of your sitemap:

```tsx
// app/page.tsx
import type { Metadata } from 'next';
import { ComingSoonPage } from '@/app/page-coming-soon/coming-soon-page';
import { LOCALE, META } from '@/app/page-coming-soon/content';

export const metadata: Metadata = { ...META[LOCALE], robots: { index: false, follow: false } };

export default function Home() {
  return <ComingSoonPage locale={LOCALE} />;
}
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed. On
the day you open, delete the folder (or keep it for the next launch) and remove `robots` from the home page.

## What is inside

| File | |
|---|---|
| `page.tsx` | the route: `metadata` (with `robots: noindex, nofollow`) and the page, in `LOCALE` |
| `coming-soon-page.tsx` | `ComingSoonPage({ locale })`: the hero, the signup and the links; `ComingSoonLinks`: the row of links |
| `actions.ts` | `subscribeAction`, the form's `'use server'` action: checks the address and calls `subscribe` |
| `subscribe.ts` | `subscribe(email)`: **replace it** with your provider |
| `content.ts` | `LOCALE`, `META` and `CONTENT` (English and German) |
| `_sections/hero`, `_sections/newsletter` | copies of `section-hero` 3.0.0 and `blog-newsletter-cta` 2.0.0, byte for byte; each folder has its own README |

The `_sections` folders start with an underscore, so Next never serves them as routes.

## Layouts

The page draws the hero `centered` (no image) and the signup `inline`. Both sections take a `layout` prop; each
section's README lists its layouts (`_sections/<name>/README.md`). To change one, pass another where
`coming-soon-page.tsx` calls the section.

## Brand

The page's own markup, the row of links (`ComingSoonLinks`), reads these design tokens (CSS custom properties of the
Open Context token contract, version 1); each section in `_sections/` reads its own (see its README). Unset, each
falls back to the neutral value in brackets, so the page has a plain neutral look with no design system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-ink` | the links | `oklch(20.5% 0 none)` |
| `--oc-ink-muted` | a link under the pointer | `oklch(43.9% 0 none)` |
| `--oc-focus` | the focus ring | `oklch(20.5% 0 none)` |
| `--oc-radius` | the focus ring's corners | `0.25rem` |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark, and checks every pair the page draws) and the
`design-system-seed` skill.

## Props

`ComingSoonLinks`:

| Prop | Type | Default | |
|---|---|---|---|
| `label` | `string` | | the row's accessible name (`content.links.label`) |
| `links` | `LinkItem[]` | | `{ href, label }`, drawn through Next's `Link`; an empty list draws nothing |
| `className` | `string` | | added to the `nav` |

## Labels

The signup's labels come from `_sections/newsletter/labels.ts` (English) and `labels.de.ts` (German), picked by the
locale; every other string comes from `content.ts`. The signup's "did not work" message is what visitors see until
you replace `subscribe()`.

## Keyboard and screen readers

- The page is one `main` landmark (`id="main"`, the target of a skip link) with exactly one `h1`, the hero's title.
- The signup is a region named by its heading; its field has a label, its result is announced (`role="status"`).
- The row of links is a `nav` named by `content.links.label`; each link has a visible focus ring.

## Client islands

`_sections/newsletter/newsletter-form.tsx` (the signup form, as `blog-newsletter-cta` ships it). Without JavaScript
the browser posts the form to the server action, and the page comes back with the result; the address never appears
in the URL.

## Notes

- No clock runs on the page: the launch date is text, so the page is the same for every visitor and needs no
  JavaScript to show it.
- Every colour is a design token (Brand), with every margin and box set on the element, so the page looks the same
  with or without Tailwind's preflight. A word wider than the screen breaks instead of running off it.
- `subscribe.ts` is the only file that reads `process.env` (`NODE_ENV`). Keep your provider's key in your own
  configuration, never in the file.

## From 1.x

2.0.0 is a new page, not an update of 1.x: the route, the content and the look are all new.

- It installs at `app/page-coming-soon` (1.x: `app/coming-soon`); rename the folder to keep your old path.
- No countdown: 1.x ran a client clock to the launch date; the date is now text, so the page ships no clock (update
  the date, or take the page down, when it passes).
- No gradient or fixed dark look: the colours come from your design tokens (no `lucide-react`, no `cn` helper).
- The signup posts to the page's own server action (`actions.ts` → `subscribe.ts`) and works without JavaScript;
  1.x called a function in the browser that only logged the address.
- The page now says `noindex, nofollow` to search engines.
