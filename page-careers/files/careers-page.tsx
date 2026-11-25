import Link from 'next/link';
import { CtaSection } from './_sections/cta/cta-section';
import { FeaturesSection } from './_sections/features/features-section';
import { HeroSection } from './_sections/hero/hero-section';
import { ProcessSection } from './_sections/process/process-section';
import { CONTENT } from './content';
import { OpeningsSection } from './openings';

/**
 * The careers page: a hero, why work here, the open positions, how you hire and a call to action. Server component;
 * `page.tsx` renders it with `LOCALE`, and a site with its own locale setting renders it directly.
 */
export function CareersPage({ locale }: { locale: 'en' | 'de' }) {
  const c = CONTENT[locale];
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <HeroSection layout="centered" content={c.hero} LinkComponent={Link} />
      <FeaturesSection id="benefits" content={c.benefits} />
      <OpeningsSection id="openings" content={c.openings} LinkComponent={Link} />
      <ProcessSection id="hiring" content={c.process} />
      <CtaSection id="contact" content={c.cta} LinkComponent={Link} />
    </main>
  );
}
