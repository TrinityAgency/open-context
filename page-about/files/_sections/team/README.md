# Team Section

The people behind a business: each member's name, role, a short bio, a portrait and profile links, in three
layouts. Its colours, fonts and corner radius come from your design system's tokens when you load them, and it keeps
a neutral look when you do not. A server component with typed content: every visible string comes in through
`content`.

## Usage

```tsx
import { TeamSection } from '@/components/section-team/team-section';

<TeamSection
  id="team"
  content={{
    title: 'The team',
    intro: 'The people you will talk to.',
    members: [
      {
        name: 'Alex Sample',
        role: 'Founder',
        bio: 'Plans every project and reads every plan before it goes out.',
        image: { src: '/team/alex.jpg', alt: '', width: 320, height: 320 },
        links: [{ network: 'email', label: 'Email', href: 'mailto:alex@example.com' }],
      },
      { name: 'Sam Example', role: 'Office', bio: 'Answers the phone and keeps the calendar.' },
    ],
  }}
/>

<TeamSection layout="rows" content={content} />
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

### With Next's Link and Image

Profile links render through `LinkComponent` (a plain `a` by default), portraits through `ImageComponent` (a plain
`img`):

```tsx
import Link from 'next/link';
import Image from 'next/image';
import type { ImageComponent } from '@/components/section-team/site-types';

const NextImage: ImageComponent = ({ alt, ...props }) => <Image alt={alt} {...props} />;

<TeamSection content={content} LinkComponent={Link} ImageComponent={NextImage} />
```

## Layouts

Pick one with the `layout` prop; leave it out and the team is a `grid`.

| `layout` | What it draws | Example |
|---|---|---|
| `grid` | one member per cell with a round portrait, name, role, bio and links, in one, two or three columns as the width grows | `<TeamSection layout="grid" content={{ title, intro, members }} />` |
| `rows` | one member per row in a card, a large portrait beside the text from `md` (above it on a phone), the portrait side alternating | `<TeamSection layout="rows" content={{ title, members: [{ name, role, bio, image }] }} />` |
| `minimal` | names, roles and links in a compact list (one column, two from `sm`, three from `lg`), no portraits and no bios | `<TeamSection layout="minimal" content={{ title, members: [{ name, role, links }] }} />` |

`rows` needs portraits: a team without any draws the `grid` instead, and a member without one gets a card with its
text only. The section carries `data-layout` with the layout it drew; in `rows`, each `li` carries `data-side`
(`start` or `end`), the side its portrait takes from `md` up. `grid` draws exactly what `page-about` 2.0.0's team
grid draws.

## Brand

The section reads these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset,
each falls back to the neutral value in brackets, so the section keeps its neutral look with no design system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-ink` | the title, the names, the links | `oklch(20.5% 0 none)` |
| `--oc-ink-body` | the intro and the bios | `oklch(37.1% 0 none)` |
| `--oc-ink-muted` | the roles, a hovered link | `oklch(43.9% 0 none)` |
| `--oc-surface` | the card's ground in `rows` | `#fff` |
| `--oc-line` | the card's border in `rows` | `oklch(92.2% 0 none)` |
| `--oc-focus` | the focus ring of a link | `oklch(20.5% 0 none)` |
| `--oc-font-heading` | the title and the names | the page's font |
| `--oc-radius` | corners: 1 × on a focused link, 2 × on the card and the portrait in `rows` | `0.25rem` |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark) and the `design-system-seed` skill. To set them by hand, declare
them once in your global stylesheet, e.g. `:root { --oc-ink: #1d2b3a; --oc-radius: 0.5rem; }`. A `data-theme` wrapper
with its own values re-brands everything inside it.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `TeamContent` | | `{ title, intro?, members: TeamMember[] }` |
| `layout` | `'grid' \| 'rows' \| 'minimal'` | `grid` | see Layouts |
| `LinkComponent` | `LinkComponent` | plain `a` | e.g. next/link's `Link` |
| `ImageComponent` | `ImageComponent` | plain `img` | e.g. a `next/image` wrapper |
| `id` | `string` | | on the `section`, e.g. an anchor target |
| `className` | `string` | | on the `section` |

A `TeamMember` is `{ name, role, bio?, image?, links? }`; `image` is an `ImageRef` (`{ src, alt, width, height }`) and
each link a `SocialLink` (`{ network, label, href }`, the label is what shows). An empty `members` renders the
heading and intro only, in every layout. A portrait drawn beside the name can take an empty `alt`: the name already
says who it is.

## Labels

None: the section has no fixed strings. Everything it shows comes from `content`.

## Keyboard and screen readers

- The section is a region named by its `h2`; each member's name is an `h3`, so the page outline lists the team.
- In `rows`, the portrait comes before the text in reading order on every row; only the visual side alternates.
- Every profile link is a real link with a visible focus ring.

## Client islands

None.

## Notes

- Colours, fonts and radii only through the tokens above, and every margin and box set on the element, so it looks
  the same with or without Tailwind's preflight, and in a project with shadcn/ui's own variables.
- Long words break inside their column, so nothing leaves a phone screen.
- Square portraits look best: `rows` crops each to a square of 112 px, 160 px from `md`; `grid` to a circle of 80 px.
