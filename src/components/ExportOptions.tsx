// src/components/ExportOptions.tsx
import React, { useState } from 'react';
import { toPng, toSvg } from 'html-to-image';
import { saveAs } from 'file-saver';

interface ExportOptionsProps {
  diagramId: string;
  fileName?: string;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ 
  diagramId, 
  fileName = 'diagram' 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [format, setFormat] = useState<'svg' | 'png'>('svg');

  const handleExport = async () => {
    const element = document.getElementById(diagramId);
    if (!element) {
      console.error(`Element with ID "${diagramId}" not found`);
      return;
    }

    setIsExporting(true);
    try {
      if (format === 'png') {
        const dataUrl = await toPng(element, { 
          backgroundColor: 'white',
          pixelRatio: 2
        });
        saveAs(dataUrl, `${fileName}.png`);
      } else {
        const dataUrl = await toSvg(element, { 
          backgroundColor: 'white'
        });
        const blob = new Blob([dataUrl], { type: 'image/svg+xml;charset=utf-8' });
        saveAs(blob, `${fileName}.svg`);
      }
    } catch (error) {
      console.error('Error exporting diagram:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium mb-3">Export Diagram</h3>
      
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Format</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-primary-600"
              checked={format === 'svg'}
              onChange={() => setFormat('svg')}
            />
            <span className="ml-2">SVG</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-primary-600"
              checked={format === 'png'}
              onChange={() => setFormat('png')}
            />
            <span className="ml-2">PNG</span>
          </label>
        </div>
      </div>
      
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="w-full btn btn-primary"
      >
        {isExporting ? 'Exporting...' : `Export as ${format.toUpperCase()}`}
      </button>
    </div>
  );
};

export default ExportOptions;