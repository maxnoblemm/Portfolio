
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ConsultationModal from './components/ConsultationModal';
import { PROJECTS, ART_WORKS, PHOTOGRAPHY, BIO } from './constants';
import { AppView, Photography } from './types';

const ProjectCard = ({ project }: { project: any }) => (
  <div className="space-y-6 group">
    <div className="aspect-[3/4] overflow-hidden bg-slate-100 border border-slate-200">
      <img 
        src={project.image} 
        alt={project.title} 
        className="w-full h-full object-cover filter contrast-125 grayscale hover:grayscale-0 transition-all duration-700" 
      />
    </div>
    <div className="space-y-3">
      <p className="mono text-[9px] font-bold text-[#dfb23c] uppercase">{project.type}</p>
      <h3 className="text-xl font-bold tracking-tight">{project.title}</h3>
      <p className="text-slate-500 text-sm font-light leading-relaxed">{project.description}</p>
      <div className="flex flex-wrap gap-2 pt-2">
        {project.tags.map(t => (
          <span key={t} className="px-2 py-1 bg-slate-50 text-[8px] mono font-bold text-slate-400 uppercase">
            {t}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const DataArtBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-[0.12]">
      <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <g transform={`translate(${mousePos.x * 0.01}, ${mousePos.y * 0.01})`}>
          <path d="M100,200 L150,250 L120,300 Z" fill="none" stroke="#dfb23c" strokeWidth="0.5" className="animate-slow-float" />
          <circle cx="100" cy="200" r="1.5" fill="#dfb23c" />
          <circle cx="150" cy="250" r="1.5" fill="#dfb23c" />
          <circle cx="120" cy="300" r="1.5" fill="#dfb23c" />
        </g>
        <g transform={`translate(${800 + mousePos.x * -0.005}, ${100 + mousePos.y * 0.005})`}>
          <path d="M0,0 H40 V25 H80 V60 H120 V100" fill="none" stroke="#2d5a27" strokeWidth="0.5" />
          <text x="130" y="110" className="mono" fontSize="7" fill="#2d5a27">P {"<"} 0.01</text>
        </g>
      </svg>
      <style>{`
        @keyframes slowFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-slow-float {
          animation: slowFloat 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

const PhotographyGallery = ({ photos }: { photos: Photography[] }) => {
  const [shuffledPhotos, setShuffledPhotos] = useState<Photography[]>([]);
  const [activePhoto, setActivePhoto] = useState<Photography | null>(null);

  useEffect(() => {
    // Shuffle the array only once when the gallery is first mounted
    const shuffled = [...photos].sort(() => Math.random() - 0.5);
    setShuffledPhotos(shuffled);
    setActivePhoto(shuffled[0]);
  }, [photos]);

  if (!activePhoto) return null;

  return (
    <div className="pt-32 pb-40 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <h2 className="text-6xl font-black tracking-tighter uppercase">Photography</h2>
        </div>

        {/* Hero Image (Blown up) */}
        <div className="w-full h-[65vh] bg-slate-100 border border-slate-200 overflow-hidden shadow-sm">
          <img 
            src={activePhoto.image} 
            alt="Selected view" 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Thumbnails (Taking turns) */}
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {shuffledPhotos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className={`aspect-square overflow-hidden border-2 transition-all duration-300 ${
                activePhoto.id === photo.id 
                  ? 'border-[#dfb23c] scale-105 shadow-md opacity-100' 
                  : 'border-transparent hover:border-slate-300 opacity-60 hover:opacity-100'
              }`}
            >
              <img 
                src={photo.image} 
                alt="Thumbnail" 
                className="w-full h-full object-cover" 
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderContent = () => {
    switch (view) {
      case 'home':
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Narrative Content */}
      <section className="flex-1 flex items-start pt-32 md:pt-48 pb-20 px-6 md:px-20 bg-[#fcfcfb]">
        <div className="max-w-2xl space-y-12">
          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-6xl lg:text-7xl font-black text-slate-900 leading-[1] tracking-tighter">
              Analysis as the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dfb23c] to-[#5c8ca1]">
                foundation.
              </span>
            </h1>
          </div>

          {/* Vision Section */}
          <div className="space-y-8 text-lg text-slate-600 font-light leading-relaxed whitespace-pre-line">
            {BIO.visionText}
          </div>

          {/* Purpose Section with Styled Heading */}
          <div className="space-y-6 pt-4 border-t border-slate-100">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
              Purpose of this Site
            </h3>
            <div className="text-lg text-slate-600 font-light leading-relaxed whitespace-pre-line">
              {BIO.purposeText}
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="pt-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-10 py-5 bg-slate-900 text-white font-bold tracking-tight hover:bg-slate-800 transition-all uppercase text-xs"
            >
              Substack
            </button>
          </div>
        </div>
      </section>

      {/* Right Side: Profile Image */}
      <div className="w-full md:w-1/3 lg:w-[35%] h-[60vh] md:h-screen md:sticky top-0">
        <img 
          src={BIO.image} 
          alt={BIO.name} 
          className="w-full h-full object-cover object-top pt-12 md:pt-0" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fcfcfb] to-transparent opacity-10 md:hidden" />
      </div>
    </div>
  );
      case 'artwork':
        return (
          <div className="pt-40 pb-40 px-6 bg-[#f8f8f7]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-6xl font-black tracking-tighter uppercase mb-24">Cover Art</h2>
              <div className="grid md:grid-cols-3 gap-10">
                {/* CONSISTENT DATA: Mapping over ART_WORKS imported from constants */}
                {ART_WORKS.map((art) => (
                  <div key={art.id} className="group cursor-crosshair">
                    <div className="aspect-[3/4] overflow-hidden bg-slate-200 border border-slate-300">
                      <img src={art.image} alt={art.title} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" />
                    </div>
                    <div className="mt-6">
                      <h4 className="text-lg font-bold tracking-tight">{art.title}</h4>
                      <p className="text-[10px] mono text-slate-400 uppercase mt-1">{art.client}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
  
        case 'publications': {
          const currentProjects = PROJECTS.filter(p => p.type === 'Project');
          const finishedPubs = PROJECTS.filter(p => p.type === 'Publication');
        
          return (
            <div className="pt-40 pb-40 px-6">
              <div className="max-w-6xl mx-auto space-y-24">
                
                {/* Header */}
                <div className="border-b border-slate-100 pb-12">
                  <h2 className="text-6xl font-black tracking-tighter uppercase">Projects & Publications</h2>
                </div>
        
                {/* Section 1: Current Projects (No Links) */}
                <div className="space-y-10">
                  <h3 className="text-2xl font-bold tracking-tight uppercase text-slate-400">Current Projects</h3>
                  <div className="grid md:grid-cols-3 gap-16">
                    {currentProjects.map((project) => (
                      <div key={project.id} className="space-y-6 group">
                        <div className="aspect-[3/4] overflow-hidden bg-slate-100 border border-slate-200">
                          <img src={project.image} alt={project.title} className="w-full h-full object-cover filter contrast-125 grayscale group-hover:grayscale-0 transition-all duration-700" />
                        </div>
                        <div className="space-y-3">
                          <p className="mono text-[9px] font-bold text-[#dfb23c] uppercase">{project.type}</p>
                          <h3 className="text-xl font-bold tracking-tight">{project.title}</h3>
                          <p className="text-slate-500 text-sm font-light leading-relaxed">{project.description}</p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {project.tags.map((t) => (
                              <span key={t} className="px-2 py-1 bg-slate-50 text-[8px] mono font-bold text-slate-400 uppercase">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
        
                {/* Section 2: Publications (With Links) */}
                <div className="space-y-10 pt-10 border-t border-slate-50">
                  <h3 className="text-2xl font-bold tracking-tight uppercase text-slate-400">Publications</h3>
                  <div className="grid md:grid-cols-3 gap-16">
                    {finishedPubs.map((project) => (
                      <a 
                        key={project.id} 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block space-y-6 group cursor-pointer"
                      >
                        <div className="aspect-[3/4] overflow-hidden bg-slate-100 border border-slate-200">
                           <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                        </div>
                        <div className="space-y-3">
                          <p className="mono text-[9px] font-bold text-[#5c8ca1] uppercase">{project.type}</p>
                          <h3 className="text-xl font-bold tracking-tight group-hover:underline decoration-[#5c8ca1] underline-offset-4">
                            {project.title}
                          </h3>
                          <p className="text-slate-500 text-sm font-light leading-relaxed">{project.description}</p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {project.tags.map((t) => (
                              <span key={t} className="px-2 py-1 bg-slate-50 text-[8px] mono font-bold text-slate-400 uppercase">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        }
  
      case 'photography':
        return <PhotographyGallery photos={PHOTOGRAPHY} />;
  
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <DataArtBackground />
      <Navbar currentView={view} setView={setView} onConsultClick={() => setIsModalOpen(true)} />
      
      <main className="transition-opacity duration-500">
        {renderContent()}
      </main>

      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <footer className="py-24 px-6 border-t border-slate-100 bg-[#fcfcfb]">
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
    <div className="space-y-2 text-center md:text-left">
      <p className="text-xl font-black tracking-tight uppercase">MAX MANWARING MUELLER</p>
      {/* Your title moved here */}
      <p className="mono text-[10px] text-[#dfb23c] font-bold uppercase tracking-widest">
        {BIO.title}
      </p>
      <p className="mono text-[8px] text-slate-400 tracking-[0.2em] uppercase">
        Biomedical Informatician | Digital Artist | Consultant
      </p>
    </div>
    
    <div className="flex gap-12 mono text-[10px] font-bold uppercase text-slate-400">
      <a href="#" className="hover:text-slate-900 transition-colors">GitHub</a>
      <a href="#" className="hover:text-slate-900 transition-colors">LinkedIn</a>
      <a href="#" className="hover:text-slate-900 transition-colors">ORCID</a>
    </div>
    
    <p className="mono text-[8px] text-slate-300">EST. 2020 / UNIVERSITY OF UTAH</p>
  </div>
</footer>
    </div>
  );
};

export default App;
