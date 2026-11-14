import { CONTENT } from './content';
import { TERMS_LABELS_DE } from './labels.de';
import { TERMS_LABELS, type TermsLabels } from './labels';
import { LegalText } from './legal-text';

export type TermsContent = {
  title: string;
  /** The date of the last update, `YYYY-MM-DD`. */
  updatedAt: string;
  intro: string;
  sections: { id: string; title: string; body: string }[];
};

export type TermsDocumentProps = {
  content: TermsContent;
  labels?: Partial<TermsLabels>;
  /** The locale the date is written in, e.g. `en` or `de`. Default `en`. */
  locale?: string;
};

/** A `YYYY-MM-DD` date written in full for the locale, as the calendar day it names. Throws `RangeError` otherwise. */
function formatDate(iso: string, locale: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  const [year, month, day] = m ? [Number(m[1]), Number(m[2]), Number(m[3])] : [NaN, NaN, NaN];
  const date = new Date(Date.UTC(year, month - 1, day));
  if (!m || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new RangeError(`updatedAt is not a date (YYYY-MM-DD): ${JSON.stringify(iso)}`);
  }
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}

const LINK =
  'rounded-sm text-neutral-900 underline underline-offset-2 hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';

/**
 * Terms: the title, the date of the last update, an intro, a table of contents and one collapsible section (native
 * `details`) per topic. A section's anchor sits at the start of its content, so following `#<id>` opens it without
 * JavaScript. `[[…]]` placeholders are highlighted. Server component.
 */
export function TermsDocument({ content, labels, locale = 'en' }: TermsDocumentProps) {
  const l = { ...TERMS_LABELS, ...labels };
  const { title, updatedAt, intro, sections } = content;

  return (
    <div className="box-border px-6 py-16 text-neutral-900">
      <div className="mx-auto max-w-3xl">
        <h1 className="m-0 text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="m-0 mt-3 text-sm text-neutral-600">
          {l.updated} <time dateTime={updatedAt}>{formatDate(updatedAt, locale)}</time>
        </p>
        <div className="mt-6 text-lg">
          <LegalText text={intro} placeholderLabel={l.placeholder} />
        </div>
        {sections.length > 0 ? (
          <nav aria-label={l.contents} className="box-border mt-10 rounded-lg border border-solid border-neutral-200 p-6">
            <ol className="m-0 grid list-decimal gap-2 pl-5">
              {sections.map((section) => (
                <li key={section.id} className="pl-1">
                  <a href={`#${section.id}`} className={LINK}>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        {sections.length > 0 ? (
          <div className="mt-12 border-t border-neutral-200">
            {sections.map((section) => (
              <details key={section.id} className="group border-b border-neutral-200">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 [&::-webkit-details-marker]:hidden">
                  <h2 className="m-0 text-xl font-semibold tracking-tight">{section.title}</h2>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="block size-5 shrink-0 text-neutral-500 group-open:rotate-180 motion-safe:transition-transform"
                  >
                    <path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <div id={section.id} className="scroll-mt-24 pb-6">
                  <LegalText text={section.body} placeholderLabel={l.placeholder} />
                </div>
              </details>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** The terms page in one locale: its content, labels and date format. */
export function TermsPage({ locale }: { locale: 'en' | 'de' }) {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <TermsDocument content={CONTENT[locale]} labels={{ en: TERMS_LABELS, de: TERMS_LABELS_DE }[locale]} locale={locale} />
    </main>
  );
}
