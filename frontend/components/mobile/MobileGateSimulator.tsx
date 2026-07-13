import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, LockKeyhole, RotateCcw, Send } from 'lucide-react';
import { track } from '../../lib/analytics';

type GateKey = 'approved' | 'enabled' | 'unexpired';

const GATES: { key: GateKey; label: string; onNote: string; failNote: string }[] = [
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

export const MobileGateSimulator: React.FC = () => {
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
      setRuns((prev) => [run, ...prev].slice(0, 4));
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

  const chipState = (index: number): 'idle' | 'checking' | 'pass' | 'block' => {
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
    <section id="compoundiq-gate" className="px-6 py-12">
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px w-8 bg-ink-muted/30" />
        <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">Try the gate</span>
      </div>
      <h2 className="font-serif text-[2.15rem] leading-[1.08] text-ink mb-4 tracking-tight">
        Send a signal
        <br />
        <span className="italic text-ink-muted/70">through the gate.</span>
      </h2>
      <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-7">
        Flip a condition, send a signal, and watch where it stops. No live orders, no market data — an illustration of the policy gate above.
      </p>

      <div className="bg-white/55 border border-ink/10 rounded-sm p-5">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">Fig. ii · The action gate</div>
          <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-amber-800">
            <LockKeyhole className="w-3 h-3" /> live disabled
          </div>
        </div>

        <div className="space-y-3 mb-5">
          {GATES.map((gate) => (
            <div key={gate.key} className="flex items-center justify-between gap-3 border border-ink/10 bg-white/60 rounded-sm px-3.5 py-3">
              <div>
                <div className="font-serif text-[17px] text-ink">{gate.label}</div>
                <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted mt-0.5">
                  {gates[gate.key] ? gate.onNote : gate.failNote}
                </div>
              </div>
              <button
                role="switch"
                aria-checked={gates[gate.key]}
                aria-label={`${gate.label} ${gates[gate.key] ? 'passing' : 'blocking'}`}
                onClick={() => toggleGate(gate.key)}
                disabled={sending}
                className={`relative w-16 h-8 rounded-full border transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  gates[gate.key] ? 'bg-accent/15 border-accent/40' : 'bg-amber-800/10 border-amber-800/40'
                }`}
              >
                <span
                  className={`absolute top-1 h-6 w-6 rounded-full transition-all ${
                    gates[gate.key] ? 'left-9 bg-accent' : 'left-1 bg-amber-800'
                  }`}
                />
                <span
                  className={`absolute inset-0 flex items-center font-mono text-[8px] uppercase tracking-widest ${
                    gates[gate.key] ? 'justify-start pl-2 text-accent' : 'justify-end pr-2 text-amber-800'
                  }`}
                >
                  {gates[gate.key] ? 'pass' : 'block'}
                </span>
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1 mb-5" aria-hidden="true">
          {GATES.map((gate, i) => {
            const state = chipState(i);
            return (
              <React.Fragment key={gate.key}>
                {i > 0 && <div className={`h-px flex-1 ${state === 'idle' ? 'bg-ink/15' : 'bg-accent'}`} />}
                <div
                  className={`flex items-center gap-1 border rounded-sm px-2 py-1 font-mono text-[9px] uppercase tracking-widest transition-colors ${
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
                  {gate.label.replace('?', '')}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={send}
            disabled={sending}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-accent active:bg-accent-hover disabled:opacity-60 text-white font-sans text-[14px] font-medium px-5 py-3.5 rounded-sm transition-colors"
          >
            <Send className="w-4 h-4" /> {sending ? 'Checking gates…' : 'Send signal'}
          </button>
          <button
            onClick={() => {
              if (sending) return;
              setGates({ approved: true, enabled: true, unexpired: true });
              setOutcome(null);
            }}
            disabled={sending}
            aria-label="Reset gates"
            className="p-3.5 border border-ink/15 rounded-sm text-ink-muted active:text-ink"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div aria-live="polite" className="mb-4">
          {outcome && (
            <div
              className={`border rounded-sm px-3.5 py-3 ${
                outcome.failIndex === -1 ? 'border-green-700/40 bg-green-700/10' : 'border-amber-800/40 bg-amber-800/10'
              }`}
            >
              <div className="font-serif text-[16px] text-ink leading-snug">
                {outcome.failIndex === -1
                  ? 'Paper fill recorded — approved, enabled, unexpired.'
                  : `Stopped at ${GATES[outcome.failIndex].label} — ${GATES[outcome.failIndex].failNote}.`}
              </div>
              <div className="font-sans text-[13px] text-ink-muted mt-1">
                {outcome.failIndex === -1
                  ? 'Simulated, with fees and slippage.'
                  : 'No fill. The signal never reached the executor.'}
              </div>
            </div>
          )}
        </div>

        <div className="border border-ink/15 bg-ink/[0.03] rounded-sm px-3.5 py-2.5 font-mono text-[11px] leading-relaxed text-ink-muted overflow-x-auto">
          {runs.length === 0 ? (
            <div className="text-ink-muted/60">{'// each signal writes one audit line'}</div>
          ) : (
            runs.map((run) => <div key={run.id} className="whitespace-nowrap">{runLine(run)}</div>)
          )}
        </div>

        <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-ink-muted/70 mt-4 leading-relaxed">
          Illustrative only — labels describe engineering behavior, not investment performance.
        </p>
      </div>
    </section>
  );
};
