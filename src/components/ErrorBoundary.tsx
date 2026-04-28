import { Component, ReactNode, ErrorInfo } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
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
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, () =>
          this.setState({ hasError: false, error: null })
        );
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md text-center">
            <div className="text-destructive mb-4">
              <svg
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.462 0 2.803-1.1 3.07-2.686l1.546-5.38A2 2 0 0 0 19.577 8H4.423a2 2 0 0 0-1.933 1.518L4.423 15.1A2 2 0 0 0 6.37 17.056h13.856a2 2 0 0 1.933-1.518l-1.546-5.38A2 2 0 0 0 19.577 8z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {this.state.error.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() =>
                this.setState({ hasError: false, error: null })
              }
              className="px-4 py-2 bg-foreground text-background rounded-full text-sm font-medium"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
