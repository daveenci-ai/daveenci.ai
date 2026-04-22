import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, Camera, Video, Box, Sparkles, Users, Building2, Home, TrendingUp, Check, Image as ImageIcon, Film, Layers } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Section, SectionHeader, ScrollReveal, PageHero, Button, VitruvianBackground, Widget, IconBadge, ProductFrame } from './Shared';
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

// ─── Animated Hero Diagram (capture → specialists → package) ──────────────

const RAW_CAPTURES = [
  { kind: 'stills', label: 'IMG_8432.cr3', Icon: Camera },
  { kind: 'video', label: 'walkthrough.mp4', Icon: Video },
  { kind: '3d', label: 'tour.insv', Icon: Box },
  { kind: 'empty', label: 'empty-liv.jpg', Icon: ImageIcon },
];

const SHOOT_SPECIALISTS = [
  { key: 'stills', label: 'Stills', Icon: Camera, output: '24 branded stills' },
  { key: 'video', label: 'Video', Icon: Film, output: '90s walkthrough' },
  { key: '3d', label: '3D', Icon: Box, output: 'embeddable tour' },
  { key: 'staging', label: 'Staging', Icon: Sparkles, output: '6 staged heros' },
];

type ShootHeroPhase = 'capture' | 'process' | 'deliver';

const ShootOSHeroDiagram: React.FC = () => {
  const [phase, setPhase] = useState<ShootHeroPhase>('capture');
  const [capturesIn, setCapturesIn] = useState(0);
  const [activeSpec, setActiveSpec] = useState(-1);
  const [gateStamped, setGateStamped] = useState(false);
  const [cycle, setCycle] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const clear = () => { timerRef.current.forEach(clearTimeout); timerRef.current = []; };
    const add = (fn: () => void, ms: number) => { timerRef.current.push(setTimeout(fn, ms)); };

    clear();
    setPhase('capture');
    setCapturesIn(0);
    setActiveSpec(-1);
    setGateStamped(false);

    // Phase 1 — Capture lands (2.4s)
    RAW_CAPTURES.forEach((_, i) => add(() => setCapturesIn(i + 1), 400 + i * 400));

    // Phase 2 — Specialists work (4s)
    add(() => setPhase('process'), 2400);
    SHOOT_SPECIALISTS.forEach((_, i) => add(() => setActiveSpec(i), 2600 + i * 700));

    // Phase 3 — Deliver (3s)
    add(() => setPhase('deliver'), 2400 + 4200);
    add(() => setGateStamped(true), 2400 + 4200 + 900);

    add(() => setCycle(c => c + 1), 2400 + 4200 + 3200);

    return clear;
  }, [cycle]);

  return (
    <ProductFrame>
      {/* Chrome header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
            <Camera className="w-4 h-4 text-accent" />
          </div>
          <div>
            <div className="font-serif text-sm font-medium text-ink">Listing Pipeline</div>
            <div className="font-mono text-[10px] text-ink/40">shootos · 1247 Maple St</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${phase === 'deliver' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
          <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-ink/50">{phase === 'deliver' ? 'ready' : 'processing'}</span>
        </div>
      </div>

      {/* Phase body */}
      <div className="relative flex-1 min-h-[300px]">
        {/* Capture */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${phase === 'capture' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">Raw capture uploading</div>
          <div className="space-y-1.5">
            {RAW_CAPTURES.map((cap, i) => (
              <div
                key={cap.label}
                className={`flex items-center gap-2 bg-white border border-ink/10 rounded-lg px-3 py-2 transition-all duration-300 ${i < capturesIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
              >
                <cap.Icon className="w-3.5 h-3.5 text-ink/50 flex-shrink-0" />
                <span className="font-mono text-[11px] text-ink/70 truncate flex-1">{cap.label}</span>
                <Check className="w-3 h-3 text-green-600" strokeWidth={3} />
              </div>
            ))}
          </div>
        </div>

        {/* Process */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${phase === 'process' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">Specialists working</div>
          <div className="grid grid-cols-2 gap-2">
            {SHOOT_SPECIALISTS.map((s, i) => {
              const isActive = activeSpec >= i;
              const isCurrent = activeSpec === i;
              return (
                <div
                  key={s.key}
                  className={`rounded-lg border p-2.5 transition-all duration-300 ${isActive ? 'bg-accent/5 border-accent/30' : 'bg-white border-ink/10 opacity-40'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <s.Icon className={`w-3.5 h-3.5 ${isActive ? 'text-accent' : 'text-ink/30'}`} />
                    <span className="font-mono text-[10px] text-ink/70 uppercase tracking-wider">{s.label}</span>
                    {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse ml-auto" />}
                  </div>
                  <div className="font-sans text-[10px] text-ink-muted/70">{s.output}</div>
                  {isActive && (
                    <div className="mt-1.5 h-0.5 rounded-full bg-ink/5 overflow-hidden">
                      <div className="h-full bg-accent/70" style={{ width: isCurrent ? '70%' : '100%', transition: 'width 0.4s ease' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Deliver */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${phase === 'deliver' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">Listing kit delivered</div>
          <div className="bg-white border border-ink/10 rounded-lg p-3 shadow-sm mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-3.5 h-3.5 text-accent" />
              <span className="font-mono text-[10px] text-ink/50">KIT-1247</span>
              <span className="font-serif text-sm text-ink flex-1 truncate">1247 Maple St · Single family</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-ink/60">
              <div className="flex items-center gap-1.5"><Camera className="w-2.5 h-2.5 text-accent/70" /> 24 stills</div>
              <div className="flex items-center gap-1.5"><Film className="w-2.5 h-2.5 text-accent/70" /> 90s video</div>
              <div className="flex items-center gap-1.5"><Box className="w-2.5 h-2.5 text-accent/70" /> 3D tour</div>
              <div className="flex items-center gap-1.5"><Sparkles className="w-2.5 h-2.5 text-accent/70" /> 6 staged</div>
            </div>
          </div>

          <div className={`flex items-center gap-2 bg-white border rounded-lg px-3 py-2 transition-all duration-500 ${gateStamped ? 'opacity-100 translate-y-0 border-green-400/50 bg-green-50/60' : 'opacity-0 translate-y-2 border-ink/10'}`}>
            <div className="w-5 h-5 rounded-full bg-green-500/15 border border-green-500/40 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-green-600" strokeWidth={3} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[9px] uppercase tracking-wider text-green-700">Gate · QA approved</div>
              <div className="font-serif text-xs text-ink/70">Brand consistent · ready for agents</div>
            </div>
            <span className="font-mono text-[9px] text-ink/40">4h 12m</span>
          </div>
        </div>
      </div>
    </ProductFrame>
  );
};

// ─── Asset Specialists Roster (Row 1 widget) ───────────────────────────────

const SPECIALIST_TASKS: Record<string, string[]> = {
  stills: ['HDR merge', 'Color correct', 'Crop + straighten', 'Watermark'],
  video: ['Cut walkthrough', 'Color grade', 'Music bed', 'Branded end-card'],
  '3d': ['Stitch 360°', 'Navigation points', 'Floor-plan overlay', 'Embed snippet'],
  staging: ['Detect empty room', 'Generate style', 'Place furniture', 'Render hero'],
};

const AssetSpecialistPanel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveIndex(i => (i + 1) % SHOOT_SPECIALISTS.length), 1800);
    return () => clearInterval(id);
  }, []);

  const active = SHOOT_SPECIALISTS[activeIndex];
  const tasks = SPECIALIST_TASKS[active.key];

  return (
    <ProductFrame height={480}>
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted/60">Asset Specialists · 4</div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[10px] text-accent/80">{active.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {SHOOT_SPECIALISTS.map((s, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={s.key}
              className={`rounded-lg border p-3 transition-all duration-500 ${isActive ? 'bg-accent/5 border-accent/40 shadow-sm' : 'bg-white border-ink/10'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-accent/15 border border-accent/40' : 'bg-ink/5 border border-ink/10'}`}>
                  <s.Icon className={`w-3.5 h-3.5 ${isActive ? 'text-accent' : 'text-ink-muted/60'}`} />
                </div>
                <span className={`font-serif text-sm transition-colors ${isActive ? 'text-ink font-semibold' : 'text-ink-muted/70'}`}>{s.label}</span>
              </div>
              <div className="font-sans text-[11px] text-ink-muted/70">{s.output}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-ink/10 rounded-lg p-3 flex-1">
        <div className="flex items-center gap-2 mb-2">
          <active.Icon className="w-3.5 h-3.5 text-accent" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-accent/80">{active.label} · current task</span>
        </div>
        <div className="space-y-1.5">
          {tasks.map((task, i) => (
            <div key={task} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full border flex items-center justify-center flex-shrink-0 ${i <= activeIndex ? 'bg-green-500/15 border-green-500/40' : 'border-ink/15'}`}>
                {i <= activeIndex && <Check className="w-2 h-2 text-green-600" strokeWidth={3} />}
              </div>
              <span className="font-mono text-[10px] text-ink/60">{task}</span>
            </div>
          ))}
        </div>
      </div>
    </ProductFrame>
  );
};

// ─── Brand Profile Panel (Row 2 widget) ────────────────────────────────────

const BRAND_SWATCHES = ['#1A3D54', '#C8A87D', '#F5EDE0', '#1A1A1A'];
const LISTINGS = ['12 Maple Ln', '4815 Hayward Pl', '902 Crestview Dr'];

const BrandProfilePanel: React.FC = () => {
  const [swatchCount, setSwatchCount] = useState(0);
  const [logoIn, setLogoIn] = useState(false);
  const [stamped, setStamped] = useState<number[]>([]);
  const [cycle, setCycle] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const clear = () => { timerRef.current.forEach(clearTimeout); timerRef.current = []; };
    const add = (fn: () => void, ms: number) => { timerRef.current.push(setTimeout(fn, ms)); };

    clear();
    setSwatchCount(0);
    setLogoIn(false);
    setStamped([]);

    BRAND_SWATCHES.forEach((_, i) => add(() => setSwatchCount(i + 1), 400 + i * 250));
    add(() => setLogoIn(true), 400 + BRAND_SWATCHES.length * 250 + 200);
    LISTINGS.forEach((_, i) => add(() => setStamped(prev => [...prev, i]), 400 + BRAND_SWATCHES.length * 250 + 800 + i * 450));

    add(() => setCycle(c => c + 1), 400 + BRAND_SWATCHES.length * 250 + 800 + LISTINGS.length * 450 + 2400);

    return clear;
  }, [cycle]);

  return (
    <ProductFrame height={480}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-serif text-sm text-ink">Meridian Realty · brand profile</div>
          <div className="font-mono text-[10px] text-ink/40">set once · applied to every deliverable</div>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-accent/80">v3</span>
      </div>

      {/* Palette */}
      <div className="bg-white border border-ink/10 rounded-lg p-3 mb-3">
        <div className="font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">Palette</div>
        <div className="flex gap-2">
          {BRAND_SWATCHES.map((hex, i) => (
            <div key={hex} className={`flex-1 transition-all duration-300 ${i < swatchCount ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <div className="w-full h-10 rounded-md border border-ink/10" style={{ backgroundColor: hex }} />
              <div className="font-mono text-[9px] text-ink-muted/60 mt-1 text-center">{hex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Logo / watermark */}
      <div className={`bg-white border border-ink/10 rounded-lg p-3 mb-3 transition-all duration-500 ${logoIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <div className="font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">Watermark</div>
        <div className="flex items-center justify-between h-12 rounded-md bg-[#1A3D54] px-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border border-[#C8A87D]" style={{ borderWidth: 1.5 }} />
            <span className="font-serif text-white text-sm tracking-wider">MERIDIAN</span>
          </div>
          <span className="font-mono text-[9px] text-white/60 uppercase tracking-widest">realty</span>
        </div>
      </div>

      {/* Applied to listings */}
      <div className="bg-white border border-ink/10 rounded-lg p-3 flex-1">
        <div className="flex items-center justify-between mb-2">
          <div className="font-mono text-[9px] uppercase tracking-widest text-ink/40">Applied to listings</div>
          <span className="font-mono text-[9px] text-accent/80">{stamped.length}/{LISTINGS.length} stamped</span>
        </div>
        <div className="space-y-1.5">
          {LISTINGS.map((addr, i) => {
            const done = stamped.includes(i);
            return (
              <div
                key={addr}
                className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 transition-all duration-300 ${done ? 'bg-accent/5 border-accent/30' : 'bg-white border-ink/10'}`}
              >
                <Home className="w-3 h-3 text-ink/40 flex-shrink-0" />
                <span className="font-mono text-[11px] text-ink/70 truncate flex-1">{addr}</span>
                {done && (
                  <span className="font-mono text-[9px] text-accent bg-accent/10 border border-accent/20 rounded px-1.5 py-0.5">
                    ✓ Branded
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </ProductFrame>
  );
};

// ─── Turnaround Comparison (Row 3 widget) ──────────────────────────────────

const TurnaroundComparison: React.FC = () => {
  const [traditionalProgress, setTraditionalProgress] = useState(0);
  const [shootosProgress, setShootosProgress] = useState(0);
  const [showMetric, setShowMetric] = useState(false);
  const [cycle, setCycle] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const clear = () => { timerRef.current.forEach(clearTimeout); timerRef.current = []; };
    const add = (fn: () => void, ms: number) => { timerRef.current.push(setTimeout(fn, ms)); };

    clear();
    setTraditionalProgress(0);
    setShootosProgress(0);
    setShowMetric(false);

    // Traditional fills slowly, ShootOS fills fast in parallel
    add(() => setShootosProgress(100), 400);
    add(() => setTraditionalProgress(25), 800);
    add(() => setTraditionalProgress(50), 1400);
    add(() => setTraditionalProgress(75), 2000);
    add(() => setTraditionalProgress(100), 2600);
    add(() => setShowMetric(true), 3000);
    add(() => setCycle(c => c + 1), 6000);

    return clear;
  }, [cycle]);

  return (
    <ProductFrame height={480}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-serif text-sm text-ink">Turnaround · 1247 Maple St</div>
          <div className="font-mono text-[10px] text-ink/40">same capture · two pipelines</div>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted/50">benchmark</span>
      </div>

      {/* Traditional timeline */}
      <div className="bg-white border border-ink/10 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted/60">Traditional · multi-vendor</span>
          <span className="font-mono text-[10px] text-ink-muted/50">2–5 days</span>
        </div>
        <div className="grid grid-cols-5 gap-1 mb-2">
          {['Shoot', 'Retouch', 'Video edit', 'Stitch 3D', 'QA + deliver'].map((stage, i) => {
            const reached = traditionalProgress >= (i + 1) * 20;
            return (
              <div key={stage} className={`h-2 rounded-sm transition-all duration-500 ${reached ? 'bg-ink/30' : 'bg-ink/5'}`} />
            );
          })}
        </div>
        <div className="grid grid-cols-5 gap-1 font-mono text-[9px] text-ink-muted/60">
          {['Shoot', 'Retouch', 'Video', '3D', 'QA'].map(s => (
            <span key={s} className="truncate">{s}</span>
          ))}
        </div>
      </div>

      {/* ShootOS timeline */}
      <div className="bg-white border border-accent/20 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent">ShootOS · parallel team</span>
          <span className="font-mono text-[10px] text-accent/70">4–8 hours</span>
        </div>
        <div className="relative h-2 rounded-full bg-ink/5 overflow-hidden mb-2">
          <div className="absolute inset-y-0 left-0 bg-accent transition-all duration-1000 ease-out rounded-full" style={{ width: `${shootosProgress}%` }} />
        </div>
        <div className="grid grid-cols-4 gap-1 font-mono text-[9px] text-accent/70">
          <span className="truncate">Shoot</span>
          <span className="truncate">Specialists</span>
          <span className="truncate">QA</span>
          <span className="truncate">Deliver</span>
        </div>
      </div>

      {/* Metric */}
      <div className={`mt-auto bg-accent/5 border border-accent/20 rounded-lg p-4 text-center transition-all duration-500 ${showMetric ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <div className="flex items-baseline justify-center gap-3">
          <span className="font-serif text-3xl text-ink-muted/40 line-through decoration-red-500/50 decoration-2">72h</span>
          <ArrowUpRight className="w-5 h-5 text-accent rotate-45" />
          <span className="font-serif text-4xl text-accent">6h</span>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted/60 mt-2">
          ~12× faster from capture to agent-ready
        </div>
      </div>
    </ProductFrame>
  );
};

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

          <div className="lg:col-span-6 relative flex items-center justify-center">
            <ScrollReveal delay={500} direction="left" className="w-full flex justify-center">
              <ShootOSHeroDiagram />
            </ScrollReveal>
          </div>
        </div>
      </Section>

      {/* The Product — feature rows (PulseNote-style show-then-tell) */}
      <Section id="product" pattern="grid">
        <SectionHeader eyebrow="The Product" title="Four asset types, four specialists" subtitle="Each capture routes to the specialist that handles it best. All four work in parallel. Every output lands in the same branded package." />

        {/* Row 1 — Specialist Panel (demo L, copy R) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal delay={200}>
            <AssetSpecialistPanel />
          </ScrollReveal>
          <ScrollReveal delay={400} direction="left">
            <div>
              <h3 className="font-serif text-3xl md:text-4xl text-ink mb-4">Specialists, not a generalist editor</h3>
              <p className="font-sans text-lg text-ink-muted leading-relaxed mb-6">
                Traditional media production is one person juggling Lightroom, Premiere, Matterport, and Photoshop — or four freelancers you have to coordinate yourself. ShootOS gives each asset type its own specialist, running in parallel on the same capture, converging into one on-brand kit.
              </p>
              <ul className="space-y-3">
                {['Stills · HDR merge, color correct, crop, watermark', 'Video · cut, color grade, music bed, branded end-card', '3D tours · stitch 360° capture + floor-plan overlay', 'Staging · AI virtual staging of empty rooms'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-ink-muted">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span className="font-sans">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>

        {/* Row 2 — Brand Profile (copy L, demo R) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-20">
          <ScrollReveal delay={200}>
            <div>
              <h3 className="font-serif text-3xl md:text-4xl text-ink mb-4">Every listing on-brand, every time</h3>
              <p className="font-sans text-lg text-ink-muted leading-relaxed mb-6">
                Set your palette, watermark, video end-card, and staging style once. ShootOS applies them consistently across every listing your team ships — no matter which specialist worked on which asset. Inventory-wide brand consistency without hand-enforcement.
              </p>
              <ul className="space-y-3">
                {['Brand profile: colors, fonts, watermark, voice', 'Every deliverable stamped automatically', 'Consistency across stills, video, 3D, staging', 'Change the profile once — rebranding is an afternoon'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-ink-muted">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span className="font-sans">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={400} direction="left">
            <BrandProfilePanel />
          </ScrollReveal>
        </div>

        {/* Row 3 — Turnaround (demo L, copy R) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-20">
          <ScrollReveal delay={200}>
            <TurnaroundComparison />
          </ScrollReveal>
          <ScrollReveal delay={400} direction="left">
            <div>
              <h3 className="font-serif text-3xl md:text-4xl text-ink mb-4">Hours, not days</h3>
              <p className="font-sans text-lg text-ink-muted leading-relaxed mb-6">
                Traditional multi-vendor production is serial — one specialist waits for another to finish. ShootOS runs specialists in parallel on the same capture, so stills, video, 3D, and staging all land at the same QA queue, typically ~12× faster. Your listings go live while competing inventory is still in editing.
              </p>
              <ul className="space-y-3">
                {['Stills + video + 3D + staging in parallel', 'Single QA pass across all asset types', 'Typical listing kit: 4–8 hours from capture', 'Speed at volume is the competitive edge'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-ink-muted">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span className="font-sans">{item}</span>
                  </li>
                ))}
              </ul>
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
