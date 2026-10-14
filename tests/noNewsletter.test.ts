import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const root = new URL('..', import.meta.url).pathname;
const read = (rel: string) => readFileSync(`${root}${rel}`, 'utf8');
const grep = (pattern: string, paths: string) =>
  execSync(`git grep -n -E "${pattern}" -- ${paths} || true`, { cwd: root, encoding: 'utf8' }).trim();

describe('No newsletter on the site (Anton, 14 Oct 2026)', () => {
  it('no page renders a subscribe form or calls a subscribe endpoint', () => {
    expect(existsSync(`${root}frontend/components/mobile/MobileSubscribe.tsx`)).toBe(false);
    expect(grep('MobileSubscribe|newsletter(Heading|Body|Source)|API_ENDPOINTS\\.newsletter|track\\(.newsletter_subscribe', 'frontend')).toBe('');
    expect(read('frontend/components/Footer.tsx')).not.toMatch(/<input|Subscribe/);
    expect(read('frontend/config.ts')).not.toContain('newsletter');
  });

  it('copy no longer promises a subscription', () => {
    expect(grep('[Ss]ubscribe at the bottom', 'frontend/components')).toBe('');
    expect(read('frontend/components/PrivacyPage.tsx')).not.toMatch(/[Nn]ewsletter/);
  });

  it('the backend has no subscribe route or newsletter store', () => {
    expect(existsSync(`${root}backend/src/services/newsletter.ts`)).toBe(false);
    expect(read('backend/src/routes.ts')).not.toContain("router.post('/newsletter");
  });
});
