import { useId, type ComponentProps } from 'react';
import type { ImageComponent, LinkComponent, TeamMember } from './site-types';

export type TeamGridContent = { title: string; intro?: string; members: TeamMember[] };

export type TeamGridProps = {
  content: TeamGridContent;
  /** Renders the profile links; pass next/link's Link in a Next app. Default: a plain `a`. */
  LinkComponent?: LinkComponent;
  /** Renders the portraits; pass a next/image wrapper in a Next app. Default: a plain `img`. */
  ImageComponent?: ImageComponent;
};

function PlainLink(props: ComponentProps<LinkComponent>) {
  return <a {...props} />;
}

function PlainImage({ src, alt, width, height, className }: ComponentProps<ImageComponent>) {
  return <img src={src} alt={alt} width={width} height={height} className={className} />;
}

const LINK =
  'rounded-sm text-sm text-neutral-900 underline underline-offset-2 hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';

/**
 * The team: one card per member with a portrait, the name (`h3`), the role, a short bio and profile links. Server
 * component. An empty team renders the heading and intro only.
 */
export function TeamGrid({ content, LinkComponent: Link = PlainLink, ImageComponent: Image = PlainImage }: TeamGridProps) {
  const headingId = useId();
  const { title, intro, members } = content;

  return (
    <section aria-labelledby={headingId} className="box-border px-6 py-16 text-neutral-900">
      <div className="mx-auto max-w-5xl">
        <h2 id={headingId} className="m-0 text-3xl font-semibold tracking-tight">
          {title}
        </h2>
        {intro ? <p className="m-0 mt-4 max-w-2xl text-lg text-neutral-700">{intro}</p> : null}
        {members.length > 0 ? (
          <ul className="m-0 mt-10 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member, i) => (
              <li key={i} className="min-w-0">
                {member.image ? (
                  <Image
                    src={member.image.src}
                    alt={member.image.alt}
                    width={member.image.width}
                    height={member.image.height}
                    className="mb-4 block size-20 rounded-full object-cover"
                  />
                ) : null}
                <h3 className="m-0 text-lg font-semibold">{member.name}</h3>
                <p className="m-0 mt-1 text-sm font-medium text-neutral-600">{member.role}</p>
                {member.bio ? <p className="m-0 mt-3 text-neutral-700">{member.bio}</p> : null}
                {member.links && member.links.length > 0 ? (
                  <ul className="m-0 mt-3 flex list-none flex-wrap gap-x-4 gap-y-1 p-0">
                    {member.links.map((link, j) => (
                      <li key={j}>
                        <Link href={link.href} className={LINK}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
