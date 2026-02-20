import React, { useState } from 'react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  // Note: We keep this prop to avoid errors in App.tsx, 
  // even though we are linking to Substack now.
  onConsultClick: () => void; 
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, onConsultClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems: { id: AppView; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'publications', label: 'Projects & Publications' },
    { id: 'artwork', label: 'Artwork' },
    { id: 'photography', label: 'Photography' },
  ];

  const handleNav = (view: AppView) => {
    setView(view);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#fcfcfb]/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between h-20 items-center">
          {/* Logo / Home Link */}
          <button onClick={() => setView('home')} className="flex flex-col group">
            <span className="text-lg font-black text-slate-900 tracking-tighter leading-none uppercase">MAX MANWARING MUELLER</span>
          </button>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6 mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`hover:text-slate-900 transition-colors ${currentView === item.id ? 'text-slate-900' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            {/* Desktop Substack Link */}
            <a
              href="https://maxnoblemm.substack.com/?utm_campaign=profile_chips"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 border border-slate-900 text-[9px] mono font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all inline-block"
            >
              Substack
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col space-y-1 z-[110]"
          >
            <span className={`w-6 h-0.5 bg-slate-900 transition-transform ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-slate-900 transition-opacity ${isOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-slate-900 transition-transform ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay - Only visible when isOpen is true */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#fcfcfb] z-[105] md:hidden pt-32 px-6 h-screen overflow-y-auto">
          <div className="flex flex-col space-y-8">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`text-5xl font-black uppercase tracking-tighter text-left ${
                  currentView === item.id ? 'text-[#dfb23c]' : 'text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Mobile Substack Link (At the bottom of the list) */}
            <div className="pt-8 border-t border-slate-100">
                <a
                  href="https://maxnoblemm.substack.com/?utm_campaign=profile_chips"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-6 bg-slate-900 text-white font-bold uppercase tracking-widest text-sm text-center"
                >
                  Visit Substack
                </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;