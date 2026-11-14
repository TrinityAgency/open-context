export type ShareNetwork = 'x' | 'linkedin' | 'facebook' | 'bluesky' | 'whatsapp' | 'email';

/** Every network, in the order the buttons show them. */
export const SHARE_NETWORKS: ShareNetwork[] = ['x', 'linkedin', 'facebook', 'bluesky', 'whatsapp', 'email'];

export type SharePage = {
  /** The page's absolute address (`https://…`); a share link must work outside your site. */
  url: string;
  title: string;
};

const ABSOLUTE_HTTP = /^https?:\/\/[^/?#\s]/i;

/**
 * The share link for one network: a plain URL the visitor follows (nothing is loaded from the network on your page).
 * Title and URL are encoded with encodeURIComponent. Throws a RangeError for a URL that is not absolute http(s).
 */
export function shareHref(network: ShareNetwork, page: SharePage): string {
  if (!ABSOLUTE_HTTP.test(page.url)) {
    throw new RangeError(`shareHref: url must be an absolute http(s) address, got ${JSON.stringify(page.url)}`);
  }
  const t = encodeURIComponent(page.title);
  const u = encodeURIComponent(page.url);
  const tu = encodeURIComponent(`${page.title} ${page.url}`);
  switch (network) {
    case 'x':
      return `https://twitter.com/intent/tweet?text=${t}&url=${u}`;
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
    case 'bluesky':
      return `https://bsky.app/intent/compose?text=${tu}`;
    case 'whatsapp':
      return `https://wa.me/?text=${tu}`;
    case 'email':
      return `mailto:?subject=${t}&body=${u}`;
  }
}
