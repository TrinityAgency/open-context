const WORD = /[\p{L}\p{N}][\p{L}\p{N}'’_-]*/gu;

/** Words in a Markdown or MDX body: tags, image syntax and link targets do not count, the visible text does. */
export function countWords(markdown: string): number {
  const text = markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\]\([^)]*\)/g, '] ')
    .replace(/<[^>]*>/g, ' ');
  return text.match(WORD)?.length ?? 0;
}

/** Minutes to read `words` at `wordsPerMinute` (default 200), rounded up, at least 1. */
export function readingMinutes(words: number, wordsPerMinute = 200): number {
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
