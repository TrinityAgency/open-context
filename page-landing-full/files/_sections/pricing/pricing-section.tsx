import { useId, type ComponentProps, type ReactNode } from 'react';
import { formatPrice, intervalsOf } from './format-price';
import { PRICING_LABELS, type PricingLabels } from './labels';
import type { Cta, LinkComponent, PricingInterval, PricingPlan } from './site-types';

/** The pricing section's layouts, named as in the kit's layout vocabulary. */
export type PricingLayout = 'grid' | 'rows';

export type PricingContent = { title: string; intro?: string; plans: PricingPlan[] };

export type PricingSectionProps = {
  content: PricingContent;
  /**
   * `grid` (the default): plan cards in 1, 2 or 3 columns. `rows`: one plan per row, its name, price and call to
   * action in a line from `md` and its features in a line below.
   */
  layout?: PricingLayout;
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

// Design tokens (Open Context token contract v1): each reads the project's design system once its stylesheet is
// loaded, and falls back to the kit's neutral look when none is.
const INK = 'text-[var(--oc-ink,oklch(20.5%_0_none))]';
const INK_BODY = 'text-[var(--oc-ink-body,oklch(37.1%_0_none))]';
const INK_MUTED = 'text-[var(--oc-ink-muted,oklch(43.9%_0_none))]';
const SURFACE = 'bg-[var(--oc-surface,#fff)]';
const HEADING_FONT = 'font-[family-name:var(--oc-font-heading)]';
const RADIUS_MD = 'rounded-[calc(var(--oc-radius,0.25rem)*1.5)]';
const RADIUS_LG = 'rounded-[calc(var(--oc-radius,0.25rem)*2)]';
const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';
const BRAND_BORDER = 'border-[var(--oc-brand,oklch(20.5%_0_none))]';

const CTA_BASE = `box-border flex min-h-10 w-full items-center justify-center ${RADIUS_MD} border border-solid px-4 py-2 text-center text-sm font-medium no-underline`;
const CTA_CLASS: Record<Cta['variant'], string> = {
  primary: `${CTA_BASE} border-[var(--oc-brand,oklch(20.5%_0_none))] bg-[var(--oc-brand,oklch(20.5%_0_none))] text-[var(--oc-on-brand,#fff)] hover:bg-[var(--oc-brand-hover,oklch(37.1%_0_none))] ${FOCUS}`,
  secondary: `${CTA_BASE} border-[var(--oc-line-strong,oklch(87%_0_none))] ${SURFACE} ${INK} hover:bg-[var(--oc-surface-sunk,oklch(97%_0_none))] ${FOCUS}`,
};
const ROOT = `group/pricing box-border px-6 py-16 ${INK}`;
// One list per interval, shown while its radio is checked: CSS only, so the switch works without JavaScript.
// The classes are whole strings, so Tailwind finds every one of them in the source.
const LIST: Record<PricingLayout, string> = {
  grid: 'm-0 mt-8 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3',
  rows: 'm-0 mt-8 grid list-none grid-cols-1 gap-4 p-0',
};
const SHOWN_WHEN_CHECKED: Record<PricingLayout, Record<PricingInterval, string>> = {
  grid: {
    month: 'm-0 mt-8 hidden list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3 group-has-[input[value=month]:checked]/pricing:grid',
    year: 'm-0 mt-8 hidden list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3 group-has-[input[value=year]:checked]/pricing:grid',
    once: 'm-0 mt-8 hidden list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3 group-has-[input[value=once]:checked]/pricing:grid',
  },
  rows: {
    month: 'm-0 mt-8 hidden list-none grid-cols-1 gap-4 p-0 group-has-[input[value=month]:checked]/pricing:grid',
    year: 'm-0 mt-8 hidden list-none grid-cols-1 gap-4 p-0 group-has-[input[value=year]:checked]/pricing:grid',
    once: 'm-0 mt-8 hidden list-none grid-cols-1 gap-4 p-0 group-has-[input[value=once]:checked]/pricing:grid',
  },
};
// A plan: a card in `grid`; in `rows` a row whose name, price and call to action share a line from md (the call placed
// in the third column of the first line, the features across the second), in reading order name, price, features, call.
// grid-cols-1 below md: an implicit `auto` column would grow to the features' longest word and push the card sideways.
const ROW_GRID = 'grid grid-cols-1 items-center gap-x-8 gap-y-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]';
const CARD: Record<PricingLayout, string> = {
  grid: `box-border flex min-w-0 flex-col ${RADIUS_LG} border border-solid border-[var(--oc-line,oklch(92.2%_0_none))] ${SURFACE} p-6`,
  rows: `box-border ${ROW_GRID} min-w-0 ${RADIUS_LG} border border-solid border-[var(--oc-line,oklch(92.2%_0_none))] ${SURFACE} p-6`,
};
const CARD_HIGHLIGHTED: Record<PricingLayout, string> = {
  grid: `box-border flex min-w-0 flex-col ${RADIUS_LG} border-2 border-solid ${BRAND_BORDER} ${SURFACE} p-6`,
  rows: `box-border ${ROW_GRID} min-w-0 ${RADIUS_LG} border-2 border-solid ${BRAND_BORDER} ${SURFACE} p-6`,
};
const HEAD: Record<PricingLayout, string> = {
  grid: 'flex items-start justify-between gap-3',
  rows: 'flex flex-wrap items-center gap-x-3 gap-y-1',
};
const PRICE: Record<PricingLayout, string> = {
  grid: 'm-0 mt-6 flex flex-wrap items-baseline gap-x-2',
  rows: 'm-0 flex flex-wrap items-baseline gap-x-2',
};
const AMOUNT: Record<PricingLayout, string> = {
  grid: 'text-4xl font-semibold tracking-tight',
  rows: 'text-3xl font-semibold tracking-tight',
};
const FEATURES: Record<PricingLayout, string> = {
  grid: `m-0 mt-6 grid list-none gap-3 p-0 text-sm ${INK_BODY}`,
  rows: `m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-sm ${INK_BODY} md:col-span-3 md:row-start-2`,
};
const ACTION: Record<PricingLayout, string> = {
  grid: 'mt-auto pt-8',
  rows: 'md:col-start-3 md:row-start-1',
};

function Check() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} className={`mt-0.5 block size-4 shrink-0 ${INK}`}>
      <path d="M4.5 10.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Plans and their prices, in one of two layouts (`layout`). Server component. With plans in two or three intervals
 * (month, year, once), a radio switch picks which interval's plans are shown; the switch is plain CSS
 * (`:has(:checked)`), so it works without JavaScript. Prices come in minor units and are written for the locale; a
 * price of 0 shows the "free" label. Colours, fonts and corner radius come from the design tokens.
 */
export function PricingSection({
  content,
  layout = 'grid',
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

  const card = (plan: PricingPlan) => {
    const nameBlock: ReactNode = (
      <>
        <div className={HEAD[layout]}>
          <h3 className={`m-0 min-w-0 text-lg font-semibold ${HEADING_FONT}`}>{plan.name}</h3>
          {plan.highlighted ? (
            <span className="box-border shrink-0 rounded-full bg-[var(--oc-brand,oklch(20.5%_0_none))] px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-[var(--oc-on-brand,#fff)]">
              {l.highlighted}
            </span>
          ) : null}
        </div>
        {plan.description ? <p className={`m-0 mt-2 text-sm ${INK_MUTED}`}>{plan.description}</p> : null}
      </>
    );
    return (
      <li
        key={plan.id}
        data-highlighted={plan.highlighted ? '' : undefined}
        className={plan.highlighted ? CARD_HIGHLIGHTED[layout] : CARD[layout]}
      >
        {layout === 'rows' ? <div className="min-w-0">{nameBlock}</div> : nameBlock}
        <p className={PRICE[layout]}>
          {plan.priceMinor === 0 ? (
            <span className={AMOUNT[layout]}>{l.free}</span>
          ) : (
            <>
              <span className={AMOUNT[layout]}>{formatPrice(plan.priceMinor, plan.currency, locale)}</span>
              <span className={`text-sm ${INK_MUTED}`}>{l.per[plan.interval]}</span>
            </>
          )}
        </p>
        {plan.features.length > 0 ? (
          <ul className={FEATURES[layout]}>
            {plan.features.map((feature, i) => (
              <li key={i} className="flex min-w-0 gap-2">
                <Check />
                <span className="min-w-0">{feature}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <div className={ACTION[layout]}>
          <Link href={plan.cta.href} data-variant={plan.cta.variant} className={CTA_CLASS[plan.cta.variant]}>
            {plan.cta.label}
          </Link>
        </div>
      </li>
    );
  };

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      data-layout={layout}
      className={className ? `${ROOT} ${className}` : ROOT}
    >
      <div className="mx-auto max-w-5xl wrap-break-word">
        <h2 id={headingId} className={`m-0 text-3xl font-semibold tracking-tight ${HEADING_FONT}`}>
          {title}
        </h2>
        {intro ? <p className={`m-0 mt-4 max-w-2xl text-lg ${INK_BODY}`}>{intro}</p> : null}
        {switchable ? (
          <fieldset className="m-0 mt-8 min-w-0 border-0 p-0">
            <legend className={`m-0 p-0 text-sm font-medium ${INK_BODY}`}>{l.billing}</legend>
            <div className={`mt-3 inline-flex flex-wrap gap-1 ${RADIUS_LG} bg-[var(--oc-surface-sunk,oklch(97%_0_none))] p-1`}>
              {intervals.map((interval, i) => (
                <label
                  key={interval}
                  className={`relative box-border inline-flex h-9 cursor-pointer items-center ${RADIUS_MD} px-4 text-sm font-medium ${INK_MUTED} has-checked:bg-[var(--oc-surface,#fff)] has-checked:text-[var(--oc-ink,oklch(20.5%_0_none))] has-checked:shadow-sm has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]`}
                >
                  <input
                    type="radio"
                    name={name}
                    value={interval}
                    defaultChecked={i === 0}
                    className="sr-only accent-[var(--oc-brand,oklch(20.5%_0_none))]"
                  />
                  {l.intervals[interval]}
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}
        {intervals.map((interval) => (
          <ul key={interval} data-interval={interval} className={switchable ? SHOWN_WHEN_CHECKED[layout][interval] : LIST[layout]}>
            {plans.filter((plan) => plan.interval === interval).map(card)}
          </ul>
        ))}
      </div>
    </section>
  );
}
