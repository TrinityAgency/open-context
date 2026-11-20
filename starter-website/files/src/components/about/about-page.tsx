import Link from 'next/link';
import { CtaSection } from '@/components/section-cta/cta-section';
import { FeaturesSection } from '@/components/section-features/features-section';
import { HeroSection } from '@/components/section-hero/hero-section';
import { StatsSection } from '@/components/section-stats/stats-section';
import type { Locale } from '@/content/locale';
import { ABOUT_PAGE } from '@/content/pages';
import { AboutStory } from './about-story';
import { TeamGrid } from './team-grid';

/**
 * The about page: hero, story, values, figures, team and a call to action. Server component;
 * src/app/about/page.tsx renders it with LOCALE. Derived from `page-about` 2.0.0; its text is ABOUT_PAGE in
 * src/content/pages.ts.
 */
export function AboutPage({ locale }: { locale: Locale }) {
  const c = ABOUT_PAGE[locale];
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <HeroSection content={c.hero} LinkComponent={Link} />
      <AboutStory content={c.story} />
      <FeaturesSection id="values" content={c.values} />
      <StatsSection content={c.stats} />
      <TeamGrid content={c.team} LinkComponent={Link} />
      <CtaSection id="contact" content={c.cta} LinkComponent={Link} />
    </main>
  );
}
