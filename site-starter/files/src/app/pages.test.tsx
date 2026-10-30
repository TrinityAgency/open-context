import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { HOME, NAV, NOT_FOUND } from '@/content/site';
import NotFound from './not-found';
import Home, { metadata } from './page';

afterEach(cleanup);

describe('home page', () => {
  it('names itself for search and tab', () => {
    expect(metadata.title).toBe(HOME.metaTitle);
    expect(metadata.description).toBe(HOME.lead);
  });

  it('has one h1, the title from site.ts', () => {
    render(<Home />);
    const h1 = screen.getAllByRole('heading', { level: 1 });
    expect(h1).toHaveLength(1);
    expect(h1[0]?.textContent).toBe(HOME.title);
  });

  it('has a section for every NAV entry that points into it', () => {
    const { container } = render(<Home />);
    const ids = NAV.filter((item) => item.href.startsWith('/#')).map((item) => item.href.slice(2));
    expect(ids.filter((id) => !container.querySelector(`#${id}`))).toEqual([]);
  });
});

describe('not-found page', () => {
  it('has one h1, the title from site.ts, and links every NAV entry', () => {
    render(<NotFound />);
    const h1 = screen.getAllByRole('heading', { level: 1 });
    expect(h1).toHaveLength(1);
    expect(h1[0]?.textContent).toBe(NOT_FOUND.title);
    for (const item of NAV) expect(screen.getByRole('link', { name: item.label })).toHaveAttribute('href', item.href);
  });
});
