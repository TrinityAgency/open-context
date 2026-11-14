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

- Neutral colours only, with every margin and box set on the element, so the page looks the same with or without
  Tailwind's preflight.
- On a wide screen, field names and values sit in two columns; on a phone, each value sits under its name.
