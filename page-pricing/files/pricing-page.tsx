import Link from 'next/link';
import { CtaSection } from './_sections/cta/cta-section';
import { FaqSection } from './_sections/faq/faq-section';
import { PRICING_LABELS_DE } from './_sections/pricing/labels.de';
import { PRICING_LABELS } from './_sections/pricing/labels';
import { PricingSection } from './_sections/pricing/pricing-section';
import { ComparisonTable } from './comparison-table';
import { CONTENT } from './content';
import { COMPARISON_LABELS_DE } from './labels.de';
import { COMPARISON_LABELS } from './labels';

/**
 * The pricing page: a header, the plans with their interval switch, a comparison table, questions and a call to
 * action. Server component; `page.tsx` renders it with `LOCALE`, and a site with its own locale setting renders it
 * directly.
 */
export function PricingPage({ locale }: { locale: 'en' | 'de' }) {
  const c = CONTENT[locale];
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <div className="box-border px-6 pt-16 text-neutral-900">
        <div className="mx-auto max-w-5xl">
          <h1 className="m-0 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{c.header.title}</h1>
          <p className="m-0 mt-5 max-w-2xl text-lg text-neutral-700">{c.header.lead}</p>
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
    </main>
  );
}
