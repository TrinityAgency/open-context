import { useId } from 'react';
import type { FaqItem } from './site-types';

export type FaqContent = { title: string; intro?: string; items: FaqItem[] };

export type FaqSectionProps = {
  content: FaqContent;
  /** Only one answer open at a time: every `details` shares one `name` (unique to this section). */
  exclusive?: boolean;
  id?: string;
  className?: string;
};

const ROOT = 'box-border px-6 py-16 text-neutral-900';

/** An answer's paragraphs: split on blank lines (lines holding only spaces count as blank). */
function paragraphs(answer: string): string[] {
  return answer
    .split(/\n[^\S\n]*\n\s*/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Questions and answers on native `details`: each question opens its answer in place, keyboard complete without
 * JavaScript. Server component. With `exclusive`, opening one closes the others (the browser does it, through the
 * shared `name`).
 */
export function FaqSection({ content, exclusive = false, id, className }: FaqSectionProps) {
  const headingId = useId();
  const name = useId();
  const { title, intro, items } = content;

  return (
    <section id={id} aria-labelledby={headingId} className={className ? `${ROOT} ${className}` : ROOT}>
      <div className="mx-auto max-w-5xl">
        <h2 id={headingId} className="m-0 text-3xl font-semibold tracking-tight">
          {title}
        </h2>
        {intro ? <p className="m-0 mt-4 max-w-2xl text-lg text-neutral-700">{intro}</p> : null}
        {items.length > 0 ? (
          <ul className="m-0 mt-10 grid max-w-3xl list-none border-t border-neutral-200 p-0">
            {items.map((item, i) => (
              <li key={i} className="border-b border-neutral-200">
                <details name={exclusive ? name : undefined} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm py-5 text-base font-medium text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="block size-4 shrink-0 text-neutral-500 group-open:rotate-180 motion-safe:transition-transform"
                    >
                      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </summary>
                  <div className="grid gap-3 pb-5 text-neutral-700">
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
        ) : null}
      </div>
    </section>
  );
}
