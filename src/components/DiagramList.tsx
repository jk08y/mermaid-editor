// src/components/DiagramList.tsx
import { useState } from 'react';
import { SavedDiagram } from '../types';
import { Link } from 'react-router-dom';

interface DiagramListProps {
  diagrams: SavedDiagram[];
  onDelete: (id: string) => void;
}

const DiagramList: React.FC<DiagramListProps> = ({ diagrams, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
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
  
  // Handle deletion confirm/cancel
  const handleDeleteClick = (id: string) => {
    setConfirmDelete(id);
  };
  
  const handleDeleteConfirm = (id: string) => {
    onDelete(id);
    setConfirmDelete(null);
  };
  
  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };
  
  if (diagrams.length === 0) {
    return (
      <div className="text-center py-10">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">No diagrams</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating a new diagram.
        </p>
        <div className="mt-6">
          <Link
            to="/editor"
            className="btn btn-primary"
          >
            New Diagram
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {diagrams.map((diagram) => (
        <div
          key={diagram.id}
          className="card flex flex-col overflow-hidden transition-shadow duration-200 hover:shadow-lg"
        >
          <Link
            to={`/editor/${diagram.id}`}
            className="flex-1 flex flex-col"
          >
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
              {diagram.previewImage ? (
                <img
                  src={diagram.previewImage}
                  alt={diagram.title}
                  className="object-contain h-full w-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="flex-1 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {diagram.title || 'Untitled Diagram'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Updated {formatDate(diagram.updatedAt)}
              </p>
            </div>
          </Link>
          
          <div className="mt-4 flex justify-end border-t border-gray-100 dark:border-dark-border pt-4">
            {confirmDelete === diagram.id ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDeleteConfirm(diagram.id)}
                  className="text-xs px-2 py-1 bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-800/30"
                >
                  Confirm
                </button>
                <button
                  onClick={handleDeleteCancel}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleDeleteClick(diagram.id)}
                className="text-xs px-2 py-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiagramList;