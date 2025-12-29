
import React, { useState, useRef, useEffect } from 'react';
import DropZone from '../components/DropZone';
import { Download, Circle, RefreshCw } from 'lucide-react';

const CornerRounder: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [radius, setRadius] = useState(50);
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const r = Math.min(radius, canvas.width / 2, canvas.height / 2);
      
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(canvas.width - r, 0);
      ctx.quadraticCurveTo(canvas.width, 0, canvas.width, r);
      ctx.lineTo(canvas.width, canvas.height - r);
      ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - r, canvas.height);
      ctx.lineTo(r, canvas.height);
      ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.clip();
      
      ctx.drawImage(img, 0, 0);
    };
  }, [image, radius]);

  const download = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.href = canvasRef.current.toDataURL('image/png');
      link.download = 'rounded-corners.png';
      link.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Corner Rounder</h1>
        <p className="text-slate-500 dark:text-slate-400">Create smooth, rounded-corner assets for your UI</p>
      </div>

      {!image ? (
        <DropZone onFilesSelected={handleFilesSelected} />
      ) : (
        <div className="space-y-8">
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-checker flex items-center justify-center min-h-[400px]">
             <canvas ref={canvasRef} className="max-w-full max-h-full object-contain shadow-2xl" />
          </div>
          
          <div className="max-w-xl mx-auto space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-bold flex justify-between">
                <span>Corner Radius</span>
                <span className="text-emerald-600">{radius}px</span>
              </label>
              <input 
                type="range" 
                min="0" max="500" 
                value={radius} 
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            <div className="flex gap-4">
              <button 
                onClick={download}
                className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" /> <span>Download PNG</span>
              </button>
              <button 
                onClick={() => setImage(null)}
                className="px-8 py-4 border border-slate-200 text-slate-400 font-bold rounded-2xl flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CornerRounder;
