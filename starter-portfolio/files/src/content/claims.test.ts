import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';
import { SAMPLE_URL } from './legal-guard';
import { FORBIDDEN, siteUrl } from './site';

const root = join(__dirname, '..', '..');
const self = join(__dirname, 'site.ts');

function files(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

// A phrase reads as the page shows it: a paragraph wrapped across source lines, a non-breaking space
// (U+00A0, U+202F, &nbsp;, &#160;) or JSX's {' '} still renders as one space between the words.
function normalise(source: string): string {
  return source
    .replace(/&nbsp;|&#160;|&#xa0;|\{\s*(['"])\s\1\s*\}/gi, ' ')
    .replace(/\s+/g, ' ');
}

// site.ts names the forbidden phrases in its FORBIDDEN list; that list is the one place they may appear.
// It is cut out first; the rest of site.ts (the facts) is checked like every other file.
function text(file: string): string {
  const body = readFileSync(file, 'utf8');
  return normalise(file === self ? body.replace(/export const FORBIDDEN[\s\S]*?\n\];/, '') : body);
}

// The legal pages' placeholder marker, as their placeholders.ts reads it: `[[`, one or more characters that are not
// `[`, `]` or a line break, `]]`.
const PLACEHOLDER = /\[\[[^[\]\r\n]+\]\]/;

// Comments explain the marker (they show it as an example); only code counts.
function withoutComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

/** Every source file of a legal page (src/app/_page-legal-*) whose code still holds a placeholder, relative to root. */
function placeholderOffenders(root: string): string[] {
  const app = join(root, 'src', 'app');
  if (!existsSync(app)) return [];
  return readdirSync(app)
    .filter((name) => name.startsWith('_page-legal-'))
    .flatMap((name) => files(join(app, name)))
    .filter((f) => /\.tsx?$/.test(f) && !/\.test\.[^/]+$/.test(f))
    .filter((f) => PLACEHOLDER.test(withoutComments(readFileSync(f, 'utf8'))))
    .map((f) => relative(root, f));
}

describe('claims', () => {
  it('no source file or static page states a forbidden claim', () => {
    const source = files(join(root, 'src')).filter((f) => /\.(tsx?|css)$/.test(f) && !/\.test\.[^/]+$/.test(f));
    const pages = files(join(root, 'public')).filter((f) => f.endsWith('.html'));
    expect(source.length).toBeGreaterThan(0);
    const offenders = [...source, ...pages].flatMap((f) => {
      const body = text(f);
      return FORBIDDEN.filter((p) => p.test(body)).map((p) => `${relative(root, f)}: ${p.source}`);
    });
    expect(offenders).toEqual([]);
  });

  it('no post or project states a forbidden claim', () => {
    // Posts and projects are pages too: every .mdx under content/blog and content/work, drafts included (a draft is
    // published by changing one line).
    const posts = files(join(root, 'content', 'blog')).filter((f) => f.endsWith('.mdx'));
    const projects = files(join(root, 'content', 'work')).filter((f) => f.endsWith('.mdx'));
    expect(posts.length).toBeGreaterThan(0);
    expect(projects.length).toBeGreaterThan(0);
    const offenders = [...posts, ...projects].flatMap((f) => {
      const body = text(f);
      return FORBIDDEN.filter((p) => p.test(body)).map((p) => `${relative(root, f)}: ${p.source}`);
    });
    expect(offenders).toEqual([]);
  });

  it('finds a phrase however the source wraps it', () => {
    const example = /ohne Risiko/i;
    const samples = [
      'Ohne Risiko',
      'ganz ohne\n          Risiko',
      'ohne&nbsp;Risiko',
      'ohne Risiko',
      'ohne&#160;Risiko',
      "ohne{' '}\n          Risiko",
    ].map(normalise);
    expect(samples.filter((s) => !example.test(s))).toEqual([]);
  });

  it('cuts only the FORBIDDEN list out of site.ts', () => {
    const rest = text(self);
    expect(rest).not.toContain('export const FORBIDDEN');
    expect(rest).toContain('export const CONTACT');
  });
});

/** The legal files that must not ship yet: none while the site's URL (siteUrl(): SITE_URL, else SITE.url) is the sample. */
function legalGate(root: string): string[] {
  return siteUrl() === SAMPLE_URL ? [] : placeholderOffenders(root);
}

describe('legal placeholders', () => {
  // The legal pages ship structure and [[…]] placeholders; their text must come from the site's owner or counsel.
  // While the site's URL is the sample domain this stays quiet; once it is your domain (SITE.url, or SITE_URL as the
  // build reads it), every placeholder must be gone, in both languages.
  it(`legal pages hold no [[…]] placeholder once the site's URL is not ${SAMPLE_URL}`, () => {
    expect(legalGate(root)).toEqual([]);
  });

  it('follows the URL the build uses: SITE_URL counts as well as SITE.url', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'claims-'));
    const before = process.env.SITE_URL;
    try {
      const dir = join(tmp, 'src', 'app', '_page-legal-sample');
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'content.ts'), "export const A = 'Owner: [[Company name]]';\n");
      process.env.SITE_URL = SAMPLE_URL;
      expect(legalGate(tmp)).toEqual([]);
      process.env.SITE_URL = 'https://samplework.test';
      expect(legalGate(tmp)).toEqual([join('src', 'app', '_page-legal-sample', 'content.ts')]);
    } finally {
      if (before === undefined) delete process.env.SITE_URL;
      else process.env.SITE_URL = before;
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  it('finds a placeholder in a legal page, in code but not in a comment', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'claims-'));
    try {
      const dir = join(tmp, 'src', 'app', '_page-legal-sample');
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'content.ts'), "// Every `[[…]]` is a placeholder.\nexport const A = 'Owner: [[Company name]]';\n");
      writeFileSync(join(dir, 'done.ts'), "/** `[[…]]` marks a placeholder. */\nexport const B = 'Owner: Samplework Inc.';\n");
      expect(placeholderOffenders(tmp)).toEqual([join('src', 'app', '_page-legal-sample', 'content.ts')]);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });
});
