import { describe, test, expect } from 'vitest';
import { checkFormGuards } from '../backend/src/lib/formGuards';

const ok = { origin: 'https://daveenci.ai', body: { website: '' } };

describe('honeypot', () => {
  test('accepts a submission whose honeypot is empty', () => {
    expect(checkFormGuards(ok.origin, ok.body).ok).toBe(true);
  });

  test('rejects a submission whose honeypot was filled in', () => {
    const result = checkFormGuards(ok.origin, { website: 'http://spam.example' });
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('honeypot');
  });

  test('accepts a submission with no honeypot field at all', () => {
    // Older clients and the legacy /calendar form do not send it.
    expect(checkFormGuards(ok.origin, {}).ok).toBe(true);
  });

  test('accepts a whitespace-only honeypot', () => {
    // A password manager filling the hidden field must not cost a real
    // booking; a bot that trips this writes a real value, not spaces.
    expect(checkFormGuards(ok.origin, { website: '   ' }).ok).toBe(true);
  });
});

describe('origin', () => {
  test('accepts the apex domain', () => {
    expect(checkFormGuards('https://daveenci.ai', {}).ok).toBe(true);
  });

  test('accepts the www domain', () => {
    expect(checkFormGuards('https://www.daveenci.ai', {}).ok).toBe(true);
  });

  test('rejects another site posting to the form', () => {
    const result = checkFormGuards('https://evil.example', {});
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('origin');
  });

  test('rejects a lookalike domain that merely ends with the real one', () => {
    expect(checkFormGuards('https://notdaveenci.ai', {}).ok).toBe(false);
  });

  test('rejects plain http on the real domain', () => {
    expect(checkFormGuards('http://daveenci.ai', {}).ok).toBe(false);
  });

  test('allows a missing Origin header', () => {
    // Browsers omit Origin on same-origin GET-turned-POST in some clients,
    // and server-to-server callers send none; the honeypot still applies.
    expect(checkFormGuards(undefined, {}).ok).toBe(true);
  });

  test('allows localhost during development', () => {
    expect(checkFormGuards('http://localhost:5173', {}, { allowLocalhost: true }).ok).toBe(true);
    expect(checkFormGuards('http://localhost:5173', {}, { allowLocalhost: false }).ok).toBe(false);
  });
});
