import type { Metadata } from 'next';
import { CareersPage } from './careers-page';
import { LOCALE, META } from './content';

export const metadata: Metadata = META[LOCALE];

export default function Page() {
  return <CareersPage locale={LOCALE} />;
}
