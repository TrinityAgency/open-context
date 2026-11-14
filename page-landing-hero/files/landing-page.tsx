import Link from 'next/link';
import { CtaSection } from './_sections/cta/cta-section';
import { FeaturesSection } from './_sections/features/features-section';
import { HeroSection } from './_sections/hero/hero-section';
import { CONTENT } from './content';

/**
 * The short landing page: hero, features and a call to action. Server component; `page.tsx` renders it with
 * `LOCALE`, and a site with its own locale setting renders it directly.
 */
export function LandingPage({ locale }: { locale: 'en' | 'de' }) {
  const c = CONTENT[locale];
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <HeroSection content={c.hero} LinkComponent={Link} />
      <FeaturesSection id="features" content={c.features} />
      <CtaSection id="contact" content={c.cta} LinkComponent={Link} />
    </main>
  );
}
