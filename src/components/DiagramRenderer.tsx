// src/components/DiagramRenderer.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '../hooks/useTheme';

interface DiagramRendererProps {
  code: string;
  id?: string;
  className?: string;
}

const DiagramRenderer: React.FC<DiagramRendererProps> = ({ 
  code, 
  id = 'mermaid-diagram',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize mermaid when theme changes
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter var, sans-serif',
      themeVariables: theme === 'dark' ? {
        primaryColor: '#0276c7',
        primaryTextColor: '#f0f7ff',
        primaryBorderColor: '#0276c7',
        secondaryColor: '#2a2a2a',
        tertiaryColor: '#1e1e1e',
        lineColor: '#a3a3a3',
        textColor: '#d4d4d4',
        mainBkg: '#1e1e1e',
        nodeBorder: '#525252',
        clusterBkg: '#252525',
        clusterBorder: '#333333',
        titleColor: '#d4d4d4',
      } : undefined,
    });
    
    // Re-render diagram when theme changes
    renderDiagram();
  }, [theme]);

  // Render diagram whenever code or theme changes
  useEffect(() => {
    renderDiagram();
  }, [code, id, theme]);

  // Function to render the diagram
  const renderDiagram = useCallback(() => {
    setError(null);
    
    // Only try to render if there's code and the container exists
    if (!code || !containerRef.current) return;
    
    try {
      const el = document.createElement('div');
      el.id = id;
      
      // Clear previous content
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(el);
      }
      
      // Render the diagram
      mermaid.render(id, code).then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          
          // Add zoom transformation to the SVG
          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.style.transformOrigin = 'center';
            svgElement.style.transform = `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`;
            svgElement.style.transition = 'transform 0.2s ease';
          }
        }
      }).catch((err) => {
        setError(`Error rendering diagram: ${err.message}`);
      });
    } catch (error: any) {
      setError(`Failed to render diagram: ${error.message}`);
    }
  }, [code, id, zoom, position]);

  // Apply zoom and position when they change
  useEffect(() => {
    const svgElement = containerRef.current?.querySelector('svg');
    if (svgElement) {
      svgElement.style.transformOrigin = 'center';
      svgElement.style.transform = `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`;
    }
  }, [zoom, position]);

  // Pan functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click only
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Zoom controls
  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  }, []);

  const resetView = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Handle wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(prev => Math.max(0.5, Math.min(prev + delta, 3)));
    }
  }, []);

  // Export diagram
  const exportDiagram = useCallback(async (format: 'svg' | 'png') => {
    if (!containerRef.current) return;
    
    try {
      const svgElement = containerRef.current.querySelector('svg');
      if (!svgElement) return;
      
      // Create a clone of the SVG for export to avoid modifying the displayed one
      const clone = svgElement.cloneNode(true) as SVGElement;
      
      // Reset transform for export
      clone.style.transform = '';
      
      // Set a white background for better visibility
      clone.style.background = theme === 'dark' ? '#1e1e1e' : 'white';
      
      // For PNG export, we need to create a canvas
      if (format === 'png') {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          console.error('Could not get canvas context');
          return;
        }
        
        // Set canvas dimensions
        const svgWidth = svgElement.viewBox.baseVal.width || svgElement.getBoundingClientRect().width;
        const svgHeight = svgElement.viewBox.baseVal.height || svgElement.getBoundingClientRect().height;
        
        canvas.width = svgWidth * 2; // Higher resolution
        canvas.height = svgHeight * 2;
        
        // Draw background
        ctx.fillStyle = theme === 'dark' ? '#1e1e1e' : 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Convert SVG to image
        const img = new Image();
        const serializer = new XMLSerializer();
        const svgBlob = new Blob([serializer.serializeToString(clone)], {type: 'image/svg+xml'});
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);
          
          // Convert canvas to PNG and download
          canvas.toBlob((blob) => {
            if (blob) {
              const downloadLink = document.createElement('a');
              downloadLink.href = URL.createObjectURL(blob);
              downloadLink.download = `${id}.png`;
              downloadLink.click();
              URL.revokeObjectURL(downloadLink.href);
            }
          }, 'image/png');
        };
        
        img.src = url;
      } else {
        // SVG export is simpler
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(clone);
        const svgBlob = new Blob([svgString], {type: 'image/svg+xml'});
        
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(svgBlob);
        downloadLink.download = `${id}.svg`;
        downloadLink.click();
        URL.revokeObjectURL(downloadLink.href);
      }
    } catch (error: any) {
      console.error('Error exporting diagram:', error);
    }
  }, [containerRef, id, theme]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  return (
    <div 
      className={`relative overflow-hidden ${className} ${isFullscreen ? 'fixed inset-0 z-50 p-4 bg-white dark:bg-dark-background' : 'rounded-lg border border-neutral-200 dark:border-dark-border bg-white dark:bg-dark-surface'}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Header with window controls */}
      <div className="bg-neutral-100 dark:bg-dark-background border-b border-neutral-200 dark:border-dark-border px-3 py-1.5 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 ml-2">
            Diagram Preview
          </span>
        </div>
      </div>
      
      {/* Diagram container */}
      <div 
        ref={diagramRef}
        className={`w-full h-full overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
      >
        <div 
          ref={containerRef} 
          className="flex items-center justify-center min-h-[300px] p-4"
        ></div>
      </div>

      {/* Error display */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg p-4">
          <div className="text-error-700 dark:text-error-300 text-center max-w-md">
            <svg className="w-10 h-10 mx-auto mb-3 text-error-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Controls overlay */}
      {(showControls || isFullscreen) && !error && (
        <div className="absolute bottom-3 right-3 flex flex-col space-y-2">
          <div className="glass-effect rounded-lg p-1 shadow-elevation-2 flex flex-col space-y-1">
            <button 
              onClick={zoomIn} 
              className="btn-icon text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50"
              aria-label="Zoom in"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v4m0 0v4m0-4h4m-4 0H6" />
              </svg>
            </button>
            <div className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400">
              {Math.round(zoom * 100)}%
            </div>
            <button 
              onClick={zoomOut} 
              className="btn-icon text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50"
              aria-label="Zoom out"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 11h4" />
              </svg>
            </button>
          </div>
          
          <div className="glass-effect rounded-lg p-1 shadow-elevation-2 flex flex-col space-y-1">
            <button 
              onClick={resetView} 
              className="btn-icon text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50"
              aria-label="Reset view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button 
              onClick={() => exportDiagram('svg')} 
              className="btn-icon text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50"
              aria-label="Export as SVG"
            >
              <span className="text-xs font-medium">SVG</span>
            </button>
            <button 
              onClick={() => exportDiagram('png')} 
              className="btn-icon text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50"
              aria-label="Export as PNG"
            >
              <span className="text-xs font-medium">PNG</span>
            </button>
          </div>

          <button 
            onClick={toggleFullscreen} 
            className="glass-effect rounded-lg p-1 shadow-elevation-2 btn-icon text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50"
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            )}
          </button>
          
          {isFullscreen && (
            <button 
              onClick={toggleFullscreen}
              className="absolute top-3 right-3 glass-effect rounded-lg p-2 shadow-elevation-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50"
              aria-label="Close fullscreen"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DiagramRenderer;