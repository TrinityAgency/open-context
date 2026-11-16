import type { ShareNetwork } from './share-targets';

export type ShareLabels = {
  /** The visible line that names the group of links. */
  title: string;
  /** Each network's link text. */
  networks: Record<ShareNetwork, string>;
  /** Read after a link that opens a new tab (screen readers only). */
  newTab: string;
  /** The native share button (shown only where the browser can share). */
  native: string;
  copy: string;
  /** Announced after the link was copied. */
  copied: string;
  copyFailed: string;
};

export const SHARE_LABELS: ShareLabels = {
  title: 'Share this page',
  networks: { x: 'X', linkedin: 'LinkedIn', facebook: 'Facebook', bluesky: 'Bluesky', whatsapp: 'WhatsApp', email: 'Email' },
  newTab: '(opens in a new tab)',
  native: 'Share…',
  copy: 'Copy link',
  copied: 'Link copied',
  copyFailed: 'Copying did not work',
};
