import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Project } from '../types';

interface Props {
  projects: Project[];
}

// --- NEW: Dedicated Modal Component for GSAP Animations ---
const ProjectModal: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Staged Animation Timeline
    const tl = gsap.timeline();

    // 1. Fade in the blur background
    tl.from(overlayRef.current, { 
      opacity: 0, 
      duration: 0.3, 
      ease: "power2.out" 
    });

    // 2. The Cover "Pop": Starts small, tilted, and lower, then snaps into place
    tl.from(imageRef.current, {
      scale: 0.5,
      y: 100,
      rotation: -10,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.2)" // The "overshoot" effect that makes it feel physical
    }, "-=0.1"); // Start slightly before the background finishes fading

    // 3. Fade and slide in the text content around the cover
    tl.from(contentRef.current, {
      opacity: 0,
      x: 20,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.3");

  }, []);

  const handleClose = () => {
    // Animate out quickly before unmounting
    gsap.to(overlayRef.current, { 
      opacity: 0, 
      duration: 0.2, 
      onComplete: onClose 
    });
  };

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[200] flex items-center justify-center bg-[#fcfcfb]/95 backdrop-blur-md p-6 overflow-y-auto">
      <div className="max-w-4xl w-full bg-white shadow-2xl border border-slate-200 p-8 md:p-12 relative">
        
        <button onClick={handleClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors z-10">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2 gap-12 items-center mt-4">
          {/* The Image Container */}
          <div ref={imageRef} className="aspect-[3/4] w-full max-w-sm mx-auto shadow-xl border border-slate-100">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          </div>
          
          {/* The Text Content Container */}
          <div ref={contentRef} className="space-y-6">
            <p className="mono text-[10px] font-bold text-[#dfb23c] uppercase tracking-widest">
              {project.type}
            </p>
            <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight text-slate-900">
              {project.title}
            </h3>
            <p className="text-slate-600 text-lg font-light leading-relaxed">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 pt-4">
              {project.tags.map(t => (
                <span key={t} className="px-3 py-1 bg-slate-50 text-[10px] mono font-bold text-slate-400 uppercase border border-slate-100">{t}</span>
              ))}
            </div>
            {project.link && (
              <div className="pt-8">
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-4 bg-slate-900 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-colors">
                  Read Full Publication
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- THE MAIN SECTION COMPONENT ---
const PublicationsSection: React.FC<Props> = ({ projects }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useGSAP(() => {
    const cards = cardsRef.current.filter(Boolean);
    if (cards.length === 0) return;

    // Initial Messy Stack
    gsap.set(cards, {
      xPercent: -50,
      yPercent: -50,
      left: "50%",
      top: "50%",
      rotation: () => -4 + Math.random() * 8,
      scale: 0.8,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top-=50px top", // Pins exactly when the title scrolls out of view
        end: "+=2500",
        scrub: 1,
        pin: true,
      }
    });

    // Fan Out Animation
    cards.forEach((card, i) => {
      const centerIndex = (cards.length - 1) / 2;
      const offset = i - centerIndex; 
      
      tl.to(card, {
        xPercent: -50 + (offset * 110),
        yPercent: -50 + (Math.abs(offset) * 15),
        rotation: offset * 8,
        scale: 1.2,
        ease: "power2.inOut"
      }, 0); 
    });

  }, { scope: containerRef });

  return (
    <>
      <div ref={containerRef} className="h-screen w-full bg-[#fcfcfb] overflow-hidden relative border-t border-slate-100">
        <div className="absolute top-16 left-0 w-full text-center z-10 pointer-events-none">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-slate-900">
            Projects & Publications
          </h2>
          <p className="mono text-[10px] text-slate-400 uppercase tracking-widest mt-4">
            Scroll to fan the stack
          </p>
        </div>

        {projects.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => (cardsRef.current[i] = el)}
            onClick={() => setSelectedProject(project)}
            className="absolute w-48 md:w-64 lg:w-80 aspect-[3/4] cursor-pointer group shadow-2xl bg-white border border-slate-200"
            style={{ zIndex: projects.length - i }}
          >
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500"
            />
          </div>
        ))}
      </div>

      {/* Render the new GSAP-powered Modal if a project is selected */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </>
  );
};

export default PublicationsSection;