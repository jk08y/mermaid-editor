// src/pages/DiagramEditor.tsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import CodeEditor from '../components/Editor';
import DiagramRenderer from '../components/DiagramRenderer';
import ExportOptions from '../components/ExportOptions';
import { useDiagramStorage } from '../hooks/useDiagramStorage';
import { exportDiagram, generateThumbnail } from '../utils/exportDiagram';
import { ExportOptions as ExportOptionsType } from '../types';

const DiagramEditor: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getDiagram, saveDiagram } = useDiagramStorage();
  
  // State for editor and diagram
  const [code, setCode] = useState<string>('');
  const [title, setTitle] = useState<string>('Untitled Diagram');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  
  // Refs
  const diagramRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<number | null>(null);
  
  // Get diagram from storage or template
  useEffect(() => {
    // If ID is provided, load from storage
    if (id) {
      const savedDiagram = getDiagram(id);
      if (savedDiagram) {
        setCode(savedDiagram.content);
        setTitle(savedDiagram.title);
      } else {
        // If diagram not found, redirect to create new
        navigate('/editor', { replace: true });
      }
    } else {
      // Check for template parameter
      const template = searchParams.get('template');
      if (template) {
        try {
          setCode(decodeURIComponent(template));
        } catch (error) {
          console.error('Error decoding template:', error);
          setCode('');
        }
      } else {
        // Default empty template
        setCode(`graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`);
      }
    }
  }, [id, getDiagram, navigate, searchParams]);
  
  // Save diagram handler
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      // Generate thumbnail
      let thumbnail = null;
      try {
        thumbnail = await generateThumbnail('mermaid-diagram');
      } catch (e) {
        console.error('Error generating thumbnail:', e);
      }
      
      // Save diagram
      const savedId = saveDiagram({
        id,
        title,
        content: code,
        previewImage: thumbnail
      });
      
      if (!id) {
        // If this was a new diagram, redirect to the saved one
        navigate(`/editor/${savedId}`, { replace: true });
      }
      
      setSaveMessage('Diagram saved successfully!');
      
      // Clear message after 3 seconds
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = window.setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving diagram:', error);
      setSaveMessage('Error saving diagram');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle export
  const handleExport = async (options: ExportOptionsType) => {
    setIsExporting(true);
    
    try {
      await exportDiagram('mermaid-diagram', title || 'diagram', options);
    } catch (error) {
      console.error('Error exporting diagram:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with title and save button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div className="flex-1 min-w-0 mr-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Diagram title"
            className="input text-xl font-semibold h-auto py-2"
          />
        </div>
        
        <div className="flex items-center mt-4 sm:mt-0">
          {saveMessage && (
            <div className="mr-4 text-sm font-medium">
              <span className={saveMessage.includes('Error') ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                {saveMessage}
              </span>
            </div>
          )}
          
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-primary flex items-center"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : id ? 'Save Changes' : 'Save Diagram'}
          </button>
        </div>
      </div>
      
      {/* Editor and preview layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor column */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <h2 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Mermaid Code</h2>
            <CodeEditor value={code} onChange={setCode} />
            
            <div className="mt-6">
              <ExportOptions 
                onExport={handleExport}
                isExporting={isExporting}
              />
            </div>
          </div>
        </div>
        
        {/* Preview column */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Preview</h2>
          <div ref={diagramRef}>
            <DiagramRenderer code={code} id="mermaid-diagram" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagramEditor;