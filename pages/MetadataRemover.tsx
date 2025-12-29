
import React, { useState } from 'react';
import DropZone from '../components/DropZone';
import { Download, EyeOff, ShieldCheck, RefreshCw } from 'lucide-react';

const MetadataRemover: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isStripping, setIsStripping] = useState(false);

  const handleFilesSelected = (fileList: FileList) => {
    const selectedFile = fileList[0];
    setFile(selectedFile);
    setIsStripping(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Drawing to canvas naturally strips all EXIF/Metadata
          ctx.drawImage(img, 0, 0);
          const cleanUrl = canvas.toDataURL('image/jpeg', 0.9);
          setProcessedUrl(cleanUrl);
        }
        setIsStripping(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(selectedFile);
  };

  const download = () => {
    if (processedUrl && file) {
      const link = document.createElement('a');
      link.href = processedUrl;
      link.download = `private_${file.name}`;
      link.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Metadata Remover</h1>
        <p className="text-slate-500 dark:text-slate-400">Remove GPS, camera info, and personal data from photos</p>
      </div>

      {!file ? (
        <DropZone onFilesSelected={handleFilesSelected} />
      ) : (
        <div className="glass-card p-10 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
          <div className="flex flex-col items-center">
            {isStripping ? (
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <div className="space-y-4">
                <ShieldCheck className="w-16 h-16 text-emerald-500 mx-auto" />
                <h3 className="text-2xl font-bold">Privacy Guaranteed</h3>
                <p className="text-slate-500">All EXIF and GPS metadata has been stripped.</p>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4 pt-6">
            <button 
               onClick={() => { setFile(null); setProcessedUrl(null); }}
               className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-xl font-bold flex items-center space-x-2"
             >
               <RefreshCw className="w-4 h-4" /> <span>Another Photo</span>
             </button>
             <button 
               disabled={!processedUrl}
               onClick={download}
               className="px-10 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl font-bold flex items-center space-x-2 shadow-xl"
             >
               <Download className="w-5 h-5" /> <span>Download Clean Image</span>
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetadataRemover;
