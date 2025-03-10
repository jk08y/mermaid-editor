// src/utils/mermaidCompat.ts
import mermaid from 'mermaid';

/**
 * Safely initialize mermaid with configuration
 * This function wraps initialization to prevent multiple initializations
 * which can cause issues with React's strict mode
 */
let isInitialized = false;

export const initializeMermaid = (theme: 'dark' | 'light') => {
  try {
    // Configure mermaid with proper settings for the current theme
    const config = {
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
      logLevel: 2, // Reduce log level to minimize console noise
      fontFamily: 'Inter var, sans-serif',
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
      },
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
    };

    // Initialize only once
    mermaid.initialize(config);
    isInitialized = true;
  } catch (err) {
    console.error('Failed to initialize mermaid:', err);
  }
};

/**
 * Safely render a mermaid diagram
 * This function handles the rendering process in a way that's more compatible with React
 */
export const renderMermaidDiagram = async (
  code: string,
  elementId: string,
  containerElement: HTMLElement | null
): Promise<{ svg: string } | null> => {
  if (!containerElement) return null;
  
  try {
    // Clear previous content to prevent DOM conflicts
    containerElement.innerHTML = '';
    
    // Create wrapper element to render into
    const tempElement = document.createElement('div');
    tempElement.id = elementId;
    containerElement.appendChild(tempElement);
    
    // Force a re-initialization if needed
    if (!isInitialized) {
      initializeMermaid(
        document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      );
    }
    
    // Render the diagram
    return await mermaid.render(elementId, code);
  } catch (error) {
    console.error('Error rendering mermaid diagram:', error);
    containerElement.innerHTML = `<div class="text-red-500 p-4">Failed to render diagram. Error: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
    return null;
  }
};