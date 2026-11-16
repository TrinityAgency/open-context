/** A path without its query and hash, and without a trailing slash unless it is the root. */
function pathOnly(path: string): string {
  const bare = path.split(/[?#]/, 1)[0] ?? '';
  return bare.length > 1 ? bare.replace(/\/+$/, '') || '/' : bare;
}

/**
 * Whether a navigation link names the current page or a page below it, compared by whole path segments:
 * `/blog` is current on `/blog` and `/blog/post-1`, not on `/blog-old`; `/` only on `/`. Only site-relative hrefs
 * (starting with a single `/`) can be current; an href with a hash or a scheme never is. Queries and a trailing
 * slash are ignored on both sides.
 */
export function isCurrent(href: string, currentPath: string): boolean {
  // A second leading slash makes the href protocol-relative, i.e. another host.
  if (!href.startsWith('/') || href.charAt(1) === '/' || href.includes('#')) return false;
  const target = pathOnly(href);
  const here = pathOnly(currentPath);
  if (target === '/') return here === '/';
  return here === target || here.startsWith(`${target}/`);
}
