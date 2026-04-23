import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Home, TrendingUp, Users, Building2, Plus, Minus } from 'lucide-react';
import { MobileShell } from './MobileShell';
import { MobileButton } from './MobileButton';
import { Widget } from '../Shared';
import {
  ShootOSHeroDiagram,
  AssetSpecialistPanel,
  BrandProfilePanel,
  TurnaroundComparison,
  ShootOSSimulator,
} from '../ShootOSPage';
import { BookingWidget } from '../BookingWidget';
import AntonSketch from '../../images/Anton_Sketch.webp';
import type { Page } from '../types';

interface MobileShootOSPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const USE_CASES = [
  { icon: Home, title: 'Brokerages', body: 'Unify media production across your entire listing inventory. Consistent quality, one vendor.' },
  { icon: TrendingUp, title: 'High-volume teams', body: 'Turnaround in hours, not days. Listings go live faster than competing inventory.' },
  { icon: Users, title: 'Photographers', body: 'Hand over capture, get listing-ready deliverables. Spend time shooting, not editing.' },
  { icon: Building2, title: 'Property managers', body: 'Stand up media for every new unit on a predictable pipeline. Scale without scaling vendors.' },
];

const FAQS = [
  { q: 'How is this different from a photo editing service?', a: 'A traditional service is one specialist (retoucher, editor, or 3D stitcher). ShootOS is a coordinated team of all of them, gated by a human approver, with a shared brand profile so every listing looks consistent.' },
  { q: 'What capture equipment works with it?', a: "DSLRs, mirrorless, 360° cameras (Insta360, Matterport), smartphone footage. ShootOS accepts raw capture and routes each asset type to the right specialist." },
  { q: 'Can I customize output to match our brand?', a: "Yes. Set your watermark, color treatment, video end-card, and staging style once. ShootOS applies them across every listing. Consistency is the whole point." },
  { q: 'How fast is turnaround?', a: "Typical listing package (20 stills + walk-through video + 3D tour + staged hero images) in 4-8 hours from capture — vs 2-5 days through traditional multi-vendor coordination." },
  { q: 'What about review?', a: "The team drafts the package, then a human gate-reviews before it lands in your delivery system. You approve what agents see — nothing auto-publishes." },
  { q: 'Where does the product live?', a: "ShootOS has its own domain at shootos.ai with the full pitch, sample outputs, and onboarding. This page is a case study of the team behind it." },
];

const FeatureRow: React.FC<{
  heading: string;
  body: string;
  bullets: string[];
  children: React.ReactNode;
}> = ({ heading, body, bullets, children }) => (
  <div className="space-y-5">
    <div>
      <h3 className="font-serif text-[1.75rem] leading-[1.15] text-ink mb-3 tracking-tight">{heading}</h3>
      <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-4">{body}</p>
      <ul className="space-y-2.5">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2.5 text-ink-muted">
            <div className="w-1 h-1 rounded-full bg-accent mt-2 flex-shrink-0" />
            <span className="font-sans text-[14px] leading-relaxed">{b}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="flex justify-center">{children}</div>
  </div>
);

const SectionEyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-3 mb-4">
    <span className="h-px w-8 bg-ink-muted/30" />
    <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">{children}</span>
  </div>
);

export const MobileShootOSPage: React.FC<MobileShootOSPageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'ShootOS — DaVeenci';
    window.scrollTo(0, 0);
    return () => {
      document.title = 'DaVeenci | AI & Automation Consultancy';
    };
  }, []);

  return (
    <MobileShell onNavigate={onNavigate}>
      {/* Hero */}
      <section className="px-6 pt-10 pb-10">
        <div className="inline-block mb-5 font-mono text-[10px] tracking-[0.25em] uppercase text-accent bg-accent/5 border border-accent/10 rounded-sm px-2.5 py-1">
          A DaVeenci team · Real estate media
        </div>
        <h1 className="font-serif text-[2.5rem] leading-[1.05] text-ink mb-5 tracking-tight">
          One property in.
          <br />
          <span className="italic text-ink-muted/70">One listing-ready package out.</span>
        </h1>
        <p className="font-serif text-[16px] text-ink-muted leading-[1.6] mb-6">
          Stills, video, 3D tours, AI virtual staging. ShootOS is the specialist media team for volume real estate — every listing produced on a consistent pipeline, turnaround measured in hours.
        </p>
        <div className="flex flex-col gap-3 mb-8">
          <MobileButton onClick={() => window.open('https://shootos.ai', '_blank')}>
            <span className="inline-flex items-center justify-center gap-2">
              Visit shootos.ai
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </MobileButton>
          <MobileButton variant="secondary" onClick={() => onNavigate('calendar')}>Talk to us</MobileButton>
        </div>

        <div className="flex justify-center">
          <ShootOSHeroDiagram />
        </div>
      </section>

      {/* The Product */}
      <section className="px-6 py-10 bg-white/40">
        <SectionEyebrow>The Product</SectionEyebrow>
        <h2 className="font-serif text-[1.9rem] leading-[1.1] text-ink mb-8 tracking-tight">
          Four asset types. <br />
          <span className="italic text-ink-muted/70">Four specialists.</span>
        </h2>

        <div className="space-y-14">
          <FeatureRow
            heading="Specialists, not a generalist editor"
            body="Each asset type gets its own specialist, running in parallel on the same capture, converging into one on-brand kit."
            bullets={[
              'Stills · HDR merge, color correct, watermark',
              'Video · cut, color grade, music, end-card',
              '3D · stitch 360° capture + floor-plan overlay',
              'Staging · AI virtual staging of empty rooms',
            ]}
          >
            <AssetSpecialistPanel />
          </FeatureRow>

          <FeatureRow
            heading="Every listing on-brand, every time"
            body="Set your palette, watermark, video end-card, and staging style once. ShootOS applies them consistently across every listing."
            bullets={[
              'Brand profile: colors, fonts, watermark',
              'Every deliverable stamped automatically',
              'Consistency across stills, video, 3D, staging',
            ]}
          >
            <BrandProfilePanel />
          </FeatureRow>

          <FeatureRow
            heading="Hours, not days"
            body="Traditional production is serial — one specialist waits for another. ShootOS runs specialists in parallel, typically ~12× faster."
            bullets={[
              'Stills + video + 3D + staging in parallel',
              'Typical listing kit: 4–8 hours from capture',
              'Single QA pass across all asset types',
            ]}
          >
            <TurnaroundComparison />
          </FeatureRow>
        </div>
      </section>

      {/* Try It */}
      <section id="try-it" className="px-6 py-10">
        <SectionEyebrow>Try It</SectionEyebrow>
        <h2 className="font-serif text-[1.9rem] leading-[1.1] text-ink mb-3 tracking-tight">
          Pick a property. <span className="italic text-ink-muted/70">Watch the kit assemble.</span>
        </h2>
        <p className="font-serif text-[15px] text-ink-muted leading-relaxed mb-6">
          Every property walks the same pipeline — capture, parallel specialists, QA gate, delivery.
        </p>
        <ShootOSSimulator />
      </section>

      {/* Use Cases */}
      <section className="px-6 py-10 bg-white/40">
        <SectionEyebrow>Use Cases</SectionEyebrow>
        <h2 className="font-serif text-[1.9rem] leading-[1.1] text-ink mb-6 tracking-tight">
          Who ShootOS is <span className="italic text-ink-muted/70">for.</span>
        </h2>
        <div className="space-y-4">
          {USE_CASES.map((uc) => {
            const Icon = uc.icon;
            return (
              <div key={uc.title} className="bg-white border border-ink/10 p-5 shadow-sm hover:shadow-lg transition-all rounded-lg text-center flex flex-col items-center">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full bg-pulse-surface border border-ink/10 overflow-hidden flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 176 176" fill="none">
                    <circle cx="88" cy="88" r="78" stroke="rgb(var(--color-ink))" strokeWidth="0.6" opacity="0.08" />
                    <circle cx="88" cy="88" r="60" stroke="rgb(var(--color-ink))" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.12" />
                    <circle cx="88" cy="88" r="42" stroke="rgb(var(--color-accent))" strokeWidth="0.8" opacity="0.15" />
                  </svg>
                  <Icon className="relative w-10 h-10 text-accent/80" strokeWidth={1.3} />
                </div>
                <h3 className="font-serif text-lg text-ink mb-2">{uc.title}</h3>
                <p className="font-sans text-[14px] text-ink-muted leading-relaxed">{uc.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-10">
        <SectionEyebrow>FAQ</SectionEyebrow>
        <h2 className="font-serif text-[1.9rem] leading-[1.1] text-ink mb-6 tracking-tight">
          Common <span className="italic text-ink-muted/70">questions.</span>
        </h2>
        <Widget as="ol" className="px-5">
          {FAQS.map((item, i) => {
            const isOpen = openFaq === i;
            return (
              <li key={i} className="border-b border-ink/10 last:border-0">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-baseline gap-3 py-4 text-left active:opacity-60 transition-opacity"
                  aria-expanded={isOpen}
                >
                  <span className="flex-1 font-serif text-base text-ink leading-snug">{item.q}</span>
                  <span className="flex-shrink-0 pt-1 text-ink-muted/60">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-4 pr-8 -mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <p className="font-sans text-[14px] text-ink-muted leading-relaxed">{item.a}</p>
                  </div>
                )}
              </li>
            );
          })}
        </Widget>
      </section>

      {/* Book a ShootOS intro */}
      <BookingWidget
        onNavigate={onNavigate}
        eyebrow="ShootOS Intro"
        title="Book a ShootOS intro"
        subtitle="Walk us through your listing volume, brand standards, and current turnaround."
        leftBody="We'll look at your current capture-to-listing flow, where vendor coordination costs you time, and what your brand consistency actually looks like across agents today — then scope a ShootOS engagement."
        bookingType="demo-shootos"
        hostName="Anton Osipov"
        hostRole="Founder"
        hostImage={AntonSketch}
      />
    </MobileShell>
  );
};
