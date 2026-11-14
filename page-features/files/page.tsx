import type { Metadata } from 'next';
import { LOCALE, META } from './content';
import { FeaturesPage } from './features-page';

export const metadata: Metadata = META[LOCALE];

export default function Page() {
  return <FeaturesPage locale={LOCALE} />;
}
