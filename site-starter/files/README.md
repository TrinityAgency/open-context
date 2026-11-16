# site-starter

A company website scaffold: Next 16 · React 19 · Tailwind 4 (without preflight) · strict TypeScript · Vitest.
The design comes from a Claude Design export through `scripts/design-sync.mjs`; guard tests keep facts in one
place and colours in the design tokens. `next build` writes a self-contained server to `.next/standalone`.

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
- **No colour literal outside `src/design/`**: `src/design/no-hardcoded-colour.test.ts` and `pnpm design:guards`
  refuse a hex value, `rgb()`, `oklch()` and the like anywhere else. Until your export exists the header and
  footer use Tailwind's neutral palette.
- **No preflight**: `src/app/globals.css` imports only Tailwind's theme and utilities and declares the layer order
  `theme, base, components, utilities`, so the design's component rules sit below Tailwind's utilities.

## The design: from a Claude Design export to classes

1. Put the export, unchanged, under `design/export/` (see `design/export/README.md`). Set `prefix` in
   `design-sync.config.json` to the class prefix your export uses (`ds-` is a placeholder): only classes with that
   prefix reach the catalog.
2. `pnpm design:sync` writes `src/design/tokens.css`, `src/design/components.css` and `src/design/catalog.ts`
   (plus fonts under `public/fonts` and brand SVGs under `public/brand`). Commit them; never edit them by hand.
3. Uncomment the two `src/design/` imports in `src/app/globals.css` and map the colour tokens in its
   `@theme inline` block, so utilities like `bg-paper` read the tokens.
4. Name the components you approved in `approved` in `design-sync.config.json`, write thin wrappers in
   `src/components/ui/`, and build class names with `cx` from `src/design/catalog.ts`.
   Replace the utilities in `SiteHeader.tsx` and `SiteFooter.tsx` the same way.
5. After a new export: `pnpm design:sync`, then `pnpm design:diff` lists the classes that were added or removed
   and the wrappers that still use a removed one.

| script | what it does |
|---|---|
| `design:sync` | writes the generated files from the export |
| `design:check` | fails when the committed generated files differ from a fresh run |
| `design:diff` | lists classes added/removed since the committed catalog, and the wrappers they hit |
| `design:guards` | fails on a colour literal, an unknown wrapper class or a hand-written vendor prefix |

**Before your first export**, `node scripts/design-sync.mjs --check` stops with "not found, and the generated
files are missing" (there is nothing to compare yet). That is why the `design:check` script reads
`node scripts/design-sync.mjs --check || echo "no export yet"`, so `pnpm test` passes on a fresh install.
**After your first `design:sync`, remove `|| echo "no export yet"`** from `design:check` in `package.json`;
otherwise a stale generated file would be reported but not fail the tests.

## Release

Build with your public origin, `SITE_URL=https://<your-domain> pnpm build`, then run `.next/standalone` with
`pnpm start` (`PORT` and `HOSTNAME` from the environment) on any host with Node 22, behind HTTPS. A platform that
builds Next itself needs only `SITE_URL` set. (`next start` does not serve the standalone output; use `pnpm start`.)
