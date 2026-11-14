'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { ERROR, type ErrorContent } from './content';
import { ERROR_LABELS_DE } from './labels.de';
import { ERROR_LABELS, type ErrorLabels } from './labels';
import type { LinkComponent } from './site-types';

export type ErrorViewProps = {
  /** The error Next hands to error.tsx. Only its digest is shown, never its message. */
  error: Error & { digest?: string };
  /** Renders the failed segment again (Next's `reset`). */
  reset: () => void;
  content: ErrorContent;
  labels?: Partial<ErrorLabels>;
  /** Renders the home link; pass next/link's Link in a Next app. Default: a plain `a`. */
  LinkComponent?: LinkComponent;
};

function PlainLink(props: ComponentProps<LinkComponent>) {
  return <a {...props} />;
}

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';

/**
 * The error page: a title, a line of text, a button that tries again, a home link and the error's reference when
 * Next gives one (its digest, which matches the server log). Client component, as Next requires for error.tsx.
 */
export function ErrorView({ error, reset, content, labels, LinkComponent: L = PlainLink }: ErrorViewProps) {
  const l = { ...ERROR_LABELS, ...labels };
  const { title, text, home } = content;
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <div className="box-border px-6 py-24 text-neutral-900">
        <div className="mx-auto max-w-2xl">
          <h1 className="m-0 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          <p className="m-0 mt-5 text-lg text-neutral-700">{text}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              type="button"
              onClick={() => reset()}
              className={`m-0 box-border inline-flex h-10 cursor-pointer appearance-none items-center justify-center rounded-md border border-solid border-neutral-900 bg-neutral-900 px-4 font-sans text-sm font-medium text-white hover:bg-neutral-700 ${FOCUS}`}
            >
              {l.tryAgain}
            </button>
            <L href={home.href} className={`rounded-sm font-medium text-neutral-900 underline underline-offset-2 hover:text-neutral-600 ${FOCUS}`}>
              {home.label}
            </L>
          </div>
          {error.digest ? (
            <p className="m-0 mt-10 text-sm text-neutral-600">
              {l.reference}: <code className="font-mono text-neutral-900">{error.digest}</code>
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}

/** The error page in one locale, with Next's `Link`. */
export function ErrorPage({ locale, error, reset }: { locale: 'en' | 'de'; error: Error & { digest?: string }; reset: () => void }) {
  return (
    <ErrorView
      error={error}
      reset={reset}
      content={ERROR[locale]}
      labels={{ en: ERROR_LABELS, de: ERROR_LABELS_DE }[locale]}
      LinkComponent={Link}
    />
  );
}
