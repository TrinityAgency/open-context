import Link from 'next/link';
import { CtaSection } from './_sections/cta/cta-section';
import { FeaturesSection } from './_sections/features/features-section';
import { HeroSection } from './_sections/hero/hero-section';
import { StatsSection } from './_sections/stats/stats-section';
import { TeamSection } from './_sections/team/team-section';
import { AboutStory } from './about-story';
import { CONTENT } from './content';

/**
 * The about page: hero, story, values, figures, team and a call to action. Server component; `page.tsx` renders it
 * with `LOCALE`, and a site with its own locale setting renders it directly.
 */
export function AboutPage({ locale }: { locale: 'en' | 'de' }) {
  const c = CONTENT[locale];
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <HeroSection content={c.hero} LinkComponent={Link} />
      <AboutStory content={c.story} />
      <FeaturesSection id="values" content={c.values} />
      <StatsSection content={c.stats} />
      <TeamSection content={c.team} LinkComponent={Link} />
      <CtaSection id="contact" content={c.cta} LinkComponent={Link} />
    </main>
  );
}
