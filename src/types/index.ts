// src/types/index.ts

export type DiagramType = 
  | 'flowchart' 
  | 'sequenceDiagram' 
  | 'classDiagram' 
  | 'stateDiagram' 
  | 'entityRelationshipDiagram' 
  | 'userJourney' 
  | 'gantt' 
  | 'pieChart' 
  | 'gitGraph';

export interface DiagramTemplate {
  type: DiagramType;
  name: string;
  template: string;
  description: string;
}

export interface SavedDiagram {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  previewImage?: string; // Base64 data URL
}

export type ThemeType = 'light' | 'dark';

export type ExportFormat = 'svg' | 'png';

export interface ExportOptions {
  format: ExportFormat;
  transparent: boolean;
  scale: number;
}