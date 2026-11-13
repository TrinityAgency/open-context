# Cookie Consent

A consent banner, a preferences dialog and a gate that holds back anything non-essential until the visitor has
chosen. The choice lives in one first-party cookie that the server can read too. Until a choice is made nothing is
stored and nothing behind a gate is requested.

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

## Props

`ConsentProvider`:

| Prop | Type | Default | |
|---|---|---|---|
| `categories` | `ConsentCategory[]` | | `{ id, label, description, required }`, in display order |
| `policyVersion` | `number` | `1` | raise it to ask again |
| `initialState` | `ConsentState \| null` | | the server's reading; leave it out on static pages |
| `labels` | `Partial<ConsentLabels>` | English | see below |
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
- Neutral colours only, with every margin and box set on the element, so it looks the same with or without Tailwind's
  preflight.
