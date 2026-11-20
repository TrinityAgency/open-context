import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

// The site's colours, corners and fonts come from the design tokens (src/design-system/design-tokens): its own code
// writes `bg-oc-surface`, `text-oc-ink`, `rounded-oc-lg`, `font-oc-heading`, and every installed part reads
// `var(--oc-…)`. This test reads the classes of every file under src/ but the generated design files, the tests and
// the copy (src/content/, a part's content.ts and labels): the string literals of .ts and .tsx files (comments and
// the text between JSX tags are prose, never classes) and the @apply rules of .css files. The rules are those the
// Open Context parts are proven against, so an installed part passes by construction, and an owner's grey class or
// an unconverted part fails.
const src = join(__dirname, '..');
const site = join(src, '..');
const generated = join(__dirname, 'generated') + sep;
const copy = join(src, 'content') + sep;

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

const isCopy = (f: string) => f.startsWith(copy) || /^(?:content|labels(?:\.[a-z]{2})?)\.ts$/.test(basename(f));
const code = files(src).filter(
  (f) => /\.(tsx?|css)$/.test(f) && !f.startsWith(generated) && !/\.test\.tsx?$/.test(f) && !isCopy(f),
);

/** The class strings of a file: every string literal and template text of a .ts or .tsx file, every @apply of a .css file. */
function classStrings(file: string, text: string): string[] {
  if (file.endsWith('.css')) {
    return [...text.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/@apply\s+([^;}]+)/g)].map((m) => m[1] ?? '');
  }
  const kind = file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, false, kind);
  const out: string[] = [];
  const visit = (node: ts.Node) => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateLiteralToken(node)) out.push(node.text);
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}

// Tailwind's palettes, the greys included: a colour the design cannot change.
const PALETTE = 'neutral|slate|gray|zinc|stone|mauve|olive|mist|taupe|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const COLOUR = new RegExp(`-(?:${PALETTE})-(?:50|[1-9]00|950)(?:/\\S+)?$`);
// White and black as a colour utility (`bg-white`, `text-white/50`), not a word that ends in them.
const WHITE_BLACK = /^(?:bg|text|border(?:-[trblxyse])?|outline|ring|fill|stroke|decoration|divide|placeholder|accent|caret|shadow|from|via|to)-(?:white|black)(?:\/\S+)?$/;
// Tailwind's radius scale (`rounded`, `rounded-lg`, `rounded-t-md`): the tokens' steps are `rounded-oc` …
// `rounded-oc-xl`; `rounded-none` and `rounded-full` stay.
const RADIUS = /^rounded(?:-(?:t|r|b|l|s|e|tl|tr|br|bl|ss|se|es|ee))?(?:-(?:xs|sm|md|lg|xl|2xl|3xl|4xl))?$/;
// Tailwind's font families: the tokens' are `font-oc-body` and `font-oc-heading` (`font-mono` stays on code).
const FONT = /^font-(?:sans|serif)$/;

/** The utility of a class token: its variants (`md:`, `hover:`, `[&>a]:`) and an important mark dropped. */
function utilityOf(token: string): string {
  let depth = 0;
  let cut = 0;
  for (let i = 0; i < token.length; i += 1) {
    if (token[i] === '[') depth += 1;
    else if (token[i] === ']') depth -= 1;
    else if (token[i] === ':' && depth === 0) cut = i + 1;
  }
  return token.slice(cut).replace(/^!|!$/g, '');
}

/** The classes of a class string that a rule refuses, as written. */
function offences(classes: string): string[] {
  return classes.split(/\s+/).filter((token) => {
    const u = utilityOf(token);
    return COLOUR.test(u) || WHITE_BLACK.test(u) || RADIUS.test(u) || FONT.test(u);
  });
}

describe('tokens only', () => {
  it('its rules refuse every Tailwind palette, white and black, the radius scale and font-sans, and pass the tokens', () => {
    expect(
      offences('text-taupe-600 hover:bg-mist-50 border-olive-200/50 bg-mauve-950 text-neutral-600 focus:bg-white rounded md:rounded-lg font-sans'),
    ).toHaveLength(9);
    expect(offences('bg-oc-surface text-oc-ink border-oc-line rounded-oc-lg rounded-full font-oc-heading font-mono whitespace-nowrap')).toEqual([]);
  });

  it('reads classes, never prose: comments, the text between tags and words that end in white or black pass', () => {
    const tsx = '// rounded down, black-and-white\nexport const A = () => <p className="rounded-lg">rounded up, off-white</p>;';
    expect(classStrings('a.tsx', tsx).flatMap(offences)).toEqual(['rounded-lg']);
    expect(classStrings('a.css', '/* font-sans */ .x { @apply bg-white; }').flatMap(offences)).toEqual(['bg-white']);
  });

  it('no palette, white or black colour class, no radius from Tailwind\'s scale, no font-sans or font-serif under src/', () => {
    const found = code.flatMap((f) =>
      [...new Set(classStrings(f, readFileSync(f, 'utf8')).flatMap(offences))].map((c) => `${relative(site, f)}: ${c}`),
    );
    expect(found).toEqual([]);
  });

  it('design-sync\'s guards report nothing (no colour literal, no vendor prefix)', async () => {
    const script = join(__dirname, 'design-tokens', 'design-sync.mjs');
    const { runGuards } = (await import(pathToFileURL(script).href)) as {
      runGuards: (config: string) => { code: number; out: string[]; err: string[] };
    };
    const result = runGuards(join(site, 'design-sync.config.json'));
    expect(result.err).toEqual([]);
    expect(result.code).toBe(0);
  });
});
