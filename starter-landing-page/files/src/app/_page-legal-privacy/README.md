# Privacy Policy Page

> Structure and placeholders only. The text of this page must come from the site's owner or their counsel; nothing
> here is legal advice.

A privacy policy page for a Next app: the title, the date of the last update, an intro, a table of contents and one
section per topic, each with an optional "in short" summary. Every `[[…]]` in the text is a placeholder, highlighted
on the page until it is replaced. It installs as a route folder at `app/page-legal-privacy` (served at
`/page-legal-privacy`); rename the folder for another path, e.g. `app/privacy`. Everything is a server component, so
the page ships no JavaScript of its own.

## Usage

1. Have the text written or checked by whoever answers for it, then put it into `content.ts`: `updatedAt`
   (`YYYY-MM-DD`), the intro and the sections. The sample shows a common structure; add, remove and rename sections
   freely.
2. Replace every `[[…]]`. A placeholder left in the text stays visibly highlighted and is announced as
   "Placeholder:" to screen readers.
3. Pick the language: `LOCALE` in `content.ts` is `'en'` (the default) or `'de'` (the German sample and labels). Set
   `lang` on `<html>` in your root layout to match.

A section is `{ id, title, summary?, body }`. `id` is its anchor (`#cookies`); `body` and `summary` are plain text,
with a blank line between paragraphs.

The page body is `PrivacyPage({ locale })` in `legal-document.tsx`; `page.tsx` only renders it with `LOCALE`. A site
that keeps its locale elsewhere renders the body itself:

```tsx
import { PrivacyPage } from '@/app/page-legal-privacy/legal-document';

export default function Privacy() {
  return <PrivacyPage locale="de" />;
}
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

## Placeholders

A placeholder is `[[`, one or more characters that are not `[`, `]` or a line break, then `]]`. Anything else (an
unclosed `[[`, a lone `]]`, an empty `[[]]`, a marker across a line break) shows as plain text, with no character
lost. `placeholders.ts` exports `hasPlaceholders(value)`, which finds a marker anywhere in your content: use it in a
test, so a release with a placeholder left in the legal text fails.

```ts
import { CONTENT } from '@/app/page-legal-privacy/content';
import { hasPlaceholders } from '@/app/page-legal-privacy/placeholders';

expect(hasPlaceholders(CONTENT)).toBe(false);
```

## Brand

The page reads these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset, each
falls back to the neutral value in brackets, so the page looks the same as before with no design system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-ink` | the title, the headings, the contents links, "In short", a placeholder's text | `oklch(20.5% 0 none)` |
| `--oc-ink-body` | the text | `oklch(37.1% 0 none)` |
| `--oc-ink-muted` | the date, a link under the pointer | `oklch(43.9% 0 none)` |
| `--oc-surface-sunk` | the "In short" box | `oklch(97% 0 none)` |
| `--oc-line` | the contents' border, a placeholder's highlight | `oklch(92.2% 0 none)` |
| `--oc-focus` | the focus ring | `oklch(20.5% 0 none)` |
| `--oc-radius` | the corners (the contents and the box at twice it) | `0.25rem` |
| `--oc-font-heading` | the title and the section headings | the page's font |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark, and checks every pair the page draws) and the
`design-system-seed` skill. To set them by hand, declare them once in your global stylesheet, e.g.
`:root { --oc-ink: #1d2433; --oc-line: #dfe3ea; }`.

## Props

`PrivacyDocument`:

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `PrivacyContent` | | `{ title, updatedAt, intro, sections: { id, title, summary?, body }[] }` |
| `labels` | `Partial<PrivacyLabels>` | English | see below |
| `locale` | `string` | `'en'` | the date format |

## Labels

`PRIVACY_LABELS` (English, the default) and `PRIVACY_LABELS_DE`:

| Key | English | German |
|---|---|---|
| `placeholder` | Placeholder: | Platzhalter: |
| `contents` | Contents | Inhalt |
| `inShort` | In short | Kurz gesagt |
| `updated` | Last updated | Stand |

`PrivacyPage` picks the set for its locale.

## Keyboard and screen readers

- The page is one `main` landmark (`id="main"`, the target of a skip link) with exactly one `h1`.
- The table of contents is a `nav` named "Contents" with a numbered list of links; each section is a region named
  by its `h2`, which carries the anchor.
- A placeholder is a `mark`, announced after a hidden "Placeholder:".

## Client islands

None.

## Notes

- Every colour is a design token (Brand), with every margin and box set on the element, so the page looks the
  same with or without Tailwind's preflight. A word wider than the screen breaks instead of running off it.
- **From 1.x:** the props, the route and `content.ts` are the same; the page draws in your design tokens.
- `updatedAt` must be a real date (`YYYY-MM-DD`): an impossible one fails the build instead of showing a wrong day.
