export type SiteFooterLabels = {
  /** The contact block's heading. */
  contact: string;
  /** The name of the legal links' navigation landmark. */
  legal: string;
  /** The social links' heading. */
  social: string;
  /** The text of the button that reopens the cookie choice. */
  cookieSettings: string;
  /** Shown before the email address. */
  email: string;
  /** Shown before the phone number. */
  phone: string;
  /** The copyright line, from the site's name. */
  copyright: (name: string) => string;
};

export const SITE_FOOTER_LABELS: SiteFooterLabels = {
  contact: 'Contact',
  legal: 'Legal',
  social: 'Follow',
  cookieSettings: 'Cookie settings',
  email: 'Email',
  phone: 'Phone',
  copyright: (name) => `© ${name}`,
};
