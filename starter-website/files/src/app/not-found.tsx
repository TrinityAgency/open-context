import { LOCALE } from '@/content/locale';
import { NotFoundPage } from './_page-404-error/not-found-view';

// Shown, with HTTP 404, for every address the site does not have. Its text and links:
// src/app/_page-404-error/content.ts (a part; see AGENTS.md).
export default function NotFound() {
  return <NotFoundPage locale={LOCALE} />;
}
