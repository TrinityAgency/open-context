import { CONTENT } from './content';
import { IMPRINT_LABELS_DE } from './labels.de';
import { IMPRINT_LABELS, type ImprintLabels } from './labels';
import { LegalText } from './legal-text';

export type ImprintContent = {
  title: string;
  groups: { title: string; entries: { label: string; value: string }[]; note?: string }[];
};

export type ImprintDocumentProps = {
  content: ImprintContent;
  labels?: Partial<ImprintLabels>;
};

/**
 * An imprint (provider identification): the title, then one `h2` and one description list per group of fields, with
 * an optional note under the list. `[[…]]` placeholders are highlighted. Server component.
 */
export function ImprintDocument({ content, labels }: ImprintDocumentProps) {
  const l = { ...IMPRINT_LABELS, ...labels };
  const { title, groups } = content;

  return (
    <div className="box-border px-6 py-16 text-neutral-900">
      <div className="mx-auto max-w-3xl">
        <h1 className="m-0 text-4xl font-semibold tracking-tight">{title}</h1>
        {groups.map((group, i) => (
          <section key={i} className="mt-12">
            <h2 className="m-0 text-xl font-semibold tracking-tight">{group.title}</h2>
            {group.entries.length > 0 ? (
              <dl className="m-0 mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
                {group.entries.map((entry, j) => (
                  <div key={j} className="contents">
                    <dt className="m-0 text-sm font-medium text-neutral-600">{entry.label}</dt>
                    <dd className="m-0 min-w-0">
                      <LegalText text={entry.value} placeholderLabel={l.placeholder} />
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {group.note ? (
              <div className="mt-4 text-sm">
                <LegalText text={group.note} placeholderLabel={l.placeholder} />
              </div>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}

/** The imprint page in one locale: its content and labels. */
export function ImprintPage({ locale }: { locale: 'en' | 'de' }) {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <ImprintDocument content={CONTENT[locale]} labels={{ en: IMPRINT_LABELS, de: IMPRINT_LABELS_DE }[locale]} />
    </main>
  );
}
