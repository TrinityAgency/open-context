import Link from 'next/link';
import type { Locale } from '@/content/locale';
import { NAV, SITE, UI } from '@/content/site';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';

// Plain semantic markup with Tailwind utilities. After the first design:sync, approve the export's header
// component in design-sync.config.json and build its classes here with cx from src/design/catalog.ts
// (for example cx('ds-header', { element: 'nav' })) in place of these utilities.
// The first focusable element is the skip link to the page's <main id="main">, hidden until it receives focus.
export function SiteHeader({ locale }: { locale: Locale }) {
  const ui = UI[locale];
  return (
    <header className="relative border-b border-neutral-200">
      <a
        href="#main"
        className={`sr-only focus:top-2 focus:left-4 focus:z-50 focus:m-0 focus:h-auto focus:w-auto focus:overflow-visible focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:whitespace-nowrap focus:text-neutral-900 focus:shadow-md focus:[clip-path:none] ${FOCUS}`}
      >
        {ui.skipLink}
      </a>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link className="font-semibold text-neutral-900 no-underline" href="/">
          {SITE.name}
        </Link>
        <nav aria-label={ui.mainNav}>
          <ul className="m-0 flex list-none flex-wrap gap-6 p-0">
            {NAV[locale].map((item) => (
              <li key={item.href}>
                <Link className="text-neutral-700 no-underline hover:underline" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
