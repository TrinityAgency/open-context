import type { Metadata } from 'next';
import { assertLegalTextReady } from '@/content/legal-guard';
import { LOCALE } from '@/content/locale';
import { CONTENT, META } from '../_page-legal-imprint/content';
import { ImprintPage } from '../_page-legal-imprint/legal-document';
import { hasPlaceholders } from '../_page-legal-imprint/placeholders';

// The imprint's text and placeholders: src/app/_page-legal-imprint/content.ts (a part; see AGENTS.md).
export const metadata: Metadata = META[LOCALE];

export default function Imprint() {
  assertLegalTextReady('/imprint', hasPlaceholders(CONTENT[LOCALE]));
  return <ImprintPage locale={LOCALE} />;
}
