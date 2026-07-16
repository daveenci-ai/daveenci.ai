import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Activity, AlertTriangle, Boxes, FileInput, PackageCheck, ShieldCheck, Workflow } from 'lucide-react';
import { ScrollReveal, Section, SectionHeader } from './Shared';

export interface CaseEvidenceItem {
  label: string;
  value: string;
  detail: string;
  icon?: LucideIcon;
}

interface CaseEvidenceProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  items: CaseEvidenceItem[];
  compact?: boolean;
}

const fallbackIcons: LucideIcon[] = [FileInput, Workflow, Boxes, ShieldCheck, PackageCheck, AlertTriangle, Activity];

const EvidenceGrid: React.FC<{ items: CaseEvidenceItem[]; compact: boolean }> = ({ items, compact }) => (
  <div className={`grid grid-cols-1 ${compact ? 'gap-4' : 'md:grid-cols-2 gap-5'}`}>
    {items.map((item, index) => {
      const Icon = item.icon || fallbackIcons[index % fallbackIcons.length];
      return (
        <ScrollReveal key={item.label} delay={compact ? 0 : index * 60} immediate={compact}>
          <div className="h-full bg-white/60 border border-ink/10 p-5 md:p-7 rounded-sm">
            <div className="flex items-start gap-4">
              <Icon aria-hidden="true" className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted/70 mb-2">{item.label}</div>
                <h3 className="font-serif text-xl md:text-2xl text-ink mb-2">{item.value}</h3>
                <p className="font-sans text-sm text-ink-muted leading-relaxed">{item.detail}</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      );
    })}
  </div>
);

export const CaseEvidence: React.FC<CaseEvidenceProps> = ({
  eyebrow = 'Evidence ledger',
  title,
  subtitle,
  items,
  compact = false,
}) => {
  if (compact) {
    return (
      <section className="px-6 py-12 bg-alt/20 border-y border-ink/10" aria-label={title}>
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">{eyebrow}</span>
        </div>
        <h2 className="font-serif text-[2.15rem] leading-[1.08] text-ink mb-4 tracking-tight">{title}</h2>
        <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-7">{subtitle}</p>
        <EvidenceGrid items={items} compact />
      </section>
    );
  }

  return (
    <Section className="py-20 md:py-28 bg-alt/20" pattern="grid">
      <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <EvidenceGrid items={items} compact={false} />
    </Section>
  );
};

export default CaseEvidence;
