import type { Locale } from '@/content/locale';
import { CONTACT, UI } from '@/content/site';

// Plain semantic markup with Tailwind utilities. After the first design:sync, approve the export's footer
// component in design-sync.config.json and build its classes here with cx from src/design/catalog.ts
// (for example cx('ds-footer', { element: 'legal' })) in place of these utilities.
// A site run from Germany or Austria needs an imprint and a privacy page; link them here once they exist (and list
// them in sitemap.ts). AGENTS.md, "Growing with the kit", says where they come from.
export function SiteFooter({ locale }: { locale: Locale }) {
  const ui = UI[locale];
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-neutral-600">
        <address className="not-italic">
          {CONTACT.company} · {CONTACT.street}, {CONTACT.zipCity}
          <br />
          {ui.phone}: <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a> · {ui.email}:{' '}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </address>
        <p className="mb-0">
          © {new Date().getFullYear()} {CONTACT.company}
        </p>
      </div>
    </footer>
  );
}
