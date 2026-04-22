import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ChevronDown, Camera, Video, Box, Sparkles, Users, Building2, Home, TrendingUp } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Section, SectionHeader, ScrollReveal, PageHero, Button, Plate, VitruvianBackground, Widget, IconBadge, ProblemCallout } from './Shared';
import { useIsMobile } from './mobile/useIsMobile';
import { MobileShootOSPage } from './mobile/MobileShootOSPage';
import type { Page } from './types';

interface ShootOSPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const ShootOSPage: React.FC<ShootOSPageProps> = (props) => {
  const isMobile = useIsMobile();
  if (isMobile) return <MobileShootOSPage {...props} />;
  return <ShootOSPageDesktop {...props} />;
};

const ASSETS = [
  { icon: Camera, label: 'Stills', body: 'HDR merge, color correction, crop, branded watermarks — consistent across every listing.' },
  { icon: Video, label: 'Video', body: 'Walk-through cut, color grade, music, end-card — agent-ready in hours.' },
  { icon: Box, label: '3D tours', body: 'Stitch 360° capture into an interactive tour. Click-to-explore, embed-ready.' },
  { icon: Sparkles, label: 'Staging', body: 'AI virtual staging — empty room in, fully-staged scene out. No movers, no rental furniture.' },
];

const USE_CASES = [
  { icon: Home, title: 'Brokerages', body: 'Unify media production across your entire listing inventory. Consistent quality, one vendor.' },
  { icon: TrendingUp, title: 'High-volume teams', body: 'Turnaround measured in hours, not days. Your listings go live faster than competing inventory.' },
  { icon: Users, title: 'Photographers', body: 'Hand over capture, get listing-ready deliverables. Spend your time shooting, not editing.' },
  { icon: Building2, title: 'Property managers', body: 'Stand up media for every new unit on a predictable pipeline. Scale without scaling vendors.' },
];

const FAQ_ITEMS = [
  {
    q: 'How is this different from a photo editing service?',
    a: 'A traditional service is one specialist (retoucher, or editor, or 3D stitcher). ShootOS is a coordinated team of all of them, gated by a human approver, with a shared brand profile so every listing looks consistent across your inventory.',
  },
  {
    q: 'What capture equipment works with it?',
    a: "DSLRs, mirrorless, 360° cameras (Insta360, Matterport), smartphone footage for video. ShootOS accepts raw capture from any of them and routes each asset type to the right specialist.",
  },
  {
    q: 'Can I customize the output to match our brand?',
    a: "Yes. Set your watermark, color treatment, video end-card, and staging style once. ShootOS applies them across every listing. Consistency is the whole point.",
  },
  {
    q: 'How fast is turnaround?',
    a: "Typical listing package (20 stills + walk-through video + 3D tour + staged hero images) in 4-8 hours from capture. Compare to 2-5 days through traditional multi-vendor coordination.",
  },
  {
    q: 'What about review?',
    a: "The team drafts the package, then a human gate-reviews before it lands in your delivery system. You approve what your agents see — nothing auto-publishes.",
  },
  {
    q: 'Where does the product live?',
    a: "ShootOS has its own domain and dedicated site for the full pitch, sample outputs, and onboarding — shootos.ai. This page is a DaVeenci case study of the team behind it.",
  },
];

const ShootOSPageDesktop: React.FC<ShootOSPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    document.title = 'ShootOS — DaVeenci';
    window.scrollTo(0, 0);
    return () => {
      document.title = 'DaVeenci | AI & Automation Consultancy';
    };
  }, []);

  return (
    <div className="flex flex-col w-full overflow-x-hidden min-h-screen">
      <Header onNavigate={onNavigate} currentPage="shootos" />

      {/* Hero */}
      <Section className="pt-32 pb-20 md:pt-40 md:pb-28 min-h-[90vh] flex items-center">
        <VitruvianBackground className="opacity-[0.08]" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-6 relative z-20">
            <ScrollReveal delay={200}>
              <PageHero
                eyebrow={
                  <span className="inline-block mb-4 font-mono text-xs font-bold text-accent uppercase tracking-widest bg-accent/5 px-3 py-1 border border-accent/10 rounded-sm">
                    A DaVeenci team · Real estate media
                  </span>
                }
                title={<>One property in.<br /><span className="italic text-ink-muted/80">One listing-ready package out.</span></>}
                description="Stills, video, 3D tours, AI virtual staging. ShootOS is the specialist media team for volume real estate — every listing produced on a consistent pipeline, turnaround measured in hours."
                size="md"
                actions={
                  <>
                    <Button variant="primary" onClick={() => window.open('https://shootos.ai', '_blank')} className="text-base px-8 py-4">
                      <span className="flex items-center gap-2">Visit shootos.ai<ArrowUpRight className="w-4 h-4" /></span>
                    </Button>
                    <Button variant="secondary" onClick={() => onNavigate('calendar')} className="text-base px-8 py-4">Talk to us</Button>
                  </>
                }
              />
            </ScrollReveal>
          </div>

          <div className="lg:col-span-6 relative h-[400px] md:h-[480px] flex items-center justify-center">
            <ScrollReveal delay={500} direction="left" className="w-full flex justify-center">
              <Plate fig="i" title="Pipeline" variant="modern">
                <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 300 300" fill="none">
                  {/* Input: raw capture at top */}
                  <g transform="translate(150, 55)">
                    <rect x="-44" y="-18" width="88" height="36" rx="2" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.3" strokeDasharray="3 3" />
                    <text x="0" y="-2" textAnchor="middle" fontSize="9" fontFamily="serif" fontStyle="italic" fill="rgb(var(--color-ink-muted))" letterSpacing="0.1em">RAW CAPTURE</text>
                    <text x="0" y="10" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="rgb(var(--color-ink-muted))">stills · video · 360°</text>
                  </g>

                  {/* 4 specialist splits */}
                  {ASSETS.map((asset, i) => {
                    const x = 45 + i * 70;
                    const y = 160;
                    return (
                      <g key={asset.label}>
                        <line x1="150" y1="75" x2={x} y2={y - 22} stroke="rgb(var(--color-accent))" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />
                        <rect x={x - 22} y={y - 22} width="44" height="44" rx="2" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.2" />
                        <text x={x} y={y - 2} textAnchor="middle" fontSize="8" fontFamily="serif" fontStyle="italic" fill="rgb(var(--color-ink))">{asset.label}</text>
                        <text x={x} y={y + 10} textAnchor="middle" fontSize="6" fontFamily="monospace" fill="rgb(var(--color-ink-muted))">spec.{i + 1}</text>
                      </g>
                    );
                  })}

                  {/* Convergence: output package */}
                  {ASSETS.map((_, i) => {
                    const fromX = 45 + i * 70;
                    return <line key={i} x1={fromX} y1="185" x2="150" y2="230" stroke="rgb(var(--color-accent))" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />;
                  })}

                  <g transform="translate(150, 253)">
                    <rect x="-50" y="-16" width="100" height="32" rx="2" fill="rgb(var(--color-accent))" fillOpacity="0.12" stroke="rgb(var(--color-accent))" strokeWidth="1.5" />
                    <text x="0" y="-1" textAnchor="middle" fontSize="9" fontFamily="serif" fontStyle="italic" fill="rgb(var(--color-accent))" letterSpacing="0.12em">LISTING KIT</text>
                    <text x="0" y="10" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="rgb(var(--color-ink-muted))">agent-ready, branded</text>
                  </g>
                </svg>
              </Plate>
            </ScrollReveal>
          </div>
        </div>
      </Section>

      {/* Problem */}
      <Section className="py-12 md:py-16">
        <ScrollReveal>
          <ProblemCallout className="max-w-4xl mx-auto">
            <h3 className="font-serif text-xl text-ink mb-2">The problem</h3>
            <p className="font-sans text-ink-muted leading-relaxed">
              Real estate teams need listing-ready media — stills, video, 3D tours, staging — fast and at volume. Traditional production is a human-intensive multi-vendor coordination problem. The outcome: slow turnaround, inconsistent quality, and costs that don't scale with listing velocity.
            </p>
          </ProblemCallout>
        </ScrollReveal>
      </Section>

      {/* Asset specialists */}
      <Section id="assets" className="bg-alt/30 py-20">
        <SectionHeader eyebrow="Specialists" title="Four asset types. Four specialists. One pipeline." subtitle="Each capture routes to the specialist that handles it best. Every output lands in the same branded package." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {ASSETS.map((asset, i) => {
            const Icon = asset.icon;
            return (
              <ScrollReveal key={asset.label} delay={i * 100}>
                <Widget interactive className="h-full p-6 flex flex-col">
                  <IconBadge className="mb-4"><Icon className="w-5 h-5 text-accent" /></IconBadge>
                  <h3 className="font-serif text-xl text-ink mb-2">{asset.label}</h3>
                  <p className="font-sans text-sm text-ink-muted leading-relaxed">{asset.body}</p>
                </Widget>
              </ScrollReveal>
            );
          })}
        </div>
      </Section>

      {/* What it ships */}
      <Section className="py-20">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <SectionHeader eyebrow="Deliverable" title="What it ships." subtitle="A complete listing media package — agent-ready, branded, and consistent across your entire inventory." />
            <div className="text-center">
              <Button variant="primary" onClick={() => window.open('https://shootos.ai', '_blank')} className="px-8 py-4">
                <span className="flex items-center gap-2">See sample outputs at shootos.ai<ArrowUpRight className="w-4 h-4" /></span>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      {/* Use cases */}
      <Section id="use-cases" className="bg-alt/30 py-20">
        <SectionHeader eyebrow="Use Cases" title="Who ShootOS is for." subtitle="Teams that produce real estate media at volume and need consistency over one-off craft." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {USE_CASES.map((uc, i) => {
            const Icon = uc.icon;
            return (
              <ScrollReveal key={uc.title} delay={i * 100}>
                <Widget interactive className="h-full p-6">
                  <IconBadge className="mb-4"><Icon className="w-5 h-5 text-accent" /></IconBadge>
                  <h3 className="font-serif text-xl text-ink mb-2">{uc.title}</h3>
                  <p className="font-sans text-sm text-ink-muted leading-relaxed">{uc.body}</p>
                </Widget>
              </ScrollReveal>
            );
          })}
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="py-20">
        <SectionHeader eyebrow="FAQ" title="Common questions." />
        <ScrollReveal>
          <div className="max-w-3xl mx-auto bg-white shadow-xl border border-ink/10 rounded-lg px-8">
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </ScrollReveal>
      </Section>

      {/* Final CTA */}
      <Section className="py-16 md:py-24" pattern="circles">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6">
              Want a team like this for your domain?
            </h2>
            <p className="font-sans text-lg text-ink-muted leading-relaxed mb-8">
              ShootOS is one example of a DaVeenci team. We design specialist teams for industries where the workflow is complex, multi-stage, and the output needs to be production-ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" onClick={() => onNavigate('calendar')} className="text-base px-8 py-4">
                Talk to us
              </Button>
              <Button variant="secondary" onClick={() => onNavigate('work')} className="text-base px-8 py-4">
                See all work
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ink/10 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left group">
        <span className="font-serif text-lg text-ink group-hover:text-accent transition-colors pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 text-ink-muted flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <p className="text-ink-muted leading-relaxed pb-5 animate-in fade-in slide-in-from-top-1 duration-200">{a}</p>
      )}
    </div>
  );
};

export default ShootOSPage;
