import { useId, type ComponentProps, type ReactNode } from 'react';
import { VIDEO_LABELS, type VideoLabels } from './labels';
import type { GateComponent, ImageComponent, VideoRef } from './site-types';
import { VideoFrame } from './video-frame';

/** The video's layouts, named as in the kit's layout vocabulary. */
export type VideoLayout = 'centered' | 'split';

export type VideoContent = { title: string; text?: string; video: VideoRef };

export type VideoSectionProps = {
  content: VideoContent;
  /**
   * `centered` (the default): the title and text centred above the video. `split`: the title and text beside the
   * video from `md`, above it on a phone.
   */
  layout?: VideoLayout;
  /**
   * Your consent gate, e.g. `ConsentGate` from the `site-cookie-consent` template. With it (and `video.embedSrc`),
   * the video is embedded once the visitor allows `category`; until then the cover's play control opens the consent
   * settings. Without it, the section never embeds: the play control links to the video's page.
   */
  Gate?: GateComponent;
  /** The consent category the video needs. Default: `'media'`. */
  category?: string;
  /** The fixed strings; pass `VIDEO_LABELS_DE` from `./labels.de` for German. */
  labels?: Partial<VideoLabels>;
  /** Renders the poster; pass a next/image wrapper in a Next app. Default: a plain `img`. */
  ImageComponent?: ImageComponent;
  id?: string;
  className?: string;
};

function PlainImage({ src, alt, width, height, className }: ComponentProps<ImageComponent>) {
  return <img src={src} alt={alt} width={width} height={height} className={className} />;
}

// Design tokens (Open Context token contract v1): each reads the project's design system once its stylesheet is
// loaded, and falls back to the kit's neutral look when none is.
const INK = 'text-[var(--oc-ink,oklch(20.5%_0_none))]';
const INK_BODY = 'text-[var(--oc-ink-body,oklch(37.1%_0_none))]';
const HEADING_FONT = 'font-[family-name:var(--oc-font-heading)]';
const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';

const ROOT = `box-border px-6 py-16 ${INK}`;
const FRAME: Record<VideoLayout, string> = {
  centered: 'mx-auto max-w-4xl wrap-break-word',
  split: 'mx-auto grid max-w-5xl grid-cols-1 gap-10 wrap-break-word md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center',
};
const TEXT: Record<VideoLayout, string> = { centered: 'min-w-0 text-center', split: 'min-w-0' };
const INTRO: Record<VideoLayout, string> = {
  centered: `m-0 mx-auto mt-4 max-w-2xl text-lg ${INK_BODY}`,
  split: `m-0 mt-4 max-w-2xl text-lg ${INK_BODY}`,
};
const NOTICE: Record<VideoLayout, string> = {
  centered: `m-0 mt-3 text-center text-sm ${INK_BODY}`,
  split: `m-0 mt-3 text-sm ${INK_BODY}`,
};
// the 16:9 box: corners, the picture cut to them; the sunk ground shows where there is no poster
const BOX =
  'relative box-border aspect-video w-full overflow-hidden rounded-[calc(var(--oc-radius,0.25rem)*2)] bg-[var(--oc-surface-sunk,oklch(97%_0_none))]';
const POSTER = 'absolute inset-0 block size-full max-w-none object-cover';
// a brand circle with an on-brand icon, centred on the cover; its hit area stretched over the whole cover
const PLAY = `m-0 box-border inline-flex size-16 cursor-pointer appearance-none items-center justify-center rounded-full border-0 bg-[var(--oc-brand,oklch(20.5%_0_none))] p-0 text-[var(--oc-on-brand,#fff)] no-underline shadow-lg after:absolute after:inset-0 hover:bg-[var(--oc-brand-hover,oklch(37.1%_0_none))] ${FOCUS}`;
const LINK = `rounded-[var(--oc-radius,0.25rem)] ${INK} underline underline-offset-2 hover:text-[var(--oc-ink-muted,oklch(43.9%_0_none))] ${FOCUS}`;

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ml-1 block size-7">
      <path d="M7 4.5v15l12.5-7.5z" />
    </svg>
  );
}

/**
 * A video with its title and text, in one of two layouts (`layout`). Server component. The video is embedded only
 * through the `Gate` you pass (your consent gate): the frame is created in the client file `video-frame.tsx` and
 * rendered as the gate's child; its fallback is the cover (your poster and a play control that opens the consent
 * settings, `data-consent-open`) with a notice and a plain link to the video's page under it. Without a `Gate` it
 * never embeds: the cover's play control links to the video's page. No text sits on the poster. Colours, fonts and
 * corner radius come from the design tokens.
 */
export function VideoSection({
  content,
  layout = 'centered',
  Gate,
  category = 'media',
  labels,
  ImageComponent: Image = PlainImage,
  id,
  className,
}: VideoSectionProps) {
  const headingId = useId();
  const l = { ...VIDEO_LABELS, ...labels };
  const { title, text, video } = content;
  const embedSrc = Gate ? video.embedSrc : undefined;

  const cover = (control: ReactNode) => (
    <div data-video-box className={BOX}>
      {video.poster ? (
        <Image src={video.poster.src} alt={video.poster.alt} width={video.poster.width} height={video.poster.height} className={POSTER} />
      ) : null}
      <div className="absolute inset-0 flex items-center justify-center">{control}</div>
    </div>
  );

  let player: ReactNode;
  if (Gate && embedSrc) {
    const fallback = (
      <>
        {cover(
          <button type="button" data-consent-open aria-label={l.play} className={PLAY}>
            <PlayIcon />
          </button>,
        )}
        <p className={NOTICE[layout]}>
          {l.notice}{' '}
          <a href={video.href} rel="noopener noreferrer" className={LINK}>
            {l.watch}
          </a>
        </p>
      </>
    );
    player = (
      <Gate category={category} fallback={fallback}>
        <div data-video-box className={BOX}>
          <VideoFrame src={embedSrc} title={video.title} />
        </div>
      </Gate>
    );
  } else {
    player = cover(
      <a href={video.href} aria-label={l.watch} rel="noopener noreferrer" className={PLAY}>
        <PlayIcon />
      </a>,
    );
  }

  return (
    <section id={id} aria-labelledby={headingId} data-layout={layout} className={className ? `${ROOT} ${className}` : ROOT}>
      <div className={FRAME[layout]}>
        <div data-text className={TEXT[layout]}>
          <h2 id={headingId} className={`m-0 text-3xl font-semibold tracking-tight ${HEADING_FONT}`}>
            {title}
          </h2>
          {text ? <p className={INTRO[layout]}>{text}</p> : null}
        </div>
        <div data-video className={layout === 'centered' ? 'mt-10 min-w-0' : 'min-w-0'}>
          {player}
        </div>
      </div>
    </section>
  );
}
