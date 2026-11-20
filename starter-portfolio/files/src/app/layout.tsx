import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Header } from '@/components/header';
import { SITE_FOOTER_LABELS_DE } from '@/components/site-footer/labels.de';
import { SITE_FOOTER_LABELS } from '@/components/site-footer/labels';
import { SiteFooter } from '@/components/site-footer/site-footer';
import { FEED_TYPES } from '@/content/blog';
import { LOCALE } from '@/content/locale';
import { CONSENT_CATEGORIES, CONTACT, CTA, FOOTER_COLUMNS, LEGAL, NAV, SITE, siteUrl } from '@/content/site';
import { CONSENT_LABELS, CONSENT_LABELS_DE, ConsentProvider } from '@/modules/site-cookie-consent';
import { JsonLd, organizationJsonLd, websiteJsonLd } from '@/utils/site-seo';
import './globals.css';

// The defaults; every page sets its own title and description (metadata per page). The feed links are announced
// here for pages without a canonical URL; a page with one names them again (blogMetadata in src/content/blog.ts).
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: SITE.description,
  alternates: { types: FEED_TYPES },
};

// Every page brings its own <main id="main">, the skip link's target. The consent provider shows the banner until a
// choice is made; the footer's "cookie settings" button opens the choice again. The page takes the design tokens:
// the surface, the ink and the body font (globals.css gives the page Tailwind's sans stack until a design sets one).
export default function RootLayout({ children }: { children: ReactNode }) {
  const site = { ...SITE, url: siteUrl() };
  return (
    <html lang={LOCALE}>
      <body className="flex min-h-screen flex-col bg-oc-surface font-oc-body text-oc-ink">
        <ConsentProvider categories={CONSENT_CATEGORIES[LOCALE]} labels={{ en: CONSENT_LABELS, de: CONSENT_LABELS_DE }[LOCALE]}>
          <Header identity={SITE} nav={NAV[LOCALE]} cta={CTA[LOCALE]} />
          <div className="flex-1">{children}</div>
          <SiteFooter
            identity={SITE}
            columns={FOOTER_COLUMNS[LOCALE]}
            contact={CONTACT}
            legal={LEGAL[LOCALE]}
            cookieSettings
            labels={{ en: SITE_FOOTER_LABELS, de: SITE_FOOTER_LABELS_DE }[LOCALE]}
            LinkComponent={Link}
          />
        </ConsentProvider>
        <JsonLd data={[organizationJsonLd(site, { contact: CONTACT }), websiteJsonLd(site)]} />
      </body>
    </html>
  );
}
