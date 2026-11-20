import { useId } from 'react';
import type { Stat } from './site-types';

/** The stats' layouts, named as in the kit's layout vocabulary. */
export type StatsLayout = 'grid' | 'split' | 'band';

export type StatsContent = { title: string; intro?: string; items: Stat[] };

export type StatsSectionProps = {
  content: StatsContent;
  /**
   * `grid` (the default): the figures in 1, 2 or 4 columns below the title. `split`: the title and intro beside the
   * figures from `md`. `band`: a full-width band on the brand colour, every text in on-brand.
   */
  layout?: StatsLayout;
  id?: string;
  className?: string;
};

// Design tokens (Open Context token contract v1): each reads the project's design system once its stylesheet is
// loaded, and falls back to the kit's neutral look when none is.
const HEADING_FONT = 'font-[family-name:var(--oc-font-heading)]';
const INK_BODY = 'text-[var(--oc-ink-body,oklch(37.1%_0_none))]';
const INK_MUTED = 'text-[var(--oc-ink-muted,oklch(43.9%_0_none))]';
const ON_BRAND = 'text-[var(--oc-on-brand,#fff)]';

const ROOT: Record<StatsLayout, string> = {
  grid: 'box-border px-6 py-16 text-[var(--oc-ink,oklch(20.5%_0_none))]',
  split: 'box-border px-6 py-16 text-[var(--oc-ink,oklch(20.5%_0_none))]',
  band: `box-border bg-[var(--oc-brand,oklch(20.5%_0_none))] px-6 py-16 ${ON_BRAND}`,
};
const HEADING = `m-0 text-3xl font-semibold tracking-tight ${HEADING_FONT}`;
const INTRO: Record<StatsLayout, string> = {
  grid: `m-0 mt-4 max-w-2xl text-lg ${INK_BODY}`,
  split: `m-0 mt-4 max-w-2xl text-lg ${INK_BODY}`,
  band: `m-0 mt-4 max-w-2xl text-lg ${ON_BRAND}`,
};
const LIST: Record<StatsLayout, string> = {
  grid: 'm-0 mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4',
  split: 'm-0 grid min-w-0 grid-cols-1 gap-8 sm:grid-cols-2',
  band: 'm-0 mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4',
};
const ITEM: Record<StatsLayout, string> = {
  grid: 'box-border flex min-w-0 flex-col border-l-2 border-[var(--oc-line,oklch(92.2%_0_none))] pl-5',
  split: 'box-border flex min-w-0 flex-col border-l-2 border-[var(--oc-line,oklch(92.2%_0_none))] pl-5',
  band: 'box-border flex min-w-0 flex-col border-l-2 border-[var(--oc-on-brand,#fff)] pl-5',
};
const LABEL: Record<StatsLayout, string> = {
  grid: `m-0 mt-2 text-sm font-medium ${INK_MUTED}`,
  split: `m-0 mt-2 text-sm font-medium ${INK_MUTED}`,
  band: `m-0 mt-2 text-sm font-medium ${ON_BRAND}`,
};
const DESCRIPTION: Record<StatsLayout, string> = {
  grid: `m-0 mt-1 text-sm ${INK_MUTED}`,
  split: `m-0 mt-1 text-sm ${INK_MUTED}`,
  band: `m-0 mt-1 text-sm ${ON_BRAND}`,
};
const VALUE = 'order-first m-0 text-4xl font-semibold tracking-tight';

/**
 * Key figures as a description list: each figure's label is its term, its value the definition, shown large above the
 * label, in one of three layouts (`layout`). Server component. Colours and fonts come from the design tokens.
 */
export function StatsSection({ content, layout = 'grid', id, className }: StatsSectionProps) {
  const headingId = useId();
  const { title, intro, items } = content;

  const heading = (
    <h2 id={headingId} className={HEADING}>
      {title}
    </h2>
  );
  const introLine = intro ? <p className={INTRO[layout]}>{intro}</p> : null;
  const list =
    items.length > 0 ? (
      <dl className={LIST[layout]}>
        {items.map((item, i) => (
          <div key={i} className={ITEM[layout]}>
            <dt className={LABEL[layout]}>{item.label}</dt>
            <dd className={VALUE}>{item.value}</dd>
            {item.description ? <dd className={DESCRIPTION[layout]}>{item.description}</dd> : null}
          </div>
        ))}
      </dl>
    ) : null;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      data-layout={layout}
      className={className ? `${ROOT[layout]} ${className}` : ROOT[layout]}
    >
      {layout === 'split' ? (
        <div className="mx-auto grid max-w-5xl gap-10 wrap-break-word md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-12">
          <div data-intro className="min-w-0">
            {heading}
            {introLine}
          </div>
          {list}
        </div>
      ) : (
        <div className="mx-auto max-w-5xl wrap-break-word">
          {heading}
          {introLine}
          {list}
        </div>
      )}
    </section>
  );
}
