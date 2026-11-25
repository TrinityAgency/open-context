import { useId, type ComponentProps } from 'react';
import { GALLERY_LABELS, fillLabel, type GalleryLabels } from './labels';
import { Lightbox } from './lightbox';
import type { GalleryImage, ImageComponent } from './site-types';

/** The gallery's layouts, named as in the kit's layout vocabulary. */
export type GalleryLayout = 'grid' | 'wall';

export type GalleryContent = { title: string; intro?: string; images: GalleryImage[] };

export type GallerySectionProps = {
  content: GalleryContent;
  /**
   * `grid` (the default): square tiles in 2 columns, 3 from `md`, 4 from `lg`. `wall`: flowing columns (2, 3 from
   * `md`), each image at its own ratio.
   */
  layout?: GalleryLayout;
  /** The lightbox's and the thumbnails' fixed strings; pass `GALLERY_LABELS_DE` from `./labels.de` for German. */
  labels?: Partial<GalleryLabels>;
  /** Renders the thumbnails; pass a next/image wrapper in a Next app. Default: a plain lazy `img`. */
  ImageComponent?: ImageComponent;
  /** On the `section`; the lightbox finds its thumbnails by it. Default: a generated id. */
  id?: string;
  className?: string;
};

function PlainImage({ src, alt, width, height, className }: ComponentProps<ImageComponent>) {
  return <img src={src} alt={alt} width={width} height={height} loading="lazy" className={className} />;
}

// Design tokens (Open Context token contract v1): each reads the project's design system once its stylesheet is
// loaded, and falls back to the kit's neutral look when none is.
const INK = 'text-[var(--oc-ink,oklch(20.5%_0_none))]';
const INK_BODY = 'text-[var(--oc-ink-body,oklch(37.1%_0_none))]';
const HEADING_FONT = 'font-[family-name:var(--oc-font-heading)]';
const RADIUS_2 = 'rounded-[calc(var(--oc-radius,0.25rem)*2)]';
const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';

const ROOT = `box-border px-6 py-16 ${INK}`;
const LIST: Record<GalleryLayout, string> = {
  grid: 'm-0 mt-10 grid list-none grid-cols-2 gap-4 p-0 md:grid-cols-3 lg:grid-cols-4',
  wall: 'm-0 mt-10 list-none columns-2 gap-4 p-0 md:columns-3',
};
const ITEM: Record<GalleryLayout, string> = {
  grid: 'min-w-0',
  // each picture whole in one column, never split across two
  wall: 'mb-4 min-w-0 break-inside-avoid',
};
// the link only wraps a picture: no underline, the ring around the picture's corners
const THUMB_LINK = `block ${RADIUS_2} no-underline ${FOCUS}`;
const THUMB: Record<GalleryLayout, string> = {
  grid: `block aspect-square h-auto w-full max-w-full object-cover ${RADIUS_2}`,
  wall: `block h-auto w-full max-w-full ${RADIUS_2}`,
};
const CAPTION = 'm-0 mt-2 text-sm text-[var(--oc-ink-muted,oklch(43.9%_0_none))]';

/**
 * A gallery: the section's title and intro, then the images as thumbnails in one of two layouts (`layout`). Server
 * component with one client island, the lightbox. Each thumbnail is a link to its full image (`full`, else the image
 * itself), so it opens without JavaScript; with it, a click opens the lightbox at that image instead: a modal
 * `dialog` with previous and next (both wrap around, also by ArrowLeft and ArrowRight), close (and Escape), the
 * position and the caption. Captions sit below a picture, never on it. Colours, fonts and corner radius come from the
 * design tokens.
 */
export function GallerySection({
  content,
  layout = 'grid',
  labels,
  ImageComponent: Image = PlainImage,
  id,
  className,
}: GallerySectionProps) {
  const headingId = useId();
  const autoId = useId();
  const rootId = id ?? autoId;
  const l = { ...GALLERY_LABELS, ...labels };
  const { title, intro, images } = content;
  const total = images.length;

  return (
    <section
      id={rootId}
      aria-labelledby={headingId}
      data-layout={layout}
      className={className ? `${ROOT} ${className}` : ROOT}
    >
      <div className="mx-auto max-w-5xl wrap-break-word">
        <h2 id={headingId} className={`m-0 text-3xl font-semibold tracking-tight ${HEADING_FONT}`}>
          {title}
        </h2>
        {intro ? <p className={`m-0 mt-4 max-w-2xl text-lg ${INK_BODY}`}>{intro}</p> : null}
        {total > 0 ? (
          <>
            <ul className={LIST[layout]}>
              {images.map((image, i) => (
                <li key={i} className={ITEM[layout]}>
                  <figure className="m-0">
                    <a
                      href={(image.full ?? image).src}
                      data-index={i}
                      aria-label={fillLabel(l.open, { n: i + 1, total, alt: image.alt })}
                      className={THUMB_LINK}
                    >
                      <Image src={image.src} alt={image.alt} width={image.width} height={image.height} className={THUMB[layout]} />
                    </a>
                    {image.caption ? <figcaption className={CAPTION}>{image.caption}</figcaption> : null}
                  </figure>
                </li>
              ))}
            </ul>
            <Lightbox rootId={rootId} images={images} labels={l} />
          </>
        ) : null}
      </div>
    </section>
  );
}
