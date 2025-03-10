// src/components/Editor.tsx
import React, { useEffect, useRef, useState } from 'react';
import MonacoEditor, { OnMount } from '@monaco-editor/react';
import { useTheme } from '../hooks/useTheme';
import { editor } from 'monaco-editor';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  language?: string;
  readOnly?: boolean;
  minimap?: boolean;
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval';
  fontSize?: number;
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded';
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  height = '400px',
  language = 'markdown',
  readOnly = false,
  minimap = false,
  lineNumbers = 'on',
  fontSize = 14,
  wordWrap = 'on'
}) => {
  const { theme } = useTheme();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  // Configure Mermaid syntax highlighting
  useEffect(() => {
    if (!isReady || !monacoRef.current) return;

    const monaco = monacoRef.current;

    // Register Mermaid language if not already registered
    if (!monaco.languages.getLanguages().some((lang: any) => lang.id === 'mermaid')) {
      monaco.languages.register({ id: 'mermaid' });

      // Define Mermaid syntax highlighting rules
      monaco.languages.setMonarchTokensProvider('mermaid', {
        tokenizer: {
          root: [
            // Keywords
            [/\b(graph|subgraph|end|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph)\b/, 'keyword'],
            [/\b(TD|TB|LR|RL|BT)\b/, 'keyword'],
            [/\b(participant|actor|activate|deactivate|note|loop|alt|else|opt|par|and|rect|class|state|section)\b/, 'keyword'],
            
            // Nodes
            [/\[[^\]]+\]/, 'type'],
            [/\([^)]+\)/, 'type'],
            [/{[^}]+}/, 'type'],
            [/\[\[[^\]]+\]\]/, 'type'],
            [/\(\([^)]+\)\)/, 'type'],
            [/{{[^}]+}}/, 'type'],
            
            // Arrows/connections
            [/[-->]+/, 'operator'],
            [/--[ox]/, 'operator'],
            [/-[.-]+/, 'operator'],
            [/==+/, 'operator'],
            [/--+/, 'operator'],
            
            // Comments
            [/%% .*$/, 'comment'],
            
            // Strings
            [/"[^"]*"/, 'string'],
            [/'[^']*'/, 'string'],
            
            // Special characters
            [/[:;|]/, 'delimiter'],
            
            // CSS style declarations
            [/style\s+.*\s+fill/, 'attribute.name'],
            [/#[0-9a-fA-F]+/, 'attribute.value'],
            
            // Classes and styles
            [/\bclass\b/, 'keyword'],
            [/\bstyle\b/, 'keyword'],
            [/\bclassDef\b/, 'keyword'],
            [/\bclick\b/, 'keyword'],
            [/\blinkStyle\b/, 'keyword'],
          ]
        }
      });

      // Set mermaid as default language for .mermaid files
      monaco.languages.setLanguageConfiguration('mermaid', {
        comments: {
          lineComment: '%%',
        },
        brackets: [
          ['{', '}'],
          ['[', ']'],
          ['(', ')'],
        ],
        autoClosingPairs: [
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '"', close: '"' },
          { open: '\'', close: '\'' },
        ],
        surroundingPairs: [
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '"', close: '"' },
          { open: '\'', close: '\'' },
        ],
        folding: {
          markers: {
            start: new RegExp('^\\s*subgraph|^\\s*graph|^\\s*sequenceDiagram|^\\s*classDiagram|^\\s*stateDiagram'),
            end: new RegExp('^\\s*end\\b')
          }
        }
      });
    }

    // Set current language to mermaid
    if (language === 'markdown' && editorRef.current) {
      monaco.editor.setModelLanguage(editorRef.current.getModel()!, 'mermaid');
    }
  }, [isReady, language]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setIsReady(true);

    // Add custom commands
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      editor.getAction('actions.find').run();
    });

    // Format document on Shift+Alt+F
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF, () => {
      editor.getAction('editor.action.formatDocument')?.run();
    });

    // Ctrl/Cmd + Enter to execute a custom action (like preview)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      // Add any custom action here
      console.log('Ctrl+Enter pressed');
    });
    
    // Focus the editor to enable immediate typing
    editor.focus();
  };

  return (
    <div className="border border-neutral-200 dark:border-dark-border rounded-md overflow-hidden bg-white dark:bg-dark-surface shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="bg-neutral-50 dark:bg-dark-surface border-b border-neutral-200 dark:border-dark-border px-3 py-1.5 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 ml-2">
            Mermaid Editor
          </span>
          {readOnly && (
            <span className="bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs px-1.5 py-0.5 rounded">
              Read Only
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => {
              const currentValue = editorRef.current?.getValue() || '';
              const indentedValue = currentValue.split('\n').map(line => '    ' + line).join('\n');
              editorRef.current?.setValue(indentedValue);
              onChange(indentedValue);
            }}
            className="p-1 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            title="Indent All"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </button>
          <button
            onClick={() => editorRef.current?.getAction('editor.action.formatDocument')?.run()}
            className="p-1 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            title="Format Code"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(editorRef.current?.getValue() || '');
            }}
            className="p-1 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            title="Copy Code"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
          </button>
        </div>
      </div>

      <MonacoEditor
        height={height}
        language="mermaid"
        value={value}
        theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
        onChange={(value) => onChange(value || '')}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: minimap },
          scrollBeyondLastLine: false,
          fontSize,
          lineNumbers,
          wordWrap,
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
            alwaysConsumeMouseWheel: false,
          },
          automaticLayout: true,
          padding: { top: 8 },
          renderIndentGuides: true,
          bracketPairColorization: {
            enabled: true,
          },
          suggest: {
            showWords: true,
            showSnippets: true,
            showClasses: true,
            showFunctions: true,
          },
          quickSuggestions: true,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontLigatures: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;