
import React, { useState, useRef, useEffect } from 'react';
import DropZone from '../components/DropZone';
import { Download, Type, RefreshCw } from 'lucide-react';

const Watermarker: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState('© Toolly.online');
  const [opacity, setOpacity] = useState(30);
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
      ctx.drawImage(img, 0, 0);

      const size = Math.floor(canvas.width / 20);
      ctx.font = `bold ${size}px Inter, sans-serif`;
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity / 100})`;
      ctx.strokeStyle = `rgba(0, 0, 0, ${opacity / 100})`;
      ctx.lineWidth = size / 20;
      ctx.textAlign = 'center';
      
      // Draw watermark in bottom right or center
      ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    };
  }, [image, text, opacity]);

  const download = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.href = canvasRef.current.toDataURL('image/png');
      link.download = 'watermarked.png';
      link.click();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Watermark Image</h1>
        <p className="text-slate-500 dark:text-slate-400">Protect your creative work with custom stamps</p>
      </div>

      {!image ? (
        <DropZone onFilesSelected={handleFilesSelected} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="glass-card p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 flex items-center justify-center min-h-[400px]">
               <canvas ref={canvasRef} className="max-w-full max-h-[500px] object-contain" />
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 h-fit">
            <div className="space-y-4">
              <label className="text-sm font-bold">Watermark Text</label>
              <input 
                type="text" 
                value={text} 
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-4">
              <label className="text-sm font-bold flex justify-between">
                <span>Opacity</span>
                <span>{opacity}%</span>
              </label>
              <input 
                type="range" 
                min="5" max="100" 
                value={opacity} 
                onChange={(e) => setOpacity(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="pt-6 space-y-2">
              <button 
                onClick={download}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> <span>Download</span>
              </button>
              <button onClick={() => setImage(null)} className="w-full py-2 text-slate-400 text-xs font-bold">
                Change Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watermarker;
