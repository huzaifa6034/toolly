
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ImageFile } from '../types';
import DropZone from '../components/DropZone';
import { processImage, formatBytes } from '../services/imageService';
import { Download, X, Maximize2, Settings, Loader2 } from 'lucide-react';

const Resizer: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesSelected = (fileList: FileList) => {
    const file = fileList[0]; // Resizer handles one or more, but we'll focus on first for defaults
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const newImages: ImageFile[] = Array.from(fileList).map(f => ({
          id: uuidv4(),
          file: f,
          preview: URL.createObjectURL(f),
          name: f.name,
          size: f.size,
          type: f.type,
          width: img.width,
          height: img.height,
          status: 'idle'
        }));
        setImages(prev => [...prev, ...newImages]);
        if (images.length === 0) {
          setWidth(img.width);
          setHeight(img.height);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (maintainRatio && images.length > 0) {
      const ratio = images[0].width! / images[0].height!;
      setHeight(Math.round(val / ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (maintainRatio && images.length > 0) {
      const ratio = images[0].width! / images[0].height!;
      setWidth(Math.round(val * ratio));
    }
  };

  const resizeAll = async () => {
    setIsProcessing(true);
    const updated = await Promise.all(images.map(async (img) => {
      try {
        const processedUrl = await processImage(img.file, { width, height });
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
      const link = document.createElement('a');
      link.href = img.processedUrl;
      link.download = `resized_${img.name}`;
      link.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Resize Image</h1>
        <p className="text-slate-500 dark:text-slate-400">Perfect dimensions for every platform</p>
      </div>

      {images.length === 0 ? (
        <DropZone onFilesSelected={handleFilesSelected} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center">
              <Settings className="w-5 h-5 mr-2" /> Resize Options
            </h3>
            <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Width (px)</label>
                  <input 
                    type="number" 
                    value={width} 
                    onChange={(e) => handleWidthChange(parseInt(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Height (px)</label>
                  <input 
                    type="number" 
                    value={height} 
                    onChange={(e) => handleHeightChange(parseInt(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
              </div>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={maintainRatio} 
                  onChange={(e) => setMaintainRatio(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">Maintain Aspect Ratio</span>
              </label>

              <button 
                onClick={resizeAll}
                disabled={isProcessing}
                className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all shadow-xl shadow-purple-500/20"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Maximize2 className="w-5 h-5" /> <span>Resize Now</span></>}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg">Preview</h3>
            <div className="glass-card p-4 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center">
              <div className="relative group w-full aspect-square bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
                {images[0].status === 'done' ? (
                   <img src={images[0].processedUrl} className="max-w-full max-h-full object-contain" />
                ) : (
                   <img src={images[0].preview} className="max-w-full max-h-full object-contain opacity-60" />
                )}
                
                {images[0].status === 'done' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => download(images[0])}
                      className="bg-white text-black px-6 py-2 rounded-full font-bold flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" /> <span>Download</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-4 w-full flex justify-between items-center px-2">
                <div>
                  <p className="text-sm font-bold truncate max-w-[150px]">{images[0].name}</p>
                  <p className="text-xs text-slate-500">{images[0].width} x {images[0].height} original</p>
                </div>
                <button onClick={() => setImages([])} className="p-2 text-slate-400 hover:text-red-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resizer;
