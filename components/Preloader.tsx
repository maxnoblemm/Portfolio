import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface Props {
  onComplete: () => void;
}

const Preloader: React.FC<Props> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState({ cols: 0, rows: 0, tileSize: 0 });
  const [isDark, setIsDark] = useState(false);
  const [columnNoise, setColumnNoise] = useState<number[]>([]);

  const abundanceColors = [
    '#A33324', // Deep Red
    '#C1663B', // Orange/Rust
    '#5A9E74', // Muted Green
    '#4B93A8', // Teal
    '#2D4776'  // Deep Blue
  ];

  useEffect(() => {
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(darkMode);

    const calculateGrid = () => {
      // OPTIMIZATION: Bumped from 25 to 30. Visually similar, but 30% fewer DOM nodes!
      const size = window.innerWidth < 768 ? 20 : 30;
      const cols = Math.ceil(window.innerWidth / size);
      const rows = Math.ceil(window.innerHeight / size);
      
      const noise = Array.from({ length: cols }).map(() => (Math.random() * 8) - 4);
      
      setGrid({ cols, rows, tileSize: size });
      setColumnNoise(noise);
    };

    calculateGrid();
    window.addEventListener('resize', calculateGrid);
    return () => window.removeEventListener('resize', calculateGrid);
  }, []);

  useGSAP(() => {
    if (grid.cols === 0) return;

    // OPTIMIZATION 1: Give the browser 1.5 seconds to "breathe" and paint the DOM before starting
    const tl = gsap.timeline({
      delay: 1.5, 
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 1.5, // Slowed down the final fade-out to make it more elegant
          ease: "power2.inOut",
          delay: 1.5, // Wait longer before fading out so they can read your name
          onComplete: onComplete 
        });
      }
    });

    tl.to('.flap-inner', {
      rotationX: 180,
      duration: 0.8, // Slightly longer flip duration to make it look heavier
      ease: "back.out(1.4)",
      stagger: (index, target) => {
        const r = parseInt(target.getAttribute('data-row') || '0');
        const c = parseInt(target.getAttribute('data-col') || '0');
        
        const centerCol = Math.floor(grid.cols / 2);
        const fromBottom = (grid.rows - 1) - r;
        const fromCenter = Math.abs(c - centerCol);

        // OPTIMIZATION 2: Increased multipliers. 
        // This spreads the animation out over ~4-5 seconds, so less tiles flip simultaneously.
        const baseDelay = (fromBottom * 0.08) + (fromCenter * 0.1);
        const randomJitter = Math.random() * 0.3; // More randomness!
        
        return baseDelay + randomJitter;
      }
    });

  }, { scope: containerRef, dependencies: [grid] });

  const renderTiles = () => {
    if (grid.cols === 0) return null;

    const tiles = [];
    const nameStr = "MAX MANWARING MUELLER";
    const subStr = "PORTFOLIO";

    const centerRow = Math.floor(grid.rows / 2);
    const centerCol = Math.floor(grid.cols / 2);
    
    const nameStartCol = Math.floor((grid.cols - nameStr.length) / 2);
    const subStartCol = Math.floor((grid.cols - subStr.length) / 2);

    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        
        const adjustedRow = r + (columnNoise[c] || 0);
        let colorBand = Math.floor((adjustedRow / grid.rows) * abundanceColors.length);
        colorBand = Math.max(0, Math.min(colorBand, abundanceColors.length - 1));
        const tileColor = abundanceColors[colorBand];

        let letter = "";
        let isTextTile = false;

        if (r === centerRow - 2 && c >= nameStartCol && c < nameStartCol + nameStr.length) {
          letter = nameStr[c - nameStartCol];
          isTextTile = true;
        } else if (r === centerRow + 2 && c >= subStartCol && c < subStartCol + subStr.length) {
          letter = subStr[c - subStartCol];
          isTextTile = true;
        }

        if (letter === " ") letter = "";

        tiles.push(
          <div key={`${r}-${c}`} className="relative perspective-[1000px]" style={{ width: grid.tileSize, height: grid.tileSize }}>
            <div 
              // OPTIMIZATION 3: 'will-change-transform' forces Hardware (GPU) Acceleration
              className="flap-inner w-full h-full relative transition-transform preserve-3d will-change-transform"
              data-row={r}
              data-col={c}
              style={{ transformOrigin: "center center" }}
            >
              <div className={`absolute inset-0 backface-hidden ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#fcfcfb]'}`}></div>
              
              <div 
                className="absolute inset-0 backface-hidden rotate-x-180 flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: tileColor }}
              >
                <div className="absolute inset-0 border border-black/10"></div>
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/30 -translate-y-1/2 z-10"></div>
                
                {isTextTile && letter !== "" && (
                  <span className="text-white text-base md:text-xl font-black font-mono leading-none z-20 drop-shadow-md">
                    {letter}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      }
    }
    return tiles;
  };

  return (
    <div 
      ref={containerRef} 
      className={`fixed inset-0 z-[999] overflow-hidden flex flex-wrap content-start ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#fcfcfb]'}`}
    >
      {renderTiles()}
    </div>
  );
};

export default Preloader;