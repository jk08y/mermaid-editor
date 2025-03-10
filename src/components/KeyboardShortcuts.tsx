// src/components/KeyboardShortcuts.tsx
import React from 'react';

interface KeyboardShortcutsProps {
  onClose: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ onClose }) => {
  // Keyboard shortcut categories
  const shortcutCategories = [
    {
      title: 'Editor Actions',
      shortcuts: [
        { keys: ['Ctrl', 'S'], description: 'Save diagram' },
        { keys: ['Ctrl', 'N'], description: 'Create new diagram' },
        { keys: ['Ctrl', 'Z'], description: 'Undo' },
        { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo' },
        { keys: ['Ctrl', '/'], description: 'Toggle comment' },
      ]
    },
    {
      title: 'Layout Controls',
      shortcuts: [
        { keys: ['Ctrl', 'L'], description: 'Cycle through layouts' },
        { keys: ['Ctrl', 'T'], description: 'Open templates' },
        { keys: ['F1'], description: 'Show help' },
      ]
    },
    {
      title: 'Editor Navigation',
      shortcuts: [
        { keys: ['Ctrl', 'F'], description: 'Find in code' },
        { keys: ['Ctrl', 'G'], description: 'Go to line' },
        { keys: ['Ctrl', 'Home'], description: 'Go to start' },
        { keys: ['Ctrl', 'End'], description: 'Go to end' },
      ]
    },
    {
      title: 'Preview Controls',
      shortcuts: [
        { keys: ['+'], description: 'Zoom in preview' },
        { keys: ['-'], description: 'Zoom out preview' },
        { keys: ['0'], description: 'Reset zoom' },
        { keys: ['F'], description: 'Enter fullscreen preview' },
        { keys: ['Esc'], description: 'Exit fullscreen' },
      ]
    }
  ];
  
  // Platform-specific key display
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  
  const formatKeyName = (key: string): string => {
    if (key === 'Ctrl') return isMac ? '⌘' : 'Ctrl';
    if (key === 'Shift') return isMac ? '⇧' : 'Shift';
    if (key === 'Alt') return isMac ? '⌥' : 'Alt';
    return key;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/70 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-surface rounded-xl shadow-elevation-3 max-w-2xl w-full max-h-[85vh] overflow-hidden animate-slide-up">
        <div className="p-4 border-b border-neutral-200 dark:border-dark-border flex justify-between items-center sticky top-0 bg-white dark:bg-dark-surface z-10">
          <h3 className="text-xl font-semibold">Keyboard Shortcuts</h3>
          <button 
            onClick={onClose} 
            className="p-1.5 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-dark-hover"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Use these keyboard shortcuts to speed up your workflow when creating and editing diagrams.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {shortcutCategories.map((category) => (
              <div key={category.title} className="space-y-4">
                <h4 className="text-lg font-medium text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-dark-border pb-2">
                  {category.title}
                </h4>
                <div className="space-y-3">
                  {category.shortcuts.map((shortcut, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-neutral-700 dark:text-neutral-300">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center space-x-1">
                        {shortcut.keys.map((key, keyIdx) => (
                          <React.Fragment key={keyIdx}>
                            <kbd className="px-2 py-1 text-xs font-semibold text-neutral-800 bg-neutral-100 border border-neutral-300 rounded dark:bg-dark-background dark:text-neutral-200 dark:border-dark-border">
                              {formatKeyName(key)}
                            </kbd>
                            {keyIdx < shortcut.keys.length - 1 && (
                              <span className="text-neutral-400">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800/50">
            <h4 className="text-lg font-medium text-primary-700 dark:text-primary-300 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pro Tip
            </h4>
            <p className="text-primary-600 dark:text-primary-400 text-sm">
              Most Mermaid syntax follows simple patterns. For common diagram elements, you can use basic shortcuts. For example, in flowcharts, use <code className="px-1.5 py-0.5 bg-primary-100 dark:bg-primary-800/50 rounded">--&gt;</code> for arrows and <code className="px-1.5 py-0.5 bg-primary-100 dark:bg-primary-800/50 rounded">{'{}'}</code>, <code className="px-1.5 py-0.5 bg-primary-100 dark:bg-primary-800/50 rounded">[]</code>, or <code className="px-1.5 py-0.5 bg-primary-100 dark:bg-primary-800/50 rounded">()</code> for different node shapes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;