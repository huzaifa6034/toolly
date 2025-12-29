
import React, { useState, useRef, useEffect } from 'react';
import DropZone from '../components/DropZone';
import { Download, Ghost, RefreshCw } from 'lucide-react';

const BlurTool: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [blurAmount, setBlurAmount] = useState(10);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFilesSelected = (fileList: FileList) => {
    const file = fileList[0];
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.filter = `blur(${blurAmount}px)`;
      ctx.drawImage(img, 0, 0);
    };
  }, [image, blurAmount]);

  const download = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.href = canvasRef.current.toDataURL('image/png');
      link.download = 'blurred-image.png';
      link.click();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Blur Image</h1>
        <p className="text-slate-500 dark:text-slate-400">Apply soft focus or hide sensitive details</p>
      </div>

      {!image ? (
        <DropZone onFilesSelected={handleFilesSelected} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-3">
             <div className="glass-card p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900 aspect-video flex items-center justify-center overflow-hidden">
                <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
             </div>
          </div>
          
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 h-fit space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-bold flex justify-between">
                <span>Blur Radius</span>
                <span className="text-blue-600">{blurAmount}px</span>
              </label>
              <input 
                type="range" 
                min="0" max="100" 
                value={blurAmount} 
                onChange={(e) => setBlurAmount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="space-y-2">
              <button 
                onClick={download}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" /> <span>Download</span>
              </button>
              <button 
                onClick={() => setImage(null)}
                className="w-full py-4 border border-slate-200 text-slate-400 font-bold rounded-2xl flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" /> <span>New Image</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlurTool;
