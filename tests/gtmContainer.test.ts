import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// The GTM container (docs/gtm/daveenci-ai-container.json, imported into GTM) must forward every event and
// every param the site defines in AnalyticsEventMap. Add an event or param in code without updating the
// container and this fails — otherwise GA4 would silently never see it.

const src = readFileSync('frontend/lib/analytics.ts', 'utf8');
const block = src.slice(src.indexOf('export interface AnalyticsEventMap'), src.indexOf('\n}\n', src.indexOf('export interface AnalyticsEventMap')));
const events = ['page_view', ...[...block.matchAll(/^\s+([a-z_]+): \{/gm)].map((m) => m[1])];
const params = new Set(['page_location', 'page_path', 'page_title']);
for (const m of block.matchAll(/^\s+[a-z_]+: \{([^}]*)\}/gm)) for (const p of m[1].matchAll(/([a-z_]+)\??:/g)) params.add(p[1]);

type Param = { key: string; value?: string; list?: { map: { key: string; value: string }[] }[] };
const c = JSON.parse(readFileSync('docs/gtm/daveenci-ai-container.json', 'utf8')).containerVersion;
const tag = (type: string) => c.tag.find((t: { type: string }) => t.type === type);
const param = (t: { parameter: Param[] }, key: string) => t.parameter.find((p) => p.key === key)!;
const rows = (p: Param) => Object.fromEntries(p.list!.map((r) => [r.map.find((m) => m.key === 'parameter')!.value, r.map.find((m) => m.key === 'parameterValue')!.value]));

describe('GTM container matches the analytics contract', () => {
  it('the trigger lets through exactly the events the site sends', () => {
    const regex = c.trigger[0].customEventFilter[0].parameter.find((p: Param) => p.key === 'arg1').value;
    expect(regex).toBe(`^(${events.join('|')})$`);
  });

  it('the GA4 event tag forwards every param, each from event_params', () => {
    const table = rows(param(tag('gaawe'), 'eventSettingsTable'));
    expect(new Set(Object.keys(table))).toEqual(params);
    for (const p of params) {
      expect(table[p]).toBe(`{{EP - ${p}}}`);
      const v = c.variable.find((x: { name: string }) => x.name === `EP - ${p}`);
      expect(param(v, 'name').value).toBe(`event_params.${p}`);
    }
  });

  it('the Google tag sends no automatic page_view (the router sends them) and carries the internal mark', () => {
    const g = tag('googtag');
    expect(param(g, 'tagId').value).toBe('G-EE3V1J8LHS');
    expect(rows(param(g, 'configSettingsTable'))).toEqual({ send_page_view: 'false', traffic_type: '{{DLV - traffic_type}}' });
  });

  it('both tags send to the same GA4 property', () => {
    expect(param(tag('gaawe'), 'measurementIdOverride').value).toBe(param(tag('googtag'), 'tagId').value);
  });
});

describe('ad pixels in the GTM container', () => {
  const byName = (n: string) => c.tag.find((t: { name: string }) => t.name === n);
  const trig = (id: string) => c.trigger.find((t: { triggerId: string }) => t.triggerId === id);
  const firesOn = (tagName: string) => trig(byName(tagName).firingTriggerId[0]);
  const eventOf = (t: { customEventFilter?: { parameter: Param[] }[] }) =>
    t.customEventFilter?.[0].parameter.find((p) => p.key === 'arg1')?.value;
  const excludesInternal = (t: { filter?: { type: string; parameter: Param[] }[] }) =>
    (t.filter ?? []).some((f) => f.type === 'EQUALS' && f.parameter.some((p) => p.key === 'negate' && p.value === 'true') && f.parameter.some((p) => p.value === '{{DLV - traffic_type}}') && f.parameter.some((p) => p.value === 'internal'));

  it('Meta pixel 654295051667780 is initialised once, without its own PageView (the router sends them)', () => {
    const html = param(byName('Meta - base (init)'), 'html').value!;
    expect(html).toContain("fbq('init', '654295051667780')");
    expect(html).not.toContain("'PageView'");
  });

  it('Meta PageView follows every routed page_view; Meta Lead follows every booked call', () => {
    expect(eventOf(firesOn('Meta - PageView'))).toBe('page_view');
    expect(eventOf(firesOn('Meta - Lead (booked call)'))).toBe('generate_lead');
    for (const n of ['Meta - PageView', 'Meta - Lead (booked call)']) expect(byName(n).setupTag[0].tagName).toBe('Meta - base (init)');
  });

  it('LinkedIn Insight tag 2605460 loads once per page load', () => {
    const li = byName('LinkedIn - Insight tag');
    expect(param(li, 'id').value).toBe('2605460');
    expect(li.tagFiringOption).toBe('ONCE_PER_LOAD');
  });

  it("no ad pixel fires for the team's own (internal) visits", () => {
    for (const n of ['Meta - base (init)', 'Meta - PageView', 'Meta - Lead (booked call)', 'LinkedIn - Insight tag']) {
      expect(excludesInternal(firesOn(n))).toBe(true);
    }
  });
});
