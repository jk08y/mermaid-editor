// src/utils/exportDiagram.ts
import { toPng, toSvg } from 'html-to-image';
import { saveAs } from 'file-saver';
import { ExportOptions } from '../types';

export const exportDiagram = async (
  elementId: string,
  fileName: string,
  options: ExportOptions
): Promise<string | null> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with ID "${elementId}" not found`);
  }

  try {
    let dataUrl: string;
    const exportConfig = {
      backgroundColor: options.transparent ? 'transparent' : 'white',
      pixelRatio: options.scale,
    };

    // Convert to PNG or SVG based on format
    if (options.format === 'png') {
      dataUrl = await toPng(element, exportConfig);
      saveAs(dataUrl, `${fileName}.png`);
    } else {
      dataUrl = await toSvg(element, exportConfig);
      const blob = new Blob([dataUrl], { type: 'image/svg+xml;charset=utf-8' });
      saveAs(blob, `${fileName}.svg`);
    }

    return dataUrl;
  } catch (error) {
    console.error('Error exporting diagram:', error);
    throw error;
  }
};

// Generate a thumbnail preview for a diagram
export const generateThumbnail = async (elementId: string): Promise<string | null> => {
  const element = document.getElementById(elementId);
  if (!element) {
    return null;
  }

  try {
    return await toPng(element, {
      backgroundColor: 'white',
      pixelRatio: 0.5, // Lower resolution for thumbnails
      width: 300,  // Fixed width
      height: 200, // Fixed height
    });
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return null;
  }
};