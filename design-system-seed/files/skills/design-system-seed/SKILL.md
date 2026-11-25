---
name: design-system-seed
description: Use when a project built from Open Context parts should take on a brand, i.e. a design system made on claude.ai (or someone's colours, fonts and corner radius) should reach every part. Installs the design-tokens template, maps the design system's own tokens onto the Open Context token contract, runs design-sync to write the stylesheet and checks contrast, then loads it once in the root layout.
---

# Design System Seed

Every adaptable Open Context part reads the same short list of design tokens, the contract: CSS custom properties
such as `--oc-surface`, `--oc-ink`, `--oc-brand`, `--oc-on-brand`, `--oc-font-heading` and `--oc-radius`. Unset, a
part keeps its neutral look. Set once, from the project's design system, they re-brand every installed part without
editing one. This skill connects a design system to the contract. It never changes a part.

## When to use

- A site or app assembled from Open Context parts should look like a brand: its colours, fonts and corners.
- The brand's design system changed and the project should follow.

What you need: the design system as a claude.ai export (a folder whose `project/tokens.json` lists its colours per
theme, its font families and radii), or the brand's values to write such a file from.

## Steps

1. **Put the export in the project, unchanged,** under `design/export/` (so `design/export/project/tokens.json`
   exists). Do not edit it: when the design changes, it is exported again over the same folder.
2. **Install the tokens template:** `npx @trinity369/use design-tokens`. It lands in `src/design-system/design-tokens/`:
   `oc-tokens.css`, `design-sync.mjs`, `design-sync.config.example.json`, `oc-map.example.json` and a `README.md`
   with the contract's table (every token, its default and its usage). Look first: when the project already has
   `src/design-system/design-tokens/design-sync.mjs` and a `design-sync.config.json` at its root whose `contract`
   names `design/oc-map.json` (a site made from an Open Context starter at 2.0.0 or later), it holds all of this and
   step 6's imports: skip this step, the config copy in step 3 and step 6, and run step 5 as the site's
   `pnpm design:sync`. A site made from an older starter keeps its own design script in a scripts folder, which
   writes none of the tokens the parts read: install the template as written here, follow every step, and replace that
   script's commands in the site's package.json with step 5's.
3. **Copy the two examples:** `design-sync.config.example.json` to the project root as `design-sync.config.json` (its
   paths are relative to that file and already point at `design/export/project`, `design/oc-map.json` and
   `src/design-system/generated/`), and `oc-map.example.json` to `design/oc-map.json`.
4. **Write the map,** `design/oc-map.json`: for every contract token, the name of the token in the design system that
   plays its role. Read both sides: the `usage` column of the contract and the `usage` notes in `tokens.json`. Colour
   tokens name a colour token, `font-body` and `font-heading` name a key of `type.families`, `radius` names a radius
   token. Never invent a value and never point a token at a colour that only looks close: if the design system has
   no such role, write `null` (the parts then keep their default for it) and tell the owner. Every token must be a key.
   Map `scrim` (the veil behind a dialog) only when the design system has one; `null` keeps its dark default.
5. **Run design-sync:**

   ```sh
   node src/design-system/design-tokens/design-sync.mjs --config design-sync.config.json
   ```

   It checks the map first (every token named, every name exists, the right kind), then two kinds of contrast in
   every theme the design system defines: the contract's text and ground pairs (`ink` on `surface`, `on-brand` on
   `brand`, …) at least 4.5:1, and the focus ring (`focus` on `surface`, `surface-alt` and `surface-sunk`) at least
   3:1. Then it writes `src/design-system/generated/tokens.css`, each theme with its colour scheme (light or dark, by
   its surface and ink, so the browser draws scrollbars and form controls to match). A refusal lists every problem. A
   contrast refusal is a question for whoever owns the design system: report the pair, the theme and both colours, and
   do not bend the map to make it pass.
6. **Load it once.** In the main stylesheet, after Tailwind: `@import "../design-system/design-tokens/oc-tokens.css";` (the
   utilities for the project's own code: `bg-oc-brand`, `text-oc-ink`, `rounded-oc-lg`, `font-oc-heading`). In the
   root layout, import `src/design-system/generated/tokens.css` once, and give the page the tokens:
   `body { background: var(--oc-surface); color: var(--oc-ink); font-family: var(--oc-font-body); }`. The design
   system's first theme is the default; any other applies inside an element with `data-theme="<theme id>"`.
7. **Look at it.** Open the site at phone and desktop width, in every theme. Then add the check to the project's
   tests: `node src/design-system/design-tokens/design-sync.mjs --config design-sync.config.json --check` fails
   when the generated files no longer match the export (a starter's `pnpm test` runs it already).

When the design system changes: export it again over `design/export/`, run step 5 again (`--diff` lists the classes
the design's component stylesheet added or removed), look at it, commit.

## Rules

- The parts are never edited to take a brand: if one does not follow the tokens, that is a defect of the part.
- Code written for the project uses the same tokens (`oc-tokens.css`'s utilities or `var(--oc-…)`), never a colour,
  font or radius literal.
- A client's design system, its export and its map belong to the client's project. Never publish them, never copy
  them into a template, and never name the client in anything public.
