import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, LockKeyhole, RotateCcw, ShieldCheck, Send } from 'lucide-react';
import { Section, SectionHeader, ScrollReveal } from './Shared';
import { track } from '../lib/analytics';

type GateKey = 'approved' | 'enabled' | 'unexpired';

interface GateDef {
  key: GateKey;
  label: string;
  onNote: string;
  failNote: string;
}

const GATES: GateDef[] = [
  { key: 'approved', label: 'Approved?', onNote: 'strategy version approved', failNote: 'unapproved strategy' },
  { key: 'enabled', label: 'Enabled?', onNote: 'venue + environment enabled', failNote: 'venue not enabled' },
  { key: 'unexpired', label: 'Unexpired?', onNote: 'signal still fresh', failNote: 'signal expired' },
];

interface Run {
  id: number;
  snapshot: Record<GateKey, boolean>;
  failIndex: number; // -1 = paper fill
}

const runLine = (run: Run): string => {
  const tokens = GATES.map((g, i) => {
    if (run.failIndex !== -1 && i > run.failIndex) return '—';
    return run.snapshot[g.key] ? 'ok' : 'BLOCK';
  }).join(' ');
  const tail = run.failIndex === -1 ? 'paper fill' : `rejected @ ${GATES[run.failIndex].label}`;
  return `SIG-${String(run.id).padStart(2, '0')} [${tokens}] ${tail}`;
};

export const GateSimulator: React.FC = () => {
  const [gates, setGates] = useState<Record<GateKey, boolean>>({
    approved: true,
    enabled: true,
    unexpired: true,
  });
  const [runs, setRuns] = useState<Run[]>([]);
  const [outcome, setOutcome] = useState<Run | null>(null);
  const [travelStep, setTravelStep] = useState(-1);
  const [sending, setSending] = useState(false);
  const runId = useRef(0);
  const timer = useRef<number | null>(null);
  const demoStarted = useRef(false);
  const demoCompleted = useRef(false);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  const markStart = () => {
    if (demoStarted.current) return;
    demoStarted.current = true;
    track('demo_start', { demo_id: 'compoundiq_gate_sim' });
  };

  const toggleGate = (key: GateKey) => {
    if (sending) return;
    markStart();
    setOutcome(null);
    setGates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const send = () => {
    if (sending) return;
    markStart();
    setSending(true);
    setOutcome(null);
    const snapshot = { ...gates };
    const failIndex = GATES.findIndex((g) => !snapshot[g.key]);
    const steps = failIndex === -1 ? GATES.length : failIndex + 1;

    const finish = () => {
      const run: Run = { id: ++runId.current, snapshot, failIndex };
      setOutcome(run);
      setRuns((prev) => [run, ...prev].slice(0, 5));
      setSending(false);
      setTravelStep(-1);
      if (!demoCompleted.current) {
        demoCompleted.current = true;
        track('demo_complete', { demo_id: 'compoundiq_gate_sim' });
      }
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return;
    }
    let i = 0;
    const tick = () => {
      setTravelStep(i);
      if (i < steps - 1) {
        i += 1;
        timer.current = window.setTimeout(tick, 320);
      } else {
        timer.current = window.setTimeout(finish, 380);
      }
    };
    tick();
  };

  const reset = () => {
    if (sending) return;
    setGates({ approved: true, enabled: true, unexpired: true });
    setOutcome(null);
  };

  const nodeState = (index: number): 'idle' | 'checking' | 'pass' | 'block' => {
    if (sending) {
      if (travelStep < index) return 'idle';
      if (travelStep === index) return gates[GATES[index].key] ? 'checking' : 'block';
      return 'pass';
    }
    if (outcome) {
      if (outcome.failIndex !== -1 && index > outcome.failIndex) return 'idle';
      return outcome.snapshot[GATES[index].key] ? 'pass' : 'block';
    }
    return 'idle';
  };

  return (
    <Section id="compoundiq-gate" className="py-20 md:py-28">
      <SectionHeader
        eyebrow="Try the gate"
        title="Send a signal through the gate."
        subtitle="An illustration of the policy gate above — flip a condition, send a signal, and watch where it stops. No live orders, no market data; the real loop runs on paper by design."
      />
      <ScrollReveal>
        <div className="max-w-5xl mx-auto bg-white/55 border border-ink/10 rounded-sm shadow-sm p-6 md:p-10">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">Fig. ii · The action gate</div>
            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-amber-800">
              <LockKeyhole className="w-3.5 h-3.5" /> live disabled
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-4">
              {GATES.map((gate) => (
                <div key={gate.key} className="flex items-center justify-between gap-4 border border-ink/10 bg-white/60 rounded-sm px-4 py-3">
                  <div>
                    <div className="font-serif text-lg text-ink">{gate.label}</div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted mt-0.5">
                      {gates[gate.key] ? gate.onNote : gate.failNote}
                    </div>
                  </div>
                  <button
                    role="switch"
                    aria-checked={gates[gate.key]}
                    aria-label={`${gate.label} ${gates[gate.key] ? 'passing' : 'blocking'}`}
                    onClick={() => toggleGate(gate.key)}
                    disabled={sending}
                    className={`relative w-16 h-7 rounded-full border transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      gates[gate.key] ? 'bg-accent/15 border-accent/40' : 'bg-amber-800/10 border-amber-800/40'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-[22px] w-5 rounded-full transition-all ${
                        gates[gate.key] ? 'left-[38px] bg-accent' : 'left-0.5 bg-amber-800'
                      }`}
                    />
                    <span className={`absolute inset-0 flex items-center font-mono text-[8px] uppercase tracking-widest ${
                      gates[gate.key] ? 'justify-start pl-2 text-accent' : 'justify-end pr-2 text-amber-800'
                    }`}>
                      {gates[gate.key] ? 'pass' : 'block'}
                    </span>
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={send}
                  disabled={sending}
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-60 text-white font-sans text-sm font-medium px-6 py-3 rounded-sm transition-colors"
                >
                  <Send className="w-4 h-4" /> {sending ? 'Checking gates…' : 'Send signal'}
                </button>
                <button
                  onClick={reset}
                  disabled={sending}
                  className="inline-flex items-center gap-2 font-sans text-sm text-ink-muted hover:text-ink transition-colors px-3 py-3"
                >
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="flex items-center gap-1 mb-6" aria-hidden="true">
                <div className="font-mono text-[9px] uppercase tracking-widest text-ink-muted mr-2">signal</div>
                {GATES.map((gate, i) => {
                  const state = nodeState(i);
                  return (
                    <React.Fragment key={gate.key}>
                      <div className={`h-px flex-1 ${state === 'idle' ? 'bg-ink/15' : 'bg-accent'}`} />
                      <div
                        className={`flex items-center gap-1.5 border rounded-sm px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-widest transition-colors ${
                          state === 'pass'
                            ? 'border-green-700/40 bg-green-700/10 text-green-800'
                            : state === 'block'
                              ? 'border-amber-800/50 bg-amber-800/10 text-amber-800'
                              : state === 'checking'
                                ? 'border-accent/60 bg-accent/10 text-accent'
                                : 'border-ink/15 text-ink-muted'
                        }`}
                      >
                        {state === 'pass' && <CheckCircle2 className="w-3 h-3" />}
                        {state === 'block' && <LockKeyhole className="w-3 h-3" />}
                        {gate.label}
                      </div>
                    </React.Fragment>
                  );
                })}
                <div className={`h-px flex-1 ${outcome && outcome.failIndex === -1 ? 'bg-accent' : 'bg-ink/15'}`} />
                <div className="font-mono text-[9px] uppercase tracking-widest text-ink-muted ml-2">paper fill</div>
              </div>

              <div aria-live="polite" className="min-h-[56px] mb-5">
                {outcome && (
                  <div
                    className={`flex items-start gap-3 border rounded-sm px-4 py-3 ${
                      outcome.failIndex === -1
                        ? 'border-green-700/40 bg-green-700/10'
                        : 'border-amber-800/40 bg-amber-800/10'
                    }`}
                  >
                    {outcome.failIndex === -1 ? (
                      <CheckCircle2 className="w-5 h-5 text-green-800 mt-0.5 flex-shrink-0" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-amber-800 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <div className="font-serif text-lg text-ink leading-snug">
                        {outcome.failIndex === -1
                          ? 'Paper fill recorded — approved, enabled, unexpired.'
                          : `Stopped at ${GATES[outcome.failIndex].label} — ${GATES[outcome.failIndex].failNote}.`}
                      </div>
                      <div className="font-sans text-[13px] text-ink-muted mt-1">
                        {outcome.failIndex === -1
                          ? 'Simulated, with fees and slippage. The gate held; the fill is paper.'
                          : 'No fill. The signal never reached the executor.'}
                      </div>
                    </div>
                  </div>
                )}
                {!outcome && !sending && (
                  <p className="font-serif italic text-ink-muted/70 text-[15px] px-1">
                    Flip a gate, then send. The gate consumer checks all three conditions at execution time.
                  </p>
                )}
              </div>

              <div className="border border-ink/15 bg-ink/[0.03] rounded-sm px-4 py-3 font-mono text-[11px] leading-relaxed text-ink-muted">
                {runs.length === 0 ? (
                  <div className="text-ink-muted/60">{'// each signal writes one audit line'}</div>
                ) : (
                  runs.map((run) => <div key={run.id}>{runLine(run)}</div>)
                )}
              </div>
            </div>
          </div>

          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted/70 mt-8">
            Illustrative only — labels describe engineering behavior, not investment performance.
          </p>
        </div>
      </ScrollReveal>
    </Section>
  );
};
