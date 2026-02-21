import React, { useRef, useMemo } from 'react'; // Added useMemo
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Photography } from '../types';

interface Props {
  photos: Photography[];
}

const PhotographySection: React.FC<Props> = ({ photos }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // --- NEW: The Randomizer ---
  // This takes your photos array, copies it, and shuffles it.
  // useMemo ensures this only happens ONCE when the section loads, keeping it stable for GSAP.
  const shuffledPhotos = useMemo(() => {
    return [...photos].sort(() => Math.random() - 0.5);
  }, [photos]);

  const getLayoutStyles = (index: number) => {
    const layouts = [
      { height: 'h-[50vh] md:h-[70vh]', align: 'self-center', speed: 0.05 },
      { height: 'h-[40vh] md:h-[55vh]', align: 'self-end mb-12 md:mb-24', speed: -0.03 },
      { height: 'h-[60vh] md:h-[80vh]', align: 'self-start mt-20 md:mt-32', speed: 0.08 },
      { height: 'h-[45vh] md:h-[65vh]', align: 'self-center', speed: -0.06 },
    ];
    return layouts[index % layouts.length];
  };

  useGSAP(() => {
    const track = trackRef.current;
    const items = itemsRef.current.filter(Boolean);
    if (!track || items.length === 0) return;

    const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${track.scrollWidth}`, 
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true, 
      }
    });

    tl.to(track, {
      x: getScrollAmount,
      ease: "none"
    }, 0);

    items.forEach((item) => {
      const speed = parseFloat(item.dataset.speed || '0');
      tl.to(item, {
        x: () => -window.innerWidth * speed,
        ease: "none"
      }, 0); 
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="h-screen w-full bg-[#fcfcfb] overflow-hidden relative border-t border-slate-100">

      <div className="absolute top-12 left-6 md:top-24 md:left-24 z-20 pointer-events-none">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-slate-900 drop-shadow-sm">
          Photography
        </h2>
        <p className="mono text-[10px] text-slate-500 uppercase tracking-widest mt-2">
          A Visual Walkthrough
        </p>
      </div>

      <div ref={trackRef} className="flex h-full w-max items-center gap-[15vw] md:gap-[20vw] px-[20vw] md:px-[50vw]">
        {/* CHANGED: Now mapping over shuffledPhotos instead of photos */}
        {shuffledPhotos.map((photo, i) => {
          const layout = getLayoutStyles(i);

          return (
            <div
              key={photo.id}
              ref={(el) => (itemsRef.current[i] = el)}
              data-speed={layout.speed}
              className={`relative flex flex-col gap-6 flex-shrink-0 ${layout.height} ${layout.align}`}
            >
              <div className="h-full w-auto bg-slate-100 shadow-2xl border border-slate-200">
                <img
                  src={photo.image}
                  alt={photo.title}
                  onLoad={() => ScrollTrigger.refresh()}
                  className="h-full w-auto object-contain grayscale-[0.2] hover:grayscale-0 transition-all duration-700 hover:scale-[1.02]"
                />
              </div>
              
              <div className="space-y-1 pl-4 border-l-2 border-slate-200">
                <p className="text-sm md:text-lg font-bold tracking-tight text-slate-900 uppercase leading-none">
                  {photo.title}
                </p>
                <p className="mono text-[8px] md:text-[10px] text-[#dfb23c] uppercase tracking-widest">
                  {photo.location}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default PhotographySection;