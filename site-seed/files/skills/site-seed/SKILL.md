---
name: site-seed
description: Use when someone wants a website, landing page, blog or portfolio built from the Open Context website kit. Asks what the site is for, picks one of five starters, installs it into an empty folder, then walks the owner through facts, language, pages, design, legal text and release, with the tests green after every step.
---

# Site Seed

Five starters, all assembled from one kit of published templates (sections, pages, the blog, cookie consent, the
legal pages), each proven on its own and proven together. They share one layout: facts once in
`src/content/site.ts`, page text in `src/content/`, guard tests that fail when a link, a fact or a colour goes wrong,
and an `AGENTS.md` that says where everything lives. English by default; German is one switch (`LOCALE` in
`src/content/locale.ts`).

This skill orders the work: ask, pick, install, then content, the owner's part, design and release. Once a starter is
installed, its `AGENTS.md` is the authority for that site; where this skill and `AGENTS.md` differ, follow `AGENTS.md`.

## 1. Ask

At most five questions, **one at a time**. Skip a question the owner has already answered.

1. **What is the site mainly for?** One offer, writing, work to show, a company with several pages, or something
   else. This picks the starter (section 2).
2. **Which language?** English or German. Other languages: English, and say that the text is theirs to translate.
3. **Which pages?** Ask once you know the starter: list its pages (its `README.md` and `AGENTS.md` name them) and
   say which can go: those `AGENTS.md` shows how to remove ("Removing a page" where it has one). The blog in
   `starter-website` and `starter-portfolio` is wired into every page and stays; for a site with no blog at all,
   `starter-landing-page` or `site-starter` fits better.
4. **The owner's facts:** the name of the business, email, phone, postal address and the domain (if there is one
   yet).
5. **Is there a design system** made on claude.ai (its export), or the brand's own colours, fonts and corners to write
   one from? Without either, the site starts in the kit's neutral look.

Never ask for legal text, and never invent a fact. A name, number, address, client, quote, logo or figure that the
owner has not given stays as the starter's sample, and goes on the list of what is still open (section 7). A sample
is visibly a sample; an invented fact looks real.

## 2. Pick

| The site is mainly… | Starter |
|---|---|
| one offer on one page: a launch, a campaign, a single product | `starter-landing-page` |
| writing: articles, news, a publication | `starter-blog` |
| work to show: projects, case studies, references | `starter-portfolio` |
| a company or product with several pages: features, pricing, about, contact, blog | `starter-website` |
| none of these, or the owner brings a full design and wants only the skeleton | `site-starter` |

When two rows fit, pick the one that matches what the owner named first, and say why. Then read the starter:
`npx @trinity369/use info <starter>`. Tell the owner, in a few lines, what the starter holds and what it does not
(for example: the portfolio has services, about, contact and a blog, but no pricing; the landing page is one page
with no blog). Go on when the owner agrees.

## 3. Install

1. **The folder.** `cd` into the site's folder and run `ls -A`. It may print nothing, or only `.git`, `.claude` and
   `.open-context.json`: a repository, an agent's settings, and this skill's own install, which stay with the site.
   If anything else is there, stop and ask the owner for an empty folder (a new one is fine). Never install over existing files,
   and never reach for `--no-overwrite` to make room in someone's project: a starter is a whole site, and a partial
   one does not build.
2. **Install from inside that folder:** `npx @trinity369/use <starter>`. A starter installs into `.`, and the CLI
   writes its record of what it installed (`.open-context.json`) into the folder it runs in. Installing from
   outside with `--dir` would leave that record outside the site.
3. **Check it:** `pnpm install`, then `pnpm test` and `pnpm lint`. Both must pass before anything changes. Node 22
   and pnpm 9 are needed; if a command is missing, say so and stop.
4. **Read the starter's `AGENTS.md` in full.** From here on it is the authority for this site: where facts, text,
   posts and projects live, how a page is added or removed, which folders are published parts that are not edited in
   place, and what each guard test protects.

## Every starter has

These exist in all five starters, so every step below can rely on them:

- `AGENTS.md`: how the site is put together; read before any change
- `README.md`: what the starter is made of, "The design" and the release steps
- `src/content/site.ts`: the facts, once (`SITE`, `CONTACT`, the navigation, `FORBIDDEN`)
- `src/content/locale.ts`: the language switch
- `src/app/sitemap.ts`: every page the site has (`PAGES`)
- `src/app/layout.tsx`: the header, footer and language of every page
- `src/app/globals.css`: Tailwind's theme and the design's tokens
- `src/design-system/design-tokens/README.md`: the design tokens every part reads, and their utilities
- `design-sync.config.json` and `design/export/README.md`: where a design export goes
- the scripts `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm test`, `pnpm lint` and `pnpm design:sync`

## 4. Content

In this order. Run `pnpm test && pnpm lint` after **each** step, and fix what fails before the next one: the guard
tests name the file and the problem.

1. **The language.** Set `LOCALE` in `src/content/locale.ts` (`'en'` or `'de'`). Every text, label, date format and
   the page's `lang` follow it; routes stay English (`AGENTS.md`, "The language switch", says how to rename them).
2. **The facts** in `src/content/site.ts`: the name, email, phone and address the owner gave. A fact the owner has
   not given stays as the sample and goes on the open list. Without a domain yet, the URL stays `https://example.com`.
3. **The page texts**, where `AGENTS.md` says they live (in the composite starters `src/content/home.ts` and
   `src/content/pages.ts`). Rewrite them only from what the owner said. In German mode, the German sample text names
   a sample company: replace it with the owner's name wherever the text is the site's own (not in the legal pages,
   section 5).
4. **Pages the owner does not want:** remove only what `AGENTS.md` shows how to remove ("Removing a page"), exactly
   as it says. The tests fail until the navigation, the links and the sitemap agree; taking the page out of a test's
   list of pages is part of removing it, as `AGENTS.md` says. Anything `AGENTS.md` does not show how to remove (the
   blog in the composite starters) stays: tell the owner why.
5. **Posts or projects:** the owner's, written as `AGENTS.md` says (`content/blog/` for posts, `content/work/` for
   projects), each language in its own folder. Delete the samples once the owner's first ones are in. The starter's
   tests count the sample posts and projects: change those counts and names to the owner's content, never delete a
   guard test to get green. Without the owner's content, the samples stay and go on the open list.
6. **`FORBIDDEN`** in `src/content/site.ts`: phrases that must never appear (an old name, an old address, a promise
   the owner cannot keep). Ask the owner; add what they name.

## 5. What only the owner can supply

- **Legal text.** The imprint, privacy notice and terms ship structure and `[[…]]` placeholders, not legal text. The
  text comes from the owner or their counsel. **Never write, translate, fill or shorten a placeholder, even when the
  owner asks for it.** Say why: legal text carries the owner's liability, depends on their business and country, and
  a coding agent's draft looks finished while nobody has checked it. Leave the legal pages' files exactly as
  installed (in the composite starters `src/app/_page-legal-imprint/content.ts`, `src/app/_page-legal-privacy/content.ts`
  and `src/app/_page-legal-terms/content.ts`), and tell the owner what the placeholders ask for, so they know what
  to bring. The guard is on their side: once the URL is their domain, `pnpm test` names every legal file that still
  holds a placeholder and `pnpm build` refuses to render one (`src/content/legal-guard.ts`). `site-starter` has no
  legal pages; `AGENTS.md` says how to add them from the kit.
- **Where messages go.** `deliver()` in `src/app/_page-contact/deliver.ts` (contact form) and `subscribe()` in
  `src/content/subscribe.ts` (newsletter), in the starters that have them. As shipped they refuse in production, so a
  visitor sees "could not be sent" instead of a message lost in silence. They need the owner's providers: an email
  service, a help desk, a newsletter tool. Wire one only with the owner's provider and its credentials from the
  environment; otherwise leave them and put them on the open list.
- **Consent for embeds.** A map, video, font or script from another host needs a consent category the owner chooses
  and a `ConsentGate`, as `AGENTS.md` ("Consent") says. Nothing from another host loads before the visitor chooses.

## 6. Design

Every part and the starter's own code read one set of design tokens (`src/design-system/design-tokens/README.md`
lists them): colours, fonts and corners come from there, structure from each part's `layout` prop.

- **With a design system made on claude.ai, or the brand's own values** (which `design-system-seed` writes into an
  export of the same shape): connect it with the `design-system-seed` skill
  (`npx @trinity369/use design-system-seed`, run from the site's folder; it installs into `.claude`). Every starter
  already holds the tokens part, its config and the imports, so the skill's install steps are done; what is left is
  the export, unchanged, under `design/export/`, the map in `design/oc-map.json` (copied from
  `src/design-system/design-tokens/oc-map.example.json`: for each contract token the design's token that plays its
  role) and `pnpm design:sync`. The README's "The design" has the steps. Every part takes the design's colours, fonts
  and corners at once. When `pnpm design:sync` refuses a text that would be unreadable on its ground, that is a
  question for whoever owns the design: never bend the map to pass.
- **Structure:** each installed part's `README.md` lists its layouts and what each draws; choose one with the part's
  `layout` prop (`layout="split"`) where the owner's content asks for it (portraits for large quotes, an image beside
  each feature). The starter's pages already choose theirs (most use the default; the feature groups `rows`, the
  newsletter beside a post `sticky`): change one only where the owner's content asks for it.
- **Without either:** the site stays in the kit's neutral look, plain and complete. A colour, font or corner of the
  owner's own waits for their design system or their values: they live only in the design export, never in the
  site's code.
- **The site's own code** names the tokens with the tokens part's utilities (`bg-oc-surface`, `text-oc-ink`,
  `border-oc-line`, `rounded-oc-lg`, `font-oc-heading`). `pnpm test` (`src/design-system/tokens-only.test.ts`) and
  `pnpm design:guards` refuse a colour literal, a palette class, a radius from Tailwind's scale and `font-sans`.

## 7. Release

1. **Build for the domain:** `SITE_URL=https://<domain> pnpm build`. The build reads `SITE_URL` for the sitemap,
   `/robots.txt` and every absolute link. In the starters with legal pages, the legal guard refuses a placeholder on a
   real domain: that is by design, and the fix is the owner's text, never removing the guard.
2. **Run it anywhere Node 22 runs:** the build writes a self-contained server to `.next/standalone`; `pnpm start`
   runs it, with `PORT` and `HOSTNAME` from the environment. Copy that folder to a server behind HTTPS (a reverse
   proxy, or a platform that terminates TLS), or use a platform that builds Next itself, with `SITE_URL` set there.
   The README's release steps have the details.
3. **The going-live list,** handed to the owner with what is still open:
   - the legal text from the owner or counsel, every placeholder gone (section 5)
   - `deliver()` and `subscribe()` wired to the owner's providers, or their forms removed (section 5)
   - the consent categories for every embed (section 5)
   - every sample fact, text, post, project, quote and logo replaced or removed (section 4)
   - `SITE_URL` set to the domain
   - `pnpm test` green with the domain set
   - the sitemap and, where the starter has them, the feeds answering on the domain (`/sitemap.xml`, `/feed.xml`)

## 8. Grow

- **Find more:** `npx @trinity369/use search <words>`, `npx @trinity369/use info <slug>`, and the whole kit with
  `npx @trinity369/use --list --category WEB_DESIGN` (also `SECTIONS`, `COMPONENTS`, `BLOG`).
- **Install a member into a starter,** from the site's folder, with `--dir`: a component or section with
  `npx @trinity369/use <slug> --dir src/components/<slug>`, a page with `npx @trinity369/use <slug> --dir src/app/<route>`.
  Then wire it as `AGENTS.md` says ("Adding a page": its route in `PAGES`, its link in the navigation, its text in
  both languages).
- **Parts are never edited in place.** The folders `AGENTS.md` lists under "Parts" are published templates. Change
  them through their props, labels and content; a change beyond that belongs in the template (`AGENTS.md`, "Parts").

## Never

- Never ask more than five questions, or more than one at a time.
- Never invent a fact: a sample stays a sample until the owner gives the real one, and it is on the open list.
- Never install into a folder that holds anything but `.git`, `.claude` and `.open-context.json`, and never use
  `--no-overwrite` to install into someone's project.
- Never install from outside the site's folder with `--dir`; the record belongs inside the site.
- Never write, translate, fill or shorten legal text or a `[[…]]` placeholder, even when asked. Leave the legal
  pages' files as installed and say why.
- Never wire `deliver()` or `subscribe()` to a provider the owner has not chosen, or put a credential in a file.
- Never leave `pnpm test && pnpm lint` failing after a step, and never delete or weaken a guard test to make it pass.
- Never write a colour literal, and never edit the generated files in `src/design-system/generated/`.
- Never put a styling class on a part: its structure is its `layout` prop, its look the design tokens. A class that
  only places it on the page (margin, width, display, height, a rule beside it in the tokens) is the page's, as the
  starter's own pages do.
- Never edit a published part in place.
- Never load anything from another host before the visitor's consent.
