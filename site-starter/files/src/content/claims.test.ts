import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';
import { FORBIDDEN } from './site';

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

  it('finds a phrase however the source wraps it', () => {
    const example = /ohne Risiko/i;
    const samples = [
      'Ohne Risiko',
      'ganz ohne\n          Risiko',
      'ohne&nbsp;Risiko',
      'ohne Risiko',
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
