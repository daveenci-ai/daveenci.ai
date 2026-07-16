import React, { useEffect, useRef } from 'react';
import { Section, ScrollReveal, Surface, Button, FolioHeader } from './Shared';
import { track } from '../lib/analytics';
import type { Page } from './types';
import { featuredWork, workStatusClass } from '../content/workCatalog';

interface WorkPreviewProps {
  onNavigate: (page: Page) => void;
}

const WorkPreview: React.FC<WorkPreviewProps> = ({ onNavigate }) => {
  const impressionTracked = useRef(false);

  useEffect(() => {
    const element = document.getElementById('selected-work');
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || impressionTracked.current) return;
      impressionTracked.current = true;
      track('work_preview_viewed', { surface: 'work_preview' });
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
  <Section id="selected-work" pattern="nodes">
    <ScrollReveal className="mb-12 md:mb-16">
      <FolioHeader
        eyebrow="Selected work"
        title="What specialist teams look like in practice."
        subtitle="Some are operating today. Others are being proven in public. Every one separates roles, makes its gates explicit, and stays accountable to the finished work."
      />
    </ScrollReveal>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
      {featuredWork.map((example, i) => (
        <ScrollReveal key={example.title} delay={100 + i * 150}>
          <a
            href={example.href}
            className="block h-full rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            onClick={(event) => {
              track('select_content', { content_type: 'case_study', content_id: example.page, surface: 'work_preview' });
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault();
              onNavigate(example.page);
            }}
          >
            <Surface kind="document" className="h-full p-8 md:p-10 bg-white/60 border border-ink/10 hover:shadow-2xl hover:border-accent/30 transition-all duration-300 group flex flex-col">
              <div className="flex items-start justify-between gap-4 mb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{example.label}</span>
                <span className={`font-mono text-[8px] uppercase tracking-[0.14em] text-right ${workStatusClass(example.statusTone)}`}>{example.status}</span>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-ink mb-4 group-hover:text-accent transition-colors">{example.title}</h3>
              <p className="font-sans text-ink-muted leading-relaxed mb-6 flex-grow">{example.previewBlurb}</p>
              <span className="font-sans text-sm font-medium text-accent group-hover:translate-x-1 transition-transform">Read the case →</span>
            </Surface>
          </a>
        </ScrollReveal>
      ))}
    </div>

    <div className="flex justify-center">
      <Button variant="secondary" onClick={() => onNavigate('work')} className="px-8 py-4">
        See all work
      </Button>
    </div>
  </Section>
  );
};

export default WorkPreview;
