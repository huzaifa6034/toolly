
import React, { useState } from 'react';
import heic2any from 'heic2any';
import DropZone from '../components/DropZone';
import { Download, Smartphone, Loader2, RefreshCw, CheckCircle } from 'lucide-react';

const HEICToJPG: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesSelected = async (fileList: FileList) => {
    const selectedFile = fileList[0];
    setFile(selectedFile);
    setIsProcessing(true);
    
    try {
      const blob = await heic2any({
        blob: selectedFile,
        toType: "image/jpeg",
        quality: 0.8
      });
      
      const url = URL.createObjectURL(Array.isArray(blob) ? blob[0] : blob);
      setProcessedUrl(url);
    } catch (err) {
      console.error(err);
      alert("Error converting HEIC. Ensure it's a valid Apple HEIC file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const download = () => {
    if (processedUrl && file) {
      const link = document.createElement('a');
      link.href = processedUrl;
      link.download = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
      link.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">HEIC to JPG</h1>
        <p className="text-slate-500 dark:text-slate-400">Convert iPhone HEIC photos to standard JPG instantly</p>
      </div>

      {!file ? (
        <DropZone onFilesSelected={handleFilesSelected} accept=".heic" />
      ) : (
        <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
          <div className="flex flex-col items-center">
            {isProcessing ? (
              <div className="space-y-4">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
                <p className="font-bold">Converting HEIC...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
                <p className="font-bold text-xl">Ready to download!</p>
                <div className="aspect-square w-48 bg-slate-100 rounded-2xl overflow-hidden mx-auto shadow-inner">
                  <img src={processedUrl!} className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4">
             <button 
               onClick={() => { setFile(null); setProcessedUrl(null); }}
               className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl font-bold flex items-center space-x-2"
             >
               <RefreshCw className="w-4 h-4" /> <span>Another File</span>
             </button>
             <button 
               disabled={!processedUrl}
               onClick={download}
               className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center space-x-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
             >
               <Download className="w-5 h-5" /> <span>Download JPG</span>
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HEICToJPG;
