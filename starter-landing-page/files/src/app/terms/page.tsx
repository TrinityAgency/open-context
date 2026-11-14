import type { Metadata } from 'next';
import { assertLegalTextReady } from '@/content/legal-guard';
import { LOCALE } from '@/content/locale';
import { CONTENT, META } from '../_page-legal-terms/content';
import { TermsPage } from '../_page-legal-terms/legal-document';
import { hasPlaceholders } from '../_page-legal-terms/placeholders';

// The terms' text and placeholders: src/app/_page-legal-terms/content.ts (a part; see AGENTS.md).
export const metadata: Metadata = META[LOCALE];

export default function Terms() {
  assertLegalTextReady('/terms', hasPlaceholders(CONTENT[LOCALE]));
  return <TermsPage locale={LOCALE} />;
}
