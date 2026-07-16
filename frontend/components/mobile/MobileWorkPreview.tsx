import React, { useEffect, useRef } from 'react';
import { MobileButton } from './MobileButton';
import { MobileFolioScene } from './MobileFolioScene';
import { MobileScenePlate } from './MobileScenePlate';
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

    <div className="space-y-4 mb-7">
      {featuredWork.map((item) => (
        <a
          key={item.title}
          href={item.href}
          onClick={(event) => {
            track('select_content', { content_type: 'case_study', content_id: item.page, surface: 'work_preview' });
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            onNavigate(item.page);
          }}
          className="block w-full text-left"
        >
          <MobileScenePlate figLabel={item.label} className="p-4">
            <div className={`font-mono text-[8px] uppercase tracking-[0.14em] mb-3 ${workStatusClass(item.statusTone)}`}>
              {item.status}
            </div>
            <h3 className="font-serif text-[1.65rem] leading-none text-ink mb-2">{item.title}</h3>
            <p className="font-sans text-[13px] text-ink-muted leading-relaxed">{item.previewBlurb}</p>
          </MobileScenePlate>
        </a>
      ))}
    </div>

    <MobileButton variant="secondary" onClick={() => onNavigate('work')}>
      See all work
    </MobileButton>
  </MobileFolioScene>
  );
};
