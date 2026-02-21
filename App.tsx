
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import ConsultationModal from './components/ConsultationModal';
import { PROJECTS, ART_WORKS, PHOTOGRAPHY, BIO } from './constants';
import { AppView, Photography, Project } from './types';

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
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

const PhotographyGallery = ({ photos }: { photos: Photography[] }) => {
  const [shuffledPhotos, setShuffledPhotos] = useState<Photography[]>([]);
  const [activePhoto, setActivePhoto] = useState<Photography | null>(null);

  // Initial Shuffle
  useEffect(() => {
    const shuffled = [...photos].sort(() => Math.random() - 0.5);
    setShuffledPhotos(shuffled);
    setActivePhoto(shuffled[0]);
  }, [photos]);

  // Auto-cycle Logic (5 seconds)
  useEffect(() => {
    if (shuffledPhotos.length === 0 || !activePhoto) return;

    const interval = setInterval(() => {
      setActivePhoto((current) => {
        if (!current) return shuffledPhotos[0];
        const currentIndex = shuffledPhotos.findIndex(p => p.id === current.id);
        const nextIndex = (currentIndex + 1) % shuffledPhotos.length;
        return shuffledPhotos[nextIndex];
      });
    }, 5000); // 5000ms = 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [shuffledPhotos, activePhoto]);

  if (!activePhoto) return null;

  return (
    <div className="pt-32 pb-40 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="mb-12 space-y-4">
          <h2 className="text-6xl font-black tracking-tighter uppercase">Photography</h2>
        </div>

        {/* Hero Image with transition */}
        <div className="w-full h-[65vh] bg-slate-100 border border-slate-200 overflow-hidden shadow-sm">
          <img 
            key={activePhoto.id} // Changing key triggers re-animation
            src={activePhoto.image} 
            alt="Selected view" 
            className="w-full h-full object-cover animate-in fade-in duration-1000" 
          />
        </div>

        {/* Thumbnails */}
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Create Refs for each section
  const publicationsRef = useRef<HTMLDivElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);
  const photographyRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  // 2. The Scrolling Logic
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper functions to render the content inside the stacked divs
  const renderAbout = () => (
    <div className="min-h-screen flex flex-col md:flex-row">
      <section className="flex-1 flex items-start pt-32 md:pt-48 pb-20 px-6 md:px-20 bg-[#fcfcfb]">
        <div className="max-w-2xl space-y-12">
          <div className="space-y-4">
            <h1 className="text-6xl lg:text-7xl font-black text-slate-900 leading-[1] tracking-tighter">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dfb23c] to-[#5c8ca1]">Mapping</span> <br />
              the complexity of disease.
            </h1>
          </div>
          <div className="space-y-8 text-lg text-slate-600 font-light leading-relaxed whitespace-pre-line">{BIO.visionText}</div>
          <div className="space-y-6 pt-4 border-t border-slate-100">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Purpose of this Site</h3>
            <div className="text-lg text-slate-600 font-light leading-relaxed whitespace-pre-line">{BIO.purposeText}</div>
          </div>
          <div className="pt-4">
            <button onClick={() => setIsModalOpen(true)} className="px-10 py-5 bg-slate-900 text-white font-bold tracking-tight hover:bg-slate-800 transition-all uppercase text-xs">Substack</button>
          </div>
        </div>
      </section>
      <div className="w-full md:w-1/3 lg:w-[35%] h-[60vh] md:h-screen md:sticky top-0">
        <img src={BIO.image} alt={BIO.name} className="w-full h-full object-cover object-top pt-12 md:pt-0" />
      </div>
    </div>
  );

  const renderArtwork = () => (
    <div className="pt-40 pb-40 px-6 bg-[#f8f8f7]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-6xl font-black tracking-tighter uppercase mb-24">Cover Art</h2>
        <div className="grid md:grid-cols-3 gap-10">
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

  const renderPublications = () => {
    const currentProjects = PROJECTS.filter(p => p.type === 'Project');
    const finishedPubs = PROJECTS.filter(p => p.type === 'Publication');
    return (
      <div className="pt-40 pb-40 px-6">
        <div className="max-w-6xl mx-auto space-y-24">
          <div className="border-b border-slate-100 pb-12">
            <h2 className="text-6xl font-black tracking-tighter uppercase">Projects & Publications</h2>
          </div>
          <div className="space-y-10">
            <h3 className="text-2xl font-bold tracking-tight uppercase text-slate-400">Current Projects</h3>
            <div className="grid md:grid-cols-3 gap-16">
            {currentProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
            </div>
          </div>
          <div className="space-y-10 pt-10 border-t border-slate-50">
            <h3 className="text-2xl font-bold tracking-tight uppercase text-slate-400">Publications</h3>
            <div className="grid md:grid-cols-3 gap-16">
              {finishedPubs.map((p) => (
                <a key={p.id} href={p.link} target="_blank" rel="noopener noreferrer" className="block space-y-6 group cursor-pointer">
                  <ProjectCard project={p} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* 3. Pass the scroll handlers to Navbar */}
      <Navbar 
        onPubsClick={() => scrollToSection(publicationsRef)}
        onArtClick={() => scrollToSection(artworkRef)}
        onPhotoClick={() => scrollToSection(photographyRef)}
        onAboutClick={() => scrollToSection(aboutRef)}
      />
      
      <main>
        {/* 4. All sections stacked on top of each other */}
        <div ref={publicationsRef}>{renderPublications()}</div>
        <div ref={artworkRef}>{renderArtwork()}</div>
        <div ref={photographyRef}><PhotographyGallery photos={PHOTOGRAPHY} /></div>
        <div ref={aboutRef}>{renderAbout()}</div>
      </main>

      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <footer className="py-24 px-6 border-t border-slate-100 bg-[#fcfcfb]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-xl font-black tracking-tight uppercase">MAX MANWARING MUELLER</p>
            <p className="mono text-[10px] text-[#dfb23c] font-bold uppercase tracking-widest">{BIO.title}</p>
          </div>
          <div className="flex gap-12 mono text-[10px] font-bold uppercase text-slate-400">
            <a href="#" className="hover:text-slate-900">GitHub</a>
            <a href="#" className="hover:text-slate-900">LinkedIn</a>
            <a href="#" className="hover:text-slate-900">ORCID</a>
          </div>
          <p className="mono text-[8px] text-slate-300">EST 2026</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
