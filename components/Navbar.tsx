import React, { useState } from 'react';

interface NavbarProps {
  onPubsClick: () => void;
  onArtClick: () => void;
  onPhotoClick: () => void;
  onVideoClick: () => void;
  onAboutClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onPubsClick, onArtClick, onPhotoClick, onVideoClick, onAboutClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Updated to match your exact requested order
  const menuItems = [
    { label: 'Publications & Projects', action: onPubsClick },
    { label: 'Scientific Artwork', action: onArtClick },
    { label: 'Photography', action: onPhotoClick },
    { label: 'Videography', action: onVideoClick },
    { label: 'About Me', action: onAboutClick },
  ];

  const handleNav = (action: () => void) => {
    action();
    setIsOpen(false); 
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#fcfcfb]/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between h-20 items-center">
          <button onClick={() => handleNav(onPubsClick)} className="flex flex-col group text-left">
            <span className="text-lg font-black text-slate-900 tracking-tighter leading-none uppercase">
              MAX MANWARING MUELLER
            </span>
          </button>

          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6 mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {menuItems.map(item => (
                <button key={item.label} onClick={() => handleNav(item.action)} className="hover:text-slate-900 transition-colors">
                  {item.label}
                </button>
              ))}
            </div>
            
            <a href="https://maxnoblemm.substack.com/?utm_campaign=profile_chips" target="_blank" rel="noopener noreferrer" className="px-5 py-2 border border-slate-900 text-[9px] mono font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all inline-block">
              Substack
            </a>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden flex flex-col space-y-1 z-[110]">
            <span className={`w-6 h-0.5 bg-slate-900 transition-transform ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-slate-900 transition-opacity ${isOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-slate-900 transition-transform ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-[#fcfcfb] z-[105] md:hidden pt-32 px-6 h-screen">
          <div className="flex flex-col space-y-8">
            {menuItems.map(item => (
              <button key={item.label} onClick={() => handleNav(item.action)} className="text-3xl font-black uppercase tracking-tighter text-left text-slate-900">
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;