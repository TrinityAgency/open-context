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

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';

/**
 * The error page: a title, a line of text, a button that tries again, a home link and the error's reference when
 * Next gives one (its digest, which matches the server log). Client component, as Next requires for error.tsx.
 */
export function ErrorView({ error, reset, content, labels, LinkComponent: L = PlainLink }: ErrorViewProps) {
  const l = { ...ERROR_LABELS, ...labels };
  const { title, text, home } = content;
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <div className="box-border px-6 py-24 text-[var(--oc-ink,oklch(20.5%_0_none))] wrap-break-word">
        <div className="mx-auto max-w-2xl">
          <h1 className="m-0 text-4xl font-semibold tracking-tight sm:text-5xl font-[family-name:var(--oc-font-heading)]">{title}</h1>
          <p className="m-0 mt-5 text-lg text-[var(--oc-ink-body,oklch(37.1%_0_none))]">{text}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              type="button"
              onClick={() => reset()}
              className={`m-0 box-border inline-flex min-h-10 max-w-full cursor-pointer appearance-none items-center justify-center rounded-[calc(var(--oc-radius,0.25rem)*1.5)] border border-solid border-[var(--oc-brand,oklch(20.5%_0_none))] bg-[var(--oc-brand,oklch(20.5%_0_none))] px-4 py-2 text-center font-[family-name:var(--oc-font-body)] text-sm font-medium wrap-anywhere text-[var(--oc-on-brand,#fff)] hover:bg-[var(--oc-brand-hover,oklch(37.1%_0_none))] ${FOCUS}`}
            >
              {l.tryAgain}
            </button>
            <L href={home.href} className={`max-w-full rounded-[var(--oc-radius,0.25rem)] font-medium text-[var(--oc-ink,oklch(20.5%_0_none))] underline underline-offset-2 hover:text-[var(--oc-ink-muted,oklch(43.9%_0_none))] ${FOCUS}`}>
              {home.label}
            </L>
          </div>
          {error.digest ? (
            <p className="m-0 mt-10 text-sm text-[var(--oc-ink-muted,oklch(43.9%_0_none))]">
              {l.reference}: <code className="font-mono text-[var(--oc-ink,oklch(20.5%_0_none))]">{error.digest}</code>
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
