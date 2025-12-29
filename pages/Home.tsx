
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
  Play, Presentation, Briefcase, ShoppingCart, Tag, BookOpen
} from 'lucide-react';

const categories = [
  { id: 'popular', name: 'Popular', icon: Star },
  { id: 'ai', name: 'AI Magic', icon: Sparkles },
  { id: 'social', name: 'Social Media', icon: Share2 },
  { id: 'convert', name: 'Converters', icon: RefreshCcw },
  { id: 'edit', name: 'Editing', icon: Scissors },
  { id: 'dev', name: 'Developer', icon: Code },
  { id: 'privacy', name: 'Security', icon: Shield },
];

const allTools = [
  // POPULAR & AI
  { title: 'AI Art Generator', cat: 'ai', path: '/ai-generate', icon: Sparkles, badge: 'HOT' },
  { title: 'AI Background Remover', cat: 'ai', path: '/remove-bg', icon: Layers, badge: 'NEW' },
  { title: 'AI Image To Text', cat: 'ai', path: '/ai-describe', icon: Type, badge: 'AI' },
  { title: 'AI Photo Enhancer', cat: 'ai', path: '/editor', icon: Wand2, badge: 'PRO' },
  { title: 'Compress Image', cat: 'popular', path: '/compress', icon: Zap },
  { title: 'Resize Image', cat: 'popular', path: '/resize', icon: Maximize },
  { title: 'Crop Image', cat: 'popular', path: '/crop', icon: Scissors },
  { title: 'Meme Generator', cat: 'popular', path: '/meme', icon: Laugh },
  { title: 'Image to PDF', cat: 'popular', path: '/pdf', icon: FileText },

  // SOCIAL MEDIA - INSTAGRAM
  { title: 'Instagram Square (1:1)', cat: 'social', path: '/social/ig-square', icon: Smartphone },
  { title: 'Instagram Portrait (4:5)', cat: 'social', path: '/social/ig-portrait', icon: Smartphone },
  { title: 'Instagram Story Resizer', cat: 'social', path: '/social/ig-story', icon: Smartphone },
  { title: 'Instagram Reels Cover', cat: 'social', path: '/social/ig-reels', icon: Smartphone },
  { title: 'Instagram Profile Maker', cat: 'social', path: '/social/ig-profile', icon: User },

  // SOCIAL MEDIA - YOUTUBE
  { title: 'YouTube Thumbnail Maker', cat: 'social', path: '/social/yt-thumb', icon: Monitor },
  { title: 'YouTube Channel Art', cat: 'social', path: '/social/yt-banner', icon: Layout },
  { title: 'YouTube Profile Resizer', cat: 'social', path: '/social/yt-profile', icon: Play },
  { title: 'YouTube Shorts Cover', cat: 'social', path: '/social/yt-shorts', icon: Phone },

  // SOCIAL MEDIA - FACEBOOK
  { title: 'Facebook Post Resizer', cat: 'social', path: '/social/fb-post', icon: Share2 },
  { title: 'Facebook Cover Photo', cat: 'social', path: '/social/fb-cover', icon: Layout },
  { title: 'Facebook Event Image', cat: 'social', path: '/social/fb-event', icon: Tag },
  { title: 'Facebook Ads Resizer', cat: 'social', path: '/social/fb-ads', icon: Target },

  // SOCIAL MEDIA - OTHERS
  { title: 'Twitter Header Maker', cat: 'social', path: '/social/tw-header', icon: Layout },
  { title: 'Twitter Post Resizer', cat: 'social', path: '/social/tw-post', icon: MessageSquare },
  { title: 'LinkedIn Banner Resizer', cat: 'social', path: '/social/li-banner', icon: Briefcase },
  { title: 'LinkedIn Profile Image', cat: 'social', path: '/social/li-profile', icon: User },
  { title: 'TikTok Video Cover', cat: 'social', path: '/social/tiktok-cover', icon: Smartphone },
  { title: 'Pinterest Pin Maker', cat: 'social', path: '/social/pin-post', icon: Target },
  { title: 'WhatsApp Profile Pic', cat: 'social', path: '/social/wa-profile', icon: MessageSquare },

  // CONVERTERS
  { title: 'JPG to PNG', cat: 'convert', path: '/convert/jpg-to-png', icon: RefreshCcw },
  { title: 'PNG to JPG', cat: 'convert', path: '/convert/png-to-jpg', icon: RefreshCcw },
  { title: 'WebP to JPG', cat: 'convert', path: '/convert/webp-to-jpg', icon: RefreshCcw },
  { title: 'JPG to WebP', cat: 'convert', path: '/convert/jpg-to-webp', icon: RefreshCcw },
  { title: 'PNG to WebP', cat: 'convert', path: '/convert/png-to-webp', icon: RefreshCcw },
  { title: 'WebP to PNG', cat: 'convert', path: '/convert/webp-to-png', icon: RefreshCcw },
  { title: 'SVG to PNG', cat: 'convert', path: '/svg-to-png', icon: ImageIcon },
  { title: 'HEIC to JPG', cat: 'convert', path: '/heic-to-jpg', icon: Phone },
  { title: 'TIFF to JPG', cat: 'convert', path: '/convert/tiff-to-jpg', icon: RefreshCcw },
  { title: 'BMP to PNG', cat: 'convert', path: '/convert/bmp-to-png', icon: RefreshCcw },
  { title: 'GIF to PNG', cat: 'convert', path: '/convert/gif-to-png', icon: RefreshCcw },
  { title: 'ICO to PNG', cat: 'convert', path: '/convert/ico-to-png', icon: RefreshCcw },
  { title: 'PDF to JPG', cat: 'convert', path: '/convert/pdf-to-jpg', icon: FileText },
  { title: 'AVIF to JPG', cat: 'convert', path: '/convert/avif-to-jpg', icon: RefreshCcw },
  { title: 'WebP to GIF', cat: 'convert', path: '/convert/webp-to-gif', icon: RefreshCcw },

  // EDITING & FILTERS
  { title: 'Rotate Image', cat: 'edit', path: '/rotate', icon: RotateCw },
  { title: 'Flip Image', cat: 'edit', path: '/rotate', icon: RefreshCcw },
  { title: 'Watermark Tool', cat: 'edit', path: '/watermark', icon: Type },
  { title: 'Corner Rounder', cat: 'edit', path: '/round-corners', icon: Circle },
  { title: 'Brightness Control', cat: 'edit', path: '/editor', icon: Sun },
  { title: 'Contrast Adjuster', cat: 'edit', path: '/editor', icon: Contrast },
  { title: 'Saturation Tool', cat: 'edit', path: '/editor', icon: Palette },
  { title: 'Blur Image', cat: 'edit', path: '/blur', icon: Ghost },
  { title: 'Grayscale Filter', cat: 'edit', path: '/editor', icon: Filter },
  { title: 'Sepia Effect', cat: 'edit', path: '/editor', icon: Palette },
  { title: 'Vintage Filter', cat: 'edit', path: '/editor', icon: History },
  { title: 'Invert Colors', cat: 'edit', path: '/editor', icon: RefreshCcw },
  { title: 'Image Sharpen', cat: 'edit', path: '/editor', icon: Wand2 },
  { title: 'Vignette Effect', cat: 'edit', path: '/editor', icon: Circle },
  { title: 'Pixelate Image', cat: 'edit', path: '/pixelate', icon: Grid },
  { title: 'Noise Addition', cat: 'edit', path: '/editor', icon: Hash },

  // DEVELOPER TOOLS
  { title: 'Image to Base64', cat: 'dev', path: '/base64', icon: Code },
  { title: 'Base64 to Image', cat: 'dev', path: '/base64', icon: FileCode },
  { title: 'Color Picker', cat: 'dev', path: '/color-picker', icon: Pipette },
  { title: 'CSS Filter Generator', cat: 'dev', path: '/editor', icon: Binary },
  { title: 'Favicon Generator', cat: 'dev', path: '/favicon-gen', icon: Star },
  { title: 'App Icon Resizer', cat: 'dev', path: '/resize', icon: Smartphone },
  { title: 'JSON Metadata Viewer', cat: 'dev', path: '/strip-metadata', icon: FileJson },
  { title: 'Image Placeholder', cat: 'dev', path: '/editor', icon: Layout },
  { title: 'SVG Path Editor', cat: 'dev', path: '/svg-to-png', icon: ScanLine },

  // PRIVACY & SECURITY
  { title: 'EXIF Data Stripper', cat: 'privacy', path: '/strip-metadata', icon: ShieldCheck },
  { title: 'GPS Data Remover', cat: 'privacy', path: '/strip-metadata', icon: MapPin },
  { title: 'Secure Image Blur', cat: 'privacy', path: '/blur', icon: EyeOff },
  { title: 'Private Face Blurring', cat: 'privacy', path: '/blur', icon: User },
  { title: 'Metadata Viewer', cat: 'privacy', path: '/strip-metadata', icon: EyeOff },
  { title: 'Ghost Image Creator', cat: 'privacy', path: '/blur', icon: Ghost },

  // MISC / SPECIFIC UTILS
  { title: 'Resume Photo Resizer', cat: 'popular', path: '/resize', icon: User },
  { title: 'Passport Photo Maker', cat: 'popular', path: '/crop', icon: Camera },
  { title: 'E-commerce Resizer', cat: 'popular', path: '/resize', icon: ShoppingCart },
  { title: 'Banner Ads Resizer', cat: 'popular', path: '/resize', icon: Layout },
  { title: 'Infographic Resizer', cat: 'social', path: '/resize', icon: Presentation },
  { title: 'Book Cover Resizer', cat: 'popular', path: '/resize', icon: BookOpen },
  { title: 'Business Card Maker', cat: 'popular', path: '/resize', icon: Briefcase },
  { title: 'Logo Background Remover', cat: 'ai', path: '/remove-bg', icon: Target },
  { title: 'Photo to Sketch', cat: 'edit', path: '/editor', icon: Brush },
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md mb-8 text-blue-400 font-bold text-sm tracking-widest border border-white/10">
            <Sparkles className="w-4 h-4" />
            <span>THE COMPLETE IMAGE WORKSPACE</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter">
            Toolly.online <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">100+ Free Tools.</span>
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Instant, secure, and professional. Every image tool you'll ever need, running entirely in your browser. No uploads, no limits.
          </p>

          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-400 transition-colors">
              <Search className="w-6 h-6" />
            </div>
            <input 
              type="text" 
              placeholder="Search 100+ tools (e.g. 'HEIC', 'YouTube', 'AI')..."
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
        {filteredTools.length > 0 ? filteredTools.map((tool, idx) => (
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
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${tool.badge === 'HOT' ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}>
                    {tool.badge}
                  </span>
                )}
              </div>
            </div>
          </Link>
        )) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <Ghost className="w-16 h-16 text-slate-300 mx-auto" />
            <h3 className="text-2xl font-bold">No results for "{search}"</h3>
            <button onClick={() => {setSearch(''); setActiveCat('all');}} className="text-blue-600 font-bold hover:underline">Show all 100+ tools</button>
          </div>
        )}
      </section>

      {/* Heavy SEO Content Below Grid */}
      <section className="mt-32 prose prose-slate dark:prose-invert max-w-none border-t border-slate-200 dark:border-slate-800 pt-24 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-5xl font-black mb-8 leading-tight">Professional Image Utilities for toolly.online</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                Toolly.online is the world's most comprehensive browser-based image workspace. Whether you are a social media manager needing to resize for **Instagram**, a developer converting **WebP to PNG**, or an artist generating **AI images**, we have a dedicated tool optimized for your specific needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-blue-50 dark:bg-slate-900 rounded-[2rem] border border-blue-100 dark:border-slate-800">
                <h3 className="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-400">⚡ Client-Side Speed</h3>
                <p className="text-slate-600 dark:text-slate-400">By using advanced WebAssembly and Canvas APIs, Toolly processes your files locally. This results in instant speeds, as you don't have to wait for uploads or downloads to a remote server.</p>
              </div>
              <div className="p-8 bg-emerald-50 dark:bg-slate-900 rounded-[2rem] border border-emerald-100 dark:border-slate-800">
                <h3 className="text-2xl font-bold mb-4 text-emerald-800 dark:text-emerald-400">🔒 Privacy First</h3>
                <p className="text-slate-600 dark:text-slate-400">Your photos stay on your computer. We never see your data, and no images are stored on any server. It is the most secure way to handle sensitive documents and private photos.</p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-3xl font-bold">100+ Tools at Your Fingertips</h3>
              <p>Our toolset is divided into seven core categories to help you navigate the complex world of digital imagery:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0">
                <li className="bg-white