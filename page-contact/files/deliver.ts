import type { ContactMessage } from './contact-message';

/**
 * Sends a contact message on. REPLACE THIS before production: send an email, write to your database or call your
 * help desk here. Until then it logs the message in development and refuses in production, so no site silently
 * drops its messages.
 */
export async function deliver(message: ContactMessage): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('contact form not configured: replace deliver() in deliver.ts');
  }
  console.info('contact form (development, nothing was sent):', message);
}
