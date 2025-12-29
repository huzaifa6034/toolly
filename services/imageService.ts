
import { ProcessingOptions } from '../types';

export const processImage = (file: File, options: ProcessingOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (options.width && options.height) {
          width = options.width;
          height = options.height;
        } else if (options.width) {
          const ratio = options.width / img.width;
          width = options.width;
          height = img.height * ratio;
        } else if (options.height) {
          const ratio = options.height / img.height;
          height = options.height;
          width = img.width * ratio;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = options.format || 'image/jpeg';
        const quality = options.quality !== undefined ? options.quality / 100 : 0.8;

        try {
          const dataUrl = canvas.toDataURL(mimeType, quality);
          resolve(dataUrl);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsDataURL(file);
  });
};

export const getFileSize = (dataUrl: string): number => {
  const head = 'data:image/jpeg;base64,';
  return Math.round((dataUrl.length - head.length) * 3 / 4);
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
