import { describe, expect, it } from 'vitest';
import { assertLegalTextReady, SAMPLE_URL } from './legal-guard';

describe('assertLegalTextReady', () => {
  it('lets the sample site render its placeholders', () => {
    expect(() => assertLegalTextReady('/imprint', true, SAMPLE_URL)).not.toThrow();
  });

  it('refuses a legal page with placeholders once the site has its own URL, naming the page and the URL', () => {
    expect(() => assertLegalTextReady('/imprint', true, 'https://samplework.test')).toThrow(/\/imprint.*https:\/\/samplework\.test/);
  });

  it('lets a finished legal page render on the site’s own URL', () => {
    expect(() => assertLegalTextReady('/privacy', false, 'https://samplework.test')).not.toThrow();
  });
});
