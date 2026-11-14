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

const BUTTON =
  'm-0 box-border inline-flex h-9 cursor-pointer appearance-none items-center rounded-md border border-solid border-neutral-300 bg-white px-3 font-sans text-sm font-medium text-neutral-900 hover:border-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';

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
      <p role="status" className="m-0 font-sans text-sm text-neutral-700">
        {status === 'copied' ? labels.copied : status === 'failed' ? labels.copyFailed : null}
      </p>
    </div>
  );
}
