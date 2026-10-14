import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const root = new URL('..', import.meta.url).pathname;
const read = (rel: string) => readFileSync(`${root}${rel}`, 'utf8');

describe('Tailwind 4 migration keeps the site looking as it did (14 Oct 2026)', () => {
  const css = read('frontend/src/index.css');

  it('brand colours are inlined, so --color-ink stays the RGB triple the rest of the CSS reads', () => {
    // A plain @theme would emit --color-ink: rgb(var(--color-ink)), a cycle that blanks every brand colour.
    expect(css).toContain('@theme inline {');
    expect(css).not.toMatch(/@theme\s*\{/);
    expect(css).toMatch(/--color-ink: 26 26 26;/);
    expect(css).not.toContain('@tailwind ');
  });

  it('buttons keep the pointer cursor Tailwind 3 gave them', () => {
    expect(css).toMatch(/button:not\(:disabled\),\s*\[role='button'\]:not\(:disabled\)\s*\{\s*cursor: pointer;/);
  });

  it('the guide body section sets its padding through the prop, not a second py-*', () => {
    const src = read('frontend/components/GuidePage.tsx');
    expect(src).toContain('<Section padding="py-4 md:py-6" className="bg-white/35">');
    expect(read('frontend/components/Shared.tsx')).toContain("padding = 'py-20 md:py-28'");
  });

  it('no Tailwind 3 config or autoprefixer is left behind', () => {
    const pkg = JSON.parse(read('frontend/package.json'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    expect(deps.tailwindcss).toMatch(/^\^4\./);
    expect(deps['@tailwindcss/postcss']).toBeTruthy();
    expect(deps.autoprefixer).toBeUndefined();
    expect(() => read('frontend/tailwind.config.js')).toThrow();
  });
});
