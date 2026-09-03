import React, { useEffect, useRef } from 'react';
import { MobileButton } from './MobileButton';
import { MobileFolioScene } from './MobileFolioScene';
import { MobileScenePlate } from './MobileScenePlate';
import { CaseSchematic } from '../CaseSchematics';
import { Stack } from '../motion/Stack';
import { track } from '../../lib/analytics';
import type { Page } from '../types';
import { featuredWork, workStatusClass } from '../../content/workCatalog';

interface MobileWorkPreviewProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

export const MobileWorkPreview: React.FC<MobileWorkPreviewProps> = ({ onNavigate }) => {
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
  <MobileFolioScene id="selected-work" eyebrow="Selected work" className="bg-white/30">
    <h2 className="font-serif text-[2.35rem] leading-[1.08] text-ink mb-4 tracking-tight">
      Built in the
      <br />
      <span className="italic text-ink-muted/70">real world.</span>
    </h2>
    <p className="font-serif text-[16px] text-ink-muted leading-relaxed mb-7">
      Some teams are operating today. Others are being proven in public. Every one makes its roles and gates explicit.
    </p>

    <Stack compact className="mb-7">
      {featuredWork.map((item, i) => (
        <a
          key={item.title}
          href={item.href}
          onClick={(event) => {
            track('select_content', { content_type: 'case_study', content_id: item.page, surface: 'work_preview' });
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            onNavigate(item.page);
          }}
          className="stack-card block w-full text-left"
        >
          <MobileScenePlate figLabel={item.label} className="p-4 !bg-paper !backdrop-blur-none shadow-lg shadow-ink/10">
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <span aria-hidden="true" className="font-serif italic text-[11px] text-ink-muted">{String(i + 1).padStart(2, '0')} / {String(featuredWork.length).padStart(2, '0')}</span>
              <span className={`font-mono text-[8px] uppercase tracking-[0.14em] text-right ${workStatusClass(item.statusTone)}`}>{item.status}</span>
            </div>
            <h3 className="font-serif text-[1.65rem] leading-none text-ink mb-2">{item.title}</h3>
            <p className="font-sans text-[13px] text-ink-muted leading-relaxed mb-4">{item.previewBlurb}</p>
            <div className="border border-ink/10 bg-white/70 rounded-sm p-3">
              <CaseSchematic id={item.page} className="aspect-[5/3] w-full" />
            </div>
            <span className="mt-4 inline-flex items-center gap-1 font-sans text-[13px] font-medium text-accent-strong">Read the case <span aria-hidden="true">→</span></span>
          </MobileScenePlate>
        </a>
      ))}
    </Stack>

    <MobileButton variant="secondary" onClick={() => onNavigate('work')}>
      See all work
    </MobileButton>
  </MobileFolioScene>
  );
};
