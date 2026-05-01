import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  name?: string; // Component name for better error tracking
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`ErrorBoundary${this.props.name ? ` (${this.props.name})` : ''} caught:`, error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md text-center">
            <div className="glass rounded-2xl p-8">
              <h2 className="text-xl font-bold text-destructive mb-4">Something went wrong</h2>
              <p className="text-sm text-muted-foreground mb-6">
                {this.state.error.message || "An unexpected error occurred"}
              </p>
              {this.props.name && (
                <p className="text-xs text-muted-foreground mb-4">
                  Component: {this.props.name}
                </p>
              )}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={this.resetError}
                  className="bg-primary text-primary-foreground rounded-xl px-6 py-2.5 text-sm font-semibold"
                >
                  Try again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="glass rounded-xl px-6 py-2.5 text-sm font-semibold"
                >
                  Reload page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
