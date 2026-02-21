import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface VideoProject {
  id: string;
  num: string;
  title: string;
  role: string;
  previewSrc: string; 
  fullSrc: string;    
}

const VIDEOS: VideoProject[] = [
  {
    id: 'v1',
    num: '01',
    title: 'MEET THE FARMER: RICK KROUT',
    role: 'Directed | Filmed | Produced',
    previewSrc: 'Videos/Rick_Krout.mp4', 
    fullSrc: 'https://www.youtube.com/embed/Vo4O5RTqXVI?si=62UjBt-Hz8EqzYzj'
  },
  {
    id: 'v2',
    num: '02',
    title: 'SF On Fire',
    role: 'Filmed | Edited',
    previewSrc: 'Videos/final fire city.mov',
    fullSrc: 'https://www.youtube.com/embed/lF6fhnePn50?si=mBlYESjkGliPWong'
  },
  {
    id: 'v3',
    num: '03',
    title: 'Strings',
    role: '3D Animator',
    previewSrc: 'Videos/strings.mov',
    fullSrc: 'https://www.youtube.com/embed/8buqASyuv_A?si=33WDMNjTaJwNhtIj'
  },
  {
    id: 'v4',
    num: '04',
    title: 'Highlight Reel',
    role: 'Filmed | Edited',
    previewSrc: 'Videos/highlights.mov',
    fullSrc: 'https://www.youtube.com/embed/eI2pv-JmzPQ?si=JG82DyKdQqGcYs9t'
  }
];

const VideographySection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  
  // --- NEW: Array of refs to control the physical video elements ---
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoProject | null>(null);

  useGSAP(() => {
    if (!listRef.current) return;
    
    gsap.from(listRef.current.children, {
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%", 
      }
    });
  }, { scope: containerRef });

  return (
    <>
      <div 
        ref={containerRef} 
        className="relative min-h-screen w-full bg-[#1a1a1a] flex flex-col justify-center overflow-hidden border-t border-white/5"
      >
        {/* --- 1. THE BACKGROUND VIDEO LAYER --- */}
        {VIDEOS.map((vid, index) => (
          <video
            key={vid.id}
            ref={(el) => (videoRefs.current[index] = el)} // Attach the ref here
            src={vid.previewSrc}
            loop
            muted
            playsInline
            // Removed autoPlay entirely, we handle it manually now!
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              hoveredVideo === vid.id ? 'opacity-30 scale-105' : 'opacity-0 scale-100'
            }`}
          />
        ))}

        {/* Section Title */}
        <div className="absolute top-12 left-6 md:top-24 md:left-24 z-20 pointer-events-none">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white drop-shadow-sm">
            Videography
          </h2>
          <p className="mono text-[10px] text-slate-400 uppercase tracking-widest mt-2">
            Motion & Storytelling
          </p>
        </div>

        {/* --- 2. THE HOVER LIST --- */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 mt-32">
          <ul ref={listRef} className="flex flex-col gap-4 md:gap-8">
            {VIDEOS.map((vid, index) => (
              <li 
                key={vid.id}
                onMouseEnter={() => {
                  setHoveredVideo(vid.id);
                  // Manually command the video to play
                  videoRefs.current[index]?.play().catch(() => {
                    // Catch block prevents console errors if the browser blocks it initially
                  });
                }}
                onMouseLeave={() => {
                  setHoveredVideo(null);
                  // Pause it when the mouse leaves to save CPU
                  videoRefs.current[index]?.pause();
                }}
                onClick={() => setActiveVideo(vid)}
                className="group cursor-pointer flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 border-b border-white/10 pb-4 md:pb-8 transition-colors hover:border-white/40"
              >
                {/* The Number */}
                <span className="mono text-sm md:text-xl text-[#dfb23c] font-bold group-hover:-translate-y-2 transition-transform duration-300">
                  {vid.num}
                </span>
                
                {/* The Huge Title with Microsoft JhengHei */}
                <h3 
                  className="text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter text-transparent transition-all duration-300 group-hover:text-white" 
                  style={{ 
                    fontFamily: '"Microsoft JhengHei", sans-serif',
                    fontWeight: 'bold',
                    WebkitTextStroke: '1px rgba(255,255,255,0.4)' 
                  }}
                >
                  {vid.title}
                </h3>
                
                {/* The Role/Category (Fades in on hover) */}
                <span className="mono text-[10px] md:text-xs text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:ml-auto">
                  {vid.role}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- 3. THE FULL VIDEO MODAL --- */}
      {activeVideo && (
        <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-12 animate-in fade-in duration-500">
          
          <button 
            onClick={() => setActiveVideo(null)} 
            className="absolute top-6 right-6 md:top-12 md:right-12 text-white/50 hover:text-white transition-colors flex items-center gap-4 group"
          >
            <span className="mono text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Close</span>
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="w-full max-w-6xl aspect-video bg-black shadow-2xl border border-white/10">
            <iframe 
              src={activeVideo.fullSrc} 
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
          
          <div className="w-full max-w-6xl mt-8 flex justify-between items-end">
            <div>
              <p className="mono text-[10px] text-[#dfb23c] uppercase tracking-widest mb-2">{activeVideo.role}</p>
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">{activeVideo.title}</h3>
            </div>
          </div>

        </div>
      )}
    </>
  );
};

export default VideographySection;