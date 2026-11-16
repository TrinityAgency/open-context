import Link from 'next/link';
import { CtaSection } from '@/components/section-cta/cta-section';
import { FeaturesSection } from '@/components/section-features/features-section';
import { HeroSection } from '@/components/section-hero/hero-section';
import type { Locale } from '@/content/locale';
import { FEATURES_PAGE } from '@/content/pages';

/**
 * The features page: a hero, one section per feature group (one item per row, the image side alternating) and a
 * call to action. Server component; src/app/features/page.tsx renders it with LOCALE. Derived from `page-features`
 * 1.0.0; its text is FEATURES_PAGE in src/content/pages.ts.
 */
export function FeaturesPage({ locale }: { locale: Locale }) {
  const c = FEATURES_PAGE[locale];
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <HeroSection content={c.hero} LinkComponent={Link} />
      {c.groups.map((group) => (
        <FeaturesSection key={group.id} id={group.id} layout="rows" content={group.content} />
      ))}
      <CtaSection id="contact" content={c.cta} LinkComponent={Link} />
    </main>
  );
}
