
import React, { useState, useRef, useEffect } from 'react';
import DropZone from '../components/DropZone';
import { Download, RotateCw, RefreshCw, FlipHorizontal, FlipVertical } from 'lucide-react';

const Rotater: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
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
      const is90 = rotation % 180 !== 0;
      canvas.width = is90 ? img.height : img.width;
      canvas.height = is90 ? img.width : img.height;
      
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
    };
  }, [image, rotation, flipX, flipY]);

  const download = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.href = canvasRef.current.toDataURL('image/png');
      link.download = 'rotated-image.png';
      link.click();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Rotate & Flip</h1>
        <p className="text-slate-500 dark:text-slate-400">Fix image orientation or mirror images instantly</p>
      </div>

      {!image ? (
        <DropZone onFilesSelected={handleFilesSelected} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-3">
             <div className="glass-card p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-checker flex items-center justify-center min-h-[500px]">
                <canvas ref={canvasRef} className="max-w-full max-h-[500px] object-contain shadow-2xl" />
             </div>
          </div>
          
          <div className="space-y-4">
            <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
              <h3 className="font-bold">Transformation</h3>
              
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => setRotation(r => (r + 90) % 360)}
                  className="w-full py-3 bg-blue-50 text-blue-600 dark:bg-slate-900 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <RotateCw className="w-4 h-4" /> <span>Rotate 90°</span>
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setFlipX(!flipX)}
                    className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${flipX ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 dark:bg-slate-900'}`}
                  >
                    <FlipHorizontal className="w-4 h-4" /> <span>X</span>
                  </button>
                  <button 
                    onClick={() => setFlipY(!flipY)}
                    className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${flipY ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 dark:bg-slate-900'}`}
                  >
                    <FlipVertical className="w-4 h-4" /> <span>Y</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <button 
                  onClick={download}
                  className="w-full py-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" /> <span>Download</span>
                </button>
                <button onClick={() => setImage(null)} className="w-full py-2 text-slate-400 text-xs font-bold">
                  New Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rotater;
