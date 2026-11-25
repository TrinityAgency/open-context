# Cookie Consent

A consent banner, a preferences dialog and a gate that holds back anything non-essential until the visitor has
chosen. The choice lives in one first-party cookie that the server can read too. Until a choice is made nothing is
stored and nothing behind a gate is requested. The banner comes in two layouts (`layout`), and the colours, fonts and
corners of the banner and the dialog come from your design system's tokens.

**A tool, not legal advice.** Which categories a site needs, what their texts say and whether the banner meets the
law where the site operates is the site owner's (or their counsel's) call.

## Usage

Wrap the page body (usually in the root layout) in `ConsentProvider`, and put anything that loads from another host
inside a `ConsentGate`, created in a client component (see the next section for why):

```tsx
import { ConsentGate, ConsentProvider, type ConsentCategory } from '@/src/modules/site-cookie-consent';
import { MapEmbed } from '@/components/map-embed'; // 'use client': renders the third-party <iframe> or <img>

const categories: ConsentCategory[] = [
  { id: 'necessary', label: 'Necessary', description: 'Stores your choice. The site does not work without it.', required: true },
  { id: 'media', label: 'External media', description: 'Loads maps and videos from other providers.', required: false },
];

<ConsentProvider categories={categories}>
  {children}
  <ConsentGate category="media" fallback={<p>The map appears once you allow external media.</p>}>
    <MapEmbed />
  </ConsentGate>
</ConsentProvider>
```

### Create gated content in a client component

In a server component, do not write the third-party element straight into the gate:

```tsx
// Leaks: the request happens before consent.
<ConsentGate category="media">
  <img src="https://maps.example.com/tile.png" alt="Map" />
</ConsentGate>
```

React's server renderer adds `<link rel="preload" as="image">` to the page for every `<img>` (and every `<link>`) it
serializes, whether it is ever rendered or not, so the browser fetches the image although the gate stays shut. Put
the gated element in a client component and gate that:

```tsx
// map-embed.tsx
'use client';
export function MapEmbed() {
  return <img src="https://maps.example.com/tile.png" alt="Map" />;
}

// page.tsx (server)
<ConsentGate category="media">
  <MapEmbed />
</ConsentGate>
```

Inside a client component, writing the element straight into the gate is fine. `next/image` is a client component
already.

### Reading the choice on the server

`parseConsent` reads the cookie anywhere, the server included. Handing the result in as `initialState` puts the
banner into the first HTML instead of after hydration (the page becomes dynamic):

```tsx
import { cookies } from 'next/headers';
import { CONSENT_COOKIE, parseConsent } from '@/src/modules/site-cookie-consent/consent-cookie';

const initialState = parseConsent((await cookies()).get(CONSENT_COOKIE)?.value, categories);

<ConsentProvider categories={categories} initialState={initialState}>…</ConsentProvider>
```

Leave `initialState` out on static pages: the client then reads the cookie after mount, and the banner and the gates
wait until it has (`ready`). `parseConsent` takes the value URI-encoded (as `document.cookie` holds it) or already
decoded (as some server cookie APIs return it).

### Opening the settings again

A click on any element inside `[data-consent-open]` opens the dialog, for example the footer's "cookie settings"
button from `site-footer`, or your own:

```tsx
<button type="button" data-consent-open>Cookie settings</button>
```

From code: `useConsent().openSettings()`.

### In code

```tsx
'use client';
import { useConsent } from '@/src/modules/site-cookie-consent';

const { ready, state, isGranted, acceptAll, rejectAll, save, openSettings } = useConsent();
if (ready && isGranted('statistics')) startCounting();
```

`useConsent` throws outside `ConsentProvider`.

## The rules

- **Nothing before a choice.** No cookie, no local or session storage, nothing behind a gate rendered. The cookie is
  written only by Accept all, Reject all and Save.
- **Equal choices.** Accept all and Reject all share one class string and sit side by side at equal width. No
  optional category is pre-ticked; required ones are ticked, disabled and marked `labels.alwaysOn`.
- **One cookie:** `site_consent`, `Path=/`, 180 days (`CONSENT_MAX_AGE_SECONDS`), `SameSite=Lax`, `Secure` on https.
  Its value is the URI-encoded JSON of `ConsentState` `{ version, decidedAt, granted }`.
- **Asked again when things change.** `version` is `v<policyVersion>-` plus a fingerprint of the category ids and their
  required flags (`consentVersion`). Add, remove or rename a category, or flip a required flag, and every stored
  choice counts as none; raise `policyVersion` to ask again for another reason.
- **A broken cookie grants nothing.** Bad encoding, bad JSON, the wrong shape, a `decidedAt` that is no date or another
  version reads as no choice, and the banner shows again. A granted list is normalised: unknown ids dropped, required
  ids always in, no duplicates.

| Function (`consent-cookie.ts`) | |
|---|---|
| `consentVersion(categories, policyVersion = 1)` | the version string |
| `decide(categories, grantedIds, now, policyVersion = 1)` | the state for a choice made `now` |
| `serializeConsent(state)` / `parseConsent(raw, categories, policyVersion = 1)` | to and from the cookie value; `null` = no choice |
| `isGranted(state, id, categories)` | required: always; optional: once granted; unknown id: never |
| `cookieString(state, { secure })` | a `document.cookie` assignment |

## Layouts

Pick the banner's layout with the `layout` prop of `ConsentProvider`; leave it out and the banner is a `card`.

| `layout` | What it draws | Example |
|---|---|---|
| `card` | a floating card (at most 48rem wide) above the bottom of the page: the title and text, then Settings and the two equal choices | `<ConsentProvider layout="card" categories={categories}>…</ConsentProvider>` |
| `bar` | a full-width bar at the bottom: the title and text beside Settings and the two choices from `lg`, the choices below the text before that | `<ConsentProvider layout="bar" categories={categories}>…</ConsentProvider>` |

In both, Accept all and Reject all share one class: the same colour, size and weight. Long labels wrap between their
words; beside the choices, Settings keeps its width and the choices give way. The banner
carries `data-layout` with its layout; the preferences dialog is the same in both.

While it is on the page the banner also carries `data-consent-banner`, and once the visitor has chosen it is gone.
Something else fixed to the bottom of the page can step aside until then: CSS reads it as
`:root:has([data-consent-banner])`. The `site-call-button` template does this (1.1.0 and later): while the banner is
up the call card steps aside (with JavaScript off it stays, since its links work without it).

## Brand

The banner and the dialog read these design tokens (CSS custom properties of the Open Context token contract,
version 1). Unset, each falls back to the neutral value in brackets, so they look the same as before with no design
system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-surface` | the banner, the dialog, the Settings and Close buttons | `#fff` |
| `--oc-surface-sunk` | the "always on" chip; Settings and Close under the pointer | `oklch(97% 0 none)` |
| `--oc-line` | the banner's and the dialog's border | `oklch(92.2% 0 none)` |
| `--oc-line-strong` | the Settings and Close buttons' border | `oklch(87% 0 none)` |
| `--oc-ink` | the titles, the category names, the Settings and Close buttons' text | `oklch(20.5% 0 none)` |
| `--oc-ink-body` | the banner's text, the "always on" chip | `oklch(37.1% 0 none)` |
| `--oc-ink-muted` | the category descriptions | `oklch(43.9% 0 none)` |
| `--oc-brand` | Accept all, Reject all and Save; the checkboxes' tick | `oklch(20.5% 0 none)` |
| `--oc-brand-hover` | those three under the pointer | `oklch(37.1% 0 none)` |
| `--oc-on-brand` | their text | `#fff` |
| `--oc-focus` | the focus ring | `oklch(20.5% 0 none)` |
| `--oc-scrim` | the veil behind the open dialog (at 50 %) | `oklch(20.5% 0 none)` |
| `--oc-font-heading` | the titles | the page's font |
| `--oc-font-body` | the buttons | the page's font |
| `--oc-radius` | the corners (the banner and dialog 2 ×, the buttons 1.5 ×) | `0.25rem` |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark, and checks the pairs these draw: each ink on the surface, body
text on the sunk chip, on-brand on brand, the focus ring) and the `design-system-seed` skill. To set them by hand,
declare them once in your global stylesheet, e.g. `:root { --oc-brand: #0b5cad; --oc-on-brand: #fff; --oc-radius:
0.5rem; }`.

## Props

`ConsentProvider`:

| Prop | Type | Default | |
|---|---|---|---|
| `categories` | `ConsentCategory[]` | | `{ id, label, description, required }`, in display order |
| `policyVersion` | `number` | `1` | raise it to ask again |
| `initialState` | `ConsentState \| null` | | the server's reading; leave it out on static pages |
| `labels` | `Partial<ConsentLabels>` | English | see below |
| `layout` | `'card' \| 'bar'` | `card` | the banner's layout, see Layouts |
| `children` | `ReactNode` | | |

`ConsentGate`: `category` (an id), `children`, `fallback` (default nothing).

## Labels

English by default. A German set ships beside it:

```tsx
import { CONSENT_LABELS_DE } from '@/src/modules/site-cookie-consent';

<ConsentProvider categories={categories} labels={CONSENT_LABELS_DE}>…</ConsentProvider>
```

| Key | English | German |
|---|---|---|
| `bannerTitle` | Cookies | Cookies |
| `bannerText` | This site uses cookies it needs to work. With your consent it also uses others, described in the settings. | Diese Website verwendet Cookies, die sie zum Funktionieren braucht. Mit Ihrer Einwilligung verwendet sie weitere, die in den Einstellungen beschrieben sind. |
| `acceptAll` | Accept all | Alle akzeptieren |
| `rejectAll` | Reject all | Alle ablehnen |
| `settings` | Settings | Einstellungen |
| `dialogTitle` | Cookie settings | Cookie-Einstellungen |
| `save` | Save choices | Auswahl speichern |
| `close` | Close | Schließen |
| `alwaysOn` | Always on | Immer aktiv |

Category labels and descriptions are yours, in `categories`.

## Keyboard and screen readers

- The banner is a region named by its heading (`labels.bannerTitle`), rendered first inside the provider so it comes
  early in the tab order; it never traps focus.
- The dialog is a native modal `dialog` named by its heading: focus moves into it, Tab stays inside, Escape and the
  close button close it without saving, and focus returns to the element that opened it.
- Each checkbox is labelled by its category's label and described by its description.

## Client islands

`consent-provider.tsx`, `consent-banner.tsx`, `consent-dialog.tsx`, `consent-gate.tsx`. `consent-cookie.ts` is plain
code, safe on the server.

## Notes

- Out of scope: Google Consent Mode, vendor lists, the IAB framework, geo rules. A gate is the hook for those.
- Every colour is a design token with the neutral look as its fallback, and every margin and box is set on the
  element, so it looks the same with or without Tailwind's preflight.
- 2.0.0: the design tokens and `layout` are new; without a design system and without `layout` it draws what 1.0.0
  drew. The buttons' labels wrap instead of running past a narrow button; the dialog's checkboxes draw the token focus
  ring; `ConsentLayout` is exported.
- 2.1.0: the banner carries `data-consent-banner` while it is shown (see "Layouts"); nothing else changes.
