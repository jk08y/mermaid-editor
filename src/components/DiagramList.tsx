// src/components/DiagramList.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SavedDiagram } from '../types';

interface DiagramListProps {
  diagrams: SavedDiagram[];
  onDelete: (id: string) => void;
  onExport?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

const DiagramList: React.FC<DiagramListProps> = ({ 
  diagrams, 
  onDelete,
  onExport,
  onDuplicate 
}) => {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedDiagrams, setSelectedDiagrams] = useState<string[]>([]);
  const [hoveredDiagram, setHoveredDiagram] = useState<string | null>(null);
  
  // Format date to readable string
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get time elapsed
  const getTimeElapsed = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval === 1 ? '1 year ago' : `${interval} years ago`;
    }
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval === 1 ? '1 month ago' : `${interval} months ago`;
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval === 1 ? '1 day ago' : `${interval} days ago`;
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
    }
    
    return seconds < 5 ? 'just now' : `${seconds} seconds ago`;
  };
  
  // Handle deletion confirm/cancel
  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmDelete(id);
  };
  
  const handleDeleteConfirm = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(id);
    setConfirmDelete(null);
    setSelectedDiagrams(selectedDiagrams.filter(diagramId => diagramId !== id));
  };
  
  const handleDeleteCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmDelete(null);
  };
  
  // Handle diagram actions
  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDuplicate) {
      onDuplicate(id);
    }
  };
  
  const handleExport = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onExport) {
      onExport(id);
    }
  };
  
  // Toggle diagram selection
  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setSelectedDiagrams(prev => 
      prev.includes(id) 
        ? prev.filter(diagramId => diagramId !== id) 
        : [...prev, id]
    );
  };
  
  // Check if diagram is selected
  const isSelected = (id: string) => selectedDiagrams.includes(id);
  
  if (diagrams.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-xl bg-white dark:bg-dark-surface border border-neutral-200 dark:border-dark-border">
        <svg className="mx-auto h-16 w-16 text-neutral-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-3 text-lg font-medium text-neutral-900 dark:text-neutral-200">No diagrams found</h3>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
          You haven't created any diagrams yet. Get started by creating your first diagram!
        </p>
        <div className="mt-8">
          <Link
            to="/editor"
            className="btn btn-primary inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Diagram
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {diagrams.map((diagram) => (
        <div
          key={diagram.id}
          className={`card card-hover overflow-hidden transition-all duration-200 ${
            isSelected(diagram.id) ? 'ring-2 ring-primary-500 border-primary-500' : ''
          }`}
          onMouseEnter={() => setHoveredDiagram(diagram.id)}
          onMouseLeave={() => setHoveredDiagram(null)}
        >
          <Link
            to={`/editor/${diagram.id}`}
            className="block h-full"
          >
            {/* Diagram preview */}
            <div className="aspect-w-16 aspect-h-9 bg-neutral-100 dark:bg-dark-background rounded-t-md overflow-hidden relative group">
              {diagram.previewImage ? (
                <img
                  src={diagram.previewImage}
                  alt={diagram.title || 'Diagram preview'}
                  className="object-contain h-full w-full transition-transform duration-200 group-hover:scale-105"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <svg className="h-12 w-12 text-neutral-400 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
              )}
              
              {/* Selection checkbox */}
              <div className="absolute top-2 left-2">
                <button
                  onClick={(e) => toggleSelect(diagram.id, e)}
                  className={`p-1.5 rounded-full transition-all ${
                    isSelected(diagram.id) 
                      ? 'bg-primary-500 text-white shadow-sm' 
                      : 'bg-white/70 text-neutral-600 opacity-0 group-hover:opacity-100 hover:bg-white dark:bg-dark-surface/70 dark:text-neutral-300 dark:hover:bg-dark-surface'
                  }`}
                  aria-label={isSelected(diagram.id) ? 'Deselect diagram' : 'Select diagram'}
                >
                  {isSelected(diagram.id) ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Quick actions menu - visible on hover */}
              {(hoveredDiagram === diagram.id || isSelected(diagram.id)) && (
                <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onDuplicate && (
                    <button
                      onClick={(e) => handleDuplicate(diagram.id, e)}
                      className="p-1.5 bg-white/70 hover:bg-white text-neutral-600 rounded-full dark:bg-dark-surface/70 dark:text-neutral-300 dark:hover:bg-dark-surface"
                      aria-label="Duplicate diagram"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                    </button>
                  )}
                  
                  {onExport && (
                    <button
                      onClick={(e) => handleExport(diagram.id, e)}
                      className="p-1.5 bg-white/70 hover:bg-white text-neutral-600 rounded-full dark:bg-dark-surface/70 dark:text-neutral-300 dark:hover:bg-dark-surface"
                      aria-label="Export diagram"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
              
              {/* Diagram type badge */}
              <div className="absolute bottom-2 left-2">
                <span className="text-xs px-1.5 py-0.5 bg-black/50 text-white rounded backdrop-blur-sm">
                  {diagram.content.trim().split(/\s+/)[0] || 'Diagram'}
                </span>
              </div>
            </div>
            
            {/* Diagram info */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white truncate">
                  {diagram.title || 'Untitled Diagram'}
                </h3>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap ml-2">
                  {getTimeElapsed(diagram.updatedAt)}
                </span>
              </div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Updated {formatDate(diagram.updatedAt)}
              </p>
              
              {/* Actions menu */}
              <div className="mt-3 flex justify-end border-t border-neutral-100 dark:border-dark-border pt-3">
                {confirmDelete === diagram.id ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => handleDeleteConfirm(diagram.id, e)}
                      className="text-xs px-2 py-1 bg-error-100 text-error-600 dark:bg-error-900/20 dark:text-error-400 rounded hover:bg-error-200 dark:hover:bg-error-800/30"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={handleDeleteCancel}
                      className="text-xs px-2 py-1 bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => handleDeleteClick(diagram.id, e)}
                    className="text-xs px-2 py-1 text-neutral-500 dark:text-neutral-400 hover:text-error-600 dark:hover:text-error-400 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default DiagramList;