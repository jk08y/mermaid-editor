// src/components/ExportOptions.tsx
import React, { useState } from 'react';
import { ExportFormat, ExportOptions } from '../types';

interface ExportOptionsProps {
  onExport: (options: ExportOptions) => void;
  isExporting: boolean;
}

const ExportOptionsComponent: React.FC<ExportOptionsProps> = ({ onExport, isExporting }) => {
  const [format, setFormat] = useState<ExportFormat>('svg');
  const [transparent, setTransparent] = useState<boolean>(true);
  const [scale, setScale] = useState<number>(1);
  
  const handleExport = () => {
    onExport({ format, transparent, scale });
  };
  
  return (
    <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Export Options</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Format
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-primary-600 focus:ring-primary-500"
                checked={format === 'svg'}
                onChange={() => setFormat('svg')}
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">SVG</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-primary-600 focus:ring-primary-500"
                checked={format === 'png'}
                onChange={() => setFormat('png')}
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">PNG</span>
            </label>
          </div>
        </div>
        
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox text-primary-600 rounded focus:ring-primary-500"
              checked={transparent}
              onChange={(e) => setTransparent(e.target.checked)}
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Transparent background
            </span>
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Scale: {scale.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="w-full btn btn-primary flex justify-center items-center"
        >
          {isExporting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Exporting...
            </>
          ) : (
            'Export Diagram'
          )}
        </button>
      </div>
    </div>
  );
};

export default ExportOptionsComponent;