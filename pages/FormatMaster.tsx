
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import DropZone from '../components/DropZone';
import { processImage, formatBytes } from '../services/imageService';
import { Download, RefreshCw, Loader2, Check, ArrowRight } from 'lucide-react';
import SEOContent from '../components/SEOContent';

const FormatMaster: React.FC = () => {
  const { path } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Extract from/to from URL like "jpg-to-png"
  const [from, to] = (path || 'image-to-webp').split('-to-');
  const targetFormat = `image/${to === 'jpg' ? 'jpeg' : to}`;

  useEffect(() => {
    // Scroll to top on path change
    window.scrollTo(0,0);
  }, [path]);

  const handleFilesSelected = (fileList: FileList) => {
    const newImages = Array.from(fileList).map(f => ({
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
        const processedUrl = await processImage(img.file, { format: targetFormat as any });
        return { ...img, processedUrl, status: 'done' as const };
      } catch (err) {
        return { ...img, status: 'error' as const };
      }
    }));
    setImages(updated);
    setIsProcessing(false);
  };

  const download = (img: any) => {
    if (img.processedUrl) {
      const ext = to;
      const name = img.name.substring(0, img.name.lastIndexOf('.')) || img.name;
      const link = document.createElement('a');
      link.href = img.processedUrl;
      link.download = `${name}.${ext}`;
      link.click();
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="text-center space-y-6 mb-16">
        <div className="flex items-center justify-center gap-4 text-4xl md:text-6xl font-black uppercase tracking-tighter">
          <span className="text-blue-600">{from}</span>
          <ArrowRight className="w-10 h-10 text-slate-300" />
          <span className="text-emerald-600">{to}</span>
        </div>
        <h1 className="text-3xl font-bold">Convert {from.toUpperCase()} to {to.toUpperCase()} Online</h1>
        <p className="text-slate-500 max-w-xl mx-auto">High-fidelity conversion. Fast, secure, and absolutely free.</p>
      </div>

      {images.length === 0 ? (
        <div className="max-w-2xl mx-auto">
          <DropZone onFilesSelected={handleFilesSelected} multiple />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-6 bg-white dark:bg-slate-900 shadow-xl">
             <div className="space-y-1">
               <h3 className="font-bold text-lg">Batch Process ready</h3>
               <p className="text-sm text-slate-400">{images.length} files selected for conversion</p>
             </div>
             <button 
               onClick={convertAll}
               disabled={isProcessing || images.every(i => i.status === 'done')}
               className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-lg flex items-center space-x-3 transition-all shadow-xl shadow-emerald-500/30 disabled:opacity-50"
             >
               {isProcessing ? <Loader2 className="animate-spin" /> : <RefreshCw className="w-6 h-6" />}
               <span>Start Conversion</span>
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map(img => (
              <div key={img.id} className="glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm">
                <div className="aspect-video bg-checker relative">
                  <img src={img.preview} className="w-full h-full object-cover" />
                  {img.status === 'done' && (
                    <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[2px] flex items-center justify-center">
                       <div className="bg-emerald-500 text-white p-3 rounded-full shadow-2xl scale-110 animate-in zoom-in">
                         <Check className="w-8 h-8" />
                       </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="font-bold truncate mb-1">{img.name}</p>
                  <p className="text-xs text-slate-400 font-bold mb-4 uppercase">{formatBytes(img.size)} • {from} → {to}</p>
                  {img.status === 'done' ? (
                    <button onClick={() => download(img)} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
                      <Download className="w-4 h-4" /> Download {to.toUpperCase()}
                    </button>
                  ) : (
                    <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <SEOContent 
        toolName={`${from.toUpperCase()} to ${to.toUpperCase()} Converter`}
        description={`Convert your ${from.toUpperCase()} files into ${to.toUpperCase()} format seamlessly. Toolly.online utilizes advanced browser-based rasterization to ensure your colors and details are preserved perfectly during the switch.`}
        benefits={[
          `Instant conversion from ${from} to ${to}.`,
          "Preserves transparent backgrounds (if supported).",
          "No software installation needed.",
          "High DPI support for Retina displays."
        ]}
        faq={[
          { q: `Will converting ${from} to ${to} lose quality?`, a: `Converting to ${to.toUpperCase()} (especially PNG or WebP) is generally safe. If you convert to JPG, some compression will occur as it is a lossy format.` },
          { q: "Can I convert multiple files?", a: "Yes, you can upload hundreds of files and our engine will queue them up using your local CPU threads for maximum efficiency." },
          { q: "Is this tool free for commercial use?", a: "Absolutely. Toolly.online is free for all users, including professionals and agencies." }
        ]}
      />
    </div>
  );
};

export default FormatMaster;
