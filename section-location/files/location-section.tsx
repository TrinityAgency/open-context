import { useId, type ReactNode } from 'react';
import { LOCATION_LABELS, type LocationLabels } from './labels';
import { MapFrame } from './map-frame';
import type { ContactFacts, GateComponent, HoursRow, MapRef } from './site-types';
import { telHref } from './tel-href';

/** The location's layouts, named as in the kit's layout vocabulary. */
export type LocationLayout = 'split' | 'stacked';

export type LocationContent = {
  title: string;
  intro?: string;
  contact: ContactFacts;
  hours?: HoursRow[];
  /** A line under the hours, e.g. holidays. */
  hoursNote?: string;
  /** The map: `href` its page on the provider's site; `embedSrc` the address of its embed, shown only behind `Gate`. */
  map?: MapRef;
};

export type LocationSectionProps = {
  content: LocationContent;
  /**
   * `split` (the default): the details beside the map from `md`, the map below them on a phone. `stacked`: the map
   * above the details. Without a map, both draw the details in one column and report `stacked`.
   */
  layout?: LocationLayout;
  /**
   * Your consent gate, e.g. `ConsentGate` from the `site-cookie-consent` template. With it (and `map.embedSrc`), the
   * map is embedded once the visitor allows `category`; until then a placeholder offers the consent settings and a
   * link to the map. Without it, the section never embeds: it links to the map.
   */
  Gate?: GateComponent;
  /** The consent category the map needs. Default: `'media'`. */
  category?: string;
  /** The fixed strings; pass `LOCATION_LABELS_DE` from `./labels.de` for German. */
  labels?: Partial<LocationLabels>;
  id?: string;
  className?: string;
};

// Design tokens (Open Context token contract v1): each reads the project's design system once its stylesheet is
// loaded, and falls back to the kit's neutral look when none is.
const INK = 'text-[var(--oc-ink,oklch(20.5%_0_none))]';
const INK_BODY = 'text-[var(--oc-ink-body,oklch(37.1%_0_none))]';
const INK_MUTED = 'text-[var(--oc-ink-muted,oklch(43.9%_0_none))]';
const HEADING_FONT = 'font-[family-name:var(--oc-font-heading)]';
const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';

const ROOT = `box-border px-6 py-16 ${INK}`;
const BODY: Record<LocationLayout, string> = {
  split: 'mt-10 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]',
  stacked: 'mt-10 grid grid-cols-1 gap-10',
};
const LABEL = `m-0 text-sm font-medium ${INK_MUTED}`;
const LINK = `rounded-[var(--oc-radius,0.25rem)] ${INK} underline underline-offset-2 hover:text-[var(--oc-ink-muted,oklch(43.9%_0_none))] ${FOCUS}`;
// the map's box: 4:3 (16:9 from md when stacked, at full width), its corners and border; it grows when the
// placeholder's text needs more room, and each child keeps 20rem from md, so a map is never a strip
const MAP_BOX: Record<LocationLayout, string> = {
  split:
    'box-border grid aspect-[4/3] min-w-0 rounded-[calc(var(--oc-radius,0.25rem)*2)] border border-solid border-[var(--oc-line,oklch(92.2%_0_none))] bg-[var(--oc-surface-sunk,oklch(97%_0_none))]',
  stacked:
    'box-border grid aspect-[4/3] min-w-0 rounded-[calc(var(--oc-radius,0.25rem)*2)] border border-solid border-[var(--oc-line,oklch(92.2%_0_none))] bg-[var(--oc-surface-sunk,oklch(97%_0_none))] md:aspect-video',
};
const PLACEHOLDER = 'box-border flex size-full min-w-0 flex-col items-center justify-center gap-4 p-6 text-center md:min-h-80';
const BUTTON = `m-0 box-border inline-flex min-h-10 max-w-full cursor-pointer appearance-none items-center justify-center rounded-[calc(var(--oc-radius,0.25rem)*1.5)] border-0 bg-[var(--oc-brand,oklch(20.5%_0_none))] px-4 py-2 text-center font-[family-name:var(--oc-font-body)] text-sm font-medium text-[var(--oc-on-brand,#fff)] hover:bg-[var(--oc-brand-hover,oklch(37.1%_0_none))] ${FOCUS}`;

function Pin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`block size-8 ${INK_MUTED}`}>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

/**
 * Where to find a business: the section's title and intro, the postal address, phone (a `tel:` link), email (a
 * `mailto:` link) and opening hours (a `dl`), and a map in one of two layouts (`layout`). Server component. The map
 * is embedded only through the `Gate` you pass (your consent gate): the frame is created in the client file
 * `map-frame.tsx` and rendered as the gate's child, with a placeholder as its fallback that offers the consent
 * settings (`data-consent-open`) and a plain link to the map. Without a `Gate` it never embeds and links out instead.
 * Colours, fonts and corner radius come from the design tokens.
 */
export function LocationSection({
  content,
  layout = 'split',
  Gate,
  category = 'media',
  labels,
  id,
  className,
}: LocationSectionProps) {
  const headingId = useId();
  const l = { ...LOCATION_LABELS, ...labels };
  const { title, intro, contact, hours, hoursNote, map } = content;
  const { address, phone, email } = contact;
  // split needs a map beside the details: without one the details stand alone, in one column
  const drawn: LocationLayout = map ? layout : 'stacked';

  let mapNode: ReactNode = null;
  if (map) {
    const embedSrc = Gate ? map.embedSrc : undefined;
    const placeholder = (
      <div data-map-placeholder className={PLACEHOLDER}>
        <Pin />
        {embedSrc ? (
          <>
            <p className={`m-0 max-w-sm ${INK_BODY}`}>{l.mapNotice}</p>
            <button type="button" data-consent-open className={BUTTON}>
              {l.showMap}
            </button>
          </>
        ) : null}
        <a href={map.href} rel="noopener noreferrer" className={LINK}>
          {l.openInMaps}
        </a>
      </div>
    );
    mapNode = (
      <div data-map className={MAP_BOX[drawn]}>
        {Gate && embedSrc ? (
          <Gate category={category} fallback={placeholder}>
            <MapFrame src={embedSrc} title={map.title} />
          </Gate>
        ) : (
          placeholder
        )}
      </div>
    );
  }

  const details = (
    <div data-details className="grid min-w-0 content-start gap-6">
      {address ? (
        <div className="min-w-0">
          <h3 className={LABEL}>{l.address}</h3>
          <address className="m-0 mt-1 not-italic">
            {address.street}
            <br />
            {`${address.postalCode} ${address.city}`}
            {address.country ? (
              <>
                <br />
                {address.country}
              </>
            ) : null}
          </address>
        </div>
      ) : null}
      {phone ? (
        <div className="min-w-0">
          <h3 className={LABEL}>{l.phone}</h3>
          <p className="m-0 mt-1">
            <a href={telHref(phone)} className={LINK}>
              {phone}
            </a>
          </p>
        </div>
      ) : null}
      {email ? (
        <div className="min-w-0">
          <h3 className={LABEL}>{l.email}</h3>
          <p className="m-0 mt-1">
            <a href={`mailto:${email}`} className={LINK}>
              {email}
            </a>
          </p>
        </div>
      ) : null}
      {hours?.length || hoursNote ? (
        // a container: each day sits beside its hours once this column (not the window) is 24rem wide, and the
        // list never spreads wider than 28rem, so a day stays near its hours in a wide column too
        <div className="@container min-w-0">
          <h3 className={LABEL}>{l.hours}</h3>
          {hours?.length ? (
            <dl className="m-0 mt-2 grid max-w-md grid-cols-1 gap-2">
              {hours.map((row, i) => (
                <div key={i} className="grid min-w-0 grid-cols-1 gap-x-6 @sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  <dt className="m-0 min-w-0 font-medium">{row.days}</dt>
                  <dd className={`m-0 min-w-0 ${INK_BODY}`}>{row.hours}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {hoursNote ? <p className={`m-0 mt-2 text-sm ${INK_MUTED}`}>{hoursNote}</p> : null}
        </div>
      ) : null}
    </div>
  );

  return (
    <section id={id} aria-labelledby={headingId} data-layout={drawn} className={className ? `${ROOT} ${className}` : ROOT}>
      <div className="mx-auto max-w-5xl wrap-break-word">
        <h2 id={headingId} className={`m-0 text-3xl font-semibold tracking-tight ${HEADING_FONT}`}>
          {title}
        </h2>
        {intro ? <p className={`m-0 mt-4 max-w-2xl text-lg ${INK_BODY}`}>{intro}</p> : null}
        <div className={BODY[drawn]}>
          {drawn === 'stacked' ? mapNode : null}
          {details}
          {drawn === 'split' ? mapNode : null}
        </div>
      </div>
    </section>
  );
}
