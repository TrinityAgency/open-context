import type { Metadata } from 'next';
import { ChangelogPage } from './changelog';
import { LOCALE, META } from './content';

export const metadata: Metadata = META[LOCALE];

export default function Page() {
  return <ChangelogPage locale={LOCALE} />;
}
