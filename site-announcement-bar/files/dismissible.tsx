'use client';

import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from 'react';

// Hydration as an external store: false on the server and while hydrating, true after. The lint config's
// react-hooks rules refuse a state set in an effect, and this needs none.
const subscribeNever = () => () => {};
const onClient = () => true;
const onServer = () => false;

const Dismiss = createContext<(() => void) | null>(null);

/**
 * Holds the bar's one state, dismissed or not, in memory until the page is loaded again: no cookie, no storage, so a
 * reload or a new visit shows the bar again. Once dismissed it renders nothing, its region included.
 */
export function Dismissible({ children }: { children: ReactNode }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return <Dismiss value={() => setDismissed(true)}>{children}</Dismiss>;
}

/**
 * The dismiss button, inside the bar's row. It is `invisible` (hidden, not focusable) until the page is hydrated:
 * without JavaScript it could do nothing, so it never shows. The icon is decoration; `label` names the button. When it
 * held the focus, the focus moves to the page's main content (`#main`, the skip link's target) as the bar goes, so a
 * keyboard or a screen reader goes on after the bar instead of at the top of the document.
 */
export function DismissButton({ label, className }: { label: string; className: string }) {
  const hydrated = useSyncExternalStore(subscribeNever, onClient, onServer);
  const dismiss = useContext(Dismiss);
  return (
    <button
      type="button"
      aria-label={label}
      className={hydrated ? className : `${className} invisible`}
      onClick={(event) => {
        const hadFocus = event.currentTarget === document.activeElement;
        dismiss?.();
        if (hadFocus) document.getElementById('main')?.focus({ preventScroll: true });
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="block size-4">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  );
}
