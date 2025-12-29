
import React, { useState } from 'react';
import { removeBackground } from '@imgly/background-removal';
import DropZone from '../components/DropZone';
import { Download, Eraser, Loader2, RefreshCw, X, ShieldCheck } from 'lucide-react';

const BackgroundRemover: React.FC = () => {
  const [image, setImage] = useState<{ original: string; processed: string | null; name: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (fileList: FileList) => {
    const file = fileList[0];
    const originalUrl = URL.createObjectURL(file);
    setImage({ original: originalUrl, processed: null, name: file.name });
    setError(null);
    
    // Start processing immediately
    processImage(file);
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    try {
      // Background removal happens entirely in browser
      const blob = await removeBackground(file, {
        progress: (status, progress) => {
          console.debug(`BG Removal: ${status} - ${Math.round(progress * 100)}%`);
        },
      });
      const processedUrl = URL.createObjectURL(blob);
      setImage(prev => prev ? { ...prev, processed: processedUrl } : null);
    } catch (err) {
      console.error(err);
      setError("Failed to process image. Make sure it's a valid format and clear foreground subject.");
    } finally {
      setIsProcessing(false);
    }
  };

  const download = () => {
    if (image?.processed) {
      const link = document.createElement('a');
      link.href = image.processed;
      link.download = `toolly-no-bg-${image.name.split('.')[0]}.png`;
      link.click();
    }
  };

  const reset = () => {
    if (image) {
      URL.revokeObjectURL(image.original);
      if (image.processed) URL.revokeObjectURL(image.processed);
    }
    setImage(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 font-bold text-xs uppercase tracking-widest">
          <Eraser className="w-4 h-4" />
          <span>AI Precision Removal</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Remove Background</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          One-click background removal powered by on-device AI. 100% private, your images never leave your computer.
        </p>
      </div>

      {!image ? (
        <div className="max-w-2xl mx-auto">
          <DropZone onFilesSelected={handleFilesSelected} />
        </div>
      ) : (
        <div className="glass-card p-6 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Original</h3>
              <div className="aspect-square bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <img src={image.original} className="w-full h-full object-contain" alt="Original" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Result</h3>
              <div className="aspect-square bg-checker rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 relative flex items-center justify-center">
                {image.processed ? (
                  <img src={image.processed} className="w-full h-full object-contain animate-in zoom-in duration-300" alt="Processed" />
                ) : (
                  <div className="text-center p-8 space-y-4">
                    {isProcessing ? (
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
                          <Eraser className="absolute inset-0 m-auto w-6 h-6 text-cyan-600 animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-cyan-600 font-bold animate-pulse text-sm">Detecting Foreground...</p>
                          <p className="text-slate-400 text-[10px] italic">First time may take longer to load AI model</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm">Background removal pending...</p>
                    )}
                  </div>
                )}
                {error && (
                   <div className="absolute inset-0 flex items-center justify-center bg-red-50/90 dark:bg-red-950/90 p-6 text-center">
                     <p className="text-red-600 font-bold text-sm">{error}</p>
                   </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-200 dark:border-slate-800">
             <div className="flex items-center space-x-3 text-slate-500">
               <ShieldCheck className="w-5 h-5 text-emerald-500" />
               <span className="text-sm font-medium">Processed locally on your device</span>
             </div>

             <div className="flex items-center space-x-4 w-full md:w-auto">
               <button 
                 onClick={reset}
                 className="flex-1 md:flex-none px-8 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl font-bold transition-all text-slate-700 dark:text-slate-300 flex items-center justify-center space-x-2"
               >
                 <RefreshCw className="w-4 h-4" /> <span>New Image</span>
               </button>
               <button 
                 onClick={download}
                 disabled={!image.processed}
                 className="flex-1 md:flex-none px-12 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center space-x-2"
               >
                 <Download className="w-5 h-5" /> <span>Download PNG</span>
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundRemover;
