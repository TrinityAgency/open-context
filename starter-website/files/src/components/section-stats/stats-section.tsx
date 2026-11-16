import { useId } from 'react';
import type { Stat } from './site-types';

export type StatsContent = { title: string; intro?: string; items: Stat[] };

export type StatsSectionProps = {
  content: StatsContent;
  id?: string;
  className?: string;
};

const ROOT = 'box-border px-6 py-16 text-neutral-900';

/**
 * Key figures as a description list: each figure's label is its term, its value the definition, shown large above the
 * label. Server component.
 */
export function StatsSection({ content, id, className }: StatsSectionProps) {
  const headingId = useId();
  const { title, intro, items } = content;

  return (
    <section id={id} aria-labelledby={headingId} className={className ? `${ROOT} ${className}` : ROOT}>
      <div className="mx-auto max-w-5xl">
        <h2 id={headingId} className="m-0 text-3xl font-semibold tracking-tight">
          {title}
        </h2>
        {intro ? <p className="m-0 mt-4 max-w-2xl text-lg text-neutral-700">{intro}</p> : null}
        {items.length > 0 ? (
          <dl className="m-0 mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, i) => (
              <div key={i} className="box-border flex min-w-0 flex-col border-l-2 border-neutral-200 pl-5">
                <dt className="m-0 mt-2 text-sm font-medium text-neutral-600">{item.label}</dt>
                <dd className="order-first m-0 text-4xl font-semibold tracking-tight">{item.value}</dd>
                {item.description ? <dd className="m-0 mt-1 text-sm text-neutral-600">{item.description}</dd> : null}
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}
