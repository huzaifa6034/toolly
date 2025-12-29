
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Image as ImageIcon, Menu, X, Sparkles, Layers } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'AI Generator', path: '/ai-generate', icon: Sparkles },
    { name: 'Remove BG', path: '/remove-bg', icon: Layers },
    { name: 'Compress', path: '/compress' },
    { name: 'Resize', path: '/resize' },
    { name: 'Convert', path: '/convert' },
    { name: 'Crop', path: '/crop' },
    { name: 'PDF', path: '/pdf' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-card border-b bg-white/70 dark:bg-slate-900/70">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <ImageIcon className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight gradient-text">Toolly.online</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-blue-600 flex items-center gap-1.5 ${
                location.pathname === link.path ? 'text-blue-600 font-bold' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {link.icon && <link.icon className="w-3.5 h-3.5" />}
              {link.name}
            </Link>
          ))}
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-600 dark:text-slate-400"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 glass-card bg-white dark:bg-slate-900 border-b animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                  location.pathname === link.path ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {link.icon && <link.icon className="w-5 h-5" />}
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
