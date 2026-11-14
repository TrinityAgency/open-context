'use client';

import { LOCALE } from '@/content/locale';
import { ErrorPage } from './_page-404-error/error-view';

// Shown when a page throws while rendering. Its text: src/app/_page-404-error/content.ts (a part; see AGENTS.md).
export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorPage locale={LOCALE} error={error} reset={reset} />;
}
