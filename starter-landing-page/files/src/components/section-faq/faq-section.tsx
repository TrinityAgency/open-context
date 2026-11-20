import { useId } from 'react';
import type { FaqItem } from './site-types';

/** The FAQ's layouts, named as in the kit's layout vocabulary. */
export type FaqLayout = 'centered' | 'split';

export type FaqContent = { title: string; intro?: string; items: FaqItem[] };

export type FaqSectionProps = {
  content: FaqContent;
  /**
   * `centered` (the default): one column, the title and intro above the questions. `split`: the title and intro
   * beside the questions from `lg`, stacked below it.
   */
  layout?: FaqLayout;
  /** Only one answer open at a time: every `details` shares one `name` (unique to this section). */
  exclusive?: boolean;
  id?: string;
  className?: string;
};

// Design tokens (Open Context token contract v1): each reads the project's design system once its stylesheet is
// loaded, and falls back to the kit's neutral look when none is.
const INK = 'text-[var(--oc-ink,oklch(20.5%_0_none))]';
const INK_BODY = 'text-[var(--oc-ink-body,oklch(37.1%_0_none))]';
const LINE = 'border-[var(--oc-line,oklch(92.2%_0_none))]';

const ROOT = `box-border px-6 py-16 ${INK}`;
const HEADING = 'm-0 text-3xl font-semibold tracking-tight font-[family-name:var(--oc-font-heading)]';
const INTRO = `m-0 mt-4 max-w-2xl text-lg ${INK_BODY}`;
const LIST: Record<FaqLayout, string> = {
  centered: `m-0 mt-10 grid max-w-3xl list-none border-t ${LINE} p-0`,
  split: `m-0 grid min-w-0 list-none border-t ${LINE} p-0`,
};
// A grid, not a flex row: the question is a bare text node, and only a minmax(0,1fr) column lets a word wider than the
// row break inside it (a flex row cannot shrink below its longest word). The chevron keeps 2.0.0's place at the end.
const SUMMARY = `grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-[var(--oc-radius,0.25rem)] py-5 text-base font-medium ${INK} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))] [&::-webkit-details-marker]:hidden`;

/** An answer's paragraphs: split on blank lines (lines holding only spaces count as blank). */
function paragraphs(answer: string): string[] {
  return answer
    .split(/\n[^\S\n]*\n\s*/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Questions and answers on native `details`: each question opens its answer in place, keyboard complete without
 * JavaScript, in one of two layouts (`layout`). Server component. With `exclusive`, opening one closes the others
 * (the browser does it, through the shared `name`). Colours, fonts and corner radius come from the design tokens.
 */
export function FaqSection({ content, layout = 'centered', exclusive = false, id, className }: FaqSectionProps) {
  const headingId = useId();
  const name = useId();
  const { title, intro, items } = content;

  const heading = (
    <h2 id={headingId} className={HEADING}>
      {title}
    </h2>
  );
  const introLine = intro ? <p className={INTRO}>{intro}</p> : null;
  const list =
    items.length > 0 ? (
      <ul className={LIST[layout]}>
        {items.map((item, i) => (
          <li key={i} className={`border-b ${LINE}`}>
            <details name={exclusive ? name : undefined} className="group">
              <summary className={SUMMARY}>
                {item.question}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="block size-4 shrink-0 text-[var(--oc-ink-subtle,oklch(55.6%_0_none))] group-open:rotate-180 motion-safe:transition-transform"
                >
                  <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <div className={`grid gap-3 pb-5 ${INK_BODY}`}>
                {paragraphs(item.answer).map((p, j) => (
                  <p key={j} className="m-0">
                    {p}
                  </p>
                ))}
              </div>
            </details>
          </li>
        ))}
      </ul>
    ) : null;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      data-layout={layout}
      className={className ? `${ROOT} ${className}` : ROOT}
    >
      {layout === 'split' ? (
        <div className="mx-auto grid max-w-5xl gap-10 wrap-break-word lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12">
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
