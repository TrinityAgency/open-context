# About Page

An about page for a Next app: a hero, the company's story, its values, a few figures, the team and a call to
action. It installs as a route folder at `app/page-about` (served at `/page-about`); rename the folder for another
path, e.g. `app/about`. Everything is a server component with typed content, so the page renders on the server and
ships no JavaScript of its own.

## Usage

1. Edit `content.ts`: the page's title and description (`META`) and every visible string (`CONTENT`). The sample
   content is invented (Samplework Inc.); keep the shapes and replace the text, the pictures and the people.
2. Pick the language: `LOCALE` in `content.ts` is `'en'` (the default) or `'de'` (the German sample set). Set
   `lang` on `<html>` in your root layout to match.

The page body is `AboutPage({ locale })` in `about-page.tsx`; `page.tsx` only renders it with `LOCALE`. A site that
keeps its locale elsewhere renders the body itself:

```tsx
import { AboutPage } from '@/app/page-about/about-page';

export default function About() {
  return <AboutPage locale="de" />;
}
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

## What is inside

| File | |
|---|---|
| `page.tsx` | the route: `metadata` and the page, in `LOCALE` |
| `about-page.tsx` | `AboutPage({ locale })`: the sections in order, with Next's `Link` for links |
| `about-story.tsx` | `AboutStory`: a heading, paragraphs and an optional image |
| `team-grid.tsx` | `TeamGrid`: one card per team member |
| `site-types.ts` | the kit's shared types this page uses (`TeamMember`, `SocialLink`, …) |
| `content.ts` | `LOCALE`, `META` and `CONTENT` (English and German) |
| `_sections/hero`, `_sections/features`, `_sections/stats`, `_sections/cta` | copies of `section-hero`, `section-features`, `section-stats` and `section-cta` 2.0.0, byte for byte; each folder has its own README |

The `_sections` folders start with an underscore, so Next never serves them as routes.

## Props

`AboutStory`:

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `{ title, paragraphs: string[], image? }` | | the paragraphs render in order |
| `ImageComponent` | `ImageComponent` | plain `img` | e.g. a `next/image` wrapper |

`TeamGrid`:

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `{ title, intro?, members: TeamMember[] }` | | an empty `members` renders the heading and intro only |
| `LinkComponent` | `LinkComponent` | plain `a` | renders the profile links, e.g. `next/link` |
| `ImageComponent` | `ImageComponent` | plain `img` | renders the portraits |

A `TeamMember` is `{ name, role, bio?, image?, links? }`; a link is `{ network, label, href }`, shown as its
`label`. A portrait with an empty `alt` is decorative, because the name sits right beside it.

## Labels

None: every string on the page comes from `content.ts`.

## Keyboard and screen readers

- The page is one `main` landmark (`id="main"`, the target of a skip link) with exactly one `h1`, the hero's title.
- Each section is a region named by its `h2`; each team member's name is an `h3`.
- Profile links are ordinary links in reading order, with a visible focus ring.

## Client islands

None.

## Notes

- Neutral colours only, with every margin and box set on the element, so the page looks the same with or without
  Tailwind's preflight.
- The sample pictures are inline SVG, so the page loads nothing from another host. With `next/image`, pass an
  `ImageComponent` to `AboutStory`, `TeamGrid` and the sections that show images.
- To change a section beyond its content, edit its copy under `_sections/`; it is your code now.
