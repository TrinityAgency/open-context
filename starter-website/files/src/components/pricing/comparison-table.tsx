import { COMPARISON_LABELS, type ComparisonLabels } from './labels';

/** One feature and what each plan offers: `true` included, `false` or a missing plan id not included, or a text. */
export type ComparisonRow = { feature: string; values: Record<string, boolean | string> };

export type ComparisonContent = { title: string; plans: { id: string; name: string }[]; rows: ComparisonRow[] };

export type ComparisonTableProps = {
  content: ComparisonContent;
  labels?: Partial<ComparisonLabels>;
};

const CELL = 'border-b border-oc-line px-4 py-3 align-top';

function Check() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.75} className="block size-5 text-oc-ink">
      <path d="M4.5 10.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Dash() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} className="block size-5 text-oc-ink-faint">
      <path d="M6 10h8" strokeLinecap="round" />
    </svg>
  );
}

/**
 * A table comparing the plans feature by feature, with a visible caption. Server component. On a narrow screen the
 * table scrolls sideways inside its own focusable region, never the page. The region is `relative`, so the
 * absolutely positioned `sr-only` texts in the cells are clipped by it; without that they widen the page.
 */
export function ComparisonTable({ content, labels }: ComparisonTableProps) {
  const l = { ...COMPARISON_LABELS, ...labels };
  const { title, plans, rows } = content;

  const value = (v: boolean | string | undefined) =>
    typeof v === 'string' ? (
      v
    ) : v === true ? (
      <>
        <Check />
        <span className="sr-only">{l.included}</span>
      </>
    ) : (
      <>
        <Dash />
        <span className="sr-only">{l.notIncluded}</span>
      </>
    );

  return (
    <div className="box-border px-6 py-16 text-oc-ink wrap-break-word">
      <div className="mx-auto max-w-5xl">
        <div
          role="region"
          aria-label={l.table}
          tabIndex={0}
          className="relative overflow-x-auto rounded-oc focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oc-focus"
        >
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <caption className="m-0 mb-6 p-0 text-left text-3xl font-semibold tracking-tight font-oc-heading">{title}</caption>
            <thead>
              <tr>
                <td className="border-b border-oc-line-strong px-4 py-3" />
                {plans.map((plan) => (
                  <th key={plan.id} scope="col" className="border-b border-oc-line-strong px-4 py-3 text-left text-base font-semibold">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <th scope="row" className={`${CELL} text-left font-normal text-oc-ink-body`}>
                    {row.feature}
                  </th>
                  {plans.map((plan) => (
                    <td key={plan.id} className={CELL}>
                      {value(row.values[plan.id])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
