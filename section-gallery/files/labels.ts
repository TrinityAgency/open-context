export type GalleryLabels = {
  /** A thumbnail link's accessible name; `{n}`, `{total}` and `{alt}` (the thumbnail's alt text) are filled in. */
  open: string;
  /** The lightbox's previous button (an icon, named by this). */
  previous: string;
  /** The lightbox's next button (an icon, named by this). */
  next: string;
  /** The lightbox's close button (an icon, named by this). */
  close: string;
  /** The lightbox's position line, which also names the dialog; `{n}` and `{total}` are filled in. */
  position: string;
};

export const GALLERY_LABELS: GalleryLabels = {
  open: 'Open image {n} of {total}: {alt}',
  previous: 'Previous image',
  next: 'Next image',
  close: 'Close',
  position: '{n} of {total}',
};

/**
 * Fills a label's `{name}` placeholders (a placeholder with no value stays as written); a label left ending in a
 * colon or a space by an empty value (an image with an empty alt) loses them.
 */
export function fillLabel(label: string, values: Record<string, string | number>): string {
  return label.replace(/\{(\w+)\}/g, (match, name: string) => (name in values ? String(values[name]) : match)).replace(/[\s:]+$/, '');
}
