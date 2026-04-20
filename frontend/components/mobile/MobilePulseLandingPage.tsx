import React, { useEffect, useState } from 'react';
import { Mic, BarChart3, Sparkles, Send, Plus, Minus, FileText, Lightbulb, Calendar, Palette } from 'lucide-react';
import { MobileShell } from './MobileShell';
import { MobileButton } from './MobileButton';
import { MobileScenePlate } from './MobileScenePlate';
import type { Page } from '../types';

interface MobilePulseLandingPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const STEPS = [
  {
    icon: <Mic className="w-5 h-5 text-accent" />,
    n: '01',
    title: 'Collect',
    body: 'PulseNote automatically pulls transcripts from Fathom, Fireflies, or Otter.',
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-accent" />,
    n: '02',
    title: 'Analyze',
    body: 'AI surfaces key themes, aha moments, and actionable insights from every call.',
  },
  {
    icon: <Sparkles className="w-5 h-5 text-accent" />,
    n: '03',
    title: 'Generate',
    body: 'Pick the moments that matter. Pulse drafts newsletters, social posts, and visuals.',
  },
  {
    icon: <Send className="w-5 h-5 text-accent" />,
    n: '04',
    title: 'Publish',
    body: 'Approve drafts and schedule them to LinkedIn, Facebook, Instagram — one click, every platform.',
  },
];

const FEATURES = [
  {
    icon: <FileText className="w-5 h-5 text-accent" />,
    title: 'Meetings → content',
    body: 'Automatically surface the insights and aha moments that matter. Track the patterns your prospects care about most.',
  },
  {
    icon: <Lightbulb className="w-5 h-5 text-accent" />,
    title: 'Idea → post, in seconds',
    body: 'Type a rough idea, hit generate, get a polished LinkedIn post instantly. AI drafts, you refine.',
  },
  {
    icon: <Calendar className="w-5 h-5 text-accent" />,
    title: 'Stay on schedule',
    body: 'Schedule posts across LinkedIn, Facebook, and Instagram. Review the queue, adjust timing, approve.',
  },
  {
    icon: <Palette className="w-5 h-5 text-accent" />,
    title: 'Consistent branding',
    body: 'Add your colors, fonts, voice, and target audience. AI creates on-brand content every time.',
  },
];

const PERSONAS = [
  { title: 'The Founder', desc: 'Turn the brilliant business ideas that haunt you during the day into content.', img: '/personas/founder.jpg' },
  { title: 'The Podcaster', desc: 'Capture the ideas that light up your guest conversations and turn them into content.', img: '/personas/podcaster.jpg' },
  { title: 'The Salesman', desc: 'Extract winning patterns and objections from your best sales conversations.', img: '/personas/salesman.jpg' },
  { title: 'The Networker', desc: 'Generate blog posts, summaries, and shareable takeaways from networking events.', img: '/personas/networker.jpg' },
];

const FAQS = [
  {
    q: 'How does Pulse handle my data and privacy?',
    a: 'Your recordings and transcripts are encrypted at rest and in transit. We never share your data with third parties or use it to train models. You retain full ownership of all content generated.',
  },
  {
    q: 'What types of meetings work best with Pulse?',
    a: 'Pulse works with any recorded conversation — team standups, customer interviews, sales calls, podcasts, board meetings, and conference talks. If it has audio, Pulse can process it.',
  },
  {
    q: 'Can I edit the content before publishing?',
    a: "Absolutely. Every draft is fully editable. Pulse generates a starting point, then you refine, approve, or request a re-draft. You're always in control of what goes out.",
  },
  {
    q: 'What outputs does Pulse generate?',
    a: 'Newsletters, LinkedIn posts, Meta threads, blog summaries, AI-generated images, and insight reports. Each format is optimized for its platform and audience.',
  },
  {
    q: 'How does scheduling work?',
    a: 'Pulse proposes a weekly content calendar based on your meetings. You review the queue, adjust timing, and approve. Content goes out on schedule — or when you hit publish.',
  },
  {
    q: 'Who owns the content Pulse creates?',
    a: 'You do. 100%. Every word, image, and insight belongs to you. Cancel anytime and export everything.',
  },
];

export const MobilePulseLandingPage: React.FC<MobilePulseLandingPageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Pulse Note — DaVeenci';
    window.scrollTo(0, 0);
    return () => {
      document.title = 'DaVeenci | AI & Automation Consultancy';
    };
  }, []);

  const handleBook = () => onNavigate('calendar');

  return (
    <MobileShell onNavigate={onNavigate}>
      {/* Hero */}
      <section className="px-6 pt-10 pb-10">
        <div className="inline-block mb-5 font-mono text-[10px] tracking-[0.25em] uppercase text-accent bg-accent/5 border border-accent/10 rounded-sm px-2.5 py-1">
          Introducing Pulse Note
        </div>
        <h1 className="font-serif text-[2.75rem] leading-[1.05] text-ink mb-5 tracking-tight">
          Your ideas and meeting insights
          <br />
          <span className="italic text-ink-muted/70">turned into content.</span>
        </h1>
        <p className="font-serif text-[17px] text-ink-muted leading-[1.6] mb-6">
          Pulse Note analyzes your calls, surfaces the insights and themes that matter, and drafts publish-ready newsletters, social posts, and visuals on autopilot.
        </p>
        <div className="flex flex-col gap-3">
          <MobileButton onClick={handleBook}>Book a demo</MobileButton>
        </div>
      </section>

      {/* How it works — 4 steps */}
      <section className="px-6 py-10 bg-white/40">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">
            How it works
          </span>
        </div>
        <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-6 tracking-tight">
          Four steps, <span className="italic text-ink-muted/70">on autopilot.</span>
        </h2>
        <ol className="space-y-5">
          {STEPS.map((s) => (
            <li key={s.n} className="flex gap-4">
              <div className="w-10 h-10 rounded-sm border border-accent/20 bg-accent/5 flex items-center justify-center flex-shrink-0">
                {s.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-ink-muted">{s.n}</span>
                  <h3 className="font-serif text-lg text-ink">{s.title}</h3>
                </div>
                <p className="font-sans text-[14px] text-ink-muted leading-relaxed">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* What you can do — 4 features */}
      <section className="px-6 py-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">
            The Product
          </span>
        </div>
        <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-6 tracking-tight">
          What you can do <br />
          <span className="italic text-ink-muted/70">with Pulse.</span>
        </h2>
        <div className="space-y-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white/60 border border-ink/10 rounded-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-sm border border-accent/20 bg-accent/5 flex items-center justify-center">
                  {f.icon}
                </div>
                <h3 className="font-serif text-lg text-ink">{f.title}</h3>
              </div>
              <p className="font-sans text-[14px] text-ink-muted leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section className="px-6 py-10 bg-white/40">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">
            Use Cases
          </span>
        </div>
        <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-6 tracking-tight">
          Who Pulse is <span className="italic text-ink-muted/70">for.</span>
        </h2>
        <div className="space-y-4">
          {PERSONAS.map((p) => (
            <div key={p.title} className="bg-white border border-ink/10 rounded-sm p-4 flex gap-4 items-center">
              <div className="w-20 h-20 rounded-full bg-pulse-surface border border-ink/10 flex-shrink-0 overflow-hidden">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover object-top scale-150" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-lg text-ink mb-1">{p.title}</h3>
                <p className="font-sans text-[13px] text-ink-muted leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">
            FAQ
          </span>
        </div>
        <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-6 tracking-tight">
          Common <span className="italic text-ink-muted/70">questions.</span>
        </h2>
        <ol className="border-t border-ink/10">
          {FAQS.map((item, i) => {
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
      <section className="px-6 py-12 bg-white/40 border-t border-ink/5">
        <MobileScenePlate figLabel="Book a demo">
          <h2 className="font-serif text-[1.75rem] leading-[1.15] text-ink mb-3 tracking-tight">
            Ready to turn meetings <br />
            <span className="italic text-accent">into content?</span>
          </h2>
          <p className="font-sans text-[14px] text-ink-muted leading-relaxed mb-5">
            Thirty minutes, no slide deck. We'll show you PulseNote on your own meeting data and answer anything.
          </p>
          <MobileButton onClick={handleBook}>Book a demo</MobileButton>
        </MobileScenePlate>
      </section>
    </MobileShell>
  );
};
