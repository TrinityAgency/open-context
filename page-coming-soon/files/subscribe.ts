/**
 * Adds an address to your list. REPLACE THIS before production: call your newsletter provider here (its API or SDK,
 * with its key from your own configuration). Until then it logs the address in development and refuses in
 * production, so no site silently drops its signups; the form then shows its "did not work" message.
 */
export async function subscribe(email: string): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('newsletter not configured: replace subscribe() in subscribe.ts');
  }
  console.info('newsletter signup (development, nothing was sent):', email);
}
