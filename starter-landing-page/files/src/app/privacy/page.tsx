import type { Metadata } from 'next';
import { assertLegalTextReady } from '@/content/legal-guard';
import { LOCALE } from '@/content/locale';
import { CONTENT, META } from '../_page-legal-privacy/content';
import { PrivacyPage } from '../_page-legal-privacy/legal-document';
import { hasPlaceholders } from '../_page-legal-privacy/placeholders';

// The privacy notice's text and placeholders: src/app/_page-legal-privacy/content.ts (a part; see AGENTS.md).
export const metadata: Metadata = META[LOCALE];

export default function Privacy() {
  assertLegalTextReady('/privacy', hasPlaceholders(CONTENT[LOCALE]));
  return <PrivacyPage locale={LOCALE} />;
}
