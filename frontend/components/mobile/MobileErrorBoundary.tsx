import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Error boundary scoped to the mobile route tree. Any throw in a mobile
 * component renders a recovery screen with a "Reload" button rather than
 * crashing the whole app.
 */
export class MobileErrorBoundary extends Component<Props, State> {
  declare props: Readonly<Props>;
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Mobile tree error:', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div
        data-mobile
        className="min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center"
      >
        <div className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted mb-6">
          Something broke
        </div>
        <h1 className="font-serif text-[2rem] leading-[1.1] text-ink mb-4 tracking-tight">
          That page didn't load. <br />
          <span className="italic text-ink-muted/70">Not your fault.</span>
        </h1>
        <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-8 max-w-md">
          A reload usually fixes it. If not, let us know and we'll take a look.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="w-full max-w-xs py-3.5 bg-accent text-white font-medium tracking-[0.15em] uppercase text-sm rounded-sm shadow-md"
        >
          Reload
        </button>
      </div>
    );
  }
}
