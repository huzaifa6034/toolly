
import React from 'react';
import { Heart, Globe, Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-white dark:bg-slate-900 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4 gradient-text">Toolly.online</h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm">
              The ultimate toolkit for your digital images. Fast, free, and secure client-side processing. 
              Your privacy matters - files never leave your computer.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-slate-900 dark:text-white">AI Tools</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm font-medium">
              <li><a href="#/ai-generate" className="hover:text-indigo-600 transition-colors">AI Art Studio</a></li>
              <li><a href="#/remove-bg" className="hover:text-cyan-600 transition-colors">AI BG Remover</a></li>
              <li><a href="#/editor" className="hover:text-pink-600 transition-colors">Photo Enhancer</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-slate-900 dark:text-white">Classic Tools</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm font-medium">
              <li><a href="#/compress" className="hover:text-blue-600 transition-colors">Compress Image</a></li>
              <li><a href="#/resize" className="hover:text-blue-600 transition-colors">Resize Image</a></li>
              <li><a href="#/convert" className="hover:text-blue-600 transition-colors">Convert Image</a></li>
              <li><a href="#/pdf" className="hover:text-rose-600 transition-colors">Image to PDF</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
          <div className="flex items-center space-x-1 mb-4 md:mb-0">
            <span>© 2024 Toolly.online. Built with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>for the web.</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors"><Globe className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
