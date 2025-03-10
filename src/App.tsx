// src/App.tsx
import { Route, Routes } from 'react-router-dom';
import { useEffect, Suspense, lazy, Component } from 'react';
import Navbar from './components/Navbar';
import { useTheme } from './hooks/useTheme';
import { initializeMermaid } from './utils/mermaidCompat';

// Lazy load pages to improve initial load performance
const Home = lazy(() => import('./pages/Home'));
const DiagramEditor = lazy(() => import('./pages/DiagramEditor'));
const SavedDiagrams = lazy(() => import('./pages/SavedDiagrams'));

// Global Error Boundary
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-white dark:bg-dark-background">
          <div className="w-full max-w-md p-6 bg-white dark:bg-dark-surface rounded-lg shadow-xl border border-neutral-200 dark:border-dark-border">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-error-100 dark:bg-error-900/30 text-error-600 dark:text-error-400 rounded-full">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="mb-4 text-xl font-bold text-center text-neutral-900 dark:text-white">
              Something went wrong
            </h2>
            <div className="p-3 mb-4 overflow-auto text-sm bg-neutral-100 dark:bg-dark-background rounded-md text-neutral-700 dark:text-neutral-300 max-h-48">
              {this.state.error && this.state.error.toString()}
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                  window.location.href = '/';
                }}
                className="px-4 py-2 font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Return to home page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading component with different variants
const Loading = ({ type = 'page' }) => {
  if (type === 'component') {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col justify-center items-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mb-4"></div>
      <p className="text-neutral-600 dark:text-neutral-400 animate-pulse">Loading...</p>
    </div>
  );
};

// Not Found page
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] px-4 text-center">
      <svg className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h1 className="text-3xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <a href="/" className="btn btn-primary">
        Go back to home
      </a>
    </div>
  );
};

// Footer component
const Footer = () => {
  return (
    <footer className="bg-neutral-50 dark:bg-dark-surface py-6 border-t border-neutral-200 dark:border-dark-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <svg className="h-8 w-8 text-primary-600 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="text-lg font-bold text-neutral-900 dark:text-white">
              Mermaid Editor Pro
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <a href="https://mermaid.js.org/intro/getting-started.html" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 dark:hover:text-primary-400">
              Documentation
            </a>
            <a href="https://github.com/jk08y/mermaid-editor" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 dark:hover:text-primary-400">
              GitHub
            </a>
            <span>© {new Date().getFullYear()} Mermaid Editor Pro</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

function App() {
  const { theme } = useTheme();
  
  // Initialize Mermaid with current theme
  useEffect(() => {
    // Initialize Mermaid with current theme
    initializeMermaid(theme);

    // Add scroll restoration
    window.history.scrollRestoration = 'auto';
    
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
  }, [theme]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-white dark:bg-dark-background text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/editor" element={<DiagramEditor />} />
              <Route path="/editor/:id" element={<DiagramEditor />} />
              <Route path="/saved" element={<SavedDiagrams />} />
              {/* Fallback for unknown routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;