# Pricing Page

A pricing page for a Next app: a header, the plans with an interval switch (monthly, yearly, one-time), a table
comparing the plans feature by feature, questions about pricing and a call to action. It installs as a route folder
at `app/page-pricing` (served at `/page-pricing`); rename the folder for another path, e.g. `app/pricing`.
Everything is a server component, and the interval switch is plain CSS, so the page ships no JavaScript of its own.

## Usage

1. Edit `content.ts`: the page's title and description (`META`) and every visible string (`CONTENT`). The sample
   content is invented (Samplework Inc.); keep the shapes and replace the text and the plans.
2. Pick the language: `LOCALE` in `content.ts` is `'en'` (the default) or `'de'` (the German sample set). It also
   picks the label sets and the way prices are written (`$29.50` or `29,50 €`). Set `lang` on `<html>` in your
   root layout to match.

Prices are minor units with an ISO currency code (`priceMinor: 2950, currency: 'USD'` is $29.50; a whole amount
shows no decimals; a zero-decimal currency such as JPY counts whole units). A price of `0` shows the "free" label.

The comparison names the plans once (`plans: [{ id, name }]`), then one row per feature: `values` maps a plan id to
`true` (a check), `false` (a dash) or a text such as `'5'`. A plan id missing from a row counts as not included.

The page body is `PricingPage({ locale })` in `pricing-page.tsx`; `page.tsx` only renders it with `LOCALE`. A site
that keeps its locale elsewhere renders the body itself:

```tsx
import { PricingPage } from '@/app/page-pricing/pricing-page';

export default function Pricing() {
  return <PricingPage locale="de" />;
}
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

## What is inside

| File | |
|---|---|
| `page.tsx` | the route: `metadata` and the page, in `LOCALE` |
| `pricing-page.tsx` | `PricingPage({ locale })`: header, plans, comparison, questions, call to action |
| `comparison-table.tsx` | `ComparisonTable`: the plans side by side |
| `labels.ts`, `labels.de.ts` | the comparison's fixed strings, English and German |
| `content.ts` | `LOCALE`, `META` and `CONTENT` (English and German) |
| `_sections/pricing`, `_sections/faq`, `_sections/cta` | copies of `section-pricing`, `section-faq` and `section-cta` 2.0.0, byte for byte; each folder has its own README |

The `_sections` folders start with an underscore, so Next never serves them as routes. The sections carry the ids
`plans`, `faq` and `contact`.

## Props

`ComparisonTable`:

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `{ title, plans: { id, name }[], rows: ComparisonRow[] }` | | `title` is the table's visible caption |
| `labels` | `Partial<ComparisonLabels>` | English | see below |

## Labels

`COMPARISON_LABELS` (English, the default) and `COMPARISON_LABELS_DE`:

| Key | English | German |
|---|---|---|
| `included` | Included | Enthalten |
| `notIncluded` | Not included | Nicht enthalten |
| `table` | Plan comparison | Paketvergleich |

`pricing-page.tsx` passes the set for the locale, and the pricing section's own set (`PRICING_LABELS` /
`PRICING_LABELS_DE`) the same way.

## Keyboard and screen readers

- The page is one `main` landmark (`id="main"`, the target of a skip link) with exactly one `h1`.
- The interval switch is a `fieldset` of radio buttons: arrow keys move between intervals.
- The comparison is a real table with a caption, plan names as column headers and features as row headers. A check
  or a dash is read as "Included" or "Not included".
- On a narrow screen the table scrolls sideways inside its own region, which takes focus so the keyboard can scroll
  it; the page itself never scrolls sideways.
- The questions are native `details` elements: Enter or Space opens one.

## Client islands

None.

## Notes

- Neutral colours only, with every margin and box set on the element, so the page looks the same with or without
  Tailwind's preflight.
- To change a section beyond its content, edit its copy under `_sections/`; it is your code now.
