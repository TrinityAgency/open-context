# Not-Found and Error Pages

The two pages a Next app shows when something is missing or breaks, each with a way onward: a not-found page with
links to where a visitor can go next, and an error page with a "Try again" button, a link home and a reference a
visitor can quote when they ask for help. The views install at `app/page-404-error`; two one-line route files make
them the app's not-found and error pages.

## Usage

Create these two files next to the folder, in your app's root:

```tsx
// app/not-found.tsx
export { default } from './page-404-error/not-found-page';
```

```tsx
// app/error.tsx
'use client';
export { default } from './page-404-error/error-page';
```

Then:

1. Edit `content.ts`: the not-found page's title, text and links (`NOT_FOUND`), and the error page's title, text and
   home link (`ERROR`). Point the links at pages your site has.
2. Pick the language: `LOCALE` in `content.ts` is `'en'` (the default) or `'de'` (the German content and labels). Set
   `lang` on `<html>` in your root layout to match.

The folder holds no `page.tsx`, so it is not a route of its own: nothing is served at `/page-404-error`.

A site that keeps its locale elsewhere renders the views with it instead:

```tsx
// app/not-found.tsx
import { NotFoundPage } from '@/app/page-404-error/not-found-view';

export default function NotFound() {
  return <NotFoundPage locale="de" />;
}
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

## What is inside

| File | |
|---|---|
| `not-found-page.tsx` | the default export for `app/not-found.tsx`, in `LOCALE` |
| `error-page.tsx` | the default export for `app/error.tsx`, in `LOCALE` (`'use client'`) |
| `not-found-view.tsx` | `NotFoundView` and `NotFoundPage({ locale })` |
| `error-view.tsx` | `ErrorView` and `ErrorPage({ locale, error, reset })` (`'use client'`) |
| `labels.ts`, `labels.de.ts` | the error page's fixed strings, English and German |
| `site-types.ts` | the kit's shared types these pages use (`LinkItem`, `LinkComponent`) |
| `content.ts` | `LOCALE`, `NOT_FOUND` and `ERROR` (English and German) |

## Brand

The page reads these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset, each
falls back to the neutral value in brackets, so the page looks the same as before with no design system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-ink` | the titles, the links, the reference | `oklch(20.5% 0 none)` |
| `--oc-ink-body` | the text | `oklch(37.1% 0 none)` |
| `--oc-ink-muted` | "Reference", a link under the pointer | `oklch(43.9% 0 none)` |
| `--oc-brand` | Try again | `oklch(20.5% 0 none)` |
| `--oc-brand-hover` | Try again under the pointer | `oklch(37.1% 0 none)` |
| `--oc-on-brand` | the label of Try again | `#fff` |
| `--oc-focus` | the focus ring | `oklch(20.5% 0 none)` |
| `--oc-radius` | the corners (Try again at 1.5 times it) | `0.25rem` |
| `--oc-font-heading` | the titles | the page's font |
| `--oc-font-body` | the label of Try again | the page's font |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark, and checks every pair the page draws) and the
`design-system-seed` skill. To set them by hand, declare them once in your global stylesheet, e.g.
`:root { --oc-ink: #1d2433; --oc-line: #dfe3ea; }`.

## Props

`NotFoundView`:

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `{ title, text, linksLabel, links: LinkItem[] }` | | `linksLabel` names the list of links for screen readers |
| `LinkComponent` | `LinkComponent` | plain `a` | e.g. `next/link` |

`ErrorView`:

| Prop | Type | Default | |
|---|---|---|---|
| `error` | `Error & { digest?: string }` | | from Next; only the digest is shown |
| `reset` | `() => void` | | from Next; the "Try again" button calls it |
| `content` | `{ title, text, home: LinkItem }` | | |
| `labels` | `Partial<ErrorLabels>` | English | see below |
| `LinkComponent` | `LinkComponent` | plain `a` | e.g. `next/link` |

The error page never shows the error's message: in production Next replaces it anyway, and it can hold details a
visitor should not see. The digest it shows matches the line Next writes to the server log.

## Labels

`ERROR_LABELS` (English, the default) and `ERROR_LABELS_DE`: `tryAgain` (Try again / Erneut versuchen) and
`reference` (Reference / Referenz). `ErrorPage` picks the set for its locale; the not-found page has no fixed
strings.

## Keyboard and screen readers

- Each page is one `main` landmark (`id="main"`, the target of a skip link) with exactly one `h1`.
- The not-found page's links are a `nav` named by `linksLabel`.
- "Try again" is a native button; the home link follows it.

## Client islands

`error-view.tsx` and `error-page.tsx` (`'use client'`), because Next renders `error.tsx` on the client. The
not-found page is a server component.

## Notes

- Every colour is a design token (Brand), with every margin and box set on the element, so the page looks the
  same with or without Tailwind's preflight. A word wider than the screen breaks instead of running off it.
- **From 1.x:** the views, their props and the two route files are the same; the views draw in your design
  tokens, and a long label of Try again wraps inside the button.
- An unknown URL answers with HTTP status 404 and the not-found page.
