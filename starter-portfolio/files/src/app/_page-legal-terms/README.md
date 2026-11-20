# Terms Page

> Structure and placeholders only. The text of this page must come from the site's owner or their counsel; nothing
> here is legal advice.

A terms page for a Next app: the title, the date of the last update, an intro, a table of contents and one
collapsible section per topic (native `details`). Every `[[…]]` in the text is a placeholder, highlighted on the page
until it is replaced. It installs as a route folder at `app/page-legal-terms` (served at `/page-legal-terms`);
rename the folder for another path, e.g. `app/terms`. Everything is a server component, so the page ships no
JavaScript of its own.

## Usage

1. Have the text written or checked by whoever answers for it, then put it into `content.ts`: `updatedAt`
   (`YYYY-MM-DD`), the intro and the sections. The sample shows a common structure; add, remove and rename sections
   freely.
2. Replace every `[[…]]`. A placeholder left in the text stays visibly highlighted and is announced as
   "Placeholder:" to screen readers.
3. Pick the language: `LOCALE` in `content.ts` is `'en'` (the default) or `'de'` (the German sample and labels). Set
   `lang` on `<html>` in your root layout to match.

A section is `{ id, title, body }`. `id` is its anchor: a link to `#payment` (from the table of contents or another
page) opens that section and scrolls to it, with no JavaScript, because the anchor sits at the start of the
section's content and the browser reveals a closed `details` whose content is the target.

The page body is `TermsPage({ locale })` in `legal-document.tsx`; `page.tsx` only renders it with `LOCALE`. A site
that keeps its locale elsewhere renders the body itself:

```tsx
import { TermsPage } from '@/app/page-legal-terms/legal-document';

export default function Terms() {
  return <TermsPage locale="de" />;
}
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

## Placeholders

A placeholder is `[[`, one or more characters that are not `[`, `]` or a line break, then `]]`. Anything else (an
unclosed `[[`, a lone `]]`, an empty `[[]]`, a marker across a line break) shows as plain text, with no character
lost. `placeholders.ts` exports `hasPlaceholders(value)`, which finds a marker anywhere in your content: use it in a
test, so a release with a placeholder left in the legal text fails.

```ts
import { CONTENT } from '@/app/page-legal-terms/content';
import { hasPlaceholders } from '@/app/page-legal-terms/placeholders';

expect(hasPlaceholders(CONTENT)).toBe(false);
```

## Brand

The page reads these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset, each
falls back to the neutral value in brackets, so the page looks the same as before with no design system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-ink` | the title, the headings, the contents links, a placeholder's text | `oklch(20.5% 0 none)` |
| `--oc-ink-body` | the text | `oklch(37.1% 0 none)` |
| `--oc-ink-muted` | the date, a link under the pointer | `oklch(43.9% 0 none)` |
| `--oc-ink-subtle` | the chevron of each section | `oklch(55.6% 0 none)` |
| `--oc-line` | the contents' border, the rules between sections, a placeholder's highlight | `oklch(92.2% 0 none)` |
| `--oc-focus` | the focus ring | `oklch(20.5% 0 none)` |
| `--oc-radius` | the corners (the contents at twice it) | `0.25rem` |
| `--oc-font-heading` | the title and the section headings | the page's font |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark, and checks every pair the page draws) and the
`design-system-seed` skill. To set them by hand, declare them once in your global stylesheet, e.g.
`:root { --oc-ink: #1d2433; --oc-line: #dfe3ea; }`.

## Props

`TermsDocument`:

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `TermsContent` | | `{ title, updatedAt, intro, sections: { id, title, body }[] }` |
| `labels` | `Partial<TermsLabels>` | English | see below |
| `locale` | `string` | `'en'` | the date format |

## Labels

`TERMS_LABELS` (English, the default) and `TERMS_LABELS_DE`:

| Key | English | German |
|---|---|---|
| `placeholder` | Placeholder: | Platzhalter: |
| `contents` | Contents | Inhalt |
| `updated` | Last updated | Stand |

`TermsPage` picks the set for its locale.

## Keyboard and screen readers

- The page is one `main` landmark (`id="main"`, the target of a skip link) with exactly one `h1`.
- The table of contents is a `nav` named "Contents" with a numbered list of links.
- Each section is a native `details`: Tab reaches its summary (an `h2`), Enter or Space opens and closes it.
- A placeholder is a `mark`, announced after a hidden "Placeholder:".

## Client islands

None.

## Notes

- Every colour is a design token (Brand), with every margin and box set on the element, so the page looks the
  same with or without Tailwind's preflight. A word wider than the screen breaks instead of running off it.
- **From 1.x:** the props, the route and `content.ts` are the same; the page draws in your design tokens.
- Browser find-in-page also opens a closed section when it finds a match inside it.
- `updatedAt` must be a real date (`YYYY-MM-DD`): an impossible one fails the build instead of showing a wrong day.
