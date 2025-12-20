
import React from 'react';
import { GitGraph, Settings, Cpu, Zap, MessageSquare, Check, TrendingUp, Activity } from 'lucide-react';
import { Section, SectionHeader, ScrollReveal } from './Shared';

const CRMFlowDiagram: React.FC = () => (
  <div className="relative w-full max-w-md lg:max-w-lg mx-auto aspect-[4/3] bg-white shadow-2xl shadow-ink/20 rounded-sm border border-ink/10 p-6 md:p-10 rotate-[1deg] hover:rotate-0 transition-transform duration-700 ease-out group">
    <div className="flex justify-between items-center mb-8 border-b border-ink/10 pb-4">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-ink/10"></div>
        <div className="w-3 h-3 rounded-full bg-ink/10"></div>
      </div>
      <div className="font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">Pipeline Automation v1.4</div>
    </div>
    <div className="relative h-full w-full">
      <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 300 180" fill="none">
        <path d="M 20 90 C 80 90, 100 90, 140 90 C 180 90, 200 90, 260 90" stroke="#C4B59D" strokeWidth="1.5" strokeDasharray="6 4" />
        <path d="M 20 90 C 80 90, 100 90, 140 90" stroke="#3f84c8" strokeWidth="2" className="animate-pulse" />

        <circle cx="30" cy="90" r="18" fill="white" stroke="#222" strokeWidth="1.5" />
        <circle cx="30" cy="90" r="6" fill="#222" />
        <text x="30" y="130" textAnchor="middle" fontSize="10" fill="#5A4A3A" fontFamily="monospace">LEADS</text>

        <path d="M 140 70 L 157 80 L 157 100 L 140 110 L 123 100 L 123 80 Z" fill="white" stroke="#3f84c8" strokeWidth="1.5" />
        <circle cx="140" cy="90" r="8" fill="#3f84c8" fillOpacity="0.2" className="animate-ping" style={{ animationDuration: '3s' }} />
        <text x="140" y="130" textAnchor="middle" fontSize="10" fill="#3f84c8" fontFamily="monospace">ENRICH</text>

        <rect x="250" y="70" width="30" height="40" rx="2" fill="#222" />
        <line x1="255" y1="80" x2="275" y2="80" stroke="white" strokeWidth="1" opacity="0.5" />
        <line x1="255" y1="90" x2="275" y2="90" stroke="white" strokeWidth="1" opacity="0.5" />
        <text x="265" y="130" textAnchor="middle" fontSize="10" fill="#5A4A3A" fontFamily="monospace">CRM</text>

        <path d="M 157 80 C 180 40, 220 40, 240 50" stroke="#C4B59D" strokeWidth="1" strokeDasharray="2 2" />
        <rect x="240" y="35" width="24" height="24" rx="4" fill="white" stroke="#222" strokeWidth="1" />
        <path d="M 252 47 L 252 47" stroke="#222" strokeWidth="4" strokeLinecap="round" />
      </svg>

      <div className="absolute top-0 right-0 bg-base shadow-lg border border-ink/10 px-4 py-2 rounded flex items-center gap-3 animate-float">
        <Check className="w-4 h-4 text-green-600" />
        <span className="text-xs font-medium text-ink">Qualified Lead</span>
      </div>
    </div>
  </div>
);

const MarketingEngineDiagram: React.FC = () => (
  <div className="relative w-full max-w-md lg:max-w-lg mx-auto aspect-[4/3] bg-white shadow-2xl shadow-ink/20 rounded-sm border border-ink/10 p-6 md:p-10 rotate-[-1deg] hover:rotate-0 transition-transform duration-700 ease-out group">
    <div className="flex justify-between items-center mb-8 border-b border-ink/10 pb-4">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-ink/10"></div>
        <div className="w-3 h-3 rounded-full bg-ink/10"></div>
      </div>
      <div className="font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">Content Multiplier v2.0</div>
    </div>
    <div className="relative h-full w-full">
      <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 300 180" fill="none">
        <circle cx="150" cy="90" r="24" fill="white" stroke="#222" strokeWidth="1.5" />
        <polygon points="145,80 160,90 145,100" fill="#222" />

        <line x1="174" y1="90" x2="240" y2="50" stroke="#C4B59D" strokeWidth="1.5" />
        <line x1="174" y1="90" x2="240" y2="130" stroke="#C4B59D" strokeWidth="1.5" />
        <line x1="126" y1="90" x2="60" y2="90" stroke="#C4B59D" strokeWidth="1.5" />

        <circle cx="150" cy="90" r="30" stroke="#3f84c8" strokeWidth="1" className="animate-ping" style={{ animationDuration: '2s', opacity: 0.2 }} />

        <rect x="230" y="30" width="30" height="40" rx="2" fill="white" stroke="#3f84c8" strokeWidth="1.5" />
        <line x1="238" y1="45" x2="252" y2="45" stroke="#3f84c8" strokeWidth="1" />
        <line x1="238" y1="55" x2="252" y2="55" stroke="#3f84c8" strokeWidth="1" />

        <circle cx="245" cy="130" r="15" fill="white" stroke="#3f84c8" strokeWidth="1.5" />
        <path d="M 238 132 L 244 138 L 254 124" stroke="#3f84c8" strokeWidth="1.5" fill="none" />

        <rect x="30" y="75" width="30" height="30" rx="2" fill="#222" />
        <path d="M 35 85 L 45 92 L 55 85" stroke="white" strokeWidth="1.5" fill="none" />

        <text x="150" y="135" textAnchor="middle" fontSize="10" fill="#222" fontFamily="monospace" letterSpacing="0.1em">SOURCE</text>
        <text x="245" y="85" textAnchor="middle" fontSize="9" fill="#3f84c8" fontFamily="monospace">REPURPOSED</text>
      </svg>

      <div className="absolute top-4 left-0 bg-base shadow-lg border border-ink/10 px-4 py-2 rounded flex items-center gap-3 animate-float-delayed">
        <TrendingUp className="w-4 h-4 text-ink-muted" />
        <span className="text-xs font-medium text-ink">4x Reach</span>
      </div>
    </div>
  </div>
);

const OpsDiagram: React.FC = () => (
  <div className="relative w-full max-w-md lg:max-w-lg mx-auto aspect-[4/3] bg-white shadow-2xl shadow-ink/20 rounded-sm border border-ink/10 p-6 md:p-10 rotate-[1deg] hover:rotate-0 transition-transform duration-700 ease-out group">
    <div className="flex justify-between items-center mb-8 border-b border-ink/10 pb-4">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-ink/10"></div>
        <div className="w-3 h-3 rounded-full bg-ink/10"></div>
      </div>
      <div className="font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">Central Command v3.0</div>
    </div>
    <div className="relative h-full w-full">
      <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 300 180" fill="none">
        <circle cx="150" cy="90" r="25" fill="#222" />
        <circle cx="150" cy="90" r="35" stroke="#222" strokeWidth="1" strokeDasharray="2 4" className="animate-spin-slow" />
        <text x="150" y="94" textAnchor="middle" fontSize="8" fill="white" fontFamily="monospace" fontWeight="bold">AI CORE</text>

        <g transform="translate(20, 50)">
          <rect x="0" y="0" width="40" height="20" rx="4" fill="white" stroke="#222222" strokeWidth="1" />
          <text x="20" y="13" textAnchor="middle" fontSize="8" fill="#555">CALL</text>
          <line x1="42" y1="10" x2="100" y2="35" stroke="#C4B59D" strokeWidth="1.5" strokeDasharray="3 3" />
        </g>
        <g transform="translate(20, 110)">
          <rect x="0" y="0" width="40" height="20" rx="4" fill="white" stroke="#222222" strokeWidth="1" />
          <text x="20" y="13" textAnchor="middle" fontSize="8" fill="#555">EMAIL</text>
          <line x1="42" y1="10" x2="100" y2="-15" stroke="#C4B59D" strokeWidth="1.5" strokeDasharray="3 3" />
        </g>

        <path d="M 175 90 L 240 35" stroke="#3f84c8" strokeWidth="1.5" />
        <path d="M 175 90 L 240 90" stroke="#3f84c8" strokeWidth="1.5" />
        <path d="M 175 90 L 240 145" stroke="#3f84c8" strokeWidth="1.5" />

        <g transform="translate(245, 35)">
          <circle cx="0" cy="0" r="15" fill="white" stroke="#3f84c8" strokeWidth="1.5" />
          <path d="M -5 -5 L 5 5" stroke="#3f84c8" strokeWidth="1.5" />
          <path d="M 5 -5 L -5 5" stroke="#3f84c8" strokeWidth="1.5" />
          <text x="0" y="25" textAnchor="middle" fontSize="8" fill="#3f84c8">CALENDAR</text>
        </g>

        <g transform="translate(245, 90)">
          <circle cx="0" cy="0" r="15" fill="white" stroke="#3f84c8" strokeWidth="1.5" />
          <rect x="-8" y="-8" width="16" height="16" stroke="#3f84c8" strokeWidth="1" />
          <text x="0" y="25" textAnchor="middle" fontSize="8" fill="#3f84c8">DISPATCH</text>
        </g>

        <g transform="translate(245, 145)">
          <circle cx="0" cy="0" r="15" fill="white" stroke="#3f84c8" strokeWidth="1.5" />
          <path d="M -8 -5 h 16 v 10 h -16 z" stroke="#3f84c8" strokeWidth="1" fill="none" />
          <text x="0" y="25" textAnchor="middle" fontSize="8" fill="#3f84c8">RECORD</text>
        </g>
      </svg>

      <div className="absolute bottom-8 left-0 bg-base shadow-lg border border-ink/10 px-4 py-2 rounded flex items-center gap-3 animate-float">
        <Activity className="w-4 h-4 text-accent" />
        <span className="text-xs font-medium text-ink">Routing Active</span>
      </div>
    </div>
  </div>
);

const Solutions: React.FC = () => (
  <Section id="automation" pattern="nodes">
    <SectionHeader
      eyebrow="Folio III — The Solution"
      title="What We Automate"
      subtitle="We don't just 'consult'. We map, build, and deploy."
    />

    <div className="space-y-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
          <ScrollReveal direction="right">
            <div className="w-12 h-12 bg-accent/10 text-accent flex items-center justify-center rounded-sm mb-4">
              <GitGraph className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-3xl text-ink">Sales & Pipeline Ops</h3>
            <p className="text-ink-muted text-lg leading-relaxed">
              Stop manually enriching leads or copy-pasting data between tools. We build self-healing pipelines that enrich contacts, draft personalized outreach, and update your CRM automatically.
            </p>
            <ul className="space-y-3 mt-4">
              <li className="flex items-center gap-3 text-ink text-sm font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div> Automated Lead Enrichment
              </li>
              <li className="flex items-center gap-3 text-ink text-sm font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div> CRM Hygiene & Deduplication
              </li>
              <li className="flex items-center gap-3 text-ink text-sm font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div> Slack Alerts for High-Intent Leads
              </li>
            </ul>
          </ScrollReveal>
        </div>
        <div className="lg:col-span-7 flex justify-center lg:justify-end order-1 lg:order-2">
          <ScrollReveal direction="left" delay={200} className="w-full flex justify-center lg:justify-end">
            <CRMFlowDiagram />
          </ScrollReveal>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex justify-center lg:justify-start order-1">
          <ScrollReveal direction="right" delay={200} className="w-full flex justify-center lg:justify-start">
            <MarketingEngineDiagram />
          </ScrollReveal>
        </div>
        <div className="lg:col-span-5 space-y-6 order-2">
          <ScrollReveal direction="left">
            <div className="w-12 h-12 bg-accent/10 text-accent flex items-center justify-center rounded-sm mb-4">
              <Settings className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-3xl text-ink">Content & Marketing Engine</h3>
            <p className="text-ink-muted text-lg leading-relaxed">
              Turn one seed asset into a month of content. Our workflows take a single video or webinar and automatically generate blog posts, newsletters, and social threads—maintaining your unique voice.
            </p>
            <div className="mb-4">
              <a href="https://garyvaynerchuk.com/the-garyvee-content-strategy/" target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">
                Based on: The GaryVee Content Strategy &rarr;
              </a>
            </div>
            <ul className="space-y-3 mt-4">
              <li className="flex items-center gap-3 text-ink text-sm font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div> Video to Blog Transformation
              </li>
              <li className="flex items-center gap-3 text-ink text-sm font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div> Newsletter Auto-Drafting
              </li>
              <li className="flex items-center gap-3 text-ink text-sm font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div> Social Media Clipping
              </li>
            </ul>
          </ScrollReveal>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
          <ScrollReveal direction="right">
            <div className="w-12 h-12 bg-accent/10 text-accent flex items-center justify-center rounded-sm mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-3xl text-ink">Operational Cost & Logic</h3>
            <p className="text-ink-muted text-lg leading-relaxed">
              Reclaim the 30% of opex lost to coordination drag. We replace human dispatchers, secretaries, and concierges with always-on AI agents that handle logistics, scheduling, and first-line support with zero latency.
            </p>
            <div className="mb-4">
              <a href="https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier" target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">
                Reference: McKinsey Economic Potential &rarr;
              </a>
            </div>
            <ul className="space-y-3 mt-4">
              <li className="flex items-center gap-3 text-ink text-sm font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div> 24/7 AI Voice Receptionist
              </li>
              <li className="flex items-center gap-3 text-ink text-sm font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div> Smart Dispatch & Routing
              </li>
              <li className="flex items-center gap-3 text-ink text-sm font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div> Executive Admin Automation
              </li>
            </ul>
          </ScrollReveal>
        </div>
        <div className="lg:col-span-7 flex justify-center lg:justify-end order-1 lg:order-2">
          <ScrollReveal direction="left" delay={200} className="w-full flex justify-center lg:justify-end">
            <OpsDiagram />
          </ScrollReveal>
        </div>
      </div>

      <ScrollReveal delay={200}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-12 border-t border-ink/10">
          <div className="col-span-1 lg:col-span-1">
            <h4 className="font-serif text-2xl text-ink mb-4">Also Available: Customer Success</h4>
          </div>
          <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <Zap className="w-6 h-6 text-ink-muted mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-ink mb-1">Support Triage</h5>
                <p className="text-sm text-ink-muted">Auto-labeling and routing tickets based on sentiment and urgency.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <MessageSquare className="w-6 h-6 text-ink-muted mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-ink mb-1">Draft Responses</h5>
                <p className="text-sm text-ink-muted">AI-drafted replies for Tier 1 tickets, ready for human review.</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </Section>
);

export default Solutions;
