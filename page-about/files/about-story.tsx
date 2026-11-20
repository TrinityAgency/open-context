import { useId, type ComponentProps } from 'react';
import type { ImageComponent, ImageRef } from './site-types';

export type AboutStoryContent = { title: string; paragraphs: string[]; image?: ImageRef };

export type AboutStoryProps = {
  content: AboutStoryContent;
  /** Renders the image; pass a next/image wrapper in a Next app. Default: a plain `img`. */
  ImageComponent?: ImageComponent;
};

function PlainImage({ src, alt, width, height, className }: ComponentProps<ImageComponent>) {
  return <img src={src} alt={alt} width={width} height={height} className={className} />;
}

/**
 * The company's story: a heading, paragraphs in order and an optional image beside them from `md` up. Server
 * component.
 */
export function AboutStory({ content, ImageComponent: Image = PlainImage }: AboutStoryProps) {
  const headingId = useId();
  const { title, paragraphs, image } = content;

  return (
    <section aria-labelledby={headingId} className="box-border px-6 py-16 text-[var(--oc-ink,oklch(20.5%_0_none))] wrap-break-word">
      <div className={image ? 'mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 md:grid-cols-2' : 'mx-auto max-w-5xl'}>
        <div className={image ? 'min-w-0' : 'max-w-3xl'}>
          <h2 id={headingId} className="m-0 text-3xl font-semibold tracking-tight font-[family-name:var(--oc-font-heading)]">
            {title}
          </h2>
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="m-0 mt-4 text-lg text-[var(--oc-ink-body,oklch(37.1%_0_none))]">
              {paragraph}
            </p>
          ))}
        </div>
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="block h-auto w-full rounded-[calc(var(--oc-radius,0.25rem)*2)]"
          />
        ) : null}
      </div>
    </section>
  );
}
