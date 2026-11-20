# Pricing Section

Plans and their prices, with a highlighted plan and, when the plans come in more than one interval (monthly, yearly,
one-time), a switch that shows one interval's plans at a time. The switch is plain radio buttons and CSS, so it
works without JavaScript. Prices come in minor units (cents) with an ISO currency code and are written the way the
locale writes them. Two layouts. Its colours, fonts and corner radius come from your design system's tokens when you
load them, and it keeps a neutral look when you do not. A server component; every visible string comes from
`content` or `labels`.

## Usage

```tsx
import { PricingSection } from '@/components/section-pricing/pricing-section';

<PricingSection
  id="pricing"
  content={{
    title: 'Plans and prices',
    intro: 'Start free. Change or cancel any month.',
    plans: [
      { id: 'free', name: 'Starter', priceMinor: 0, currency: 'USD', interval: 'month', features: ['One project'], cta: { href: '/signup', label: 'Start free', variant: 'secondary' } },
      { id: 'team', name: 'Team', priceMinor: 2900, currency: 'USD', interval: 'month', features: ['Five projects'], cta: { href: '/signup?plan=team', label: 'Choose Team', variant: 'primary' }, highlighted: true },
      { id: 'team-year', name: 'Team', priceMinor: 29000, currency: 'USD', interval: 'year', features: ['Five projects'], cta: { href: '/signup?plan=team-year', label: 'Choose Team', variant: 'primary' }, highlighted: true },
    ],
  }}
/>
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

### Prices

`priceMinor` is an integer in the currency's ISO 4217 minor unit: `2950` with `EUR` is €29.50, `1200` with `JPY` is
¥1,200 (the yen has no minor unit), `990000` with `HUF` is HUF 9,900. The scale is ISO 4217's, not the
runtime's: Intl shows HUF, IDR, COP, PKR and a few others without decimals, but their
minor units are still hundredths. `minorUnitDigits(currency)` gives the scale. A whole amount shows no decimals (`$29`, `29 €`). A
price of `0` shows `labels.free` instead of a number. `formatPrice(priceMinor, currency, locale)` is exported from
`format-price.ts`; it throws `RangeError` for a negative or non-integer amount and for a currency code the runtime
does not know.

### The interval switch

The intervals present are listed in the order month, year, once (`intervalsOf(plans)`), and the first is chosen. With
one interval there is no switch. Each interval's plans are their own list, shown while its radio button is checked
(`group-has-[input[value=…]:checked]/pricing:grid`): no script and no hydration, so the switch works before
JavaScript loads and with it turned off.

### With Next's Link

The calls to action render through `LinkComponent` (a plain `a` by default):

```tsx
import Link from 'next/link';

<PricingSection content={content} LinkComponent={Link} />
```

## Layouts

Pick one with the `layout` prop; leave it out and the plans are a `grid`.

| `layout` | What it draws | Example |
|---|---|---|
| `grid` | plan cards in one, two or three columns as the width grows | `<PricingSection layout="grid" content={{ title, intro, plans }} />` |
| `rows` | one plan per row: its name, price and call to action in a line from `md`, its features in a line below | `<PricingSection layout="rows" content={{ title, intro, plans }} />` |

The interval switch works the same in both, without JavaScript. The highlighted plan carries `data-highlighted`, a
two-pixel border in the brand colour and the badge. The section carries `data-layout` with its layout.

## Brand

The section reads these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset,
each falls back to the neutral value in brackets, so the section looks the same as before with no design system
loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-ink` | the title, plan names, prices, the checks, the chosen interval | `oklch(20.5% 0 none)` |
| `--oc-ink-body` | the intro, the switch's legend, the features | `oklch(37.1% 0 none)` |
| `--oc-ink-muted` | plan descriptions, "per month", the intervals not chosen | `oklch(43.9% 0 none)` |
| `--oc-surface` | the plan cards, the chosen interval, the secondary call to action | `#fff` |
| `--oc-surface-sunk` | the switch's track; the secondary call to action under the pointer | `oklch(97% 0 none)` |
| `--oc-line` | the cards' border | `oklch(92.2% 0 none)` |
| `--oc-line-strong` | the secondary call to action's border | `oklch(87% 0 none)` |
| `--oc-brand` | the primary call to action, the highlighted plan's border and badge | `oklch(20.5% 0 none)` |
| `--oc-brand-hover` | the primary call to action under the pointer | `oklch(37.1% 0 none)` |
| `--oc-on-brand` | the primary call to action's text, the badge's text | `#fff` |
| `--oc-focus` | the focus rings (calls to action, the switch) | `oklch(20.5% 0 none)` |
| `--oc-font-heading` | the title and the plan names | the page's font |
| `--oc-radius` | corners: 1.5 × on the calls to action and the switch's choices, 2 × on the cards and the switch | `0.25rem` |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark) and the `design-system-seed` skill. To set them by hand, declare
them once in your global stylesheet, e.g. `:root { --oc-brand: #0b5cad; --oc-on-brand: #fff; --oc-radius: 0.5rem; }`.
A `data-theme` wrapper with its own values re-brands everything inside it.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `PricingContent` | | `{ title, intro?, plans: PricingPlan[] }` |
| `layout` | `'grid' \| 'rows'` | `grid` | see Layouts |
| `locale` | `string` | `en` | the locale prices are written in |
| `labels` | `Partial<PricingLabels>` | English | see below |
| `LinkComponent` | `LinkComponent` | plain `a` | e.g. `next/link` |
| `id` | `string` | | on the `section`, e.g. an anchor target |
| `className` | `string` | | on the `section` |

A `PricingPlan` is `{ id, name, description?, priceMinor, currency, interval, features, cta, highlighted? }`;
`interval` is `'month' | 'year' | 'once'`, `cta` a `Cta` (`{ href, label, variant }`). An empty `plans` renders the
heading and intro only.

## Labels

English by default. A German set ships beside it; pass the matching `locale` too:

```tsx
import { PRICING_LABELS_DE } from '@/components/section-pricing/labels.de';

<PricingSection content={content} locale="de" labels={PRICING_LABELS_DE} />
```

| Key | English | German |
|---|---|---|
| `billing` | Billing | Abrechnung |
| `intervals` | Monthly / Yearly / One-time | Monatlich / Jährlich / Einmalig |
| `per` | per month / per year / one-time | pro Monat / pro Jahr / einmalig |
| `highlighted` | Most popular | Beliebt |
| `free` | Free | Kostenlos |

## Keyboard and screen readers

- The section is a region named by its `h2`; each plan's name is an `h3`.
- The switch is a `fieldset` of radio buttons named by its legend: Tab reaches the chosen one, the arrow keys move
  between choices, and the focus ring shows on the visible choice.
- Plans of the other intervals are `display: none`, so they are neither seen nor read until chosen.
- Check icons are inline SVG with `aria-hidden="true"`.

## Client islands

None.

## Notes

- Colours, fonts and radii only through the tokens above, and every margin and box set on the element, so it looks
  the same with or without Tailwind's preflight, and in a project with shadcn/ui's own variables. The highlighted
  plan has a two-pixel border in the brand colour and a badge.
- Long plan names break inside their card and a long call to action wraps, so nothing leaves a phone screen.
- Version 3.0.0 adds `layout` (`rows`) and the design tokens. Without a design system and without `layout` it draws
  what 2.0.0 drew; a call to action now wraps instead of staying on one line.
- Version 2.0.0 replaces the shadcn-based 1.0.0: no UI library, server-rendered, prices from minor units.
