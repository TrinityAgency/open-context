# Modal System

Three overlays on the browser's native `<dialog>`: a centred `Dialog`, a `Drawer` along one edge and an
`AlertDialog` for confirmations. The browser does the hard parts (top layer, inert page, focus trap, Escape); this
module adds a trigger, the open state, a scroll lock and focus returned to where it came from. Its colours, fonts and
corners come from your design system's tokens.

## Usage

```tsx
import { AlertDialog, Dialog, Drawer } from '@/src/modules/component-modal-system';

<Dialog title="Book a call" description="We reply within one working day." trigger="Book a call">
  <p>Write to hello@example.com.</p>
</Dialog>

<Drawer title="Menu" trigger="Open menu" side="left">
  <nav>…</nav>
</Drawer>
```

`Dialog` and `Drawer` work from a server component when you use `trigger`. `AlertDialog` takes a callback, so it
lives in a client component:

```tsx
'use client';
import { AlertDialog } from '@/src/modules/component-modal-system';

<AlertDialog title="Delete this request?" trigger="Delete" destructive onConfirm={() => deleteRequest(id)} />
```

### Controlled

Leave out `trigger` and drive it yourself:

```tsx
const [open, setOpen] = useState(false);
<Dialog title="Saved" open={open} onOpenChange={setOpen}>…</Dialog>
```

`onOpenChange(false)` fires for every close the user makes (Escape, close button, backdrop, confirm or cancel), not
for a close you made by passing `open={false}`.

### The hook on its own

```tsx
const ref = useNativeDialog(open, () => setOpen(false));
<dialog ref={ref}>…</dialog>
```

## Brand

The overlays read these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset,
each falls back to the neutral value in brackets, so they look the same as before with no design system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-surface` | the dialog, the drawer, the alert; a secondary button (Cancel) | `#fff` |
| `--oc-surface-sunk` | the close button and a secondary button under the pointer | `oklch(97% 0 none)` |
| `--oc-line` | the dialog's, the alert's and the drawer's border | `oklch(92.2% 0 none)` |
| `--oc-line-strong` | a secondary button's border | `oklch(87% 0 none)` |
| `--oc-ink` | the title and the content | `oklch(20.5% 0 none)` |
| `--oc-ink-body` | the close button's cross | `oklch(37.1% 0 none)` |
| `--oc-ink-muted` | the description | `oklch(43.9% 0 none)` |
| `--oc-brand` | the trigger and the confirm button | `oklch(20.5% 0 none)` |
| `--oc-brand-hover` | them under the pointer | `oklch(37.1% 0 none)` |
| `--oc-on-brand` | their text | `#fff` |
| `--oc-focus` | the focus ring | `oklch(20.5% 0 none)` |
| `--oc-scrim` | the veil behind an open overlay (at 50 %) | `oklch(20.5% 0 none)` |
| `--oc-font-heading` | the title | the page's font |
| `--oc-font-body` | the buttons | the page's font |
| `--oc-radius` | the corners (the dialog 2 ×, the buttons 1.5 ×) | `0.25rem` |

`TRIGGER_CLASS` and `SECONDARY_CLASS` (exported from `dialog.tsx`) are the two button looks, for your own buttons
beside a dialog. To set the tokens from a claude.ai design system, use the `design-tokens` template (its
`design-sync.mjs` writes them as aliases of your design's own tokens, light and dark, and checks the pairs these draw:
each ink on the surface, on-brand on brand, the focus ring) and the `design-system-seed` skill. To set them by hand,
declare them once in your global stylesheet, e.g. `:root { --oc-brand: #0b5cad; --oc-on-brand: #fff; --oc-radius:
0.5rem; }`.

## Props

Shared by all three (`ModalBaseProps`):

| Prop | Type | |
|---|---|---|
| `title` | `ReactNode` | heading; names the dialog |
| `description` | `ReactNode` | line under the title; describes the dialog |
| `children` | `ReactNode` | body (not on `AlertDialog`) |
| `open` / `defaultOpen` | `boolean` | controlled / uncontrolled |
| `onOpenChange` | `(open: boolean) => void` | |
| `trigger` | `ReactNode` | content of a trigger button rendered before the dialog |
| `triggerClassName` | `string` | replaces the trigger's classes |
| `labels` | `Partial<ModalLabels>` | see below |
| `className` | `string` | added to the `dialog` element |

`Drawer` adds `side`: `'right'` (default), `'left'` or `'bottom'`. `AlertDialog` adds `onConfirm` (required),
`confirmLabel`, `cancelLabel` and `destructive` (marks the confirm button with `data-destructive` and a warning icon;
style `[data-destructive]` to taste).

## Labels

English by default. A German set ships beside it:

```tsx
import { MODAL_LABELS_DE } from '@/src/modules/component-modal-system';

<Dialog title="Termin" trigger="Termin anfragen" labels={MODAL_LABELS_DE}>…</Dialog>
```

| Key | English | German |
|---|---|---|
| `close` | Close | Schließen |
| `confirm` | Confirm | Bestätigen |
| `cancel` | Cancel | Abbrechen |

## Keyboard and screen readers

- Opening moves focus into the dialog; Tab stays inside it (the page behind is inert). Escape closes it.
- On close, focus returns to the element that had it before, if that element is still on the page; otherwise it
  stays on the body.
- Dialogs are named by their title (`aria-labelledby`) and described by their description (`aria-describedby`).
- `Dialog` and `Drawer` close on Escape, the close button (named by `labels.close`) and a click on the backdrop.
- `AlertDialog` has `role="alertdialog"`, no close button, ignores backdrop clicks, and starts on Cancel; Escape
  cancels.
- While any dialog is open the page does not scroll (`overflow: hidden` on `html`, restored after).

## Client islands

`dialog.tsx`, `drawer.tsx`, `alert-dialog.tsx` and `use-native-dialog.ts` (`'use client'`). `index.ts`, `types.ts`
and the labels are plain modules.

## Notes

- No animation: the dialogs appear and disappear at once, so there is nothing to switch off for reduced motion.
- Every margin, border, padding and size of the `dialog` element and the buttons is set in classes, so they look the
  same with or without Tailwind's preflight (which removes `dialog`'s centring margin).
- 2.0.0: every colour, font and corner is a design token with the neutral look as its fallback; without a design
  system it draws what 1.0.0 drew. A long button label wraps, and a long word in a title breaks beside the close
  button.
