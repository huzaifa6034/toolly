
import React, { useState, useRef, useEffect } from 'react';
import DropZone from '../components/DropZone';
import { Download, Laugh, Type, RefreshCcw } from 'lucide-react';

const MemeGenerator: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [topText, setTopText] = useState('TOP TEXT');
  const [bottomText, setBottomText] = useState('BOTTOM TEXT');
  const [fontSize, setFontSize] = useState(40);
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

      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = Math.floor(canvas.width / 100);
      ctx.textAlign = 'center';
      ctx.font = `bold ${fontSize * (canvas.width / 500)}px Impact, Arial`;
      
      // Top text
      ctx.textBaseline = 'top';
      ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 20);
      ctx.fillText(topText.toUpperCase(), canvas.width / 2, 20);

      // Bottom text
      ctx.textBaseline = 'bottom';
      ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
      ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
    };
  }, [image, topText, bottomText, fontSize]);

  const download = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `toolly-meme-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Meme Generator</h1>
        <p className="text-slate-500 dark:text-slate-400">Create the next viral sensation in seconds</p>
      </div>

      {!image ? (
        <div className="max-w-2xl mx-auto">
          <DropZone onFilesSelected={handleFilesSelected} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
             <div className="glass-card p-4 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl">
                <canvas ref={canvasRef} className="w-full h-auto rounded-2xl" />
             </div>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-6 h-6 text-yellow-500" />
              <h3 className="text-xl font-bold">Meme Settings</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">Top Text</label>
                <input 
                  type="text" 
                  value={topText} 
                  onChange={(e) => setTopText(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">Bottom Text</label>
                <input 
                  type="text" 
                  value={bottomText} 
                  onChange={(e) => setBottomText(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none" 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-bold text-slate-500">Font Size</label>
                  <span className="text-xs font-bold text-yellow-600">{fontSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="100" 
                  value={fontSize} 
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                />
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <button 
                onClick={download}
                className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-xl shadow-yellow-500/20"
              >
                <Download className="w-5 h-5" /> <span>Download Meme</span>
              </button>
              <button 
                onClick={() => setImage(null)}
                className="w-full py-4 border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 rounded-2xl font-bold transition-all flex items-center justify-center space-x-2"
              >
                <RefreshCcw className="w-4 h-4" /> <span>Choose New Image</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemeGenerator;
