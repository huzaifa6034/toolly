
import React, { useState, useRef } from 'react';
import DropZone from '../components/DropZone';
import { Pipette, Copy, Check } from 'lucide-react';

const ColorPicker: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#ffffff');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFilesSelected = (fileList: FileList) => {
    const file = fileList[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          setImage(img.src);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const pickColor = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = "#" + ("000000" + ((pixel[0] << 16) | (pixel[1] << 8) | pixel[2]).toString(16)).slice(-6);
    setSelectedColor(hex);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(selectedColor);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Color Picker</h1>
        <p className="text-slate-500 dark:text-slate-400">Extract any hex color code from your images</p>
      </div>

      {!image ? (
        <DropZone onFilesSelected={handleFilesSelected} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-3">
             <div className="glass-card p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900 aspect-video flex items-center justify-center overflow-hidden cursor-crosshair">
                <canvas 
                  ref={canvasRef} 
                  onClick={pickColor}
                  className="max-w-full max-h-full object-contain" 
                />
             </div>
             <p className="text-xs text-slate-400 mt-2 text-center">Click anywhere on the image to sample color</p>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
              <h3 className="font-bold">Sampled Color</h3>
              <div 
                className="w-full h-24 rounded-2xl shadow-inner border border-white/20" 
                style={{ backgroundColor: selectedColor }}
              />
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl flex justify-between items-center">
                  <span className="font-mono font-bold text-lg">{selectedColor.toUpperCase()}</span>
                  <button onClick={copyToClipboard} className="text-slate-400 hover:text-blue-600">
                    {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button 
                onClick={() => setImage(null)}
                className="w-full py-3 text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all"
              >
                New Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
