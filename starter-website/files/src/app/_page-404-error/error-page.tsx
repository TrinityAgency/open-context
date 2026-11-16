'use client';

import { LOCALE } from './content';
import { ErrorPage } from './error-view';

/** The default export for `app/error.tsx` (see README.md): the error page in `LOCALE`. */
export default function ErrorBoundaryPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorPage locale={LOCALE} error={error} reset={reset} />;
}
