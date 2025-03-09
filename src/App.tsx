// src/App.tsx
import { Route, Routes } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import { useTheme } from './hooks/useTheme';

// Lazy load pages to improve initial load performance
const Home = lazy(() => import('./pages/Home'));
const DiagramEditor = lazy(() => import('./pages/DiagramEditor'));
const SavedDiagrams = lazy(() => import('./pages/SavedDiagrams'));

// Loading component
const Loading = () => (
  <div className="flex justify-center items-center h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
  </div>
);

function App() {
  const { theme } = useTheme();
  
  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editor" element={<DiagramEditor />} />
            <Route path="/editor/:id" element={<DiagramEditor />} />
            <Route path="/saved" element={<SavedDiagrams />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="bg-gray-100 dark:bg-dark-surface py-4 border-t border-gray-200 dark:border-dark-border">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Mermaid Editor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;