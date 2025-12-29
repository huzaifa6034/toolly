
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ImageFile } from '../types';
import DropZone from '../components/DropZone';
import { formatBytes } from '../services/imageService';
import { FileText, Download, X, Plus, GripVertical, Settings } from 'lucide-react';

const ImageToPdf: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageSize, setPageSize] = useState<'A4' | 'Original'>('A4');

  const handleFilesSelected = (fileList: FileList) => {
    const newImages: ImageFile[] = Array.from(fileList).map(f => ({
      id: uuidv4(),
      file: f,
      preview: URL.createObjectURL(f),
      name: f.name,
      size: f.size,
      type: f.type,
      status: 'idle'
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const generatePdf = async () => {
    // In a real implementation we would import { jsPDF } from 'jspdf'
    // For this prototype we simulate the long-running generation process
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert("PDF Created! In a real production environment, this uses jsPDF to bundle your images into a single high-quality document.");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Image to PDF</h1>
        <p className="text-slate-500 dark:text-slate-400">Convert JPG, PNG to professional PDF documents</p>
      </div>

      {images.length === 0 ? (
        <DropZone onFilesSelected={handleFilesSelected} multiple />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Document Pages ({images.length})</h3>
              <button 
                onClick={() => setImages([])} 
                className="text-sm text-red-500 font-medium hover:underline"
              >
                Clear all
              </button>
            </div>
            
            <div className="space-y-3">
              {images.map((img, idx) => (
                <div key={img.id} className="glass-card p-4 rounded-2xl flex items-center space-x-4 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 font-bold text-xs w-4">{idx + 1}</span>
                  <GripVertical className="text-slate-300 w-4 h-4 cursor-grab" />
                  <img src={img.preview} className="w-12 h-16 object-cover rounded shadow-sm" />
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-sm truncate">{img.name}</p>
                    <p className="text-xs text-slate-500">{formatBytes(img.size)}</p>
                  </div>
                  <button onClick={() => removeImage(img.id)} className="p-2 text-slate-400 hover:text-red-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              
              <button 
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true;
                  input.accept = 'image/*';
                  input.onchange = (e: any) => e.target.files && handleFilesSelected(e.target.files);
                  input.click();
                }}
                className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center space-x-2 text-slate-400 hover:text-blue-500 hover:border-blue-300 transition-all font-medium"
              >
                <Plus className="w-4 h-4" /> <span>Add More Images</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 sticky top-24 space-y-6">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold">PDF Options</h3>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Page Size</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['A4', 'Original'] as const).map(size => (
                    <button
                      key={size}
                      onClick={() => setPageSize(size)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        pageSize === size 
                        ? 'bg-rose-50 border-rose-200 text-rose-600' 
                        : 'border-slate-100 dark:border-slate-800 text-slate-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={generatePdf}
                  disabled={isProcessing}
                  className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all shadow-xl shadow-rose-500/20"
                >
                  {isProcessing ? 'Generating...' : <><FileText className="w-5 h-5" /> <span>Convert to PDF</span></>}
                </button>
              </div>
              
              <div className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
                Privacy Guaranteed
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageToPdf;
