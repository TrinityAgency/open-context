import Link from 'next/link';
import { CtaSection } from '@/components/section-cta/cta-section';
import { FaqSection } from '@/components/section-faq/faq-section';
import { FeaturesSection } from '@/components/section-features/features-section';
import { HeroSection } from '@/components/section-hero/hero-section';
import type { Locale } from '@/content/locale';
import { SERVICES_PAGE } from '@/content/pages';
import { JsonLd, faqPageJsonLd } from '@/utils/site-seo';

/**
 * The services page: a hero, one section per group of services (one item per row, the image side alternating),
 * questions with their FAQPage data, and a call to action. Server component; src/app/services/page.tsx renders it
 * with LOCALE. Derived from `page-features` 2.0.0 plus `section-faq`; its text is SERVICES_PAGE in
 * src/content/pages.ts.
 */
export function ServicesPage({ locale }: { locale: Locale }) {
  const c = SERVICES_PAGE[locale];
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <HeroSection content={c.hero} LinkComponent={Link} />
      {c.groups.map((group) => (
        <FeaturesSection key={group.id} id={group.id} layout="rows" content={group.content} />
      ))}
      <FaqSection id="faq" content={c.faq} />
      <CtaSection id="contact" content={c.cta} LinkComponent={Link} />
      <JsonLd data={faqPageJsonLd(c.faq.items)} />
    </main>
  );
}
