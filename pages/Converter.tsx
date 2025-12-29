
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ImageFile } from '../types';
import DropZone from '../components/DropZone';
import { processImage, formatBytes } from '../services/imageService';
import { Download, RefreshCw, Loader2, Check } from 'lucide-react';

const Converter: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/webp');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesSelected = (fileList: FileList) => {
    const newImages: ImageFile[] = Array.from(fileList).map(f => ({
      id: uuidv4(),
      file: f,
      preview: URL.createObjectURL(f),
      name: f.name,
      size: f.size,
      type: f.type,
      status: 'idle'
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const convertAll = async () => {
    setIsProcessing(true);
    const updated = await Promise.all(images.map(async (img) => {
      try {
        const processedUrl = await processImage(img.file, { format: targetFormat });
        return { ...img, processedUrl, status: 'done' as const };
      } catch (err) {
        return { ...img, status: 'error' as const };
      }
    }));
    setImages(updated);
    setIsProcessing(false);
  };

  const download = (img: ImageFile) => {
    if (img.processedUrl) {
      const ext = targetFormat.split('/')[1];
      const name = img.name.substring(0, img.name.lastIndexOf('.')) || img.name;
      const link = document.createElement('a');
      link.href = img.processedUrl;
      link.download = `${name}.${ext}`;
      link.click();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Convert Image</h1>
        <p className="text-slate-500 dark:text-slate-400">Fast format switching: JPEG, PNG, WEBP</p>
      </div>

      {images.length === 0 ? (
        <DropZone onFilesSelected={handleFilesSelected} multiple />
      ) : (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-bold text-slate-500">Convert to:</span>
              <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                {(['image/jpeg', 'image/png', 'image/webp'] as const).map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setTargetFormat(fmt)}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                      targetFormat === fmt 
                      ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {fmt.split('/')[1].toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              onClick={convertAll}
              disabled={isProcessing || images.every(i => i.status === 'done')}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><RefreshCw className="w-5 h-5" /> <span>Convert All</span></>}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map(img => (
              <div key={img.id} className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col h-full">
                <div className="aspect-video bg-slate-50 dark:bg-slate-900 relative">
                  <img src={img.preview} className="w-full h-full object-cover" />
                  {img.status === 'done' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                       <div className="bg-emerald-500 text-white p-3 rounded-full shadow-lg">
                         <Check className="w-6 h-6" />
                       </div>
                    </div>
                  )}
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div className="mb-4">
                    <p className="font-bold text-sm truncate mb-1">{img.name}</p>
                    <p className="text-xs text-slate-500">{formatBytes(img.size)} • {img.type.split('/')[1].toUpperCase()}</p>
                  </div>
                  {img.status === 'done' ? (
                    <button 
                      onClick={() => download(img)}
                      className="w-full py-2 bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-bold flex items-center justify-center space-x-2 hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <Download className="w-4 h-4" /> <span>Download</span>
                    </button>
                  ) : (
                    <div className="h-9" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Converter;
