
import React, { useState } from 'react';
import DropZone from '../components/DropZone';
import { Download, Code, Copy, Check, RefreshCw } from 'lucide-react';

const Base64Converter: React.FC = () => {
  const [base64, setBase64] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFilesSelected = (fileList: FileList) => {
    const file = fileList[0];
    const reader = new FileReader();
    reader.onload = (e) => setBase64(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const copy = () => {
    if (base64) {
      navigator.clipboard.writeText(base64);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Image to Base64</h1>
        <p className="text-slate-500 dark:text-slate-400">Convert images to data URLs for CSS and HTML</p>
      </div>

      {!base64 ? (
        <DropZone onFilesSelected={handleFilesSelected} />
      ) : (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <Code className="w-5 h-5 text-slate-600" /> Base64 Data String
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={copy}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy String'}
                </button>
                <button onClick={() => setBase64(null)} className="p-2 text-slate-400 hover:text-red-500">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
            <textarea 
              readOnly 
              value={base64}
              className="w-full h-64 bg-slate-900 text-emerald-500 font-mono text-[10px] p-6 rounded-2xl border border-slate-800 focus:outline-none overflow-y-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Base64Converter;
