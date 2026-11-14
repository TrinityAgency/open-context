import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = join(__dirname, '..');
const generated = join(root, 'design') + sep;

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

// A colour is written once, in the design tokens (src/design/, generated); site code only names tokens.
const COLOUR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|color-mix)\(/;

describe('colour', () => {
  it('is not hard-coded in site code', () => {
    const offenders = files(root)
      .filter((f) => /\.(tsx?|css)$/.test(f) && !f.startsWith(generated) && !/\.test\.tsx?$/.test(f))
      .filter((f) => COLOUR.test(readFileSync(f, 'utf8')))
      .map((f) => relative(root, f));
    expect(offenders).toEqual([]);
  });
});
