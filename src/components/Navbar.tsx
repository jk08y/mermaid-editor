// src/components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  // Handle navbar background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`sticky top-0 z-40 transition-all duration-200 ${
      isScrolled ? 'bg-white/90 dark:bg-dark-background/90 backdrop-blur shadow-sm' : 'bg-white dark:bg-dark-background'
    } border-b border-neutral-200 dark:border-dark-border`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <svg className="h-8 w-8 text-primary-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                <span className="ml-2 text-xl font-bold text-neutral-900 dark:text-white">
                  Mermaid Editor
                  <span className="text-xs font-medium ml-1 bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 py-0.5 px-1.5 rounded-full">Pro</span>
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
              <Link
                to="/"
                className={`${
                  isActive('/') && !isActive('/editor') && !isActive('/saved')
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-300 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-500'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-colors`}
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
              <Link
                to="/editor"
                className={`${
                  isActive('/editor')
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-300 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-500'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-colors`}
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editor
              </Link>
              <Link
                to="/saved"
                className={`${
                  isActive('/saved')
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-300 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-500'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-colors`}
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                Saved Diagrams
              </Link>
              <a
                href="https://mermaid.js.org/intro/getting-started.html"
                target="_blank"
                rel="noopener noreferrer"
                className="border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-300 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Documentation
              </a>
            </div>
          </div>
          
          {/* Right side - Theme toggle and GitHub */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* New Diagram Button (Desktop) */}
            <Link
              to="/editor"
              className="hidden sm:inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Diagram
            </Link>
            
            <a
              href="https://github.com/yourusername/mermaid-editor"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hidden sm:block"
              aria-label="GitHub repository"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            
            {/* Mobile menu button */}
            <button
              type="button"
              className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1 border-t border-neutral-200 dark:border-dark-border">
          <Link
            to="/"
            className={`${
              isActive('/') && !isActive('/editor') && !isActive('/saved')
                ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300' 
                : 'border-transparent text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-dark-hover'
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/editor"
            className={`${
              isActive('/editor')
                ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300' 
                : 'border-transparent text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-dark-hover'
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMenuOpen(false)}
          >
            Editor
          </Link>
          <Link
            to="/saved"
            className={`${
              isActive('/saved')
                ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300' 
                : 'border-transparent text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-dark-hover'
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMenuOpen(false)}
          >
            Saved Diagrams
          </Link>
          <a
            href="https://mermaid.js.org/intro/getting-started.html"
            target="_blank"
            rel="noopener noreferrer"
            className="border-transparent text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-dark-hover block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Documentation
          </a>
        </div>
        <div className="pt-4 pb-3 border-t border-neutral-200 dark:border-dark-border">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center">
              <Link
                to="/editor"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Diagram
              </Link>
            </div>
            <div className="flex items-center">
              <a
                href="https://github.com/yourusername/mermaid-editor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white mr-4"
                aria-label="GitHub repository"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;