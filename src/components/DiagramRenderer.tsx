// src/components/DiagramRenderer.tsx
import { useEffect, useState, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';
import { initializeMermaid, renderMermaidDiagram } from '../utils/mermaidCompat';

interface DiagramRendererProps {
  code: string;
  id?: string;
}

const DiagramRenderer: React.FC<DiagramRendererProps> = ({ code, id = 'mermaid-diagram' }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useRef(`mermaid-${Math.random().toString(36).substring(2, 11)}`);

  // Initialize mermaid with theme
  useEffect(() => {
    initializeMermaid(theme);
  }, [theme]);

  // Render diagram whenever code changes
  useEffect(() => {
    const renderDiagram = async () => {
      if (!code.trim()) {
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await renderMermaidDiagram(code, uniqueId.current, containerRef.current);
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      renderDiagram();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [code]);

  return (
    <div className="relative rounded-md overflow-hidden border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-surface">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-dark-surface bg-opacity-80 dark:bg-opacity-80 z-10">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent"></div>
        </div>
      )}

      {error && (
        <div className="p-4 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md">
          <h3 className="font-semibold mb-2">Error rendering diagram:</h3>
          <pre className="whitespace-pre-wrap text-sm font-mono overflow-auto max-h-64">
            {error}
          </pre>
        </div>
      )}

      <div 
        ref={containerRef}
        className="p-4 min-h-[200px] flex items-center justify-center overflow-auto"
      />
    </div>
  );
};

export default DiagramRenderer;