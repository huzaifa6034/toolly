
import React, { useState, useRef } from 'react';
import DropZone from '../components/DropZone';
import { Download, ImageIcon, RefreshCw, Loader2 } from 'lucide-react';

const SVGToPNG: React.FC = () => {
  const [svg, setSvg] = useState<string | null>(null);
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scale, setScale] = useState(2); // Export multiplier

  const handleFilesSelected = (fileList: FileList) => {
    const file = fileList[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setSvg(content);
      convert(content);
    };
    reader.readAsText(file);
  };

  const convert = (content: string) => {
    setIsProcessing(true);
    const img = new Image();
    const svgBlob = new Blob([content], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setPngUrl(canvas.toDataURL('image/png'));
      }
      setIsProcessing(false);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const download = () => {
    if (pngUrl) {
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = 'vector-raster.png';
      link.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">SVG to PNG</h1>
        <p className="text-slate-500 dark:text-slate-400">Convert vector illustrations to high-res raster PNGs</p>
      </div>

      {!svg ? (
        <DropZone onFilesSelected={handleFilesSelected} accept=".svg" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-10 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[300px] bg-white">
             <div dangerouslySetInnerHTML={{ __html: svg }} className="max-w-full max-h-full" />
          </div>
          
          <div className="space-y-6 py-4">
             <div className="space-y-4">
                <label className="text-sm font-bold flex justify-between">
                  <span>Output Scale (Resolution)</span>
                  <span className="text-orange-600">{scale}x</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 4, 8].map(s => (
                    <button 
                      key={s} 
                      onClick={() => { setScale(s); convert(svg); }}
                      className={`flex-1 py-2 rounded-xl font-bold border transition-all ${scale === s ? 'bg-orange-600 border-orange-600 text-white' : 'border-slate-200 text-slate-400'}`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
             </div>

             <div className="pt-8 space-y-3">
               <button 
                 onClick={download}
                 disabled={isProcessing}
                 className="w-full py-4 bg-orange-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20"
               >
                 {isProcessing ? <Loader2 className="animate-spin" /> : <Download className="w-5 h-5" />}
                 <span>Download PNG</span>
               </button>
               <button onClick={() => setSvg(null)} className="w-full py-2 text-slate-400 text-xs font-bold">
                 Choose New SVG
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SVGToPNG;
