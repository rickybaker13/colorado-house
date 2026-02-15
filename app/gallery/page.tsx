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
  span?: 'wide' | 'tall' | 'normal';
}

export default function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const galleryImages: GalleryImage[] = [
    // Bullion King Lake
    { id: 1, src: '/images/bullion-king-lake.jpg', alt: 'Bullion King Lake reflection', category: 'Alpine', span: 'wide' },
    { id: 2, src: '/images/bullion-king-lake-2.jpg', alt: 'Dramatic rocky peaks at Bullion King Lake', category: 'Alpine' },
    { id: 3, src: '/images/bullion-king-lake-3.jpg', alt: 'Alpine lake vista', category: 'Alpine', span: 'tall' },
    { id: 4, src: '/images/bullion-king-lake-4.jpg', alt: 'Emerald alpine waters', category: 'Alpine' },
    { id: 5, src: '/images/bullion-king-lake-5.jpg', alt: 'Wildflowers by the lake', category: 'Alpine' },
    { id: 6, src: '/images/bullion-king-lake-6.jpg', alt: 'Alpine scenic view', category: 'Alpine', span: 'wide' },
    { id: 7, src: '/images/bullion-king-lake-7.jpg', alt: 'Crystal clear alpine waters', category: 'Alpine' },
    { id: 8, src: '/images/bullion-king-lake-8.jpg', alt: 'Mountain reflections in water', category: 'Alpine' },
    { id: 9, src: '/images/bullion-king-lake-9.jpg', alt: 'Alpine panorama at Bullion King', category: 'Alpine' },

    // Exterior
    { id: 10, src: '/images/exterior-1.jpg', alt: 'Townhouse front exterior', category: 'Exterior', span: 'wide' },
    { id: 11, src: '/images/exterior-2.jpg', alt: 'Entrance and approach', category: 'Exterior' },
    { id: 12, src: '/images/exterior-3.jpg', alt: 'Back patio and deck area', category: 'Exterior' },

    // Interior
    { id: 13, src: '/images/living-room-1.jpg', alt: 'Living room with mountain views', category: 'Interior', span: 'wide' },
    { id: 14, src: '/images/living-room-2.jpg', alt: 'Main living area seating', category: 'Interior' },
    { id: 15, src: '/images/dining-1.jpg', alt: 'Dining area', category: 'Interior' },
    { id: 16, src: '/images/kitchen-1.jpg', alt: 'Full kitchen overview', category: 'Interior', span: 'tall' },
    { id: 17, src: '/images/kitchen-2.jpg', alt: 'Kitchen appliances and workspace', category: 'Interior' },
    { id: 18, src: '/images/kitchen-3.jpg', alt: 'Kitchen details and finishes', category: 'Interior' },

    // Bedrooms & Baths
    { id: 19, src: '/images/bedroom-master-1.jpg', alt: 'Master bedroom suite', category: 'Bedrooms', span: 'wide' },
    { id: 20, src: '/images/bathroom-1.jpg', alt: 'Master bathroom', category: 'Bedrooms' },
    { id: 21, src: '/images/bathroom-2.jpg', alt: 'Guest bathroom', category: 'Bedrooms' },
    { id: 22, src: '/images/bedroom-guest-1.jpg', alt: 'Guest bedroom with queen bed', category: 'Bedrooms' },
    { id: 23, src: '/images/bedroom-guest-2.jpg', alt: 'Second guest bedroom', category: 'Bedrooms' },

    // Views
    { id: 25, src: '/images/views-1.jpg', alt: 'Mountain views from the property', category: 'Views', span: 'wide' },
    { id: 26, src: '/images/views-2.jpg', alt: 'Sunset over the San Juans', category: 'Views' },
    { id: 27, src: '/images/detail-1.jpg', alt: 'Interior architectural detail', category: 'Views' },
    { id: 28, src: '/images/detail-2.jpg', alt: 'Design details throughout', category: 'Views' },
    { id: 29, src: '/images/detail-3.jpg', alt: 'Finishing touches', category: 'Views' },
  ];

  const categories = ['All', 'Alpine', 'Exterior', 'Interior', 'Bedrooms', 'Views'];

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
          className="object-cover cinematic-image"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/40" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.p
            className="font-sans text-caption uppercase tracking-[0.25em] text-white/50 mb-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Photography
          </motion.p>
          <motion.h1
            className="font-display text-display-xl text-white font-light"
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
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-6 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedIndex(null);
              }}
              className={`font-sans text-sm tracking-wider whitespace-nowrap transition-all duration-300 pb-1 ${
                activeCategory === cat
                  ? 'text-charcoal border-b border-charcoal'
                  : 'text-warm-gray hover:text-charcoal'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto font-sans text-xs text-warm-gray self-center">
            {filteredImages.length} photos
          </span>
        </div>
      </section>

      {/* Masonry-style grid */}
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
                  transition={{ duration: 0.4, delay: index * 0.03 }}
                  className="relative mb-3 md:mb-4 break-inside-avoid cursor-pointer group overflow-hidden"
                  onClick={() => setSelectedIndex(index)}
                >
                  <div
                    className={`relative ${
                      image.span === 'tall'
                        ? 'aspect-[3/4]'
                        : image.span === 'wide'
                        ? 'aspect-[16/10]'
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
                  <p className="mt-2 font-sans text-xs text-warm-gray tracking-wide">
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
            {/* Close button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white z-50 p-2 transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-white z-50 p-2 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-white z-50 p-2 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={32} />
            </button>

            {/* Image */}
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

            {/* Caption */}
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="font-sans text-sm text-white/60 tracking-wide">
                {selectedImage.alt}
              </p>
              <p className="font-sans text-xs text-white/30 mt-1">
                {(selectedIndex ?? 0) + 1} / {filteredImages.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
