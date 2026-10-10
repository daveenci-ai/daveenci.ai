import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { platformTermsNote } from '../frontend/content/shootosModules';

const src = (p: string) => readFileSync(new URL(`../frontend/components/${p}`, import.meta.url), 'utf8');

describe('platform terms note (Anton, 10 Oct 2026)', () => {
  it('says we build software and give no legal advice, without discussing any platform terms', () => {
    expect(platformTermsNote).toMatch(/not a law firm/);
    expect(platformTermsNote).toMatch(/don't give legal advice/);
    expect(platformTermsNote).toMatch(/account and its terms stay yours/);
    expect(platformTermsNote).not.toMatch(/legal entity|scrap|automated means|terms of service/i);
  });

  it('is shown on /shootos (desktop and mobile) and in the module FAQ', () => {
    for (const f of ['AutoPilotPage.tsx', 'mobile/MobileAutoPilotPage.tsx', 'OrderIntakePage.tsx']) {
      expect(src(f)).toContain('platformTermsNote');
    }
    expect(src('OrderIntakePage.tsx')).toContain("q: 'Who owns the accounts it uses?'");
  });
});
