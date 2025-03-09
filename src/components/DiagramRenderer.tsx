// src/components/DiagramRenderer.tsx
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface DiagramRendererProps {
  code: string;
  id?: string;
}

const DiagramRenderer: React.FC<DiagramRendererProps> = ({ code, id = 'mermaid-diagram' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
      securityLevel: 'loose',
    });

    // Only try to render if there's code and the container exists
    if (code && containerRef.current) {
      try {
        // Clear previous content
        containerRef.current.innerHTML = '';
        
        // Create a new element for mermaid to render into
        const el = document.createElement('div');
        el.id = id;
        containerRef.current.appendChild(el);
        
        // Render the diagram
        mermaid.render(id, code).then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        });
      } catch (error) {
        console.error('Error rendering mermaid diagram:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = '<div class="p-4 text-red-500">Failed to render diagram</div>';
        }
      }
    }
  }, [code, id]);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-800">
      <div ref={containerRef} className="p-4 min-h-[200px] flex items-center justify-center"></div>
    </div>
  );
};

export default DiagramRenderer;