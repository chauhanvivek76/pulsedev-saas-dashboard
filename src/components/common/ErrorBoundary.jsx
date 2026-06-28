import { Component } from 'react';
import { logger, LOG_CATEGORIES } from '../../middleware/logger';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log exception to the centralized logging middleware
    logger.error(LOG_CATEGORIES.ERROR, 'ErrorBoundary caught uncaught render error', {
      errorMessage: error.message,
      componentStack: errorInfo.componentStack
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Attempt redirect to dashboard or home
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 text-center animate-fade-in">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 mb-6">
              <AlertOctagon size={32} />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Something went wrong
            </h1>
            
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
              An unexpected rendering exception was caught. The details have been sent to our centralized log center for audit.
            </p>

            {this.state.error && (
              <div className="bg-slate-100 dark:bg-slate-950 rounded-lg p-3 text-left font-mono text-xs text-red-600 dark:text-red-400 mb-6 max-h-40 overflow-y-auto border border-slate-200 dark:border-slate-800 select-all">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-colors cursor-pointer shadow-sm shadow-indigo-600/10"
              >
                <RefreshCw size={16} />
                Reset Application
              </button>
              
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 rounded-lg font-medium text-sm transition-colors cursor-pointer"
              >
                <Home size={16} />
                Back to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
