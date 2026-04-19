
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { CardProps, SectionProps, BriefingCardProps } from './types';

// --- Scroll Animation Hook & Component ---

export const ScrollReveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number; direction?: 'up' | 'left' | 'right' }> = ({ children, className = "", delay = 0, direction = 'up' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (direction === 'up') return 'translate-y-6';
    if (direction === 'left') return '-translate-x-6';
    if (direction === 'right') return 'translate-x-6';
    return 'translate-y-6';
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1400ms] ease-out transform ${isVisible ? "opacity-100 translate-y-0 translate-x-0" : `opacity-0 ${getTransform()}`
        } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- Visual Components ---

export const VitruvianBackground: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={`absolute inset-x-0 -top-64 -bottom-64 pointer-events-none overflow-visible ${className}`}
      style={{
        maskImage:
          'linear-gradient(to top, transparent 13.5rem, black 19.5rem, black calc(100% - 9rem), transparent calc(100% - 8rem))',
        WebkitMaskImage:
          'linear-gradient(to top, transparent 13.5rem, black 19.5rem, black calc(100% - 9rem), transparent calc(100% - 8rem))',
      }}
    >
      <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]" viewBox="0 0 800 800">
        <g className="animate-[spin_40s_linear_infinite]" style={{ transformOrigin: '400px 400px' }}>
          <circle cx="400" cy="400" r="380" fill="none" stroke="currentColor" strokeWidth="1" />
          <rect x="120" y="120" width="560" height="560" fill="none" stroke="currentColor" strokeWidth="1" />
        </g>
        <g className="animate-[spin_50s_linear_infinite_reverse]" style={{ transformOrigin: '400px 400px' }}>
          <circle cx="400" cy="400" r="300" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="12 12" />
        </g>
        <line x1="400" y1="20" x2="400" y2="780" stroke="currentColor" strokeWidth="0.5" />
        <line x1="20" y1="400" x2="780" y2="400" stroke="currentColor" strokeWidth="0.5" />
        <line x1="120" y1="120" x2="680" y2="680" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
        <line x1="680" y1="120" x2="120" y2="680" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
      </svg>
    </div>
  );
};

export const NodeNetworkBackground: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = canvas.parentElement;

    let animationFrameId: number;
    let particles: { x: number; y: number; vx: number; vy: number }[] = [];
    const connectionDistance = 400;

    let width = 0;
    let height = 0;

    // Read ink color once from CSS custom property; use throughout the animation.
    const inkColor = getComputedStyle(document.documentElement).getPropertyValue('--color-ink').trim();

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((width * height) / 40000);

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
        });
      }
    };

    const resize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      initParticles();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${inkColor})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgb(${inkColor} / ${(1 - distance / connectionDistance) * 0.5})`;
            ctx.lineWidth = 1.2;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => resize());
    if (container) resizeObserver.observe(container);

    resize();
    animate();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden opacity-[0.15] ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export const GridPattern: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`absolute inset-0 pointer-events-none opacity-[0.05] ${className}`}
    style={{
      backgroundImage: 'radial-gradient(rgb(var(--color-ink)) 1px, transparent 1px)',
      backgroundSize: '24px 24px'
    }}
  />
);

// DV monogram with "AI" superscript. Rendered via CSS mask-image so the mark
// inherits currentColor — `text-ink` on light bg, `text-base` on dark bg,
// `text-accent` for the hover state in the Header all Just Work.
export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <span
    role="img"
    aria-label="DaVeenci"
    className={`inline-block ${className ?? ''}`}
    style={{
      backgroundColor: 'currentColor',
      WebkitMaskImage: 'url(/daveenci-logo.png)',
      maskImage: 'url(/daveenci-logo.png)',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
    }}
  />
);

export const SchematicDecor: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`absolute right-4 top-4 opacity-30 ${className}`}>
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="30" cy="10" r="2" fill="rgb(var(--color-accent))" />
      <circle cx="10" cy="30" r="2" fill="rgb(var(--color-ink))" />
      <path d="M10 30 C 10 15, 15 10, 30 10" stroke="rgb(var(--color-ink))" strokeWidth="1" />
    </svg>
  </div>
);

// --- UI Components ---

interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ label, value, onChange, options, placeholder, required, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">
        {icon} {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-base/30 border ${isOpen ? 'border-accent' : 'border-ink/20'} p-3 text-ink cursor-pointer rounded-sm flex justify-between items-center transition-colors hover:border-accent/50`}
      >
        <span className={!value ? "text-ink-muted" : ""}>{value || placeholder || "Select an option"}</span>
        <div className={`w-4 h-4 text-ink-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border border-ink/10 shadow-xl z-50 mt-1 rounded-sm max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`p-3 text-sm cursor-pointer transition-colors ${value === option
                ? 'bg-accent/10 text-accent font-medium'
                : 'text-ink hover:bg-accent hover:text-white'
                }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const Button: React.FC<{
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ variant = 'primary', children, className = '', onClick }) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 font-sans text-sm font-medium transition-all duration-500 ease-out group relative overflow-hidden";

  const variants = {
    primary: "bg-accent hover:bg-accent-hover text-white shadow-sm hover:shadow-md",
    secondary: "bg-transparent border border-ink/20 text-ink hover:border-ink/50 hover:bg-ink/5",
    ghost: "bg-transparent text-accent hover:text-accent-hover p-0",
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      <span className="relative z-10 flex items-center">{children}
        {variant === 'primary' && <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />}
      </span>
    </button>
  );
};

// Thin ink-muted hairline rule — reusable decorative divider. Editorial pattern.
export const SectionDivider: React.FC<{ className?: string; width?: string }> = ({ className = '', width = 'w-16' }) => (
  <div aria-hidden="true" className={`${width} h-px bg-ink-muted/40 ${className}`} />
);

export const SectionHeader: React.FC<{ eyebrow: string; title: string; subtitle?: string; className?: string }> = ({ eyebrow, title, subtitle, className }) => (
  <ScrollReveal className={`mb-12 md:mb-16 ${className}`}>
    <SectionDivider className="mb-6" width="w-full max-w-[60%]" />
    <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
    <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ink mb-6 leading-[1.05] tracking-tight">
      {title}
    </h2>
    {subtitle && (
      <p className="font-serif text-lg md:text-xl text-ink-muted max-w-2xl leading-relaxed">
        {subtitle}
      </p>
    )}
  </ScrollReveal>
);

export const Card: React.FC<CardProps> = ({ title, children, label, className = '', image }) => (
  <Surface
    kind="document"
    className={`relative bg-white border border-ink/10 p-0 overflow-hidden transition-all duration-700 hover:shadow-2xl hover:border-accent/30 group flex flex-col ${className}`}
  >
    <SchematicDecor className="opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
    <div className="absolute top-0 left-0 w-0 h-0 border-t-[12px] border-l-[12px] border-transparent group-hover:border-accent transition-all duration-300 z-20"></div>

    {image && (
      <div className="w-full aspect-square overflow-hidden relative border-b border-ink/5 flex-shrink-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
    )}

    <div className="p-6 md:p-8 flex-grow flex flex-col">
      {label && (
        <span className="block text-xs font-bold text-accent uppercase tracking-wider mb-3">
          {label}
        </span>
      )}
      <h3 className="font-serif text-xl md:text-2xl text-ink mb-4">{title}</h3>
      <div className="font-sans text-ink-muted leading-relaxed space-y-2 flex-grow">
        {children}
      </div>
    </div>
  </Surface>
);

export const BriefingCard: React.FC<BriefingCardProps> = ({ title, description, image, issueNo, category, className, onClick }) => (
  <Surface
    kind="document"
    onClick={onClick}
    className={`group relative flex flex-col h-full bg-white/40 backdrop-blur-md border border-ink/10 overflow-hidden transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(63,132,200,0.15)] hover:border-accent/30 cursor-pointer ${className}`}
  >
    <div className="absolute top-0 inset-x-0 h-1 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-30"></div>

    <div className="relative h-56 overflow-hidden">
      <div className="absolute inset-0 bg-ink/20 mix-blend-multiply z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out filter grayscale-[0.2] contrast-[1.05] group-hover:grayscale-0 group-hover:contrast-100"
      />

      <div className="absolute top-4 left-4 z-20">
        <span className="bg-white/95 backdrop-blur shadow-sm text-[10px] font-bold text-ink tracking-widest uppercase px-3 py-1.5 rounded-sm border border-ink/5 group-hover:text-accent group-hover:border-accent/20 transition-colors">
          {category}
        </span>
      </div>

      <div className="absolute bottom-0 right-0 bg-white/90 backdrop-blur-md px-4 py-2 border-tl rounded-tl-sm border-ink/10 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <span className="font-mono text-[10px] font-bold text-ink-muted uppercase tracking-wider">No. {issueNo}</span>
      </div>
    </div>

    <div className="p-8 flex flex-col flex-grow relative">
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(rgb(var(--color-ink))_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

      <h3 className="relative font-serif text-2xl text-ink mb-3 group-hover:text-accent transition-colors duration-300 leading-tight">
        {title}
      </h3>

      <div className="w-12 h-0.5 bg-ink/10 mb-4 group-hover:bg-accent/30 transition-colors duration-500"></div>

      <p className="relative font-sans text-sm text-ink-muted leading-relaxed mb-8 flex-grow">
        {description}
      </p>

      <div className="relative mt-auto flex items-center justify-between pt-6 border-t border-ink/5 group-hover:border-ink/10 transition-colors">
        <span className="text-[10px] font-mono text-ink-muted/60 uppercase tracking-wider">Read Time: 4m</span>
        <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink group-hover:text-accent transition-colors">
          <span>Read Briefing</span>
          <ArrowUpRight className="w-3 h-3 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </div>
  </Surface>
);

export const Section: React.FC<SectionProps> = ({ id, className = '', children, pattern = 'none', overflow = false }) => (
  <section id={id} className={`relative py-20 md:py-28 px-6 ${overflow ? 'overflow-visible' : 'overflow-hidden'} ${className}`}>
    {pattern === 'grid' && <GridPattern />}
    {pattern === 'circles' && <VitruvianBackground />}
    {pattern === 'nodes' && <NodeNetworkBackground />}
    <div className="relative z-10 max-w-7xl mx-auto">
      {children}
    </div>
  </section>
);

// --- Primitives ---

export const Surface: React.FC<{
  kind: 'document' | 'product';
  raised?: boolean;
  as?: 'div' | 'section' | 'article';
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}> = ({ kind, raised = false, as: Tag = 'div', className = '', children, style, onClick }) => {
  const radius = kind === 'document'
    ? 'var(--radius-widget-document)'
    : 'var(--radius-widget-product)';
  const boxShadow = raised
    ? 'var(--shadow-widget-raised)'
    : kind === 'product'
      ? 'var(--shadow-widget-product)'
      : 'var(--shadow-widget-document)';
  return (
    <Tag
      onClick={onClick}
      className={className}
      style={{ borderRadius: radius, boxShadow, ...style }}
    >
      {children}
    </Tag>
  );
};

export const Eyebrow: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <span
    className={`block font-serif italic text-base tracking-[0.15em] uppercase text-ink-muted ${className}`}
  >
    {children}
  </span>
);

export const PageHero: React.FC<{
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'md' | 'lg';
  centered?: boolean;
  className?: string;
}> = ({ eyebrow, title, description, actions, size = 'lg', centered = false, className = '' }) => {
  const titleSize = size === 'lg'
    ? 'text-5xl md:text-6xl lg:text-7xl'
    : 'text-4xl md:text-5xl lg:text-6xl';
  const descriptionSize = size === 'lg'
    ? 'text-xl md:text-2xl'
    : 'text-lg md:text-xl';
  const alignmentClasses = centered ? 'text-center' : '';
  const descriptionCentering = centered ? 'mx-auto' : '';
  const actionsCentering = centered ? 'justify-center' : '';
  return (
    <div className={`${alignmentClasses} ${className}`}>
      {typeof eyebrow === 'string'
        ? <Eyebrow>{eyebrow}</Eyebrow>
        : eyebrow}
      <h1 className={`font-serif font-bold ${titleSize} text-ink leading-[1.02] tracking-tight mb-8 mt-4`}>
        {title}
      </h1>
      <p className={`font-serif ${descriptionSize} text-ink-muted max-w-2xl leading-relaxed mb-10 ${descriptionCentering}`}>
        {description}
      </p>
      {actions && <div className={`flex flex-col sm:flex-row gap-4 ${actionsCentering}`}>{actions}</div>}
    </div>
  );
};

type FormFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  required?: boolean;
  placeholder?: string;
  error?: string;
  rows?: number;
  icon?: React.ReactNode;
  optionalLabel?: string;
  className?: string;
};

export const FormField: React.FC<FormFieldProps> = ({
  label, name, value, onChange, type = 'text', required, placeholder, error, rows = 4, icon, optionalLabel, className = '',
}) => {
  const inputClasses = `w-full bg-base/30 border ${error ? 'border-red-500' : 'border-ink/20'} p-3 text-ink rounded-sm transition-colors focus:outline-none focus:border-accent placeholder:text-ink-muted/50`;

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-xs font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">
        {icon} {label} {required && <span className="text-red-500">*</span>}
        {optionalLabel && <span className="text-ink-muted/60 lowercase font-normal">{optionalLabel}</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          rows={rows}
          className={inputClasses}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export const ErrorAlert: React.FC<{
  message: string;
  onRetry?: () => void;
  className?: string;
}> = ({ message, onRetry, className = '' }) => (
  <div
    role="alert"
    className={`text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-3 py-2 flex items-start gap-2 ${className}`}
  >
    <span className="flex-1">{message}</span>
    {onRetry && (
      <button
        onClick={onRetry}
        type="button"
        className="text-red-700 underline font-medium hover:text-red-900 transition-colors shrink-0"
      >
        Retry
      </button>
    )}
  </div>
);

export const Tag: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'accent';
  className?: string;
}> = ({ children, variant = 'default', className = '' }) => {
  const variantClass = variant === 'accent'
    ? 'bg-accent/10 text-accent border-accent/20'
    : 'bg-white/90 text-ink border-ink/10';
  return (
    <span
      className={`inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm border ${variantClass} ${className}`}
    >
      {children}
    </span>
  );
};

export const Quote: React.FC<{
  children: React.ReactNode;
  attribution?: React.ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
}> = ({ children, attribution, tone = 'light', className = '' }) => {
  const isDark = tone === 'dark';
  const textColor = isDark ? 'text-base' : 'text-ink';
  const mutedColor = isDark ? 'text-base/60' : 'text-ink-muted';
  const ruleColor = isDark ? 'bg-base/30' : 'bg-accent';
  return (
    <figure className={`relative ${className}`}>
      <span
        aria-hidden="true"
        className={`absolute -top-6 -left-2 md:-top-10 md:-left-6 font-serif text-7xl md:text-9xl leading-none select-none ${
          isDark ? 'text-base/10' : 'text-accent/15'
        }`}
      >
        &ldquo;
      </span>
      <blockquote
        className={`relative font-serif italic text-2xl md:text-3xl lg:text-4xl leading-[1.3] ${textColor}`}
      >
        {children}
      </blockquote>
      {attribution && (
        <figcaption className={`mt-6 flex items-center gap-3 ${mutedColor}`}>
          <span className={`inline-block w-10 h-px ${ruleColor}`} aria-hidden="true" />
          <span className="font-mono text-xs uppercase tracking-[0.2em]">{attribution}</span>
        </figcaption>
      )}
    </figure>
  );
};

export const Callout: React.FC<{
  variant?: 'default' | 'muted' | 'alt' | 'warning';
  size?: 'sm' | 'md';
  className?: string;
  children: React.ReactNode;
}> = ({ variant = 'default', size = 'md', className = '', children }) => {
  const variantClass = {
    default: 'bg-white/40 border-ink/10',
    muted: 'bg-white/50 border-ink/5',
    alt: 'bg-alt/10 border-ink/5',
    warning: 'bg-orange-50/50 border-orange-200/50',
  }[variant];
  const sizeClass = size === 'sm' ? 'p-4' : 'p-6';
  return (
    <div
      className={`border ${variantClass} ${sizeClass} ${className}`}
      style={{ borderRadius: 'var(--radius-widget-document)' }}
    >
      {children}
    </div>
  );
};
