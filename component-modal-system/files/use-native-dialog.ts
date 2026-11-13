'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

// One page-wide scroll lock, counted, so stacked dialogs restore the original overflow only when the last closes.
let locks = 0;
let savedOverflow = '';

function lockScroll() {
  if (locks === 0) {
    savedOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
  }
  locks += 1;
}

function unlockScroll() {
  if (locks === 0) return;
  locks -= 1;
  if (locks === 0) document.documentElement.style.overflow = savedOverflow;
}

/**
 * Drives a native `<dialog>` from a boolean. Opening remembers the focused element, calls `showModal()` and locks
 * the page's scroll; closing calls `close()`, restores the scroll and focuses the remembered element again, but only
 * if it is still in the document (otherwise focus stays on body). The native `close` event (Escape, `close()`)
 * calls `onClose` while `open` is still true, so a parent learns about every close it did not make itself.
 */
export function useNativeDialog(open: boolean, onClose: () => void): RefObject<HTMLDialogElement | null> {
  const ref = useRef<HTMLDialogElement | null>(null);
  const opener = useRef<Element | null>(null);
  const openRef = useRef(open);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    openRef.current = open;
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    if (!dialog.open) {
      opener.current = document.activeElement;
      dialog.showModal();
    }
    lockScroll();
    return () => {
      unlockScroll();
      if (dialog.open) dialog.close();
    };
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onNativeClose = () => {
      // A browser fires `close` as a queued task. When the dialog is open again by then (StrictMode's dev re-run of
      // the open effect: open, cleanup close(), open), the event belongs to a close that is already undone.
      if (dialog.open) return;
      const back = opener.current;
      opener.current = null;
      if (back instanceof HTMLElement && back.isConnected) back.focus();
      if (openRef.current) onCloseRef.current();
    };
    dialog.addEventListener('close', onNativeClose);
    return () => dialog.removeEventListener('close', onNativeClose);
  }, []);

  return ref;
}

/** Controlled-or-uncontrolled open state shared by the dialogs. */
export function useOpenState(
  open: boolean | undefined,
  defaultOpen: boolean | undefined,
  onOpenChange: ((open: boolean) => void) | undefined,
): [boolean, (next: boolean) => void] {
  const [inner, setInner] = useState(defaultOpen ?? false);
  const controlled = open !== undefined;
  const set = useCallback(
    (next: boolean) => {
      if (!controlled) setInner(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );
  return [controlled ? open : inner, set];
}
