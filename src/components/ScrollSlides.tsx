'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@radix-ui/themes';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const slidesData = [
  { id: 1, bg: '#FF6B6B' },
  { id: 2, bg: '#6BCB77' },
  { id: 3, bg: '#4D96FF' },
  { id: 4, bg: '#FFB347' },
  { id: 5, bg: '#A974FF' },
  { id: 6, bg: '#FFD93D' },
  { id: 7, bg: '#FF6F61' },
  { id: 8, bg: '#6BCB77' },
  { id: 9, bg: '#36C9C6' },
  { id: 10, bg: '#E36414' },
];

export default function ScrollSlides() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const slides = gsap.utils.toArray<HTMLElement>('.slide');

    slides.forEach((slide, index) => {
      if (index === 0) {
        // Pin the first slide as before
        ScrollTrigger.create({
          trigger: slide,
          start: 'top top',
          endTrigger: slides[1],
          end: 'top top',
          pin: true,
          pinSpacing: false,
        });

        // Shrink effect: start at 2/3, end at 1/3
        gsap.to(slide, {
          scale: 0.95,
          ease: 'none',
          scrollTrigger: {
            trigger: slides[1],
            start: 'top 66.6%',
            end: 'top 33.3%',
            scrub: true,
          },
        });

        // Slide up effect: start at 1/3, end at top
        gsap.to(slide, {
          yPercent: -100,
          ease: 'none',
          scrollTrigger: {
            trigger: slides[1],
            start: 'top 33.3%',
            end: 'top top',
            scrub: true,
          },
        });
      } else if (index === 1) {
        // ✅ No opacity fade; just scroll naturally or simple slide-in
        gsap.fromTo(
          slide,
          { y: 100 },
          {
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: slide,
              start: 'top bottom',
              end: 'top top',
              scrub: true,
            },
          }
        );
      } else {
        const animationType = (index - 1) % 3; // 3 animations: fade, slide-up, scale

        switch (animationType) {
          case 0:
            gsap.fromTo(
              slide,
              { opacity: 0 },
              {
                opacity: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: slide,
                  start: 'top bottom',
                  end: 'top top',
                  scrub: true,
                },
              }
            );
            break;
          case 1:
            gsap.fromTo(
              slide,
              { y: 100 },
              {
                y: 0,
                ease: 'none',
                scrollTrigger: {
                  trigger: slide,
                  start: 'top bottom',
                  end: 'top top',
                  scrub: true,
                },
              }
            );
            break;
          case 2:
            gsap.fromTo(
              slide,
              { scale: 0.8 },
              {
                scale: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: slide,
                  start: 'top bottom',
                  end: 'top top',
                  scrub: true,
                },
              }
            );
            break;
          default:
            break;
        }
      }
    });

    // Back to top button trigger
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      onUpdate: (self) => {
        setShowTop(self.scroll() > window.innerHeight);
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef}>
      {slidesData.map((slide) => (
        <section
          key={slide.id}
          className="slide flex flex-col items-center justify-center relative"
          style={{
            backgroundColor: slide.bg,
            height: '100vh',
            width: '100vw',
            perspective: slide.id === 1 ? '1000px' : 'none',
          }}
        >
          <h1 className="text-5xl font-bold text-white" style={{ mixBlendMode: 'difference' }}>
            Slide {slide.id}
          </h1>
        </section>
      ))}

      {showTop && (
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-4 right-auto left-[50%] animate-bounce z-50 cursor-pointer"
          variant="classic"
        >
          <ArrowUp className="w-8 h-8" />
          Top
        </Button>
      )}
    </div>
  );
}
