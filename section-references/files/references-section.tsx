import { useId, type ComponentProps, type ReactNode } from 'react';
import type { ImageComponent, LinkComponent, Reference } from './site-types';

/** The references' layouts, named as in the kit's layout vocabulary. */
export type ReferencesLayout = 'grid' | 'rows';

export type ReferencesContent = { title: string; intro?: string; items: Reference[] };

export type ReferencesSectionProps = {
  content: ReferencesContent;
  /**
   * `grid` (the default): one card per reference in 1, 2 or 3 columns, the image on top. `rows`: one reference per
   * row in a card, the image beside the text from `md`, the side alternating; without any image it draws `grid`.
   */
  layout?: ReferencesLayout;
  /** Renders the title links; pass next/link's Link in a Next app. Default: a plain `a`. */
  LinkComponent?: LinkComponent;
  /** Renders the images; pass a next/image wrapper in a Next app. Default: a plain `img`. */
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
const HEADING_FONT = 'font-[family-name:var(--oc-font-heading)]';

const ROOT = `box-border px-6 py-16 ${INK}`;
const LIST: Record<ReferencesLayout, string> = {
  grid: 'm-0 mt-10 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3',
  rows: 'm-0 mt-10 grid list-none grid-cols-1 gap-6 p-0',
};
// a card on the surface: a line border, corners 2 × the radius, the image cut to them
const CARD =
  'box-border min-w-0 overflow-hidden border border-solid border-[var(--oc-line,oklch(92.2%_0_none))] bg-[var(--oc-surface,#fff)] rounded-[calc(var(--oc-radius,0.25rem)*2)]';
const GRID_CARD = `${CARD} flex flex-col`;
// rows: the image beside the text from md, filling the row's height (cut, never floating in a band of card ground
// when the text is the taller one), the text centred beside it; a reference without an image keeps its text alone
const ROW_CARD = `${CARD} grid grid-cols-1 md:grid-cols-2`;
const ROW_CARD_TEXT_ONLY = `${CARD} grid grid-cols-1`;
const IMAGE = 'block aspect-[4/3] h-auto w-full max-w-full object-cover';
const ROW_IMAGE_START = `${IMAGE} md:h-full`;
const ROW_IMAGE_END = `${IMAGE} md:order-last md:h-full`;
const FACTS = 'm-0 mb-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-[var(--oc-ink-muted,oklch(43.9%_0_none))]';
const TITLE = `m-0 text-lg font-semibold ${HEADING_FONT}`;
const TITLE_LINK =
  'rounded-[var(--oc-radius,0.25rem)] text-[var(--oc-ink,oklch(20.5%_0_none))] no-underline underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';

/**
 * Past work as cards: each reference's image, client, a meta line (a year, a trade), its title (a link when it has
 * an `href`) and a short description, in one of two layouts (`layout`). Server component. `grid` puts the image on
 * top of each card; `rows` gives each reference a row with the image beside the text, the side alternating. Text never
 * sits on an image. Colours, fonts and corner radius come from the design tokens.
 */
export function ReferencesSection({
  content,
  layout = 'grid',
  LinkComponent: Link = PlainLink,
  ImageComponent: Image = PlainImage,
  id,
  className,
}: ReferencesSectionProps) {
  const headingId = useId();
  const { title, intro, items } = content;
  // rows needs images: references without any draw the grid
  const drawn: ReferencesLayout = layout === 'rows' && !items.some((item) => item.image) ? 'grid' : layout;

  const picture = (item: Reference, cls: string) =>
    item.image ? (
      <Image src={item.image.src} alt={item.image.alt} width={item.image.width} height={item.image.height} className={cls} />
    ) : null;
  const titleOf = (item: Reference) =>
    item.href ? (
      <Link href={item.href} className={TITLE_LINK}>
        {item.title}
      </Link>
    ) : (
      item.title
    );
  const text = (item: Reference, cls: string) => (
    <div className={cls}>
      {item.client || item.meta ? (
        <p data-facts className={FACTS}>
          {item.client ? <span className="min-w-0 max-w-full">{item.client}</span> : null}
          {/* a space, so the two stay two words for a screen reader and a copy; a flex line does not draw it */}
          {item.client && item.meta ? ' ' : null}
          {item.meta ? <span className="min-w-0 max-w-full">{item.meta}</span> : null}
        </p>
      ) : null}
      <h3 className={TITLE}>{titleOf(item)}</h3>
      {item.description ? <p className={`m-0 mt-2 ${INK_BODY}`}>{item.description}</p> : null}
    </div>
  );

  let list: ReactNode = null;
  if (items.length > 0) {
    list =
      drawn === 'rows' ? (
        <ul className={LIST.rows}>
          {items.map((item, i) => {
            const side = i % 2 === 0 ? 'start' : 'end';
            return (
              <li key={i} data-side={side} className={item.image ? ROW_CARD : ROW_CARD_TEXT_ONLY}>
                {picture(item, side === 'start' ? ROW_IMAGE_START : ROW_IMAGE_END)}
                {text(item, 'box-border min-w-0 p-6 md:self-center md:p-8')}
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className={LIST.grid}>
          {items.map((item, i) => (
            <li key={i} className={GRID_CARD}>
              {picture(item, IMAGE)}
              {text(item, 'box-border min-w-0 p-6')}
            </li>
          ))}
        </ul>
      );
  }

  return (
    <section id={id} aria-labelledby={headingId} data-layout={drawn} className={className ? `${ROOT} ${className}` : ROOT}>
      <div className="mx-auto max-w-5xl wrap-break-word">
        <h2 id={headingId} className={`m-0 text-3xl font-semibold tracking-tight ${HEADING_FONT}`}>
          {title}
        </h2>
        {intro ? <p className={`m-0 mt-4 max-w-2xl text-lg ${INK_BODY}`}>{intro}</p> : null}
        {list}
      </div>
    </section>
  );
}
