// src/pages/DiagramEditor.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import CodeEditor from '../components/Editor';
import DiagramRenderer from '../components/DiagramRenderer';
import { useDiagramStorage } from '../hooks/useDiagramStorage';
import { generateThumbnail } from '../utils/exportDiagram';
import { useTheme } from '../hooks/useTheme';

// Define types for layout
type LayoutType = 'split' | 'stacked' | 'editor-focus' | 'preview-focus';

const DiagramEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getDiagram, saveDiagram, isLoading } = useDiagramStorage();
  
  // Editor state
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('Untitled Diagram');
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved');
  
  // Layout settings
  const [layout, setLayout] = useState<LayoutType>('split');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Reference for auto-save timer
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Load diagram data on initial render
  useEffect(() => {
    const loadInitialData = () => {
      if (id) {
        const diagram = getDiagram(id);
        if (diagram) {
          setCode(diagram.content);
          setTitle(diagram.title || 'Untitled Diagram');
          setLastSaved(new Date(diagram.updatedAt));
          setIsDirty(false);
          setSaveStatus('saved');
        } else {
          // Diagram not found
          navigate('/editor', { replace: true });
        }
      } else {
        // Check for template in URL params
        const params = new URLSearchParams(location.search);
        const template = params.get('template');
        
        if (template) {
          try {
            setCode(decodeURIComponent(template));
          } catch {
            // Use default if template decoding fails
            setDefaultDiagram();
          }
        } else {
          // Set default diagram code
          setDefaultDiagram();
        }
      }
    };

    loadInitialData();
  }, [id, getDiagram, navigate, location.search]); // Dependencies fixed
  
  // Set default diagram
  const setDefaultDiagram = () => {
    setCode(`graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`);
  };
  
  // Templates for quick start - using useRef to avoid recreating on every render
  const templates = useRef([
    {
      type: 'flowchart',
      name: 'Simple Flowchart',
      description: 'Basic flowchart with decisions',
      template: `flowchart TD
    Start([Start]) --> Process1[Process step]
    Process1 --> Decision{Decision?}
    Decision -->|Yes| Process2[Process step 2]
    Decision -->|No| Process3[Process step 3]
    Process2 --> End([End])
    Process3 --> End`
    },
    {
      type: 'sequenceDiagram',
      name: 'Sequence Diagram',
      description: 'Communication between services',
      template: `sequenceDiagram
    participant User
    participant System
    participant Database
    
    User->>System: Request data
    System->>Database: Query data
    Database-->>System: Return results
    System-->>User: Display results`
    },
    {
      type: 'classDiagram',
      name: 'Class Diagram',
      description: 'Object-oriented structure',
      template: `classDiagram
    class Animal {
      +name: string
      +age: int
      +makeSound() void
    }
    class Dog {
      +breed: string
      +fetch() void
    }
    class Cat {
      +color: string
      +climb() void
    }
    Animal <|-- Dog
    Animal <|-- Cat`
    },
    {
      type: 'stateDiagram',
      name: 'State Diagram',
      description: 'State transitions',
      template: `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Start
    Processing --> Complete: Success
    Processing --> Error: Failure
    Complete --> [*]
    Error --> Idle: Retry`
    }
  ]).current;
  
  // Set up auto-save
  useEffect(() => {
    if (!isDirty || !autoSave) return;
    
    // Clear previous timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    // Set new timer for auto-save
    autoSaveTimerRef.current = setTimeout(() => {
      handleSave();
    }, 3000); // Auto-save after 3 seconds of inactivity
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
    };
  }, [isDirty, autoSave]); // handleSave will be added in useCallback
  
  // Handle diagram changes
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    setIsDirty(true);
    setSaveStatus('unsaved');
  }, []);
  
  // Handle title changes
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsDirty(true);
    setSaveStatus('unsaved');
  }, []);
  
  // Save diagram
  const handleSave = useCallback(async () => {
    if (!isDirty) return;
    
    setSaveStatus('saving');
    
    try {
      // Generate thumbnail
      let thumbnailUrl = null;
      try {
        thumbnailUrl = await generateThumbnail('mermaid-diagram');
      } catch (error) {
        console.error('Failed to generate thumbnail:', error);
        // Continue without thumbnail if generation fails
      }
      
      // Save to storage
      const savedId = saveDiagram({
        id,
        title,
        content: code,
        previewImage: thumbnailUrl || undefined
      });
      
      // Update state
      setLastSaved(new Date());
      setIsDirty(false);
      setSaveStatus('saved');
      
      // Redirect if new diagram
      if (!id) {
        navigate(`/editor/${savedId}`, { replace: true });
      }
    } catch (error) {
      console.error('Failed to save diagram:', error);
      setSaveStatus('unsaved');
    }
  }, [id, isDirty, code, title, saveDiagram, navigate]);
  
  // Create new diagram
  const handleNew = useCallback(() => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Create new diagram anyway?')) {
        navigate('/editor');
      }
    } else {
      navigate('/editor');
    }
  }, [isDirty, navigate]);
  
  // Toggle layout
  const toggleLayout = useCallback(() => {
    setLayout(prevLayout => {
      switch (prevLayout) {
        case 'split': return 'stacked';
        case 'stacked': return 'editor-focus';
        case 'editor-focus': return 'preview-focus';
        case 'preview-focus': return 'split';
        default: return 'split';
      }
    });
  }, []);
  
  // Apply template
  const applyTemplate = useCallback((templateCode: string) => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Apply template anyway?')) {
        setCode(templateCode);
        setIsDirty(true);
        setSaveStatus('unsaved');
      }
    } else {
      setCode(templateCode);
      setIsDirty(true);
      setSaveStatus('unsaved');
    }
    setShowTemplates(false);
  }, [isDirty]);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save: Ctrl/Cmd + S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      
      // New: Ctrl/Cmd + N
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNew();
      }
      
      // Toggle layout: Ctrl/Cmd + L
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        toggleLayout();
      }
      
      // Toggle templates: Ctrl/Cmd + T
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        setShowTemplates(prev => !prev);
      }
      
      // Show help: F1 or Ctrl/Cmd + H
      if (e.key === 'F1' || ((e.ctrlKey || e.metaKey) && e.key === 'h')) {
        e.preventDefault();
        setShowHelp(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNew, handleSave, toggleLayout]);
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }
  
  // Determine layout classes
  const getLayoutClasses = () => {
    switch (layout) {
      case 'split':
        return 'grid grid-cols-1 lg:grid-cols-2 gap-6';
      case 'stacked':
        return 'flex flex-col gap-6';
      case 'editor-focus':
        return 'grid grid-cols-4 gap-6';
      case 'preview-focus':
        return 'grid grid-cols-4 gap-6';
      default:
        return 'grid grid-cols-1 lg:grid-cols-2 gap-6';
    }
  };

  // Get editor container classes
  const getEditorClasses = () => {
    switch (layout) {
      case 'split':
        return 'col-span-1';
      case 'stacked':
        return 'w-full';
      case 'editor-focus':
        return 'col-span-3';
      case 'preview-focus':
        return 'col-span-1';
      default:
        return 'col-span-1';
    }
  };

  // Get preview container classes
  const getPreviewClasses = () => {
    switch (layout) {
      case 'split':
        return 'col-span-1';
      case 'stacked':
        return 'w-full';
      case 'editor-focus':
        return 'col-span-1';
      case 'preview-focus':
        return 'col-span-3';
      default:
        return 'col-span-1';
    }
  };
  
  return (
    <div className="max-w-full mx-auto px-4 pb-8 animate-fade-in">
      {/* Header with title and actions */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-grow">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Diagram title"
            className="text-2xl font-bold bg-transparent border-b-2 border-neutral-200 dark:border-dark-border focus:outline-none focus:border-primary-500 dark:focus:border-primary-500 pb-1 w-full transition-colors"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Save status indicator */}
          <span className={`text-sm ${
            saveStatus === 'saved' ? 'text-success-600 dark:text-success-400' : 
            saveStatus === 'saving' ? 'text-warning-600 dark:text-warning-400' : 
            'text-error-600 dark:text-error-400'
          }`}>
            {saveStatus === 'saved' ? 'Saved' : 
             saveStatus === 'saving' ? 'Saving...' : 
             'Unsaved'}
          </span>
          
          {/* Auto-save toggle */}
          <div className="flex items-center">
            <label htmlFor="autosave-toggle" className="text-sm text-neutral-600 dark:text-neutral-400 mr-2">Auto-save</label>
            <div className="relative inline-block w-10 align-middle select-none">
              <input 
                type="checkbox" 
                id="autosave-toggle" 
                checked={autoSave}
                onChange={() => setAutoSave(!autoSave)}
                className="sr-only"
              />
              <div className={`block h-6 rounded-full w-10 ${autoSave ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-700'} transition-colors`}></div>
              <div className={`absolute left-0.5 top-0.5 bg-white dark:bg-neutral-100 rounded-full h-5 w-5 transition-transform ${autoSave ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </div>
          
          {/* Last saved time */}
          {lastSaved && (
            <span className="text-sm text-neutral-500 dark:text-neutral-400 hidden sm:inline-block">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          
          {/* Primary actions */}
          <div className="flex flex-wrap gap-2">
          <button 
              onClick={() => setShowTemplates(true)}
              className="btn btn-secondary btn-sm"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              Templates
            </button>
            
            <button
              onClick={handleSave}
              disabled={!isDirty || saveStatus === 'saving'}
              className="btn btn-primary btn-sm"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save
            </button>
            
            <button
              onClick={handleNew}
              className="btn btn-secondary btn-sm"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New
            </button>
            
            <button
              onClick={() => setShowHelp(true)}
              className="btn btn-ghost btn-sm"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Help
            </button>
          </div>
        </div>
      </div>
      
      {/* Layout settings */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
          <span className="hidden sm:inline">Keyboard shortcuts: </span>
          <kbd className="mx-1 px-2 py-1 text-xs font-semibold text-neutral-800 bg-neutral-100 border border-neutral-200 rounded dark:bg-dark-surface dark:text-neutral-200 dark:border-dark-border">Ctrl+S</kbd>
          <span className="hidden sm:inline">Save</span>
          <span className="mx-2 hidden sm:inline">•</span>
          <kbd className="mx-1 px-2 py-1 text-xs font-semibold text-neutral-800 bg-neutral-100 border border-neutral-200 rounded dark:bg-dark-surface dark:text-neutral-200 dark:border-dark-border">Ctrl+L</kbd>
          <span className="hidden sm:inline">Toggle Layout</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Layout:</span>
          <button 
            onClick={toggleLayout}
            className="btn btn-secondary btn-sm"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            {layout.replace('-', ' ')}
          </button>
        </div>
      </div>
      
      {/* Main content area */}
      <div className={getLayoutClasses()}>
        {/* Editor column */}
        <div className={getEditorClasses()}>
          <h2 className="text-lg font-medium mb-2 flex items-center">
            <svg className="w-5 h-5 mr-1 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Edit Diagram Code
          </h2>
          <CodeEditor 
            value={code} 
            onChange={handleCodeChange} 
            height={layout === 'stacked' ? '350px' : '500px'}
          />
        </div>
        
        {/* Preview column */}
        <div className={getPreviewClasses()}>
          <h2 className="text-lg font-medium mb-2 flex items-center">
            <svg className="w-5 h-5 mr-1 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </h2>
          <div className={`${layout === 'stacked' ? 'h-[400px]' : 'h-[500px]'}`}>
            <DiagramRenderer 
              code={code} 
              id="mermaid-diagram" 
              className="h-full"
            />
          </div>
        </div>
      </div>
      
      {/* Templates modal */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70">
          <div className="bg-white dark:bg-dark-surface rounded-xl shadow-elevation-3 w-full max-w-3xl max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="p-4 border-b border-neutral-200 dark:border-dark-border flex justify-between items-center">
              <h3 className="text-xl font-semibold">Templates Gallery</h3>
              <button 
                onClick={() => setShowTemplates(false)} 
                className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template, index) => (
                  <div 
                    key={index} 
                    className="card card-hover cursor-pointer hover:border-primary-400"
                    onClick={() => applyTemplate(template.template)}
                  >
                    <div className="p-4">
                      <h4 className="text-lg font-medium">{template.name}</h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">{template.description}</p>
                      <div className="text-primary-600 dark:text-primary-400 text-sm flex items-center">
                        <span>Use template</span>
                        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Help modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70">
          <div className="bg-white dark:bg-dark-surface rounded-xl shadow-elevation-3 w-full max-w-3xl max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="p-4 border-b border-neutral-200 dark:border-dark-border flex justify-between items-center">
              <h3 className="text-xl font-semibold">Mermaid Diagram Help</h3>
              <button 
                onClick={() => setShowHelp(false)} 
                className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 prose prose-custom max-w-none">
              <h4>Keyboard Shortcuts</h4>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left">Shortcut</th>
                    <th className="text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><kbd className="px-1.5 py-0.5 text-xs font-semibold border rounded">Ctrl+S</kbd></td>
                    <td>Save diagram</td>
                  </tr>
                  <tr>
                    <td><kbd className="px-1.5 py-0.5 text-xs font-semibold border rounded">Ctrl+N</kbd></td>
                    <td>New diagram</td>
                  </tr>
                  <tr>
                    <td><kbd className="px-1.5 py-0.5 text-xs font-semibold border rounded">Ctrl+L</kbd></td>
                    <td>Toggle layout</td>
                  </tr>
                  <tr>
                    <td><kbd className="px-1.5 py-0.5 text-xs font-semibold border rounded">Ctrl+T</kbd></td>
                    <td>Show templates</td>
                  </tr>
                  <tr>
                    <td><kbd className="px-1.5 py-0.5 text-xs font-semibold border rounded">F1</kbd> or <kbd className="px-1.5 py-0.5 text-xs font-semibold border rounded">Ctrl+H</kbd></td>
                    <td>Show this help</td>
                  </tr>
                </tbody>
              </table>
              
              <h4>Preview Controls</h4>
              <p>
                In the preview pane, you can:
              </p>
              <ul>
                <li>Click and drag to pan the diagram</li>
                <li>Use the zoom controls to zoom in/out</li>
                <li>Use Ctrl + Mousewheel to zoom</li>
                <li>Click the fullscreen button to expand the preview</li>
                <li>Export your diagram as SVG or PNG</li>
              </ul>
              
              <h4>Quick Mermaid Syntax Reference</h4>
              <p>Flowchart example:</p>
              <pre className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded">
                {`graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[Alternative]
    C --> E[End]
    D --> E[End]`}
              </pre>
              
              <p>Sequence diagram example:</p>
              <pre className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded">
                {`sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!`}
              </pre>
              
              <p>For complete documentation, visit <a href="https://mermaid.js.org/intro/getting-started.html" target="_blank" rel="noopener noreferrer">Mermaid Documentation</a>.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagramEditor;