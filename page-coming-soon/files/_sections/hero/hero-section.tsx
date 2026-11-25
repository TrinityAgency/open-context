import { useId, type ComponentProps, type ReactNode } from 'react';
import type { Cta, ImageComponent, ImageRef, LinkComponent } from './site-types';

/** The hero's layouts, named as in the kit's layout vocabulary. */
export type HeroLayout = 'split' | 'centered' | 'image' | 'type';

export type HeroContent = {
  eyebrow?: string;
  title: string;
  lead?: string;
  ctas?: Cta[];
  image?: ImageRef;
  /** A short list beside the lead; only `layout="type"` shows it. */
  points?: string[];
};

export type HeroSectionProps = {
  content: HeroContent;
  /**
   * `split`: text and image side by side from `md`. `centered`: the text centred, the image (if any) below it.
   * `image`: the image fills the section, the text sits on a panel over it. `type`: large type, with the lead, the
   * points and the calls to action beside a rule; no image. Absent: `split` with an image, `centered` without one.
   * `split` and `image` need an image and fall back to `centered` without one.
   */
  layout?: HeroLayout;
  /** The heading's level: `1` (the page's title, the default) or `2` (a hero further down a page). */
  headingLevel?: 1 | 2;
  /** Renders the calls to action; pass next/link's Link in a Next app. Default: a plain `a`. */
  LinkComponent?: LinkComponent;
  /** Renders the image; pass a next/image wrapper in a Next app. Default: a plain `img`. */
  ImageComponent?: ImageComponent;
  id?: string;
  className?: string;
};

function PlainLink(props: ComponentProps<LinkComponent>) {
  return <a {...props} />;
}

function PlainImage({ src, alt, width, height, className }: ComponentProps<ImageComponent>) {
  return <img src={src} alt={alt} width={width} height={height} className={className} />;
}

// Design tokens (Open Context token contract v1): each reads the project's design system once its stylesheet is
// loaded, and falls back to the kit's neutral look when none is.
const INK = 'text-[var(--oc-ink,oklch(20.5%_0_none))]';
const INK_BODY = 'text-[var(--oc-ink-body,oklch(37.1%_0_none))]';
const INK_MUTED = 'text-[var(--oc-ink-muted,oklch(43.9%_0_none))]';
const SURFACE = 'bg-[var(--oc-surface,#fff)]';
const BRAND_BG = 'bg-[var(--oc-brand,oklch(20.5%_0_none))]';
const HEADING_FONT = 'font-[family-name:var(--oc-font-heading)]';
const RADIUS_MD = 'rounded-[calc(var(--oc-radius,0.25rem)*1.5)]';
const RADIUS_LG = 'rounded-[calc(var(--oc-radius,0.25rem)*2)]';
const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';

const CTA_BASE = `box-border inline-flex min-h-10 max-w-full items-center justify-center border border-solid px-4 py-2 text-center text-sm font-medium no-underline ${RADIUS_MD} ${FOCUS}`;
const CTA_CLASS: Record<Cta['variant'], string> = {
  primary: `${CTA_BASE} border-[var(--oc-brand,oklch(20.5%_0_none))] ${BRAND_BG} text-[var(--oc-on-brand,#fff)] hover:bg-[var(--oc-brand-hover,oklch(37.1%_0_none))]`,
  secondary: `${CTA_BASE} border-[var(--oc-line-strong,oklch(87%_0_none))] ${SURFACE} ${INK} hover:bg-[var(--oc-surface-sunk,oklch(97%_0_none))]`,
};

const SECTION: Record<HeroLayout, string> = {
  split: `box-border px-6 py-16 ${INK}`,
  centered: `box-border px-6 py-16 ${INK}`,
  image: `relative box-border overflow-hidden px-6 py-16 md:py-24 ${INK}`,
  type: `box-border px-6 py-16 md:py-24 ${INK}`,
};
const HEADING = `m-0 text-4xl font-semibold tracking-tight text-balance sm:text-5xl ${HEADING_FONT}`;
const HEADING_TYPE = `m-0 text-5xl font-semibold tracking-tight text-balance md:text-7xl ${HEADING_FONT}`;
const IMAGE_SPLIT = `block h-auto w-full max-w-full ${RADIUS_LG}`;
const IMAGE_BELOW = `mx-auto mt-12 block h-auto w-full max-w-3xl ${RADIUS_LG}`;
const IMAGE_FILL = 'absolute inset-0 m-0 block h-full w-full max-w-none object-cover';

function shownLayout(layout: HeroLayout | undefined, hasImage: boolean): HeroLayout {
  if (layout === undefined) return hasImage ? 'split' : 'centered';
  if ((layout === 'split' || layout === 'image') && !hasImage) return 'centered';
  return layout;
}

/**
 * The opening section of a page: an optional eyebrow, the title, a lead, calls to action and an optional image, in
 * one of four layouts (`layout`). Server component. Colours, fonts and corner radius come from the design tokens.
 */
export function HeroSection({
  content,
  layout,
  headingLevel = 1,
  LinkComponent: Link = PlainLink,
  ImageComponent: Image = PlainImage,
  id,
  className,
}: HeroSectionProps) {
  const headingId = useId();
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  const { eyebrow, title, lead, ctas = [], image, points = [] } = content;
  const shown = shownLayout(layout, image !== undefined);

  const eyebrowLine = eyebrow ? <p className={`m-0 mb-3 text-sm font-medium ${INK_MUTED}`}>{eyebrow}</p> : null;
  const heading = (
    <Heading id={headingId} className={shown === 'type' ? HEADING_TYPE : HEADING}>
      {title}
    </Heading>
  );
  const leadLine = lead ? <p className={shown === 'type' ? `m-0 text-lg ${INK_BODY}` : `m-0 mt-5 text-lg ${INK_BODY}`}>{lead}</p> : null;
  const ctaRow =
    ctas.length > 0 ? (
      <div data-ctas className={shown === 'centered' ? 'mt-8 flex flex-wrap justify-center gap-3' : 'mt-8 flex flex-wrap gap-3'}>
        {ctas.map((cta, i) => (
          <Link key={i} href={cta.href} data-variant={cta.variant} className={CTA_CLASS[cta.variant]}>
            {cta.label}
          </Link>
        ))}
      </div>
    ) : null;
  const picture = (imageClass: string) =>
    image ? <Image src={image.src} alt={image.alt} width={image.width} height={image.height} className={imageClass} /> : null;

  let body: ReactNode;
  if (shown === 'split') {
    body = (
      <div className="mx-auto max-w-5xl">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="min-w-0 wrap-break-word">
            {eyebrowLine}
            {heading}
            {leadLine}
            {ctaRow}
          </div>
          {picture(IMAGE_SPLIT)}
        </div>
      </div>
    );
  } else if (shown === 'centered') {
    body = (
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center wrap-break-word">
          {eyebrowLine}
          {heading}
          {leadLine}
          {ctaRow}
        </div>
        {picture(IMAGE_BELOW)}
      </div>
    );
  } else if (shown === 'image') {
    body = (
      <>
        {picture(IMAGE_FILL)}
        <div className="relative mx-auto max-w-5xl">
          <div className={`box-border max-w-xl min-w-0 p-6 wrap-break-word sm:p-8 ${SURFACE} ${RADIUS_LG}`}>
            {eyebrowLine}
            {heading}
            {leadLine}
            {ctaRow}
          </div>
        </div>
      </>
    );
  } else {
    body = (
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-12">
          <div className="min-w-0 wrap-break-word">
            {eyebrowLine}
            {heading}
          </div>
          <div className="min-w-0 border-0 border-t-2 border-solid border-[var(--oc-brand,oklch(20.5%_0_none))] pt-6 wrap-break-word md:border-t-0 md:border-l-2 md:pt-0 md:pl-8">
            {leadLine}
            {points.length > 0 ? (
              <ul role="list" className="m-0 mt-5 grid list-none gap-2 p-0">
                {points.map((point, i) => (
                  <li key={i} className={`flex items-start gap-3 text-base ${INK_BODY}`}>
                    <span aria-hidden="true" className={`mt-2 block size-2 shrink-0 rounded-full ${BRAND_BG}`} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {ctaRow}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      data-layout={shown}
      className={className ? `${SECTION[shown]} ${className}` : SECTION[shown]}
    >
      {body}
    </section>
  );
}
