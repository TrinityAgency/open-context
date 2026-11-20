'use client';

import { useState, useSyncExternalStore } from 'react';
import type { ShareLabels } from './labels';

export type ShareActionsProps = { url: string; title: string; labels: ShareLabels };

// What the browser can do is read only in the browser, after hydration: the server renders both buttons hidden.
const subscribe = () => () => {};
const canShare = () => typeof navigator.share === 'function';
const canCopy = () => typeof navigator.clipboard?.writeText === 'function';
const onServer = () => false;

function isAbort(error: unknown) {
  return typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError';
}

// The share links' look (share-buttons.tsx), as a button: the token contract's colours, radius and body font.
const BUTTON =
  'm-0 box-border inline-flex min-h-9 max-w-full items-center rounded-[calc(var(--oc-radius,0.25rem)*1.5)] border border-solid border-[var(--oc-line-strong,oklch(87%_0_none))] bg-[var(--oc-surface,#fff)] px-3 py-1.5 font-[family-name:var(--oc-font-body)] text-sm font-medium wrap-break-word text-[var(--oc-ink,oklch(20.5%_0_none))] hover:border-[var(--oc-ink,oklch(20.5%_0_none))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))] cursor-pointer appearance-none text-center';

/**
 * Native share and copy link. Client island. Each button stays hidden until the browser shows it has the API
 * (`navigator.share`, `navigator.clipboard.writeText`), so no visitor meets a button that does nothing.
 */
export function ShareActions({ url, title, labels }: ShareActionsProps) {
  const share = useSyncExternalStore(subscribe, canShare, onServer);
  const copy = useSyncExternalStore(subscribe, canCopy, onServer);
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  const onShare = async () => {
    try {
      await navigator.share({ url, title });
    } catch (error) {
      // The visitor closed the share sheet: nothing went wrong.
      if (!isAbort(error)) console.error(error);
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
  };

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <button type="button" hidden={!share} onClick={onShare} className={share ? BUTTON : 'hidden'}>
        {labels.native}
      </button>
      <button type="button" hidden={!copy} onClick={onCopy} className={copy ? BUTTON : 'hidden'}>
        {labels.copy}
      </button>
      <p role="status" className="m-0 font-[family-name:var(--oc-font-body)] text-sm text-[var(--oc-ink-body,oklch(37.1%_0_none))]">
        {status === 'copied' ? labels.copied : status === 'failed' ? labels.copyFailed : null}
      </p>
    </div>
  );
}
