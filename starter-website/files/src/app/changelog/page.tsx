import type { Metadata } from 'next';
import { LOCALE } from '@/content/locale';
import { ChangelogPage } from '../_page-changelog/changelog';
import { META } from '../_page-changelog/content';

// The releases and their text: src/app/_page-changelog/content.ts (a part; its content.ts is yours, see AGENTS.md).
export const metadata: Metadata = META[LOCALE];

export default function Changelog() {
  return <ChangelogPage locale={LOCALE} />;
}
