
import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import DropZone from '../components/DropZone';
import { Download, Sliders, Palette, RefreshCw, X } from 'lucide-react';

const PhotoEditor: React.FC = () => {
  const [image, setImage] = useState<{ preview: string; name: string } | null>(null);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    blur: 0,
    hue: 0,
    sepia: 0,
    grayscale: 0
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFilesSelected = (fileList: FileList) => {
    const file = fileList[0];
    setImage({
      preview: URL.createObjectURL(file),
      name: file.name
    });
  };

  const handleReset = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturate: 100,
      blur: 0,
      hue: 0,
      sepia: 0,
      grayscale: 0
    });
  };

  const download = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = image.preview;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) blur(${filters.blur}px) hue-rotate(${filters.hue}deg) sepia(${filters.sepia}%) grayscale(${filters.grayscale}%)`;
        ctx.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.download = `enhanced_${image.name}`;
        link.click();
      }
    };
  };

  const filterStyle = {
    filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) blur(${filters.blur}px) hue-rotate(${filters.hue}deg) sepia(${filters.sepia}%) grayscale(${filters.grayscale}%)`
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Photo Enhancer</h1>
        <p className="text-slate-500 dark:text-slate-400">Professional color grading and artistic filters</p>
      </div>

      {!image ? (
        <div className="max-w-2xl mx-auto">
          <DropZone onFilesSelected={handleFilesSelected} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="glass-card p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 aspect-video flex items-center justify-center relative overflow-hidden group shadow-2xl">
              <img src={image.preview} style={filterStyle} className="max-w-full max-h-full object-contain transition-all duration-300" />
              <button onClick={() => setImage(null)} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 sticky top-24 space-y-8 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2"><Sliders className="w-5 h-5 text-pink-500" /> Adjustments</h3>
                <button onClick={handleReset} className="text-xs font-bold text-pink-500 hover:underline">Reset</button>
              </div>

              <div className="space-y-6">
                {Object.entries(filters).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                      <span>{key}</span>
                      <span>{value}{key === 'blur' ? 'px' : key === 'hue' ? '°' : '%'}</span>
                    </div>
                    <input
                      type="range"
                      min={key === 'blur' || key === 'sepia' || key === 'grayscale' ? 0 : 0}
                      max={key === 'blur' ? 20 : key === 'hue' ? 360 : 200}
                      value={value}
                      onChange={(e) => setFilters(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>
                ))}
              </div>

              <button 
                onClick={download}
                className="w-full py-4 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all shadow-xl shadow-pink-500/20"
              >
                <Download className="w-5 h-5" /> <span>Download Result</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoEditor;
