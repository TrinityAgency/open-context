import type { Metadata } from 'next';
import { ServicesPage } from '@/components/services-page';
import { blogMetadata } from '@/content/blog';
import { LOCALE } from '@/content/locale';
import { SERVICES_PAGE } from '@/content/pages';

export const metadata: Metadata = blogMetadata({ path: '/services', ...SERVICES_PAGE[LOCALE].meta });

// The view: src/components/services-page.tsx; its text: SERVICES_PAGE in src/content/pages.ts.
export default function Services() {
  return <ServicesPage locale={LOCALE} />;
}
