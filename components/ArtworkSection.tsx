import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArtWork } from '../types';

interface Props {
  artworks: ArtWork[];
}

const ArtworkSection: React.FC<Props> = ({ artworks }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryWrapperRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const panels = panelsRef.current.filter(Boolean);
    const texts = textRefs.current.filter(Boolean);
    if (panels.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: galleryWrapperRef.current, 
        start: "top-=100px top", // Pins exactly when the title scrolls out of view
        end: "+=3000",
        scrub: 1,
        pin: true,
      }
    });

    // ACTION 1: Zoom & Re-center
    // We use the "zoom" label to make both animations happen at the exact same time
    tl.to(panels, {
      width: "100vw",
      duration: 1,
      ease: "power2.inOut"
    }, "zoom");

    // This pushes the image from the top of the container down into the perfect center
    tl.to('.art-image', {
      objectPosition: "50% 50%",
      duration: 1,
      ease: "power2.inOut"
    }, "zoom");

    // Fade in text for the FIRST artwork near the end of the zoom
    tl.to(texts[0], { opacity: 1, y: 0, duration: 0.3, ease: "power1.out" }, "zoom+=0.7");

    // ACTION 2: The Pan
    panels.forEach((panel, i) => {
      if (i === 0) return; 
      
      const panLabel = `pan${i}`;
      
      tl.to(sliderRef.current, {
        x: () => `-${i * 100}vw`,
        duration: 1,
        ease: "none"
      }, panLabel);

      tl.to(texts[i], { opacity: 1, y: 0, duration: 0.5, ease: "power1.out" }, `${panLabel}+=0.7`);
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full bg-[#1a1a1a] -mt-32 md:-mt-48 relative z-20">
      
      {/* The Gradient Bridge */}
      <div className="w-full h-[15vh] bg-gradient-to-b from-transparent to-[#1a1a1a]"></div>

      {/* The Title Block (Tightened padding to hug the art) */}
      <div className="pt-0 pb-4 px-6 flex flex-col items-center justify-center">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white text-center">
          Scientific Artwork
        </h2>
        <p className="mono text-[10px] text-slate-400 uppercase tracking-widest mt-4">
          Scroll to explore
        </p>
      </div>

      {/* The Pinned Gallery */}
      <div ref={galleryWrapperRef} className="h-screen w-full overflow-hidden relative">
        <div ref={sliderRef} className="flex h-full w-max">
          {artworks.map((art, i) => (
            <div 
              key={art.id}
              ref={(el) => (panelsRef.current[i] = el)}
              className="h-full w-[33.333vw] relative flex-shrink-0 bg-[#1a1a1a] border-r border-white/5"
            >
              {/* Padding adjusted to allow the image to sit high up initially */}
              <div className="w-full h-full px-4 pt-4 pb-12 md:px-12 md:pt-4 flex items-start justify-center">
                <img 
                  src={art.image} 
                  alt={art.title} 
                  // "art-image" class allows GSAP to target it.
                  // Inline style anchors it to the top (0%) initially to kill the black void!
                  className="w-full h-full object-contain drop-shadow-2xl art-image"
                  style={{ objectPosition: "50% 0%" }} 
                />
              </div>
              
              <div 
                ref={(el) => (textRefs.current[i] = el)}
                className="absolute bottom-12 left-6 md:bottom-24 md:left-24 z-10 opacity-0 translate-y-8 max-w-xl pointer-events-none"
              >
                <div className="bg-[#1a1a1a]/95 backdrop-blur-md p-6 md:p-8 border border-white/10 shadow-2xl">
                  <p className="mono text-[10px] font-bold text-[#dfb23c] uppercase tracking-widest mb-3">
                    {art.client}
                  </p>
                  <h3 className="text-xl md:text-3xl font-black text-white leading-tight">
                    {art.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ArtworkSection;