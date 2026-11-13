# Modal System

Three overlays on the browser's native `<dialog>`: a centred `Dialog`, a `Drawer` along one edge and an
`AlertDialog` for confirmations. The browser does the hard parts (top layer, inert page, focus trap, Escape); this
module adds a trigger, the open state, a scroll lock and focus returned to where it came from.

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
