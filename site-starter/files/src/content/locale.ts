// The site's language, the one switch: 'en' (the default) or 'de'. It picks every text and label and the page's
// `lang`. Routes stay English in both; AGENTS.md says how to rename them. It imports nothing, so any component,
// server or client, may read it.

export type Locale = 'en' | 'de';

/** Typed with `as`, so TypeScript keeps both branches of every lookup. */
export const LOCALE = 'en' as Locale;
