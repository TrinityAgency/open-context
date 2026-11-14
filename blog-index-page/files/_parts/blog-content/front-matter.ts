import { isAbsolute, relative, sep } from 'node:path';
import { parseDocument } from 'yaml';
import { z, type ZodIssue, type ZodTypeAny } from 'zod';

/**
 * A post, author or category file the blog cannot use. The message is `<file>[:<line>]: <what>`, with the file
 * relative to the project (`process.cwd()`), so a failed build names the place to fix.
 */
export class BlogContentError extends Error {
  readonly file: string;
  readonly line: number | undefined;

  constructor(file: string, line: number | undefined, what: string) {
    const shown = isAbsolute(file) ? relative(process.cwd(), file).split(sep).join('/') : file;
    super(`${shown}${line === undefined ? '' : `:${line}`}: ${what}`);
    this.name = 'BlogContentError';
    this.file = shown;
    this.line = line;
  }
}

/** Slugs and author and category ids: lowercase letters and digits, joined by single hyphens. */
export const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const BOM = String.fromCodePoint(0xfeff);
const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;

function realDate(year: number, month: number, day: number): boolean {
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function parseInstant(iso: string): number | null {
  const date = DATE.exec(iso);
  if (date) {
    const n = (i: number) => Number(date[i]);
    return realDate(n(1), n(2), n(3)) ? Date.UTC(n(1), n(2) - 1, n(3)) : null;
  }
  const time = DATE_TIME.exec(iso);
  if (!time) return null;
  const n = (i: number) => Number(time[i] ?? 0);
  if (!realDate(n(1), n(2), n(3)) || n(4) > 23 || n(5) > 59 || n(6) > 59) return null;
  const instant = Date.parse(iso);
  return Number.isNaN(instant) ? null : instant;
}

/**
 * Epoch milliseconds of a date (`YYYY-MM-DD`, read as UTC midnight) or a date-time with an offset (`Z` or `±HH:MM`).
 * Throws a RangeError for anything else.
 */
export function instantOf(iso: string): number {
  const instant = parseInstant(iso);
  if (instant === null) throw new RangeError(`not a date or a date-time with an offset: ${iso}`);
  return instant;
}

/**
 * A path on this site (`/…`, never `//…`) or a `data:image/` URI: nothing that loads from another host. Read as a
 * browser reads an address: tabs and line breaks anywhere are dropped, control characters and spaces around it
 * trimmed, so `/<tab>/host` counts as `//host`.
 */
export function isLocalSrc(src: string): boolean {
  const url = src.replace(/[\t\n\r]/g, '').replace(/^[\0- ]+|[\0- ]+$/g, '');
  return /^\/(?![/\\])/.test(url) || /^data:image\//i.test(url);
}

const isoInstant = z
  .string()
  .refine((value) => parseInstant(value) !== null, 'must be a date (2026-03-01) or a date-time with an offset (2026-03-01T09:00:00+01:00)');
const id = z.string().regex(ID, 'must be lowercase letters and digits, joined by single hyphens');
const unique = (list: string[]) => new Set(list).size === list.length;
const localSrc = z.string().refine(isLocalSrc, 'must be a path on this site (/blog/…) or a data:image/ URI');
const imageRef = z
  .object({ src: localSrc, alt: z.string(), width: z.number().int().positive(), height: z.number().int().positive() })
  .strict();
const siteOrSecureUrl = z
  .string()
  .refine((url) => /^\/(?![/\\])/.test(url) || /^https:\/\/[^/]/.test(url), 'must be a path on this site or an https address');

/** The front matter of a post: the `Post` keys an author writes. Unknown keys are refused. */
export const postFrontMatter = z
  .object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().min(1).max(500),
    publishedAt: isoInstant,
    updatedAt: isoInstant.optional(),
    authorIds: z.array(id).min(1).refine(unique, 'names an author twice'),
    category: id,
    tags: z.array(z.string().trim().min(1).max(40)).refine(unique, 'names a tag twice').default([]),
    image: imageRef.optional(),
    draft: z.boolean().default(false),
  })
  .strict()
  .refine((fm) => fm.updatedAt === undefined || instantOf(fm.updatedAt) >= instantOf(fm.publishedAt), {
    message: 'is before publishedAt',
    path: ['updatedAt'],
  });

/** `authors.yaml`: a list of authors. An empty file is an empty list. */
export const authorsFile = z
  .array(
    z
      .object({
        id,
        name: z.string().trim().min(1).max(100),
        bio: z.string().trim().min(1).optional(),
        url: siteOrSecureUrl.optional(),
        image: imageRef.optional(),
      })
      .strict(),
  )
  .nullable()
  .transform((list) => list ?? []);

/** `categories.yaml`: a list of categories. An empty file is an empty list. */
export const categoriesFile = z
  .array(
    z
      .object({ id, name: z.string().trim().min(1).max(100), description: z.string().trim().min(1).optional() })
      .strict(),
  )
  .nullable()
  .transform((list) => list ?? []);

const pathText = (path: (string | number)[]) =>
  path.map((key, i) => (typeof key === 'number' ? `[${key}]` : `${i ? '.' : ''}${key}`)).join('');

function describeIssue(issue: ZodIssue, what: string): string {
  if (issue.code === 'unrecognized_keys') {
    const at = pathText(issue.path);
    return issue.keys.map((key) => `${at ? `${at}.` : ''}${key}`).join(', ') + ': unknown key';
  }
  return `${pathText(issue.path) || what}: ${issue.message}`;
}

/** Validates data with a schema; the first problem becomes a BlogContentError naming the file and the field. */
export function parseWith<T extends ZodTypeAny>(schema: T, data: unknown, file: string, what = 'front matter'): z.output<T> {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  const issue = result.error.issues[0];
  throw new BlogContentError(file, undefined, issue ? describeIssue(issue, what) : `${what}: invalid`);
}

/** Parses YAML; a syntax error becomes a BlogContentError at its line (plus `lineOffset`) in the file. */
export function parseYaml(text: string, file: string, what: string, lineOffset = 0): unknown {
  const doc = parseDocument(text);
  const error = doc.errors[0];
  if (error) {
    const line = error.linePos?.[0].line;
    const reason = (error.message.split('\n')[0] ?? '').replace(/ at line \d+, column \d+:?$/, '');
    throw new BlogContentError(file, line === undefined ? undefined : line + lineOffset, `${what}: ${reason}`);
  }
  return doc.toJS();
}

/**
 * Splits a post into its front matter (parsed YAML) and its body. A leading byte-order mark is dropped and CRLF reads
 * as LF. The block is a first line `---`, the YAML, then a line `---`; `bodyLine` is the 1-based line where the body
 * starts.
 */
export function splitFrontMatter(raw: string, file: string): { data: unknown; body: string; bodyLine: number } {
  const text = (raw.startsWith(BOM) ? raw.slice(1) : raw).replace(/\r\n/g, '\n');
  const lines = text.split('\n');
  if (lines[0]?.trimEnd() !== '---') throw new BlogContentError(file, 1, 'front matter: the file must begin with a line ---');
  const close = lines.findIndex((line, i) => i > 0 && line.trimEnd() === '---');
  if (close === -1) throw new BlogContentError(file, 1, 'front matter: no closing line --- after the opening one');
  const data = parseYaml(lines.slice(1, close).join('\n'), file, 'front matter', 1);
  return { data, body: lines.slice(close + 1).join('\n'), bodyLine: close + 2 };
}
