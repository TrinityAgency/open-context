import { useId } from 'react';
import type { ProcessStep } from './site-types';

/** The process's layouts, named as in the kit's layout vocabulary. */
export type ProcessLayout = 'rows' | 'grid';

export type ProcessContent = { title: string; intro?: string; steps: ProcessStep[] };

export type ProcessSectionProps = {
  content: ProcessContent;
  /**
   * `rows` (the default): one step per row, its number in a badge beside the title and description, a rule joining
   * the badges. `grid`: the steps in 1, 2 or 3 columns, each badge above its title.
   */
  layout?: ProcessLayout;
  id?: string;
  className?: string;
};

// Design tokens (Open Context token contract v1): each reads the project's design system once its stylesheet is
// loaded, and falls back to the kit's neutral look when none is.
const INK = 'text-[var(--oc-ink,oklch(20.5%_0_none))]';
const INK_BODY = 'text-[var(--oc-ink-body,oklch(37.1%_0_none))]';
const HEADING_FONT = 'font-[family-name:var(--oc-font-heading)]';

const ROOT = `box-border px-6 py-16 ${INK}`;
// the step's number: on-brand text on a brand circle, wide enough for two digits
const BADGE =
  'box-border flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--oc-brand,oklch(20.5%_0_none))] text-sm font-semibold tabular-nums text-[var(--oc-on-brand,#fff)]';
const LIST: Record<ProcessLayout, string> = {
  rows: 'm-0 mt-10 list-none p-0',
  grid: 'm-0 mt-10 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 lg:grid-cols-3',
};
const ROW_ITEM = 'relative flex min-w-0 gap-5 pb-10 last:pb-0';
// the rule from below one badge to the next, centred under the badge (decoration)
const RULE = 'absolute start-[19px] top-12 bottom-2 w-0.5 bg-[var(--oc-line,oklch(92.2%_0_none))]';
const GRID_ITEM = 'min-w-0';
const STEP_TITLE = `m-0 text-lg font-semibold ${HEADING_FONT}`;

/**
 * How you work, as numbered steps: each a title and an optional description, in one of two layouts (`layout`).
 * Server component. `rows` draws one step per row with its number beside it and a rule joining the numbers; `grid`
 * draws the steps in up to three columns, each number above its title. The numbers are text in an ordered list.
 * Colours and fonts come from the design tokens.
 */
export function ProcessSection({ content, layout = 'rows', id, className }: ProcessSectionProps) {
  const headingId = useId();
  const { title, intro, steps } = content;
  const last = steps.length - 1;

  const badge = (i: number) => (
    <span data-step-number className={BADGE}>
      {i + 1}
    </span>
  );
  const description = (step: ProcessStep, cls: string) =>
    step.description ? <p className={cls}>{step.description}</p> : null;

  return (
    <section id={id} aria-labelledby={headingId} data-layout={layout} className={className ? `${ROOT} ${className}` : ROOT}>
      <div className="mx-auto max-w-5xl wrap-break-word">
        <h2 id={headingId} className={`m-0 text-3xl font-semibold tracking-tight ${HEADING_FONT}`}>
          {title}
        </h2>
        {intro ? <p className={`m-0 mt-4 max-w-2xl text-lg ${INK_BODY}`}>{intro}</p> : null}
        {steps.length > 0 ? (
          <ol className={LIST[layout]}>
            {steps.map((step, i) =>
              layout === 'grid' ? (
                <li key={i} className={GRID_ITEM}>
                  {badge(i)}
                  <h3 className={`mt-4 mb-0 text-lg font-semibold ${HEADING_FONT}`}>{step.title}</h3>
                  {description(step, `m-0 mt-2 ${INK_BODY}`)}
                </li>
              ) : (
                <li key={i} className={ROW_ITEM}>
                  {badge(i)}
                  <div className="min-w-0 flex-1 pt-2">
                    <h3 className={STEP_TITLE}>{step.title}</h3>
                    {description(step, `m-0 mt-1 ${INK_BODY}`)}
                  </div>
                  {i < last ? <span data-step-rule aria-hidden="true" className={RULE} /> : null}
                </li>
              ),
            )}
          </ol>
        ) : null}
      </div>
    </section>
  );
}
