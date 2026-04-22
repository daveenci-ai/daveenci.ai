
import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, ArrowUpDown, Loader2, Sparkles, Rocket, TrendingUp, Building2, Search } from 'lucide-react';
import { ScrollReveal, Section, SectionHeader, PageHero, ErrorAlert, Button, Plate, VitruvianBackground, Widget, IconBadge, ProblemCallout } from './Shared';
import Header from './Header';
import Footer from './Footer';
import type { Page } from './types';
import { API_ENDPOINTS } from '../config';
import { useIsMobile } from './mobile/useIsMobile';
import { MobileBrandOSPage } from './mobile/MobileBrandOSPage';
import { Search as SearchIcon, ChevronDown as ChevronDownIcon, Target, Users, Rocket as RocketIcon, Building2 as BuildingIcon } from 'lucide-react';

// --- Types ---

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
type SortKey = 'name' | 'weighted' | string;
type SortDir = 'asc' | 'desc';

// --- Constants ---

const WEIGHTS: Record<string, number> = {
  clarity: 1.8,
  relevance: 1.6,
  industryFit: 1.2,
  memorability: 1.1,
  uniqueness: 1.0,
  scalability: 0.9,
  pronounceability: 0.8,
  visualIdentity: 0.7,
  emotionalAppeal: 0.7,
  negativeRisk: 0.7,
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
  emotionalAppeal: 'Emotional Appeal',
  negativeRisk: 'Negative Risk',
};

const DIMENSIONS = Object.keys(DIMENSION_LABELS);

const STAGES: { key: Stage; label: string; subtitle: string; icon: React.FC<any> }[] = [
  { key: 'bootstrap', label: 'Bootstrap', subtitle: '$0–$50K Pre-Revenue', icon: Rocket },
  { key: 'seed', label: 'Seed', subtitle: 'Early Traction', icon: Sparkles },
  { key: 'growth', label: 'Growth', subtitle: 'Scaling Revenue', icon: TrendingUp },
  { key: 'scale', label: 'Scale', subtitle: '$5M+ Enterprise', icon: Building2 },
];

function getPriorityLevel(weight: number): { label: string; color: string } {
  if (weight >= 1.5) return { label: 'HIGH', color: 'text-red-600 bg-red-50' };
  if (weight >= 1.0) return { label: 'MED', color: 'text-amber-600 bg-amber-50' };
  if (weight >= 0.8) return { label: 'LOW', color: 'text-blue-600 bg-blue-50' };
  return { label: 'MINIMAL', color: 'text-ink-muted bg-ink/5' };
}

function getScoreColor(score: number): string {
  if (score >= 75) return 'text-emerald-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-red-600';
}

function getScoreBg(score: number): string {
  if (score >= 75) return 'bg-emerald-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

function getScoreDot(score: number): string {
  if (score >= 75) return 'bg-emerald-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

// --- Stage Selector ---

const StageSelector: React.FC<{
  selected: Stage;
  onSelect: (stage: Stage) => void;
  disabled: boolean;
}> = ({ selected, onSelect, disabled }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
    {STAGES.map(({ key, label, subtitle, icon: Icon }) => {
      const isActive = selected === key;
      return (
        <button
          key={key}
          onClick={() => !disabled && onSelect(key)}
          disabled={disabled}
          className={`relative p-4 md:p-6 border rounded-lg text-left transition-all duration-300 group
            ${isActive
              ? 'border-accent bg-accent/5 shadow-lg shadow-accent/10'
              : 'border-ink/10 bg-white shadow-sm hover:border-accent/30 hover:shadow-xl hover:-translate-y-1'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className={`absolute top-0 left-0 w-full h-1 rounded-t-lg transition-all duration-300 ${isActive ? 'bg-accent' : 'bg-transparent group-hover:bg-accent/30'}`} />
          <Icon className={`w-5 h-5 mb-3 transition-colors ${isActive ? 'text-accent' : 'text-ink-muted group-hover:text-accent/70'}`} />
          <div className={`font-serif text-lg md:text-xl font-bold transition-colors ${isActive ? 'text-accent' : 'text-ink'}`}>
            {label}
          </div>
          <div className="text-xs text-ink-muted mt-1">{subtitle}</div>
        </button>
      );
    })}
  </div>
);

// --- Input Panel ---

const InputPanel: React.FC<{
  names: string;
  context: string;
  onNamesChange: (v: string) => void;
  onContextChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
  disabled: boolean;
}> = ({ names, context, onNamesChange, onContextChange, onSubmit, loading, disabled }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <Widget className="p-6 md:p-8">
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
            Brand Names <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={names}
            onChange={(e) => onNamesChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter up to 5 names, separated by commas (e.g. Apex, Meridian, Versa)"
            disabled={loading}
            className="w-full bg-base/30 border border-ink/20 p-3 text-ink rounded-lg placeholder:text-ink-muted/50 focus:border-accent focus:outline-none transition-colors disabled:opacity-50"
          />
          <p className="text-xs text-ink-muted mt-1.5">Separate multiple names with commas. Max 5.</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
            Product Context <span className="text-red-500">*</span>
          </label>
          <textarea
            value={context}
            onChange={(e) => onContextChange(e.target.value)}
            placeholder="Describe your product or business in a sentence (e.g. 'AI-powered booking platform for B2B service companies')"
            disabled={loading}
            rows={2}
            className="w-full bg-base/30 border border-ink/20 p-3 text-ink rounded-lg placeholder:text-ink-muted/50 focus:border-accent focus:outline-none transition-colors resize-none disabled:opacity-50"
          />
        </div>

        <button
          onClick={onSubmit}
          disabled={disabled}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 font-sans text-sm font-medium transition-all duration-500 rounded-lg
            ${disabled
              ? 'bg-ink/20 text-ink-muted cursor-not-allowed'
              : 'bg-accent hover:bg-accent-hover text-white shadow-sm hover:shadow-md'}
          `}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Analyze Brand Names
            </>
          )}
        </button>
      </div>
    </Widget>
  );
};

// --- Expandable Detail Row ---

const DimensionDetail: React.FC<{ scores: BrandScores }> = ({ scores }) => (
  <div className="bg-base/50 border-t border-ink/5 px-4 md:px-8 py-6">
    <div className="grid gap-3">
      {DIMENSIONS.map((dim) => {
        const data = scores[dim];
        if (!data) return null;
        const weight = WEIGHTS[dim];
        const priority = getPriorityLevel(weight);
        const isNegative = dim === 'negativeRisk';

        return (
          <div key={dim} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:w-44 shrink-0">
              <span className={`w-2 h-2 rounded-full ${getScoreDot(data.score)}`} />
              <span className="text-sm font-medium text-ink">{DIMENSION_LABELS[dim]}</span>
              {isNegative && <span className="text-[10px] text-ink-muted italic">(inverse)</span>}
            </div>

            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-full max-w-xs bg-ink/5 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getScoreBg(data.score)} ${isNegative ? 'opacity-60' : ''}`}
                  style={{ width: `${data.score}%` }}
                />
              </div>
              <span className={`text-sm font-bold w-8 text-right ${getScoreColor(data.score)}`}>{data.score}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${priority.color} hidden sm:inline`}>
                {priority.label}
              </span>
              <span className="text-[10px] text-ink-muted/70 hidden sm:inline">x{weight}</span>
            </div>

            <p className="text-xs text-ink-muted leading-relaxed sm:max-w-xs">{data.reason}</p>
          </div>
        );
      })}
    </div>
  </div>
);

// --- Results Table ---

const ResultsTable: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const [sortKey, setSortKey] = useState<SortKey>('weighted');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showBreakdown, setShowBreakdown] = useState(false);

  const brandNames = Object.keys(result.scores);

  const sorted = useMemo(() => {
    return [...brandNames].sort((a, b) => {
      let valA: number, valB: number;
      if (sortKey === 'name') {
        return sortDir === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
      } else if (sortKey === 'weighted') {
        valA = result.weightedScores[a] ?? 0;
        valB = result.weightedScores[b] ?? 0;
      } else {
        valA = result.scores[a]?.[sortKey]?.score ?? 0;
        valB = result.scores[b]?.[sortKey]?.score ?? 0;
      }
      return sortDir === 'asc' ? valA - valB : valB - valA;
    });
  }, [brandNames, sortKey, sortDir, result]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const toggleRow = (name: string) => {
    const next = new Set(expandedRows);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    setExpandedRows(next);
  };

  const topScore = Math.max(...(Object.values(result.weightedScores) as number[]));

  const SortIcon: React.FC<{ active: boolean }> = ({ active }) => (
    <ArrowUpDown className={`w-3 h-3 inline ml-1 ${active ? 'text-accent' : 'text-ink-muted/40'}`} />
  );

  return (
    <Widget className="overflow-hidden">
      {/* Toggle for detail columns */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-ink/5 bg-base/30">
        <h3 className="font-serif text-lg text-ink font-bold">Results</h3>
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="text-xs font-medium text-accent hover:text-accent-hover transition-colors"
        >
          {showBreakdown ? 'Hide Breakdown' : 'Show Breakdown'}
        </button>
      </div>

      {/* Scrollable table container */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 bg-base/20">
              <th
                className="text-left px-4 md:px-6 py-3 font-bold text-xs uppercase tracking-wider text-ink-muted cursor-pointer hover:text-accent transition-colors sticky left-0 bg-base/20 z-10"
                onClick={() => toggleSort('name')}
              >
                Brand Name <SortIcon active={sortKey === 'name'} />
              </th>
              <th
                className="text-center px-4 py-3 font-bold text-xs uppercase tracking-wider text-ink-muted cursor-pointer hover:text-accent transition-colors"
                onClick={() => toggleSort('weighted')}
              >
                Score <SortIcon active={sortKey === 'weighted'} />
              </th>
              {showBreakdown && DIMENSIONS.map((dim) => (
                <th
                  key={dim}
                  className="text-center px-3 py-3 font-bold text-[10px] uppercase tracking-wider text-ink-muted cursor-pointer hover:text-accent transition-colors whitespace-nowrap"
                  onClick={() => toggleSort(dim)}
                >
                  {DIMENSION_LABELS[dim]} <SortIcon active={sortKey === dim} />
                </th>
              ))}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((name) => {
              const weighted = result.weightedScores[name] ?? 0;
              const isTop = weighted === topScore && brandNames.length > 1;
              const isExpanded = expandedRows.has(name);

              return (
                <React.Fragment key={name}>
                  <tr
                    className={`border-b border-ink/5 cursor-pointer transition-colors hover:bg-accent/5 ${isTop ? 'bg-accent/[0.03]' : ''}`}
                    onClick={() => toggleRow(name)}
                  >
                    <td className="px-4 md:px-6 py-4 sticky left-0 bg-white z-10">
                      <div className="flex items-center gap-2">
                        {isTop && <span className="text-[10px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded uppercase">Top</span>}
                        <span className="font-serif text-base font-bold text-ink">{name}</span>
                      </div>
                    </td>
                    <td className="text-center px-4 py-4">
                      <span className={`text-2xl font-bold ${getScoreColor(weighted)}`}>{weighted}</span>
                    </td>
                    {showBreakdown && DIMENSIONS.map((dim) => {
                      const s = result.scores[name]?.[dim]?.score ?? 0;
                      return (
                        <td key={dim} className="text-center px-3 py-4">
                          <span className={`text-sm font-medium ${getScoreColor(s)} ${dim === 'negativeRisk' ? 'opacity-60' : ''}`}>{s}</span>
                        </td>
                      );
                    })}
                    <td className="px-3 py-4 text-center">
                      {isExpanded
                        ? <ChevronUp className="w-4 h-4 text-ink-muted" />
                        : <ChevronDown className="w-4 h-4 text-ink-muted" />}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={showBreakdown ? DIMENSIONS.length + 3 : 3}>
                        {result.verdict[name] && (
                          <div className="px-4 md:px-8 pt-4 pb-2">
                            <p className="text-sm text-ink-muted italic border-l-2 border-accent/30 pl-4">{result.verdict[name]}</p>
                          </div>
                        )}
                        <DimensionDetail scores={result.scores[name]} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="px-4 md:px-6 py-4 border-t border-ink/5 bg-base/20 flex flex-wrap gap-4 md:gap-6 text-xs text-ink-muted">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          75+ Strong
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          50–74 Average
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          &lt;50 Weak
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="italic">Negative Risk: inverse scored (high = safe)</span>
        </div>
      </div>
    </Widget>
  );
};

// --- Main Page ---

interface BrandOSPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const BrandOSPage: React.FC<BrandOSPageProps> = (props) => {
  const isMobile = useIsMobile();
  if (isMobile) return <MobileBrandOSPage {...props} />;
  return <BrandOSPageDesktop {...props} />;
};

const BrandOSPageDesktop: React.FC<BrandOSPageProps> = ({ onNavigate }) => {
  const [stage, setStage] = useState<Stage>('bootstrap');
  const [names, setNames] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = names.trim().length > 0 && context.trim().length > 0 && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const nameList = names.split(',').map(n => n.trim()).filter(n => n.length > 0);
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

      if (!res.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult({
        scores: data.scores,
        weightedScores: data.weightedScores,
        verdict: data.verdict,
      });

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full overflow-x-hidden min-h-screen">
      <Header onNavigate={onNavigate} currentPage="brandos" />

      {/* Hero */}
      <Section className="pt-32 pb-20 md:pt-40 md:pb-28 min-h-[90vh] flex items-center">
        <VitruvianBackground className="opacity-[0.08]" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-6 relative z-20">
            <ScrollReveal delay={200}>
              <PageHero
                eyebrow={
                  <span className="inline-block mb-4 font-mono text-xs font-bold text-accent uppercase tracking-widest bg-accent/5 px-3 py-1 border border-accent/10 rounded-sm">
                    A DaVeenci team · Brand
                  </span>
                }
                title={<>A name, scored the way a specialist would score it.<br /><span className="italic text-ink-muted/80">Free, live, below.</span></>}
                description="BrandOS scores your brand name across 10 weighted dimensions — clarity, trust, industry fit, memorability, and more — calibrated to your business stage. Type a name. Get a specialist-grade scorecard in seconds."
                size="md"
                actions={
                  <>
                    <Button
                      variant="primary"
                      onClick={() => document.getElementById('try-it')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                      className="text-base px-8 py-4"
                    >
                      <span className="flex items-center gap-2"><SearchIcon className="w-4 h-4" /> Try it now</span>
                    </Button>
                    <Button variant="secondary" onClick={() => onNavigate('calendar')} className="text-base px-8 py-4">Talk to us</Button>
                  </>
                }
              />
            </ScrollReveal>
          </div>

          <div className="lg:col-span-6 relative h-[400px] md:h-[480px] flex items-center justify-center">
            <ScrollReveal delay={500} direction="left" className="w-full flex justify-center">
              <Plate fig="i" title="Weighted Scorecard">
                <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 300 300" fill="none">
                  {/* Dimension bars */}
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
                    const y = 30 + i * 24;
                    const barWidth = (dim.score / 100) * 160;
                    const color = dim.score >= 75 ? '#059669' : dim.score >= 50 ? '#d97706' : '#dc2626';
                    return (
                      <g key={dim.name}>
                        <text x="10" y={y + 4} fontSize="8" fontFamily="serif" fill="rgb(var(--color-ink))">{dim.name}</text>
                        <rect x="80" y={y - 3} width="160" height="6" rx="1" fill="rgb(var(--color-ink))" fillOpacity="0.06" />
                        <rect x="80" y={y - 3} width={barWidth} height="6" rx="1" fill={color} fillOpacity="0.7">
                          <animate attributeName="width" from="0" to={barWidth} dur="1.4s" begin={`${i * 0.1}s`} fill="freeze" />
                        </rect>
                        <text x={245} y={y + 3} fontSize="8" fontFamily="monospace" fontWeight="600" fill={color}>{dim.score}</text>
                        <text x={270} y={y + 3} fontSize="6" fontFamily="monospace" fill="rgb(var(--color-ink-muted))">×{dim.weight}</text>
                      </g>
                    );
                  })}
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
            <h3 className="font-serif text-xl text-ink mb-2">Why it matters</h3>
            <p className="font-sans text-ink-muted leading-relaxed">
              Most naming feedback is vibes. "I like it." "Feels off." "My wife said no." That's not a signal — that's noise. BrandOS scores candidate names the way a specialist would: across dimensions that actually predict whether a name will hold up once you start shipping.
            </p>
          </ProblemCallout>
        </ScrollReveal>
      </Section>

      {/* Live tool */}
      <Section id="try-it" className="bg-alt/30 py-20">
        <SectionHeader eyebrow="Try It" title="Score your names. Live, below." subtitle="Pick your stage, enter up to five candidates, and get a weighted scorecard in about ten seconds." />
        <div className="space-y-8 max-w-5xl mx-auto">
          {/* Stage Selector */}
          <ScrollReveal delay={100}>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-4">
              1. Select Your Business Stage
            </label>
            <StageSelector selected={stage} onSelect={setStage} disabled={loading} />
          </ScrollReveal>

          {/* Input */}
          <ScrollReveal delay={200}>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-4">
              2. Enter Brand Names & Context
            </label>
            <InputPanel
              names={names}
              context={context}
              onNamesChange={setNames}
              onContextChange={setContext}
              onSubmit={handleSubmit}
              loading={loading}
              disabled={!canSubmit}
            />
          </ScrollReveal>

          {/* Error */}
          {error && <ErrorAlert message={error} />}

          {/* Results */}
          {result && (
            <ScrollReveal>
              <div id="results" className="scroll-mt-32">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-4">
                  3. Results
                </label>
                <ResultsTable result={result} />
              </div>
            </ScrollReveal>
          )}
        </div>
      </Section>

      {/* Use cases */}
      <Section id="use-cases" className="py-20">
        <SectionHeader eyebrow="Use Cases" title="Who BrandOS is for." subtitle="Anyone making a naming decision that's costly to reverse." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { icon: RocketIcon, title: 'Early-stage founders', body: "You're picking the name your first hundred customers will learn. Make it the right one." },
            { icon: Target, title: 'Product launches', body: 'Evaluating candidates for a new product line? Score them side-by-side before committing the budget.' },
            { icon: Users, title: 'Branding agencies', body: 'Back your recommendation with dimensional scoring. Defend the choice your client is about to sign off on.' },
            { icon: BuildingIcon, title: 'Rebrands', body: "Changing an established name is expensive. BrandOS tells you whether the new candidate is actually stronger — or just different." },
          ].map((uc, i) => {
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
      <Section id="faq" className="bg-alt/30 py-20">
        <SectionHeader eyebrow="FAQ" title="Common questions." />
        <ScrollReveal>
          <div className="max-w-3xl mx-auto bg-white shadow-xl border border-ink/10 rounded-lg px-8">
            {[
              { q: 'What are the 10 dimensions?', a: 'Clarity, Relevance, Trust, Industry Fit, Memorability, Uniqueness, Scalability, Pronounceability, Visual Identity, and Negative Risk. Each is weighted differently (Clarity ×1.8 is the heaviest; Negative Risk ×0.6 is the lightest but inverse-scored so a high score means low risk).' },
              { q: "Why does 'business stage' matter?", a: "Weights shift by stage. A Bootstrap name optimizes for clarity and pronounceability (you're explaining it a hundred times a day). A Scale-stage name optimizes for uniqueness and visual identity (you're defending trademark and building brand recognition). BrandOS recalibrates the scoring accordingly." },
              { q: 'How is this different from a naming agency?', a: "A naming agency generates candidates. BrandOS scores the candidates you (or an agency) already have. Think of it as a due-diligence layer — a specialist-grade second opinion before you sign off." },
              { q: 'Does it handle multi-language names?', a: "Yes, with caveats. The tool is currently strongest in English. For multi-language brand evaluation (e.g., \"does this name mean something embarrassing in Portuguese?\"), the Negative Risk dimension catches the obvious issues but we recommend a native-speaker review for flagship launches." },
              { q: "Is this the full tool or a teaser?", a: "It's the full tool. The free version scores up to 5 names at once, unlimited times. The specialist-team engagement behind it (for rebrands, international rollouts, trademark diligence, etc.) is what we'd scope on a Talk-to-us call." },
              { q: 'Do you store my names?', a: "Anonymized logs for quality/abuse monitoring, keyed to a random hash, retained 30 days. Not tied to you, not sold, not used to train models. Your name, your verdict — we just count queries to keep the lights on." },
            ].map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </ScrollReveal>
      </Section>

      {/* Final CTA kept below, now wrapped */}

      {/* CTA */}
      <Section className="py-16 md:py-24" pattern="circles">
        <ScrollReveal>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6">
              Found something worth talking about?
            </h2>
            <p className="text-ink-muted text-lg mb-8 leading-relaxed">
              Brand naming is one knowledge-work domain among many. If this surfaced a gap — in your name, your positioning, or how your workflow actually runs — we can talk about whether a specialist team is the right answer.
            </p>
            <Button variant="primary" className="px-8 py-4" onClick={() => onNavigate('calendar')}>
              Talk to us
            </Button>
          </div>
        </ScrollReveal>
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
        <ChevronDownIcon className={`w-5 h-5 text-ink-muted flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <p className="text-ink-muted leading-relaxed pb-5 animate-in fade-in slide-in-from-top-1 duration-200">{a}</p>
      )}
    </div>
  );
};

export default BrandOSPage;
