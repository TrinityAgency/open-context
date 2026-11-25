import { useId, type ComponentProps, type ReactNode } from 'react';
import type { Feature, ImageComponent } from './site-types';

/** The features' layouts, named as in the kit's layout vocabulary. */
export type FeaturesLayout = 'grid' | 'rows' | 'split';

export type FeaturesContent = { title: string; intro?: string; items: Feature[] };

export type FeaturesSectionProps = {
  content: FeaturesContent;
  /**
   * `grid` (the default): cards in 1, 2 or 3 columns. `rows`: one item per row, text beside its image from `md`, the
   * image side alternating (an item without an image keeps its text in the row's first column, as in 2.0.0).
   * `split`: the title and intro in a column beside the items from `md`.
   */
  layout?: FeaturesLayout;
  /** Renders the images; pass a next/image wrapper in a Next app. Default: a plain `img`. */
  ImageComponent?: ImageComponent;
  id?: string;
  className?: string;
};

function PlainImage({ src, alt, width, height, className }: ComponentProps<ImageComponent>) {
  return <img src={src} alt={alt} width={width} height={height} className={className} />;
}

// Design tokens (Open Context token contract v1): each reads the project's design system once its stylesheet is
// loaded, and falls back to the kit's neutral look when none is.
const INK = 'text-[var(--oc-ink,oklch(20.5%_0_none))]';
const INK_BODY = 'text-[var(--oc-ink-body,oklch(37.1%_0_none))]';
const HEADING_FONT = 'font-[family-name:var(--oc-font-heading)]';
const RADIUS_MD = 'rounded-[calc(var(--oc-radius,0.25rem)*1.5)]';
const RADIUS_LG = 'rounded-[calc(var(--oc-radius,0.25rem)*2)]';

/** One SVG path in a 24-unit box: `Feature.icon` is its `d`. */
function Icon({ d }: { d: string }) {
  return (
    <span className={`mb-4 flex size-10 items-center justify-center ${RADIUS_MD} bg-[var(--oc-surface-sunk,oklch(97%_0_none))] ${INK}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true" className="block size-6">
        <path d={d} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

const ROOT = `box-border px-6 py-16 ${INK}`;
const IMAGE = `block h-auto w-full max-w-full ${RADIUS_LG}`;
const HEADING = `m-0 text-3xl font-semibold tracking-tight ${HEADING_FONT}`;
const INTRO = `m-0 mt-4 max-w-2xl text-lg ${INK_BODY}`;
const LIST: Record<FeaturesLayout, string> = {
  grid: 'm-0 mt-10 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 lg:grid-cols-3',
  rows: 'm-0 mt-12 grid list-none gap-16 p-0',
  split: 'm-0 grid min-w-0 list-none grid-cols-1 gap-10 p-0 lg:grid-cols-2',
};

/**
 * A titled list of features: each with an optional icon, a title, a description and an optional image, in one of
 * three layouts (`layout`). Server component. `grid` shows them as cards in up to three columns; `rows` gives each its
 * own row, text beside the image from `md`, the image side alternating; `split` puts the title and intro beside the
 * features. Colours, fonts and corner radius come from the design tokens.
 */
export function FeaturesSection({
  content,
  layout = 'grid',
  ImageComponent: Image = PlainImage,
  id,
  className,
}: FeaturesSectionProps) {
  const headingId = useId();
  const { title, intro, items } = content;

  const picture = (item: Feature, cls: string) =>
    item.image ? (
      <Image src={item.image.src} alt={item.image.alt} width={item.image.width} height={item.image.height} className={cls} />
    ) : null;
  const text = (item: Feature) => (
    <>
      {item.icon ? <Icon d={item.icon} /> : null}
      <h3 className={`m-0 text-lg font-semibold ${HEADING_FONT}`}>{item.title}</h3>
      <p className={`m-0 mt-2 ${INK_BODY}`}>{item.description}</p>
    </>
  );
  const heading = (
    <h2 id={headingId} className={HEADING}>
      {title}
    </h2>
  );
  const introLine = intro ? <p className={INTRO}>{intro}</p> : null;

  let list: ReactNode = null;
  if (items.length > 0) {
    list =
      layout === 'rows' ? (
        <ul className={LIST.rows}>
          {items.map((item, i) => {
            const side = i % 2 === 0 ? 'start' : 'end';
            return (
              <li key={i} data-side={side} className="grid items-center gap-8 md:grid-cols-2">
                <div className="min-w-0">{text(item)}</div>
                {picture(item, side === 'start' ? `${IMAGE} md:order-first` : IMAGE)}
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className={LIST[layout]}>
          {items.map((item, i) => (
            <li key={i} className="min-w-0">
              {picture(item, `${IMAGE} mb-4`)}
              {text(item)}
            </li>
          ))}
        </ul>
      );
  }

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      data-layout={layout}
      className={className ? `${ROOT} ${className}` : ROOT}
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
