
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, User, Mail, HelpCircle, Clock, Check, Menu, X, Mic, BarChart3, Send, Sparkles, Image, Lightbulb, MessageCircle, Users, Headphones, Briefcase, RefreshCw, Phone, Video, CalendarDays } from 'lucide-react';
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
    { label: 'What You Can Do', href: '#product' },
    { label: 'Try It', href: '#try-it' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'Book a Demo', href: '#booking' },
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

// ─── Hero Diagram (Animated Demo) ───────────────────────────────────────────


const TRANSCRIPT_LINES = [
  "The biggest pain point is definitely manual data entry...",
  "We spend about 3 hours per onboarding case right now.",
  "What if we automated 80% of that workflow?",
  "That would save us roughly $40K monthly.",
];

const INSIGHTS = [
  { label: "Aha Moment", text: "3hrs per case = $40K/mo waste" },
  { label: "Key Insight", text: "80% automation opportunity" },
  { label: "Action Item", text: "Build onboarding automation POC" },
];

const PulseHeroDiagram: React.FC = () => {
  const [mouthOpen, setMouthOpen] = useState(false);
  const [visibleTranscript, setVisibleTranscript] = useState(0);
  const [typedChars, setTypedChars] = useState<number[]>([]);
  const [visibleInsights, setVisibleInsights] = useState(0);
  const [cycle, setCycle] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  };
  const addTimer = (fn: () => void, ms: number) => {
    timerRef.current.push(setTimeout(fn, ms));
  };

  // Mouth animation while transcript is typing
  useEffect(() => {
    if (visibleTranscript === 0) return;
    const interval = setInterval(() => setMouthOpen(p => !p), 200);
    return () => { clearInterval(interval); setMouthOpen(false); };
  }, [visibleTranscript]);

  // Main sequencer
  useEffect(() => {
    clearTimers();
    setVisibleTranscript(0);
    setTypedChars([]);
    setVisibleInsights(0);

    let t = 400;

    // Type each transcript line one by one
    TRANSCRIPT_LINES.forEach((line, lineIdx) => {
      const lineStart = t;
      addTimer(() => setVisibleTranscript(lineIdx + 1), lineStart);
      for (let c = 1; c <= line.length; c++) {
        addTimer(() => {
          setTypedChars(prev => {
            const next = [...prev];
            next[lineIdx] = c;
            return next;
          });
        }, lineStart + c * 12);
      }
      // Show insight as soon as line finishes typing
      const lineEnd = lineStart + line.length * 12;
      if (lineIdx < INSIGHTS.length) {
        addTimer(() => setVisibleInsights(lineIdx + 1), lineEnd);
      }
      t = lineEnd + 200;
    });

    // Restart cycle immediately after last line finishes
    addTimer(() => setCycle(c => c + 1), t + 800);

    return clearTimers;
  }, [cycle]);

  return (
    <div className="relative w-full max-w-lg mx-auto bg-[#FAF8F4] shadow-2xl shadow-ink/20 rounded-lg border border-ink/10 overflow-hidden" style={{ height: 420 }}>
      <div className="p-5 md:p-6 flex flex-col h-full">
        {/* Zoom-style video header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            {/* Avatar circle */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 border-2 border-accent/30 flex items-center justify-center overflow-hidden">
              {/* Simple person silhouette */}
              <svg viewBox="0 0 40 40" className="w-10 h-10 text-accent/70">
                <circle cx="20" cy="14" r="7" fill="currentColor" />
                <ellipse cx="20" cy="35" rx="13" ry="10" fill="currentColor" />
                {/* Animated mouth */}
                <ellipse
                  cx="20" cy="18"
                  rx={mouthOpen ? 2.5 : 2}
                  ry={mouthOpen ? 1.8 : 0.5}
                  fill="#FAF8F4"
                  className="transition-all duration-100"
                />
              </svg>
            </div>
            {/* Live indicator */}
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-[#FAF8F4]" />
          </div>
          <div>
            <div className="font-serif text-sm font-medium text-ink">Strategy Call</div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="font-mono text-[10px] text-red-500/80 font-medium">Recording</span>
            </div>
          </div>
        </div>

        {/* Transcript area */}
        <div className="flex-1 bg-white border border-ink/10 rounded-lg p-3.5 shadow-sm mb-3 overflow-hidden">
          <div className="font-mono text-[10px] text-ink/40 uppercase tracking-widest mb-2">Live Transcript</div>
          <div className="space-y-2">
            {TRANSCRIPT_LINES.map((line, i) => (
              <div
                key={i}
                className={`transition-all duration-300 ${i < visibleTranscript ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
              >
                <span className="font-sans text-xs text-ink/80 leading-relaxed">
                  {line.slice(0, typedChars[i] || 0)}
                  {i < visibleTranscript && (typedChars[i] || 0) < line.length && (
                    <span className="inline-block w-[2px] h-3 bg-ink/50 ml-0.5 animate-pulse align-text-bottom" />
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights area — gold themed */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Lightbulb className="w-3 h-3 text-amber-500" />
            <span className="font-mono text-[10px] text-amber-600 uppercase tracking-widest font-bold">Insights</span>
          </div>
          {INSIGHTS.map((insight, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 bg-amber-50 border border-amber-200/60 rounded-md px-3 py-1.5 transition-all duration-400 ${i < visibleInsights ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'}`}
            >
              <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="font-serif text-xs text-ink leading-snug">"{insight.text}"</span>
              <span className="font-mono text-[9px] text-amber-500 font-bold ml-auto shrink-0">{insight.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

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
              Your ideas and meeting insights<br />
              <span className="italic text-ink-muted/80">turned into content.</span>
            </h1>
            <p className="font-sans text-lg md:text-xl text-ink-muted max-w-xl leading-relaxed mb-8">
              Pulse Note analyzes your calls, surfaces the insights and themes that matter, and drafts publish-ready newsletters, social posts, and visuals on autopilot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" onClick={() => scrollTo('booking')} className="text-base px-8 py-4">Book a Demo</Button>
              <Button variant="secondary" onClick={() => scrollTo('try-it')} className="text-base px-8 py-4">See How It Works</Button>
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
    title: 'Collect Data',
    description: 'PulseNote automatically pulls the transcripts of your meeting recorders like Fathom, Fireflies or Otter',
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-accent" />,
    title: 'Analyze',
    description: 'AI surfaces key themes, aha moments, and actionable insights from your conversations.',
  },
  {
    icon: <Sparkles className="w-8 h-8 text-accent" />,
    title: 'Generate',
    description: 'You select relevant "aha moments" to be used to generate newsletters, social media posts, and images.',
  },
  {
    icon: <Send className="w-8 h-8 text-accent" />,
    title: 'Publish',
    description: 'Draft newsletters, social posts, and images are approved and scheduled for posting',
  },
];

const AHA_MOMENTS = [
  "Clients spend 3hrs per onboarding case",
  "80% of workflow can be automated",
  "Manual data entry is the #1 pain point",
  "$40K monthly savings opportunity",
  "Compliance checks slow down 60% of cases",
];

const TRANSCRIPT_WORDS = "So the biggest challenge we're seeing is that clients spend over three hours on each onboarding case and most of that time is manual data entry which could easily be automated we estimate about eighty percent of the workflow can be handled by AI and that alone would save roughly forty thousand dollars per month".split(' ');

const MeetingAnalyzerAnimation: React.FC = () => {
  const [phase, setPhase] = useState<'call' | 'ahas' | 'selecting' | 'post'>('call');
  const [wavePhase, setWavePhase] = useState(0);
  const [visibleAhas, setVisibleAhas] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [showPost, setShowPost] = useState(false);
  const [typedWords, setTypedWords] = useState(0);
  const [cycle, setCycle] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => { timerRef.current.forEach(clearTimeout); timerRef.current = []; };
  const addTimer = (fn: () => void, ms: number) => { timerRef.current.push(setTimeout(fn, ms)); };

  // Wave animation during call phase
  useEffect(() => {
    if (phase !== 'call') return;
    const interval = setInterval(() => setWavePhase(p => p + 1), 150);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    clearTimers();
    setPhase('call');
    setVisibleAhas(0);
    setSelected([]);
    setShowPost(false);
    setWavePhase(0);
    setTypedWords(0);

    const wordDelay = 60;
    for (let i = 1; i <= TRANSCRIPT_WORDS.length; i++) {
      addTimer(() => setTypedWords(i), i * wordDelay);
    }
    const callDuration = TRANSCRIPT_WORDS.length * wordDelay + 300;

    addTimer(() => setPhase('ahas'), callDuration);

    for (let i = 1; i <= AHA_MOMENTS.length; i++) {
      addTimer(() => setVisibleAhas(i), callDuration + i * 300);
    }
    const afterAhas = callDuration + AHA_MOMENTS.length * 300 + 300;

    addTimer(() => { setPhase('selecting'); setSelected([0]); }, afterAhas);
    addTimer(() => setSelected([0, 2]), afterAhas + 250);
    addTimer(() => setSelected([0, 2, 3]), afterAhas + 500);

    addTimer(() => { setPhase('post'); setShowPost(true); }, afterAhas + 800);

    addTimer(() => setCycle(c => c + 1), afterAhas + 2800);

    return clearTimers;
  }, [cycle]);

  const isCall = phase === 'call';
  const isAhas = phase === 'ahas' || phase === 'selecting';
  const isPost = phase === 'post';

  return (
    <div className="w-full bg-[#FAF8F4] rounded-lg border border-ink/10 shadow-xl overflow-hidden h-[416px]">
      <div className="p-4 md:p-5 h-full flex flex-col">
        {/* Zoom call header — always visible */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 border border-blue-400/30">
              <Video className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <div className="font-serif text-sm font-medium text-ink">Strategy Call</div>
              <div className="font-mono text-[10px] text-ink/40">Zoom &middot; 3 participants</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isCall ? 'bg-red-500 animate-pulse' : 'bg-ink/20'}`} />
            <span className={`font-mono text-[10px] font-medium ${isCall ? 'text-red-500' : 'text-ink/30'}`}>{isCall ? 'REC' : 'DONE'}</span>
          </div>
        </div>

        {/* Content area — relative container with absolute children for fixed height */}
        <div className="relative flex-1">
          {/* Call phase: waveform + transcript */}
          <div className={`absolute inset-0 transition-opacity duration-200 ${isCall ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['bg-blue-400', 'bg-emerald-400', 'bg-amber-400'].map((bg, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-[#FAF8F4] flex items-center justify-center`}>
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-[3px] flex-1 h-6">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const h = Math.abs(Math.sin((i + wavePhase) * 0.45)) * 16 + 3;
                    return (
                      <div key={i} className="w-[2px] rounded-full bg-blue-400/60 transition-all duration-150" style={{ height: `${h}px` }} />
                    );
                  })}
                </div>
              </div>
              <div className="bg-white border border-ink/10 rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  <span className="font-mono text-[9px] text-ink/40 uppercase tracking-wider">Live Transcript</span>
                </div>
                <p className="font-sans text-xs text-ink/70 leading-relaxed">
                  {TRANSCRIPT_WORDS.slice(0, typedWords).join(' ')}
                  {typedWords < TRANSCRIPT_WORDS.length && (
                    <span className="inline-block w-[2px] h-3 bg-ink/50 ml-0.5 animate-pulse align-text-bottom" />
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Aha moments phase */}
          <div className={`absolute inset-0 transition-opacity duration-200 ${isAhas ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-3.5 h-3.5 text-accent" />
                <span className="font-mono text-[10px] text-accent uppercase tracking-widest font-bold">Aha Moments Detected</span>
              </div>
              {AHA_MOMENTS.map((aha, i) => {
                const isSelected = selected.includes(i);
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition-all duration-300 ${
                      i < visibleAhas ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    } ${isSelected ? 'bg-accent/8 border-accent/30' : 'bg-white border-ink/10'}`}
                  >
                    <div className={`rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected ? 'bg-accent text-white' : 'border border-ink/20'
                    }`} style={{ width: 18, height: 18 }}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <span className="font-sans text-xs text-ink/80">{aha}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Post phase */}
          <div className={`absolute inset-0 overflow-y-auto transition-opacity duration-200 ${isPost ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="font-mono text-[10px] text-accent uppercase tracking-widest font-bold">Content Generated</span>
            </div>
            <div className="bg-white border border-ink/10 rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                <span className="font-mono text-[10px] text-ink/60 font-medium">LinkedIn Post</span>
                <span className="ml-auto font-mono text-[10px] text-green-600 font-bold">Ready</span>
              </div>

              {/* Compact infographic: Onboarding time cut by 60% */}
              <div className="rounded-lg overflow-hidden mb-2 bg-gradient-to-br from-[#1a3d54] to-[#2D5A7B] p-3">
                <div className="flex items-center gap-3">
                  {/* Before/After bar chart */}
                  <svg viewBox="0 0 100 60" fill="none" className="w-20 flex-shrink-0">
                    {/* Before bar */}
                    <rect x="10" y="8" width="30" height="44" rx="3" fill="white" fillOpacity="0.15" />
                    <rect x="10" y="8" width="30" height="44" rx="3" fill="#ef4444" fillOpacity="0.3" />
                    <text x="25" y="34" textAnchor="middle" fontSize="8" fill="white" fontFamily="monospace" fontWeight="bold">3hrs</text>
                    <text x="25" y="58" textAnchor="middle" fontSize="5" fill="white" fillOpacity="0.5" fontFamily="monospace">BEFORE</text>
                    {/* After bar */}
                    <rect x="55" y="30" width="30" height="22" rx="3" fill="#E8A849" fillOpacity="0.5" />
                    <text x="70" y="45" textAnchor="middle" fontSize="8" fill="white" fontFamily="monospace" fontWeight="bold">1.2h</text>
                    <text x="70" y="58" textAnchor="middle" fontSize="5" fill="white" fillOpacity="0.5" fontFamily="monospace">AFTER</text>
                    {/* Arrow */}
                    <path d="M43 30 L52 30" stroke="#E8A849" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                    <defs><marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><path d="M0,0 L6,2 L0,4" fill="#E8A849" /></marker></defs>
                  </svg>
                  <div className="flex-1">
                    <div className="font-serif text-white text-sm font-semibold leading-tight">Onboarding Time Cut by 60%</div>
                    <div className="font-sans text-white/50 text-[9px] mt-1">$40K/month saved through automation</div>
                  </div>
                </div>
              </div>

              <p className="font-serif text-xs text-ink leading-relaxed mb-1.5">
                Companies spend 3+ hours on each onboarding case — that's $40K/month in hidden costs.
              </p>
              <p className="font-serif text-xs text-ink leading-relaxed mb-2">
                Automate 80% of the workflow and cut onboarding time by 60%.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {['#Automation', '#SaaS', '#CustomerSuccess'].map(tag => (
                    <span key={tag} className="font-mono text-[9px] text-accent font-medium">{tag}</span>
                  ))}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A66C2] text-white text-[10px] font-semibold shadow-sm cursor-pointer">
                  <Send className="w-2.5 h-2.5" />
                  Post Now
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IDEA_TO_CONTENT_TEXT = "How to reduce customer churn with proactive outreach";
const NEWSLETTER_TITLE = "The Proactive Outreach Playbook";
const NEWSLETTER_BODY = [
  "Customer churn doesn't happen overnight. It's a slow bleed — missed check-ins, unresolved tickets, and radio silence that compounds until the cancellation email lands.",
  "But here's what top-performing teams do differently: they don't wait for churn signals. They create them.",
  "After analyzing 200+ client conversations, one pattern stood out — companies that implemented a 3-touch proactive outreach system reduced churn by 34% in the first quarter alone.",
];

const IdeaToContentAnimation: React.FC = () => {
  const [typedChars, setTypedChars] = useState(0);
  const [showGenBtn, setShowGenBtn] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showArticle, setShowArticle] = useState(false);
  const [articleLines, setArticleLines] = useState(0);
  const [cycle, setCycle] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => { timerRef.current.forEach(clearTimeout); timerRef.current = []; };
  const addTimer = (fn: () => void, ms: number) => { timerRef.current.push(setTimeout(fn, ms)); };

  useEffect(() => {
    clearTimers();
    setTypedChars(0);
    setShowGenBtn(false);
    setGenerating(false);
    setShowArticle(false);
    setArticleLines(0);

    // Type the idea fast
    for (let i = 1; i <= IDEA_TO_CONTENT_TEXT.length; i++) {
      addTimer(() => setTypedChars(i), i * 15);
    }
    const afterTyping = IDEA_TO_CONTENT_TEXT.length * 15 + 200;
    addTimer(() => setShowGenBtn(true), afterTyping);
    addTimer(() => setGenerating(true), afterTyping + 400);
    addTimer(() => { setGenerating(false); setShowArticle(true); }, afterTyping + 1200);

    // Reveal article paragraphs fast
    for (let i = 1; i <= NEWSLETTER_BODY.length; i++) {
      addTimer(() => setArticleLines(i), afterTyping + 1200 + i * 300);
    }

    const totalVisible = afterTyping + 1200 + NEWSLETTER_BODY.length * 300 + 800;
    addTimer(() => setCycle(c => c + 1), totalVisible);

    return clearTimers;
  }, [cycle]);

  return (
    <div className="w-full bg-[#FAF8F4] rounded-lg border border-ink/10 shadow-xl overflow-hidden h-[480px]">
      <div className="p-5 md:p-6 h-full flex flex-col">
        {/* Idea input — always visible */}
        <div className="border border-ink/15 rounded-lg bg-white p-4 mb-4 shadow-sm">
          <div className="font-mono text-[10px] text-ink uppercase tracking-widest mb-2">Your Idea</div>
          <div className="font-serif text-sm md:text-base min-h-[24px]" style={{ color: '#000000' }}>
            {IDEA_TO_CONTENT_TEXT.slice(0, typedChars)}
            {typedChars < IDEA_TO_CONTENT_TEXT.length && (
              <span className="inline-block w-[2px] h-4 bg-ink/70 ml-0.5 animate-pulse align-text-bottom" />
            )}
          </div>
        </div>

        {/* Generate button — always visible, opacity controlled */}
        <div className={`flex justify-end mb-4 transition-all duration-300 ${showGenBtn && !showArticle ? 'opacity-100 translate-y-0' : showGenBtn ? 'opacity-0' : 'opacity-0 translate-y-2'}`}>
          <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white ${generating ? 'bg-accent/80' : 'bg-accent'} shadow-md`}>
            <Sparkles className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
            {generating ? 'Generating...' : 'Generate Content'}
          </div>
        </div>

        {/* Newsletter article — relative container for stable height */}
        <div className="relative flex-1">
          <div className={`absolute inset-0 transition-opacity duration-200 ${showArticle ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="bg-white border border-ink/10 rounded-lg p-4 shadow-sm h-full overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-accent" />
                <span className="font-mono text-[10px] text-ink/50 font-medium uppercase tracking-wider">Newsletter Article</span>
                <span className="ml-auto font-mono text-[10px] text-green-600 font-bold">Ready</span>
              </div>
              <h4 className="font-serif text-base text-ink font-semibold mb-2">{NEWSLETTER_TITLE}</h4>
              <div className="space-y-2">
                {NEWSLETTER_BODY.map((para, i) => (
                  <p
                    key={i}
                    className={`font-sans text-xs text-ink/70 leading-relaxed transition-all duration-400 ${
                      i < articleLines ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    {para}
                  </p>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-ink/5">
                {['#CustomerSuccess', '#Retention', '#SaaS'].map(tag => (
                  <span key={tag} className="font-mono text-[10px] text-accent font-medium">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CALENDAR_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const EXISTING_POSTS = [
  { day: 1, label: '5 AI Tips', color: 'bg-[#0A66C2]' },
  { day: 3, label: 'Case Study', color: 'bg-[#E1306C]' },
  { day: 5, label: 'Q&A Thread', color: 'bg-[#1877F2]' },
];
const NEW_POST = { day: 4, label: 'Outreach Guide', color: 'bg-accent' };

const LinkedInIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);
const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z"/></svg>
);

const ScheduleAnimation: React.FC = () => {
  const [phase, setPhase] = useState<'calendar' | 'scheduled' | 'posting' | 'posted'>('calendar');
  const [cycle, setCycle] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => { timerRef.current.forEach(clearTimeout); timerRef.current = []; };
  const addTimer = (fn: () => void, ms: number) => { timerRef.current.push(setTimeout(fn, ms)); };

  useEffect(() => {
    clearTimers();
    setPhase('calendar');

    addTimer(() => setPhase('scheduled'), 1200);
    addTimer(() => setPhase('posting'), 2400);
    addTimer(() => setPhase('posted'), 3200);
    addTimer(() => setCycle(c => c + 1), 5200);

    return clearTimers;
  }, [cycle]);

  const scheduled = phase === 'scheduled' || phase === 'posting' || phase === 'posted';
  const allPosts = scheduled ? [...EXISTING_POSTS, NEW_POST] : EXISTING_POSTS;

  return (
    <div className="w-full bg-[#FAF8F4] rounded-lg border border-ink/10 shadow-xl overflow-hidden min-h-[440px]">
      <div className="p-5 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <CalendarDays className="w-5 h-5 text-accent" />
            <div className="font-serif text-sm font-medium text-ink">Content Calendar</div>
          </div>
          <div className="font-mono text-[10px] text-ink/40">March 2026</div>
        </div>

        {/* Calendar grid */}
        <div className="bg-white border border-ink/10 rounded-lg p-3 mb-4 shadow-sm">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {CALENDAR_DAYS.map(day => (
              <div key={day} className="text-center font-mono text-[9px] text-ink/40 uppercase">{day}</div>
            ))}
          </div>
          {/* Calendar cells - 2 weeks */}
          {[0, 1].map(week => (
            <div key={week} className="grid grid-cols-7 gap-1 mb-1">
              {Array.from({ length: 7 }).map((_, dayIdx) => {
                const dayNum = week * 7 + dayIdx + 1;
                const post = allPosts.find(p => p.day === dayIdx + 1 && week === 0);
                const isNew = post && post === NEW_POST;
                return (
                  <div
                    key={dayIdx}
                    className={`relative rounded-md p-1.5 min-h-[44px] border transition-all duration-500 ${
                      isNew ? 'border-accent/40 bg-accent/5 scale-105' : 'border-ink/5 bg-ink/[0.02]'
                    }`}
                  >
                    <div className="font-mono text-[9px] text-ink/30 mb-0.5">{dayNum}</div>
                    {post && (
                      <div className={`transition-all duration-500 ${isNew ? 'animate-fade-in' : ''}`}>
                        <div className={`${post.color} text-white text-[7px] font-mono px-1 py-0.5 rounded leading-tight`}>
                          {post.label}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* New post card to schedule */}
        {phase === 'calendar' && (
          <div className="flex items-center justify-between bg-white border border-ink/10 rounded-lg p-3 mb-3 shadow-sm">
            <div>
              <div className="font-serif text-xs text-ink font-medium">Outreach Guide</div>
              <div className="font-mono text-[9px] text-ink/40">Thursday, 9:00 AM</div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold shadow-sm cursor-pointer">
              <CalendarDays className="w-3 h-3" />
              Schedule
            </div>
          </div>
        )}

        {/* Scheduled confirmation */}
        {phase === 'scheduled' && (
          <div className="flex items-center gap-2 bg-accent/5 border border-accent/20 rounded-lg p-3 mb-3 transition-all duration-500">
            <Check className="w-4 h-4 text-accent" />
            <span className="font-sans text-xs text-ink/70">Scheduled for Thursday, 9:00 AM</span>
          </div>
        )}

        {/* Post Now button */}
        {phase === 'scheduled' && (
          <div className="flex justify-end">
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-ink text-white text-xs font-semibold shadow-sm cursor-pointer">
              <Send className="w-3 h-3" />
              Post Now
            </div>
          </div>
        )}

        {/* Posting animation */}
        {phase === 'posting' && (
          <div className="flex items-center justify-center gap-3 py-3">
            <RefreshCw className="w-4 h-4 text-accent animate-spin" />
            <span className="font-mono text-xs text-ink/60">Publishing to platforms...</span>
          </div>
        )}

        {/* Posted confirmation */}
        {phase === 'posted' && (
          <div className="space-y-2">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest font-bold mb-2">Published</div>
            {[
              { icon: <LinkedInIcon className="w-4 h-4 text-[#0A66C2]" />, name: 'LinkedIn', color: 'border-[#0A66C2]/20' },
              { icon: <FacebookIcon className="w-4 h-4 text-[#1877F2]" />, name: 'Facebook', color: 'border-[#1877F2]/20' },
              { icon: <InstagramIcon className="w-4 h-4 text-[#E1306C]" />, name: 'Instagram', color: 'border-[#E1306C]/20' },
            ].map((platform, i) => (
              <div
                key={platform.name}
                className={`flex items-center gap-2.5 bg-white border ${platform.color} rounded-lg p-2.5 shadow-sm transition-all duration-300`}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {platform.icon}
                <span className="font-sans text-xs text-ink/80 font-medium">{platform.name}</span>
                <Check className="w-3.5 h-3.5 text-green-500 ml-auto" />
                <span className="font-mono text-[9px] text-green-600 font-medium">Live</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const BRAND_COLORS = [
  { hex: '#2D5A7B', name: 'Navy' },
  { hex: '#E8A849', name: 'Gold' },
  { hex: '#3B3B3B', name: 'Charcoal' },
  { hex: '#F5F0EB', name: 'Cream' },
];
const BRAND_FONTS = ['Playfair Display', 'Inter', 'Lora'];
const BRAND_AUDIENCES = ['SaaS Founders', 'Marketing Leaders', 'C-Suite Executives'];
const BRAND_IMAGES = [
  { title: 'Quarterly Strategy Review', subtitle: 'Leadership Meeting Recap', bg: 'from-[#2D5A7B] to-[#1a3d54]' },
  { title: 'Client Onboarding Workshop', subtitle: 'Key Takeaways & Next Steps', bg: 'from-[#3B3B3B] to-[#2D5A7B]' },
];

const BrandingAnimation: React.FC = () => {
  const [phase, setPhase] = useState<'colors' | 'fonts' | 'audience' | 'generating' | 'images'>('colors');
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [selectedFont, setSelectedFont] = useState(-1);
  const [selectedAudience, setSelectedAudience] = useState(-1);
  const [visibleImages, setVisibleImages] = useState(0);
  const [cycle, setCycle] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => { timerRef.current.forEach(clearTimeout); timerRef.current = []; };
  const addTimer = (fn: () => void, ms: number) => { timerRef.current.push(setTimeout(fn, ms)); };

  useEffect(() => {
    clearTimers();
    setPhase('colors');
    setSelectedColors([]);
    setSelectedFont(-1);
    setSelectedAudience(-1);
    setVisibleImages(0);

    // Pick colors fast
    addTimer(() => setSelectedColors([0]), 300);
    addTimer(() => setSelectedColors([0, 1]), 500);
    addTimer(() => setSelectedColors([0, 1, 2]), 700);
    addTimer(() => setSelectedColors([0, 1, 2, 3]), 900);

    // Switch to fonts
    addTimer(() => setPhase('fonts'), 1300);
    addTimer(() => setSelectedFont(0), 1700);

    // Switch to audience
    addTimer(() => setPhase('audience'), 2100);
    addTimer(() => setSelectedAudience(0), 2500);

    // Generate
    addTimer(() => setPhase('generating'), 2900);

    // Show images
    addTimer(() => setPhase('images'), 3800);
    for (let i = 1; i <= BRAND_IMAGES.length; i++) {
      addTimer(() => setVisibleImages(i), 3800 + i * 300);
    }

    // Restart
    addTimer(() => setCycle(c => c + 1), 3800 + BRAND_IMAGES.length * 300 + 1500);

    return clearTimers;
  }, [cycle]);

  const showConfig = phase === 'colors' || phase === 'fonts' || phase === 'audience' || phase === 'generating';
  const showImages = phase === 'images';

  return (
    <div className="w-full bg-[#FAF8F4] rounded-lg border border-ink/10 shadow-xl overflow-hidden h-[520px]">
      <div className="p-5 md:p-6 h-full flex flex-col">
        {/* Brand setup header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Image className="w-4 h-4 text-accent" />
          </div>
          <div>
            <div className="font-serif text-sm font-medium text-ink">Brand Kit</div>
            <div className="font-mono text-[10px] text-ink/40">Configure your brand identity</div>
          </div>
        </div>

        {/* Config section — always rendered, hidden with opacity */}
        <div className={`flex-1 transition-all duration-500 ${showConfig ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}`}>
          {/* Color picker */}
          <div className={`mb-4 transition-all duration-300 ${phase === 'colors' ? 'opacity-100' : 'opacity-60'}`}>
            <div className="font-mono text-[10px] text-ink/50 uppercase tracking-widest mb-2">Brand Colors</div>
            <div className="flex gap-2.5">
              {BRAND_COLORS.map((color, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-10 h-10 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                      selectedColors.includes(i) ? 'border-accent scale-110 shadow-md' : 'border-ink/10'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="font-mono text-[8px] text-ink/40">{color.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Font picker */}
          <div className={`mb-4 transition-all duration-300 ${phase === 'fonts' ? 'opacity-100' : phase === 'colors' ? 'opacity-40' : 'opacity-60'}`}>
            <div className="font-mono text-[10px] text-ink/50 uppercase tracking-widest mb-2">Font Family</div>
            <div className="flex gap-2">
              {BRAND_FONTS.map((font, i) => (
                <div
                  key={i}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-300 cursor-pointer ${
                    selectedFont === i ? 'border-accent bg-accent/8 text-accent' : 'border-ink/10 bg-white text-ink/60'
                  }`}
                >
                  {font}
                </div>
              ))}
            </div>
          </div>

          {/* Audience picker */}
          <div className={`mb-4 transition-all duration-300 ${phase === 'audience' ? 'opacity-100' : phase === 'colors' || phase === 'fonts' ? 'opacity-40' : 'opacity-60'}`}>
            <div className="font-mono text-[10px] text-ink/50 uppercase tracking-widest mb-2">Target Audience</div>
            <div className="flex flex-wrap gap-2">
              {BRAND_AUDIENCES.map((audience, i) => (
                <div
                  key={i}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-300 cursor-pointer ${
                    selectedAudience === i ? 'border-accent bg-accent/8 text-accent' : 'border-ink/10 bg-white text-ink/60'
                  }`}
                >
                  {audience}
                </div>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <div className={`flex justify-end mb-4 transition-all duration-300 ${phase === 'audience' || phase === 'generating' ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white ${phase === 'generating' ? 'bg-accent/80' : 'bg-accent'} shadow-md`}>
              <Sparkles className={`w-4 h-4 ${phase === 'generating' ? 'animate-spin' : ''}`} />
              {phase === 'generating' ? 'Generating...' : 'Generate Visuals'}
            </div>
          </div>
        </div>

        {/* Generated branded images — meeting scenes */}
        <div className={`flex-1 transition-all duration-500 ${showImages ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="font-mono text-[10px] text-accent uppercase tracking-widest font-bold">Branded Content</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {BRAND_IMAGES.map((img, i) => (
              <div
                key={i}
                className={`rounded-lg overflow-hidden shadow-md border border-ink/10 transition-all duration-500 ${
                  i < visibleImages ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              >
                {/* Fake meeting scene illustration */}
                <div className={`bg-gradient-to-br ${img.bg} relative overflow-hidden`}>
                  <svg viewBox="0 0 240 160" fill="none" className="w-full">
                    {/* Conference table */}
                    <ellipse cx="120" cy="120" rx="80" ry="25" fill="white" fillOpacity="0.08" />
                    {/* Laptop screens glow */}
                    <rect x="55" y="85" width="28" height="18" rx="2" fill="white" fillOpacity="0.15" />
                    <rect x="157" y="85" width="28" height="18" rx="2" fill="white" fillOpacity="0.15" />
                    <rect x="106" y="78" width="28" height="18" rx="2" fill="white" fillOpacity="0.2" />
                    {/* People silhouettes */}
                    <circle cx="69" cy="62" r="10" fill="white" fillOpacity="0.2" />
                    <path d="M55 82 Q69 72 83 82" fill="white" fillOpacity="0.15" />
                    <circle cx="120" cy="55" r="11" fill="#E8A849" fillOpacity="0.35" />
                    <path d="M105 76 Q120 65 135 76" fill="#E8A849" fillOpacity="0.2" />
                    <circle cx="171" cy="62" r="10" fill="white" fillOpacity="0.2" />
                    <path d="M157 82 Q171 72 185 82" fill="white" fillOpacity="0.15" />
                    {/* Presentation screen */}
                    <rect x="85" y="18" width="70" height="32" rx="3" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.15" strokeWidth="1" />
                    <line x1="95" y1="28" x2="135" y2="28" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
                    <line x1="95" y1="34" x2="125" y2="34" stroke="white" strokeOpacity="0.15" strokeWidth="1" />
                    <line x1="95" y1="39" x2="145" y2="39" stroke="white" strokeOpacity="0.1" strokeWidth="1" />
                    {/* Chart bars on screen */}
                    <rect x="138" y="30" width="6" height="14" rx="1" fill="#E8A849" fillOpacity="0.4" />
                    <rect x="146" y="34" width="6" height="10" rx="1" fill="white" fillOpacity="0.2" />
                  </svg>
                </div>
                {/* Card label */}
                <div className="bg-white p-2.5">
                  <div className="w-4 h-0.5 bg-[#E8A849] mb-1.5 rounded" />
                  <div className="font-serif text-xs text-ink font-semibold leading-tight">{img.title}</div>
                  <div className="font-sans text-ink/50 text-[9px] mt-0.5">{img.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const WhatPulseDoes: React.FC = () => (
  <Section id="product" pattern="grid">
    <SectionHeader eyebrow="The Product" title="What you can do with PulseNote" subtitle="From raw ideas and meeting insights to polished content, automatically." />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <ScrollReveal delay={200}>
        <MeetingAnalyzerAnimation />
      </ScrollReveal>
      <ScrollReveal delay={400} direction="left">
        <div>
          <h3 className="font-serif text-3xl md:text-4xl text-ink mb-4">Turn your meeting Insights to content</h3>
          <p className="font-sans text-lg text-ink-muted leading-relaxed">
            Automatically identify trends and Surface the insights that matter from every meeting. Track actions and aha moments that matter the most for your prospects.
          </p>
        </div>
      </ScrollReveal>
    </div>

    {/* Idea to Content row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-20">
      <ScrollReveal delay={200}>
        <div>
          <h3 className="font-serif text-3xl md:text-4xl text-ink mb-4">From Idea to Content in Seconds</h3>
          <p className="font-sans text-lg text-ink-muted leading-relaxed">
            Type a rough idea, hit generate, and get polished LinkedIn posts instantly. AI drafts, you refine — publish when ready.
          </p>
        </div>
      </ScrollReveal>
      <ScrollReveal delay={400} direction="left">
        <IdeaToContentAnimation />
      </ScrollReveal>
    </div>

    {/* Stay on Schedule row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-20">
      <ScrollReveal delay={200}>
        <ScheduleAnimation />
      </ScrollReveal>
      <ScrollReveal delay={400} direction="left">
        <div>
          <h3 className="font-serif text-3xl md:text-4xl text-ink mb-4">Stay on Schedule</h3>
          <p className="font-sans text-lg text-ink-muted leading-relaxed">
            Schedule your social media posts on LinkedIn, Facebook and Instagram. One click, every platform.
          </p>
        </div>
      </ScrollReveal>
    </div>

    {/* Consistent Branding row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-20">
      <ScrollReveal delay={200}>
        <div>
          <h3 className="font-serif text-3xl md:text-4xl text-ink mb-4">Create Consistent Branding</h3>
          <p className="font-sans text-lg text-ink-muted leading-relaxed">
            Add your colors, fonts, voice and target audience and AI will create consistent branded content always.
          </p>
        </div>
      </ScrollReveal>
      <ScrollReveal delay={400} direction="left">
        <BrandingAnimation />
      </ScrollReveal>
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
          Pulse Note is not another annoying AI joining your meetings, it leverages your exisiting recordings, past and future. Every recording is processed through layered analysis that extracts themes, highlights breakthrough moments, and clusters related insights across conversations.
        </p>
        <ul className="space-y-4">
          {['Full transcripts with speaker attribution', 'Key insight extraction & aha-moment highlighting', 'Theme clustering across multiple meetings', 'Searchable knowledge vault of all previous conversations'].map((item, i) => (
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
          {['Weekly newsletter drafts from meeting insights', 'Platform-optimized social posts (LinkedIn, Meta)', 'Maintains your authentic voice and tone', 'Review, edit, and approve before publishing'].map((item, i) => (
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
    <SectionHeader eyebrow="Visuals" title="Branded creative media and text for every piece" subtitle="Custom visuals that match your content — no stock photos, no design tools needed." />
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
    <Section id="try-it" className="bg-alt/30">
      <SectionHeader eyebrow="Creator Mode" title="Try Now - Pick insights, generate content." subtitle="Hand-pick the moments that matter, then let Pulse turn them into polished content." />
      <ScrollReveal>
        {showDemoPreview ? (
          <div className="max-w-4xl mx-auto bg-white shadow-xl border border-ink/10 rounded-sm overflow-hidden">
            {/* Header */}
            <div className="px-4 py-2.5 border-b border-ink/10 bg-base/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="font-bold text-sm text-ink">Generated Content</span>
                <span className="text-[10px] text-ink-muted bg-base px-2 py-0.5 rounded-full border border-ink/10">Demo</span>
              </div>
              <button onClick={resetPreview} className="text-xs font-medium border border-ink/20 px-3 py-1 hover:bg-base transition-colors">
                Try again
              </button>
            </div>

            {/* Article — compact */}
            <div className="px-4 py-3 border-b border-ink/10">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-3 h-3 text-accent" />
                <span className="font-mono text-[9px] text-ink/50 uppercase tracking-widest">Newsletter</span>
              </div>
              <div className="flex gap-3 items-start">
                <img src={activeScenario.article.heroImage} alt="" className="w-20 h-14 rounded border border-ink/10 object-cover flex-shrink-0" />
                <div className="min-w-0">
                  <h4 className="font-serif text-sm text-ink font-semibold leading-tight mb-0.5 truncate">{activeScenario.article.title}</h4>
                  <p className="text-[11px] text-ink-muted leading-snug line-clamp-2">{activeScenario.article.intro}</p>
                </div>
              </div>
            </div>

            {/* Posts — 4 in a row, compact cards */}
            <div className="px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <Send className="w-3 h-3 text-accent" />
                <span className="font-mono text-[9px] text-ink/50 uppercase tracking-widest">Social Posts</span>
                <span className="bg-accent/10 text-accent text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-auto">{activeScenario.posts.length}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {activeScenario.posts.map((post, i) => (
                  <div key={`${activeScenario.id}-${i}`} className="border border-ink/10 rounded-lg overflow-hidden bg-base/5">
                    <img src={post.image} alt="" className="w-full aspect-square object-cover" />
                    <div className="p-2">
                      <p className="text-accent font-bold text-[9px] mb-0.5">{post.day}</p>
                      <h5 className="font-serif text-[11px] text-ink leading-tight mb-1 line-clamp-2">{post.title}</h5>
                      <p className="text-[9px] text-ink-muted leading-snug line-clamp-2 mb-1">{post.excerpt}</p>
                      <p className="text-accent text-[8px]">{post.tags}</p>
                    </div>
                  </div>
                ))}
              </div>
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

const personas = [
  { title: 'The Founder', desc: 'Turn your brilliant business ideas that haunt you during the day into content.', img: '/personas/founder.jpg' },
  { title: 'The Podcaster', desc: 'Capture millions of great ideas while talking to guests and turn them into content.', img: '/personas/podcaster.jpg' },
  { title: 'The Salesman', desc: 'Extract winning patterns and objections from your best sales conversations.', img: '/personas/salesman.jpg' },
  { title: 'The Networker', desc: 'Generate blog posts, summaries, and shareable takeaways from online networking events.', img: '/personas/networker.jpg' },
];

const UseCases: React.FC = () => (
  <Section id="use-cases" pattern="grid">
    <SectionHeader eyebrow="Use Cases" title="Who is PulseNote For?" subtitle="Whether you're a founder, content creator, or team lead — Pulse fits into your workflow." />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {personas.map((p, i) => (
        <ScrollReveal key={p.title} delay={i * 120} className="h-full">
          <div className="bg-white border border-ink/10 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group text-center h-full flex flex-col items-center">
            <div className="w-44 h-44 mx-auto mb-6 rounded-full bg-[#FAF8F4] border border-ink/10 p-2 group-hover:border-accent/30 transition-colors overflow-hidden">
              <img src={p.img} alt={p.title} className="w-full h-full object-cover object-top rounded-full scale-150" />
            </div>
            <h3 className="font-serif text-xl text-ink mb-2">{p.title}</h3>
            <p className="text-sm text-ink-muted leading-relaxed flex-1">{p.desc}</p>
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
  { q: 'What outputs does Pulse generate?', a: 'Newsletters, LinkedIn posts, Meta threads, blog summaries, AI-generated images, and insight reports. Each format is optimized for its platform and audience.' },
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
        body: JSON.stringify({ ...formData, dateTime: selectedTime, bookingType: 'demo-ai' }),
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
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> 30 Min</div>
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
                          <button onClick={() => { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); setSelectedDate(null); setSelectedTime(null); }} className="p-1 hover:bg-base rounded-full text-ink-muted"><ChevronLeft className="w-5 h-5" /></button>
                          <button onClick={() => { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); setSelectedDate(null); setSelectedTime(null); }} className="p-1 hover:bg-base rounded-full text-ink-muted"><ChevronRight className="w-5 h-5" /></button>
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
                              {displaySlots.filter(slot => !isTimeDisabled(slot.value)).map(slot => (
                                  <button
                                    key={slot.value}
                                    onClick={() => setSelectedTime(slot.value)}
                                    className={`py-3 px-2 text-sm border rounded-sm transition-all text-center ${selectedTime === slot.value
                                      ? 'bg-accent text-white border-accent shadow-md scale-105'
                                      : 'bg-white border-ink/10 text-ink hover:border-accent hover:text-accent hover:shadow-sm'
                                      }`}
                                  >
                                    {slot.display}
                                  </button>
                              ))}
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
            Every single idea you have is a goldmine of content. PulseNote makes sure nothing gets lost.
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
      <CreatorMode />
      <UseCases />
      <PulseBooking onNavigate={onNavigate} />
      <FinalCTA />
    </div>
  );
};

export default PulseLandingPage;
