// The newsletter's provider. Replace subscribe() with a call to yours (AGENTS.md, "The newsletter"); the form, its
// checks and its messages stay as they are (src/components/blog-newsletter-cta, src/app/newsletter-action.ts).

/**
 * Adds one address to the newsletter. As shipped it sends nothing anywhere: in development it logs the address, and
 * in production it refuses, so a live site never tells a visitor "subscribed" for an address that went nowhere (the
 * form then shows its "did not work" message).
 */
export async function subscribe(email: string): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('newsletter not configured: replace subscribe() in src/content/subscribe.ts');
  }
  console.info(`newsletter (development): would subscribe ${email}; replace subscribe() in src/content/subscribe.ts`);
}
