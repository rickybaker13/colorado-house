'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  autoPlay?: boolean;
  interval?: number;
}

export default function ImageCarousel({
  images,
  alt,
  autoPlay = true,
  interval = 6000,
}: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, images.length]);

  const navigate = useCallback(
    (dir: number) => {
      setDirection(dir);
      setCurrent((prev) =>
        dir === 1
          ? (prev + 1) % images.length
          : (prev - 1 + images.length) % images.length
      );
    },
    [images.length]
  );

  return (
    <div className="relative w-full h-[50vh] md:h-[65vh] lg:h-[75vh] overflow-hidden bg-cream group">
      {/* Images */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={images[current]}
            alt={`${alt} - ${current + 1}`}
            fill
            className="object-cover cinematic-image"
            sizes="100vw"
            priority={current === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation - appears on hover */}
      <button
        onClick={() => navigate(-1)}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Previous image"
      >
        <div className="bg-snow/80 backdrop-blur-sm hover:bg-snow p-3 rounded-full transition-colors">
          <ChevronLeft size={20} className="text-charcoal" />
        </div>
      </button>

      <button
        onClick={() => navigate(1)}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Next image"
      >
        <div className="bg-snow/80 backdrop-blur-sm hover:bg-snow p-3 rounded-full transition-colors">
          <ChevronRight size={20} className="text-charcoal" />
        </div>
      </button>

      {/* Progress dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > current ? 1 : -1);
              setCurrent(index);
            }}
            className="group/dot p-1"
            aria-label={`Go to image ${index + 1}`}
          >
            <span
              className={`block h-0.5 rounded-full transition-all duration-500 ${
                index === current
                  ? 'w-8 bg-white'
                  : 'w-4 bg-white/30 group-hover/dot:bg-white/60'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Counter */}
      <div className="absolute top-6 right-6 font-sans text-xs tracking-widest text-white/40 z-10">
        {String(current + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
      </div>
    </div>
  );
}
