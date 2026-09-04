'use client';
import { Button } from '@radix-ui/themes';
import { ArrowRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// CONFIGURABLE CONSTANTS
const TILE_GAP_PX = 5; // gap between tiles in px
const TILE_PADDING_PX = 16; // padding around the whole grid (optional)
const SWAP_IMAGE_WIDTH = 400;
const SWAP_IMAGE_HEIGHT = 480;
const SWAP_INTERVAL_MS = 8000;
const INITIAL_IMAGE_URL = `https://picsum.photos/seed/ai-suite-hero/${SWAP_IMAGE_WIDTH * 2}/${SWAP_IMAGE_HEIGHT * 2}`;

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const swapIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [animations, setAnimations] = useState<gsap.core.Tween[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const gridSize = 3;

  // Track container size dynamically
  useEffect(() => {
    if (!gridRef.current) return;
    const observer = new ResizeObserver((entries) => {
      // Loop through each entry in the ResizeObserver entries
      for (const entry of entries) {
        // Extract the width and height of the observed element
        const { width, height } = entry.contentRect;

        // Update the container size state with the new dimensions
        setContainerSize({ width, height });
      }
    });
    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  // Load initial image size once
  useEffect(() => {
    const img = new Image();
    img.src = INITIAL_IMAGE_URL;
    img.onload = () => {
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
  }, []);

  // GSAP animations (no changes)
  useEffect(() => {
    gsap.from('.hero-text', {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.hero-text',
        start: 'top 80%',
      },
    });

    gsap.from('.hero-cta', {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.hero-cta',
        start: 'top 85%',
      },
    });

    if (gridRef.current) {
      const tiles = Array.from(gridRef.current.querySelectorAll('.grid-tile'));
      const rows = [tiles.slice(0, 3), tiles.slice(3, 6), tiles.slice(6, 9)];

      rows.forEach((rowTiles) => {
        rowTiles.forEach((tile) => {
          const anim = gsap.to(tile, {
            keyframes: [
              {
                x: gsap.utils.random(-2, 2),
                y: gsap.utils.random(-2, 2),
                scale: gsap.utils.random(1.01, 1.03),
                duration: gsap.utils.random(1.8, 2.5),
              },
              {
                x: gsap.utils.random(-1, 1),
                y: gsap.utils.random(-1, 1),
                scale: gsap.utils.random(1.0, 1.02),
                duration: gsap.utils.random(1.6, 2.4),
              },
            ],
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: gsap.utils.random(0, 1), // desync starting point
          });
          setAnimations((prev) => [...prev, anim]);
        });
      });
    }
  }, []);

  // Swaps every tile to a freshly cropped random photo, staggered tile by tile
  const swapTileImages = useCallback(() => {
    if (!gridRef.current) return;

    const newUrl = `https://picsum.photos/${SWAP_IMAGE_WIDTH}/${SWAP_IMAGE_HEIGHT}?random=${Date.now()}`;
    const tiles = Array.from(gridRef.current.querySelectorAll('.grid-tile'));
    const randomizedTiles = gsap.utils.shuffle(tiles);

    randomizedTiles.forEach((tile, index) => {
      const htmlTile = tile as HTMLElement;

      setTimeout(() => {
        gsap.to(htmlTile, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            const col = parseInt(htmlTile.dataset.col!);
            const row = parseInt(htmlTile.dataset.row!);

            if (
              containerSize.width > 0 &&
              containerSize.height > 0 &&
              imageSize.width > 0 &&
              imageSize.height > 0
            ) {
              const scale = Math.max(
                containerSize.width / imageSize.width,
                containerSize.height / imageSize.height
              );
              const scaledWidth = imageSize.width * scale;
              const scaledHeight = imageSize.height * scale;
              const containerTileWidth = containerSize.width / gridSize;
              const containerTileHeight = containerSize.height / gridSize;
              const offsetX = (scaledWidth - containerSize.width) / 2;
              const offsetY = (scaledHeight - containerSize.height) / 2;
              const posX = containerTileWidth * col * -1 - offsetX;
              const posY = containerTileHeight * row * -1 - offsetY;

              htmlTile.style.backgroundImage = `url(${newUrl})`;
              htmlTile.style.backgroundSize = `${scaledWidth}px ${scaledHeight}px`;
              htmlTile.style.backgroundPosition = `${posX}px ${posY}px`;
            }

            gsap.to(htmlTile, { opacity: 1, duration: 0.5 });
          },
        });
      }, index * 400); // stagger each tile's animation
    });
  }, [containerSize, imageSize]);

  // Start image swap interval
  useEffect(() => {
    swapIntervalRef.current = setInterval(swapTileImages, SWAP_INTERVAL_MS);

    return () => {
      if (swapIntervalRef.current) clearInterval(swapIntervalRef.current);
    };
  }, [swapTileImages]);

  // Tile rendering
  const tiles = [];
  for (let i = 0; i < gridSize * gridSize; i++) {
    const col = i % gridSize;
    const row = Math.floor(i / gridSize);

    let backgroundStyles = {};

    if (
      containerSize.width > 0 &&
      containerSize.height > 0 &&
      imageSize.width > 0 &&
      imageSize.height > 0
    ) {
      const scale = Math.max(
        containerSize.width / imageSize.width,
        containerSize.height / imageSize.height
      );

      const scaledWidth = imageSize.width * scale;
      const scaledHeight = imageSize.height * scale;

      const containerTileWidth = containerSize.width / gridSize;
      const containerTileHeight = containerSize.height / gridSize;

      const offsetX = (scaledWidth - containerSize.width) / 2;
      const offsetY = (scaledHeight - containerSize.height) / 2;

      const posX = containerTileWidth * col * -1 - offsetX;
      const posY = containerTileHeight * row * -1 - offsetY;

      backgroundStyles = {
        backgroundImage: `url(${INITIAL_IMAGE_URL})`,
        backgroundSize: `${scaledWidth}px ${scaledHeight}px`,
        backgroundPosition: `${posX}px ${posY}px`,
        willChange: 'transform, filter',
        transition: 'filter 0.2s ease',
      };
    }

    tiles.push(
      <div
        key={i}
        data-col={col}
        data-row={row}
        className="grid-tile w-full h-full bg-no-repeat bg-cover"
        style={backgroundStyles}
      ></div>
    );
  }

  return (
    <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-between gap-8 px-8 py-16 bg-background text-foreground overflow-hidden">
      <div
        ref={gridRef}
        className="w-full md:w-1/2 grid grid-cols-3 grid-rows-3 max-w-sm overflow-hidden relative z-10 cursor-pointer hover:gap-0"
        onMouseEnter={() => {
          animations.forEach((anim) => {
            anim.pause();
          });
          if (gridRef.current) {
            const tiles = Array.from(gridRef.current.querySelectorAll('.grid-tile'));
            tiles.forEach((tile) => {
              const htmlTile = tile as HTMLElement;
              htmlTile.style.transition = 'none';
              htmlTile.style.transform = 'translate(0, 0)';
            });
            gridRef.current.style.gap = '0px';
          }
          // Stop the image swap interval
          if (swapIntervalRef.current) {
            clearInterval(swapIntervalRef.current);
            swapIntervalRef.current = null;
          }
        }}
        onMouseLeave={() => {
          animations.forEach((anim) => {
            anim.resume();
          });
          if (!swapIntervalRef.current) {
            swapIntervalRef.current = setInterval(swapTileImages, SWAP_INTERVAL_MS);
          }
          if (gridRef.current) {
            gridRef.current.style.gap = `${TILE_GAP_PX}px`;
          }
        }}
        style={{
          aspectRatio: '5 / 6',
          gap: `${TILE_GAP_PX}px`,
          padding: `${TILE_PADDING_PX}px`,
        }}
      >
        {tiles}
      </div>

      <div className="w-full md:w-1/2 space-y-6 text-center md:text-left relative z-20">
        <h1 className="hero-text text-5xl font-bold tracking-tight leading-tight relative">
          Frontend Architect &<br />
          Full-Stack Developer
        </h1>
        <p className="hero-text text-lg text-muted-foreground max-w-lg mx-auto md:mx-0 relative">
          10+ years of experience building production-ready apps, leading teams, and delivering
          seamless UX across fintech, AI, and blockchain projects.
        </p>

        <div className="hero-cta flex justify-center md:justify-start relative">
          <Button size="3" radius="large" className="group text-lg px-6 py-3">
            Explore My Work
            <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
