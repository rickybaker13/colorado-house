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
    // Exterior (Files 16-20)
    { id: 1, src: '/images/file_16---761b1f60-aad3-46c2-92ec-168013307819.jpg', alt: 'Front exterior view', category: 'Exterior' },
    { id: 2, src: '/images/file_16---a857c490-c65e-4141-8926-4f703dd71093.jpg', alt: 'Side exterior view', category: 'Exterior' },
    { id: 3, src: '/images/file_16---be5aa77b-721c-4d72-b3a6-1e275b1146a8.jpg', alt: 'Property landscape', category: 'Exterior' },
    { id: 4, src: '/images/file_17---0cb12f56-dacc-4d89-8db8-51119bbacffb.jpg', alt: 'Entrance area', category: 'Exterior' },
    { id: 5, src: '/images/file_17---371bf9e1-835c-41bc-8298-bf9d1aa2fe82.jpg', alt: 'Driveway', category: 'Exterior' },
    { id: 6, src: '/images/file_18---4ac1ac93-37a2-4ac5-92f9-59f758dd2769.jpg', alt: 'Back patio', category: 'Exterior' },
    { id: 7, src: '/images/file_18---624c6e6e-1451-42a5-96be-3ba16b46d073.jpg', alt: 'Deck view', category: 'Exterior' },

    // Living Room & Common Areas (Files 19-22)
    { id: 8, src: '/images/file_19---33377812-66dc-4cc9-829a-57ab96db3e6c.jpg', alt: 'Living room seating', category: 'Living Room' },
    { id: 9, src: '/images/file_19---bf1f7259-2874-464d-a24a-0536e5035641.jpg', alt: 'Living room fireplace', category: 'Living Room' },
    { id: 10, src: '/images/file_20---24b32a58-6e6a-4b3f-a786-896377a3262f.jpg', alt: 'Main living area', category: 'Living Room' },
    { id: 11, src: '/images/file_20---a7596ca8-dca7-4521-b18f-2c35d09524de.jpg', alt: 'Living room windows', category: 'Living Room' },
    { id: 12, src: '/images/file_21---27344348-a695-4a67-97b3-8d8827f857f4.jpg', alt: 'Dining area', category: 'Dining' },
    { id: 13, src: '/images/file_21---aa9fe536-d343-4eef-80f6-42bf2da04d3c.jpg', alt: 'Dining table', category: 'Dining' },

    // Kitchen (Files 22-24)
    { id: 14, src: '/images/file_22---167abbad-5dcf-4da3-9441-3890180c53a4.jpg', alt: 'Kitchen overview', category: 'Kitchen' },
    { id: 15, src: '/images/file_22---76802c02-b652-45a0-b98b-4c95335ed2f7.jpg', alt: 'Kitchen island', category: 'Kitchen' },
    { id: 16, src: '/images/file_23---27383e6c-b046-4d5f-bc74-ee5a08318d8a.jpg', alt: 'Kitchen appliances', category: 'Kitchen' },
    { id: 17, src: '/images/file_23---b5feb6e2-56d4-47bd-938a-be29a7c1291b.jpg', alt: 'Kitchen cabinets', category: 'Kitchen' },
    { id: 18, src: '/images/file_24---7c149282-e483-4f8f-8c6e-6bab74e78ff4.jpg', alt: 'Kitchen details', category: 'Kitchen' },
    { id: 19, src: '/images/file_24---acb7c4c1-c538-4b15-baa7-177f5732e12e.jpg', alt: 'Kitchen workspace', category: 'Kitchen' },

    // Master Bedroom (Files 25-26)
    { id: 20, src: '/images/file_25---8ad3466e-6274-4180-83f2-75e8832abf40.jpg', alt: 'Master bedroom', category: 'Master Bedroom' },
    { id: 21, src: '/images/file_25---ce0dd055-3c72-448d-97f9-8a261014e242.jpg', alt: 'Master bed detail', category: 'Master Bedroom' },
    { id: 22, src: '/images/file_26---7fc0f5c8-7451-47d4-94c9-e06e22b29551.jpg', alt: 'Master bathroom', category: 'Master Bedroom' },
    { id: 23, src: '/images/file_26---e24e9721-9ae4-42d8-af67-a5b03da7fd2a.jpg', alt: 'Master ensuite', category: 'Master Bedroom' },

    // Guest Bedrooms (Files 27-28)
    { id: 24, src: '/images/file_27---9577bfae-0bde-4656-89b6-4762729f26fd.jpg', alt: 'Guest bedroom 1', category: 'Guest Bedrooms' },
    { id: 25, src: '/images/file_27---a6fcf780-ed28-4b03-a1b0-0c43807ae769.jpg', alt: 'Guest bedroom 2', category: 'Guest Bedrooms' },
    { id: 26, src: '/images/file_28---503953d2-5559-4de3-badd-2632c48ab274.jpg', alt: 'Guest bedroom 3', category: 'Guest Bedrooms' },
    { id: 27, src: '/images/file_28---f254e7f4-7b1a-449e-a6c4-fe96d16fca6f.jpg', alt: 'Guest bedroom 4', category: 'Guest Bedrooms' },

    // Bathrooms & Utilities (Files 29-31)
    { id: 28, src: '/images/file_29---8bbbc3a4-2b3d-4483-b7f0-24384d9c318b.jpg', alt: 'Guest bathroom 1', category: 'Bathrooms' },
    { id: 29, src: '/images/file_29---a37a3409-1999-4aa4-86a7-2d757a56f33c.jpg', alt: 'Guest bathroom 2', category: 'Bathrooms' },
    { id: 30, src: '/images/file_30---810d58c5-c112-4d45-addc-b55c3aaf0ad4.jpg', alt: 'Guest bathroom 3', category: 'Bathrooms' },
    { id: 31, src: '/images/file_30---e6bfd304-e431-4767-8a80-e9515bfb7a46.jpg', alt: 'Laundry room', category: 'Utilities' },

    // Views & Details (Files 32-33)
    { id: 32, src: '/images/file_31---70133f82-ca7f-42d0-8dcc-e7ef9c716ca7.jpg', alt: 'Mountain views', category: 'Views' },
    { id: 33, src: '/images/file_31---c9b6643e-5fb4-414a-aebf-f499c4a9105c.jpg', alt: 'Property views', category: 'Views' },
  ];

  const categories = ['Exterior', 'Living Room', 'Dining', 'Kitchen', 'Master Bedroom', 'Guest Bedrooms', 'Bathrooms', 'Utilities', 'Views'];

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
                      className="relative aspect-square cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedImage(image)}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
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
