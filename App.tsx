
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

// Lazy load tools for performance
const Compressor = lazy(() => import('./pages/Compressor'));
const Resizer = lazy(() => import('./pages/Resizer'));
const Converter = lazy(() => import('./pages/Converter'));
const Cropper = lazy(() => import('./pages/Cropper'));
const ImageToPdf = lazy(() => import('./pages/ImageToPdf'));
const AIGenerator = lazy(() => import('./pages/AIGenerator'));
const PhotoEditor = lazy(() => import('./pages/PhotoEditor'));
const MemeGenerator = lazy(() => import('./pages/MemeGenerator'));
const BackgroundRemover = lazy(() => import('./pages/BackgroundRemover'));
const Rotater = lazy(() => import('./pages/Rotater'));
const Watermarker = lazy(() => import('./pages/Watermarker'));
const Pixelator = lazy(() => import('./pages/Pixelator'));
const CornerRounder = lazy(() => import('./pages/CornerRounder'));
const MetadataRemover = lazy(() => import('./pages/MetadataRemover'));
const ColorPicker = lazy(() => import('./pages/ColorPicker'));
const Base64Converter = lazy(() => import('./pages/Base64Converter'));
const SVGToPNG = lazy(() => import('./pages/SVGToPNG'));
const HEICToJPG = lazy(() => import('./pages/HEICToJPG'));
const BlurTool = lazy(() => import('./pages/BlurTool'));

// Dynamic Engine
const FormatMaster = lazy(() => import('./pages/FormatMaster'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ai-generate" element={<AIGenerator />} />
              <Route path="/remove-bg" element={<BackgroundRemover />} />
              <Route path="/compress" element={<Compressor />} />
              <Route path="/resize" element={<Resizer />} />
              <Route path="/convert" element={<Converter />} />
              <Route path="/crop" element={<Cropper />} />
              <Route path="/pdf" element={<ImageToPdf />} />
              <Route path="/editor" element={<PhotoEditor />} />
              <Route path="/meme" element={<MemeGenerator />} />
              <Route path="/rotate" element={<Rotater />} />
              <Route path="/watermark" element={<Watermarker />} />
              <Route path="/pixelate" element={<Pixelator />} />
              <Route path="/round-corners" element={<CornerRounder />} />
              <Route path="/strip-metadata" element={<MetadataRemover />} />
              <Route path="/color-picker" element={<ColorPicker />} />
              <Route path="/base64" element={<Base64Converter />} />
              <Route path="/svg-to-png" element={<SVGToPNG />} />
              <Route path="/heic-to-jpg" element={<HEICToJPG />} />
              <Route path="/blur" element={<BlurTool />} />

              {/* DYNAMIC SEO ROUTES FOR 100+ COMBINATIONS */}
              <Route path="/convert/:path" element={<FormatMaster />} />
              <Route path="/social/:path" element={<Resizer />} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
