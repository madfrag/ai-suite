'use client';
import { Button } from '@radix-ui/themes';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { a } from 'framer-motion/client';

// CONFIGURABLE CONSTANTS
const TILE_MOVE_DISTANCE = 5; // distance each tile moves (same as before)
const TILE_MOVE_SPEED_MIN = 0.8; // min speed (seconds)
const TILE_MOVE_SPEED_MAX = 1.2; // max speed (seconds)
const TILE_GAP_PX = 5; // gap between tiles in px
const TILE_PADDING_PX = 16; // padding around the whole grid (optional)

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
    const gridRef = useRef<HTMLDivElement | null>(null);
    const swapIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const [animations, setAnimations] = useState<gsap.core.Tween[]>([]);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    const initialImageUrl =
        'https://scontent-muc2-1.xx.fbcdn.net/v/t39.30808-6/461646289_26846624574983477_6518261632323745174_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=4b58ac&_nc_ohc=3d09xHJsN-QQ7kNvwF5XwvS&_nc_oc=Adn7anN6Ru0Cs8DL_auN6oqqot5A2hiz2kD-kyij860fqe9yvRmwmymnrHaSz_DRzm5bakQ65a35pZuRrP4iKQ5b&_nc_zt=23&_nc_ht=scontent-muc2-1.xx&_nc_gid=22c7WQOgc__TqdsSiUoJoQ&oh=00_AfIudIj7uaqdOo5cYCO2zP0D5jcozE8XrtUJqVOss6H6uA&oe=6821583A';

    const gridSize = 3;

    // Track container size dynamically
    useEffect(() => {
        if (!gridRef.current) return;
        const observer = new ResizeObserver((entries) => {
            // Loop through each entry in the ResizeObserver entries
            for (let entry of entries) {
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
        img.src = initialImageUrl;
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
            const rows = [
                tiles.slice(0, 3),
                tiles.slice(3, 6),
                tiles.slice(6, 9),
            ];

            rows.forEach((rowTiles) => {
                const distance = TILE_MOVE_DISTANCE;

                rowTiles.forEach((tile) => {
                    let direction = 'x';
                    const speed = gsap.utils.random(TILE_MOVE_SPEED_MIN, TILE_MOVE_SPEED_MAX);

                    const animateTile = () => {
                        // const axis = direction === 'x' ? { x: distance, y: 0 } : { y: distance, x: 0 };
                        // const an1 = gsap.to(tile, {
                        //     ...axis,
                        //     duration: speed,
                        //     ease: 'power1.inOut',
                        //     yoyo: true,
                        //     repeat: 1,
                        //     onComplete: () => {
                        //         if (Math.random() < 0.3) {
                        //             direction = direction === 'x' ? 'y' : 'x';
                        //         }
                        //         animateTile();
                        //     },
                        // });

                        const an2 = gsap.to(tile, {
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
                            delay: gsap.utils.random(0, 1), // optional: desync starting point
                          });
                          setAnimations((prev) => [...prev, an2]);
                    };

                    // const animateTile = () => {
                    //     const maxDistance = 15; // tile never goes farther than this from original
                    //     const duration = gsap.utils.random(0.15, 0.3); // fast snap
                    //     const delay = gsap.utils.random(0.1, 0.4); // short pause
                      
                    //     // Choose a random direction: x or y
                    //     const direction = Math.random() < 0.5 ? 'x' : 'y';
                    //     const moveBy = gsap.utils.random(-maxDistance, maxDistance);
                      
                    //     const toVars = {
                    //       [direction]: moveBy,
                    //       duration,
                    //       ease: 'power1.out',
                    //       filter: 'blur(2px)',
                    //       onComplete: () => {
                    //         // Snap back to original position, remove blur
                    //         gsap.to(tile, {
                    //           x: 0,
                    //           y: 0,
                    //           boxShadow: '0 0 8px rgba(255,255,255,0.2)',
                    //           filter: 'blur(0px)',
                    //           duration: 0.25,
                    //           ease: 'power2.out',
                    //           onComplete: () => {
                    //             gsap.delayedCall(delay, animateTile); // loop
                    //           },
                    //         });
                    //       },
                    //     };
                      
                    //     const anim = gsap.to(tile, toVars);
                    //     setAnimations((prev) => [...prev, anim]);
                    // }
                    animateTile();
                });
            });
        }
    }, []);

    // Start image swap interval
    useEffect(() => {
        const startImageSwapInterval = () => {
            // Set an interval to periodically swap images
            swapIntervalRef.current = setInterval(() => {
                // Generate a new random image URL
                const newUrl = `https://picsum.photos/352/428?random=${Date.now()}`;

                // If the grid reference is not available, exit early
                if (!gridRef.current) return;

                // Get all grid tiles and shuffle them randomly
                const tiles = Array.from(gridRef.current.querySelectorAll('.grid-tile'));
                const randomizedTiles = gsap.utils.shuffle(tiles);

                // Iterate over each tile and apply the swap animation
                randomizedTiles.forEach((tile, index) => {
                    const htmlTile = tile as HTMLElement;

                    // Delay the animation for each tile based on its index
                    setTimeout(() => {
                        // Fade out the tile
                        gsap.to(htmlTile, {
                            opacity: 0,
                            duration: 0.5,
                            onComplete: () => {
                                // Get the column and row data attributes of the tile
                                const col = parseInt(htmlTile.dataset.col!);
                                const row = parseInt(htmlTile.dataset.row!);

                                // Ensure container and image dimensions are available
                                if (
                                    containerSize.width > 0 &&
                                    containerSize.height > 0 &&
                                    imageSize.width > 0 &&
                                    imageSize.height > 0
                                ) {
                                    // Calculate the scale to fit the image within the container
                                    const scale = Math.max(
                                        containerSize.width / imageSize.width,
                                        containerSize.height / imageSize.height
                                    );

                                    // Calculate the scaled dimensions of the image
                                    const scaledWidth = imageSize.width * scale;
                                    const scaledHeight = imageSize.height * scale;

                                    // Calculate the dimensions of each tile in the container
                                    const containerTileWidth = containerSize.width / gridSize;
                                    const containerTileHeight = containerSize.height / gridSize;

                                    // Calculate the offset to center the image
                                    const offsetX = (scaledWidth - containerSize.width) / 2;
                                    const offsetY = (scaledHeight - containerSize.height) / 2;

                                    // Calculate the background position for the tile
                                    const posX = (containerTileWidth * col) * -1 - offsetX;
                                    const posY = (containerTileHeight * row) * -1 - offsetY;

                                    // Update the tile's background image and position
                                    htmlTile.style.backgroundImage = `url(${newUrl})`;
                                    htmlTile.style.backgroundSize = `${scaledWidth}px ${scaledHeight}px`;
                                    htmlTile.style.backgroundPosition = `${posX}px ${posY}px`;
                                }

                                // Fade the tile back in with the new image
                                gsap.to(htmlTile, {
                                    opacity: 1,
                                    duration: 0.5,
                                });
                            },
                        });
                    }, index * 400); // Delay each tile's animation by 400ms
                });
            }, 8000); // Swap images every 8 seconds
        };

        startImageSwapInterval();

        return () => {
            if (swapIntervalRef.current) clearInterval(swapIntervalRef.current);
        };
    }, [containerSize, imageSize]);

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

            const posX = (containerTileWidth * col) * -1 - offsetX;
            const posY = (containerTileHeight * row) * -1 - offsetY;

            backgroundStyles = {
                backgroundImage: `url(${initialImageUrl})`,
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
                    // Restart the image swap interval
                    if (!swapIntervalRef.current) {
                        const startImageSwapInterval = () => {
                            swapIntervalRef.current = setInterval(() => {
                                const newUrl = `https://picsum.photos/400/600?random=${Date.now()}`;

                                if (!gridRef.current) return;
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

                                                    const posX = (containerTileWidth * col) * -1 - offsetX;
                                                    const posY = (containerTileHeight * row) * -1 - offsetY;

                                                    htmlTile.style.backgroundImage = `url(${newUrl})`;
                                                    htmlTile.style.backgroundSize = `${scaledWidth}px ${scaledHeight}px`;
                                                    htmlTile.style.backgroundPosition = `${posX}px ${posY}px`;
                                                }

                                                gsap.to(htmlTile, {
                                                    opacity: 1,
                                                    duration: 0.5,
                                                });
                                            },
                                        });
                                    }, index * 400);
                                });
                            }, 6000);
                        };
                        startImageSwapInterval();
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
