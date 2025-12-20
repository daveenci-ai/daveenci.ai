import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { Section, SectionHeader, ScrollReveal, GridPattern, Button, BriefingCard } from './Shared';
import type { Page } from './types';
import AgenticWorkflowImage from '../images/001 - What is an Agentic Workflow.jpg';
import SyntheticDataImage from '../images/002 - Synthetic Data Pipelines.jpg';
import ZeroTouchCRMImage from '../images/003 - Zero-Touch CRM.jpg';

import { API_ENDPOINTS } from '../config';

interface NewsletterProps {
   onNavigate?: (page: Page, hash?: string, id?: string) => void;
}

const Newsletter: React.FC<NewsletterProps> = ({ onNavigate }) => {
   const [email, setEmail] = React.useState('');
   const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
   const [message, setMessage] = React.useState('');

   const handleSubscribe = async () => {
      if (!email) return;

      setStatus('loading');
      setMessage('');

      try {
         const response = await fetch(API_ENDPOINTS.newsletter, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
         });

         const data = await response.json();

         if (response.ok) {
            setStatus('success');
            setMessage('Welcome to the Guild. Check your inbox on Tuesday.');
            setEmail('');
         } else {
            setStatus('error');
            setMessage(data.error || 'Failed to subscribe. Please try again.');
         }
      } catch (error) {
         setStatus('error');
         setMessage('Network error. Please try again later.');
      }
   };

   return (
      <Section id="newsletter" pattern="nodes" className="bg-gradient-to-b from-base to-white relative overflow-visible" overflow={true}>
         <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-alt/10 to-transparent pointer-events-none"></div>

         <SectionHeader
            eyebrow="Folio V — The Codex"
            title="Featured Briefings"
            subtitle="Architectural blueprints for the AI age. Sent weekly."
         />

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <ScrollReveal delay={100}>
               <BriefingCard
                  title="The Agentic Workflow"
                  description="Why chat interfaces are a dead end, and how to architect autonomous agent swarms that do the work for you."
                  image={AgenticWorkflowImage}
                  issueNo="042"
                  category="Architecture"
                  onClick={() => onNavigate?.('briefing-detail', undefined, 'agentic-workflow')}
               />
            </ScrollReveal>
            <ScrollReveal delay={300}>
               <BriefingCard
                  title="Synthetic Data Pipelines"
                  description="Running out of human data? Here is the playbook for generating high-fidelity synthetic datasets to fine-tune your models."
                  image={SyntheticDataImage}
                  issueNo="043"
                  category="Engineering"
                  onClick={() => onNavigate?.('briefing-detail', undefined, 'synthetic-data')}
               />
            </ScrollReveal>
            <ScrollReveal delay={500}>
               <BriefingCard
                  title="The Zero-Touch CRM"
                  description="A technical deep dive into self-healing customer databases that enrich themselves without sales rep intervention."
                  image={ZeroTouchCRMImage}
                  issueNo="044"
                  category="Operations"
                  onClick={() => onNavigate?.('briefing-detail', undefined, 'zero-touch-crm')}
               />
            </ScrollReveal>
         </div>

         <div className="flex justify-center mb-20">
            <Button variant="secondary" onClick={() => {
               onNavigate?.('briefings');
               window.scrollTo(0, 0);
            }}>
               View Full Archive
            </Button>
         </div>

         <ScrollReveal delay={200}>
            <div className="max-w-5xl mx-auto bg-white/40 backdrop-blur-md border border-ink/10 p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-ink/5 rounded-sm">
               <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
               <GridPattern className="opacity-[0.3]" />

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                  <div className="pr-0 lg:pr-8">
                     <div className="flex items-center gap-3 mb-4">
                        <Mail className="w-5 h-5 text-accent" />
                        <span className="font-mono text-xs font-bold text-accent uppercase tracking-widest">Weekly Intelligence</span>
                     </div>
                     <h3 className="font-serif text-3xl md:text-4xl text-ink mb-4 leading-tight">Join the Guild</h3>
                     <p className="text-ink-muted text-lg mb-8 leading-relaxed font-serif italic">
                        "Receive one high-leverage automation play every Tuesday. No fluff, just blueprints."
                     </p>
                     <div className="flex items-center gap-4 text-sm text-ink-muted/80 font-medium">
                        <div className="flex -space-x-3">
                           {[1, 2, 3, 4].map(i => (
                              <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center overflow-hidden">
                                 <img src={`https://i.pravatar.cc/100?img=${10 + i}`} alt="Member" className="w-full h-full object-cover grayscale" />
                              </div>
                           ))}
                        </div>
                        <span className="text-xs uppercase tracking-wider">Join 2,000+ Operators</span>
                     </div>
                  </div>

                  <div className="bg-white/60 backdrop-blur p-8 border border-ink/10 rounded-sm shadow-sm relative">
                     <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-ink/20"></div>
                     <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-ink/20"></div>
                     <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-ink/20"></div>
                     <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-ink/20"></div>

                     <div className="flex flex-col gap-4 relative z-10">
                        <div>
                           <label className="block text-[10px] font-bold text-ink uppercase tracking-widest mb-2">Email Address</label>
                           <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                              placeholder="leonardo@florence.it"
                              className="w-full bg-white/80 border border-ink/20 px-4 py-3 text-ink placeholder:text-ink-muted/40 focus:outline-none focus:border-accent transition-all shadow-inner"
                              disabled={status === 'loading' || status === 'success'}
                           />
                        </div>
                        <Button
                           variant="primary"
                           className="w-full justify-between group"
                           onClick={handleSubscribe}
                           disabled={status === 'loading' || status === 'success'}
                        >
                           <span>{status === 'loading' ? 'Joining...' : status === 'success' ? 'Welcome Aboard' : 'Subscribe to Codex'}</span>
                           <ArrowRight className={`w-4 h-4 transition-transform ${status === 'loading' ? 'opacity-0' : 'group-hover:translate-x-1'}`} />
                        </Button>

                        {message && (
                           <p className={`text-[10px] text-center mt-1 font-medium ${status === 'error' ? 'text-red-600' : 'text-green-700'}`}>
                              {message}
                           </p>
                        )}

                        {!message && (
                           <p className="text-[10px] text-ink-muted/50 text-center mt-1">
                              Unsubscribe at any time. We respect your inbox.
                           </p>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </ScrollReveal>
      </Section>
   );
};

export default Newsletter;
