import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { LOCALE } from '@/content/locale';
import { SITE, siteUrl } from '@/content/site';
import './globals.css';

// The defaults; every page sets its own title and description (metadata per page).
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: SITE.description,
};

// Every page brings its own <main id="main">, the skip link's target, so pages installed from the website kit fit
// as they are. Colours are Tailwind's neutral palette until the first design:sync; then use the token utilities
// (globals.css).
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={LOCALE}>
      <body className="flex min-h-screen flex-col bg-white font-sans text-neutral-900">
        <SiteHeader locale={LOCALE} />
        <div className="flex-1">{children}</div>
        <SiteFooter locale={LOCALE} />
      </body>
    </html>
  );
}
