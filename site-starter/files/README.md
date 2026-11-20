# site-starter

A company website scaffold: Next 16 · React 19 · Tailwind 4 (without preflight) · strict TypeScript · Vitest.
Its colours, fonts and corners are the design tokens every Open Context part reads (`src/design-system/`); a design
system made on claude.ai sets them through design-sync, and guard tests keep facts in one place and styling in the
tokens. `next build` writes a self-contained server to `.next/standalone`.

The sample company "Samplework Inc." and all its contact data are invented: replace them in
`src/content/site.ts`.

**Read `AGENTS.md` before changing pages, facts or the design**: where everything lives, how to add a page, how to
grow the site with the website kit's templates, and what each guard test protects.

**Language:** English by default. `src/content/locale.ts` holds one switch, `LOCALE`; set it to `'de'` and every
text, label and the page's `lang` switch to German. Every text in `src/content/site.ts` exists in both languages.

```
pnpm install
pnpm dev                    # local development server
pnpm test && pnpm lint      # design:check, design:guards, typecheck, vitest; eslint
pnpm build && pnpm start    # starts .next/standalone/server.js (PORT, HOSTNAME from the environment)
```

`pnpm build` assembles the standalone server: after `next build`, the `postbuild` script
(`scripts/assemble-standalone.mjs`) copies `.next/static` and `public/` into `.next/standalone`, so
`pnpm start` serves the styled site. That folder is all a server needs (see "Release").

## How it is built

- **Facts live once** in `src/content/site.ts`: company, contact, navigation, page texts (in both languages). Pages
  and components read them and never copy them. `FORBIDDEN` there lists phrases that must appear nowhere on the site;
  `src/content/claims.test.ts` checks every source file (and every static `.html` under `public/`). It starts empty.
- **Metadata per page**: every `page.tsx` exports its own `title` and `description`; `layout.tsx` holds only the
  defaults and the `%s | <company>` title template. `SITE_URL` in the environment overrides `SITE.url` for
  `robots.txt`, `sitemap.xml` and absolute metadata URLs. Add every new page to `src/app/sitemap.ts`.
- **Tokens only**: the site's own code names the design tokens with the utilities of `design-tokens`
  (`src/design-system/design-tokens`: `bg-oc-surface`, `text-oc-ink`, `border-oc-line`, `rounded-oc-lg`,
  `font-oc-heading`). `src/design-system/tokens-only.test.ts` and `pnpm design:guards` refuse a colour literal, a grey
  or other palette class, a radius from Tailwind's scale and `font-sans` in the classes of every file under `src/` but
  the generated design files, the tests and the copy (`src/content/`, a part's `content.ts` and `labels`). Until a
  design is connected the tokens keep their neutral defaults and the page Tailwind's sans stack.
- **No preflight**: `src/app/globals.css` imports only Tailwind's theme and utilities and declares the layer order
  `theme, base, components, utilities`, so the design's component rules sit below Tailwind's utilities.

## The design: from a claude.ai design system to every part

The `design-system-seed` skill (`npx @trinity369/use design-system-seed`) walks an agent through these steps; this
site already holds `design-tokens`, its config and the imports, so only the export, the map and the sync are left.

1. Put the export, unchanged, under `design/export/` (see `design/export/README.md`).
2. Copy `src/design-system/design-tokens/oc-map.example.json` to `design/oc-map.json` and write the map: for every
   contract token, the design's token that plays its role (read the `usage` notes on both sides; `null` only where
   the design has no such role). `src/design-system/design-tokens/README.md` has the contract's table.
3. `pnpm design:sync` checks the map and that every text stays readable on its ground in every theme, then writes
   `src/design-system/generated/tokens.css` (the design's variables and the `--oc-*` tokens), `components.css` and
   `catalog.ts`, plus fonts under `public/fonts` and brand SVGs under `public/brand`. Commit them; never edit them by
   hand. `src/app/globals.css` already imports them, so every part and the site's own code take the design at once.
4. The design's first theme is the default; another applies inside `data-theme="<theme id>"` (on `<html>` for the
   whole site).
5. To use the export's own components as well, set `prefix` in `design-sync.config.json` to the class prefix its
   `bundle.css` uses (`ds-` is a placeholder), name the components you approved in an `approved` list there, write
   thin wrappers in `src/components/ui/` and build class names with `cx` from `src/design-system/generated/catalog.ts`.
6. After a new export: `pnpm design:sync`, then `pnpm design:diff` lists the classes that were added or removed
   and the wrappers that still use a removed one.

| script | what it does |
|---|---|
| `design:sync` | checks the map and the contrast, then writes the generated files from the export |
| `design:check` | fails when the generated files differ from a fresh run; before the first export there is nothing to check, and it passes |
| `design:diff` | lists classes added/removed since the committed catalog, and the wrappers they hit |
| `design:guards` | fails on a colour literal, an unknown wrapper class or a hand-written vendor prefix under `src/` |

Each runs `node src/design-system/design-tokens/design-sync.mjs --config design-sync.config.json` (with `--check`,
`--diff` or `--guards`). `design-sync.mjs` belongs to the `design-tokens` part: update it by installing a newer
`design-tokens`, never by editing it.

## Release

Build with your public origin, `SITE_URL=https://<your-domain> pnpm build`, then run `.next/standalone` with
`pnpm start` (`PORT` and `HOSTNAME` from the environment) on any host with Node 22, behind HTTPS. A platform that
builds Next itself needs only `SITE_URL` set. (`next start` does not serve the standalone output; use `pnpm start`.)
