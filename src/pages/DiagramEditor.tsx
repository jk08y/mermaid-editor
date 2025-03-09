// src/pages/DiagramEditor.tsx
import React, { useState } from 'react';
import CodeEditor from '../components/Editor';
import DiagramRenderer from '../components/DiagramRenderer';
import ExportOptions from '../components/ExportOptions';

const DiagramEditor: React.FC = () => {
  const [code, setCode] = useState<string>(`graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`);
  
  const [title, setTitle] = useState<string>('Untitled Diagram');

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Diagram title"
          className="text-2xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-primary-500 pb-1 w-full"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor column */}
        <div>
          <h2 className="text-lg font-medium mb-2">Edit Diagram Code</h2>
          <CodeEditor value={code} onChange={setCode} />
          
          {/* Export options */}
          <ExportOptions 
            diagramId="mermaid-diagram" 
            fileName={title.trim() ? title : 'diagram'}
          />
        </div>
        
        {/* Preview column */}
        <div>
          <h2 className="text-lg font-medium mb-2">Preview</h2>
          <DiagramRenderer code={code} id="mermaid-diagram" />
        </div>
      </div>
    </div>
  );
};

export default DiagramEditor;