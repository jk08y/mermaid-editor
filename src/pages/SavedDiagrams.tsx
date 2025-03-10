// src/pages/SavedDiagrams.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DiagramList from '../components/DiagramList';
import { useDiagramStorage } from '../hooks/useDiagramStorage';
import { exportDiagram } from '../utils/exportDiagram';
import { SavedDiagram } from '../types';

const SavedDiagrams: React.FC = () => {
  const { diagrams, isLoading, deleteDiagram, saveDiagram, getDiagram } = useDiagramStorage();
  const navigate = useNavigate();
  
  // Filtering and sorting
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'flowchart' | 'sequence' | 'class' | 'entity' | 'state' | 'gantt'>('all');
  
  // UI state
  const [selectedDiagrams, setSelectedDiagrams] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Detect diagram type from content
  const getDiagramType = (content: string): string => {
    const firstWord = content.trim().split(/\s+/)[0]?.toLowerCase();
    
    switch(firstWord) {
      case 'graph':
      case 'flowchart':
        return 'flowchart';
      case 'sequencediagram':
        return 'sequence';
      case 'classdiagram':
        return 'class';
      case 'erdiagram':
        return 'entity';
      case 'statediagram':
        return 'state';
      case 'gantt':
        return 'gantt';
      default:
        return 'other';
    }
  };
  
  // Filter diagrams
  const filterDiagrams = () => {
    return diagrams.filter(diagram => {
      // Apply search filter
      const matchesSearch = 
        diagram.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getDiagramType(diagram.content).toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply type filter
      const matchesType = 
        filter === 'all' || 
        getDiagramType(diagram.content) === filter;
      
      return matchesSearch && matchesType;
    });
  };
  
  // Sort diagrams
  const sortDiagrams = (filtered: SavedDiagram[]) => {
    return [...filtered].sort((a, b) => {
      switch(sortOrder) {
        case 'newest':
          return b.updatedAt - a.updatedAt;
        case 'oldest':
          return a.updatedAt - b.updatedAt;
        case 'name':
          return (a.title || 'Untitled').localeCompare(b.title || 'Untitled');
        default:
          return 0;
      }
    });
  };
  
  // Get filtered and sorted diagrams
  const filteredDiagrams = filterDiagrams();
  const sortedDiagrams = sortDiagrams(filteredDiagrams);
  
  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilter('all');
    setSortOrder('newest');
  };
  
  // Handle bulk deletion
  const handleBulkDelete = () => {
    if (selectedDiagrams.length === 0) return;
    setShowDeleteConfirm(true);
  };
  
  const confirmBulkDelete = () => {
    selectedDiagrams.forEach(id => {
      deleteDiagram(id);
    });
    setSelectedDiagrams([]);
    setShowDeleteConfirm(false);
  };
  
  // Handle duplicate
  const handleDuplicate = (id: string) => {
    const diagram = getDiagram(id);
    if (!diagram) return;
    
    // Create a new diagram with the same content
    const newId = saveDiagram({
      title: `${diagram.title || 'Untitled'} (Copy)`,
      content: diagram.content,
      previewImage: diagram.previewImage
    });
    
    // Redirect to the new diagram
    navigate(`/editor/${newId}`);
  };
  
  // Handle export
  const handleExport = (id: string) => {
    const diagram = getDiagram(id);
    if (!diagram) return;
    
    // Show a modal or dropdown to select export format
    // For now, just export as SVG
    exportDiagram(
      'mermaid-diagram', 
      diagram.title || 'diagram',
      { format: 'svg', transparent: false, scale: 2 }
    );
  };
  
  // Reset selection when filters change
  useEffect(() => {
    setSelectedDiagrams([]);
  }, [searchTerm, filter, sortOrder]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Saved Diagrams
          {filteredDiagrams.length > 0 && (
            <span className="ml-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
              ({filteredDiagrams.length} {filteredDiagrams.length === 1 ? 'diagram' : 'diagrams'})
            </span>
          )}
        </h1>
        <Link to="/editor" className="mt-4 md:mt-0 btn btn-primary">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New Diagram
        </Link>
      </div>

      {/* Filters and actions */}
      <div className="mb-6 bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-neutral-200 dark:border-dark-border p-4">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Search input */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search diagrams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`input pl-10 ${isSearchFocused ? 'ring-2 ring-primary-500 border-primary-500' : ''}`}
              />
              {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300"
                    aria-label="Clear search"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Type filter */}
          <div className="sm:w-56">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="input"
              aria-label="Filter by diagram type"
            >
              <option value="all">All diagram types</option>
              <option value="flowchart">Flowcharts</option>
              <option value="sequence">Sequence diagrams</option>
              <option value="class">Class diagrams</option>
              <option value="entity">Entity-relationship</option>
              <option value="state">State diagrams</option>
              <option value="gantt">Gantt charts</option>
            </select>
          </div>
          
          {/* Sort order */}
          <div className="sm:w-48">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="input"
              aria-label="Sort diagrams"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
        
        {/* Bulk actions - show when diagrams are selected */}
        {selectedDiagrams.length > 0 && (
          <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-dark-border flex items-center justify-between">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              <span className="font-medium">{selectedDiagrams.length}</span> {selectedDiagrams.length === 1 ? 'diagram' : 'diagrams'} selected
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedDiagrams([])}
                className="btn btn-secondary btn-sm"
              >
                Deselect all
              </button>
              <button
                onClick={handleBulkDelete}
                className="btn btn-danger btn-sm"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Diagrams list */}
      <div className="mb-10">
        <DiagramList 
          diagrams={sortedDiagrams} 
          onDelete={deleteDiagram}
          onDuplicate={handleDuplicate}
          onExport={handleExport}
        />
      </div>

      {/* Empty state */}
      {diagrams.length > 0 && filteredDiagrams.length === 0 && (
        <div className="text-center py-10 bg-white dark:bg-dark-surface rounded-xl border border-neutral-200 dark:border-dark-border">
          <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-200">No matching diagrams</h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            No diagrams match your current filters.
          </p>
          <div className="mt-6">
            <button
              onClick={clearFilters}
              className="btn btn-secondary"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-surface rounded-lg shadow-elevation-3 max-w-md w-full animate-fade-in">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-error-100 dark:bg-error-900/30 rounded-full text-error-600 dark:text-error-400 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white text-center mb-2">
                Delete {selectedDiagrams.length} {selectedDiagrams.length === 1 ? 'diagram' : 'diagrams'}?
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-center mb-6">
                This action cannot be undone. The {selectedDiagrams.length === 1 ? 'diagram' : 'diagrams'} will be permanently removed from your account.
              </p>
              <div className="flex flex-col sm:flex-row-reverse space-y-3 sm:space-y-0 sm:space-x-3 sm:space-x-reverse">
                <button
                  onClick={confirmBulkDelete}
                  className="btn btn-danger"
                >
                  Delete {selectedDiagrams.length === 1 ? 'diagram' : 'diagrams'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedDiagrams;