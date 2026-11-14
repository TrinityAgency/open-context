import { siteUrl } from './site';

/** The sample domain: while the site's URL is this, the site is still the sample and its legal placeholders may stay. */
export const SAMPLE_URL = 'https://example.com';

/**
 * Refuses to render a legal page whose text still holds a `[[…]]` placeholder once the site has its own URL
 * (SITE.url, or SITE_URL at build time). The legal pages render at build time, so `pnpm build` fails instead of
 * publishing an unfinished imprint, privacy notice or terms. The text must come from the site's owner or counsel.
 */
export function assertLegalTextReady(page: string, hasOpenPlaceholders: boolean, url: string = siteUrl()): void {
  if (url !== SAMPLE_URL && hasOpenPlaceholders) {
    throw new Error(
      `${page}: the legal text still holds [[…]] placeholders, but the site's URL is ${url}. Have the text written ` +
        `by the site's owner or counsel (see AGENTS.md); until then keep SITE.url at ${SAMPLE_URL} and SITE_URL unset.`,
    );
  }
}
