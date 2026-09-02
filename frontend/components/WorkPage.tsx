import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Section, ScrollReveal, GridPattern, PageHero, Button, Surface } from './Shared';
import { Reveal } from './motion/Parallax';
import { CaseSchematic } from './CaseSchematics';
import { useIsMobile } from './mobile/useIsMobile';
import { MobileWorkPage } from './mobile/MobileWorkPage';
import { track } from '../lib/analytics';
import type { Page } from './types';
import { PRACTICES, workCatalog, type Practice, workStatusClass } from '../content/workCatalog';

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
    <div className="flex flex-col w-full overflow-x-clip min-h-screen">
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

      {(['operations', 'creative'] as Practice[]).map((practice) => (
      <Section id={practice} key={practice} className="scroll-mt-24 pt-5 pb-12 md:pt-7 md:pb-16">
        {/* The practice header sticks while its cases scroll past — the same
            layered rhythm as the homepage offers ladder. Grouped by practice
            rather than one flat grid so a visitor sees what connects them. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-4 aside-sticky">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">{PRACTICES[practice].name}</span>
                <span aria-hidden="true" className="h-px flex-1 bg-ink-muted/20" />
              </div>
              <p className="font-serif italic text-sm text-ink-muted mb-4">Led by {PRACTICES[practice].lead}</p>
              <p className="font-sans text-lg text-ink-muted leading-relaxed">{PRACTICES[practice].summary}</p>
            </ScrollReveal>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 gap-8">
            {workCatalog.filter((item) => item.practice === practice).map((item) => (
              <Reveal key={item.title} enterEnd={0.78} lift={36}>
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
                  <Surface kind="document" className="h-full p-8 md:p-10 bg-white/60 border border-ink/10 hover:shadow-2xl hover:border-accent/30 transition-all duration-300 group">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                      <div className="md:col-span-7 flex flex-col h-full">
                        <div className="flex items-start justify-between gap-5 mb-4">
                          <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{item.label}</span>
                          <span className={`font-mono text-[8px] uppercase tracking-[0.14em] text-right ${workStatusClass(item.statusTone)}`}>{item.status}</span>
                        </div>
                        <h2 className="font-serif text-3xl md:text-4xl text-ink mb-2 group-hover:text-accent transition-colors">{item.title}</h2>
                        <p className="font-serif italic text-lg text-ink-muted mb-4">{item.subtitle}</p>
                        <p className="font-sans text-ink-muted leading-relaxed mb-6 flex-grow">{item.blurb}</p>
                        <span className="font-sans text-sm font-medium text-accent-strong inline-flex items-center gap-1 group-hover:gap-2 transition-all">Read the case <span aria-hidden="true">→</span></span>
                      </div>
                      <div className="md:col-span-5">
                        <div aria-hidden="true" className="bg-white/70 border border-ink/10 rounded-sm p-4" style={{ boxShadow: 'var(--shadow-widget-document)' }}>
                          <CaseSchematic id={item.page} className="aspect-[5/3] w-full" />
                        </div>
                      </div>
                    </div>
                  </Surface>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>
      ))}

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
