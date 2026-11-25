import Link from 'next/link';
import { HeroSection } from './_sections/hero/hero-section';
import type { LinkItem } from './_sections/hero/site-types';
import { NEWSLETTER_LABELS_DE } from './_sections/newsletter/labels.de';
import { NEWSLETTER_LABELS } from './_sections/newsletter/labels';
import { NewsletterCta } from './_sections/newsletter/newsletter-cta';
import { subscribeAction } from './actions';
import { CONTENT } from './content';

export type ComingSoonLinksProps = {
  /** The row's accessible name, e.g. "Elsewhere". */
  label: string;
  links: LinkItem[];
  className?: string;
};

// Design tokens (Open Context token contract v1): each reads the project's design system once its stylesheet is
// loaded, and falls back to the kit's neutral look when none is.
const LINKS_ROOT = 'box-border px-6 pb-16 text-[var(--oc-ink,oklch(20.5%_0_none))] wrap-break-word';
const LINK =
  'rounded-[var(--oc-radius,0.25rem)] text-base text-[var(--oc-ink,oklch(20.5%_0_none))] underline underline-offset-4 hover:text-[var(--oc-ink-muted,oklch(43.9%_0_none))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';

/** A centred row of links (where else to find you, how to write to you). Server component; none draws nothing. */
export function ComingSoonLinks({ label, links, className }: ComingSoonLinksProps) {
  if (links.length === 0) return null;
  return (
    <nav aria-label={label} className={className ? `${LINKS_ROOT} ${className}` : LINKS_ROOT}>
      <ul className="m-0 mx-auto flex max-w-3xl list-none flex-wrap justify-center gap-x-6 gap-y-3 p-0">
        {links.map((link, i) => (
          <li key={i} className="min-w-0 max-w-full">
            <Link href={link.href} className={LINK}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * The coming soon page: a hero with the launch date as text, a newsletter signup on the page's own server action
 * (`actions.ts`, which calls `subscribe` in `subscribe.ts`) and a row of links. Server component; `page.tsx` renders
 * it with `LOCALE` and keeps it out of search engines, and a site with its own locale setting renders it directly.
 */
export function ComingSoonPage({ locale }: { locale: 'en' | 'de' }) {
  const c = CONTENT[locale];
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <HeroSection layout="centered" content={c.hero} LinkComponent={Link} />
      <div className="box-border px-6 pb-16">
        <div className="mx-auto max-w-3xl">
          <NewsletterCta
            id="newsletter"
            layout="inline"
            content={c.newsletter}
            action={subscribeAction}
            labels={{ en: NEWSLETTER_LABELS, de: NEWSLETTER_LABELS_DE }[locale]}
            LinkComponent={Link}
          />
        </div>
      </div>
      <ComingSoonLinks label={c.links.label} links={c.links.items} />
    </main>
  );
}
