import { useId, type ComponentProps } from 'react';
import { formatPrice, intervalsOf } from './format-price';
import { PRICING_LABELS, type PricingLabels } from './labels';
import type { Cta, LinkComponent, PricingInterval, PricingPlan } from './site-types';

export type PricingContent = { title: string; intro?: string; plans: PricingPlan[] };

export type PricingSectionProps = {
  content: PricingContent;
  /** The locale prices are written in, e.g. `en` or `de`. Default `en`. */
  locale?: string;
  labels?: Partial<PricingLabels>;
  /** Renders the plans' calls to action; pass next/link's Link in a Next app. Default: a plain `a`. */
  LinkComponent?: LinkComponent;
  id?: string;
  className?: string;
};

function PlainLink(props: ComponentProps<LinkComponent>) {
  return <a {...props} />;
}

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';
const CTA_CLASS: Record<Cta['variant'], string> = {
  primary: `box-border flex h-10 w-full items-center justify-center rounded-md border border-solid border-neutral-900 bg-neutral-900 px-4 text-sm font-medium whitespace-nowrap text-white no-underline hover:bg-neutral-700 ${FOCUS}`,
  secondary: `box-border flex h-10 w-full items-center justify-center rounded-md border border-solid border-neutral-300 bg-white px-4 text-sm font-medium whitespace-nowrap text-neutral-900 no-underline hover:bg-neutral-100 ${FOCUS}`,
};
const ROOT = 'group/pricing box-border px-6 py-16 text-neutral-900';
const GRID = 'm-0 mt-8 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3';
// One list per interval, shown while its radio is checked: CSS only, so the switch works without JavaScript.
// The classes are whole strings, so Tailwind finds every one of them in the source.
const SHOWN_WHEN_CHECKED: Record<PricingInterval, string> = {
  month: 'm-0 mt-8 hidden list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3 group-has-[input[value=month]:checked]/pricing:grid',
  year: 'm-0 mt-8 hidden list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3 group-has-[input[value=year]:checked]/pricing:grid',
  once: 'm-0 mt-8 hidden list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3 group-has-[input[value=once]:checked]/pricing:grid',
};
const CARD = 'box-border flex min-w-0 flex-col rounded-lg border border-solid border-neutral-200 bg-white p-6';
const CARD_HIGHLIGHTED = 'box-border flex min-w-0 flex-col rounded-lg border-2 border-solid border-neutral-900 bg-white p-6';

function Check() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} className="mt-0.5 block size-4 shrink-0 text-neutral-900">
      <path d="M4.5 10.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Plans and their prices. Server component. With plans in two or three intervals (month, year, once), a radio switch
 * picks which interval's plans are shown; the switch is plain CSS (`:has(:checked)`), so it works without JavaScript.
 * Prices come in minor units and are written for the locale; a price of 0 shows the "free" label.
 */
export function PricingSection({
  content,
  locale = 'en',
  labels,
  LinkComponent: Link = PlainLink,
  id,
  className,
}: PricingSectionProps) {
  const l = { ...PRICING_LABELS, ...labels };
  const headingId = useId();
  const name = useId();
  const { title, intro, plans } = content;
  const intervals = intervalsOf(plans);
  const switchable = intervals.length > 1;

  const card = (plan: PricingPlan) => (
    <li key={plan.id} className={plan.highlighted ? CARD_HIGHLIGHTED : CARD}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="m-0 text-lg font-semibold">{plan.name}</h3>
        {plan.highlighted ? (
          <span className="box-border shrink-0 rounded-full bg-neutral-900 px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-white">
            {l.highlighted}
          </span>
        ) : null}
      </div>
      {plan.description ? <p className="m-0 mt-2 text-sm text-neutral-600">{plan.description}</p> : null}
      <p className="m-0 mt-6 flex flex-wrap items-baseline gap-x-2">
        {plan.priceMinor === 0 ? (
          <span className="text-4xl font-semibold tracking-tight">{l.free}</span>
        ) : (
          <>
            <span className="text-4xl font-semibold tracking-tight">{formatPrice(plan.priceMinor, plan.currency, locale)}</span>
            <span className="text-sm text-neutral-600">{l.per[plan.interval]}</span>
          </>
        )}
      </p>
      {plan.features.length > 0 ? (
        <ul className="m-0 mt-6 grid list-none gap-3 p-0 text-sm text-neutral-700">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex gap-2">
              <Check />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-auto pt-8">
        <Link href={plan.cta.href} data-variant={plan.cta.variant} className={CTA_CLASS[plan.cta.variant]}>
          {plan.cta.label}
        </Link>
      </div>
    </li>
  );

  return (
    <section id={id} aria-labelledby={headingId} className={className ? `${ROOT} ${className}` : ROOT}>
      <div className="mx-auto max-w-5xl">
        <h2 id={headingId} className="m-0 text-3xl font-semibold tracking-tight">
          {title}
        </h2>
        {intro ? <p className="m-0 mt-4 max-w-2xl text-lg text-neutral-700">{intro}</p> : null}
        {switchable ? (
          <fieldset className="m-0 mt-8 min-w-0 border-0 p-0">
            <legend className="m-0 p-0 text-sm font-medium text-neutral-700">{l.billing}</legend>
            <div className="mt-3 inline-flex flex-wrap gap-1 rounded-lg bg-neutral-100 p-1">
              {intervals.map((interval, i) => (
                <label
                  key={interval}
                  className="relative box-border inline-flex h-9 cursor-pointer items-center rounded-md px-4 text-sm font-medium text-neutral-600 has-checked:bg-white has-checked:text-neutral-900 has-checked:shadow-sm has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-neutral-900"
                >
                  <input type="radio" name={name} value={interval} defaultChecked={i === 0} className="sr-only" />
                  {l.intervals[interval]}
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}
        {intervals.map((interval) => (
          <ul key={interval} data-interval={interval} className={switchable ? SHOWN_WHEN_CHECKED[interval] : GRID}>
            {plans.filter((plan) => plan.interval === interval).map(card)}
          </ul>
        ))}
      </div>
    </section>
  );
}
