import { describe, test, expect, beforeEach } from 'vitest';
import {
  parseAttribution,
  rememberAttribution,
  readAttribution,
  defaultBookingHost,
} from '../frontend/lib/attribution';

class FakeStorage {
  private data = new Map<string, string>();
  getItem(k: string) { return this.data.has(k) ? this.data.get(k)! : null; }
  setItem(k: string, v: string) { this.data.set(k, v); }
  removeItem(k: string) { this.data.delete(k); }
}

let store: FakeStorage;
beforeEach(() => { store = new FakeStorage(); });

describe('reading attribution off the URL', () => {
  test('picks up the outreach token and source', () => {
    expect(parseAttribution('?t=aaaaaaaaaaaaaaaaaaaaaaaaaaaa&src=outreach'))
      .toEqual({ t: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', src: 'outreach' });
  });

  test('a visitor with no parameters counts as site traffic', () => {
    expect(parseAttribution('')).toEqual({ t: '', src: 'site' });
  });

  test('drops a token that is not token-shaped', () => {
    expect(parseAttribution('?t=<script>alert(1)</script>').t).toBe('');
  });

  test('drops an unknown source rather than passing it on', () => {
    expect(parseAttribution('?src=javascript:alert(1)').src).toBe('site');
  });
});

describe('carrying attribution from the module page to the booking page', () => {
  test('remembers what the visitor arrived with', () => {
    rememberAttribution('?t=aaaaaaaaaaaaaaaaaaaaaaaaaaaa&src=outreach', store as any);
    expect(readAttribution(store as any))
      .toEqual({ t: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', src: 'outreach' });
  });

  test('a later page with no parameters does not erase the token', () => {
    rememberAttribution('?t=aaaaaaaaaaaaaaaaaaaaaaaaaaaa&src=outreach', store as any);
    rememberAttribution('', store as any);
    expect(readAttribution(store as any).t).toBe('aaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  });

  test('a fresh token replaces an older one', () => {
    rememberAttribution('?t=aaaaaaaaaaaaaaaaaaaaaaaaaaaa', store as any);
    rememberAttribution('?t=bbbbbbbbbbbbbbbbbbbbbbbbbbbb', store as any);
    expect(readAttribution(store as any).t).toBe('bbbbbbbbbbbbbbbbbbbbbbbbbbbb');
  });

  test('an explicit source on a later page wins', () => {
    rememberAttribution('?src=outreach', store as any);
    rememberAttribution('?src=module', store as any);
    expect(readAttribution(store as any).src).toBe('module');
  });

  test('a visitor with nothing stored reads as site traffic', () => {
    expect(readAttribution(store as any)).toEqual({ t: '', src: 'site' });
  });

  test('storage being unavailable is not an error', () => {
    const broken = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
    expect(() => rememberAttribution('?src=outreach', broken as any)).not.toThrow();
    expect(readAttribution(broken as any)).toEqual({ t: '', src: 'site' });
  });
});

describe('/book chooser', () => {
  test('an outreach visitor goes straight to Anton', () => {
    expect(defaultBookingHost({ t: '', src: 'outreach' })).toBe('anton');
  });

  test('a visitor carrying a tracked-link token goes straight to Anton', () => {
    expect(defaultBookingHost({ t: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', src: 'site' })).toBe('anton');
  });

  test('a visitor from the module page goes straight to Anton', () => {
    expect(defaultBookingHost({ t: '', src: 'module' })).toBe('anton');
  });

  test('an ordinary site visitor is offered the choice', () => {
    expect(defaultBookingHost({ t: '', src: 'site' })).toBeNull();
  });
});
