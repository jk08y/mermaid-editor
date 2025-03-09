// src/pages/SavedDiagrams.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import DiagramList from '../components/DiagramList';
import { useDiagramStorage } from '../hooks/useDiagramStorage';

const SavedDiagrams: React.FC = () => {
  const { diagrams, isLoading, deleteDiagram } = useDiagramStorage();
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter diagrams by search term
  const filteredDiagrams = diagrams.filter(
    (diagram) => diagram.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort diagrams
  const sortedDiagrams = [...filteredDiagrams].sort((a, b) => {
    if (sortOrder === 'newest') {
      return b.updatedAt - a.updatedAt;
    } else if (sortOrder === 'oldest') {
      return a.updatedAt - b.updatedAt;
    } else {
      // sort by name
      return a.title.localeCompare(b.title);
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Diagrams</h1>
        <Link to="/editor" className="mt-4 md:mt-0 btn btn-primary">
          Create New Diagram
        </Link>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search diagrams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
        <div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="input"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Diagrams list */}
      <div className="mb-10">
        <DiagramList diagrams={sortedDiagrams} onDelete={deleteDiagram} />
      </div>

      {/* Empty state */}
      {diagrams.length > 0 && filteredDiagrams.length === 0 && (
        <div className="text-center py-10">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">No results found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try different search terms or clear the search.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setSearchTerm('')}
              className="btn btn-secondary"
            >
              Clear Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedDiagrams;