import Link from 'next/link';
import { CtaSection } from '@/components/section-cta/cta-section';
import { FaqSection } from '@/components/section-faq/faq-section';
import { FeaturesSection } from '@/components/section-features/features-section';
import { HeroSection } from '@/components/section-hero/hero-section';
import { LogoCloudSection } from '@/components/section-logo-cloud/logo-cloud-section';
import { PRICING_LABELS_DE } from '@/components/section-pricing/labels.de';
import { PRICING_LABELS } from '@/components/section-pricing/labels';
import { PricingSection } from '@/components/section-pricing/pricing-section';
import { StatsSection } from '@/components/section-stats/stats-section';
import { TestimonialsSection } from '@/components/section-testimonials/testimonials-section';
import { HOME } from '@/content/home';
import type { Locale } from '@/content/locale';
import { JsonLd, faqPageJsonLd } from '@/utils/site-seo';

/**
 * The home page: the eight sections in one locale, with the ids the navigation points at (`features`, `pricing`,
 * `faq`, `contact`) and the questions as FAQPage data. Server component; src/app/page.tsx renders it with LOCALE.
 */
export function HomePage({ locale }: { locale: Locale }) {
  const c = HOME[locale];
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <HeroSection content={c.hero} LinkComponent={Link} />
      <LogoCloudSection content={c.logos} LinkComponent={Link} />
      <FeaturesSection id="features" content={c.features} />
      <StatsSection content={c.stats} />
      <TestimonialsSection content={c.testimonials} />
      <PricingSection
        id="pricing"
        content={c.pricing}
        locale={locale}
        labels={{ en: PRICING_LABELS, de: PRICING_LABELS_DE }[locale]}
        LinkComponent={Link}
      />
      <FaqSection id="faq" content={c.faq} />
      <CtaSection id="contact" content={c.cta} LinkComponent={Link} />
      <JsonLd data={faqPageJsonLd(c.faq.items)} />
    </main>
  );
}
