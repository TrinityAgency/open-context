'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { ConsentBanner } from './consent-banner';
import { CONSENT_COOKIE, cookieString, decide, isGranted, parseConsent } from './consent-cookie';
import { ConsentDialog } from './consent-dialog';
import { CONSENT_LABELS, type ConsentLabels } from './labels';
import type { ConsentCategory, ConsentState } from './site-types';

export type ConsentValue = {
  /** The stored choice, or null while there is none (or it is not known yet). */
  state: ConsentState | null;
  /** True once the choice is known: from initialState, after the client read the cookie, or after a choice. */
  ready: boolean;
  isGranted(id: string): boolean;
  acceptAll(): void;
  rejectAll(): void;
  /** Stores exactly these ids (plus every required one). */
  save(ids: string[]): void;
  openSettings(): void;
};

export type ConsentProviderProps = {
  categories: ConsentCategory[];
  /** Raise it to ask everyone again (a changed privacy policy). Default 1. */
  policyVersion?: number;
  /**
   * The choice as the server read it (`parseConsent(cookies().get(CONSENT_COOKIE)?.value, categories)`), or null
   * for none. Leave it out on static pages: the client then reads the cookie after mount.
   */
  initialState?: ConsentState | null;
  labels?: Partial<ConsentLabels>;
  children: ReactNode;
};

const ConsentContext = createContext<ConsentValue | null>(null);

// The cookie header as an external store: null on the server and while hydrating, document.cookie after.
const subscribeNever = () => () => {};
const readCookieHeader = () => document.cookie;
const noCookieHeader = () => null;

function cookieValue(header: string): string | null {
  for (const part of header.split(';')) {
    const at = part.indexOf('=');
    if (at > 0 && part.slice(0, at).trim() === CONSENT_COOKIE) return part.slice(at + 1).trim();
  }
  return null;
}

/**
 * Holds the visitor's choice and renders the banner (while there is none) and the preferences dialog. Nothing is
 * stored until Accept all, Reject all or Save; then one first-party cookie holds the choice. A click on any element
 * inside `[data-consent-open]` opens the dialog.
 */
export function ConsentProvider({ categories, policyVersion = 1, initialState, labels, children }: ConsentProviderProps) {
  const l = useMemo(() => ({ ...CONSENT_LABELS, ...labels }), [labels]);
  const header = useSyncExternalStore(subscribeNever, readCookieHeader, noCookieHeader);
  const [decided, setDecided] = useState<ConsentState | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);

  const known = useMemo(() => {
    if (initialState !== undefined) {
      // Re-checked like a cookie: a stale or foreign state handed in counts as no choice.
      return { ready: true, state: initialState ? parseConsent(JSON.stringify(initialState), categories, policyVersion) : null };
    }
    if (header === null) return { ready: false, state: null };
    return { ready: true, state: parseConsent(cookieValue(header), categories, policyVersion) };
  }, [initialState, header, categories, policyVersion]);

  const state = decided ?? known.state;
  const ready = decided !== undefined || known.ready;

  const save = useCallback(
    (ids: string[]) => {
      const next = decide(categories, ids, new Date(), policyVersion);
      document.cookie = cookieString(next, { secure: window.location.protocol === 'https:' });
      setDecided(next);
      setDialogOpen(false);
    },
    [categories, policyVersion],
  );

  const value = useMemo<ConsentValue>(
    () => ({
      state,
      ready,
      isGranted: (id) => isGranted(state, id, categories),
      acceptAll: () => save(categories.map((c) => c.id)),
      rejectAll: () => save([]),
      save,
      openSettings: () => setDialogOpen(true),
    }),
    [state, ready, categories, save],
  );

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('[data-consent-open]')) setDialogOpen(true);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <ConsentContext.Provider value={value}>
      {ready && state === null ? (
        <ConsentBanner labels={l} onAcceptAll={value.acceptAll} onRejectAll={value.rejectAll} onSettings={value.openSettings} />
      ) : null}
      {children}
      <ConsentDialog
        open={dialogOpen}
        categories={categories}
        state={state}
        labels={l}
        onSave={save}
        onClose={() => setDialogOpen(false)}
      />
    </ConsentContext.Provider>
  );
}

/** The consent context. Throws outside ConsentProvider. */
export function useConsent(): ConsentValue {
  const value = useContext(ConsentContext);
  if (!value) throw new Error('useConsent must be used inside ConsentProvider');
  return value;
}
