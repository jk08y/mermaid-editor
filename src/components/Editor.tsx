// src/components/Editor.tsx
import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, height = '400px' }) => {
  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
      <Editor
        height={height}
        defaultLanguage="markdown"
        value={value}
        theme={document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs-light'}
        onChange={(value) => onChange(value || '')}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: 'on',
          wordWrap: 'on',
        }}
      />
    </div>
  );
};

export default CodeEditor;