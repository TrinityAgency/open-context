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

- Neutral colours only, with every margin and box set on the element, so the pages look the same with or without
  Tailwind's preflight.
- An unknown URL answers with HTTP status 404 and the not-found page.
