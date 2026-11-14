import type { ComponentProps } from 'react';
import { PAGINATION_LABELS, type PaginationLabels } from './labels';
import { clampPage, pageWindow } from './page-window';
import type { LinkComponent } from './site-types';

export type PaginationProps = {
  /** The current page, 1-based. NaN reads as 1, a fraction is rounded down, then it is clamped into 1…pageCount. */
  page: number;
  pageCount: number;
  /** Builds the href of a page, e.g. (n) => `/blog?page=${n}`. */
  hrefFor: (page: number) => string;
  siblings?: number;
  boundaries?: number;
  labels?: Partial<PaginationLabels>;
  /** Renders every link; pass next/link's Link in a Next app. Default: a plain `a`. */
  LinkComponent?: LinkComponent;
  className?: string;
};

function PlainLink(props: ComponentProps<LinkComponent>) {
  return <a {...props} />;
}

const ITEM =
  'box-border inline-flex h-10 min-w-10 items-center justify-center rounded-md border border-solid px-3 text-sm leading-none no-underline';
const LINK = `${ITEM} border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 motion-safe:transition-colors`;
const CURRENT = `${ITEM} border-neutral-900 bg-neutral-900 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900`;
const DISABLED = `${ITEM} border-neutral-200 bg-white text-neutral-500`;
const GAP = 'box-border inline-flex h-10 min-w-6 items-center justify-center text-sm text-neutral-500';

/** Page links for a paged list: previous, a window of pages with gaps, next. Renders nothing for one page. */
export function Pagination({
  page,
  pageCount,
  hrefFor,
  siblings,
  boundaries,
  labels,
  LinkComponent: Link = PlainLink,
  className,
}: PaginationProps) {
  if (pageCount <= 1) return null;
  const l = { ...PAGINATION_LABELS, ...labels };
  // A page from the URL may be junk: NaN reads as 1, a fraction is rounded down, then it is clamped into range.
  const current = clampPage(Number.isNaN(page) ? 1 : Math.trunc(page), pageCount);
  const items = pageWindow(current, pageCount, { siblings, boundaries });

  return (
    <nav aria-label={l.nav} className={className}>
      <ul className="m-0 flex list-none flex-wrap items-center gap-1 p-0">
        <li>
          {current > 1 ? (
            <Link href={hrefFor(current - 1)} rel="prev" className={LINK}>
              {l.previous}
            </Link>
          ) : (
            <span aria-disabled="true" className={DISABLED}>
              {l.previous}
            </span>
          )}
        </li>
        {items.map((item, i) => {
          if (item === 'gap') {
            return (
              <li key={`gap-${i}`} aria-hidden="true" className={GAP}>
                {l.gap}
              </li>
            );
          }
          const isCurrent = item === current;
          return (
            <li key={item}>
              <Link
                href={hrefFor(item)}
                aria-current={isCurrent ? 'page' : undefined}
                aria-label={l.page(item)}
                className={isCurrent ? CURRENT : LINK}
              >
                {item}
              </Link>
            </li>
          );
        })}
        <li>
          {current < pageCount ? (
            <Link href={hrefFor(current + 1)} rel="next" className={LINK}>
              {l.next}
            </Link>
          ) : (
            <span aria-disabled="true" className={DISABLED}>
              {l.next}
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
