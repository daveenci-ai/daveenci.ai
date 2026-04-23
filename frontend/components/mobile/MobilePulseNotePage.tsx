import React, { useEffect, useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { MobileShell } from './MobileShell';
import { MobileButton } from './MobileButton';
import { Widget } from '../Shared';
import {
  PulseHeroDiagram,
  MeetingAnalyzerAnimation,
  IdeaToContentAnimation,
  ScheduleAnimation,
  BrandingAnimation,
  CreatorMode,
} from '../PulseNotePage';
import { BookingWidget } from '../BookingWidget';
import AstridSketch from '../../images/Astrid_Sketch.webp';
import type { Page } from '../types';

interface MobilePulseNotePageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const PERSONAS = [
  { title: 'The Founder', desc: 'Turn the brilliant business ideas that haunt you during the day into content.', img: '/personas/founder.jpg' },
  { title: 'The Podcaster', desc: 'Capture the ideas that light up your guest conversations and turn them into content.', img: '/personas/podcaster.jpg' },
  { title: 'The Salesman', desc: 'Extract winning patterns and objections from your best sales conversations.', img: '/personas/salesman.jpg' },
  { title: 'The Networker', desc: 'Generate blog posts, summaries, and shareable takeaways from networking events.', img: '/personas/networker.jpg' },
];

const FAQS = [
  { q: 'How does Pulse handle my data and privacy?', a: 'Your recordings and transcripts are encrypted at rest and in transit. We never share your data with third parties or use it to train models. You retain full ownership of all content generated.' },
  { q: 'What types of meetings work best with Pulse?', a: 'Pulse works with any recorded conversation — team standups, customer interviews, sales calls, podcasts, board meetings, and conference talks. If it has audio, Pulse can process it.' },
  { q: 'Can I edit the content before publishing?', a: "Absolutely. Every draft is fully editable. Pulse generates a starting point, then you refine, approve, or request a re-draft. You're always in control of what goes out." },
  { q: 'What outputs does Pulse generate?', a: 'Newsletters, LinkedIn posts, Meta threads, blog summaries, AI-generated images, and insight reports. Each format is optimized for its platform and audience.' },
  { q: 'How does scheduling work?', a: 'Pulse proposes a weekly content calendar based on your meetings. You review the queue, adjust timing, and approve. Content goes out on schedule — or when you hit publish.' },
  { q: 'Who owns the content Pulse creates?', a: 'You do. 100%. Every word, image, and insight belongs to you. Cancel anytime and export everything.' },
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

export const MobilePulseNotePage: React.FC<MobilePulseNotePageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Pulse Note — DaVeenci';
    window.scrollTo(0, 0);
    return () => {
      document.title = 'DaVeenci | AI & Automation Consultancy';
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <MobileShell onNavigate={onNavigate}>
      {/* Hero */}
      <section className="px-6 pt-10 pb-10">
        <div className="inline-block mb-5 font-mono text-[10px] tracking-[0.25em] uppercase text-accent bg-accent/5 border border-accent/10 rounded-sm px-2.5 py-1">
          Introducing Pulse Note
        </div>
        <h1 className="font-serif text-[2.5rem] leading-[1.05] text-ink mb-5 tracking-tight">
          Your ideas and meeting insights
          <br />
          <span className="italic text-ink-muted/70">turned into content.</span>
        </h1>
        <p className="font-serif text-[16px] text-ink-muted leading-[1.6] mb-6">
          Pulse Note analyzes your calls, surfaces the insights and themes that matter, and drafts publish-ready newsletters, social posts, and visuals on autopilot.
        </p>
        <div className="flex flex-col gap-3 mb-8">
          <MobileButton onClick={() => scrollTo('booking')}>Book a demo</MobileButton>
          <MobileButton variant="secondary" onClick={() => scrollTo('try-it')}>See how it works</MobileButton>
        </div>

        <div className="flex justify-center">
          <PulseHeroDiagram />
        </div>
      </section>

      {/* The Product */}
      <section className="px-6 py-10 bg-white/40">
        <SectionEyebrow>The Product</SectionEyebrow>
        <h2 className="font-serif text-[1.9rem] leading-[1.1] text-ink mb-8 tracking-tight">
          From raw ideas <br />
          <span className="italic text-ink-muted/70">to polished content.</span>
        </h2>

        <div className="space-y-14">
          <FeatureRow
            heading="Turn meeting insights into content"
            body="Automatically identify trends and surface the insights that matter from every meeting. Track the actions and aha moments that matter most for your prospects."
            bullets={[
              'Full transcripts with speaker attribution',
              'Key insight extraction & aha-moment highlighting',
              'Theme clustering across multiple meetings',
            ]}
          >
            <MeetingAnalyzerAnimation />
          </FeatureRow>

          <FeatureRow
            heading="From idea to content in seconds"
            body="Type a rough idea, hit generate, and get polished LinkedIn posts instantly. AI drafts, you refine — publish when ready."
            bullets={[
              'Platform-optimized drafts in one click',
              'Maintains your authentic voice and tone',
              'Review and edit before anything ships',
            ]}
          >
            <IdeaToContentAnimation />
          </FeatureRow>

          <FeatureRow
            heading="Stay on schedule"
            body="Schedule posts across LinkedIn, Facebook, and Instagram from one queue. Review the week, adjust timing, approve."
            bullets={[
              'Weekly calendar proposed from your meetings',
              'Cross-platform: LinkedIn, Meta, Instagram',
              'Approve once — publishes on schedule',
            ]}
          >
            <ScheduleAnimation />
          </FeatureRow>

          <FeatureRow
            heading="Consistent branding, every time"
            body="Set your colors, fonts, voice, and target audience once. Pulse creates on-brand content across every deliverable."
            bullets={[
              'Palette, fonts, voice: set once, applied always',
              'Branded visuals for every post and newsletter',
              'Rebrand in an afternoon, not a sprint',
            ]}
          >
            <BrandingAnimation />
          </FeatureRow>
        </div>
      </section>

      {/* Try It — CreatorMode */}
      <section id="try-it" className="px-6 py-10">
        <SectionEyebrow>Try It</SectionEyebrow>
        <h2 className="font-serif text-[1.9rem] leading-[1.1] text-ink mb-3 tracking-tight">
          Create a post. <span className="italic text-ink-muted/70">Right now.</span>
        </h2>
        <p className="font-serif text-[15px] text-ink-muted leading-relaxed mb-6">
          Give Pulse a topic and watch it draft a post, generate visuals, and queue it up — no setup required.
        </p>
        <CreatorMode />
      </section>

      {/* Use Cases */}
      <section className="px-6 py-10 bg-white/40">
        <SectionEyebrow>Use Cases</SectionEyebrow>
        <h2 className="font-serif text-[1.9rem] leading-[1.1] text-ink mb-6 tracking-tight">
          Who Pulse is <span className="italic text-ink-muted/70">for.</span>
        </h2>
        <div className="space-y-4">
          {PERSONAS.map((p) => (
            <div key={p.title} className="bg-white border border-ink/10 p-5 shadow-sm hover:shadow-lg transition-all rounded-lg text-center flex flex-col items-center">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full bg-pulse-surface border border-ink/10 overflow-hidden flex items-center justify-center">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover object-top scale-150" />
              </div>
              <h3 className="font-serif text-lg text-ink mb-2">{p.title}</h3>
              <p className="font-sans text-[14px] text-ink-muted leading-relaxed">{p.desc}</p>
            </div>
          ))}
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
              <li key={i} className="border-b border-ink/10 last:border-b-0">
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

      {/* Book a Pulse demo */}
      <div id="booking">
        <BookingWidget
          onNavigate={onNavigate}
          eyebrow="Pulse Demo"
          title="Book a Pulse Demo"
          subtitle="See how Pulse turns your meetings into a content engine. Pick a time that works for you."
          leftBody="I will walk you through how Pulse Note captures meetings, extracts insights, and generates publish-ready content, tailored to your brand and workflow."
          bookingType="demo-ai"
          hostName="Astrid Abrahamyan"
          hostRole="Partner"
          hostImage={AstridSketch}
        />
      </div>
    </MobileShell>
  );
};
