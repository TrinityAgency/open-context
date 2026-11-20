import { useId, type ComponentProps } from 'react';
import type { ImageComponent, LinkComponent, LogoItem } from './site-types';

/** The logo cloud's layouts, named as in the kit's layout vocabulary. */
export type LogoCloudLayout = 'grid' | 'split';

export type LogoCloudContent = { title: string; logos: LogoItem[] };

export type LogoCloudSectionProps = {
  content: LogoCloudContent;
  /**
   * `grid` (the default): a small centred title above the logos in 2, 3 or 6 columns. `split`: the title beside the
   * logos from `md`, stacked on a phone.
   */
  layout?: LogoCloudLayout;
  /** Renders the links of logos that have an `href`; pass next/link's Link in a Next app. Default: a plain `a`. */
  LinkComponent?: LinkComponent;
  /** Renders the logos; pass a next/image wrapper in a Next app. Default: a plain `img`. */
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
const HEADING_FONT = 'font-[family-name:var(--oc-font-heading)]';
const ROOT = 'box-border px-6 py-12 text-[var(--oc-ink,oklch(20.5%_0_none))]';
const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';

const HEADING: Record<LogoCloudLayout, string> = {
  grid: `m-0 text-center text-sm font-medium text-[var(--oc-ink-muted,oklch(43.9%_0_none))] ${HEADING_FONT}`,
  split: `m-0 text-lg font-semibold text-balance ${HEADING_FONT}`,
};
const LIST: Record<LogoCloudLayout, string> = {
  grid: 'm-0 mt-8 grid list-none grid-cols-2 items-center justify-items-center gap-x-8 gap-y-6 p-0 sm:grid-cols-3 lg:grid-cols-6',
  split: 'm-0 grid min-w-0 list-none grid-cols-2 items-center justify-items-center gap-x-8 gap-y-6 p-0 sm:grid-cols-3',
};
const WRAP: Record<LogoCloudLayout, string> = {
  grid: 'mx-auto max-w-5xl wrap-break-word',
  split: 'mx-auto grid max-w-5xl items-center gap-8 wrap-break-word md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-12',
};

/**
 * Client or partner logos under (or beside) a small heading, each optionally linked, in one of two layouts
 * (`layout`). Server component. A logo's accessible name is its image's alt, or the logo's name when the alt is
 * empty. Colours, fonts and corner radius come from the design tokens.
 */
export function LogoCloudSection({
  content,
  layout = 'grid',
  LinkComponent: Link = PlainLink,
  ImageComponent: Image = PlainImage,
  id,
  className,
}: LogoCloudSectionProps) {
  const headingId = useId();
  const { title, logos } = content;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      data-layout={layout}
      className={className ? `${ROOT} ${className}` : ROOT}
    >
      <div className={WRAP[layout]}>
        <h2 id={headingId} className={HEADING[layout]}>
          {title}
        </h2>
        {logos.length > 0 ? (
          <ul className={LIST[layout]}>
            {logos.map((logo, i) => {
              const image = (
                <Image
                  src={logo.image.src}
                  alt={logo.image.alt || logo.name}
                  width={logo.image.width}
                  height={logo.image.height}
                  className="block h-8 w-auto max-w-full object-contain"
                />
              );
              return (
                <li key={i} className="flex min-w-0 justify-center">
                  {logo.href ? (
                    <Link href={logo.href} className={`block rounded-[var(--oc-radius,0.25rem)] no-underline ${FOCUS}`}>
                      {image}
                    </Link>
                  ) : (
                    image
                  )}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
