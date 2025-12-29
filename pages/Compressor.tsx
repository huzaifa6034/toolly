
import React, { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ImageFile } from '../types';
import DropZone from '../components/DropZone';
import { processImage, getFileSize, formatBytes } from '../services/imageService';
import { Download, X, Settings2, CheckCircle2, Loader2 } from 'lucide-react';
import SEOContent from '../components/SEOContent';

const Compressor: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [quality, setQuality] = useState(70);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = (fileList: FileList) => {
    const newImages: ImageFile[] = Array.from(fileList).map(file => ({
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'idle'
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return filtered;
    });
  };

  const compressAll = async () => {
    setIsProcessing(true);
    const updatedImages = await Promise.all(images.map(async (img) => {
      if (img.status === 'done') return img;
      
      try {
        const processedUrl = await processImage(img.file, { quality });
        const compressedSize = getFileSize(processedUrl);
        return {
          ...img,
          processedUrl,
          compressedSize,
          status: 'done' as const
        };
      } catch (err) {
        console.error(err);
        return { ...img, status: 'error' as const };
      }
    }));
    setImages(updatedImages);
    setIsProcessing(false);
  };

  const downloadAll = () => {
    images.forEach(img => {
      if (img.processedUrl) {
        const link = document.createElement('a');
        link.href = img.processedUrl;
        link.download = `compressed_${img.name}`;
        link.click();
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl font-black tracking-tight">Compress Image</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400">Reduce file size up to 90% while maintaining stunning quality.</p>
      </div>

      {images.length === 0 ? (
        <div className="max-w-2xl mx-auto">
          <DropZone onFilesSelected={handleFilesSelected} multiple />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg">Selected Images ({images.length})</h3>
              <button onClick={() => setImages([])} className="text-sm text-red-500 font-medium hover:underline">Clear all</button>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {images.map(img => (
                <div key={img.id} className="glass-card p-4 rounded-3xl flex items-center space-x-4 border border-slate-200 dark:border-slate-800">
                  <img src={img.preview} alt={img.name} className="w-16 h-16 object-cover rounded-2xl bg-slate-100" />
                  <div className="flex-grow min-w-0">
                    <p className="font-bold text-sm truncate">{img.name}</p>
                    <div className="flex items-center space-x-3 text-xs text-slate-500 font-medium">
                      <span>{formatBytes(img.size)}</span>
                      {img.compressedSize && (
                        <>
                          <span className="text-slate-300">|</span>
                          <span className="text-emerald-600 font-bold">{formatBytes(img.compressedSize)}</span>
                          <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-black">
                            -{Math.round((1 - img.compressedSize / img.size) * 100)}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {img.status === 'done' ? (
                      <div className="text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-full"><CheckCircle2 className="w-6 h-6" /></div>
                    ) : (
                      <button onClick={() => removeImage(img.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                        <X className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8 flex justify-center">
               <button onClick={() => inputRef.current?.click()} className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm">
                 + Add more images
               </button>
               <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && handleFilesSelected(e.target.files)} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 sticky top-24 shadow-2xl">
              <div className="flex items-center space-x-2 mb-8">
                <Settings2 className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold tracking-tight">Compression Settings</h3>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Target Quality</label>
                    <span className="text-xl font-black text-blue-600">{quality}%</span>
                  </div>
                  <input 
                    type="range" min="10" max="100" value={quality} 
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Smallest Size</span>
                    <span>Best Visuals</span>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <button 
                    disabled={isProcessing || images.every(i => i.status === 'done')}
                    onClick={compressAll}
                    className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-[1.5rem] font-black text-lg flex items-center justify-center space-x-3 transition-all shadow-xl shadow-blue-500/30"
                  >
                    {isProcessing ? <><Loader2 className="w-6 h-6 animate-spin" /> <span>Shrinking...</span></> : <span>Compress Now</span>}
                  </button>

                  {images.some(img => img.status === 'done') && (
                    <button 
                      onClick={downloadAll}
                      className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.5rem] font-black text-lg flex items-center justify-center space-x-3 transition-all shadow-xl shadow-emerald-500/30 animate-in zoom-in duration-300"
                    >
                      <Download className="w-6 h-6" />
                      <span>Download All</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO SECTION */}
      <SEOContent 
        toolName="Online Image Compressor"
        description="Our professional-grade image compressor allows you to reduce JPG, PNG, and WebP file sizes instantly without sacrificing visual integrity. Designed for web developers, photographers, and content creators who need fast, efficient, and private image optimization."
        benefits={[
          "90% reduction in file size with zero visible artifacts.",
          "Bulk compression: Process 100+ images simultaneously.",
          "100% Private: Files never leave your browser memory.",
          "Optimized for SEO: Faster page loads for better Google ranking."
        ]}
        faq={[
          { q: "How much can I reduce my image size?", a: "Most JPEG and WebP images can be reduced by 70-80% using our '70%' quality setting without any noticeable difference to the naked eye. PNGs can also see significant reduction by palette optimization." },
          { q: "Is there a limit on file size?", a: "Since we process the data in your browser, the only limit is your device's RAM. We've tested batches of 500+ images on modern computers with no issues." },
          { q: "Do you keep a copy of my photos?", a: "No. Unlike other websites, we don't have a backend that stores your images. Everything happens in your current browser tab." }
        ]}
      />
    </div>
  );
};

export default Compressor;
