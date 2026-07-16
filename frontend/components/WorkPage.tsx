import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Section, ScrollReveal, GridPattern, PageHero, Button, Surface } from './Shared';
import { useIsMobile } from './mobile/useIsMobile';
import { MobileWorkPage } from './mobile/MobileWorkPage';
import { track } from '../lib/analytics';
import type { Page } from './types';
import { workCatalog, workStatusClass } from '../content/workCatalog';

interface WorkPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const WorkPage: React.FC<WorkPageProps> = (props) => {
  const isMobile = useIsMobile();
  if (isMobile) return <MobileWorkPage {...props} />;
  return <WorkPageDesktop {...props} />;
};

const WorkPageDesktop: React.FC<WorkPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col w-full overflow-x-hidden min-h-screen">
      <Header onNavigate={onNavigate} currentPage="work" />

      <Section className="pt-36 pb-4 md:pt-44 md:pb-6">
        <GridPattern />
        <ScrollReveal immediate>
          <PageHero
            eyebrow="Our Work"
            title={<>Specialist AI teams.<br /><span className="italic text-ink-muted/80">Built in the real world.</span></>}
            description="Each example below shows its operating status plainly. Some are in production, one is an endorsed vertical practice, and others are demonstrations or research systems still earning trust."
            size="md"
            className="max-w-3xl"
          />
        </ScrollReveal>
      </Section>

      <Section className="pt-5 pb-12 md:pt-7 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {workCatalog.map((item, i) => (
            <ScrollReveal key={item.title} delay={100 + i * 150}>
              <a
                href={item.href}
                className="block h-full rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                onClick={(event) => {
                  track('select_content', { content_type: 'case_study', content_id: item.page, surface: 'work_page' });
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                  event.preventDefault();
                  onNavigate(item.page);
                }}
              >
                <Surface kind="document" className="h-full p-10 md:p-12 bg-white/60 border border-ink/10 hover:shadow-2xl hover:border-accent/30 transition-all duration-300 group flex flex-col">
                  <div className="flex items-start justify-between gap-5 mb-4">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{item.label}</span>
                    <span className={`font-mono text-[8px] uppercase tracking-[0.14em] text-right ${workStatusClass(item.statusTone)}`}>{item.status}</span>
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl text-ink mb-3 group-hover:text-accent transition-colors">{item.title}</h2>
                  <p className="font-serif italic text-lg text-ink-muted mb-5">{item.subtitle}</p>
                  <p className="font-sans text-ink-muted leading-relaxed mb-8 flex-grow">{item.blurb}</p>
                  <span className="font-sans text-sm font-medium text-accent group-hover:translate-x-1 transition-transform">Read the case →</span>
                </Surface>
              </a>
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
