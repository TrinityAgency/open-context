import type { Locale } from '@/content/locale';
import { CONTACT, UI } from '@/content/site';

// Plain semantic markup with Tailwind utilities that read the design tokens (bg-oc-surface-alt, text-oc-ink-body,
// …), so a connected design reaches it. To use the export's own footer component instead, approve it in
// design-sync.config.json and build its classes with cx from src/design-system/generated/catalog.ts
// (for example cx('ds-footer', { element: 'legal' })).
// A site run from Germany or Austria needs an imprint and a privacy page; link them here once they exist (and list
// them in sitemap.ts). AGENTS.md, "Growing with the kit", says where they come from.
export function SiteFooter({ locale }: { locale: Locale }) {
  const ui = UI[locale];
  return (
    <footer className="border-t border-oc-line bg-oc-surface-alt">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-oc-ink-body">
        <address className="not-italic">
          {CONTACT.company} · {CONTACT.street}, {CONTACT.zipCity}
          <br />
          {ui.phone}: <a className="text-oc-ink" href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a> · {ui.email}:{' '}
          <a className="text-oc-ink" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </address>
        <p className="mb-0">
          © {new Date().getFullYear()} {CONTACT.company}
        </p>
      </div>
    </footer>
  );
}
