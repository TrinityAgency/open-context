import { useId, type ComponentProps } from 'react';
import type { Cta, LinkComponent } from './site-types';

/** The call to action's layouts, named as in the kit's layout vocabulary. */
export type CtaLayout = 'centered' | 'split' | 'band';

export type CtaContent = { title: string; text?: string; ctas: Cta[] };

export type CtaSectionProps = {
  content: CtaContent;
  /**
   * `centered` (the default): title, text and links centred on a light band. `split`: title and text beside the links
   * from `md`, on the light band. `band`: centred on a full-width brand-coloured band; text and focus rings in
   * on-brand, the primary link inverse (surface with brand-coloured text), the secondary one transparent.
   */
  layout?: CtaLayout;
  /** Renders the links; pass next/link's Link in a Next app. Default: a plain `a`. */
  LinkComponent?: LinkComponent;
  id?: string;
  className?: string;
};

function PlainLink(props: ComponentProps<LinkComponent>) {
  return <a {...props} />;
}

// Design tokens (Open Context token contract v1): each reads the project's design system once its stylesheet is
// loaded, and falls back to the kit's neutral look when none is.
const ON_BRAND = 'text-[var(--oc-on-brand,#fff)]';
const FOCUS_RING = 'focus-visible:outline-2 focus-visible:outline-offset-2';
const FOCUS = `${FOCUS_RING} focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]`;
// On the brand band the focus colour may be the brand itself, so the ring is drawn in on-brand (Review Focus 1).
const FOCUS_ON_BRAND = `${FOCUS_RING} focus-visible:outline-[var(--oc-on-brand,#fff)]`;
const CTA_BASE =
  'box-border inline-flex min-h-10 max-w-full items-center justify-center rounded-[calc(var(--oc-radius,0.25rem)*1.5)] border border-solid px-4 py-2 text-center text-sm font-medium no-underline';

type Ground = 'light' | 'band';
const CTA_CLASS: Record<Ground, Record<Cta['variant'], string>> = {
  light: {
    primary: `${CTA_BASE} border-[var(--oc-brand,oklch(20.5%_0_none))] bg-[var(--oc-brand,oklch(20.5%_0_none))] ${ON_BRAND} hover:bg-[var(--oc-brand-hover,oklch(37.1%_0_none))] ${FOCUS}`,
    secondary: `${CTA_BASE} border-[var(--oc-line-strong,oklch(87%_0_none))] bg-[var(--oc-surface,#fff)] text-[var(--oc-ink,oklch(20.5%_0_none))] hover:bg-[var(--oc-surface-sunk,oklch(97%_0_none))] ${FOCUS}`,
  },
  band: {
    primary: `${CTA_BASE} border-[var(--oc-surface,#fff)] bg-[var(--oc-surface,#fff)] text-[var(--oc-brand-ink,oklch(20.5%_0_none))] hover:bg-[var(--oc-surface-alt,oklch(98.5%_0_none))] ${FOCUS_ON_BRAND}`,
    secondary: `${CTA_BASE} border-[var(--oc-on-brand,#fff)] bg-transparent ${ON_BRAND} hover:bg-[var(--oc-brand-hover,oklch(37.1%_0_none))] ${FOCUS_ON_BRAND}`,
  },
};
const ROOT: Record<CtaLayout, string> = {
  centered: 'box-border bg-[var(--oc-surface-sunk,oklch(97%_0_none))] px-6 py-16 text-[var(--oc-ink,oklch(20.5%_0_none))]',
  split: 'box-border bg-[var(--oc-surface-sunk,oklch(97%_0_none))] px-6 py-16 text-[var(--oc-ink,oklch(20.5%_0_none))]',
  band: `box-border bg-[var(--oc-brand,oklch(20.5%_0_none))] px-6 py-16 ${ON_BRAND}`,
};
const HEADING = 'm-0 text-3xl font-semibold tracking-tight text-balance font-[family-name:var(--oc-font-heading)]';
const TEXT_COLOUR: Record<CtaLayout, string> = {
  centered: 'text-[var(--oc-ink-body,oklch(37.1%_0_none))]',
  split: 'text-[var(--oc-ink-body,oklch(37.1%_0_none))]',
  band: ON_BRAND,
};

/**
 * A call to action: a title, an optional line of text and its links, in one of three layouts (`layout`). Server
 * component. Colours, fonts and corner radius come from the design tokens.
 */
export function CtaSection({ content, layout = 'centered', LinkComponent: Link = PlainLink, id, className }: CtaSectionProps) {
  const headingId = useId();
  const { title, text, ctas } = content;
  const ground: Ground = layout === 'band' ? 'band' : 'light';
  const split = layout === 'split';

  const heading = (
    <h2 id={headingId} className={HEADING}>
      {title}
    </h2>
  );
  const textLine = text ? (
    <p className={split ? `m-0 mt-4 max-w-2xl text-lg ${TEXT_COLOUR[layout]}` : `m-0 mx-auto mt-4 max-w-2xl text-lg ${TEXT_COLOUR[layout]}`}>
      {text}
    </p>
  ) : null;
  const links =
    ctas.length > 0 ? (
      <div data-ctas className={split ? 'flex min-w-0 flex-wrap gap-3 md:justify-end' : 'mt-8 flex flex-wrap justify-center gap-3'}>
        {ctas.map((cta, i) => (
          <Link key={i} href={cta.href} data-variant={cta.variant} className={CTA_CLASS[ground][cta.variant]}>
            {cta.label}
          </Link>
        ))}
      </div>
    ) : null;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      data-layout={layout}
      className={className ? `${ROOT[layout]} ${className}` : ROOT[layout]}
    >
      {split ? (
        <div className="mx-auto grid max-w-5xl items-center gap-8 wrap-break-word md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-12">
          <div data-text className="min-w-0">
            {heading}
            {textLine}
          </div>
          {links}
        </div>
      ) : (
        <div className="mx-auto max-w-5xl text-center wrap-break-word">
          {heading}
          {textLine}
          {links}
        </div>
      )}
    </section>
  );
}
