import React, { useEffect, useState } from 'react';
import { Clock, Tag, Lightbulb } from 'lucide-react';
import { MobileButton } from './MobileButton';
import { MobileTopBar } from './MobileTopBar';
import type { Page } from '../types';

export interface MobileBriefingData {
  id: string;
  title: string;
  publishDate: string;
  author: string;
  category: string;
  readTime: string;
  issueNo: string;
  image: string;
  quickAnswerTitle: string;
  quickAnswer: string;
  sections: { id: string; title: string; content: React.ReactNode }[];
  faqs: { question: string; answer: string }[];
}

interface MobileBriefingDetailPageProps {
  data: MobileBriefingData;
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

export const MobileBriefingDetailPage: React.FC<MobileBriefingDetailPageProps> = ({ data, onNavigate }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.title = `${data.title} — DaVeenci`;
    window.scrollTo(0, 0);
    return () => {
      document.title = 'DaVeenci | AI & Automation Consultancy';
    };
  }, [data.title]);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const y = window.scrollY ?? h.scrollTop ?? document.body.scrollTop ?? 0;
      setProgress(total > 0 ? Math.min(100, (y / total) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col text-ink" data-mobile>
      <MobileTopBar onNavigate={onNavigate} backTo="briefings" progress={progress} />

      <main className="flex-1 pt-14">
        {/* Article title block */}
        <section className="px-6 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">{data.category}</span>
            <span className="text-ink-muted/40">·</span>
            <span className="font-mono text-[10px] tracking-[0.1em] text-ink-muted">#{data.issueNo}</span>
          </div>
          <h1 className="font-serif text-[2.25rem] leading-[1.1] text-ink mb-5 tracking-tight">
            {data.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-[12px] text-ink-muted font-serif italic">
            <span>{data.author}</span>
            <span className="text-ink-muted/30">·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {data.readTime}
            </span>
            <span className="text-ink-muted/30">·</span>
            <span className="flex items-center gap-1.5">
              <Tag className="w-3 h-3" />
              {data.publishDate}
            </span>
          </div>
        </section>

        {/* Hero image */}
        <div className="px-6 mb-8">
          <div className="aspect-[16/10] w-full overflow-hidden rounded-sm bg-ink/5 border border-ink/10">
            <img src={data.image} alt={data.title} className="w-full h-full object-cover filter sepia-[0.1] contrast-[1.02]" />
          </div>
        </div>

        {/* Quick Answer callout */}
        <section className="px-6 mb-8">
          <div className="bg-accent/5 border border-accent/20 rounded-sm p-5 relative overflow-hidden">
            <Lightbulb className="absolute top-3 right-3 w-6 h-6 text-accent/15" />
            <div className="flex items-baseline gap-2 mb-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-semibold">Quick Answer</span>
            </div>
            <h2 className="font-serif text-xl text-ink mb-3 leading-snug">{data.quickAnswerTitle}</h2>
            <div
              className="prose prose-sm text-[14px] text-ink-muted leading-relaxed [&_strong]:text-ink [&_strong]:font-medium"
              dangerouslySetInnerHTML={{ __html: data.quickAnswer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
            />
          </div>
        </section>

        {/* Sections */}
        {data.sections.map((section) => (
          <section key={section.id} id={section.id} className="px-6 py-6 max-w-prose mx-auto">
            <h3 className="font-serif text-[1.5rem] leading-[1.25] text-ink mb-4">{section.title}</h3>
            <div className="prose prose-sm font-sans text-[15px] text-ink/90 leading-[1.7] [&_p]:mb-4 [&_strong]:text-ink [&_strong]:font-semibold [&_em]:italic [&_em]:text-ink-muted [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-2">
              {section.content}
            </div>
          </section>
        ))}

        {/* FAQ */}
        {data.faqs.length > 0 && (
          <section className="px-6 py-8 max-w-prose mx-auto border-t border-ink/10">
            <h3 className="font-serif text-[1.5rem] text-ink mb-6">Frequently asked.</h3>
            <dl className="space-y-5">
              {data.faqs.map((faq, i) => (
                <div key={i} className="border-b border-ink/10 pb-5 last:border-b-0">
                  <dt className="font-serif text-lg text-ink mb-2 leading-snug">{faq.question}</dt>
                  <dd className="font-sans text-[14px] text-ink-muted leading-relaxed">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* End CTA */}
        <section className="px-6 py-10 bg-white/40 border-t border-ink/10">
          <h3 className="font-serif text-2xl text-ink mb-3 text-center leading-tight">
            Want a team that ships this?
          </h3>
          <p className="font-sans text-[14px] text-ink-muted leading-relaxed mb-6 text-center">
            Thirty minutes. No slide deck. Bring the workflow you want a team for.
          </p>
          <MobileButton onClick={() => onNavigate('calendar')}>Talk to us</MobileButton>
        </section>

        <div className="h-10" />
      </main>
    </div>
  );
};
