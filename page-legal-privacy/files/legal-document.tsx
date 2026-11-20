import { CONTENT } from './content';
import { PRIVACY_LABELS_DE } from './labels.de';
import { PRIVACY_LABELS, type PrivacyLabels } from './labels';
import { LegalText } from './legal-text';

export type PrivacyContent = {
  title: string;
  /** The date of the last update, `YYYY-MM-DD`. */
  updatedAt: string;
  intro: string;
  sections: { id: string; title: string; summary?: string; body: string }[];
};

export type PrivacyDocumentProps = {
  content: PrivacyContent;
  labels?: Partial<PrivacyLabels>;
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
  'rounded-[var(--oc-radius,0.25rem)] text-[var(--oc-ink,oklch(20.5%_0_none))] underline underline-offset-2 hover:text-[var(--oc-ink-muted,oklch(43.9%_0_none))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';

/**
 * A privacy policy: the title, the date of the last update, an intro, a table of contents and the sections, each
 * with an optional "in short" summary. `[[…]]` placeholders are highlighted. Server component.
 */
export function PrivacyDocument({ content, labels, locale = 'en' }: PrivacyDocumentProps) {
  const l = { ...PRIVACY_LABELS, ...labels };
  const { title, updatedAt, intro, sections } = content;

  return (
    <div className="box-border px-6 py-16 text-[var(--oc-ink,oklch(20.5%_0_none))] wrap-break-word">
      <div className="mx-auto max-w-3xl">
        <h1 className="m-0 text-4xl font-semibold tracking-tight font-[family-name:var(--oc-font-heading)]">{title}</h1>
        <p className="m-0 mt-3 text-sm text-[var(--oc-ink-muted,oklch(43.9%_0_none))]">
          {l.updated} <time dateTime={updatedAt}>{formatDate(updatedAt, locale)}</time>
        </p>
        <div className="mt-6 text-lg">
          <LegalText text={intro} placeholderLabel={l.placeholder} />
        </div>
        {sections.length > 0 ? (
          <nav aria-label={l.contents} className="box-border mt-10 rounded-[calc(var(--oc-radius,0.25rem)*2)] border border-solid border-[var(--oc-line,oklch(92.2%_0_none))] p-6">
            <ol className="m-0 grid grid-cols-1 list-decimal gap-2 pl-5">
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
        {sections.map((section) => (
          <section key={section.id} aria-labelledby={section.id} className="mt-12">
            <h2 id={section.id} className="m-0 scroll-mt-6 text-2xl font-semibold tracking-tight font-[family-name:var(--oc-font-heading)]">
              {section.title}
            </h2>
            {section.summary ? (
              <div className="box-border mt-4 rounded-[calc(var(--oc-radius,0.25rem)*2)] bg-[var(--oc-surface-sunk,oklch(97%_0_none))] p-4">
                <p className="m-0 text-sm font-semibold text-[var(--oc-ink,oklch(20.5%_0_none))]">{l.inShort}</p>
                <div className="mt-1 text-sm">
                  <LegalText text={section.summary} placeholderLabel={l.placeholder} />
                </div>
              </div>
            ) : null}
            <div className="mt-4">
              <LegalText text={section.body} placeholderLabel={l.placeholder} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

/** The privacy page in one locale: its content, labels and date format. */
export function PrivacyPage({ locale }: { locale: 'en' | 'de' }) {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PrivacyDocument content={CONTENT[locale]} labels={{ en: PRIVACY_LABELS, de: PRIVACY_LABELS_DE }[locale]} locale={locale} />
    </main>
  );
}
