'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent as ReactMouseEvent } from 'react';
import { fillLabel, type GalleryLabels } from './labels';
import type { GalleryImage } from './site-types';

const INK = 'text-[var(--oc-ink,oklch(20.5%_0_none))]';
const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';
// a modal card on the surface over the scrim; every margin, border and colour set, so it looks the same without
// Tailwind's preflight (a browser draws a dialog with a border, padding and the system colours)
const DIALOG = `m-auto box-border max-h-[calc(100dvh-2rem)] w-[min(64rem,calc(100vw-2rem))] max-w-none overflow-y-auto border-0 rounded-[calc(var(--oc-radius,0.25rem)*2)] bg-[var(--oc-surface,#fff)] p-4 ${INK} font-[family-name:var(--oc-font-body)] wrap-break-word backdrop:bg-[var(--oc-scrim,oklch(20.5%_0_none))]/80 sm:p-6 ${FOCUS}`;
const ICON_BUTTON = `m-0 box-border inline-flex size-10 shrink-0 cursor-pointer appearance-none items-center justify-center rounded-[calc(var(--oc-radius,0.25rem)*1.5)] border-0 bg-transparent p-0 ${INK} hover:bg-[var(--oc-surface-sunk,oklch(97%_0_none))] ${FOCUS}`;
const ICON = 'block size-5';

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={ICON}>
      <path d={d} />
    </svg>
  );
}

/**
 * The gallery's one client island: a modal `dialog` over the section's thumbnails. One delegated click listener on
 * the section (`#rootId`) turns a plain click on a thumbnail (`a[data-index]`) into opening the dialog at that image;
 * a click with a modifier key stays the browser's (a new tab). The index is its only state. ArrowLeft/ArrowRight and
 * the previous/next buttons move it and wrap around; Tab stays among the dialog's buttons; Close and Escape close it,
 * and a click on the scrim too; focus then returns to the thumbnail that opened it. The image loads lazily, so a
 * closed dialog loads nothing.
 */
export function Lightbox({ rootId, images, labels }: { rootId: string; images: GalleryImage[]; labels: GalleryLabels }) {
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const positionId = useId();
  const total = images.length;

  useEffect(() => {
    const root = document.getElementById(rootId);
    const dialog = dialogRef.current;
    if (!root || !dialog) return;
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest('a[data-index]') : null;
      if (!(link instanceof HTMLAnchorElement) || !root.contains(link)) return;
      const at = Number(link.dataset.index);
      if (!Number.isInteger(at) || at < 0 || at >= total) return;
      event.preventDefault();
      openerRef.current = link;
      setIndex(at);
      if (!dialog.open) dialog.showModal();
    };
    const onClose = () => {
      openerRef.current?.focus();
      openerRef.current = null;
    };
    root.addEventListener('click', onClick);
    dialog.addEventListener('close', onClose);
    return () => {
      root.removeEventListener('click', onClick);
      dialog.removeEventListener('close', onClose);
    };
  }, [rootId, total]);

  const move = (step: number) => setIndex((i) => (i + step + total) % total);

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
      return;
    }
    if (event.key !== 'Tab') return;
    // the rest of the page is inert; this keeps focus from leaving for the browser's own controls
    const buttons = [...event.currentTarget.querySelectorAll('button')];
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    if (!first || !last) return;
    const active = document.activeElement;
    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && (active === first || active === event.currentTarget)) {
      event.preventDefault();
      last.focus();
    }
  };

  // a click on the scrim reaches the dialog itself, outside its box
  const onDialogClick = (event: ReactMouseEvent<HTMLDialogElement>) => {
    if (event.target !== event.currentTarget) return;
    const box = event.currentTarget.getBoundingClientRect();
    const inside = event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
    if (!inside) event.currentTarget.close();
  };

  const image = images[index] ?? images[0];
  if (!image) return null;
  const big = image.full ?? image;

  return (
    <dialog ref={dialogRef} aria-labelledby={positionId} onKeyDown={onKeyDown} onClick={onDialogClick} className={DIALOG}>
      <div className="flex items-center gap-2">
        {/* names the dialog and, as a polite live region, says each move: the position, and for screen readers the
            picture's alt text (focus stays on the buttons, so nothing else would tell them the picture changed) */}
        <p
          id={positionId}
          aria-live="polite"
          aria-atomic="true"
          className="m-0 min-w-0 flex-1 text-sm tabular-nums text-[var(--oc-ink-muted,oklch(43.9%_0_none))]"
        >
          <span data-position>{fillLabel(labels.position, { n: index + 1, total })}</span>
          {big.alt ? <span className="sr-only">{`: ${big.alt}`}</span> : null}
        </p>
        {total > 1 ? (
          <>
            <button type="button" aria-label={labels.previous} onClick={() => move(-1)} className={ICON_BUTTON}>
              <Icon d="M15 18l-6-6 6-6" />
            </button>
            <button type="button" aria-label={labels.next} onClick={() => move(1)} className={ICON_BUTTON}>
              <Icon d="M9 18l6-6-6-6" />
            </button>
          </>
        ) : null}
        <form method="dialog" className="m-0">
          <button type="submit" aria-label={labels.close} className={ICON_BUTTON}>
            <Icon d="M18 6L6 18M6 6l12 12" />
          </button>
        </form>
      </div>
      <figure className="m-0 mt-3">
        <img
          src={big.src}
          alt={big.alt}
          width={big.width}
          height={big.height}
          loading="lazy"
          className="mx-auto block h-auto max-h-[calc(100dvh-12rem)] w-auto max-w-full object-contain"
        />
        {image.caption ? (
          <figcaption className="m-0 mt-3 text-base text-[var(--oc-ink-body,oklch(37.1%_0_none))]">{image.caption}</figcaption>
        ) : null}
      </figure>
    </dialog>
  );
}
