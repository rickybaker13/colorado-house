'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Gallery organized by room/area, starting with exterior
  const galleryImages: GalleryImage[] = [
    // Bullion King Lake
    { id: 1, src: '/images/bullion-king-lake.jpg', alt: 'Bullion King Lake reflection', category: 'Bullion King Lake' },
    { id: 2, src: '/images/bullion-king-lake-2.jpg', alt: 'Dramatic rocky peaks', category: 'Bullion King Lake' },
    { id: 3, src: '/images/bullion-king-lake-3.jpg', alt: 'Alpine lake vista', category: 'Bullion King Lake' },
    { id: 4, src: '/images/bullion-king-lake-4.jpg', alt: 'Emerald waters', category: 'Bullion King Lake' },
    { id: 5, src: '/images/bullion-king-lake-5.jpg', alt: 'Wildflowers by the lake', category: 'Bullion King Lake' },
    { id: 6, src: '/images/bullion-king-lake-6.jpg', alt: 'Alpine scenic view', category: 'Bullion King Lake' },
    { id: 7, src: '/images/bullion-king-lake-7.jpg', alt: 'Crystal clear waters', category: 'Bullion King Lake' },
    { id: 8, src: '/images/bullion-king-lake-8.jpg', alt: 'Mountain reflections', category: 'Bullion King Lake' },
    { id: 9, src: '/images/bullion-king-lake-9.jpg', alt: 'Alpine panorama', category: 'Bullion King Lake' },

    // Exterior
    { id: 10, src: '/images/exterior-1.jpg', alt: 'Front exterior view', category: 'Exterior' },
    { id: 11, src: '/images/exterior-2.jpg', alt: 'Entrance area', category: 'Exterior' },
    { id: 12, src: '/images/exterior-3.jpg', alt: 'Back patio and deck', category: 'Exterior' },

    // Living Room
    { id: 13, src: '/images/living-room-1.jpg', alt: 'Living room seating', category: 'Living Room' },
    { id: 14, src: '/images/living-room-2.jpg', alt: 'Main living area', category: 'Living Room' },

    // Dining
    { id: 15, src: '/images/dining-1.jpg', alt: 'Dining area', category: 'Dining' },

    // Kitchen
    { id: 16, src: '/images/kitchen-1.jpg', alt: 'Kitchen overview', category: 'Kitchen' },
    { id: 17, src: '/images/kitchen-2.jpg', alt: 'Kitchen appliances', category: 'Kitchen' },
    { id: 18, src: '/images/kitchen-3.jpg', alt: 'Kitchen details', category: 'Kitchen' },

    // Master Bedroom
    { id: 19, src: '/images/bedroom-master-1.jpg', alt: 'Master bedroom', category: 'Master Bedroom' },

    // Bathrooms
    { id: 20, src: '/images/bathroom-1.jpg', alt: 'Master bathroom', category: 'Bathrooms' },
    { id: 21, src: '/images/bathroom-2.jpg', alt: 'Guest bathroom', category: 'Bathrooms' },

    // Guest Bedrooms
    { id: 22, src: '/images/bedroom-guest-1.jpg', alt: 'Guest bedroom 1', category: 'Guest Bedrooms' },
    { id: 23, src: '/images/bedroom-guest-2.jpg', alt: 'Guest bedroom 2', category: 'Guest Bedrooms' },

    // Utilities
    { id: 24, src: '/images/laundry.jpg', alt: 'Laundry room', category: 'Utilities' },

    // Views & Details
    { id: 25, src: '/images/views-1.jpg', alt: 'Mountain views', category: 'Views' },
    { id: 26, src: '/images/views-2.jpg', alt: 'Property views', category: 'Views' },
    { id: 27, src: '/images/detail-1.jpg', alt: 'Interior detail 1', category: 'Views' },
    { id: 28, src: '/images/detail-2.jpg', alt: 'Interior detail 2', category: 'Views' },
    { id: 29, src: '/images/detail-3.jpg', alt: 'Interior detail 3', category: 'Views' },
  ];

  const categories = ['Bullion King Lake', 'Exterior', 'Living Room', 'Dining', 'Kitchen', 'Master Bedroom', 'Guest Bedrooms', 'Bathrooms', 'Utilities', 'Views'];

  const groupedImages = categories.map(category => ({
    category,
    images: galleryImages.filter(img => img.category === category),
  }));

  return (
    <main className="bg-white pt-16">
      {/* Hero Section */}
      <section className="relative w-full h-80 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary-medium to-primary-light"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=2000&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <motion.div
          className="relative z-10 text-center text-white"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold font-display mb-4">Photo Gallery</h1>
          <p className="text-xl text-accent-sky">Explore the Purgatory Townhouse</p>
        </motion.div>
      </section>

      {/* Gallery Sections */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {groupedImages.map((section) => (
            section.images.length > 0 && (
              <motion.div
                key={section.category}
                className="mb-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold font-display text-primary-dark mb-8">
                  {section.category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.images.map((image) => (
                    <motion.div
                      key={image.id}
                      className="relative aspect-auto h-64 cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedImage(image)}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-contain bg-gray-100 hover:scale-105 transition-transform duration-300"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            className="relative max-w-4xl w-full h-auto"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
              />
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <p className="text-white text-center mt-4 text-lg">{selectedImage.alt}</p>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}
