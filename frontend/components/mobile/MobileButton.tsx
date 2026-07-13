import React from 'react';
import { track, type AnalyticsEventMap } from '../../lib/analytics';

type Variant = 'primary' | 'secondary' | 'dark';

interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
  analytics?: AnalyticsEventMap['cta_click'];
}

const BASE = 'py-3.5 font-medium tracking-[0.15em] uppercase text-sm rounded-sm transition-all';

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-accent text-white shadow-md disabled:bg-ink/10 disabled:text-ink-muted/50 disabled:shadow-none disabled:cursor-not-allowed',
  secondary: 'bg-white/60 border border-ink/20 text-ink',
  dark: 'bg-ink text-white',
};

/**
 * The single source of truth for mobile CTAs. Every primary/secondary/dark
 * button on the mobile tree renders through this. Appearance is consistent
 * (shape, shadow, disabled state); the focus-visible ring comes from the
 * global [data-mobile] rule in index.css.
 */
export const MobileButton: React.FC<MobileButtonProps> = ({
  variant = 'primary',
  fullWidth = true,
  className = '',
  children,
  analytics,
  onClick,
  ...props
}) => (
  <button
    {...props}
    onClick={(event) => {
      if (analytics) track('cta_click', analytics);
      onClick?.(event);
    }}
    className={`${BASE} ${fullWidth ? 'w-full' : 'px-6'} ${VARIANT_CLASSES[variant]} ${className}`}
  >
    {children}
  </button>
);
