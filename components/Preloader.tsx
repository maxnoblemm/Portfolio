import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

interface Props {
  onComplete: () => void;
}

const Preloader: React.FC<Props> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState({ cols: 0, rows: 0, tileSize: 0 });
  const [isDark, setIsDark] = useState(false);
  const animationDataRef = useRef<{ rotation: number }[]>([]);

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
      const size = window.innerWidth < 768 ? 20 : 30;
      const cols = Math.ceil(window.innerWidth / size);
      const rows = Math.ceil(window.innerHeight / size);
      
      setGrid({ cols, rows, tileSize: size });
    };

    calculateGrid();
    window.addEventListener('resize', calculateGrid);
    return () => window.removeEventListener('resize', calculateGrid);
  }, []);

  useEffect(() => {
    if (grid.cols === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize animation data for each tile
    const totalTiles = grid.cols * grid.rows;
    animationDataRef.current = Array(totalTiles).fill(0).map(() => ({ rotation: 0 }));

    // Column noise for color variation
    const columnNoise = Array.from({ length: grid.cols }).map(() => (Math.random() * 8) - 4);

    const ctx = canvas.getContext('2d')!;
    const nameStr = "MAX MANWARING MUELLER";
    const subStr = "PORTFOLIO";
    const centerRow = Math.floor(grid.rows / 2);
    const nameStartCol = Math.floor((grid.cols - nameStr.length) / 2);
    const subStartCol = Math.floor((grid.cols - subStr.length) / 2);

    // Pre-calculate tile data
    const tileData: Array<{
      x: number;
      y: number;
      color: string;
      letter: string;
      isTextTile: boolean;
    }> = [];

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

        if (letter === " ") {
          letter = "";
        }

        tileData.push({
          x: c * grid.tileSize,
          y: r * grid.tileSize,
          color: tileColor,
          letter: letter,
          isTextTile: isTextTile
        });
      }
    }

    // Render function
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background
      ctx.fillStyle = isDark ? '#1a1a1a' : '#fcfcfb';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let index = 0;
      for (let r = 0; r < grid.rows; r++) {
        for (let c = 0; c < grid.cols; c++) {
          const tile = tileData[index];
          const animData = animationDataRef.current[index];
          const rotation = animData.rotation;
          
          const x = c * grid.tileSize;
          const y = r * grid.tileSize;
          const size = grid.tileSize;

          ctx.save();
          ctx.translate(x + size / 2, y + size / 2);

          // 3D flip effect simulation
          const rotationRad = (rotation * Math.PI) / 180;
          const scaleY = Math.abs(Math.cos(rotationRad));
          
          // Determine which side is visible
          const showFront = rotation < 90;

          if (showFront) {
            // Front side (initial state)
            ctx.scale(1, scaleY);
            ctx.fillStyle = isDark ? '#1a1a1a' : '#fcfcfb';
            ctx.fillRect(-size / 2, -size / 2, size, size);
          } else {
            // Back side (colored tile)
            ctx.scale(1, scaleY);
            
            // Background color
            ctx.fillStyle = tile.color;
            ctx.fillRect(-size / 2, -size / 2, size, size);
            
            // Border
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.lineWidth = 1;
            ctx.strokeRect(-size / 2, -size / 2, size, size);
            
            // Horizontal line
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(-size / 2, 0);
            ctx.lineTo(size / 2, 0);
            ctx.stroke();
            
            // Text
            if (tile.isTextTile && tile.letter !== "") {
              ctx.fillStyle = 'white';
              ctx.font = `900 ${window.innerWidth < 768 ? 16 : 20}px monospace`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
              ctx.shadowBlur = 4;
              ctx.fillText(tile.letter, 0, 0);
              ctx.shadowBlur = 0;
            }
          }

          ctx.restore();
          index++;
        }
      }

      requestAnimationFrame(render);
    };

    render();

    // GSAP Animation
    setTimeout(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 1.5,
            ease: "power2.inOut",
            delay: 1.5,
            onComplete: onComplete 
          });
        }
      });

      // Animate each tile
      animationDataRef.current.forEach((animData, index) => {
        const r = Math.floor(index / grid.cols);
        const c = index % grid.cols;
        
        const centerCol = Math.floor(grid.cols / 2);
        const fromBottom = (grid.rows - 1) - r;
        const fromCenter = Math.abs(c - centerCol);

        const baseDelay = (fromBottom * 0.08) + (fromCenter * 0.1);
        const randomJitter = Math.random() * 0.3;
        const delay = baseDelay + randomJitter;

        tl.to(animData, {
          rotation: 180,
          duration: 0.8,
          ease: "back.out(1.4)"
        }, delay); // Position each animation at its calculated delay time
      });
    }, 1500);

  }, [grid, isDark, onComplete]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[999] overflow-hidden"
    >
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
};

export default Preloader;