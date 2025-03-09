// src/hooks/useDiagramStorage.ts
import { useState, useEffect } from 'react';
import { SavedDiagram } from '../types';

const STORAGE_KEY = 'mermaid-diagrams';

export const useDiagramStorage = () => {
  const [diagrams, setDiagrams] = useState<SavedDiagram[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load diagrams from local storage
  useEffect(() => {
    try {
      const savedDiagrams = localStorage.getItem(STORAGE_KEY);
      if (savedDiagrams) {
        setDiagrams(JSON.parse(savedDiagrams));
      }
    } catch (error) {
      console.error('Error loading diagrams:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save diagrams to local storage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(diagrams));
    }
  }, [diagrams, isLoading]);

  // Save a new diagram or update an existing one
  const saveDiagram = (diagram: Omit<SavedDiagram, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): string => {
    const now = Date.now();
    
    if (diagram.id && diagrams.some(d => d.id === diagram.id)) {
      // Update existing diagram
      setDiagrams(prevDiagrams => 
        prevDiagrams.map(d => 
          d.id === diagram.id 
            ? { 
                ...d, 
                title: diagram.title,
                content: diagram.content,
                updatedAt: now,
                previewImage: diagram.previewImage
              } 
            : d
        )
      );
      return diagram.id;
    } else {
      // Create new diagram
      const newId = `diagram-${now}-${Math.random().toString(36).substring(2, 9)}`;
      const newDiagram: SavedDiagram = {
        id: newId,
        title: diagram.title,
        content: diagram.content,
        createdAt: now,
        updatedAt: now,
        previewImage: diagram.previewImage
      };
      
      setDiagrams(prevDiagrams => [...prevDiagrams, newDiagram]);
      return newId;
    }
  };

  // Get a diagram by ID
  const getDiagram = (id: string): SavedDiagram | undefined => {
    return diagrams.find(d => d.id === id);
  };

  // Delete a diagram by ID
  const deleteDiagram = (id: string): void => {
    setDiagrams(prevDiagrams => prevDiagrams.filter(d => d.id !== id));
  };

  return {
    diagrams,
    isLoading,
    saveDiagram,
    getDiagram,
    deleteDiagram
  };
};