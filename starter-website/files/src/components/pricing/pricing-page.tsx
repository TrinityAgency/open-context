import Link from 'next/link';
import { CtaSection } from '@/components/section-cta/cta-section';
import { FaqSection } from '@/components/section-faq/faq-section';
import { PRICING_LABELS_DE } from '@/components/section-pricing/labels.de';
import { PRICING_LABELS } from '@/components/section-pricing/labels';
import { PricingSection } from '@/components/section-pricing/pricing-section';
import type { Locale } from '@/content/locale';
import { PRICING_PAGE } from '@/content/pages';
import { JsonLd, faqPageJsonLd } from '@/utils/site-seo';
import { ComparisonTable } from './comparison-table';
import { COMPARISON_LABELS_DE } from './labels.de';
import { COMPARISON_LABELS } from './labels';

/**
 * The pricing page: a header, the plans with their interval switch, a comparison table, questions and a call to
 * action, with the questions as FAQPage data. Server component; src/app/pricing/page.tsx renders it with LOCALE.
 * Derived from `page-pricing` 2.0.0; its text is PRICING_PAGE in src/content/pages.ts.
 */
export function PricingPage({ locale }: { locale: Locale }) {
  const c = PRICING_PAGE[locale];
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <div className="box-border px-6 pt-16 text-oc-ink wrap-break-word">
        <div className="mx-auto max-w-5xl">
          <h1 className="m-0 text-4xl font-semibold tracking-tight text-balance sm:text-5xl font-oc-heading">{c.header.title}</h1>
          <p className="m-0 mt-5 max-w-2xl text-lg text-oc-ink-body">{c.header.lead}</p>
        </div>
      </div>
      <PricingSection
        id="plans"
        content={c.pricing}
        locale={locale}
        labels={{ en: PRICING_LABELS, de: PRICING_LABELS_DE }[locale]}
        LinkComponent={Link}
      />
      <ComparisonTable content={c.comparison} labels={{ en: COMPARISON_LABELS, de: COMPARISON_LABELS_DE }[locale]} />
      <FaqSection id="faq" content={c.faq} />
      <CtaSection id="contact" content={c.cta} LinkComponent={Link} />
      <JsonLd data={faqPageJsonLd(c.faq.items)} />
    </main>
  );
}
