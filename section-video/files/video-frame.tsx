'use client';

/**
 * The embedded video: an `iframe` filling its 16:9 box, with no border, allowed to go full screen. A client
 * component on purpose (contract rule 5): created here, the frame exists only where a client renders it, so behind a
 * consent gate that has not granted its category the page holds no trace of it and the browser asks the video's host
 * for nothing.
 */
export function VideoFrame({ src, title }: { src: string; title: string }) {
  return (
    <iframe
      src={src}
      title={title}
      allow="fullscreen; picture-in-picture; encrypted-media"
      allowFullScreen
      className="absolute inset-0 m-0 block size-full border-0"
    />
  );
}
