'use client';

/**
 * The embedded map: an `iframe` filling its box, with no border, at least 20rem tall from md (its box grows with it,
 * where 4:3 alone would be shorter). A client component on purpose (contract rule 5):
 * created here, the frame exists only where a client renders it, so behind a consent gate that has not granted its
 * category the page holds no trace of it and the browser asks the map's host for nothing.
 */
export function MapFrame({ src, title }: { src: string; title: string }) {
  return (
    <iframe
      src={src}
      title={title}
      loading="lazy"
      className="m-0 block size-full border-0 rounded-[calc(var(--oc-radius,0.25rem)*2)] md:min-h-80"
    />
  );
}
