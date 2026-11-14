#!/usr/bin/env node
// design-sync — turns a Claude Design export into generated CSS and a typed class catalog.
// One file, no dependencies. Copy it to <app>/scripts/design-sync.mjs next to <app>/design-sync.config.json.
//   node scripts/design-sync.mjs            write the generated files from the design export
//   node scripts/design-sync.mjs --check    exit 1 if the committed generated files differ from a fresh run (no write)
//   node scripts/design-sync.mjs --diff     print the classes added/removed since the committed catalog, and the wrappers they hit
//   node scripts/design-sync.mjs --guards   exit 1 on a colour literal, an unknown wrapper class or a hand-written vendor prefix
// Claude Design stays the source: change the design there, re-export into design/, run this.
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const TEMPLATE_VERSION = '2';

/** An error the person running the script can act on (exit code 2). */
export class DesignSyncError extends Error {}

const posix = (p) => p.split(sep).join('/');
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const uniqSorted = (xs) => [...new Set(xs)].sort();
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '');

// ---------------------------------------------------------------------------------------------
// 1. tokens.css compiled from tokens.json — a port of the tokens-to-CSS compiler
//    (which mirrors the Claude Design page's compiler). Differences: English errors, and an alias {x} that names no
//    colour token is refused instead of written as a dangling var().
// ---------------------------------------------------------------------------------------------
const NAME = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/;
const ALIAS = /^\{([A-Za-z0-9][A-Za-z0-9_.-]{0,63})\}$/;
const FORMAT = { woff2: 'woff2', woff: 'woff', ttf: 'truetype', otf: 'opentype' };
const KNOWN = new Set(['name', 'version', 'color', 'type', 'spacing', 'radius', 'shadow']);

/** A token or style name as a CSS identifier: a leading -- or . dropped, dots escaped, a leading digit escaped. */
export function cssName(n) {
  let s = n.replace(/^(--|\.)/, '').replace(/\./g, '\\.');
  if (/^[0-9]/.test(s)) s = `\\3${s[0]} ${s.slice(1)}`;
  return s;
}

const str = (v) => (typeof v === 'string' && v.trim() !== '' ? v.trim() : null);
const length = (v) => (typeof v === 'number' && Number.isFinite(v) ? `${v}px` : str(v));
const lineHeight = (v) => (typeof v === 'number' && Number.isFinite(v) ? (v < 10 ? String(v) : `${v}px`) : str(v));
const weight = (v) => (v === 'bold' ? '700' : v === undefined || v === null || v === 'normal' ? '400' : String(v));
const named = (xs) => (xs ?? []).filter((x) => typeof x?.name === 'string' && NAME.test(x.name.replace(/^(--|\.)/, '')));

/** A value that ends up inside the stylesheet: refused when it could close a rule, a comment or the style element. */
function safe(what, v) {
  if (/[{}<>\u0000-\u001f\u007f]|\/\*|\*\//.test(v)) throw new DesignSyncError(`tokens.json: the value of ${what} contains characters that are not allowed (${JSON.stringify(v)})`);
  return v;
}

export function compileTokensCss(t, fontSrc) {
  const themes = (t.color?.themes ?? []).map((x) => String(x?.id ?? '').toLowerCase()).filter((id) => NAME.test(id));
  if (themes.length === 0) throw new DesignSyncError('tokens.json has no themes (color.themes)');
  const first = themes[0];
  const perTheme = (v) => {
    if (typeof v === 'string') return v.trim() ? { [first]: v.trim() } : {};
    if (!v || typeof v !== 'object') return {};
    const o = {};
    for (const [k, x] of Object.entries(v)) if (typeof x === 'string' && x.trim()) o[k.toLowerCase()] = x.trim();
    if (o[first] === undefined) {
      const borrowed = themes.map((th) => o[th]).find((x) => x !== undefined);
      if (borrowed !== undefined) o[first] = borrowed;
    }
    return o;
  };
  const colors = named(t.color?.tokens).map((x) => ({ name: x.name, value: perTheme(x.value) })).filter((x) => x.value[first] !== undefined);
  const shadows = named(t.shadow?.tokens).map((x) => ({ name: x.name, value: perTheme(x.value) })).filter((x) => x.value[first] !== undefined);
  const colorNames = new Set(colors.map((c) => c.name));
  const colour = (name, v) => {
    const a = ALIAS.exec(v);
    if (a && !colorNames.has(a[1])) throw new DesignSyncError(`tokens.json: colour "${name}" is an alias of {${a[1]}}, which is no colour token`);
    return `  --${cssName(name)}: ${a ? `var(--${cssName(a[1])})` : safe(`--${name}`, v)};`;
  };
  const plain = (name, v) => `  --${cssName(name)}: ${safe(`--${name}`, v)};`;

  const out = [`/* ${(str(t.name) ?? 'Design system').replace(/\*\//g, '* /')} — generated from tokens.json */`];
  if (colors.length > 0 || shadows.length > 0) {
    out.push(`:root, [data-theme="${first}"] {`, ...colors.map((c) => colour(c.name, c.value[first])), ...shadows.map((s) => plain(s.name, s.value[first])), '}');
    for (const th of themes.slice(1)) {
      const lines = [
        ...colors.filter((c) => c.value[th] !== undefined || ALIAS.test(c.value[first])).map((c) => colour(c.name, c.value[th] ?? c.value[first])),
        ...shadows.filter((s) => s.value[th] !== undefined).map((s) => plain(s.name, s.value[th])),
      ];
      if (lines.length > 0) out.push(`[data-theme="${th}"] {`, ...lines, '}');
    }
  }

  const root = [];
  for (const fam of ['spacing', 'radius']) {
    for (const x of named(t[fam]?.tokens)) { const v = length(x.value); if (v) root.push(plain(x.name, v)); }
  }
  for (const [key, fam] of Object.entries(t)) {
    if (KNOWN.has(key) || !fam || typeof fam !== 'object' || !Array.isArray(fam.tokens)) continue;
    for (const x of named(fam.tokens)) { const v = str(x.value); if (v) root.push(plain(x.name, v)); }
  }
  for (const [key, stack] of Object.entries(t.type?.families ?? {})) {
    const v = str(stack);
    if (v && NAME.test(key)) root.push(`  --font-${cssName(key.toLowerCase())}: ${safe(`--font-${key}`, v)};`);
  }
  const colourNames = new Set(colors.map((c) => cssName(c.name)));
  const styles = (t.type?.groups ?? []).flatMap((g) => named(g.styles).map((s) => ({ s, family: str(s.family) ?? str(g.family) })))
    .filter(({ s }) => length(s.fontSize) !== null);
  for (const { s, family } of styles) {
    const v = `text-${cssName(s.name)}`;
    if (colourNames.has(v)) continue;
    const fs = str(s.fontStyle) ?? 'normal';
    root.push(safe(`--${v}`, `  --${v}: ${fs !== 'normal' ? `${fs} ` : ''}${weight(s.fontWeight)} ${length(s.fontSize)}/${lineHeight(s.lineHeight) ?? 'normal'} ${family ? `var(--font-${cssName(family.toLowerCase())})` : 'inherit'};`));
  }
  if (root.length > 0) out.push(':root {', ...root, '}');

  for (const { s, family } of styles) {
    const fs = str(s.fontStyle) ?? 'normal';
    const block = [
      `.${cssName(s.name)} {`,
      ...(family ? [`  font-family: var(--font-${cssName(family.toLowerCase())});`] : []),
      `  font-size: ${length(s.fontSize)};`,
      `  line-height: ${lineHeight(s.lineHeight) ?? 'normal'};`,
      `  font-weight: ${weight(s.fontWeight)};`,
      `  letter-spacing: ${length(s.letterSpacing) ?? 'normal'};`,
      ...(fs !== 'normal' ? [`  font-style: ${fs};`] : []),
      ...(typeof s.opticalSize === 'number' ? [`  font-variation-settings: 'opsz' ${s.opticalSize};`] : []),
      '}',
    ];
    out.push(...block.map((l, i) => (i === 0 || i === block.length - 1 ? l : safe(`.${s.name}`, l))));
  }

  for (const f of t.type?.fonts ?? []) {
    const family = str(f?.family);
    const file = str(f?.file);
    if (!family || !file) continue;
    const src = fontSrc(file);
    if (src === null) continue;
    const fmt = FORMAT[file.slice(file.lastIndexOf('.') + 1).toLowerCase()];
    out.push(
      '@font-face {',
      `  font-family: "${safe(`@font-face ${family}`, family).replace(/["\\]/g, '')}";`,
      `  src: url("${safe(`@font-face ${family} (src)`, src).replace(/["\\\n\r\f]/g, '')}")${fmt ? ` format("${fmt}")` : ''};`,
      `  font-weight: ${safe(`@font-face ${family} (weight)`, str(f.weight) ?? '400')};`,
      `  font-style: ${safe(`@font-face ${family} (style)`, str(f.style) ?? 'normal')};`,
      '  font-display: swap;',
      '}',
    );
  }
  return `${out.join('\n')}\n`;
}

// ---------------------------------------------------------------------------------------------
// 2. bundle.css → components.css: absolute font URLs, hand-written vendor prefixes with an identical unprefixed twin
//    removed, the whole file inside `@layer components` (unlayered CSS beats Tailwind's layered utilities).
// ---------------------------------------------------------------------------------------------
function skipString(s, i) {
  const q = s[i];
  i++;
  while (i < s.length && s[i] !== q) { if (s[i] === '\\') i++; i++; }
  return i + 1;
}

/** [start, end) of every innermost `{ … }` block — the ones that hold declarations, not other rules. */
export function declarationBlocks(css) {
  const blocks = [];
  const stack = [];
  let i = 0;
  while (i < css.length) {
    const c = css[i];
    if (c === '/' && css[i + 1] === '*') { const e = css.indexOf('*/', i + 2); i = e < 0 ? css.length : e + 2; continue; }
    if (c === '"' || c === "'") { i = skipString(css, i); continue; }
    if ((c === 'u' || c === 'U') && css.slice(i, i + 4).toLowerCase() === 'url(') {
      let j = i + 4;
      while (/\s/.test(css[j] ?? '')) j++;
      if (css[j] !== '"' && css[j] !== "'") { const e = css.indexOf(')', j); i = e < 0 ? css.length : e + 1; continue; }
    }
    if (c === '{') { if (stack.length > 0) stack[stack.length - 1].hasChild = true; stack.push({ start: i + 1, hasChild: false }); }
    else if (c === '}') { const b = stack.pop(); if (b && !b.hasChild) blocks.push([b.start, i]); }
    i++;
  }
  return blocks;
}

/** The declarations of a block body, split on `;` outside parentheses, strings and comments. Joining with `;` restores the body. */
export function splitDeclarations(body) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (c === '/' && body[i + 1] === '*') { const e = body.indexOf('*/', i + 2); i = e < 0 ? body.length : e + 1; continue; }
    if (c === '"' || c === "'") { i = skipString(body, i) - 1; continue; }
    if (c === '(') depth++;
    else if (c === ')') depth = Math.max(0, depth - 1);
    else if (c === ';' && depth === 0) { parts.push(body.slice(start, i)); start = i + 1; }
  }
  parts.push(body.slice(start));
  return parts;
}

const DECL = /^\s*(-(?:webkit|moz|ms|o)-)?([a-zA-Z-]+)\s*:\s*([\s\S]*?)\s*$/;
const parseDecl = (seg) => {
  const m = DECL.exec(stripComments(seg));
  return m ? { prefix: m[1] ?? '', prop: m[2], value: m[3].replace(/\s+/g, ' ') } : null;
};

export function fixFontUrls(css, fontsUrl) {
  return css.replace(/url\(\s*(["']?)(?:\.\/)?fonts\//g, (_m, q) => `url(${q}${fontsUrl}/`);
}

export function cleanBundleCss(css, fontsUrl = '/fonts') {
  if (/@(?:import|charset)\b/.test(stripComments(css))) {
    throw new DesignSyncError('components/bundle.css has an @import or @charset, which cannot sit inside @layer: move it into the app stylesheet');
  }
  const base = fixFontUrls(css, fontsUrl);
  const perBlock = [];
  let result = base;
  for (const [a, b] of declarationBlocks(base).reverse()) {
    const parts = splitDeclarations(base.slice(a, b));
    const decls = parts.map(parseDecl);
    const next = [];
    const here = { removed: [], kept: [] };
    let carry = '';   // comments that stood in front of a removed declaration move to the next one
    parts.forEach((p, i) => {
      const d = decls[i];
      if (d && d.prefix) {
        const twin = decls.find((x) => x && !x.prefix && x.prop === d.prop);
        if (twin && twin.value === d.value) {
          here.removed.push(`${d.prefix}${d.prop}`);
          carry += (/^\s*((?:\/\*[\s\S]*?\*\/\s*)*)/.exec(p)?.[1] ?? '').trimEnd();
          return;
        }
        here.kept.push({ property: `${d.prefix}${d.prop}`, reason: twin ? 'the unprefixed twin has a different value' : 'no unprefixed twin' });
      }
      if (carry !== '') {
        const lead = /^\s*/.exec(p)[0];
        p = `${lead}${carry}\n${lead.slice(lead.lastIndexOf('\n') + 1)}${p.slice(lead.length)}`;
        carry = '';
      }
      next.push(p);
    });
    if (carry !== '') next.push(carry);
    perBlock.push(here);
    if (next.length !== parts.length || carry !== '') result = result.slice(0, a) + next.join(';') + result.slice(b);
  }
  perBlock.reverse();
  return {
    css: `@layer components {\n${result.trimEnd()}\n}\n`,
    removed: perBlock.flatMap((x) => x.removed),
    kept: perBlock.flatMap((x) => x.kept),
  };
}

// ---------------------------------------------------------------------------------------------
// 3. The catalog: BEM blocks, modifiers, elements (with their own modifiers) and the previews that use each block.
// ---------------------------------------------------------------------------------------------
export function parseClass(cls) {
  const [head, ...mods] = cls.split('--');
  const [block, ...els] = head.split('__');
  if (!block || mods.length > 1 || els.length > 1) return null;
  return { block, element: els[0] ?? null, modifier: mods[0] ?? null };
}

export function cssClasses(css, prefix) {
  const text = stripComments(css).replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, '""');
  return uniqSorted([...text.matchAll(new RegExp(`\\.(${esc(prefix)}[A-Za-z0-9_-]*)`, 'g'))].map((m) => m[1]));
}

export function buildCatalog(css, previews, prefix) {
  const draft = {};
  const ensure = (b) => (draft[b] ??= { modifiers: [], elements: {}, usedBy: [] });
  for (const cls of cssClasses(css, prefix)) {
    const p = parseClass(cls);
    if (!p) continue;
    const e = ensure(p.block);
    if (p.element) { e.elements[p.element] ??= []; if (p.modifier) e.elements[p.element].push(p.modifier); }
    else if (p.modifier) e.modifiers.push(p.modifier);
  }
  const markupClasses = new Set();
  const scriptClasses = new Set();
  for (const { name, html } of previews) {
    const markup = html.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, '');
    const blocks = new Set();
    for (const m of markup.matchAll(/\bclass\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
      for (const tok of (m[1] ?? m[2]).split(/\s+/)) {
        if (!tok.startsWith(prefix)) continue;
        markupClasses.add(tok);
        const p = parseClass(tok);
        if (p && draft[p.block]) blocks.add(p.block);
      }
    }
    for (const b of blocks) draft[b].usedBy.push(name);
    for (const s of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
      for (const m of s[1].matchAll(new RegExp(`${esc(prefix)}[A-Za-z0-9_-]+`, 'g'))) scriptClasses.add(m[0]);
    }
  }
  const catalog = {};
  for (const b of Object.keys(draft).sort()) {
    const e = draft[b];
    catalog[b] = {
      modifiers: uniqSorted(e.modifiers),
      elements: Object.fromEntries(Object.keys(e.elements).sort().map((k) => [k, uniqSorted(e.elements[k])])),
      usedBy: uniqSorted(e.usedBy),
    };
  }
  const known = catalogClasses(catalog);
  return {
    catalog,
    scriptOnly: [...scriptClasses].filter((c) => !markupClasses.has(c) && known.has(c)).sort(),
    unused: Object.keys(catalog).filter((b) => catalog[b].usedBy.length === 0),
  };
}

/** Every class name the catalog describes. */
export function catalogClasses(catalog) {
  const s = new Set();
  for (const [b, e] of Object.entries(catalog)) {
    s.add(b);
    e.modifiers.forEach((m) => s.add(`${b}--${m}`));
    for (const [el, ms] of Object.entries(e.elements)) {
      s.add(`${b}__${el}`);
      ms.forEach((m) => s.add(`${b}__${el}--${m}`));
    }
  }
  return s;
}

export function renderCatalogTs(catalog, banner) {
  return `${banner}
export const catalog = ${JSON.stringify(catalog, null, 2)} as const;

export type Block = keyof typeof catalog;
export type Modifier<B extends Block> = (typeof catalog)[B]["modifiers"][number];
export type Element<B extends Block> = keyof (typeof catalog)[B]["elements"] & string;
type Elements<B extends Block> = (typeof catalog)[B]["elements"];
export type ElementModifier<B extends Block, E extends Element<B>> = Elements<B>[E & keyof Elements<B>] extends readonly (infer M)[] ? M : never;

/** The one way a wrapper builds a design class name: a class the design does not have is a compile error. */
export function cx<B extends Block>(block: B, options?: { modifiers?: readonly Modifier<B>[] }): string;
export function cx<B extends Block, E extends Element<B>>(block: B, options: { element: E; modifiers?: readonly ElementModifier<B, E>[] }): string;
export function cx(block: string, options: { element?: string; modifiers?: readonly unknown[] } = {}): string {
  const base = options.element ? \`\${block}__\${options.element}\` : block;
  return [base, ...(options.modifiers ?? []).map((m) => \`\${base}--\${m}\`)].join(" ");
}
`;
}

/** The catalog object out of a committed catalog.ts (it is written as JSON), or null. */
export function parseCatalogTs(text) {
  const m = /export const catalog = (\{[\s\S]*?\n\}) as const;/.exec(text);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}

export function diffCatalog(prev, next) {
  const a = catalogClasses(prev);
  const b = catalogClasses(next);
  return { added: [...b].filter((c) => !a.has(c)).sort(), removed: [...a].filter((c) => !b.has(c)).sort() };
}

/** Which wrapper files name a removed class, by its full name or by its block plus the modifier/element word. */
export function affectedWrappers(removed, files) {
  const hits = new Map();
  for (const cls of removed) {
    const p = parseClass(cls);
    if (!p) continue;
    const quoted = (w) => new RegExp(`["'\`]${esc(w)}["'\`]`);
    for (const { path, text } of files) {
      const full = text.includes(cls);
      const viaCx = quoted(p.block).test(text) && (p.element === null && p.modifier === null ? true : [p.element, p.modifier].filter(Boolean).every((w) => quoted(w).test(text)));
      if (full || viaCx) hits.set(path, [...(hits.get(path) ?? []), cls]);
    }
  }
  return hits;
}

// ---------------------------------------------------------------------------------------------
// 4. Config, export reader, generated files.
// ---------------------------------------------------------------------------------------------
const CONFIG_KEYS = new Set(['source', 'styles', 'fonts', 'fontsUrl', 'brand', 'catalog', 'prefix', 'wrappers', 'approved']);

function deriveFontsUrl(fonts) {
  const m = /(?:^|\/)public\/(.*)$/.exec(posix(fonts));
  if (!m) throw new DesignSyncError('"fonts" is not under public/: add "fontsUrl", the URL the fonts are served from');
  return `/${m[1].replace(/\/$/, '')}`;
}

export function loadConfig(configPath) {
  let raw;
  try { raw = JSON.parse(readFileSync(configPath, 'utf8')); } catch (e) { throw new DesignSyncError(`${configPath}: not readable JSON (${e.message})`); }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new DesignSyncError(`${configPath}: must be a JSON object`);
  for (const k of Object.keys(raw)) if (!CONFIG_KEYS.has(k)) throw new DesignSyncError(`${configPath}: unknown key "${k}"`);
  for (const k of ['source', 'styles', 'fonts', 'catalog', 'prefix']) {
    if (typeof raw[k] !== 'string' || raw[k] === '') throw new DesignSyncError(`${configPath}: "${k}" is required (a string)`);
  }
  if (!/^[a-z][a-z0-9]*-$/.test(raw.prefix)) throw new DesignSyncError(`${configPath}: "prefix" must look like "ds-" (lower case, ending in a dash)`);
  if (raw.brand !== undefined) {
    const b = raw.brand;
    if (!b || typeof b.from !== 'string' || typeof b.to !== 'string' || !Array.isArray(b.include) || b.include.some((x) => typeof x !== 'string')) {
      throw new DesignSyncError(`${configPath}: "brand" needs "from", "to" and "include" (a list of globs)`);
    }
  }
  if (raw.approved !== undefined && (!Array.isArray(raw.approved) || raw.approved.some((x) => typeof x !== 'string'))) {
    throw new DesignSyncError(`${configPath}: "approved" must be a list of component names`);
  }
  const base = dirname(resolve(configPath));
  return {
    base,
    source: resolve(base, raw.source),
    relSource: posix(raw.source).replace(/\/$/, ''),
    styles: resolve(base, raw.styles),
    fonts: resolve(base, raw.fonts),
    fontsUrl: raw.fontsUrl ?? deriveFontsUrl(raw.fonts),
    brand: raw.brand ? { from: raw.brand.from, to: resolve(base, raw.brand.to), include: raw.brand.include } : null,
    catalog: resolve(base, raw.catalog),
    prefix: raw.prefix,
    wrappers: resolve(base, raw.wrappers ?? 'src/components/ui'),
    approved: raw.approved ?? null,
  };
}

function listFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).sort().flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? listFiles(p) : [p];
  });
}

function globToRegExp(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*' && glob[i + 1] === '*') { re += '.*'; i++; if (glob[i + 1] === '/') i++; }
    else if (c === '*') re += '[^/]*';
    else if (c === '?') re += '[^/]';
    else re += esc(c);
  }
  return new RegExp(`^${re}$`);
}

export function readExport(source) {
  if (!existsSync(join(source, 'tokens.json'))) {
    const hint = existsSync(join(source, 'project', 'tokens.json')) ? ' (it is one folder down: point "source" at its project/ folder)' : '';
    throw new DesignSyncError(`${source} is not a Claude Design export in the importer layout: tokens.json is missing${hint}`);
  }
  let tokens;
  try { tokens = JSON.parse(readFileSync(join(source, 'tokens.json'), 'utf8')); } catch (e) { throw new DesignSyncError(`${join(source, 'tokens.json')}: not readable JSON (${e.message})`); }
  if (!tokens || typeof tokens !== 'object' || Array.isArray(tokens)) throw new DesignSyncError(`${join(source, 'tokens.json')}: must be a JSON object`);
  const bundle = join(source, 'components', 'bundle.css');
  if (!existsSync(bundle)) throw new DesignSyncError(`${bundle} is missing: not a Claude Design export`);
  const previews = existsSync(join(source, 'components'))
    ? readdirSync(join(source, 'components')).sort().filter((n) => existsSync(join(source, 'components', n, 'preview.html')))
      .map((n) => ({ name: n, html: readFileSync(join(source, 'components', n, 'preview.html'), 'utf8') }))
    : [];
  return {
    tokens,
    tokensCss: existsSync(join(source, 'tokens.css')) ? readFileSync(join(source, 'tokens.css'), 'utf8') : null,
    bundleCss: readFileSync(bundle, 'utf8'),
    fonts: listFiles(join(source, 'fonts')).map((f) => posix(relative(join(source, 'fonts'), f))).filter((f) => /\.(woff2?|ttf|otf)$/i.test(f)),
    previews,
  };
}

/** Everything the script writes, as absolute path → content, plus what it noticed on the way. */
export function generate(cfg) {
  const exp = readExport(cfg.source);
  const cssBanner = (from) => `/* GENERATED by scripts/design-sync.mjs (template v${TEMPLATE_VERSION}) from ${cfg.relSource}/${from} — do not edit; change the design in Claude Design, re-export, run the design:sync script. */\n`;
  const files = new Map();
  const compiled = exp.tokensCss === null;
  const tokensBody = compiled
    ? compileTokensCss(exp.tokens, (file) => { const f = file.replace(/^\.?\/?fonts\//, ''); return exp.fonts.includes(f) ? `${cfg.fontsUrl}/${f}` : null; })
    : fixFontUrls(exp.tokensCss, cfg.fontsUrl);
  files.set(join(cfg.styles, 'tokens.css'), cssBanner(compiled ? 'tokens.json' : 'tokens.css') + tokensBody);
  const cleaned = cleanBundleCss(exp.bundleCss, cfg.fontsUrl);
  files.set(join(cfg.styles, 'components.css'), cssBanner('components/bundle.css') + cleaned.css);
  const built = buildCatalog(exp.bundleCss, exp.previews, cfg.prefix);
  const tsBanner = `// GENERATED by scripts/design-sync.mjs (template v${TEMPLATE_VERSION}) from ${cfg.relSource}/components/bundle.css and the component previews — do not edit; re-export the design and run the design:sync script.`;
  files.set(cfg.catalog, renderCatalogTs(built.catalog, tsBanner));
  for (const f of exp.fonts) files.set(join(cfg.fonts, f), readFileSync(join(cfg.source, 'fonts', f)));
  if (cfg.brand) {
    const from = join(cfg.source, cfg.brand.from);
    const wanted = cfg.brand.include.map(globToRegExp);
    for (const f of listFiles(from)) {
      const rel = posix(relative(from, f));
      if (wanted.some((re) => re.test(rel))) files.set(join(cfg.brand.to, rel), readFileSync(f));
    }
  }
  return {
    files,
    catalog: built.catalog,
    report: { removedPrefixes: cleaned.removed, keptPrefixes: cleaned.kept, scriptOnly: built.scriptOnly, unusedBlocks: built.unused,
      blocks: Object.keys(built.catalog).length, classes: catalogClasses(built.catalog).size, fontFaces: (files.get(join(cfg.styles, 'tokens.css')).match(/@font-face/g) ?? []).length },
  };
}

const sameBytes = (file, content) => existsSync(file) && Buffer.compare(readFileSync(file), Buffer.isBuffer(content) ? content : Buffer.from(content)) === 0;

function wrapperFiles(cfg) {
  return listFiles(cfg.wrappers).filter((f) => /\.tsx?$/.test(f) && !/\.test\./.test(f)).map((f) => ({ path: posix(relative(cfg.base, f)), text: readFileSync(f, 'utf8') }));
}

/** mode: 'write' | 'check' | 'diff'. Returns { code, out, err } and prints nothing. */
export function runSync(configPath, mode = 'write') {
  const out = [];
  const err = [];
  try {
    const cfg = loadConfig(configPath);
    if (!existsSync(cfg.source)) {
      const have = [join(cfg.styles, 'tokens.css'), join(cfg.styles, 'components.css'), cfg.catalog].every((f) => existsSync(f));
      if (have) return { code: 0, out: [`design:${mode} — ${cfg.source} not found (repo built outside its monorepo); the committed generated files are used as they are.`], err };
      return { code: 2, out, err: [`${cfg.source} not found, and the generated files are missing: there is nothing to build them from`] };
    }
    let gen;
    try { gen = generate(cfg); } catch (e) {
      if (e instanceof DesignSyncError) throw e;
      throw new DesignSyncError(`the design export could not be read (${e.message}); check tokens.json against the importer layout`);
    }
    const rel = (f) => posix(relative(cfg.base, f));
    if (mode === 'diff') {
      const committed = existsSync(cfg.catalog) ? parseCatalogTs(readFileSync(cfg.catalog, 'utf8')) : null;
      if (committed === null) { out.push('design:diff — no committed catalog: every class is new.'); return { code: 0, out, err }; }
      const d = diffCatalog(committed, gen.catalog);
      if (d.added.length === 0 && d.removed.length === 0) { out.push('design:diff — the catalog is unchanged.'); return { code: 0, out, err }; }
      const blockOf = (c) => parseClass(c)?.block;
      const renamed = new Set(d.added.map(blockOf).filter((b) => d.removed.map(blockOf).includes(b)));
      for (const c of d.removed) out.push(`- ${c}${renamed.has(blockOf(c)) ? '   (a rename shows as a removal plus an addition in the same block)' : ''}`);
      for (const c of d.added) out.push(`+ ${c}`);
      const hits = affectedWrappers(d.removed, wrapperFiles(cfg));
      for (const [path, classes] of hits) out.push(`! ${path} uses ${classes.join(', ')}`);
      // the components to file again for review: every preview that uses a block a changed class belongs to
      for (const b of uniqSorted([...d.added, ...d.removed].map(blockOf).filter(Boolean))) {
        const users = uniqSorted([...(committed[b]?.usedBy ?? []), ...(gen.catalog[b]?.usedBy ?? [])]);
        if (users.length > 0) out.push(`~ ${b} is used by ${users.join(', ')} — re-file these components for review`);
      }
      return { code: 0, out, err };
    }
    const stale = [];
    for (const [file, content] of gen.files) {
      if (sameBytes(file, content)) continue;
      stale.push(file);
      if (mode === 'write') { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, content); }
    }
    if (mode === 'check') {
      if (stale.length > 0) {
        err.push(`design:check — the generated files are out of date with the design export:\n${stale.map((f) => `  ${rel(f)}`).join('\n')}\nRun the design:sync script (node scripts/design-sync.mjs).`);
        return { code: 1, out, err };
      }
      out.push('design:check — the generated files match the design export.');
      return { code: 0, out, err };
    }
    out.push(`design:sync — ${stale.length} file(s) updated. ${gen.report.blocks} blocks, ${gen.report.classes} classes, ${gen.report.fontFaces} font face(s).`);
    if (gen.report.removedPrefixes.length > 0) out.push(`  removed hand-written prefixes with an identical twin: ${gen.report.removedPrefixes.join(', ')}`);
    for (const k of gen.report.keptPrefixes) out.push(`  kept ${k.property}: ${k.reason}`);
    if (gen.report.scriptOnly.length > 0) out.push(`  script-built classes (no preview markup uses them): ${gen.report.scriptOnly.join(', ')}`);
    if (gen.report.unusedBlocks.length > 0) out.push(`  blocks no preview uses: ${gen.report.unusedBlocks.join(', ')}`);
    return { code: 0, out, err };
  } catch (e) {
    if (e instanceof DesignSyncError) return { code: 2, out, err: [e.message] };
    throw e;
  }
}

// ---------------------------------------------------------------------------------------------
// 5. Guards (the app's test script runs `--guards`).
// ---------------------------------------------------------------------------------------------
const COLOUR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|color-mix)\(/;
const PREFIXED = /(^|[;{\s])-(?:webkit|moz|ms)-[a-z-]+\s*:/;

export function runGuards(configPath) {
  const violations = [];
  try {
    const cfg = loadConfig(configPath);
    const rel = (f) => posix(relative(cfg.base, f));
    const generated = (f) => f.startsWith(cfg.styles + sep) || f === cfg.catalog;
    const src = listFiles(join(cfg.base, 'src')).filter((f) => /\.(tsx?|css)$/.test(f) && !generated(f));
    for (const f of src) {
      const text = readFileSync(f, 'utf8');
      if (!/\.test\.tsx?$/.test(f) && COLOUR.test(text)) violations.push(`colour: ${rel(f)} hard-codes a colour; name a design token instead`);
      if (f.endsWith('.css') && PREFIXED.test(text)) violations.push(`prefix: ${rel(f)} has a hand-written vendor prefix; the build adds them`);
    }
    const committed = existsSync(cfg.catalog) ? parseCatalogTs(readFileSync(cfg.catalog, 'utf8')) : null;
    const wrappers = wrapperFiles(cfg);
    if (wrappers.length > 0 && committed === null) violations.push(`wrapper: ${rel(cfg.catalog)} is missing or unreadable; run the design:sync script (node scripts/design-sync.mjs)`);
    if (committed !== null) {
      const known = catalogClasses(committed);
      const token = new RegExp(`(?<![A-Za-z0-9_-])${esc(cfg.prefix)}[A-Za-z0-9_-]+`, 'g');
      for (const w of wrappers) {
        for (const tok of new Set(w.text.match(token) ?? [])) {
          const p = parseClass(tok);
          if (!p || !known.has(tok)) { violations.push(`wrapper: ${w.path} uses ${tok}, which is not in the catalog`); continue; }
          if (cfg.approved && !committed[p.block].usedBy.some((c) => cfg.approved.includes(c))) {
            violations.push(`wrapper: ${w.path} uses ${p.block}, which no approved component uses (approved: ${cfg.approved.join(', ') || 'none'})`);
          }
        }
      }
    }
  } catch (e) {
    if (e instanceof DesignSyncError) return { code: 2, out: [], err: [e.message] };
    throw e;
  }
  return violations.length === 0
    ? { code: 0, out: ['design:guards — ok.'], err: [] }
    : { code: 1, out: [], err: [`design:guards — ${violations.length} violation(s):`, ...violations.map((v) => `  ${v}`)] };
}

// ---------------------------------------------------------------------------------------------
// 6. CLI
// ---------------------------------------------------------------------------------------------
export function main(argv, io = { log: console.log, error: console.error }) {
  const here = dirname(fileURLToPath(import.meta.url));
  const args = [...argv];
  const ci = args.indexOf('--config');
  const value = ci >= 0 ? args[ci + 1] : undefined;
  const configPath = ci >= 0 ? resolve(value ?? '') : resolve(here, '..', 'design-sync.config.json');
  const rest = args.filter((_, i) => !(ci >= 0 && (i === ci || i === ci + 1)));
  const known = new Set(['--check', '--diff', '--guards']);
  const unknown = rest.filter((a) => !known.has(a));
  const badConfig = ci >= 0 && (value === undefined || value.startsWith('--') || rest.includes('--config'));
  if (unknown.length > 0 || rest.length > 1 || badConfig) {
    io.error(`usage: design-sync.mjs [--check | --diff | --guards] [--config <file>]${unknown.length ? ` (unknown: ${unknown.join(' ')})` : ''}${badConfig ? ' (--config needs one file, once)' : ''}`);
    return 2;
  }
  const flags = rest;
  const r = flags[0] === '--guards' ? runGuards(configPath) : runSync(configPath, flags[0] === '--check' ? 'check' : flags[0] === '--diff' ? 'diff' : 'write');
  r.out.forEach((l) => io.log(l));
  r.err.forEach((l) => io.error(l));
  return r.code;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exit(main(process.argv.slice(2)));
