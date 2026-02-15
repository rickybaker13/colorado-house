'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  orientation: 'landscape' | 'portrait';
}

export default function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  /* CORRECTED photo assignments based on actual image content and dimensions */
  const galleryImages: GalleryImage[] = [
    // Alpine scenery (all landscape 1280x960 except alpine-valley & waterfall which are portrait)
    { id: 1, src: '/images/bullion-king-lake.jpg', alt: 'Bullion King Lake — peaks and reflection', category: 'Alpine', orientation: 'landscape' },
    { id: 2, src: '/images/bullion-king-lake-2.jpg', alt: 'Rocky crags above Bullion King Lake', category: 'Alpine', orientation: 'landscape' },
    { id: 3, src: '/images/bullion-king-lake-3.jpg', alt: 'Mountain panorama near Purgatory', category: 'Alpine', orientation: 'landscape' },
    { id: 4, src: '/images/bullion-king-lake-4.jpg', alt: 'Emerald alpine waters and wildflowers', category: 'Alpine', orientation: 'landscape' },
    { id: 5, src: '/images/bullion-king-lake-5.jpg', alt: 'Alpine lake and summer wildflowers', category: 'Alpine', orientation: 'landscape' },
    { id: 6, src: '/images/bullion-king-lake-6.jpg', alt: 'San Juan peaks from the lake trail', category: 'Alpine', orientation: 'landscape' },
    { id: 7, src: '/images/hero-mountain.jpg', alt: 'Snow-capped San Juan peaks with pine forest', category: 'Alpine', orientation: 'landscape' },
    { id: 8, src: '/images/alpine-valley.jpg', alt: 'Alpine valley deep in the San Juans', category: 'Alpine', orientation: 'portrait' },
    { id: 9, src: '/images/waterfall.jpg', alt: 'Mountain waterfall in the San Juan wilderness', category: 'Alpine', orientation: 'portrait' },
    { id: 10, src: '/images/wildflowers-pass.jpg', alt: 'Wildflower meadow at alpine pass', category: 'Alpine', orientation: 'portrait' },

    // The Townhouse exterior & grounds
    { id: 11, src: '/images/kitchen-1.jpg', alt: 'Townhouse exterior — modern mountain architecture', category: 'Exterior', orientation: 'portrait' },
    { id: 12, src: '/images/detail-3.jpg', alt: 'Front entrance with smart lock', category: 'Exterior', orientation: 'portrait' },
    { id: 13, src: '/images/kitchen-3.jpg', alt: 'Entry hallway with runner rug', category: 'Exterior', orientation: 'portrait' },

    // Living areas
    { id: 14, src: '/images/views-1.jpg', alt: 'Great room — vaulted ceilings, fireplace, open kitchen', category: 'Living', orientation: 'landscape' },
    { id: 15, src: '/images/views-2.jpg', alt: 'Living room from loft showing full open layout', category: 'Living', orientation: 'landscape' },
    { id: 16, src: '/images/bedroom-guest-2.jpg', alt: 'Floor-to-ceiling stone fireplace from sofa', category: 'Living', orientation: 'portrait' },
    { id: 17, src: '/images/detail-1.jpg', alt: 'Leather sofa and mountain art detail', category: 'Living', orientation: 'portrait' },
    { id: 18, src: '/images/dining-1.jpg', alt: 'Dining table with tree-ring wall art', category: 'Living', orientation: 'portrait' },
    { id: 19, src: '/images/kitchen-2.jpg', alt: 'Kitchen island with pendant lights and knotty alder cabinets', category: 'Living', orientation: 'landscape' },

    // Bedrooms & Baths
    { id: 20, src: '/images/exterior-3.jpg', alt: 'Master bedroom — king bed with Pendleton blanket', category: 'Bedrooms', orientation: 'portrait' },
    { id: 21, src: '/images/exterior-2.jpg', alt: 'Guest bedroom — green bedding with mountain art', category: 'Bedrooms', orientation: 'portrait' },
    { id: 22, src: '/images/living-room-1.jpg', alt: 'Guest bedroom — queen bed with orange duvet', category: 'Bedrooms', orientation: 'portrait' },
    { id: 23, src: '/images/living-room-2.jpg', alt: 'Bunk room — two bunks, sofa, TV, and Xbox', category: 'Bedrooms', orientation: 'landscape' },
    { id: 24, src: '/images/exterior-1.jpg', alt: 'Upstairs sitting nook with chair and deer art', category: 'Bedrooms', orientation: 'portrait' },
    { id: 25, src: '/images/bathroom-1.jpg', alt: 'Glass-walled walk-in shower', category: 'Bedrooms', orientation: 'portrait' },
    { id: 26, src: '/images/bathroom-2.jpg', alt: 'Bathroom with marble vanity and fixtures', category: 'Bedrooms', orientation: 'landscape' },

    // Details & extras
    { id: 27, src: '/images/bedroom-master-1.jpg', alt: 'Entry foyer with wood details', category: 'Details', orientation: 'portrait' },
    { id: 28, src: '/images/detail-2.jpg', alt: 'In-unit laundry area', category: 'Details', orientation: 'portrait' },
    { id: 29, src: '/images/laundry.jpg', alt: 'LG washer and dryer', category: 'Details', orientation: 'landscape' },
    { id: 30, src: '/images/bedroom-guest-1.jpg', alt: 'Upper hallway looking toward bedrooms', category: 'Details', orientation: 'landscape' },
  ];

  const categories = ['All', 'Alpine', 'Exterior', 'Living', 'Bedrooms', 'Details'];

  const filteredImages =
    activeCategory === 'All'
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex(
      selectedIndex === 0 ? filteredImages.length - 1 : selectedIndex - 1
    );
  }, [selectedIndex, filteredImages.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex(
      selectedIndex === filteredImages.length - 1 ? 0 : selectedIndex + 1
    );
  }, [selectedIndex, filteredImages.length]);

  const selectedImage = selectedIndex !== null ? filteredImages[selectedIndex] : null;

  return (
    <main className="bg-snow min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden grain">
        <Image
          src="/images/bullion-king-lake-5.jpg"
          alt="Alpine wildflowers and mountain lake"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/50" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.p
            className="font-sans text-caption uppercase tracking-[0.3em] text-white/70 mb-5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            The Townhouse &amp; San Juan Mountains
          </motion.p>
          <motion.h1
            className="font-display text-display-xl text-white drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Gallery
          </motion.h1>
        </div>
      </section>

      {/* Filter bar */}
      <section className="sticky top-18 z-30 bg-snow/95 backdrop-blur-md border-b border-stone-pale/40">
        <div className="max-w-7xl mx-auto px-6 py-5 flex gap-8 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedIndex(null);
              }}
              className={`font-sans text-label-sm tracking-wider whitespace-nowrap transition-all duration-300 pb-1 ${
                activeCategory === cat
                  ? 'text-charcoal border-b-2 border-charcoal'
                  : 'text-warm-gray hover:text-charcoal'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto font-sans text-caption text-warm-gray self-center whitespace-nowrap">
            {filteredImages.length} photos
          </span>
        </div>
      </section>

      {/* Masonry grid — using correct aspect ratios per image orientation */}
      <section className="py-10 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 md:gap-4">
            <AnimatePresence mode="popLayout">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.02 }}
                  className="relative mb-3 md:mb-4 break-inside-avoid cursor-pointer group overflow-hidden"
                  onClick={() => setSelectedIndex(index)}
                >
                  <div
                    className={`relative ${
                      image.orientation === 'portrait'
                        ? 'aspect-[3/4]'
                        : 'aspect-[4/3]'
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  </div>
                  <p className="mt-2.5 mb-1 font-sans text-caption-sm text-warm-gray tracking-wide">
                    {image.alt}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-charcoal/95 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setSelectedIndex(null)}
          >
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white z-50 p-2 transition-colors"
              aria-label="Close"
            >
              <X size={28} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-white z-50 p-3 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={36} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-white z-50 p-3 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={36} />
            </button>

            <motion.div
              key={selectedImage.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-[90vw] h-[80vh] md:w-[85vw] md:h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </motion.div>

            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="font-sans text-label text-white/70 tracking-wide">
                {selectedImage.alt}
              </p>
              <p className="font-sans text-caption text-white/40 mt-2">
                {(selectedIndex ?? 0) + 1} / {filteredImages.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
