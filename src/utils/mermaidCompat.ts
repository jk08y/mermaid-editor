// src/utils/mermaidCompat.ts
import mermaid from 'mermaid';

/**
 * Safely initialize mermaid with configuration
 * This function wraps initialization to prevent multiple initializations
 * which can cause issues with React 19's strict mode
 */
let isInitialized = false;

export const initializeMermaid = (theme: 'dark' | 'light') => {
  if (!isInitialized) {
    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: theme === 'dark' ? 'dark' : 'default',
        securityLevel: 'loose',
        logLevel: 2, // Reduce log level to minimize console noise
        fontFamily: 'Inter var, sans-serif',
        flowchart: {
          htmlLabels: true,
          curve: 'basis',
        },
      });
      isInitialized = true;
    } catch (err) {
      console.error('Failed to initialize mermaid:', err);
    }
  } else {
    // Just update the theme if already initialized
    try {
      mermaid.initialize({
        theme: theme === 'dark' ? 'dark' : 'default',
      });
    } catch (err) {
      console.error('Failed to update mermaid theme:', err);
    }
  }
};

/**
 * Safely render a mermaid diagram
 * This function handles the rendering process in a way that's more compatible with React 19
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
    
    // Render the diagram
    return await mermaid.render(elementId, code);
  } catch (error) {
    console.error('Error rendering mermaid diagram:', error);
    containerElement.innerHTML = `<div class="text-red-500 p-4">Failed to render diagram. Error: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
    return null;
  }
};