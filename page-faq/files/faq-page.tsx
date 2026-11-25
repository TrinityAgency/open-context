import Link from 'next/link';
import { faqPageJsonLd } from './_parts/site-seo/json-ld';
import { JsonLd } from './_parts/site-seo/json-ld-script';
import { CtaSection } from './_sections/cta/cta-section';
import { FaqSection } from './_sections/faq/faq-section';
import { HeroSection } from './_sections/hero/hero-section';
import { CategoryNav } from './category-nav';
import { CONTENT } from './content';

/**
 * The FAQ page: a hero, a list of the topics, one section of questions per topic, a call to action, and the
 * questions once more as schema.org `FAQPage` data for search engines. Server component; `page.tsx` renders it with
 * `LOCALE`, and a site with its own locale setting renders it directly.
 */
export function FaqPage({ locale }: { locale: 'en' | 'de' }) {
  const c = CONTENT[locale];
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <HeroSection layout="centered" content={c.hero} LinkComponent={Link} />
      <CategoryNav label={c.nav} categories={c.categories} />
      {c.categories.map((category) => (
        <FaqSection
          key={category.id}
          id={category.id}
          layout="split"
          content={{ title: category.title, intro: category.intro, items: category.items }}
        />
      ))}
      <CtaSection id="contact" content={c.cta} LinkComponent={Link} />
      <JsonLd data={faqPageJsonLd(c.categories.flatMap((category) => category.items))} />
    </main>
  );
}
