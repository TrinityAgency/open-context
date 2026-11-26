import { useId, type ComponentProps, type ReactNode } from 'react';
import type { ImageComponent, LinkComponent, TeamMember } from './site-types';

/** The team's layouts, named as in the kit's layout vocabulary. */
export type TeamLayout = 'grid' | 'rows' | 'minimal';

export type TeamContent = { title: string; intro?: string; members: TeamMember[] };

export type TeamSectionProps = {
  content: TeamContent;
  /**
   * `grid` (the default): one member per cell with a round portrait, in 1, 2 or 3 columns. `rows`: one member per
   * row in a card, a large portrait beside the text from `md`, the side alternating; without any portrait it draws
   * `grid`. `minimal`: names, roles and links in a compact list, no portraits and no bios.
   */
  layout?: TeamLayout;
  /** Renders the profile links; pass next/link's Link in a Next app. Default: a plain `a`. */
  LinkComponent?: LinkComponent;
  /** Renders the portraits; pass a next/image wrapper in a Next app. Default: a plain `img`. */
  ImageComponent?: ImageComponent;
  id?: string;
  className?: string;
};

function PlainLink(props: ComponentProps<LinkComponent>) {
  return <a {...props} />;
}

function PlainImage({ src, alt, width, height, className }: ComponentProps<ImageComponent>) {
  return <img src={src} alt={alt} width={width} height={height} className={className} />;
}

// Design tokens (Open Context token contract v1): each reads the project's design system once its stylesheet is
// loaded, and falls back to the kit's neutral look when none is.
const INK = 'text-[var(--oc-ink,oklch(20.5%_0_none))]';
const INK_BODY = 'text-[var(--oc-ink-body,oklch(37.1%_0_none))]';
const INK_MUTED = 'text-[var(--oc-ink-muted,oklch(43.9%_0_none))]';
const HEADING_FONT = 'font-[family-name:var(--oc-font-heading)]';
const RADIUS_LG = 'rounded-[calc(var(--oc-radius,0.25rem)*2)]';

const ROOT = `box-border px-6 py-16 ${INK} wrap-break-word`;
const LINK =
  'rounded-[var(--oc-radius,0.25rem)] text-sm text-[var(--oc-ink,oklch(20.5%_0_none))] underline underline-offset-2 hover:text-[var(--oc-ink-muted,oklch(43.9%_0_none))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';
const LIST: Record<TeamLayout, string> = {
  grid: 'm-0 mt-10 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 lg:grid-cols-3',
  rows: 'm-0 mt-10 grid list-none grid-cols-1 gap-6 p-0',
  minimal: 'm-0 mt-10 grid list-none grid-cols-1 gap-x-8 gap-y-6 p-0 sm:grid-cols-2 lg:grid-cols-3',
};
// rows: a card on the surface, the portrait above the text on a phone and beside it from md (reversed on `end`)
const ROW_START = `box-border flex min-w-0 flex-col gap-6 border border-solid border-[var(--oc-line,oklch(92.2%_0_none))] bg-[var(--oc-surface,#fff)] p-6 ${RADIUS_LG} md:flex-row md:items-center md:gap-8 md:p-8`;
const ROW_END = `${ROW_START} md:flex-row-reverse`;
const ROW_PORTRAIT = `block size-28 shrink-0 object-cover ${RADIUS_LG} md:size-40`;

/**
 * The team: each member's name (`h3`), role, short bio, portrait and profile links, in one of three layouts
 * (`layout`). Server component. `grid` is page-about 2.0.0's team grid; `rows` gives each member a card with a large
 * portrait beside the text; `minimal` lists names, roles and links only. An empty team renders the heading and intro
 * only. Colours, fonts and corner radius come from the design tokens.
 */
export function TeamSection({
  content,
  layout = 'grid',
  LinkComponent: Link = PlainLink,
  ImageComponent: Image = PlainImage,
  id,
  className,
}: TeamSectionProps) {
  const headingId = useId();
  const { title, intro, members } = content;
  // rows needs portraits: a team without any draws the grid
  const drawn: TeamLayout = layout === 'rows' && !members.some((member) => member.image) ? 'grid' : layout;

  const links = (member: TeamMember, cls: string) =>
    member.links && member.links.length > 0 ? (
      <ul className={cls}>
        {member.links.map((link, j) => (
          <li key={j} className="max-w-full">
            <Link href={link.href} className={LINK}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    ) : null;
  const portrait = (member: TeamMember, cls: string) =>
    member.image ? (
      <Image src={member.image.src} alt={member.image.alt} width={member.image.width} height={member.image.height} className={cls} />
    ) : null;

  let list: ReactNode = null;
  if (members.length > 0) {
    if (drawn === 'rows') {
      list = (
        <ul className={LIST.rows}>
          {members.map((member, i) => {
            const side = i % 2 === 0 ? 'start' : 'end';
            return (
              <li key={i} data-side={side} className={side === 'start' ? ROW_START : ROW_END}>
                {portrait(member, ROW_PORTRAIT)}
                <div className="min-w-0 flex-1">
                  <h3 className={`m-0 text-xl font-semibold ${HEADING_FONT}`}>{member.name}</h3>
                  <p className={`m-0 mt-1 text-sm font-medium ${INK_MUTED}`}>{member.role}</p>
                  {member.bio ? <p className={`m-0 mt-3 ${INK_BODY}`}>{member.bio}</p> : null}
                  {links(member, 'm-0 mt-4 flex list-none flex-wrap gap-x-4 gap-y-1 p-0')}
                </div>
              </li>
            );
          })}
        </ul>
      );
    } else if (drawn === 'minimal') {
      list = (
        <ul className={LIST.minimal}>
          {members.map((member, i) => (
            <li key={i} className="min-w-0">
              <h3 className={`m-0 text-base font-semibold ${HEADING_FONT}`}>{member.name}</h3>
              <p className={`m-0 mt-1 text-sm ${INK_MUTED}`}>{member.role}</p>
              {links(member, 'm-0 mt-2 flex list-none flex-wrap gap-x-4 gap-y-1 p-0')}
            </li>
          ))}
        </ul>
      );
    } else {
      list = (
        <ul className={LIST.grid}>
          {members.map((member, i) => (
            <li key={i} className="min-w-0">
              {portrait(member, 'mb-4 block size-20 rounded-full object-cover')}
              <h3 className={`m-0 text-lg font-semibold ${HEADING_FONT}`}>{member.name}</h3>
              <p className={`m-0 mt-1 text-sm font-medium ${INK_MUTED}`}>{member.role}</p>
              {member.bio ? <p className={`m-0 mt-3 ${INK_BODY}`}>{member.bio}</p> : null}
              {links(member, 'm-0 mt-3 flex list-none flex-wrap gap-x-4 gap-y-1 p-0')}
            </li>
          ))}
        </ul>
      );
    }
  }

  return (
    <section id={id} aria-labelledby={headingId} data-layout={drawn} className={className ? `${ROOT} ${className}` : ROOT}>
      <div className="mx-auto max-w-5xl">
        <h2 id={headingId} className={`m-0 text-3xl font-semibold tracking-tight ${HEADING_FONT}`}>
          {title}
        </h2>
        {intro ? <p className={`m-0 mt-4 max-w-2xl text-lg ${INK_BODY}`}>{intro}</p> : null}
        {list}
      </div>
    </section>
  );
}
