
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, Maximize, RefreshCcw, Scissors, FileText, ShieldCheck, 
  Smartphone, CloudOff, Sparkles, Palette, Laugh, Layers, 
  RotateCw, Type, Grid, Circle, EyeOff, Pipette, Code, 
  Image as ImageIcon, Smartphone as Phone, Ghost, Search,
  ArrowRight, Heart, Star, Layout, Camera, Monitor, Share2, 
  Target, Shield, HardDrive, Cpu, ExternalLink, Filter, 
  Download, Hash, Settings, Brush, Wand2, Contrast, Sun,
  Binary, FileJson, FileCode, Trash2, Focus, ScanLine, 
  History, User, MapPin, Mail, MessageSquare, Music, Video,
  Play, Presentation, Briefcase, ShoppingCart, Tag, BookOpen, Lock
} from 'lucide-react';

const categories = [
  { id: 'popular', name: 'Popular', icon: Star },
  { id: 'local', name: 'Local Tools', icon: HardDrive },
  { id: 'social', name: 'Social Media', icon: Share2 },
  { id: 'convert', name: 'Converters', icon: RefreshCcw },
  { id: 'edit', name: 'Editing', icon: Scissors },
  { id: 'dev', name: 'Developer', icon: Code },
];

const allTools = [
  // POPULAR & LOCAL AI
  { title: 'Local BG Remover', cat: 'local', path: '/remove-bg', icon: Layers, badge: 'KEY-FREE' },
  { title: 'AI Art Studio', cat: 'popular', path: '/ai-generate', icon: Sparkles, badge: 'AI' },
  { title: 'Compress Image', cat: 'popular', path: '/compress', icon: Zap, badge: 'FAST' },
  { title: 'Resize Image', cat: 'popular', path: '/resize', icon: Maximize },
  { title: 'Crop Image', cat: 'popular', path: '/crop', icon: Scissors },
  { title: 'Meme Generator', cat: 'popular', path: '/meme', icon: Laugh },
  { title: 'Image to PDF', cat: 'popular', path: '/pdf', icon: FileText },

  // SOCIAL MEDIA
  { title: 'Instagram Square', cat: 'social', path: '/social/ig-square', icon: Smartphone },
  { title: 'Instagram Story', cat: 'social', path: '/social/ig-story', icon: Smartphone },
  { title: 'YouTube Thumbnail', cat: 'social', path: '/social/yt-thumb', icon: Monitor },
  { title: 'Twitter Header', cat: 'social', path: '/social/tw-header', icon: Layout },
  { title: 'LinkedIn Banner', cat: 'social', path: '/social/li-banner', icon: Briefcase },

  // CONVERTERS
  { title: 'JPG to PNG', cat: 'convert', path: '/convert/jpg-to-png', icon: RefreshCcw },
  { title: 'PNG to JPG', cat: 'convert', path: '/convert/png-to-jpg', icon: RefreshCcw },
  { title: 'WebP to JPG', cat: 'convert', path: '/convert/webp-to-jpg', icon: RefreshCcw },
  { title: 'HEIC to JPG', cat: 'convert', path: '/heic-to-jpg', icon: Phone, badge: 'IPHONE' },
  { title: 'SVG to PNG', cat: 'convert', path: '/svg-to-png', icon: ImageIcon },

  // EDITING
  { title: 'Rotate Image', cat: 'edit', path: '/rotate', icon: RotateCw },
  { title: 'Watermark Tool', cat: 'edit', path: '/watermark', icon: Type },
  { title: 'Corner Rounder', cat: 'edit', path: '/round-corners', icon: Circle },
  { title: 'Pixelate Image', cat: 'edit', path: '/pixelate', icon: Grid },
  { title: 'Blur Image', cat: 'edit', path: '/blur', icon: Ghost },

  // DEVELOPER
  { title: 'Image to Base64', cat: 'dev', path: '/base64', icon: Code },
  { title: 'Color Picker', cat: 'dev', path: '/color-picker', icon: Pipette },
  { title: 'EXIF Stripper', cat: 'dev', path: '/strip-metadata', icon: ShieldCheck },
];

const Home: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');

  const filteredTools = allTools.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCat === 'all' || t.cat === activeCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-16 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Hero Section */}
      <section className="text-center py-20 relative overflow-hidden rounded-[3rem] bg-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-indigo-600/20 to-emerald-600/30"></div>
        <div className="relative z-10 px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 backdrop-blur-md mb-8 text-emerald-400 font-bold text-sm tracking-widest border border-emerald-500/20">
            <Lock className="w-4 h-4" />
            <span>100% CLIENT-SIDE & FREE</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter">
            Toolly.online <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">Pure Local Power.</span>
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Instant, secure, and professional image tools that run entirely in your browser. 
            <span className="text-white font-bold"> No accounts, no uploads, and no API keys required</span> for 99% of our tools.
          </p>

          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-400 transition-colors">
              <Search className="w-6 h-6" />
            </div>
            <input 
              type="text" 
              placeholder="Search tools (e.g. 'Compress', 'iPhone', 'Crop')..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] py-6 pl-16 pr-8 text-xl focus:ring-4 focus:ring-blue-500/30 outline-none transition-all placeholder:text-slate-500"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-3 px-4">
        <button 
          onClick={() => setActiveCat('all')}
          className={`px-6 py-3 rounded-2xl font-bold transition-all border ${activeCat === 'all' ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-blue-400'}`}
        >
          All Tools
        </button>
        {categories.map(c => (
          <button 
            key={c.id}
            onClick={() => setActiveCat(c.id)}
            className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all border ${activeCat === c.id ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-blue-400'}`}
          >
            <c.icon className="w-4 h-4" />
            {c.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4">
        {filteredTools.map((tool, idx) => (
          <Link
            key={idx}
            to={tool.path}
            className="group relative p-6 glass-card rounded-[2.5rem] border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-500/50 flex items-center space-x-4 overflow-hidden"
          >
            <div className={`w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 group-hover:rotate-6`}>
              <tool.icon className="w-7 h-7" />
            </div>
            <div className="flex-grow min-w-0">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-tight group-hover:text-blue-600 transition-colors">{tool.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{tool.cat}</span>
                {tool.badge && (
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${tool.badge === 'KEY-FREE' ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'}`}>
                    {tool.badge}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Trust Bar */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border border-slate-200 dark:border-slate-800 mx-4">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-3xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">100% Privacy</h3>
            <p className="text-slate-500 text-sm">Your files never leave your device. All processing happens locally in your browser memory.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto">
              <CloudOff className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">No API Key Needed</h3>
            <p className="text-slate-500 text-sm">Unlike other tools, Toolly doesn't charge you for processing. It uses your computer's own hardware.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-3xl flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">Instant Results</h3>
            <p className="text-slate-500 text-sm">Since there are no uploads to a server, processing is near-instant even for large files.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
