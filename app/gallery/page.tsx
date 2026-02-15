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
    // Alpine scenery
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
    { id: 31, src: '/images/ice-lake-closeup.jpg', alt: 'Turquoise waters of Ice Lake', category: 'Alpine', orientation: 'landscape' },
    { id: 32, src: '/images/wildflower-meadow-peaks.jpg', alt: 'Wildflower meadow with dramatic San Juan peaks', category: 'Alpine', orientation: 'portrait' },
    { id: 33, src: '/images/sunflowers-mountain-valley.jpg', alt: 'Sunflowers and alpine valley', category: 'Alpine', orientation: 'portrait' },
    { id: 34, src: '/images/waterfall-gorge.jpg', alt: 'Waterfall in forested gorge', category: 'Alpine', orientation: 'portrait' },
    { id: 35, src: '/images/engineer-mountain.jpg', alt: 'Engineer Mountain with pine forest', category: 'Alpine', orientation: 'landscape' },
    { id: 36, src: '/images/kayak-mountain-lake.jpg', alt: 'Kayaking on Molas Lake with mountain views', category: 'Alpine', orientation: 'landscape' },
    { id: 37, src: '/images/alpenglow-sunset.jpg', alt: 'Alpenglow sunset on the San Juan Mountains', category: 'Alpine', orientation: 'landscape' },
    { id: 38, src: '/images/ice-lakes-trail.jpg', alt: 'Trail to Ice Lake through wildflower meadows', category: 'Alpine', orientation: 'landscape' },
    { id: 39, src: '/images/ice-lake-panoramic.jpg', alt: 'Ice Lake panoramic — turquoise water and peaks', category: 'Alpine', orientation: 'landscape' },
    { id: 40, src: '/images/ice-lake-shore.jpg', alt: 'Ice Lake shore with deep blue water', category: 'Alpine', orientation: 'landscape' },
    { id: 41, src: '/images/ice-lake-basin-wide.jpg', alt: 'Ice Lake Basin wide view', category: 'Alpine', orientation: 'landscape' },
    { id: 42, src: '/images/upper-ice-lake.jpg', alt: 'Upper Ice Lake beneath rocky ridgeline', category: 'Alpine', orientation: 'landscape' },
    { id: 43, src: '/images/columbine-lake.jpg', alt: 'Columbine Lake — sapphire alpine waters', category: 'Alpine', orientation: 'landscape' },
    { id: 44, src: '/images/bullion-king-lake-7.jpg', alt: 'Bullion King Lake nestled among San Juan peaks', category: 'Alpine', orientation: 'landscape' },
    { id: 45, src: '/images/mesa-verde-cliff-dwelling.jpg', alt: 'Ancestral Puebloan cliff dwelling at Mesa Verde', category: 'Alpine', orientation: 'landscape' },
    { id: 46, src: '/images/mesa-verde-cliff-palace.jpg', alt: 'Cliff Palace — largest cliff dwelling in North America', category: 'Alpine', orientation: 'landscape' },

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
    <main style={{ backgroundColor: '#fafaf8', minHeight: '100vh' }}>
      {/* Hero */}
      <section className="relative overflow-hidden grain" style={{ height: '55vh', minHeight: '380px' }}>
        <Image
          src="/images/bullion-king-lake-5.jpg"
          alt="Alpine wildflowers and mountain lake"
          fill
          className="object-cover"
          sizes="100vw"
          priority
          quality={90}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.45) 100%)' }}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.p
            className="font-sans"
            style={{ fontSize: '13px', letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            The Townhouse &amp; San Juan Mountains
          </motion.p>
          <motion.h1
            className="font-display"
            style={{ fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 300, color: '#ffffff', textShadow: '0 2px 15px rgba(0,0,0,0.3)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Gallery
          </motion.h1>
        </div>
      </section>

      {/* Filter bar */}
      <section
        className="sticky z-30"
        style={{ top: '72px', backgroundColor: 'rgba(250,250,248,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(212,165,116,0.25)' }}
      >
        <div className="max-w-7xl mx-auto px-6 flex overflow-x-auto" style={{ padding: '18px 24px', gap: '32px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedIndex(null);
              }}
              className="font-sans whitespace-nowrap transition-all duration-300"
              style={{
                fontSize: '13px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase' as const,
                paddingBottom: '4px',
                color: activeCategory === cat ? '#1a1a2e' : '#9a9590',
                borderBottom: activeCategory === cat ? '2px solid #1a1a2e' : '2px solid transparent',
                background: 'none',
                border: 'none',
                borderBottomWidth: '2px',
                borderBottomStyle: 'solid',
                borderBottomColor: activeCategory === cat ? '#1a1a2e' : 'transparent',
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
          <span className="font-sans self-center whitespace-nowrap" style={{ marginLeft: 'auto', fontSize: '13px', color: '#9a9590' }}>
            {filteredImages.length} photos
          </span>
        </div>
      </section>

      {/* Masonry grid */}
      <section style={{ padding: '40px 16px 60px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="columns-1 sm:columns-2 lg:columns-3" style={{ gap: '12px' }}>
            <AnimatePresence mode="popLayout">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.02 }}
                  className="relative break-inside-avoid cursor-pointer group overflow-hidden"
                  style={{ marginBottom: '12px' }}
                  onClick={() => setSelectedIndex(index)}
                >
                  <div
                    className="relative"
                    style={{ aspectRatio: image.orientation === 'portrait' ? '3/4' : '4/3' }}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={85}
                    />
                    <div
                      className="absolute inset-0 transition-colors duration-500"
                      style={{ backgroundColor: 'rgba(0,0,0,0)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0)')}
                    />
                  </div>
                  <p className="font-sans" style={{ marginTop: '10px', marginBottom: '4px', fontSize: '13px', color: '#9a9590', letterSpacing: '0.03em' }}>
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
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(26,26,46,0.95)', backdropFilter: 'blur(4px)' }}
            onClick={() => setSelectedIndex(null)}
          >
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute z-50 transition-colors duration-300"
              style={{ top: '24px', right: '24px', color: 'rgba(255,255,255,0.6)', padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}
              aria-label="Close"
            >
              <X size={28} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute z-50 transition-colors duration-300"
              style={{ left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', padding: '12px', background: 'none', border: 'none', cursor: 'pointer' }}
              aria-label="Previous image"
            >
              <ChevronLeft size={36} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute z-50 transition-colors duration-300"
              style={{ right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', padding: '12px', background: 'none', border: 'none', cursor: 'pointer' }}
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
              className="relative"
              style={{ width: '90vw', height: '80vh', maxWidth: '1400px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                sizes="90vw"
                quality={90}
              />
            </motion.div>

            <div className="absolute left-0 right-0 text-center" style={{ bottom: '32px' }}>
              <p className="font-sans" style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.04em' }}>
                {selectedImage.alt}
              </p>
              <p className="font-sans" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>
                {(selectedIndex ?? 0) + 1} / {filteredImages.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
