// src/utils/exportDiagram.ts
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
    const svgElement = element.querySelector('svg');
    if (!svgElement) {
      throw new Error('SVG element not found in the diagram');
    }

    // Create a clone of the SVG for export
    const clone = svgElement.cloneNode(true) as SVGElement;
    
    // Reset transform for export
    clone.style.transform = '';
    
    // Set background if not transparent
    if (!options.transparent) {
      clone.style.background = 'white';
    }

    // For PNG export, use canvas
    if (options.format === 'png') {
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Get SVG dimensions
      const svgWidth = svgElement.viewBox.baseVal.width || svgElement.getBoundingClientRect().width;
      const svgHeight = svgElement.viewBox.baseVal.height || svgElement.getBoundingClientRect().height;
      
      // Set canvas dimensions with scaling factor
      canvas.width = svgWidth * options.scale;
      canvas.height = svgHeight * options.scale;
      
      // Draw background if not transparent
      if (!options.transparent) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Convert SVG to data URL
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(clone);
      const svgBlob = new Blob([svgString], {type: 'image/svg+xml'});
      const url = URL.createObjectURL(svgBlob);
      
      // Create image and draw to canvas when loaded
      return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          // Draw image to canvas
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);
          
          try {
            // Convert canvas to PNG data URL
            const pngData = canvas.toDataURL('image/png');
            
            // Create and trigger download
            const a = document.createElement('a');
            a.href = pngData;
            a.download = `${fileName}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            resolve(pngData);
          } catch (err) {
            reject(err);
          }
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to load SVG as image'));
        };
        
        img.src = url;
      });
    } else {
      // SVG export
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(clone);
      const svgBlob = new Blob([svgString], {type: 'image/svg+xml'});
      const url = URL.createObjectURL(svgBlob);
      
      // Create and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Cleanup
      URL.revokeObjectURL(url);
      
      return url;
    }
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
    const svgElement = element.querySelector('svg');
    if (!svgElement) {
      return null;
    }
    
    // Create a clone of the SVG for the thumbnail
    const clone = svgElement.cloneNode(true) as SVGElement;
    
    // Reset transform
    clone.style.transform = '';
    
    // Convert to canvas
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 200;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }
    
    // Draw white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Convert SVG to image
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clone);
    const svgBlob = new Blob([svgString], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(svgBlob);
    
    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate scaling to fit
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        ) * 0.9; // 90% to add some padding
        
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;
        
        // Draw image centered and scaled
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        URL.revokeObjectURL(url);
        
        try {
          const thumbnailUrl = canvas.toDataURL('image/png');
          resolve(thumbnailUrl);
        } catch (error) {
          console.error('Error creating thumbnail:', error);
          resolve(null);
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        console.error('Failed to load SVG as image for thumbnail');
        resolve(null);
      };
      
      img.src = url;
    });
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return null;
  }
};