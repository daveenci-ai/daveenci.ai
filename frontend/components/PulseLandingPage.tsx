
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, User, Mail, HelpCircle, Clock, Check, Menu, X, Mic, BarChart3, Send, Sparkles, Image, CalendarDays, Lightbulb, MessageCircle, Users, Headphones, Briefcase, RefreshCw, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { ScrollReveal, Section, SectionHeader, Button, Logo, GridPattern, VitruvianBackground, CustomSelect } from './Shared';
import { API_ENDPOINTS } from '../config';
import type { Page } from './types';
import AstridSketch from '../images/Astrid_Sketch.jpg';
import NewsletterVisual from '../images/pulse-visual-newsletter.svg';
import SocialVisual from '../images/pulse-visual-social.svg';
import BlogVisual from '../images/pulse-visual-blog.svg';
import WorkflowVisual from '../images/001 - What is an Agentic Workflow.jpg';
import PipelineVisual from '../images/002 - Synthetic Data Pipelines.jpg';
import CrmVisual from '../images/003 - Zero-Touch CRM.jpg';
import RagVisual from '../images/004 - RAG vs. Long Context.jpg';
import {
  BUSINESS_TIMEZONE,
  BUSINESS_HOURS,
  MEETING_DURATION_MINUTES,
  BUFFER_MINUTES,
  MONTH_NAMES,
  buildDisplaySlots,
  getAvailabilityRange,
  checkSlotAvailability as checkSharedSlotAvailability,
  isDayDisabled,
} from './calendarAvailability';

interface PulseLandingPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

// ─── Pulse Nav ─────────────────────────────────────────────────────────────────

const PulseNav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Product', href: '#product' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Outputs', href: '#outputs' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'FAQ', href: '#faq' },
  ];

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.getElementById(href.replace('#', ''));
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-ink/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-serif text-xl text-ink tracking-wide">DaVeenci</span>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <button key={l.href} onClick={() => scrollTo(l.href)} className="text-sm font-medium text-ink-muted hover:text-ink transition-colors">
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden md:block">
          <button onClick={() => scrollTo('#booking')} className="inline-flex items-center px-5 py-2 text-sm font-medium bg-accent hover:bg-accent-hover text-white transition-all shadow-sm hover:shadow-md active:scale-95">
            Book a Demo
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-ink" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-ink/10 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          {links.map(l => (
            <button key={l.href} onClick={() => scrollTo(l.href)} className="block text-sm font-medium text-ink-muted hover:text-ink transition-colors">
              {l.label}
            </button>
          ))}
          <button onClick={() => scrollTo('#booking')} className="block w-full text-center px-5 py-2.5 text-sm font-medium bg-accent text-white mt-4">
            Book a Demo
          </button>
        </div>
      )}
    </nav>
  );
};

// ─── Hero Diagram (Dashboard sketch) ───────────────────────────────────────────

const PulseHeroDiagram: React.FC = () => (
  <div className="relative w-full max-w-lg mx-auto aspect-[4/3] bg-white shadow-2xl shadow-ink/20 rounded-sm border border-ink/10 p-6 md:p-8 rotate-[-2deg] hover:rotate-0 transition-transform duration-700 ease-out group">
    {/* Window chrome */}
    <div className="flex justify-between items-center mb-6 border-b border-ink/10 pb-3">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-red-300/60"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-300/60"></div>
        <div className="w-3 h-3 rounded-full bg-green-300/60"></div>
      </div>
      <div className="font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">Pulse Dashboard v1.0</div>
    </div>

    <svg className="w-full h-full" viewBox="0 0 320 200" fill="none">
      {/* Waveform */}
      <rect x="10" y="10" width="180" height="60" rx="4" stroke="#C4B59D" strokeWidth="1" fill="none" />
      <text x="18" y="24" fontSize="8" fill="#5A4A3A" fontFamily="monospace" letterSpacing="0.05em">WAVEFORM</text>
      <path d="M 20 50 Q 35 30, 50 50 T 80 50 T 110 50 T 140 50 T 170 50" stroke="#3f84c8" strokeWidth="1.5" fill="none" />
      <path d="M 20 50 Q 35 60, 50 50 T 80 50 T 110 50 T 140 50 T 170 50" stroke="#3f84c8" strokeWidth="1" fill="none" opacity="0.4" />

      {/* Insight cards */}
      <rect x="200" y="10" width="110" height="28" rx="3" stroke="#222" strokeWidth="1" fill="white" />
      <circle cx="212" cy="24" r="5" fill="#3f84c8" opacity="0.3" />
      <line x1="222" y1="21" x2="296" y2="21" stroke="#222" strokeWidth="1" opacity="0.3" />
      <line x1="222" y1="27" x2="270" y2="27" stroke="#222" strokeWidth="1" opacity="0.15" />

      <rect x="200" y="44" width="110" height="28" rx="3" stroke="#222" strokeWidth="1" fill="white" />
      <circle cx="212" cy="58" r="5" fill="#C4B59D" opacity="0.5" />
      <line x1="222" y1="55" x2="296" y2="55" stroke="#222" strokeWidth="1" opacity="0.3" />
      <line x1="222" y1="61" x2="258" y2="61" stroke="#222" strokeWidth="1" opacity="0.15" />

      {/* Themes cluster */}
      <rect x="10" y="80" width="130" height="110" rx="4" stroke="#C4B59D" strokeWidth="1" fill="none" />
      <text x="18" y="94" fontSize="8" fill="#5A4A3A" fontFamily="monospace" letterSpacing="0.05em">THEMES</text>
      <circle cx="50" cy="140" r="18" stroke="#3f84c8" strokeWidth="1" fill="#3f84c8" fillOpacity="0.08" />
      <circle cx="90" cy="130" r="14" stroke="#C4B59D" strokeWidth="1" fill="#C4B59D" fillOpacity="0.08" />
      <circle cx="70" cy="160" r="10" stroke="#222" strokeWidth="1" fill="#222" fillOpacity="0.05" />
      <text x="50" y="143" textAnchor="middle" fontSize="7" fill="#3f84c8" fontFamily="monospace">Product</text>
      <text x="90" y="133" textAnchor="middle" fontSize="6" fill="#5A4A3A" fontFamily="monospace">Growth</text>
      <text x="70" y="163" textAnchor="middle" fontSize="5" fill="#222" fontFamily="monospace">Ops</text>

      {/* Content queue */}
      <rect x="150" y="80" width="160" height="110" rx="4" stroke="#C4B59D" strokeWidth="1" fill="none" />
      <text x="158" y="94" fontSize="8" fill="#5A4A3A" fontFamily="monospace" letterSpacing="0.05em">CONTENT QUEUE</text>
      <rect x="158" y="102" width="144" height="22" rx="2" fill="#3f84c8" fillOpacity="0.06" stroke="#3f84c8" strokeWidth="0.5" />
      <text x="166" y="116" fontSize="7" fill="#3f84c8" fontFamily="monospace">Newsletter Draft</text>
      <circle cx="290" cy="113" r="4" fill="#22c55e" opacity="0.6" />
      <rect x="158" y="130" width="144" height="22" rx="2" fill="#222" fillOpacity="0.03" stroke="#222" strokeWidth="0.5" />
      <text x="166" y="144" fontSize="7" fill="#222" fontFamily="monospace">LinkedIn Post</text>
      <circle cx="290" cy="141" r="4" fill="#eab308" opacity="0.6" />
      <rect x="158" y="158" width="144" height="22" rx="2" fill="#222" fillOpacity="0.03" stroke="#222" strokeWidth="0.5" />
      <text x="166" y="172" fontSize="7" fill="#222" fontFamily="monospace">Twitter Thread</text>
      <circle cx="290" cy="169" r="4" fill="#eab308" opacity="0.6" />
    </svg>

    {/* Floating annotation cards */}
    <div className="absolute -top-4 -right-4 bg-base shadow-lg border border-ink/10 px-3 py-1.5 rounded flex items-center gap-2 animate-float">
      <Sparkles className="w-3.5 h-3.5 text-accent" />
      <span className="text-[11px] font-medium text-ink">3 Aha Moments</span>
    </div>
    <div className="absolute -bottom-3 -left-3 bg-base shadow-lg border border-ink/10 px-3 py-1.5 rounded flex items-center gap-2 animate-float-delayed">
      <Send className="w-3.5 h-3.5 text-ink-muted" />
      <span className="text-[11px] font-medium text-ink">5 Drafts Ready</span>
    </div>
  </div>
);

// ─── Hero Section ──────────────────────────────────────────────────────────────

const PulseHero: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <Section className="pt-32 pb-20 md:pt-40 md:pb-28 min-h-[90vh] flex items-center">
      <VitruvianBackground className="opacity-[0.08]" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <div className="lg:col-span-6 relative z-20">
          <ScrollReveal delay={200}>
            <span className="inline-block mb-4 font-mono text-xs font-bold text-accent uppercase tracking-widest bg-accent/5 px-3 py-1 border border-accent/10 rounded-sm">
              Introducing Pulse Note
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink leading-[1.1] mb-6">
              Your meetings,<br />
              <span className="italic text-ink-muted/80">turned into content.</span>
            </h1>
            <p className="font-sans text-lg md:text-xl text-ink-muted max-w-xl leading-relaxed mb-8">
              Pulse Note analyzes your calls, surfaces the insights and themes that matter, and drafts publish-ready newsletters, social posts, and visuals on autopilot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" onClick={() => scrollTo('booking')} className="text-base px-8 py-4">Book a Demo</Button>
              <Button variant="secondary" onClick={() => scrollTo('how-it-works')} className="text-base px-8 py-4">See How It Works</Button>
            </div>
          </ScrollReveal>
        </div>

        <div className="lg:col-span-6 relative h-[400px] md:h-[480px] flex items-center justify-center">
          <ScrollReveal delay={500} direction="left" className="w-full flex justify-center">
            <PulseHeroDiagram />
          </ScrollReveal>
        </div>
      </div>
    </Section>
  );
};

// ─── What Pulse Does (3-step) ──────────────────────────────────────────────────

const steps = [
  {
    icon: <Mic className="w-8 h-8 text-accent" />,
    title: 'Record',
    description: 'Pulse joins your meetings or ingests recordings. Every word captured, every nuance preserved.',
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-accent" />,
    title: 'Analyze',
    description: 'AI surfaces key themes, aha moments, and actionable insights from your conversations.',
  },
  {
    icon: <Send className="w-8 h-8 text-accent" />,
    title: 'Publish',
    description: 'Drafts newsletters, social posts, and images — ready for review and scheduling.',
  },
];

const WhatPulseDoes: React.FC = () => (
  <Section id="product" pattern="grid">
    <SectionHeader eyebrow="The Product" title="Three steps. Zero blank pages." subtitle="From raw conversation to polished content, automatically." />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {steps.map((step, i) => (
        <ScrollReveal key={step.title} delay={i * 150} className="h-full">
          <div className="bg-white border border-ink/10 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group h-full flex flex-col">
            <div className="mb-6 w-14 h-14 bg-accent/5 border border-accent/10 rounded-sm flex items-center justify-center group-hover:bg-accent/10 transition-colors">
              {step.icon}
            </div>
            <div className="font-mono text-[10px] text-ink-muted/50 uppercase tracking-widest mb-2">Step {i + 1}</div>
            <h3 className="font-serif text-2xl text-ink mb-3">{step.title}</h3>
            <p className="text-ink-muted leading-relaxed flex-1">{step.description}</p>
          </div>
        </ScrollReveal>
      ))}
    </div>
  </Section>
);

// ─── Insights Dashboard (Feature Spotlight) ────────────────────────────────────

const InsightsDashboardDiagram: React.FC = () => (
  <div className="relative w-full max-w-md mx-auto aspect-[4/3] bg-white shadow-2xl shadow-ink/20 rounded-sm border border-ink/10 p-6 rotate-[1deg] hover:rotate-0 transition-transform duration-700 ease-out">
    <div className="flex justify-between items-center mb-4 border-b border-ink/10 pb-3">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-ink/10"></div>
        <div className="w-3 h-3 rounded-full bg-ink/10"></div>
      </div>
      <div className="font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">Insights Engine</div>
    </div>
    <svg className="w-full h-full" viewBox="0 0 280 180" fill="none">
      {/* Transcript lines */}
      <text x="10" y="16" fontSize="7" fill="#5A4A3A" fontFamily="monospace" opacity="0.5">TRANSCRIPT</text>
      <line x1="10" y1="28" x2="130" y2="28" stroke="#C4B59D" strokeWidth="1" opacity="0.3" />
      <line x1="10" y1="38" x2="110" y2="38" stroke="#C4B59D" strokeWidth="1" opacity="0.3" />
      <line x1="10" y1="48" x2="120" y2="48" stroke="#C4B59D" strokeWidth="1" opacity="0.3" />

      {/* Highlighted aha line */}
      <rect x="7" y="55" width="130" height="14" rx="2" fill="#3f84c8" fillOpacity="0.1" />
      <line x1="10" y1="62" x2="130" y2="62" stroke="#3f84c8" strokeWidth="1.5" />
      <text x="140" y="65" fontSize="7" fill="#3f84c8" fontFamily="monospace">← AHA MOMENT</text>

      <line x1="10" y1="78" x2="100" y2="78" stroke="#C4B59D" strokeWidth="1" opacity="0.3" />
      <line x1="10" y1="88" x2="115" y2="88" stroke="#C4B59D" strokeWidth="1" opacity="0.3" />

      {/* Insight cards */}
      <rect x="150" y="95" width="120" height="35" rx="3" stroke="#222" strokeWidth="1" fill="white" />
      <circle cx="163" cy="112" r="6" fill="#3f84c8" opacity="0.2" />
      <line x1="174" y1="107" x2="258" y2="107" stroke="#222" strokeWidth="1" opacity="0.3" />
      <line x1="174" y1="117" x2="235" y2="117" stroke="#222" strokeWidth="1" opacity="0.15" />

      <rect x="150" y="136" width="120" height="35" rx="3" stroke="#222" strokeWidth="1" fill="white" />
      <circle cx="163" cy="153" r="6" fill="#C4B59D" opacity="0.4" />
      <line x1="174" y1="148" x2="258" y2="148" stroke="#222" strokeWidth="1" opacity="0.3" />
      <line x1="174" y1="158" x2="225" y2="158" stroke="#222" strokeWidth="1" opacity="0.15" />

      {/* Arrow from transcript to insights */}
      <path d="M 80 95 C 80 110, 120 112, 148 112" stroke="#3f84c8" strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#arrowBlue)" />
      <defs>
        <marker id="arrowBlue" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 Z" fill="#3f84c8" />
        </marker>
      </defs>
    </svg>
  </div>
);

const InsightsDashboard: React.FC = () => (
  <Section id="how-it-works" className="bg-alt/30">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <ScrollReveal>
        <span className="block font-script text-2xl text-ink-muted/80 mb-2 transform -rotate-1 origin-bottom-left">How It Works</span>
        <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6 leading-tight">
          From transcripts to&nbsp;<span className="italic">aha moments</span>
        </h2>
        <p className="text-ink-muted leading-relaxed mb-6">
          Pulse doesn't just transcribe — it thinks. Every recording is processed through layered analysis that extracts themes, highlights breakthrough moments, and clusters related insights across conversations.
        </p>
        <ul className="space-y-4">
          {['Full transcripts with speaker attribution', 'Key insight extraction & aha-moment highlighting', 'Theme clustering across multiple meetings', 'Searchable knowledge base of all conversations'].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-ink-muted">
              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </ScrollReveal>
      <ScrollReveal delay={200} direction="left">
        <InsightsDashboardDiagram />
      </ScrollReveal>
    </div>
  </Section>
);

// ─── Weekly Content Engine ─────────────────────────────────────────────────────

const ContentEngineCards: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Newsletter card */}
    <div className="bg-white shadow-xl border border-ink/10 p-6 rounded-sm rotate-[-1deg] hover:rotate-0 transition-transform duration-500">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-4 h-4 text-accent" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted/60">Newsletter Draft</span>
        <span className="ml-auto text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-sm">Ready</span>
      </div>
      <h4 className="font-serif text-lg text-ink mb-2">This Week in Product</h4>
      <p className="text-sm text-ink-muted leading-relaxed">
        Three conversations this week surfaced a clear pattern: customers are asking for deeper integrations with their existing workflow tools. Here's what that means for Q3 priorities...
      </p>
      <div className="mt-4 pt-4 border-t border-ink/5 flex items-center gap-3 text-[11px] text-ink-muted/60">
        <span>643 words</span>
        <span>·</span>
        <span>3 min read</span>
        <span>·</span>
        <span>Based on 4 meetings</span>
      </div>
    </div>

    {/* Social post card */}
    <div className="bg-white shadow-xl border border-ink/10 p-6 rounded-sm rotate-[1deg] hover:rotate-0 transition-transform duration-500">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-4 h-4 text-accent" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted/60">LinkedIn Post</span>
        <span className="ml-auto text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-sm">Draft</span>
      </div>
      <h4 className="font-serif text-lg text-ink mb-2">Integration-First Thinking</h4>
      <p className="text-sm text-ink-muted leading-relaxed">
        We've had 12 customer calls this month. The #1 theme? "Work where I already work." Not new dashboards. Not more logins. Just make the tools I have smarter...
      </p>
      <div className="mt-4 pt-4 border-t border-ink/5 flex items-center gap-3 text-[11px] text-ink-muted/60">
        <span>182 words</span>
        <span>·</span>
        <span>LinkedIn-optimized</span>
        <span>·</span>
        <span>1 insight highlighted</span>
      </div>
    </div>
  </div>
);

const WeeklyContentEngine: React.FC = () => (
  <Section id="outputs" pattern="grid">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <ScrollReveal delay={200}>
        <ContentEngineCards />
      </ScrollReveal>
      <ScrollReveal>
        <span className="block font-script text-2xl text-ink-muted/80 mb-2 transform -rotate-1 origin-bottom-left">Outputs</span>
        <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6 leading-tight">
          A content engine<br />that runs itself
        </h2>
        <p className="text-ink-muted leading-relaxed mb-6">
          Each week, Pulse compiles your conversations into a ready-to-review content package: newsletters that synthesize cross-meeting themes, social posts that capture your authentic voice, and more.
        </p>
        <ul className="space-y-4">
          {['Weekly newsletter drafts from meeting insights', 'Platform-optimized social posts (LinkedIn, Twitter/X)', 'Maintains your authentic voice and tone', 'Review, edit, and approve before publishing'].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-ink-muted">
              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </ScrollReveal>
    </div>
  </Section>
);

// ─── Image Generation ──────────────────────────────────────────────────────────

const ImageGeneration: React.FC = () => (
  <Section className="bg-alt/30">
    <SectionHeader eyebrow="Visuals" title="AI-generated images for every piece" subtitle="Custom visuals that match your content — no stock photos, no design tools needed." />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { label: 'Newsletter Header', src: NewsletterVisual, alt: 'Newsletter-style generated visual in parchment sketch style' },
        { label: 'Social Card', src: SocialVisual, alt: 'Social card generated visual with connected content nodes' },
        { label: 'Blog Feature', src: BlogVisual, alt: 'Blog feature generated visual in editorial sketch style' },
      ].map((item, i) => (
        <ScrollReveal key={item.label} delay={i * 150}>
          <div className="bg-white shadow-lg border border-ink/10 rounded-sm overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="aspect-[16/10] bg-base/50 flex items-center justify-center relative overflow-hidden">
              <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-widest text-ink-muted/60">{item.label}</span>
              <Image className="w-4 h-4 text-ink-muted/40" />
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  </Section>
);

// ─── Review + Schedule ─────────────────────────────────────────────────────────

const scheduleItems = [
  { date: 'Mon, Feb 16', type: 'Newsletter', title: 'This Week in Product', status: 'ready' as const },
  { date: 'Tue, Feb 17', type: 'LinkedIn', title: 'Integration-First Thinking', status: 'draft' as const },
  { date: 'Wed, Feb 18', type: 'Twitter', title: 'Customer research thread', status: 'draft' as const },
  { date: 'Thu, Feb 19', type: 'Image', title: 'Product roadmap visual', status: 'generating' as const },
  { date: 'Fri, Feb 20', type: 'Newsletter', title: 'Founder Friday Digest', status: 'scheduled' as const },
];

const statusColors = {
  ready: 'bg-green-50 text-green-700',
  draft: 'bg-yellow-50 text-yellow-700',
  generating: 'bg-blue-50 text-blue-700',
  scheduled: 'bg-accent/10 text-accent',
};

const ReviewSchedule: React.FC = () => (
  <Section id="scheduling" pattern="grid">
    <SectionHeader eyebrow="Scheduling" title="Review & schedule in one view" subtitle="See your content pipeline for the week. Approve, tweak, or reschedule in seconds." />
    <ScrollReveal>
      <div className="max-w-3xl mx-auto bg-white shadow-xl border border-ink/10 rounded-sm overflow-hidden">
        {/* Week header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink/10 bg-base/30">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-accent" />
            <span className="font-serif text-lg text-ink">Week of Feb 16</span>
          </div>
          <span className="font-mono text-[10px] text-ink-muted/50 uppercase tracking-widest">5 Items Queued</span>
        </div>
        {/* Rows */}
        {scheduleItems.map((item, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-ink/5 last:border-0 hover:bg-base/20 transition-colors">
            <span className="text-xs text-ink-muted w-24 flex-shrink-0 font-mono">{item.date}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted bg-ink/5 px-2 py-0.5 rounded-sm w-20 text-center flex-shrink-0">{item.type}</span>
            <span className="text-sm text-ink flex-1 truncate">{item.title}</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm flex-shrink-0 ${statusColors[item.status]}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </ScrollReveal>
  </Section>
);

// ─── Creator Mode ──────────────────────────────────────────────────────────────

const insightChoices = [
  { id: 1, text: 'Customers want tools that work inside Slack, not another dashboard', checked: true },
  { id: 2, text: 'The onboarding bottleneck is in the third step, not the first', checked: false },
  { id: 3, text: '"Self-serve" is now table stakes — not a differentiator', checked: true },
  { id: 4, text: 'Mid-market buyers care about time-to-value over feature count', checked: false },
  { id: 5, text: 'Three customers independently asked about API access this week', checked: true },
];

type DemoPost = {
  day: string;
  title: string;
  excerpt: string;
  tags: string;
  posted: string;
  image: string;
};

type DemoScenario = {
  id: string;
  article: {
    postedLabel: string;
    postedAt: string;
    title: string;
    heroImage: string;
    secondaryImage: string;
    heading: string;
    intro: string;
  };
  posts: DemoPost[];
};

const demoScenarios: DemoScenario[] = [
  {
    id: 'growth-playbook',
    article: {
      postedLabel: 'Posted Sat, February 7, 2026',
      postedAt: 'Sat, Feb 7, 5:06 PM',
      title: 'The Growth Playbook: How Smart Businesses Are Winning with AI and Optimized Ads',
      heroImage: NewsletterVisual,
      secondaryImage: SocialVisual,
      heading: 'The Growth Playbook: How Smart Businesses Are Winning with AI and Optimized Ads',
      intro: "This week, we're cutting through the noise to show small business owners exactly how to boost revenue, retain customers, and build efficiency using smarter ad strategies and the power of AI.",
    },
    posts: [
      {
        day: 'Day 1',
        title: 'Stop Bleeding Ad Spend: The Hidden Cost of "Easy" Leads',
        excerpt: 'Seen this pattern too many times: small business launches ads, captures shallow leads, and misses intent signals that actually convert.',
        tags: '#SmallBusiness #AI #LeadGeneration #AdOptimization',
        posted: 'Posted Sat, February 7, 2026',
        image: WorkflowVisual,
      },
      {
        day: 'Day 2',
        title: 'Your 3-Step AI Playbook for Sustainable Growth',
        excerpt: "AI isn't just for big tech anymore. Here's a practical operating model that works for lean teams and busy founders.",
        tags: '#BusinessGrowth #WorkflowAutomation #ContentMarketing #AEO',
        posted: 'Posted Tue, February 17, 2026',
        image: PipelineVisual,
      },
      {
        day: 'Day 3',
        title: 'From Generic Copy to High-Intent Creative Systems',
        excerpt: 'How to replace ad guesswork with a repeatable content loop that maps message, offer, and audience by funnel stage.',
        tags: '#CreativeStrategy #RevenueGrowth #DigitalMarketing #CRO',
        posted: 'Posted Thu, February 19, 2026',
        image: CrmVisual,
      },
      {
        day: 'Day 4',
        title: 'Build a Content Loop from Calls, Retargeting, and CRM',
        excerpt: 'Use one weekly cadence to turn conversations into campaigns, campaigns into learnings, and learnings into better offers.',
        tags: '#Retargeting #CRM #Automation #ConversionTracking',
        posted: 'Posted Fri, February 20, 2026',
        image: RagVisual,
      },
    ],
  },
  {
    id: 'pipeline-ops',
    article: {
      postedLabel: 'Posted Tue, February 10, 2026',
      postedAt: 'Tue, Feb 10, 11:32 AM',
      title: 'Pipeline Ops Weekly: From Meeting Notes to Predictable Demand',
      heroImage: BlogVisual,
      secondaryImage: NewsletterVisual,
      heading: 'Pipeline Ops Weekly: From Meeting Notes to Predictable Demand',
      intro: 'This edition outlines a practical workflow for turning recurring sales and customer themes into consistent demand generation, tighter messaging, and faster team alignment.',
    },
    posts: [
      {
        day: 'Day 1',
        title: 'Why Most Lead Handoffs Break Before Qualification',
        excerpt: 'A pattern from this week: teams generate MQLs quickly but lose momentum at the handoff. Here is the fix that keeps context intact.',
        tags: '#PipelineOps #RevenueOps #LeadFlow #B2BMarketing',
        posted: 'Posted Tue, February 10, 2026',
        image: PipelineVisual,
      },
      {
        day: 'Day 2',
        title: 'Design a Weekly Insight Loop Your Team Will Actually Use',
        excerpt: 'Build one simple cadence that helps sales, marketing, and product align around real buyer language from calls.',
        tags: '#TeamAlignment #ContentSystem #VoiceOfCustomer #AIWorkflow',
        posted: 'Posted Wed, February 11, 2026',
        image: CrmVisual,
      },
      {
        day: 'Day 3',
        title: 'From CRM Notes to High-Intent Campaign Angles',
        excerpt: 'Use extracted objections and wins from conversation data to write ad and email angles that speak to urgency and proof.',
        tags: '#CRM #DemandGen #CopyStrategy #Conversion',
        posted: 'Posted Thu, February 12, 2026',
        image: RagVisual,
      },
      {
        day: 'Day 4',
        title: 'How to Spot Revenue Themes Before the Quarter Ends',
        excerpt: 'Four signals to track weekly so you can adjust campaigns and messaging before a slowdown shows up in the dashboard.',
        tags: '#Forecasting #RevenueGrowth #GoToMarket #OperatorTips',
        posted: 'Posted Fri, February 13, 2026',
        image: WorkflowVisual,
      },
    ],
  },
  {
    id: 'brand-engine',
    article: {
      postedLabel: 'Posted Thu, February 19, 2026',
      postedAt: 'Thu, Feb 19, 9:18 AM',
      title: 'Build a Brand Engine: Repurpose Calls into Multi-Channel Content',
      heroImage: SocialVisual,
      secondaryImage: BlogVisual,
      heading: 'Build a Brand Engine: Repurpose Calls into Multi-Channel Content',
      intro: 'Instead of starting from scratch every week, this framework shows how to turn one set of conversations into newsletters, social content, and visuals that stay on-brand.',
    },
    posts: [
      {
        day: 'Day 1',
        title: 'The 20-Minute Debrief That Fuels a Week of Content',
        excerpt: 'After each key call, capture three themes, one quote, and one objection to seed your weekly publishing plan.',
        tags: '#ContentOperations #FounderMarketing #AudienceGrowth #PulseNote',
        posted: 'Posted Thu, February 19, 2026',
        image: CrmVisual,
      },
      {
        day: 'Day 2',
        title: 'Use Customer Language as Your Editorial Backbone',
        excerpt: 'When your headlines mirror how buyers describe their pain, engagement and response quality rise fast.',
        tags: '#Messaging #CustomerResearch #Editorial #BrandVoice',
        posted: 'Posted Fri, February 20, 2026',
        image: WorkflowVisual,
      },
      {
        day: 'Day 3',
        title: 'One Insight, Four Formats: Newsletter, Post, Carousel, Thread',
        excerpt: 'A practical repurposing template that helps small teams publish more without sacrificing quality.',
        tags: '#Repurposing #ContentTeam #MarketingSystem #Efficiency',
        posted: 'Posted Sat, February 21, 2026',
        image: PipelineVisual,
      },
      {
        day: 'Day 4',
        title: 'How to Keep AI Drafts Aligned with Your Brand Standards',
        excerpt: 'Use lightweight guardrails for structure, tone, and proof points so every draft feels human and trusted.',
        tags: '#AIGovernance #BrandConsistency #EditorialOps #Trust',
        posted: 'Posted Sun, February 22, 2026',
        image: RagVisual,
      },
    ],
  },
];

const CreatorMode: React.FC = () => {
  const [checks, setChecks] = useState<Record<number, boolean>>(
    Object.fromEntries(insightChoices.map(c => [c.id, c.checked]))
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDemoPreview, setShowDemoPreview] = useState(false);
  const [articleExpanded, setArticleExpanded] = useState(true);
  const [postsExpanded, setPostsExpanded] = useState(true);
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [generationCount, setGenerationCount] = useState(0);
  const generateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggle = (id: number) => setChecks(prev => ({ ...prev, [id]: !prev[id] }));
  const selectedCount = Object.values(checks).filter(Boolean).length;
  const activeScenario = demoScenarios[activeScenarioIndex];

  useEffect(() => {
    return () => {
      if (generateTimerRef.current) clearTimeout(generateTimerRef.current);
    };
  }, []);

  const handleGeneratePreview = () => {
    if (selectedCount === 0 || isGenerating) return;
    if (generateTimerRef.current) clearTimeout(generateTimerRef.current);
    const nextScenarioIndex = generationCount % demoScenarios.length;
    setActiveScenarioIndex(nextScenarioIndex);
    setGenerationCount(prev => prev + 1);
    setIsGenerating(true);
    generateTimerRef.current = setTimeout(() => {
      setIsGenerating(false);
      setShowDemoPreview(true);
      setArticleExpanded(true);
      setPostsExpanded(true);
    }, 900);
  };

  const resetPreview = () => {
    setShowDemoPreview(false);
    setIsGenerating(false);
  };

  return (
    <Section className="bg-alt/30">
      <SectionHeader eyebrow="Creator Mode" title="Try Now - Pick insights, generate content." subtitle="Hand-pick the moments that matter, then let Pulse turn them into polished content." />
      <ScrollReveal>
        {showDemoPreview ? (
          <div className="max-w-6xl mx-auto bg-white shadow-2xl border border-ink/10 rounded-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-ink/10 bg-base/20 flex items-center justify-between">
              <div className="flex items-center gap-3 text-ink">
                <Mail className="w-5 h-5 text-accent" />
                <span className="font-bold text-2xl md:text-3xl">Demo Content Preview</span>
                <span className="text-sm text-ink-muted bg-base px-3 py-1 rounded-full border border-ink/10">Fake data only</span>
              </div>
              <button onClick={resetPreview} className="text-sm font-medium border border-ink/20 px-4 py-2 hover:bg-base transition-colors">
                Back
              </button>
            </div>

            <div className="px-5 py-4 border-b border-ink/10 bg-base/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent" />
                <span className="font-bold text-ink">Articles</span>
                <span className="text-ink-muted">Articles & Long-form Content</span>
                <span className="bg-accent/10 text-accent text-xs font-bold px-2.5 py-0.5 rounded-full">1</span>
              </div>
              <button onClick={() => setArticleExpanded(v => !v)} className="text-sm font-medium text-accent bg-accent/10 px-4 py-2 rounded-md inline-flex items-center gap-2">
                <ChevronDown className={`w-4 h-4 transition-transform ${articleExpanded ? 'rotate-180' : ''}`} />
                {articleExpanded ? 'Collapse' : 'Expand'}
              </button>
            </div>

            {articleExpanded && (
              <div className="p-5 border-b border-ink/10 bg-white">
                <div className="border border-ink/10 rounded-2xl overflow-hidden">
                  <div className="px-4 py-4 border-b border-ink/10 bg-base/10">
                    <div className="flex flex-wrap items-center gap-3 text-sm mb-3">
                      <span className="bg-ink text-white px-3 py-1 rounded-full font-medium">{activeScenario.article.postedLabel}</span>
                      <span className="text-ink-muted">{activeScenario.article.postedAt}</span>
                    </div>
                    <h3 className="font-serif text-3xl md:text-4xl text-ink">{activeScenario.article.title}</h3>
                  </div>

                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold tracking-wider text-ink-muted mb-2">HERO IMAGE</p>
                      <img src={activeScenario.article.heroImage} alt="Demo hero image" className="w-full rounded-xl border border-ink/10" />
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-wider text-ink-muted mb-2">SECONDARY IMAGE</p>
                      <img src={activeScenario.article.secondaryImage} alt="Demo secondary image" className="w-full rounded-xl border border-ink/10" />
                    </div>
                  </div>

                  <div className="px-6 py-6 border-t border-ink/10 bg-base/5">
                    <h4 className="font-serif text-5xl text-ink mb-4">{activeScenario.article.heading}</h4>
                    <p className="text-xl text-ink-muted leading-relaxed">{activeScenario.article.intro}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="px-5 py-4 border-b border-ink/10 bg-base/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Send className="w-4 h-4 text-accent" />
                <span className="font-bold text-ink">Posts</span>
                <span className="text-ink-muted">Social Media Content</span>
                <span className="bg-accent/10 text-accent text-xs font-bold px-2.5 py-0.5 rounded-full">{activeScenario.posts.length}</span>
              </div>
              <button onClick={() => setPostsExpanded(v => !v)} className="text-sm font-medium text-accent bg-accent/10 px-4 py-2 rounded-md inline-flex items-center gap-2">
                <ChevronDown className={`w-4 h-4 transition-transform ${postsExpanded ? 'rotate-180' : ''}`} />
                {postsExpanded ? 'Collapse' : 'Expand'}
              </button>
            </div>

            {postsExpanded && (
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 bg-white">
                {activeScenario.posts.map((post, i) => (
                  <div key={`${activeScenario.id}-${i}`} className="border border-ink/10 rounded-2xl overflow-hidden bg-base/5">
                    <img src={post.image} alt={`${post.day} post visual`} className="w-full aspect-[16/10] object-cover" />
                    <div className="p-4">
                      <p className="text-accent font-bold mb-2">{post.day}</p>
                      <h5 className="font-serif text-2xl text-ink mb-2">{post.title}</h5>
                      <p className="text-ink-muted mb-3">{post.excerpt}</p>
                      <button className="text-accent font-medium mb-4">See more</button>
                      <p className="text-accent text-sm mb-4">{post.tags}</p>
                      <div className="flex items-center justify-between gap-2">
                        <span className="bg-ink text-white text-xs px-3 py-1 rounded-full">{post.posted}</span>
                        <div className="flex items-center gap-2">
                          <button className="text-green-700 bg-green-50 border border-green-100 px-3 py-1.5 rounded-md text-sm">Re-Post</button>
                          <button className="text-ink-muted border border-ink/15 px-3 py-1.5 rounded-md text-sm">Copy</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="px-5 py-4 border-t border-ink/10 bg-base/10 flex justify-end">
              <button onClick={resetPreview} className="text-sm font-medium border border-ink/20 px-4 py-2 hover:bg-base transition-colors">
                Try another set
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white shadow-xl border border-ink/10 rounded-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-ink/10 bg-base/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-accent" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted/60">This Week's Insights</span>
              </div>
              <span className="text-[11px] text-ink-muted">{selectedCount} selected</span>
            </div>
            <div className="divide-y divide-ink/5">
              {insightChoices.map(choice => (
                <label key={choice.id} className="flex items-start gap-4 px-6 py-4 cursor-pointer hover:bg-base/20 transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    <div
                      onClick={() => toggle(choice.id)}
                      className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center transition-all ${checks[choice.id] ? 'bg-accent border-accent' : 'border-ink/20 hover:border-accent/50'}`}
                    >
                      {checks[choice.id] && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <span className={`text-sm leading-relaxed transition-colors ${checks[choice.id] ? 'text-ink' : 'text-ink-muted'}`}>
                    {choice.text}
                  </span>
                </label>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-ink/10 bg-base/20">
              <Button
                variant="primary"
                className="w-full"
                onClick={handleGeneratePreview}
              >
                {isGenerating
                  ? 'Generating Preview...'
                  : `Generate Content from ${selectedCount} Insight${selectedCount !== 1 ? 's' : ''}`}
              </Button>
            </div>
          </div>
        )}
      </ScrollReveal>
    </Section>
  );
};

// ─── Use Cases ─────────────────────────────────────────────────────────────────

const useCases = [
  { icon: <Users className="w-6 h-6" />, title: 'Founder Updates', desc: 'Turn board meetings and investor calls into polished updates for stakeholders.' },
  { icon: <Headphones className="w-6 h-6" />, title: 'Podcast Repurposing', desc: 'Transform podcast episodes into newsletters, clips, and social threads.' },
  { icon: <Briefcase className="w-6 h-6" />, title: 'Sales Call Learnings', desc: 'Extract winning patterns and objections from your best sales conversations.' },
  { icon: <HelpCircle className="w-6 h-6" />, title: 'Customer Research', desc: 'Synthesize user interviews into actionable insights and trend reports.' },
  { icon: <RefreshCw className="w-6 h-6" />, title: 'Team Retros', desc: 'Capture retrospective themes and turn action items into follow-up content.' },
  { icon: <Mic className="w-6 h-6" />, title: 'Conference Talks', desc: 'Record talks and generate blog posts, summaries, and shareable takeaways.' },
];

const UseCases: React.FC = () => (
  <Section id="use-cases" pattern="grid">
    <SectionHeader eyebrow="Use Cases" title="Built for how you already work" subtitle="Whether you're a founder, content creator, or team lead — Pulse fits into your workflow." />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {useCases.map((uc, i) => (
        <ScrollReveal key={uc.title} delay={i * 100}>
          <div className="bg-white border border-ink/10 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="mb-4 text-ink-muted group-hover:text-accent transition-colors">{uc.icon}</div>
            <h3 className="font-serif text-xl text-ink mb-2">{uc.title}</h3>
            <p className="text-sm text-ink-muted leading-relaxed">{uc.desc}</p>
          </div>
        </ScrollReveal>
      ))}
    </div>
  </Section>
);

// ─── FAQ ────────────────────────────────────────────────────────────────────────

const faqItems = [
  { q: 'How does Pulse handle my data and privacy?', a: 'Your recordings and transcripts are encrypted at rest and in transit. We never share your data with third parties or use it to train models. You retain full ownership of all content generated.' },
  { q: 'What types of meetings work best with Pulse?', a: 'Pulse works with any recorded conversation — team standups, customer interviews, sales calls, podcast recordings, board meetings, and conference talks. If it has audio, Pulse can process it.' },
  { q: 'Can I edit the content before publishing?', a: "Absolutely. Every draft is fully editable. Pulse generates a starting point, then you refine, approve, or request a re-draft. You're always in control of what goes out." },
  { q: 'What outputs does Pulse generate?', a: 'Newsletters, LinkedIn posts, Twitter/X threads, blog summaries, AI-generated images, and insight reports. Each format is optimized for its platform and audience.' },
  { q: 'How does scheduling work?', a: 'Pulse proposes a weekly content calendar based on your meetings. You review the queue, adjust timing, and approve. Content goes out on schedule — or when you hit publish.' },
  { q: 'Who owns the content Pulse creates?', a: 'You do. 100%. Every word, image, and insight belongs to you. Cancel anytime and export everything.' },
];

const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-ink/10 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left group">
        <span className="font-serif text-lg text-ink group-hover:text-accent transition-colors pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 text-ink-muted flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ maxHeight: open ? contentRef.current?.scrollHeight || 200 : 0, opacity: open ? 1 : 0 }}
      >
        <p className="text-ink-muted leading-relaxed pb-5">{a}</p>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => (
  <Section id="faq" className="bg-alt/30">
    <SectionHeader eyebrow="FAQ" title="Common questions" />
    <ScrollReveal>
      <div className="max-w-3xl mx-auto bg-white shadow-xl border border-ink/10 rounded-sm px-8">
        {faqItems.map((item, i) => (
          <FAQItem key={i} q={item.q} a={item.a} />
        ))}
      </div>
    </ScrollReveal>
  </Section>
);

// ─── Calendar Booking ───────────────────────────────────────────────────────────

// Calendar booking (adapted from Booking.tsx)

const PulseBooking: React.FC<{ onNavigate: (page: Page, hash?: string, id?: string) => void }> = ({ onNavigate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<'datetime' | 'details' | 'success'>('datetime');
  const [busySlots, setBusySlots] = useState<{ start: string; end: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const USER_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [displaySlots, setDisplaySlots] = useState<{ display: string; value: string }[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    reason: 'Multiple areas (we will prioritize together)',
    notes: '',
  });

  // Generate display slots when date changes
  useEffect(() => {
    if (!selectedDate) { setDisplaySlots([]); return; }
    setDisplaySlots(buildDisplaySlots(selectedDate, USER_TIMEZONE, BUSINESS_HOURS, BUSINESS_TIMEZONE));
  }, [selectedDate]);

  // Fetch availability
  const fetchAvailability = async () => {
    setIsLoading(true);
    const { start, end } = getAvailabilityRange(currentDate);
    try {
      const response = await fetch(`${API_ENDPOINTS.availability}?start=${start}&end=${end}`);
      if (response.ok) {
        const data = await response.json();
        setBusySlots(data.busySlots);
      }
    } catch (error) {
      console.error('Failed to fetch availability', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAvailability(); }, [currentDate]);
  useEffect(() => {
    const interval = setInterval(fetchAvailability, 30000);
    return () => clearInterval(interval);
  }, [currentDate]);

  const checkSlotAvailability = (slotIsoTime: string) => {
    return checkSharedSlotAvailability(slotIsoTime, busySlots, MEETING_DURATION_MINUTES, BUFFER_MINUTES);
  };

  const isDateDisabled = (day: number) => {
    return isDayDisabled(
      day,
      currentDate,
      busySlots,
      BUSINESS_HOURS,
      BUSINESS_TIMEZONE,
      MEETING_DURATION_MINUTES,
      BUFFER_MINUTES
    );
  };

  const isTimeDisabled = (slotIso: string) => !checkSlotAvailability(slotIso);

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(currentDate);
  const daysArray = Array.from({ length: days }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDay }, (_, i) => i);
  const monthNames = MONTH_NAMES;

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    setSelectedTime(null);
    fetchAvailability();
  };

  const resetBooking = () => {
    setStep('datetime');
    setSelectedDate(null);
    setSelectedTime(null);
    setFormData(prev => ({ ...prev, company: '', phone: '', reason: 'Multiple areas (we will prioritize together)' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(API_ENDPOINTS.book, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, dateTime: selectedTime, bookingType: 'meet-astrid' }),
      });
      const data = await response.json();
      if (response.ok) {
        setStep('success');
      } else if (response.status === 409 && data.isDuplicate) {
        alert(data.error || 'You already have a demo scheduled at this time.');
        fetchAvailability();
        setStep('datetime');
        setSelectedTime(null);
      } else {
        alert(data.error || 'Failed to book demo. Please try again.');
      }
    } catch {
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <Section id="booking" className="bg-alt/20 border-t border-ink/5" overflow={true}>
      <div className="mb-12 text-center">
        <ScrollReveal>
          <h2 className="font-serif text-4xl md:text-5xl text-ink mb-4">Book a Pulse Demo</h2>
          <p className="text-ink-muted max-w-xl mx-auto">See how Pulse turns your meetings into a content engine. Pick a time that works for you.</p>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={100}>
        <div className="max-w-6xl mx-auto bg-white/60 backdrop-blur-xl shadow-2xl shadow-ink/10 border border-ink/10 rounded-sm overflow-hidden flex flex-col lg:flex-row min-h-[780px]">
          {/* Left Panel */}
          <div className="w-full lg:w-5/12 bg-white/40 border-b lg:border-b-0 lg:border-r border-ink/10 p-8 lg:p-12 flex flex-col relative">
            <div className="mb-8">
              <Logo className="w-12 h-12 text-ink mb-6" />
              <span className="font-mono text-xs font-bold text-ink-muted/60 uppercase tracking-widest mb-2 block">Pulse Demo</span>
              <h1 className="font-serif text-3xl lg:text-4xl text-ink mb-4">Book a Pulse Demo</h1>
              <div className="flex items-center gap-6 text-sm font-medium text-ink-muted mb-8">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> 45 Min</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Available</div>
              </div>
              <p className="text-ink-muted leading-relaxed mb-8">
                I will walk you through how Pulse Note captures meetings, extracts insights, and generates publish-ready content, tailored to your brand and workflow.
              </p>
              <div className="flex items-center gap-4 py-6 border-y border-ink/5 mb-6">
                <div className="w-20 h-20 rounded-sm overflow-hidden border border-ink/10 flex-shrink-0">
                  <img src={AstridSketch} alt="Astrid Abrahamyan" className="w-full h-full object-cover object-top scale-125" />
                </div>
                <div>
                  <div className="font-serif text-ink text-lg leading-none mb-1">Astrid Abrahamyan</div>
                  <div className="font-mono text-[10px] text-ink-muted uppercase tracking-widest">Partner & Solution Architect</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Panel — Calendar */}
          <div className="w-full lg:w-7/12 bg-white relative">
            {step === 'success' ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-100">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="font-serif text-3xl text-ink mb-2">Request Confirmed</h2>
                <p className="text-ink-muted text-lg mb-8 max-w-md">
                  A calendar invitation has been sent to your inbox. I look forward to our conversation.
                </p>
                <div className="bg-base/50 p-6 rounded-sm border border-ink/5 w-full max-w-sm mb-8">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-ink-muted">Date</span>
                    <span className="font-medium text-ink">{selectedDate?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-muted">Time</span>
                    <span className="font-medium text-ink">{selectedTime ? format(new Date(selectedTime), 'hh:mm a') : ''}</span>
                  </div>

                  {formData.notes && (
                    <div className="mt-4 pt-4 border-t border-ink/5">
                      <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">
                        <HelpCircle className="w-3 h-3" /> Anything else we should know?
                      </label>
                      <p className="text-sm text-ink-muted text-left">{formData.notes}</p>
                    </div>
                  )}
                </div>
                <Button variant="secondary" onClick={() => onNavigate('landing')}>Return to Homepage</Button>
              </div>
            ) : (
              <div className="p-8 lg:p-12 h-full flex flex-col justify-center items-center">
                {/* Progress */}
                <div className="w-full max-w-md flex items-center gap-4 mb-8 text-xs font-bold uppercase tracking-widest">
                  <span className={`pb-1 border-b-2 transition-colors ${step === 'datetime' ? 'text-accent border-accent' : 'text-green-600 border-green-600'}`}>01 Time</span>
                  <span className={`pb-1 border-b-2 transition-colors ${step === 'details' ? 'text-accent border-accent' : 'text-ink-muted/20 border-transparent'}`}>02 Details</span>
                </div>

                {step === 'datetime' && (
                  <div className="flex flex-col h-full w-full max-w-md animate-in slide-in-from-right-4 duration-300">
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-serif text-xl text-ink">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                        <div className="flex gap-2">
                          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-1 hover:bg-base rounded-full text-ink-muted"><ChevronLeft className="w-5 h-5" /></button>
                          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-1 hover:bg-base rounded-full text-ink-muted"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-ink-muted/40 mb-2">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {blanksArray.map((_, i) => <div key={`b-${i}`} className="w-10 h-10" />)}
                        {daysArray.map(day => {
                          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                          const isSelected = selectedDate?.toDateString() === date.toDateString();
                          const disabled = isDateDisabled(day);
                          return (
                            <button
                              key={day}
                              disabled={disabled}
                              onClick={() => !disabled && handleDateClick(day)}
                              className={`w-10 h-10 rounded-sm text-sm font-medium transition-all ${isSelected
                                ? 'bg-ink text-white shadow-lg scale-110'
                                : disabled
                                  ? 'text-ink-muted/30 cursor-not-allowed'
                                  : 'text-ink hover:bg-accent/10 hover:text-accent'
                                }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-ink/10 min-h-[200px]">
                      <h3 className="font-serif text-lg text-ink mb-4 text-center">
                        {selectedDate ? selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }) : 'Select Date Above'}
                      </h3>
                      {selectedDate ? (
                        isLoading ? (
                          <div className="flex flex-col items-center justify-center py-12 text-ink-muted/50">
                            <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-3" />
                            <span className="text-sm font-medium">Checking availability...</span>
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-3 gap-3 mb-6">
                              {displaySlots.map(slot => {
                                const disabled = isTimeDisabled(slot.value);
                                return (
                                  <button
                                    key={slot.value}
                                    disabled={disabled}
                                    onClick={() => !disabled && setSelectedTime(slot.value)}
                                    className={`py-3 px-2 text-sm border rounded-sm transition-all text-center ${selectedTime === slot.value
                                      ? 'bg-accent text-white border-accent shadow-md scale-105'
                                      : disabled
                                        ? 'bg-base/50 text-ink-muted/30 border-ink/5 cursor-not-allowed'
                                        : 'bg-white border-ink/10 text-ink hover:border-accent hover:text-accent hover:shadow-sm'
                                      }`}
                                  >
                                    {slot.display}
                                  </button>
                                );
                              })}
                            </div>
                            <Button
                              variant="primary"
                              className={`w-full ${!selectedTime ? 'opacity-50 cursor-not-allowed' : ''}`}
                              onClick={() => selectedTime && setStep('details')}
                            >
                              Next
                            </Button>
                          </>
                        )
                      ) : (
                        <div className="text-center text-ink-muted/50 text-sm italic py-4">Available times will appear here</div>
                      )}
                    </div>
                  </div>
                )}

                {step === 'details' && (
                  <form onSubmit={handleSubmit} className="flex flex-col h-full w-full max-w-md animate-in slide-in-from-right-4 duration-300">
                    <h3 className="font-serif text-2xl text-ink mb-6">Your Information</h3>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">
                          <User className="w-3 h-3" /> Full Name <span className="text-red-500">*</span>
                        </label>
                        <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-base/30 border border-ink/20 p-3 text-ink focus:outline-none focus:border-accent transition-colors rounded-sm" placeholder="Leonardo da Vinci" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">
                          <Mail className="w-3 h-3" /> Email <span className="text-red-500">*</span>
                        </label>
                        <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-base/30 border border-ink/20 p-3 text-ink focus:outline-none focus:border-accent transition-colors rounded-sm" placeholder="leo@florence.it" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Briefcase className="w-3 h-3" /> Company <span className="text-ink-muted/60 lowercase font-normal">(optional)</span>
                          </label>
                          <input type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full bg-base/30 border border-ink/20 p-3 text-ink focus:outline-none focus:border-accent transition-colors rounded-sm" placeholder="Acme Inc." />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Phone className="w-3 h-3" /> Phone <span className="text-ink-muted/60 lowercase font-normal">(optional)</span>
                          </label>
                          <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-base/30 border border-ink/20 p-3 text-ink focus:outline-none focus:border-accent transition-colors rounded-sm" placeholder="+1 555..." />
                        </div>
                      </div>
                      <div>
                        <CustomSelect
                          label="What's on your mind?"
                          required
                          value={formData.reason}
                          onChange={val => setFormData({ ...formData, reason: val })}
                          options={[
                            'Just want to say hi & learn more',
                            "Curious about what's possible with AI",
                            'Feeling some friction in my workflows',
                            'I have a specific question or project',
                            "Not sure - let's just chat",
                          ]}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">
                          <HelpCircle className="w-3 h-3" /> Anything else you want to share?
                        </label>
                        <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="w-full bg-base/30 border border-ink/20 p-3 text-ink focus:outline-none focus:border-accent transition-colors rounded-sm min-h-[100px] resize-y" placeholder="Optional - feel free to share any context or specific questions..." />
                      </div>
                    </div>
                    <div className="mt-auto flex gap-4">
                      <Button variant="secondary" onClick={() => setStep('datetime')} className="px-6">Back</Button>
                      <Button variant="primary" className="flex-1">Schedule Call</Button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>
    </Section>
  );
};

// ─── Final CTA Band ────────────────────────────────────────────────────────────

const FinalCTA: React.FC = () => {
  const scrollTo = () => {
    const el = document.getElementById('booking');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-ink text-white py-20 md:py-28 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight">
            Stop leaving insights on the table.
          </h2>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Every meeting is a goldmine of content. Pulse makes sure nothing gets lost.
          </p>
          <button onClick={scrollTo} className="inline-flex items-center px-8 py-4 text-base font-medium bg-white text-ink hover:bg-base transition-all shadow-lg hover:shadow-xl active:scale-95">
            Book Your Demo
            <ChevronRight className="ml-2 w-5 h-5" />
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

const PulseLandingPage: React.FC<PulseLandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-base text-ink [&_h1]:[text-wrap:balance] [&_h2]:[text-wrap:balance] [&_h3]:[text-wrap:balance] [&_p]:[text-wrap:pretty]">
      <PulseNav />
      <PulseHero />
      <WhatPulseDoes />
      <InsightsDashboard />
      <WeeklyContentEngine />
      <ImageGeneration />
      <ReviewSchedule />
      <CreatorMode />
      <UseCases />
      <FAQ />
      <PulseBooking onNavigate={onNavigate} />
      <FinalCTA />
    </div>
  );
};

export default PulseLandingPage;
