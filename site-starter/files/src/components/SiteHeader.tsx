import Link from 'next/link';
import { NAV, SITE } from '@/content/site';

// Plain semantic markup with Tailwind utilities. After the first design:sync, approve the export's header
// component in design-sync.config.json and build its classes here with cx from src/design/catalog.ts
// (for example cx('ds-header', { element: 'nav' })) in place of these utilities.
export function SiteHeader() {
  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link className="font-semibold text-neutral-900 no-underline" href="/">
          {SITE.name}
        </Link>
        <nav aria-label="Hauptnavigation">
          <ul className="m-0 flex list-none flex-wrap gap-6 p-0">
            {NAV.map((item) => (
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
