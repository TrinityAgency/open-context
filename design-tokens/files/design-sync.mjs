#!/usr/bin/env node
// design-sync — turns a Claude Design export into generated CSS and a typed class catalog.
// One file, no dependencies, anywhere in a project (an Open Context site holds it in the design-tokens part, at
// src/design-system/design-tokens/design-sync.mjs); its config is the project's design-sync.config.json, named with
// --config or found in the nearest folder at or above the script. Run it through the project's design:* scripts:
//   design-sync.mjs [--config <file>]            write the generated files from the design export
//   design-sync.mjs --check [--config <file>]    exit 1 if the committed generated files differ from a fresh run (no write)
//   design-sync.mjs --diff [--config <file>]     print the classes added/removed since the committed catalog, and the wrappers they hit
//   design-sync.mjs --guards [--config <file>]   exit 1 on a colour literal, an unknown wrapper class or a hand-written vendor prefix
//                                                (the Open Context contract's own var(--oc-<token>, <default>) is no literal)
// Claude Design stays the source: change the design there, re-export into design/, run this.
// With "contract" in the config (a path to oc-map.json), tokens.css also declares the Open Context contract: one
// `--oc-<token>: var(--<design token>)` alias per contract token, in every theme; the map and the contrast of the
// contract's text/ground pairs (4.5:1) and non-text pairs (the focus ring, 3:1) are checked first, and nothing is
// written when a check fails.
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const TEMPLATE_VERSION = '3';

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

/** The themes (first = the default) and every colour and shadow token with its value per theme, as tokens.css writes them. */
function colourModel(t) {
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
  return { themes, first, colors, shadows };
}

/** tokens.css from tokens.json; with `contract` ({ map } of an oc-map.json), the contract's aliases follow (contractCss). */
export function compileTokensCss(t, fontSrc, contract) {
  const { themes, first, colors, shadows } = colourModel(t);
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
  return `${out.join('\n')}\n${contract ? contractCss(t, contract.map) : ''}`;
}

// ---------------------------------------------------------------------------------------------
// 1b. The Open Context contract (v1): the design tokens every Open Context part reads, as --oc-* aliases of this
//     design's own tokens. A part reads var(--oc-<token>, <its default>), so a part with no design loaded keeps its
//     default look and a loaded design re-brands it without an edit. oc-map.json names, per contract token, the design
//     token that plays its role (null: the design has no such role, the part's default applies).
// ---------------------------------------------------------------------------------------------
export const OC_CONTRACT = {
  version: 1,
  prefix: 'oc',
  tokens: [
    { name: 'surface', kind: 'color', default: '#fff', usage: 'The page ground: sections, cards, panels, inputs.' },
    { name: 'surface-alt', kind: 'color', default: 'oklch(98.5% 0 none)', usage: 'An alternate ground that sets a band apart: the footer, a highlighted section.' },
    { name: 'surface-sunk', kind: 'color', default: 'oklch(97% 0 none)', usage: 'A ground a step down from surface: chips, inline code, quiet bands (a call to action, a signup), the hover tint of quiet buttons and links.' },
    { name: 'line', kind: 'color', default: 'oklch(92.2% 0 none)', usage: 'Hairlines: dividers, card and section borders, rules; also the ground of a placeholder highlight behind ink text (checked as drawn over surface).' },
    { name: 'line-strong', kind: 'color', default: 'oklch(87% 0 none)', usage: 'Borders that must be seen: inputs, secondary buttons, controls.' },
    { name: 'ink', kind: 'color', default: 'oklch(20.5% 0 none)', usage: 'Headings and primary text, links, the text of secondary buttons.' },
    { name: 'ink-soft', kind: 'color', default: 'oklch(26.9% 0 none)', usage: 'Large reading text a step lighter than ink: quotes, menu links.' },
    { name: 'ink-body', kind: 'color', default: 'oklch(37.1% 0 none)', usage: 'Body text: leads, paragraphs, footer text.' },
    { name: 'ink-muted', kind: 'color', default: 'oklch(43.9% 0 none)', usage: 'Secondary text: eyebrows, meta lines, captions.' },
    { name: 'ink-subtle', kind: 'color', default: 'oklch(55.6% 0 none)', usage: 'Tertiary text and small icons: disabled items, ellipses, chevrons.' },
    { name: 'ink-faint', kind: 'color', default: 'oklch(70.8% 0 none)', usage: 'Decoration only, never text: separators, timeline dots.' },
    { name: 'brand', kind: 'color', default: 'oklch(20.5% 0 none)', usage: 'The brand colour as a ground or mark: primary buttons, the current item, checkboxes and radios.' },
    { name: 'brand-hover', kind: 'color', default: 'oklch(37.1% 0 none)', usage: 'Brand under the pointer: the hover ground of primary buttons.' },
    { name: 'on-brand', kind: 'color', default: '#fff', usage: 'Text and icons on a brand ground.' },
    { name: 'brand-ink', kind: 'color', default: 'oklch(20.5% 0 none)', usage: 'Brand-coloured text and marks that must stand out on surface (4.5:1): an eyebrow, a link a brand wants coloured, the underline of the selected tab, a progress bar.' },
    { name: 'focus', kind: 'color', default: 'oklch(20.5% 0 none)', usage: 'The focus outline of every interactive element.' },
    { name: 'scrim', kind: 'color', default: 'oklch(20.5% 0 none)', usage: 'The veil behind a modal dialog or drawer, drawn translucent (/40, /50); map it only when the design system has one.' },
    { name: 'font-body', kind: 'font', usage: "The body font stack; unset, parts inherit the page's font." },
    { name: 'font-heading', kind: 'font', usage: "The heading font stack; unset, headings inherit the page's font." },
    { name: 'radius', kind: 'radius', default: '0.25rem', usage: 'The base corner radius; parts use 1, 1.5, 2 or 3 times it (999px makes pills, 0 makes square corners).' },
  ],
  pairs: [
    ['ink', 'surface'], ['ink-soft', 'surface'], ['ink-body', 'surface'], ['ink-muted', 'surface'], ['ink-subtle', 'surface'],
    ['ink', 'surface-sunk'], ['ink-body', 'surface-sunk'], ['ink-muted', 'surface-sunk'],
    ['ink', 'surface-alt'], ['ink-body', 'surface-alt'], ['brand-ink', 'surface'], ['brand-ink', 'surface-alt'],
    ['on-brand', 'brand'], ['on-brand', 'brand-hover'], ['surface', 'ink'], ['ink', 'line'],
  ],
  nonText: [['focus', 'surface'], ['focus', 'surface-alt'], ['focus', 'surface-sunk']],
};

const NUMBER = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i;
/** A number, or a percentage of `whole`; `none` is 0. NaN when it is neither. */
function amount(s, whole) {
  if (s === 'none') return 0;
  if (s.endsWith('%')) return NUMBER.test(s.slice(0, -1)) ? (Number(s.slice(0, -1)) / 100) * whole : NaN;
  return NUMBER.test(s) ? Number(s) : NaN;
}
/** A hue in degrees (deg, grad, rad, turn or a plain number); `none` is 0. */
function hueOf(s) {
  if (s === 'none') return 0;
  const m = /^(.*?)(deg|grad|rad|turn)?$/i.exec(s);
  if (!NUMBER.test(m[1])) return NaN;
  const n = Number(m[1]);
  return { deg: n, grad: n * 0.9, rad: (n * 180) / Math.PI, turn: n * 360 }[(m[2] ?? 'deg').toLowerCase()];
}
const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLinear = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

/** The linear-light sRGB channels of a colour and its alpha (0–1): #hex, rgb()/rgba(), hsl()/hsla() or oklch(). */
function channels(colour) {
  const cannot = (why) => new DesignSyncError(`the colour ${JSON.stringify(colour)} cannot be checked: ${why}`);
  const v = String(colour).trim().toLowerCase();
  const hex = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(v);
  if (hex) {
    const h = hex[1].length <= 4 ? [...hex[1]].map((c) => c + c).join('') : hex[1];
    const alpha = h.length === 8 ? parseInt(h.slice(6), 16) / 255 : 1;
    return { lin: [0, 2, 4].map((i) => toLinear(parseInt(h.slice(i, i + 2), 16) / 255)), alpha };
  }
  const fn = /^(rgba?|hsla?|oklch)\(\s*([^()]*?)\s*\)$/.exec(v);
  if (!fn) throw cannot('design-sync reads #hex, rgb(), hsl() and oklch()');
  let args = fn[2];
  let alpha = '1';
  if (args.includes(',')) {
    const parts = args.split(',').map((x) => x.trim());
    if (parts.length === 4) alpha = parts.pop();
    args = parts;
  } else {
    const [main, a, ...more] = args.split('/').map((x) => x.trim());
    if (more.length) throw cannot('more than one "/"');
    if (a !== undefined) alpha = a;
    args = main.split(/\s+/);
  }
  if (args.length !== 3) throw cannot('it needs three channels');
  const a = amount(alpha, 1);
  if (Number.isNaN(a)) throw cannot('its alpha is not a number');
  let out;
  if (fn[1].startsWith('rgb')) {
    out = args.map((x) => toLinear(amount(x, 255) / 255));
  } else if (fn[1].startsWith('hsl')) {
    const [h, s, l] = [hueOf(args[0]), amount(args[1].endsWith('%') ? args[1] : `${args[1]}%`, 1), amount(args[2].endsWith('%') ? args[2] : `${args[2]}%`, 1)];
    const k = (n) => (n + h / 30) % 12;
    const f = (n) => l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    out = [f(0), f(8), f(4)].map((c) => toLinear(c));
  } else {
    // oklch → OKLab → linear sRGB (Björn Ottosson's matrices), clipped to the sRGB gamut
    const [L, C, H] = [amount(args[0], 1), amount(args[1], 0.4), hueOf(args[2])];
    const A = C * Math.cos((H * Math.PI) / 180);
    const B = C * Math.sin((H * Math.PI) / 180);
    const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
    const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
    const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
    out = [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ].map((c) => Math.min(1, Math.max(0, c)));
  }
  if (out.some((c) => Number.isNaN(c))) throw cannot('a channel is not a number');
  return { lin: out, alpha: Math.min(1, Math.max(0, a)) };
}

/** The linear-light sRGB channels of an opaque colour (text is drawn at full strength; so is a page's surface). */
function linearRgb(colour) {
  const { lin, alpha } = channels(colour);
  if (alpha < 1) throw new DesignSyncError(`the colour ${JSON.stringify(colour)} cannot be checked: it is not opaque`);
  return lin;
}

/**
 * A colour drawn over an opaque base, as the browser composites it (source-over, in gamma-encoded sRGB): an opaque
 * colour as it is, a translucent one as the rgb() it shows.
 */
export function over(colour, base) {
  const { lin, alpha } = channels(colour);
  if (alpha >= 1) return colour;
  const under = linearRgb(base);
  const shown = lin.map((c, i) => alpha * fromLinear(c) + (1 - alpha) * fromLinear(under[i]));
  return `rgb(${shown.map((c) => Math.round(c * 255000) / 1000).join(' ')})`;
}

/** The WCAG 2.x contrast ratio of two opaque colours (1 to 21). */
export function contrastRatio(a, b) {
  const lum = (c) => { const [r, g, bl] = linearRgb(c); return 0.2126 * r + 0.7152 * g + 0.0722 * bl; };
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

const KIND_WORDS = { color: 'colour token (color.tokens)', font: 'type.families key', radius: 'radius token (radius.tokens)' };

/** Everything wrong with an oc-map.json against a design's tokens.json, one line per problem (empty: it holds). */
export function checkContract(t, ocMap) {
  if (!ocMap || typeof ocMap !== 'object' || ocMap.contract !== OC_CONTRACT.version || !ocMap.map || typeof ocMap.map !== 'object' || Array.isArray(ocMap.map)) {
    return [`the map must be { "contract": ${OC_CONTRACT.version}, "map": { "<contract token>": "<design token>" | null } }`];
  }
  const map = ocMap.map;
  const problems = new Set();
  const { themes, first, colors } = colourModel(t);
  const colour = new Map(colors.map((c) => [c.name, c.value]));
  const has = {
    color: (n) => colour.has(n),
    font: (n) => NAME.test(n) && str(t.type?.families?.[n]) !== null,
    radius: (n) => named(t.radius?.tokens).some((x) => x.name === n && length(x.value) !== null),
  };
  const contract = new Map(OC_CONTRACT.tokens.map((x) => [x.name, x]));
  for (const x of OC_CONTRACT.tokens) {
    if (!Object.hasOwn(map, x.name)) problems.add(`${x.name}: missing from the map (name the design token that plays this role, or null when the design has none)`);
  }
  const usable = new Set();
  for (const [key, value] of Object.entries(map)) {
    const x = contract.get(key);
    if (!x) { problems.add(`${key}: not in the contract (v${OC_CONTRACT.version} has ${[...contract.keys()].join(', ')})`); continue; }
    if (value === null) { usable.add(key); continue; }
    if (typeof value !== 'string' || value === '') { problems.add(`${key}: map it to a design token name or null, not ${JSON.stringify(value)}`); continue; }
    if (has[x.kind](value)) { usable.add(key); continue; }
    const other = Object.keys(has).find((k) => k !== x.kind && has[k](value));
    problems.add(other
      ? `${key} → "${value}": a ${x.kind} token needs a ${KIND_WORDS[x.kind]}, and "${value}" is a ${KIND_WORDS[other]}`
      : `${key} → "${value}": the design has no ${KIND_WORDS[x.kind]} named "${value}"`);
  }
  // A theme block redeclares what it defines, and every alias (aliases resolve per theme); the rest inherits the first theme.
  const valueIn = (name, th, seen = new Set()) => {
    const v = colour.get(name);
    if (!v || seen.has(name)) return null;
    seen.add(name);
    const own = v[th] ?? v[first];
    const alias = ALIAS.exec(own);
    return alias ? valueIn(alias[1], th, seen) : own;
  };
  const effective = (key, th) => (map[key] === null ? contract.get(key).default : valueIn(map[key], th));
  const said = (key) => (map[key] === null ? 'the default' : map[key]);
  // Text on its ground at 4.5:1; a non-text mark (the focus ring) on its ground at 3:1 (WCAG 1.4.3, 1.4.11).
  const checks = [...OC_CONTRACT.pairs.map((p) => [...p, 4.5]), ...OC_CONTRACT.nonText.map((p) => [...p, 3])];
  for (const [fg, bg, min] of checks) {
    if (!usable.has(fg) || !usable.has(bg)) continue;
    for (const th of themes) {
      const a = effective(fg, th);
      const b = effective(bg, th);
      if (a === null || b === null) { problems.add(`${fg} on ${bg} in theme "${th}": an alias does not resolve to a colour`); continue; }
      // A translucent ground (a hairline colour behind a placeholder mark) is measured as it is drawn: over the
      // theme's surface. Text and the surface itself must be opaque.
      const base = bg === 'surface' ? null : effective('surface', th);
      let ratio;
      let ground = b;
      try {
        if (base !== null) ground = over(b, base);
        ratio = contrastRatio(a, ground);
      } catch (e) { problems.add(`${fg} on ${bg} in theme "${th}": ${e.message}`); continue; }
      if (ratio < min) {
        const drawn = ground === b ? '' : ` over ${base} (${said('surface')})`;
        problems.add(`${fg} on ${bg} in theme "${th}": ${a} (${said(fg)}) on ${b} (${said(bg)})${drawn} is ${(Math.floor(ratio * 100) / 100).toFixed(2)}:1, below ${min}:1`);
      }
    }
  }
  return [...problems];
}

/** The contract's aliases for a design: colour aliases in the first theme's block and again in every other theme's, fonts and radius on :root. */
export function contractCss(t, map) {
  const { themes, first } = colourModel(t);
  const mapped = OC_CONTRACT.tokens.filter((x) => typeof map[x.name] === 'string');
  const colours = mapped.filter((x) => x.kind === 'color').map((x) => `  --oc-${x.name}: var(--${cssName(map[x.name])});`);
  const root = mapped.filter((x) => x.kind !== 'color').map((x) => (x.kind === 'font'
    ? `  --oc-${x.name}: var(--font-${cssName(map[x.name].toLowerCase())});`
    : `  --oc-${x.name}: var(--${cssName(map[x.name])});`));
  const out = [`/* Open Context contract v${OC_CONTRACT.version}: --oc-* aliases of this design's tokens, declared again in every theme */`];
  if (colours.length > 0) {
    out.push(`:root, [data-theme="${first}"] {`, ...colours, '}');
    for (const th of themes.slice(1)) out.push(`[data-theme="${th}"] {`, ...colours, '}');
  }
  if (root.length > 0) out.push(':root {', ...root, '}');
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
const CONFIG_KEYS = new Set(['source', 'styles', 'fonts', 'fontsUrl', 'brand', 'catalog', 'prefix', 'wrappers', 'approved', 'contract']);

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
  if (raw.contract !== undefined && (typeof raw.contract !== 'string' || raw.contract === '')) {
    throw new DesignSyncError(`${configPath}: "contract" must be the path of the Open Context map (oc-map.json)`);
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
    contract: raw.contract === undefined ? null : resolve(base, raw.contract),
  };
}

/** An oc-map.json: { "contract": 1, "map": { "<contract token>": "<design token>" | null } }. */
function readOcMap(file) {
  if (!existsSync(file)) {
    throw new DesignSyncError(`${file}: no map yet: copy oc-map.example.json (from the design-tokens part) there and map each contract token to the design token that plays its role (null where the design has none)`);
  }
  let raw;
  try { raw = JSON.parse(readFileSync(file, 'utf8')); } catch (e) { throw new DesignSyncError(`${file}: not readable JSON (${e.message})`); }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw) || raw.contract !== OC_CONTRACT.version
    || !raw.map || typeof raw.map !== 'object' || Array.isArray(raw.map)) {
    throw new DesignSyncError(`${file}: must be { "contract": ${OC_CONTRACT.version}, "map": { "<contract token>": "<design token>" | null } }`);
  }
  return raw;
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
  const cssBanner = (from) => `/* GENERATED by design-sync (template v${TEMPLATE_VERSION}) from ${cfg.relSource}/${from} — do not edit; change the design in Claude Design, re-export, run the design:sync script. */\n`;
  const files = new Map();
  let contract = null;
  if (cfg.contract) {
    const ocMap = readOcMap(cfg.contract);
    const problems = checkContract(exp.tokens, ocMap);
    if (problems.length > 0) {
      throw new DesignSyncError(`${posix(relative(cfg.base, cfg.contract))}: the design does not meet the Open Context contract (nothing was written):\n${problems.map((p) => `  ${p}`).join('\n')}`);
    }
    contract = { map: ocMap.map };
  }
  const compiled = exp.tokensCss === null;
  const tokensBody = compiled
    ? compileTokensCss(exp.tokens, (file) => { const f = file.replace(/^\.?\/?fonts\//, ''); return exp.fonts.includes(f) ? `${cfg.fontsUrl}/${f}` : null; }, contract ?? undefined)
    : fixFontUrls(exp.tokensCss, cfg.fontsUrl) + (contract ? contractCss(exp.tokens, contract.map) : '');
  files.set(join(cfg.styles, 'tokens.css'), cssBanner(compiled ? 'tokens.json' : 'tokens.css') + tokensBody);
  const cleaned = cleanBundleCss(exp.bundleCss, cfg.fontsUrl);
  files.set(join(cfg.styles, 'components.css'), cssBanner('components/bundle.css') + cleaned.css);
  const built = buildCatalog(exp.bundleCss, exp.previews, cfg.prefix);
  const tsBanner = `// GENERATED by design-sync (template v${TEMPLATE_VERSION}) from ${cfg.relSource}/components/bundle.css and the component previews — do not edit; re-export the design and run the design:sync script.`;
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
      // A project that has not connected a design yet: there is nothing to be out of date with.
      if (mode === 'check') return { code: 0, out: [`design:check — no design export at ${posix(relative(cfg.base, cfg.source))} yet: nothing to check.`], err };
      return { code: 2, out, err: [`no design export at ${posix(relative(cfg.base, cfg.source))}: put the export there (unchanged), then run the design:sync script`] };
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
        err.push(`design:check — the generated files are out of date with the design export:\n${stale.map((f) => `  ${rel(f)}`).join('\n')}\nRun the design:sync script to write them again.`);
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

/**
 * The text with the contract's own variables set aside: every `var(--oc-<colour or radius token>,<its default>)` (the
 * fallback read with `_` as a space, as in a Tailwind class) and every `var(--oc-<font token>)` without a fallback
 * becomes `var(--oc)`. An Open Context part carries its defaults inline, so they are no colours the project hard-codes;
 * anything else (a wrong default, a name the contract lacks, an unclosed var) is left for the colour guard to see.
 */
export function stripContractVars(text) {
  const tokens = new Map(OC_CONTRACT.tokens.map((x) => [x.name, x]));
  const norm = (v) => v.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
  let out = '';
  let from = 0;
  for (const m of text.matchAll(/var\(\s*--oc-([a-z0-9-]+)\s*(,|\))/g)) {
    if (m.index < from) continue;
    const t = tokens.get(m[1]);
    if (!t) continue;
    let end = -1;
    let fallback = null;
    if (m[2] === ')') {
      end = m.index + m[0].length;
    } else {
      let depth = 1;
      const start = m.index + m[0].length;
      for (let i = start; i < text.length; i += 1) {
        if (text[i] === '(') depth += 1;
        else if (text[i] === ')' && --depth === 0) { end = i + 1; break; }
      }
      if (end < 0) continue;
      fallback = norm(text.slice(start, end - 1));
    }
    const own = t.kind === 'font' ? fallback === null : fallback !== null && fallback === t.default;
    if (!own) continue;
    out += `${text.slice(from, m.index)}var(--oc)`;
    from = end;
  }
  return out + text.slice(from);
}

export function runGuards(configPath) {
  const violations = [];
  try {
    const cfg = loadConfig(configPath);
    const rel = (f) => posix(relative(cfg.base, f));
    const generated = (f) => f.startsWith(cfg.styles + sep) || f === cfg.catalog;
    const src = listFiles(join(cfg.base, 'src')).filter((f) => /\.(tsx?|css)$/.test(f) && !generated(f));
    for (const f of src) {
      const text = readFileSync(f, 'utf8');
      if (!/\.test\.tsx?$/.test(f) && COLOUR.test(stripContractVars(text))) violations.push(`colour: ${rel(f)} hard-codes a colour; name a design token instead`);
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
/** The nearest design-sync.config.json at or above `dir` (the script's folder); else the one beside the folder above it. */
function findConfig(dir) {
  for (let d = dir; ; d = dirname(d)) {
    const f = join(d, 'design-sync.config.json');
    if (existsSync(f)) return f;
    if (dirname(d) === d) return resolve(dir, '..', 'design-sync.config.json');
  }
}

export function main(argv, io = { log: console.log, error: console.error }) {
  const here = dirname(fileURLToPath(import.meta.url));
  const args = [...argv];
  const ci = args.indexOf('--config');
  const value = ci >= 0 ? args[ci + 1] : undefined;
  const configPath = ci >= 0 ? resolve(value ?? '') : findConfig(here);
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
