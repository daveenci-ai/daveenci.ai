
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
    if (direction === 'up') return 'translate-y-12 scale-95';
    if (direction === 'left') return '-translate-x-12 scale-95';
    if (direction === 'right') return 'translate-x-12 scale-95';
    return 'translate-y-12 scale-95';
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${isVisible ? "opacity-100 translate-y-0 translate-x-0 scale-100" : `opacity-0 ${getTransform()}`
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
    <div className={`absolute inset-0 pointer-events-none overflow-hidden opacity-[0.12] ${className}`}>
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
        ctx.fillStyle = '#222222';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(34, 34, 34, ${(1 - distance / connectionDistance) * 0.5})`;
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
      backgroundImage: 'radial-gradient(#222 1px, transparent 1px)',
      backgroundSize: '24px 24px'
    }}
  />
);

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2.5L20.5 7.2V16.8L12 21.5L3.5 16.8V7.2L12 2.5Z" strokeWidth="1.5" />
    <path d="M12 12V2.5" strokeWidth="0.8" className="opacity-60" />
    <path d="M12 12L20.5 16.8" strokeWidth="0.8" className="opacity-60" />
    <path d="M12 12L3.5 16.8" strokeWidth="0.8" className="opacity-60" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="8" strokeWidth="0.5" strokeDasharray="3 3" className="opacity-40 animate-spin-slow origin-center" style={{ transformOrigin: '12px 12px' }} />
  </svg>
);

export const SchematicDecor: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`absolute right-4 top-4 opacity-30 ${className}`}>
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="30" cy="10" r="2" fill="#3f84c8" />
      <circle cx="10" cy="30" r="2" fill="#222" />
      <path d="M10 30 C 10 15, 15 10, 30 10" stroke="#222" strokeWidth="1" />
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
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ label, value, onChange, options, placeholder, required }) => {
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
        {label} {required && <span className="text-red-500">*</span>}
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
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 font-sans text-sm font-medium transition-all duration-300 ease-out transform active:scale-95 group relative overflow-hidden";

  const variants = {
    primary: "bg-accent hover:bg-accent-hover text-white shadow-sm hover:shadow-md hover:-translate-y-0.5",
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

export const SectionHeader: React.FC<{ eyebrow: string; title: string; subtitle?: string; className?: string }> = ({ eyebrow, title, subtitle, className }) => (
  <ScrollReveal className={`mb-12 md:mb-16 ${className}`}>
    <span className="block font-script text-2xl text-ink-muted/80 mb-2 transform -rotate-1 origin-bottom-left">
      {eyebrow}
    </span>
    <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-ink mb-6 leading-tight">
      {title}
    </h2>
    {subtitle && (
      <p className="font-sans text-lg text-ink-muted max-w-2xl leading-relaxed">
        {subtitle}
      </p>
    )}
  </ScrollReveal>
);

export const Card: React.FC<CardProps> = ({ title, children, label, className = '', image }) => (
  <div className={`relative bg-white border border-ink/10 shadow-lg p-0 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-accent/30 group flex flex-col ${className}`}>
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
  </div>
);

export const BriefingCard: React.FC<BriefingCardProps> = ({ title, description, image, issueNo, category, className, onClick }) => (
  <div onClick={onClick} className={`group relative flex flex-col h-full bg-white/40 backdrop-blur-md border border-ink/10 rounded-sm overflow-hidden transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(63,132,200,0.15)] hover:-translate-y-2 hover:border-accent/30 cursor-pointer ${className}`}>
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
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

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
  </div>
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
