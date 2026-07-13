import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Sparkles, Rocket, TrendingUp, Building2, Search, ChevronDown, Plus, Minus, Target, Users } from 'lucide-react';
import { MobileShell } from './MobileShell';
import { MobileButton } from './MobileButton';
import { MobileNextCase } from './MobileNextCase';
import { MobileSubscribe } from './MobileSubscribe';
import { Widget } from '../Shared';
import { BrandOSHeroDiagram, DimensionShowcase, StageWeightShifter } from '../BrandOSPage';
import { BookingWidget } from '../BookingWidget';
import AstridSketch from '../../images/Astrid_Sketch.webp';
import { API_ENDPOINTS } from '../../config';
import { track } from '../../lib/analytics';
import type { Page } from '../types';

interface DimensionScore {
  score: number;
  reason: string;
}
interface BrandScores {
  [dimension: string]: DimensionScore;
}
interface AnalysisResult {
  scores: { [brandName: string]: BrandScores };
  weightedScores: { [brandName: string]: number };
  verdict: { [brandName: string]: string };
}
type Stage = 'bootstrap' | 'seed' | 'growth' | 'scale';

const WEIGHTS: Record<string, number> = {
  clarity: 1.8,
  relevance: 1.6,
  industryFit: 1.2,
  memorability: 1.1,
  uniqueness: 1.0,
  scalability: 0.9,
  pronounceability: 0.8,
  visualIdentity: 0.7,
  negativeRisk: 0.6,
  trust: 1.3,
};

const DIMENSION_LABELS: Record<string, string> = {
  clarity: 'Clarity',
  relevance: 'Relevance',
  industryFit: 'Industry Fit',
  memorability: 'Memorability',
  uniqueness: 'Uniqueness',
  scalability: 'Scalability',
  pronounceability: 'Pronounceability',
  visualIdentity: 'Visual Identity',
  negativeRisk: 'Negative Risk',
  trust: 'Trust',
};

const DIMENSIONS = Object.keys(DIMENSION_LABELS);

const STAGES: { key: Stage; label: string; subtitle: string; icon: React.FC<{ className?: string }> }[] = [
  { key: 'bootstrap', label: 'Bootstrap', subtitle: '$0–$50K pre-revenue', icon: Rocket },
  { key: 'seed', label: 'Seed', subtitle: 'Early traction', icon: Sparkles },
  { key: 'growth', label: 'Growth', subtitle: 'Scaling revenue', icon: TrendingUp },
  { key: 'scale', label: 'Scale', subtitle: '$5M+ enterprise', icon: Building2 },
];

const scoreTextClass = (score: number) =>
  score >= 75 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-600';
const scoreBgClass = (score: number) =>
  score >= 75 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500';

interface MobileBrandOSPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

export const MobileBrandOSPage: React.FC<MobileBrandOSPageProps> = ({ onNavigate }) => {
  const [stage, setStage] = useState<Stage>('bootstrap');
  const [names, setNames] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const demoStartTracked = useRef(false);
  const demoCompleteTracked = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const canSubmit = names.trim().length > 0 && context.trim().length > 0 && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const nameList = names.split(',').map((n) => n.trim()).filter((n) => n.length > 0);
    if (nameList.length === 0) {
      setError('Enter at least one brand name.');
      return;
    }
    if (nameList.length > 5) {
      setError('Maximum 5 brand names allowed.');
      return;
    }

    if (!demoStartTracked.current) {
      demoStartTracked.current = true;
      track('demo_start', { demo_id: 'brandos_analyzer' });
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_ENDPOINTS.base}/analyze-brand`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names: nameList, context: context.trim(), stage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setResult({
        scores: data.scores,
        weightedScores: data.weightedScores,
        verdict: data.verdict,
      });
      if (!demoCompleteTracked.current) {
        demoCompleteTracked.current = true;
        track('demo_complete', { demo_id: 'brandos_analyzer' });
      }
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Sort brands by weighted score (desc) for the results list
  const sortedBrands = result
    ? Object.keys(result.scores).sort(
        (a, b) => (result.weightedScores[b] ?? 0) - (result.weightedScores[a] ?? 0),
      )
    : [];

  return (
    <MobileShell onNavigate={onNavigate} showBottomCTA={false}>
      {/* Hero */}
      <section className="px-6 pt-10 pb-10">
        <div className="inline-block mb-5 font-mono text-[10px] tracking-[0.25em] uppercase text-accent bg-accent/5 border border-accent/10 rounded-sm px-2.5 py-1">
          A DaVeenci team · Brand
        </div>
        <h1 className="font-serif text-[2.5rem] leading-[1.05] text-ink mb-5 tracking-tight">
          A name, scored the way a specialist would score it.
          <br />
          <span className="italic text-ink-muted/70">Free, live, below.</span>
        </h1>
        <p className="font-serif text-[17px] text-ink-muted leading-[1.6] mb-6">
          BrandOS scores your brand name across 10 weighted dimensions — clarity, trust, industry fit, memorability, and more — calibrated to your business stage. Type a name. Get a specialist-grade scorecard in seconds.
        </p>
        <div className="flex flex-col gap-3">
          <MobileButton onClick={() => document.getElementById('try-it')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
            <span className="inline-flex items-center justify-center gap-2">
              <Search className="w-4 h-4" /> Try it now
            </span>
          </MobileButton>
          <MobileButton variant="secondary" onClick={() => onNavigate('calendar')}>Talk to us</MobileButton>
        </div>

        <div className="mt-8 flex justify-center">
          <BrandOSHeroDiagram />
        </div>
      </section>

      {/* The Product */}
      <section className="px-6 py-10 bg-white/40">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">The Product</span>
        </div>
        <h2 className="font-serif text-[1.9rem] leading-[1.1] text-ink mb-8 tracking-tight">
          10 dimensions. <span className="italic text-ink-muted/70">Weighted by stage.</span>
        </h2>

        <div className="space-y-14">
          <div className="space-y-5">
            <div>
              <h3 className="font-serif text-[1.75rem] leading-[1.15] text-ink mb-3 tracking-tight">Scored across 10 dimensions, independently</h3>
              <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-4">
                Every candidate gets decomposed into Clarity, Relevance, Trust, Industry Fit, and six more — each scored 0-100 with a concrete reason.
              </p>
              <ul className="space-y-2.5">
                {['Each dimension has a diagnostic question', 'Scores come with evidence, not a thumbs-up', 'Negative Risk is inverse-scored — high = safe'].map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-ink-muted">
                    <div className="w-1 h-1 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span className="font-sans text-[14px] leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center"><DimensionShowcase /></div>
          </div>

          <div className="space-y-5">
            <div>
              <h3 className="font-serif text-[1.75rem] leading-[1.15] text-ink mb-3 tracking-tight">Weighted by your business stage</h3>
              <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-4">
                Clarity dominates at Bootstrap. Uniqueness and Visual Identity dominate at Scale. BrandOS recalibrates the weights behind the score based on the stage you pick.
              </p>
              <ul className="space-y-2.5">
                {['Bootstrap · Clarity + Pronounceability lead', 'Seed · Relevance signals the category', 'Scale · Visual Identity + Negative Risk dominate'].map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-ink-muted">
                    <div className="w-1 h-1 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span className="font-sans text-[14px] leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center"><StageWeightShifter /></div>
          </div>
        </div>
      </section>

      {/* Try it — live tool */}
      <section id="try-it" className="px-6 py-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">Try It</span>
        </div>
        <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-4 tracking-tight">
          Score your names. <br />
          <span className="italic text-ink-muted/70">Live, below.</span>
        </h2>
        <p className="font-serif text-[15px] text-ink-muted leading-[1.6] mb-6">
          Pick your stage, enter up to five candidates, get a weighted scorecard in about ten seconds.
        </p>

        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted mb-3">
          1. Select your stage
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {STAGES.map(({ key, label, subtitle, icon: Icon }) => {
            const isActive = stage === key;
            return (
              <button
                key={key}
                onClick={() => !loading && setStage(key)}
                disabled={loading}
                className={`relative p-4 border rounded-lg shadow-sm text-left transition-all ${
                  isActive
                    ? 'border-accent bg-accent/5 ring-1 ring-accent'
                    : 'border-ink/10 bg-white'
                } ${loading ? 'opacity-50' : ''}`}
              >
                <Icon
                  className={`w-5 h-5 mb-2 ${isActive ? 'text-accent' : 'text-ink-muted'}`}
                />
                <div className={`font-serif text-base ${isActive ? 'text-accent font-semibold' : 'text-ink'}`}>
                  {label}
                </div>
                <div className="text-[11px] text-ink-muted mt-0.5 leading-snug">{subtitle}</div>
              </button>
            );
          })}
        </div>

        {/* Step 2 — Input, in same "try-it" section */}
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted mb-3 mt-8">
          2. Enter names &amp; context
        </div>
        <Widget className="p-5">
          <div className="space-y-4">
            <div>
              <label htmlFor="mobile-brandos-names" className="block font-mono text-[10px] font-bold text-ink uppercase tracking-wider mb-2">
                Brand names <span className="text-red-500">*</span>
              </label>
              <input
                id="mobile-brandos-names"
                name="brandNames"
                type="text"
                value={names}
                onChange={(e) => setNames(e.target.value)}
                placeholder="Up to 5, comma-separated"
                disabled={loading}
                className="w-full bg-base/30 border border-ink/20 rounded-lg p-3 text-[15px] text-ink placeholder:text-ink-muted/50 focus:border-accent focus:outline-none disabled:opacity-50"
              />
              <p className="text-[11px] text-ink-muted mt-1.5">Max 5 names.</p>
            </div>

            <div>
              <label htmlFor="mobile-brandos-context" className="block font-mono text-[10px] font-bold text-ink uppercase tracking-wider mb-2">
                Product context <span className="text-red-500">*</span>
              </label>
              <textarea
                id="mobile-brandos-context"
                name="productContext"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="AI-powered booking platform for B2B service companies"
                disabled={loading}
                rows={3}
                className="w-full bg-base/30 border border-ink/20 rounded-lg p-3 text-[15px] text-ink placeholder:text-ink-muted/50 focus:border-accent focus:outline-none resize-none disabled:opacity-50"
              />
            </div>

            <MobileButton onClick={handleSubmit} disabled={!canSubmit}>
              <span className="inline-flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing…
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" /> Analyze
                  </>
                )}
              </span>
            </MobileButton>
          </div>
        </Widget>

        {error && (
          <div
            role="alert"
            className="mt-4 text-xs font-serif italic text-amber-900 bg-amber-50/70 border border-amber-200/80 rounded-lg px-4 py-2.5"
          >
            {error}
          </div>
        )}

        {/* Step 3 — Results, inline in same section */}
        {result && (
          <div id="results" className="scroll-mt-20 mt-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted mb-3">
              3. Results
            </div>
          <div className="space-y-3">
            {sortedBrands.map((brand, rank) => {
              const weighted = result.weightedScores[brand] ?? 0;
              const verdict = result.verdict[brand] ?? '';
              const scores = result.scores[brand] ?? {};
              const isOpen = expandedBrand === brand;
              return (
                <Widget key={brand} className="overflow-hidden">
                  <button
                    onClick={() => setExpandedBrand(isOpen ? null : brand)}
                    className="w-full p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg border border-ink/10 bg-base/30 flex items-center justify-center">
                        <span className="font-serif text-sm text-ink-muted">{rank + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-3 mb-1">
                          <h3 className="font-serif text-xl text-ink truncate">{brand}</h3>
                          <span
                            className={`font-serif font-bold text-2xl flex-shrink-0 ${scoreTextClass(weighted)}`}
                          >
                            {Math.round(weighted)}
                          </span>
                        </div>
                        {verdict && (
                          <p className="font-serif italic text-[13px] text-ink-muted leading-snug">
                            {verdict}
                          </p>
                        )}
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-ink-muted/60 flex-shrink-0 mt-1 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-ink/5 bg-base/30 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="pt-4 space-y-3">
                        {DIMENSIONS.map((dim) => {
                          const data = scores[dim];
                          if (!data) return null;
                          const weight = WEIGHTS[dim];
                          const isNegative = dim === 'negativeRisk';
                          return (
                            <div key={dim}>
                              <div className="flex items-baseline justify-between gap-3 mb-1">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <span className="font-sans text-[13px] text-ink">
                                    {DIMENSION_LABELS[dim]}
                                  </span>
                                  <span className="font-mono text-[9px] text-ink-muted/60">
                                    ×{weight}
                                  </span>
                                </div>
                                <span
                                  className={`font-mono text-[12px] font-semibold ${scoreTextClass(data.score)}`}
                                >
                                  {data.score}
                                </span>
                              </div>
                              <div className="h-1 bg-ink/5 rounded-full overflow-hidden mb-1">
                                <div
                                  className={`h-full rounded-full ${scoreBgClass(data.score)} ${isNegative ? 'opacity-60' : ''}`}
                                  style={{ width: `${data.score}%` }}
                                />
                              </div>
                              <p className="text-[12px] text-ink-muted leading-relaxed">
                                {data.reason}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </Widget>
              );
            })}
            </div>
          </div>
        )}
      </section>

      {/* Use Cases */}
      <section className="px-6 py-10 bg-white/40">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">Use Cases</span>
        </div>
        <h2 className="font-serif text-[1.9rem] leading-[1.1] text-ink mb-6 tracking-tight">
          Who BrandOS is <span className="italic text-ink-muted/70">for.</span>
        </h2>
        <div className="space-y-4">
          {[
            { icon: Rocket, title: 'Early-stage founders', body: "You're picking the name your first hundred customers will learn. Make it the right one." },
            { icon: Target, title: 'Product launches', body: 'Evaluating candidates for a new product line? Score them side-by-side before committing the budget.' },
            { icon: Users, title: 'Branding agencies', body: 'Back your recommendation with dimensional scoring. Defend the choice your client is about to sign off on.' },
            { icon: Building2, title: 'Rebrands', body: "Changing an established name is expensive. BrandOS tells you whether the new candidate is actually stronger — or just different." },
          ].map((uc) => {
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
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">FAQ</span>
        </div>
        <h2 className="font-serif text-[1.9rem] leading-[1.1] text-ink mb-6 tracking-tight">
          Common <span className="italic text-ink-muted/70">questions.</span>
        </h2>
        <Widget as="ol" className="px-5">
          {[
            { q: 'What are the 10 dimensions?', a: 'Clarity, Relevance, Trust, Industry Fit, Memorability, Uniqueness, Scalability, Pronounceability, Visual Identity, and Negative Risk. Each is weighted differently (Clarity ×1.8 is heaviest; Negative Risk ×0.6 is inverse-scored so high = safe).' },
            { q: "Why does 'business stage' matter?", a: "Weights shift by stage. Bootstrap optimizes for clarity and pronounceability. Scale optimizes for uniqueness and visual identity. BrandOS recalibrates accordingly." },
            { q: 'How is this different from a naming agency?', a: "An agency generates candidates. BrandOS scores the candidates you already have. Due-diligence layer — a specialist-grade second opinion before sign-off." },
            { q: 'Does it handle multi-language names?', a: "Yes with caveats. Strongest in English. Negative Risk catches obvious issues; native-speaker review recommended for flagship launches." },
            { q: 'Is this the full tool?', a: "Yes — the free version scores up to 5 names at once, unlimited times. The specialist-team engagement behind it is what we'd scope on a Talk-to-us call." },
            { q: 'Do you store my names?', a: "Anonymized logs for quality/abuse monitoring, 30 days, random hash. Not tied to you, not sold, not used to train models." },
          ].map((item, i) => {
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

      {/* Book a BrandOS intro */}
      <BookingWidget
        onNavigate={onNavigate}
        eyebrow="BrandOS Intro"
        title="Book a BrandOS intro"
        subtitle="Walk us through the naming decision you're facing. We'll score the candidates live."
        leftBody="We'll run your shortlist through BrandOS together, look at where the weights actually land for your stage, and map out what a rebrand or launch diligence engagement looks like if that's where this is heading."
        bookingType="demo-brandos"
        hostName="Astrid Abrahamyan"
        hostRole="Partner"
        hostImage={AstridSketch}
      />

      <MobileNextCase
        from="brandos"
        to="compoundiq"
        title="CompoundIQ"
        hook="From naming to capital — a governed research team that proposes freely, yet can't act until every gate agrees."
        onNavigate={onNavigate}
      />

      <MobileSubscribe
        heading="Follow the workshop"
        body="Naming, scoring, and the rest of the studio's builds — one Codex letter every Tuesday. Build-in-public, no fluff."
        source="brandos"
      />
    </MobileShell>
  );
};
