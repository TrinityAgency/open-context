export type NewsletterLabels = {
  /** The email field's label. */
  email: string;
  submit: string;
  /** The button while the form is being sent. */
  sending: string;
  /** With double opt-in at your provider, say "check your inbox" here instead. */
  subscribed: string;
  invalid: string;
  failed: string;
  /** The hidden spam-trap field's label (never seen by people). */
  honeypot: string;
  /** Before the privacy link, under the form. */
  notice: string;
};

export const NEWSLETTER_LABELS: NewsletterLabels = {
  email: 'Email address',
  submit: 'Subscribe',
  sending: 'Subscribing…',
  subscribed: 'Thank you. Your address has been received.',
  invalid: 'Please enter a valid email address.',
  failed: 'That did not work. Please try again later.',
  honeypot: 'Leave this field empty',
  notice: 'We use your address only to send this newsletter. You can unsubscribe at any time. More:',
};
