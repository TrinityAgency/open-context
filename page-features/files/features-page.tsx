import Link from 'next/link';
import { CtaSection } from './_sections/cta/cta-section';
import { FeaturesSection } from './_sections/features/features-section';
import { HeroSection } from './_sections/hero/hero-section';
import { CONTENT } from './content';

/**
 * The features page: a hero, one section per feature group (one item per row, the image side alternating) and a
 * call to action. Server component; `page.tsx` renders it with `LOCALE`.
 */
export function FeaturesPage({ locale }: { locale: 'en' | 'de' }) {
  const c = CONTENT[locale];
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
