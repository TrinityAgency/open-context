# Share Buttons

Share links for X, LinkedIn, Facebook, Bluesky, WhatsApp and email, under a visible "Share this page" line. They are
plain links: no third-party script, no widget, and nothing is loaded from a network while your page is open; the
visitor's browser goes to the network only when they follow a link. Two buttons follow: native share (the device's
own share sheet) and copy link. Each appears only in a browser that has its API, so nobody meets a button that does
nothing.

## Usage

```tsx
import { ShareButtons } from '@/components/blog-share-buttons/share-buttons';

<ShareButtons url="https://example.com/blog/writing-posts" title="Writing posts" />
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

`url` must be the page's absolute address (`https://…`): a share link has to work outside your site. A relative URL
throws a `RangeError` while the page renders, so the mistake shows in development, not on a visitor's phone. In a
Next app, build it from your site's address and the page's path, e.g. `` `${SITE_URL}/blog/${post.slug}` ``.

Fewer networks, or another order:

```tsx
<ShareButtons url={url} title={post.title} networks={['linkedin', 'bluesky', 'email']} />
```

The links on their own, for a layout of your own:

```ts
import { SHARE_NETWORKS, shareHref } from '@/components/blog-share-buttons/share-targets';

SHARE_NETWORKS.map((network) => shareHref(network, { url, title }));
```

| Network | Link |
|---|---|
| `x` | `https://twitter.com/intent/tweet?text=<title>&url=<url>` |
| `linkedin` | `https://www.linkedin.com/sharing/share-offsite/?url=<url>` |
| `facebook` | `https://www.facebook.com/sharer/sharer.php?u=<url>` |
| `bluesky` | `https://bsky.app/intent/compose?text=<title> <url>` |
| `whatsapp` | `https://wa.me/?text=<title> <url>` |
| `email` | `mailto:?subject=<title>&body=<url>` |

Title and URL are encoded with `encodeURIComponent`, so `&`, `#` and `?` in either arrive intact.

## Brand

The links and buttons read these design tokens (CSS custom properties of the Open Context token contract, version 1).
Unset, each falls back to the neutral value in brackets, so they look the same as before with no design system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-surface` | the links' and buttons' ground | `#fff` |
| `--oc-line-strong` | their border | `oklch(87% 0 none)` |
| `--oc-ink` | their text, the title line, their border under the pointer | `oklch(20.5% 0 none)` |
| `--oc-ink-body` | the copy status | `oklch(37.1% 0 none)` |
| `--oc-focus` | the focus ring | `oklch(20.5% 0 none)` |
| `--oc-radius` | the corners (1.5 ×) | `0.25rem` |
| `--oc-font-body` | every text | the page's font |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark, and checks the pairs these draw: ink and body text on the
surface, the focus ring) and the `design-system-seed` skill. To set them by hand, declare them once in your global
stylesheet, e.g. `:root { --oc-ink: #1d2433; --oc-line-strong: #c7cfdb; }`.

## Props

| Prop | |
|---|---|
| `url` | the page's absolute address |
| `title` | the page's title, put into the share text |
| `networks` | `ShareNetwork[]`; default all six, in the order above |
| `labels` | `Partial<ShareLabels>` |
| `className` | added to the group |

## Labels

English by default. A German set ships beside it:

```tsx
import { SHARE_LABELS_DE } from '@/components/blog-share-buttons/labels.de';

<ShareButtons url={url} title={title} labels={SHARE_LABELS_DE} />
```

| Key | English | German |
|---|---|---|
| `title` | Share this page | Diese Seite teilen |
| `networks` | X, LinkedIn, Facebook, Bluesky, WhatsApp, Email | X, LinkedIn, Facebook, Bluesky, WhatsApp, E-Mail |
| `newTab` | (opens in a new tab) | (öffnet in einem neuen Tab) |
| `native` | Share… | Teilen … |
| `copy` | Copy link | Link kopieren |
| `copied` | Link copied | Link kopiert |
| `copyFailed` | Copying did not work | Kopieren hat nicht geklappt |

`labels` is merged shallowly: to rename one network, pass the whole `networks` record.

## Keyboard and screen readers

- A `group` named by its visible title line. Links and buttons are reached with Tab in reading order.
- The network links open in a new tab and say so to screen readers (`labels.newTab`, visually hidden). The email
  link opens the mail app in place.
- Native share and copy link are real buttons. A button whose API the browser lacks is not rendered visibly or read
  out (`hidden`).
- After copying, "Link copied" (or "Copying did not work") is announced from a `role="status"` line.
- Closing the native share sheet without sharing is not an error and shows nothing.

## Client islands

`share-actions.tsx`: native share and copy link. The title line and the links render on the server.

## Notes

- The links carry `rel="noopener noreferrer"`: the network gets the page you share, not the page you came from.
- Copy link needs a secure page (`https://` or `localhost`); browsers give the clipboard to no other.
- Text links with network names, no brand logos: no icon package and no trademarks in your bundle.
- Every colour is a design token (Brand), with every margin and box set on the element, so it looks the same with or
  without Tailwind's preflight.
- A link or button whose label is wider than the row wraps between words and grows in height; a single word wider
  than the screen does not break inside it (no network name or label is that long).
- **From 2.x:** no change is needed: the props and labels are the same. The links and buttons draw in your design
  tokens (above), in your design's body font when it sets one.
- **From 1.0.0:** `url`, `title` and `className` work as before. The networks are now links rather than buttons
  that open a popup window, Bluesky, WhatsApp and email were added, and native share and copy link appear only where
  the browser has them. Reinstalling replaces `share-buttons.tsx` and adds the new files.
