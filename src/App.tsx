// src/App.tsx
import { Route, Routes } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import { useTheme } from './hooks/useTheme';
import { initializeMermaid } from './utils/mermaidCompat';

// Lazy load pages to improve initial load performance
const Home = lazy(() => import('./pages/Home'));
const DiagramEditor = lazy(() => import('./pages/DiagramEditor'));
const SavedDiagrams = lazy(() => import('./pages/SavedDiagrams'));

// Loading component with different variants
const Loading = ({ type = 'page' }: { type?: 'page' | 'component' }) => {
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
            <a href="https://github.com/yourusername/mermaid-editor" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 dark:hover:text-primary-400">
              GitHub
            </a>
            <span>© {new Date().getFullYear()} Mermaid Editor Pro</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// 404 Page
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

function App() {
  const { theme } = useTheme();
  
  // Apply theme to document and initialize Mermaid
  useEffect(() => {
    // Update document theme class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Initialize Mermaid with current theme
    initializeMermaid(theme);

    // Add scroll restoration
    window.history.scrollRestoration = 'auto';
    
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
  }, [theme]);

  return (
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
  );
}

export default App;