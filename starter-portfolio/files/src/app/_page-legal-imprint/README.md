# Imprint Page

> Structure and placeholders only. The text of this page must come from the site's owner or their counsel; nothing
> here is legal advice.

An imprint page (Impressum) for a Next app: the provider identification fields that German and Austrian sites
commonly show, in groups, every value a `[[…]]` placeholder that stays highlighted until it is replaced. It installs
as a route folder at `app/page-legal-imprint` (served at `/page-legal-imprint`); rename the folder for another path,
e.g. `app/imprint`. Everything is a server component, so the page ships no JavaScript of its own.

## Usage

1. Find out which fields apply to you, then fill them in `content.ts` and delete the rest. The groups:
   - the provider: name and legal form, address, representatives
   - contact
   - register and tax: register court and number, or Firmenbuch court and number in Austria; VAT ID, or UID number
     in Austria
   - supervision and profession
   - responsibility for the content (§ 18 Abs. 2 MStV)
   - Austria only: business purpose, and disclosure under § 25 MedienG
   - consumer dispute resolution
2. Replace every `[[…]]`. A placeholder left in the text stays visibly highlighted and is announced as
   "Placeholder:" to screen readers.
3. Pick the language: `LOCALE` in `content.ts` is `'en'` (the default, "Imprint") or `'de'` ("Impressum", with the
   field names in German). Set `lang` on `<html>` in your root layout to match.

A group is `{ title, entries: { label, value }[], note? }`. A value is plain text; a blank line starts a new
paragraph.

The page body is `ImprintPage({ locale })` in `legal-document.tsx`; `page.tsx` only renders it with `LOCALE`. A site
that keeps its locale elsewhere renders the body itself:

```tsx
import { ImprintPage } from '@/app/page-legal-imprint/legal-document';

export default function Imprint() {
  return <ImprintPage locale="de" />;
}
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

## Placeholders

A placeholder is `[[`, one or more characters that are not `[`, `]` or a line break, then `]]`. Anything else (an
unclosed `[[`, a lone `]]`, an empty `[[]]`, a marker across a line break) shows as plain text, with no character
lost. `placeholders.ts` exports `hasPlaceholders(value)`, which finds a marker anywhere in your content: use it in a
test, so a release with a placeholder left in the imprint fails.

```ts
import { CONTENT } from '@/app/page-legal-imprint/content';
import { hasPlaceholders } from '@/app/page-legal-imprint/placeholders';

expect(hasPlaceholders(CONTENT)).toBe(false);
```

## Brand

The page reads these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset, each
falls back to the neutral value in brackets, so the page looks the same as before with no design system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-ink` | the title, the headings, a placeholder's text | `oklch(20.5% 0 none)` |
| `--oc-ink-body` | the text | `oklch(37.1% 0 none)` |
| `--oc-ink-muted` | the field names | `oklch(43.9% 0 none)` |
| `--oc-line` | a placeholder's highlight | `oklch(92.2% 0 none)` |
| `--oc-radius` | a placeholder's corners | `0.25rem` |
| `--oc-font-heading` | the title and the group headings | the page's font |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark, and checks every pair the page draws) and the
`design-system-seed` skill. To set them by hand, declare them once in your global stylesheet, e.g.
`:root { --oc-ink: #1d2433; --oc-line: #dfe3ea; }`.

## Props

`ImprintDocument`:

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `ImprintContent` | | `{ title, groups: { title, entries: { label, value }[], note? }[] }` |
| `labels` | `Partial<ImprintLabels>` | English | see below |

## Labels

`IMPRINT_LABELS` (English, the default) and `IMPRINT_LABELS_DE`: `placeholder` (Placeholder: / Platzhalter:).
`ImprintPage` picks the set for its locale.

## Keyboard and screen readers

- The page is one `main` landmark (`id="main"`, the target of a skip link) with exactly one `h1`.
- Each group is an `h2` with a description list: field names are `dt`, values `dd`.
- A placeholder is a `mark`, announced after a hidden "Placeholder:".

## Client islands

None.

## Notes

- Every colour is a design token (Brand), with every margin and box set on the element, so the page looks the
  same with or without Tailwind's preflight. A word wider than the screen breaks instead of running off it.
- **From 1.x:** the props, the route and `content.ts` are the same; the page draws in your design tokens.
- On a wide screen, field names and values sit in two columns; on a phone, each value sits under its name.
