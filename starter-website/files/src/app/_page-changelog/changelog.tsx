import { formatReleaseDate, releaseAnchors, sortReleases } from './changelog-order';
import { CONTENT } from './content';
import { CHANGELOG_LABELS_DE } from './labels.de';
import { CHANGELOG_LABELS, type ChangelogLabels } from './labels';
import type { ChangeKind, ChangelogEntry } from './site-types';

export type ChangelogProps = {
  entries: ChangelogEntry[];
  /** The locale dates are written in, e.g. `en` or `de`. Default `en`. */
  locale?: string;
  labels?: Partial<ChangelogLabels>;
};

const KINDS: ChangeKind[] = ['added', 'changed', 'deprecated', 'removed', 'fixed', 'security'];
const BADGE = 'box-border inline-block rounded-md border border-solid border-neutral-300 px-2 py-0.5 font-mono text-sm font-medium whitespace-nowrap text-neutral-900';

function LinkIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} className="block size-4">
      <path d="M8.5 11.5a3 3 0 0 0 4.24 0l2.5-2.5a3 3 0 0 0-4.24-4.24l-.75.75M11.5 8.5a3 3 0 0 0-4.24 0l-2.5 2.5a3 3 0 0 0 4.24 4.24l.75-.75" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The releases, newest first: one `article` per release with its version badge and title in an `h2` (which carries
 * the anchor), the date, a permalink and the changes grouped by kind. Server component.
 */
export function Changelog({ entries, locale = 'en', labels }: ChangelogProps) {
  const l = { ...CHANGELOG_LABELS, ...labels };
  const releases = sortReleases(entries);
  const anchors = releaseAnchors(releases);

  return (
    <div className="grid gap-14">
      {releases.map((release, i) => {
        const anchor = anchors[i] ?? '';
        return (
          <article key={anchor} aria-labelledby={anchor} className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h2 id={anchor} className="m-0 flex scroll-mt-6 flex-wrap items-center gap-x-3 gap-y-1 text-2xl font-semibold tracking-tight">
                <span className={BADGE}>{release.version}</span>
                {release.title ? (
                  <>
                    {' '}
                    <span>{release.title}</span>
                  </>
                ) : null}
              </h2>
              {i === 0 ? (
                <span className="box-border rounded-full bg-neutral-900 px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-white">
                  {l.latest}
                </span>
              ) : null}
              <a
                href={`#${anchor}`}
                aria-label={l.permalink(release.version)}
                className="box-border inline-flex size-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
              >
                <LinkIcon />
              </a>
            </div>
            <p className="m-0 mt-2 text-sm text-neutral-600">
              <time dateTime={release.date}>{formatReleaseDate(release.date, locale)}</time>
            </p>
            {KINDS.map((kind) => {
              const changes = release.changes.filter((change) => change.kind === kind);
              return changes.length > 0 ? (
                <div key={kind} className="mt-6">
                  <h3 className="m-0 text-sm font-semibold tracking-wide text-neutral-900 uppercase">{l.kinds[kind]}</h3>
                  <ul className="m-0 mt-3 grid list-none gap-2 p-0">
                    {changes.map((change, j) => (
                      <li key={j} className="relative pl-5 text-neutral-700">
                        <span aria-hidden="true" className="absolute top-2.5 left-1 block size-1.5 rounded-full bg-neutral-400" />
                        {change.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null;
            })}
          </article>
        );
      })}
    </div>
  );
}

/** The changelog page in one locale: its title, intro and releases, with that locale's labels and dates. */
export function ChangelogPage({ locale }: { locale: 'en' | 'de' }) {
  const c = CONTENT[locale];
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <div className="box-border px-6 py-16 text-neutral-900">
        <div className="mx-auto max-w-3xl">
          <h1 className="m-0 text-4xl font-semibold tracking-tight sm:text-5xl">{c.title}</h1>
          {c.intro ? <p className="m-0 mt-5 text-lg text-neutral-700">{c.intro}</p> : null}
          <div className="mt-14">
            <Changelog entries={c.entries} locale={locale} labels={{ en: CHANGELOG_LABELS, de: CHANGELOG_LABELS_DE }[locale]} />
          </div>
        </div>
      </div>
    </main>
  );
}
