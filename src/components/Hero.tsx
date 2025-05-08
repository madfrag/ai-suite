'use client';
import { Button } from '@radix-ui/themes';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const gridRef = useRef<HTMLDivElement | null>(null);

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

      const rows = [
        tiles.slice(0, 3),
        tiles.slice(3, 6),
        tiles.slice(6, 9),
      ];

      rows.forEach((rowTiles) => {
        const distance = 15;

        rowTiles.forEach((tile) => {
          let direction = 'x';
          const speed = gsap.utils.random(0.8, 1.2);

          const animateTile = () => {
            const axis = direction === 'x' ? { x: distance, y: 0 } : { y: distance, x: 0 };

            gsap.to(tile, {
              ...axis,
              duration: speed,
              ease: 'power1.inOut',
              yoyo: true,
              repeat: 1,
              onComplete: () => {
                if (Math.random() < 0.3) {
                  direction = direction === 'x' ? 'y' : 'x';
                }
                animateTile();
              },
              onReverseComplete: () => {
                // Continue after reverse without stopping
              },
            });
          };

          animateTile();
        });
      });
    }
  }, []);

  const gridSize = 3;
  const tiles = [];
  for (let i = 0; i < gridSize * gridSize; i++) {
    tiles.push(
      <div
        key={i}
        className="grid-tile w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://scontent-muc2-1.xx.fbcdn.net/v/t39.30808-6/461646289_26846624574983477_6518261632323745174_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=4b58ac&_nc_ohc=3d09xHJsN-QQ7kNvwF5XwvS&_nc_oc=Adn7anN6Ru0Cs8DL_auN6oqqot5A2hiz2kD-kyij860fqe9yvRmwmymnrHaSz_DRzm5bakQ65a35pZuRrP4iKQ5b&_nc_zt=23&_nc_ht=scontent-muc2-1.xx&_nc_gid=22c7WQOgc__TqdsSiUoJoQ&oh=00_AfIudIj7uaqdOo5cYCO2zP0D5jcozE8XrtUJqVOss6H6uA&oe=6821583A)',
          backgroundPosition: `${(i % gridSize) * (100 / (gridSize - 1))}% ${Math.floor(i / gridSize) * (100 / (gridSize - 1))}%`,
          backgroundSize: `${gridSize * 100}%`,
        }}
      ></div>
    );
  }

  return (
    <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-between gap-8 px-8 py-16 bg-background text-foreground overflow-hidden">
      <div
        ref={gridRef}
        className="w-full md:w-1/2 grid grid-cols-3 grid-rows-3 gap-[15px] max-w-sm rounded-2xl shadow-lg overflow-hidden relative z-10 cursor-pointer"
        style={{ aspectRatio: '5 / 6' }}
      >
        {tiles}
      </div>

      <div className="w-full md:w-1/2 space-y-6 text-center md:text-left relative z-20">
        <h1 className="hero-text text-5xl font-bold tracking-tight leading-tight relative">
          Frontend Architect &<br />
          Full-Stack Developer
        </h1>
        <p className="hero-text text-lg text-muted-foreground max-w-lg mx-auto md:mx-0 relative">
          7+ years of experience building production-ready apps, leading teams, and delivering seamless UX across fintech, AI, and blockchain projects.
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
