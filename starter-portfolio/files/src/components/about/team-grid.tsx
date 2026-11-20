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
  'rounded-oc text-sm text-oc-ink underline underline-offset-2 hover:text-oc-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oc-focus';

/**
 * The team: one card per member with a portrait, the name (`h3`), the role, a short bio and profile links. Server
 * component. An empty team renders the heading and intro only.
 */
export function TeamGrid({ content, LinkComponent: Link = PlainLink, ImageComponent: Image = PlainImage }: TeamGridProps) {
  const headingId = useId();
  const { title, intro, members } = content;

  return (
    <section aria-labelledby={headingId} className="box-border px-6 py-16 text-oc-ink wrap-break-word">
      <div className="mx-auto max-w-5xl">
        <h2 id={headingId} className="m-0 text-3xl font-semibold tracking-tight font-oc-heading">
          {title}
        </h2>
        {intro ? <p className="m-0 mt-4 max-w-2xl text-lg text-oc-ink-body">{intro}</p> : null}
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
                <h3 className="m-0 text-lg font-semibold font-oc-heading">{member.name}</h3>
                <p className="m-0 mt-1 text-sm font-medium text-oc-ink-muted">{member.role}</p>
                {member.bio ? <p className="m-0 mt-3 text-oc-ink-body">{member.bio}</p> : null}
                {member.links && member.links.length > 0 ? (
                  <ul className="m-0 mt-3 flex list-none flex-wrap gap-x-4 gap-y-1 p-0">
                    {member.links.map((link, j) => (
                      <li key={j} className="max-w-full">
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
