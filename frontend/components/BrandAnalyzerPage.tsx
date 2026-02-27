
import React, { useState, useMemo } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, ArrowUpDown, Loader2, Sparkles, Rocket, TrendingUp, Building2, Search } from 'lucide-react';
import { Logo, ScrollReveal, Section, SectionHeader, GridPattern } from './Shared';
import Footer from './Footer';
import type { Page } from './types';
import { API_ENDPOINTS } from '../config';

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

// --- Header (minimal, page-specific) ---

const BrandAnalyzerNav: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/85 backdrop-blur-md shadow-sm py-3 border-b border-ink/5' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => onNavigate('landing')}>
          <Logo className="w-10 h-10 md:w-12 md:h-12 text-ink group-hover:text-accent transition-colors duration-500" />
          <div className="flex flex-col justify-center">
            <span className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-ink leading-none">DaVeenci</span>
            <span className="text-[0.6rem] md:text-[0.65rem] tracking-[0.25em] text-accent font-semibold uppercase mt-1 md:mt-1.5 ml-0.5">The Art of Automation</span>
          </div>
        </div>
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-ink-muted hover:text-accent transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Home</span>
        </button>
      </div>
    </header>
  );
};

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
          className={`relative p-4 md:p-6 border rounded-sm text-left transition-all duration-300 group
            ${isActive
              ? 'border-accent bg-accent/5 shadow-lg shadow-accent/10'
              : 'border-ink/10 bg-white hover:border-accent/30 hover:shadow-md'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className={`absolute top-0 left-0 w-full h-1 rounded-t-sm transition-all duration-300 ${isActive ? 'bg-accent' : 'bg-transparent group-hover:bg-accent/30'}`} />
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
    <div className="bg-white border border-ink/10 rounded-sm p-6 md:p-8 shadow-lg">
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
            className="w-full bg-base/30 border border-ink/20 p-3 text-ink rounded-sm placeholder:text-ink-muted/50 focus:border-accent focus:outline-none transition-colors disabled:opacity-50"
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
            className="w-full bg-base/30 border border-ink/20 p-3 text-ink rounded-sm placeholder:text-ink-muted/50 focus:border-accent focus:outline-none transition-colors resize-none disabled:opacity-50"
          />
        </div>

        <button
          onClick={onSubmit}
          disabled={disabled}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 font-sans text-sm font-medium transition-all duration-300 rounded-sm
            ${disabled
              ? 'bg-ink/20 text-ink-muted cursor-not-allowed'
              : 'bg-accent hover:bg-accent-hover text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95'}
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
    </div>
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
    <div className="bg-white border border-ink/10 rounded-sm shadow-lg overflow-hidden">
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
    </div>
  );
};

// --- Main Page ---

const BrandAnalyzerPage: React.FC<{ onNavigate: (page: Page, hash?: string, id?: string) => void }> = ({ onNavigate }) => {
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
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full overflow-x-hidden min-h-screen">
      <BrandAnalyzerNav onNavigate={onNavigate} />

      {/* Hero */}
      <Section className="pt-44 pb-12 md:pt-52 md:pb-16">
        <GridPattern />
        <ScrollReveal>
          <div className="max-w-3xl">
            <span className="block mb-4 font-script text-2xl text-accent -rotate-2 origin-bottom-left">
              Free Tool
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink leading-[1.1] mb-6">
              Brand Name<br />
              <span className="italic text-ink-muted/80">Sentiment Analyzer</span>
            </h1>
            <p className="font-sans text-lg md:text-xl text-ink-muted max-w-2xl leading-relaxed">
              Score your brand name across 10 weighted dimensions — clarity, trust, industry fit, and more.
              AI-powered analysis tailored to your business stage.
            </p>
          </div>
        </ScrollReveal>
      </Section>

      {/* Analyzer Tool */}
      <Section className="py-8 md:py-12">
        <div className="space-y-8">
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
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm">
              {error}
            </div>
          )}

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

      {/* CTA */}
      <Section className="py-16 md:py-24" pattern="circles">
        <ScrollReveal>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6">
              Need help choosing the right name?
            </h2>
            <p className="text-ink-muted text-lg mb-8 leading-relaxed">
              Our team helps founders and operators make data-driven branding decisions.
              Book a free consultation to discuss your results.
            </p>
            <button
              onClick={() => onNavigate('landing', '#booking')}
              className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent-hover text-white font-sans text-sm font-medium transition-all duration-300 rounded-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
            >
              Book a Free Call
            </button>
          </div>
        </ScrollReveal>
      </Section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default BrandAnalyzerPage;
