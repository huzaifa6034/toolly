
export enum ToolType {
  COMPRESS = 'compress',
  RESIZE = 'resize',
  CONVERT = 'convert',
  CROP = 'crop',
  PDF = 'pdf'
}

export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
  width?: number;
  height?: number;
  compressedSize?: number;
  processedUrl?: string;
  status: 'idle' | 'processing' | 'done' | 'error';
}

export interface ProcessingOptions {
  quality?: number;
  width?: number;
  height?: number;
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
  maintainAspectRatio?: boolean;
}
