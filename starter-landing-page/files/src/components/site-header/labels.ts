export type SiteHeaderLabels = {
  /** The skip link's text, shown when it receives focus. */
  skip: string;
  /** The navigation landmark's name. */
  nav: string;
  /** The mobile menu button's text. */
  menu: string;
  /** The name of the drawer's close button. */
  close: string;
};

export const SITE_HEADER_LABELS: SiteHeaderLabels = {
  skip: 'Skip to content',
  nav: 'Main',
  menu: 'Menu',
  close: 'Close menu',
};
