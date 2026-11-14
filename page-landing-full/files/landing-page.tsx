import Link from 'next/link';
import { CtaSection } from './_sections/cta/cta-section';
import { FaqSection } from './_sections/faq/faq-section';
import { FeaturesSection } from './_sections/features/features-section';
import { HeroSection } from './_sections/hero/hero-section';
import { LogoCloudSection } from './_sections/logo-cloud/logo-cloud-section';
import { PRICING_LABELS_DE } from './_sections/pricing/labels.de';
import { PRICING_LABELS } from './_sections/pricing/labels';
import { PricingSection } from './_sections/pricing/pricing-section';
import { StatsSection } from './_sections/stats/stats-section';
import { TestimonialsSection } from './_sections/testimonials/testimonials-section';
import { CONTENT } from './content';

/**
 * The full landing page: hero, logos, features, figures, testimonials, pricing, questions and a call to action.
 * Server component; `page.tsx` renders it with `LOCALE`, and a site with its own locale setting renders it directly.
 */
export function LandingPage({ locale }: { locale: 'en' | 'de' }) {
  const c = CONTENT[locale];
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
    </main>
  );
}
