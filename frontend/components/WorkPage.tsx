import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Section, ScrollReveal, GridPattern, PageHero, Button, Surface } from './Shared';
import { useIsMobile } from './mobile/useIsMobile';
import { MobileWorkPage } from './mobile/MobileWorkPage';
import { track } from '../lib/analytics';
import type { Page } from './types';

interface WorkPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const workItems = [
  {
    page: 'purecode' as const,
    label: 'Code',
    title: 'PureCode',
    subtitle: 'The code team.',
    blurb: 'A feature request walks in. A shipped pull request walks out. 13 specialist agents, 3 human gates, orchestrated end-to-end.',
  },
  {
    page: 'autopilot' as const,
    label: 'Real estate operations',
    title: 'AutoPilot',
    subtitle: 'The production operations team.',
    blurb: 'Order email in. Scheduled job, continuous QC, safe remediation, and verified delivery out — three coordinated services operating across the full production loop.',
  },
  {
    page: 'compoundiq' as const,
    label: 'Trading research & execution',
    title: 'CompoundIQ',
    subtitle: 'The governed trading team.',
    blurb: 'Hypothesis in. Versioned research, explicit action gates, paper execution, and structured feedback out — an in-progress system designed to earn autonomy safely.',
  },
  {
    page: 'pulsenote' as const,
    label: 'Content',
    title: 'PulseNote',
    subtitle: 'The content team.',
    blurb: 'Meeting transcripts in. Publish-ready newsletters, social posts, and visuals out. One workflow across every platform you publish to.',
  },
  {
    page: 'brandos' as const,
    label: 'Brand',
    title: 'BrandOS',
    subtitle: 'The brand team.',
    blurb: 'A name, positioning, or launch idea goes in. Weighted scoring across 10 dimensions, calibrated to your business stage. Specialist-grade naming diligence.',
  },
];

const WorkPage: React.FC<WorkPageProps> = (props) => {
  const isMobile = useIsMobile();
  if (isMobile) return <MobileWorkPage {...props} />;
  return <WorkPageDesktop {...props} />;
};

const WorkPageDesktop: React.FC<WorkPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    document.title = 'Our Work — DaVeenci';
    window.scrollTo(0, 0);
    return () => {
      document.title = 'DaVeenci | AI & Automation Consultancy';
    };
  }, []);

  return (
    <div className="flex flex-col w-full overflow-x-hidden min-h-screen">
      <Header onNavigate={onNavigate} currentPage="work" />

      <Section className="pt-44 pb-8 md:pt-52 md:pb-12">
        <GridPattern />
        <ScrollReveal>
          <PageHero
            eyebrow="Our Work"
            title={<>Specialist AI teams.<br /><span className="italic text-ink-muted/80">Built in the real world.</span></>}
            description="Each example below is a specialist team we've designed and built. Some are operating today; others are being proven in public. Every one coordinates narrow roles, human gates, and accountable finished work."
            size="md"
            className="max-w-3xl"
          />
        </ScrollReveal>
      </Section>

      <Section className="py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {workItems.map((item, i) => (
            <ScrollReveal key={item.title} delay={100 + i * 150}>
              <Surface
                kind="document"
                onClick={() => {
                  track('select_content', { content_type: 'case_study', content_id: item.page, surface: 'work_page' });
                  onNavigate(item.page);
                }}
                className="cursor-pointer h-full p-10 md:p-12 bg-white/60 border border-ink/10 hover:shadow-2xl hover:border-accent/30 transition-all duration-300 group flex flex-col"
              >
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-4">
                  {item.label}
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-ink mb-3 group-hover:text-accent transition-colors">
                  {item.title}
                </h2>
                <p className="font-serif italic text-lg text-ink-muted mb-5">{item.subtitle}</p>
                <p className="font-sans text-ink-muted leading-relaxed mb-8 flex-grow">{item.blurb}</p>
                <span className="font-sans text-sm font-medium text-accent group-hover:translate-x-1 transition-transform">
                  Read the case →
                </span>
              </Surface>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <Section className="py-16 md:py-24" pattern="circles">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6">
              Want a team for your domain?
            </h2>
            <p className="font-sans text-lg text-ink-muted leading-relaxed mb-8">
              Every team we build follows the same playbook. If you have a specialized workflow that produces finished work, we can design a team for it.
            </p>
            <div className="flex justify-center">
              <Button variant="primary" onClick={() => onNavigate('calendar')} className="px-8 py-4">
                Talk to us
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default WorkPage;
