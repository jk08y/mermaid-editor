// src/components/Editor.tsx
import { useRef, useState, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useTheme } from '../hooks/useTheme';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, height = '70vh' }) => {
  const editorRef = useRef<any>(null);
  const { theme } = useTheme();
  const [editorTheme, setEditorTheme] = useState<'vs-light' | 'vs-dark'>('vs-light');
  
  // Sync Monaco editor theme with app theme
  useEffect(() => {
    setEditorTheme(theme === 'dark' ? 'vs-dark' : 'vs-light');
  }, [theme]);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    
    // Configure editor settings
    editor.updateOptions({
      fontSize: 14,
      fontFamily: 'Fira Code, monospace',
      wordWrap: 'on',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      lineNumbers: 'on',
      renderLineHighlight: 'all',
      tabSize: 2,
      formatOnPaste: true,
      automaticLayout: true,
    });
  };

  return (
    <div className="rounded-md overflow-hidden border border-gray-300 dark:border-dark-border shadow-sm">
      <Editor
        height={height}
        defaultLanguage="markdown"
        value={value}
        theme={editorTheme}
        onChange={(value) => onChange(value || '')}
        onMount={handleEditorDidMount}
        options={{
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
};

export default CodeEditor;