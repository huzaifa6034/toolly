
import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface DropZoneProps {
  onFilesSelected: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({ onFilesSelected, accept = "image/*", multiple = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        relative w-full border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300
        ${isDragging 
          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 scale-[0.99]' 
          : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'}
      `}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
      />
      
      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mb-4">
        <Upload className="w-8 h-8" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100">
        Drag & Drop your images here
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-center max-w-xs mb-6">
        Or click to browse from your device
      </p>
      
      <div className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30">
        <ImageIcon className="w-4 h-4" />
        <span>Select Images</span>
      </div>
      
      <p className="mt-4 text-xs text-slate-400 font-medium">
        Supports JPG, PNG, WEBP, SVG
      </p>
    </div>
  );
};

export default DropZone;
