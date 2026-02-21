import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Components
import Preloader from './components/Preloader'; 
import Navbar from './components/Navbar';
import ConsultationModal from './components/ConsultationModal';
import PublicationsSection from './components/PublicationsSection';
import ArtworkSection from './components/ArtworkSection';
import PhotographySection from './components/PhotographySection';
import VideographySection from './components/VideographySection';

// Data & Types
import { PROJECTS, ART_WORKS, PHOTOGRAPHY, BIO } from './constants';
import { AppView, Photography, Project } from './types';

// Register GSAP Plugins globally
gsap.registerPlugin(ScrollTrigger, useGSAP);

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  const publicationsRef = useRef<HTMLDivElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);
  const photographyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  // --- NEW: Lock scrolling while loading ---
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Tell GSAP to recalculate all math now that the page is visible!
      ScrollTrigger.refresh(); 
    }
  }, [isLoading]);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  return (
    <>
      {/* --- NEW: The Preloader Overlay --- */}
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      {/* --- NEW: Wraps the whole site to fade in once loading is false --- */}
      <div className={`min-h-screen transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Navbar 
          onPubsClick={() => scrollToSection(publicationsRef)}
          onArtClick={() => scrollToSection(artworkRef)}
          onPhotoClick={() => scrollToSection(photographyRef)}
          onVideoClick={() => scrollToSection(videoRef)}
          onAboutClick={() => scrollToSection(aboutRef)}
        />
        
        <main>
          <div ref={publicationsRef} id="publications"><PublicationsSection projects={PROJECTS} /></div>
          <div ref={artworkRef} id="artwork"><ArtworkSection artworks={ART_WORKS} /></div>
          <div ref={photographyRef} id="photography"><PhotographySection photos={PHOTOGRAPHY} /></div>       
          
          <div ref={videoRef} id="videography">
            <VideographySection />
          </div>

          <div ref={aboutRef} id="about">{renderAbout()}</div>
        </main>

        <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        <footer className="py-24 px-6 border-t border-slate-100 bg-[#fcfcfb]">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="space-y-2 text-center md:text-left">
              <p className="text-xl font-black tracking-tight uppercase">MAX MANWARING MUELLER</p>
              <p className="mono text-[10px] text-[#dfb23c] font-bold uppercase tracking-widest">{BIO.title}</p>
            </div>
            
            {/* --- UPDATED SOCIAL LINKS --- */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 mono text-[10px] font-bold uppercase text-slate-400">
              <a 
                href="https://github.com/maxnoblemm" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-slate-900 transition-colors"
              >
                GitHub
              </a>
              <a 
                href="www.linkedin.com/in/max-manwaring-mueller-72280817a" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-slate-900 transition-colors"
              >
                LinkedIn
              </a>
              <a 
                href="https://orcid.org/0009-0008-2957-2236" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-slate-900 transition-colors"
              >
                ORCID
              </a>
              <a 
                href="https://www.instagram.com/max.noblephoto/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-slate-900 transition-colors"
              >
                Instagram
              </a>
            </div>
            
            <p className="mono text-[8px] text-slate-300">EST 2026</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default App;