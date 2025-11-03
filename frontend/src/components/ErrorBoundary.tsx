import React from 'react';

type Props = { children: React.ReactNode };

type State = { err: unknown | null; info: React.ErrorInfo | null };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { err: null, info: null };

  static getDerivedStateFromError(err: unknown) {
    return { err };
  }

  componentDidCatch(err: unknown, info: React.ErrorInfo) {
    this.setState({ info });
    // Log to console for quick triage
    console.error('[Viz Error]', err, info);
  }

  render() {
    if (this.state.err) {
      const message = this.state.err instanceof Error ? this.state.err.message : String(this.state.err);
      const stack = this.state.err instanceof Error ? this.state.err.stack : '';
      return (
        <div className="p-4 text-red-400 text-sm whitespace-pre-wrap" style={{ whiteSpace: 'pre-wrap', color: '#f87171', fontSize: 12 }}>
          <b>Visualization failed.</b>{'\n'}
          {message}{'\n\n'}
          {stack || ''}
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
