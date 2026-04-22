import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles, Rocket, TrendingUp, Building2, Search, ChevronDown, Plus, Minus, Target, Users } from 'lucide-react';
import { MobileShell } from './MobileShell';
import { MobileButton } from './MobileButton';
import { MobileScenePlate } from './MobileScenePlate';
import { API_ENDPOINTS } from '../../config';
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

  useEffect(() => {
    document.title = 'BrandOS — DaVeenci';
    window.scrollTo(0, 0);
    return () => {
      document.title = 'DaVeenci | AI & Automation Consultancy';
    };
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

        {/* Fig — scorecard preview */}
        <div className="mt-8">
          <MobileScenePlate figLabel="Fig. i · Weighted Scorecard">
            <svg viewBox="0 0 200 220" className="w-full h-auto max-w-[280px] mx-auto block">
              {[
                { name: 'Clarity', score: 88, weight: 1.8 },
                { name: 'Relevance', score: 76, weight: 1.6 },
                { name: 'Trust', score: 82, weight: 1.3 },
                { name: 'Industry Fit', score: 71, weight: 1.2 },
                { name: 'Memorability', score: 65, weight: 1.1 },
                { name: 'Uniqueness', score: 58, weight: 1.0 },
                { name: 'Scalability', score: 79, weight: 0.9 },
                { name: 'Pronounce.', score: 91, weight: 0.8 },
                { name: 'Visual', score: 54, weight: 0.7 },
                { name: 'Neg. Risk', score: 85, weight: 0.6 },
              ].map((dim, i) => {
                const y = 15 + i * 20;
                const barWidth = (dim.score / 100) * 90;
                const color = dim.score >= 75 ? '#059669' : dim.score >= 50 ? '#d97706' : '#dc2626';
                return (
                  <g key={dim.name}>
                    <text x="5" y={y + 4} fontSize="7" fontFamily="serif" fill="rgb(var(--color-ink))">{dim.name}</text>
                    <rect x="70" y={y - 3} width="90" height="6" rx="1" fill="rgb(var(--color-ink))" fillOpacity="0.06" />
                    <rect x="70" y={y - 3} width={barWidth} height="6" rx="1" fill={color} fillOpacity="0.7">
                      <animate attributeName="width" from="0" to={barWidth} dur="1.4s" begin={`${i * 0.08}s`} fill="freeze" />
                    </rect>
                    <text x={165} y={y + 3} fontSize="7" fontFamily="monospace" fontWeight="600" fill={color}>{dim.score}</text>
                    <text x={185} y={y + 3} fontSize="5" fontFamily="monospace" fill="rgb(var(--color-ink-muted))">×{dim.weight}</text>
                  </g>
                );
              })}
            </svg>
          </MobileScenePlate>
        </div>
      </section>

      {/* Problem */}
      <section className="px-6 pb-8">
        <div className="bg-alt/10 border-l-2 border-alt p-5 rounded-sm">
          <h3 className="font-serif text-xl text-ink mb-2">Why it matters</h3>
          <p className="font-sans text-[15px] text-ink-muted leading-relaxed">
            Most naming feedback is vibes. "I like it." "Feels off." That's not a signal — that's noise. BrandOS scores candidate names the way a specialist would: across dimensions that actually predict whether a name will hold up.
          </p>
        </div>
      </section>

      {/* Try it — live tool */}
      <section id="try-it" className="px-6 py-10 bg-white/40">
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
                className={`relative p-4 border rounded-sm text-left transition-all ${
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
        <div className="bg-white border border-ink/10 rounded-sm p-5 shadow-sm shadow-ink/5">
          <div className="space-y-4">
            <div>
              <label className="block font-mono text-[10px] font-bold text-ink uppercase tracking-wider mb-2">
                Brand names <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={names}
                onChange={(e) => setNames(e.target.value)}
                placeholder="Up to 5, comma-separated"
                disabled={loading}
                className="w-full bg-base/30 border border-ink/20 rounded-sm p-3 text-[15px] text-ink placeholder:text-ink-muted/50 focus:border-accent focus:outline-none disabled:opacity-50"
              />
              <p className="text-[11px] text-ink-muted mt-1.5">Max 5 names.</p>
            </div>

            <div>
              <label className="block font-mono text-[10px] font-bold text-ink uppercase tracking-wider mb-2">
                Product context <span className="text-red-500">*</span>
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="AI-powered booking platform for B2B service companies"
                disabled={loading}
                rows={3}
                className="w-full bg-base/30 border border-ink/20 rounded-sm p-3 text-[15px] text-ink placeholder:text-ink-muted/50 focus:border-accent focus:outline-none resize-none disabled:opacity-50"
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
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 text-xs font-serif italic text-amber-900 bg-amber-50/70 border border-amber-200/80 rounded-sm px-4 py-2.5"
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
                <div
                  key={brand}
                  className="bg-white border border-ink/10 rounded-sm overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedBrand(isOpen ? null : brand)}
                    className="w-full p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-sm border border-ink/10 bg-base/30 flex items-center justify-center">
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
                </div>
              );
            })}
            </div>
          </div>
        )}
      </section>

      {/* Use Cases */}
      <section className="px-6 py-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">Use Cases</span>
        </div>
        <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-6 tracking-tight">
          Who BrandOS is <span className="italic text-ink-muted/70">for.</span>
        </h2>
        <div className="space-y-3">
          {[
            { icon: Rocket, title: 'Early-stage founders', body: "You're picking the name your first hundred customers will learn. Make it the right one." },
            { icon: Target, title: 'Product launches', body: 'Evaluating candidates for a new product line? Score them side-by-side before committing the budget.' },
            { icon: Users, title: 'Branding agencies', body: 'Back your recommendation with dimensional scoring. Defend the choice your client is about to sign off on.' },
            { icon: Building2, title: 'Rebrands', body: "Changing an established name is expensive. BrandOS tells you whether the new candidate is actually stronger — or just different." },
          ].map((uc) => {
            const Icon = uc.icon;
            return (
              <div key={uc.title} className="bg-white border border-ink/10 rounded-sm p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="w-5 h-5 text-accent flex-shrink-0" />
                  <h3 className="font-serif text-lg text-ink">{uc.title}</h3>
                </div>
                <p className="font-sans text-[14px] text-ink-muted leading-relaxed">{uc.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-10 bg-white/40">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">FAQ</span>
        </div>
        <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-6 tracking-tight">
          Common <span className="italic text-ink-muted/70">questions.</span>
        </h2>
        <ol className="border-t border-ink/10">
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
              <li key={i} className="border-b border-ink/10">
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
        </ol>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-10 border-t border-ink/5">
        <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-4 tracking-tight text-center">
          Found something worth <br />
          <span className="italic text-accent">talking about?</span>
        </h2>
        <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-6 text-center">
          Brand naming is one knowledge-work domain among many. If this surfaced a gap — in your name, positioning, or workflow — we can talk about whether a specialist team is the right answer.
        </p>
        <MobileButton onClick={() => onNavigate('calendar')}>Talk to us</MobileButton>
      </section>
    </MobileShell>
  );
};
