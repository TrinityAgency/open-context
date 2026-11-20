import { useId, type ComponentProps } from 'react';
import type { ImageComponent, Testimonial } from './site-types';

/** The testimonials' layouts, named as in the kit's layout vocabulary. */
export type TestimonialsLayout = 'grid' | 'centered' | 'wall';

export type TestimonialsContent = { title: string; items: Testimonial[] };

export type TestimonialsSectionProps = {
  content: TestimonialsContent;
  /**
   * `grid` (the default): quote cards in 1, 2 or 3 columns. `centered`: one large quote per row, centred, the portrait
   * and name below it (the name alone when there is no portrait). `wall`: cards of their own heights in flowing
   * columns.
   */
  layout?: TestimonialsLayout;
  /** Renders the portraits; pass a next/image wrapper in a Next app. Default: a plain `img`. */
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
const INK_SOFT = 'text-[var(--oc-ink-soft,oklch(26.9%_0_none))]';
const INK_MUTED = 'text-[var(--oc-ink-muted,oklch(43.9%_0_none))]';
const HEADING_FONT = 'font-[family-name:var(--oc-font-heading)]';

const ROOT = `box-border px-6 py-16 ${INK}`;
const CARD =
  'm-0 box-border flex w-full flex-col justify-between gap-6 rounded-[calc(var(--oc-radius,0.25rem)*2)] border border-solid border-[var(--oc-line,oklch(92.2%_0_none))] bg-[var(--oc-surface,#fff)] p-6';
const LIST: Record<TestimonialsLayout, string> = {
  grid: 'm-0 mt-10 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3',
  centered: 'm-0 mt-12 grid list-none grid-cols-1 gap-16 p-0',
  wall: 'm-0 mt-10 list-none columns-1 gap-6 p-0 md:columns-2 lg:columns-3',
};
const ITEM: Record<TestimonialsLayout, string> = {
  grid: 'flex min-w-0',
  centered: 'min-w-0',
  wall: 'mb-6 break-inside-avoid',
};
const FIGURE: Record<TestimonialsLayout, string> = {
  grid: CARD,
  centered: 'm-0 mx-auto flex max-w-3xl flex-col items-center gap-6 text-center',
  wall: CARD,
};
const QUOTE: Record<TestimonialsLayout, string> = {
  grid: `m-0 text-base ${INK_SOFT}`,
  centered: `m-0 text-xl font-medium text-balance md:text-2xl ${INK_SOFT}`,
  wall: `m-0 text-base ${INK_SOFT}`,
};
const CAPTION: Record<TestimonialsLayout, string> = {
  grid: 'flex items-center gap-3',
  centered: 'flex flex-col items-center gap-3',
  wall: 'flex items-center gap-3',
};
const PORTRAIT: Record<TestimonialsLayout, string> = {
  grid: 'block size-10 shrink-0 rounded-full object-cover',
  centered: 'block size-12 shrink-0 rounded-full object-cover',
  wall: 'block size-10 shrink-0 rounded-full object-cover',
};

/**
 * Quotes from clients, each a `figure`: the quote in a `blockquote`, then the person's portrait, name and role in
 * its `figcaption`, in one of three layouts (`layout`). Server component. Colours, fonts and corner radius come from
 * the design tokens.
 */
export function TestimonialsSection({
  content,
  layout = 'grid',
  ImageComponent: Image = PlainImage,
  id,
  className,
}: TestimonialsSectionProps) {
  const headingId = useId();
  const { title, items } = content;

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
        {items.length > 0 ? (
          <ul className={LIST[layout]}>
            {items.map((item, i) => (
              <li key={i} className={ITEM[layout]}>
                <figure className={FIGURE[layout]}>
                  <blockquote className="m-0">
                    <p className={QUOTE[layout]}>{item.quote}</p>
                  </blockquote>
                  <figcaption className={CAPTION[layout]}>
                    {item.image ? (
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        width={item.image.width}
                        height={item.image.height}
                        className={PORTRAIT[layout]}
                      />
                    ) : null}
                    <span className="block min-w-0">
                      <span className={`block text-sm font-semibold ${INK}`}>{item.name}</span>
                      {item.role ? (
                        <span data-role className={`block text-sm ${INK_MUTED}`}>
                          {item.role}
                        </span>
                      ) : null}
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
