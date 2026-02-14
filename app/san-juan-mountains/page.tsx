'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, Home } from 'lucide-react';

export default function SanJuanMountains() {
  return (
    <main className="bg-white pt-16">
      {/* Hero */}
      <section className="relative w-full h-80 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary-medium to-primary-light"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2000&q=90)',
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
          <h1 className="text-5xl md:text-6xl font-bold font-display mb-4">San Juan Mountains</h1>
          <p className="text-xl text-accent-sky">Heart of Colorado's Alpine Country</p>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-display text-primary-dark mb-6">
              Overview
            </h2>
            <div className="space-y-6 text-lg text-primary-dark font-sans leading-relaxed">
              <p>
                [CONTENT PLACEHOLDER: Introduction to the San Juan Mountains - geography, elevation, climate, etc.]
              </p>
              <p>
                [CONTENT PLACEHOLDER: History and geological significance]
              </p>
              <p>
                [CONTENT PLACEHOLDER: Why the San Juans are special - unique features, biodiversity, etc.]
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section id="gallery" className="py-20 px-4 bg-neutral-light">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-display text-primary-dark mb-12 text-center">
              Photo Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <motion.div
                  key={idx}
                  className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-md border-2 border-dashed border-gray-400"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <Camera size={40} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500 font-sans">Photo {idx + 1}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Subsections */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto space-y-16">
          {[
            { title: 'Geology', content: 'Geological formation and mineral composition' },
            { title: 'Wildlife & Ecosystems', content: 'Flora, fauna, and ecological zones' },
            { title: 'Outdoor Recreation', content: 'Hiking, climbing, skiing, and water sports' },
          ].map((subsection, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold font-display text-primary-dark mb-4">
                {subsection.title}
              </h3>
              <p className="text-lg text-primary-dark font-sans leading-relaxed">
                [CONTENT PLACEHOLDER: {subsection.content}]
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Back to Home */}
      <section className="py-12 px-4 bg-neutral-light">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-light text-white font-bold rounded-lg hover:bg-primary-dark transition-colors font-display"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
