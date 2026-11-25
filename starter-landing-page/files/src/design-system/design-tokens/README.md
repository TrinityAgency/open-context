# Design Tokens

The design-token contract every adaptable Open Context part reads, for Tailwind 4. One list of CSS custom
properties (`--oc-surface`, `--oc-ink`, `--oc-brand`, … `--oc-radius`) is the brand: set them once, from your own
design system, and every installed part takes your colours, fonts and corners without being edited. This template
gives you two things:

- `oc-tokens.css`: the same tokens as Tailwind utilities for your own code (`bg-oc-brand`, `text-oc-ink`,
  `rounded-oc-lg`, `font-oc-heading`, …), so the code you write around the parts matches them.
- `design-sync.mjs`: one dependency-free Node script that turns a design system made on claude.ai (its export's
  `tokens.json`) into a stylesheet that sets the tokens, in every theme the design system defines (light, dark).

Without any of it, every part keeps its neutral look: each reads `var(--oc-<token>, <its default>)`.

## Use the utilities

Import `oc-tokens.css` once in your main stylesheet, after Tailwind:

```css
@import "tailwindcss";
@import "../design-system/design-tokens/oc-tokens.css";
```

(The path goes from your stylesheet, here `src/app/globals.css`, to `src/design-system/design-tokens/`.) Then:

```tsx
<a className="inline-flex rounded-oc-md bg-oc-brand px-4 py-2 text-oc-on-brand hover:bg-oc-brand-hover">Book a call</a>
<div className="rounded-oc-lg border border-oc-line bg-oc-surface-alt p-4 text-oc-ink-body">…</div>
<h2 className="font-oc-heading text-oc-ink">…</h2>
```

Colours are `bg-`, `text-`, `border-`, `outline-` … `-oc-<token>`; radii are `rounded-oc` (1 ×), `rounded-oc-md`
(1.5 ×), `rounded-oc-lg` (2 ×), `rounded-oc-xl` (3 ×) the base radius, the same steps the parts use; fonts are
`font-oc-heading` and `font-oc-body`. `oc-tokens.css` sets no values itself, so it never overrides a design system.

## Connect your design system

1. Export your design system from claude.ai and put the export, unchanged, under `design/export/` (its
   `project/tokens.json` holds the colours per theme, the font families and the radii).
2. Copy `design-sync.config.example.json` to your project's root as `design-sync.config.json` (paths in it are
   relative to that file: the export, the map, the output in `src/design-system/generated/`) and
   `oc-map.example.json` to `design/oc-map.json`.
3. Write the map: for every contract token below, the name of the token in your design system that plays its role
   (read the `usage` notes of both), or `null` only when your design truly has no such role. Font tokens name a key
   of `type.families`, `radius` names a radius token. `scrim` (the veil behind a dialog) is usually `null`: its dark
   default suits every theme.
4. Run it:

   ```sh
   node src/design-system/design-tokens/design-sync.mjs --config design-sync.config.json
   ```

   It writes `src/design-system/generated/tokens.css`: your design system's own variables, then one
   `--oc-<token>: var(--<your token>);` alias per contract token, again in every theme block, so a
   `data-theme="dark"` wrapper switches the parts too. Each of those theme blocks starts with `color-scheme`: `light`
   when the theme's `surface` is lighter than its `ink`, `dark` otherwise, so under a dark theme the browser draws its
   scrollbars and native form controls dark too. Before writing anything it checks the map (every token named,
   every name exists, fonts map to families) and that text stays readable: `ink` on `surface`, `on-brand` on
   `brand` and the other pairs at least 4.5:1 in every theme, and the `focus` ring at least 3:1 on `surface`,
   `surface-alt` and `surface-sunk`. A refusal names the pair, the theme and both colours; it is a question for whoever owns the design
   system, not a reason to bend the map.
5. Import `generated/tokens.css` once in your root layout (or main stylesheet), and give the page the tokens:

   ```css
   body { background: var(--oc-surface); color: var(--oc-ink); font-family: var(--oc-font-body); }
   ```

   The first theme is the default; any other applies inside `data-theme="<id>"`.

After the design system changes, export it again over `design/export/` and run the same command. Add the same
command with `--check` to your tests (exit 1 when the generated files are out of date; before the first export it
says there is nothing to check and exits 0); `--diff` lists the classes a re-export added or removed. Always pass
`--config design-sync.config.json`: without it the script looks for its config one folder above itself. Add
`--guards` too: it refuses every colour literal under `src/` (your own code names a token instead), and sets aside
the contract's own `var(--oc-<token>, <its default>)`, which Open Context parts and `oc-tokens.css` carry inline.
If you write wrapper components over your design system's own component classes (files in `src/components/ui/`, or
the folder the config names as `wrappers`, that use a class with the config's `prefix`), the config needs an
`approved` list, the components you agreed to use, e.g. `"approved": ["Button", "Card"]`: `--guards` refuses such a
wrapper when the list is missing, and a class whose component is not on it. Files there that use none of those
classes (a shadcn/ui component, say) need no list.

Your design system's export and your map are yours: they belong in your project, not in a public template.

## The contract (version 1)

| Token | Kind | Default | Usage |
|---|---|---|---|
| `surface` | color | `#fff` | The page ground: sections, cards, panels, inputs. |
| `surface-alt` | color | `oklch(98.5% 0 none)` | An alternate ground that sets a band apart: the footer, a highlighted section. |
| `surface-sunk` | color | `oklch(97% 0 none)` | A ground a step down from surface: chips, inline code, quiet bands (a call to action, a signup), the hover tint of quiet buttons and links. |
| `line` | color | `oklch(92.2% 0 none)` | Hairlines: dividers, card and section borders, rules; also the ground of a placeholder highlight behind ink text (checked as drawn over surface). |
| `line-strong` | color | `oklch(87% 0 none)` | Borders that must be seen: inputs, secondary buttons, controls. |
| `ink` | color | `oklch(20.5% 0 none)` | Headings and primary text, links, the text of secondary buttons. |
| `ink-soft` | color | `oklch(26.9% 0 none)` | Large reading text a step lighter than ink: quotes, menu links. |
| `ink-body` | color | `oklch(37.1% 0 none)` | Body text: leads, paragraphs, footer text. |
| `ink-muted` | color | `oklch(43.9% 0 none)` | Secondary text: eyebrows, meta lines, captions. |
| `ink-subtle` | color | `oklch(55.6% 0 none)` | Tertiary text and small icons: disabled items, ellipses, chevrons. |
| `ink-faint` | color | `oklch(70.8% 0 none)` | Decoration only, never text: separators, timeline dots. |
| `brand` | color | `oklch(20.5% 0 none)` | The brand colour as a ground or mark: primary buttons, the current item, checkboxes and radios. |
| `brand-hover` | color | `oklch(37.1% 0 none)` | Brand under the pointer: the hover ground of primary buttons. |
| `on-brand` | color | `#fff` | Text and icons on a brand ground. |
| `brand-ink` | color | `oklch(20.5% 0 none)` | Brand-coloured text and marks that must stand out on surface (4.5:1): an eyebrow, a link a brand wants coloured, the underline of the selected tab, a progress bar. |
| `focus` | color | `oklch(20.5% 0 none)` | The focus outline of every interactive element. |
| `scrim` | color | `oklch(20.5% 0 none)` | The veil behind a modal dialog or drawer, drawn translucent (/40, /50); map it only when the design system has one. |
| `font-body` | font | — | The body font stack; unset, parts inherit the page's font. |
| `font-heading` | font | — | The heading font stack; unset, headings inherit the page's font. |
| `radius` | radius | `0.25rem` | The base corner radius; parts use 1, 1.5, 2 or 3 times it (999px makes pills, 0 makes square corners). |

The defaults are Tailwind 4's neutral greys, so a part without a design system looks as it always did. The custom
properties use the `--oc-` prefix and never collide with shadcn/ui's (`--primary`, `--radius`) or Tailwind's
(`--color-*`).

## Files

| File | |
|---|---|
| `oc-tokens.css` | the utilities for your own code |
| `design-sync.mjs` | the connect script (Node 22, no dependencies) |
| `design-sync.config.example.json` | its config, for the project's root: where the export is, where to write, the map |
| `oc-map.example.json` | a map for a design system with claude.ai's usual token names |

## Notes

- Version 2.0.0 replaces 1.0.0 (a Tailwind 3 `tailwind.config.ts` with shadcn/ui's HSL variables): the tokens are
  now the Open Context contract, for Tailwind 4, and a design system reaches them through `design-sync.mjs`.
- Version 2.1.0 (design-sync template v4): every theme block carries its `color-scheme`; `--guards` refuses wrapper
  components without an `approved` list; the message for a missing catalog names no script path. Run the
  script once after updating: every generated file's banner names template v4 and `tokens.css` gains the
  `color-scheme` lines, and `--check` reports the generated files out of date until then.
- To set the tokens by hand instead, declare them in your stylesheet, e.g.
  `:root { --oc-brand: oklch(45% 0.15 250); --oc-on-brand: #fff; --oc-radius: 0.5rem; }`. A hand-set dark brand
  also needs the page's ground, `body { background: var(--oc-surface); color: var(--oc-ink); }` (step 5): each part
  draws its own ground, but the page between them stays the browser's white.
