'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Camera, Home } from 'lucide-react';

export default function Durango() {
  return (
    <main className="bg-white pt-16">
      {/* Hero */}
      <section className="relative w-full h-80 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary-medium to-primary-light"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=2000&q=90)',
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
          <h1 className="text-5xl md:text-6xl font-bold font-display mb-4">Durango</h1>
          <p className="text-xl text-accent-sky">Historic Mountain Town & Gateway to Adventure</p>
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
              Discover Historic Durango
            </h2>
            <div className="space-y-6 text-lg text-primary-dark font-sans leading-relaxed">
              <p>
                [CONTENT PLACEHOLDER: Overview of Durango - founding, heritage, culture, and modern charm]
              </p>
              <p>
                [CONTENT PLACEHOLDER: Durango's role as a gateway to the San Juan Mountains]
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Subsections with Photo Placeholders */}
      <section className="py-20 px-4 bg-neutral-light">
        <div className="max-w-6xl mx-auto space-y-20">
          {[
            { title: 'Historic Downtown', subtitle: 'Victorian Architecture & Local Shops' },
            { title: 'The Train', subtitle: 'Durango & Silverton Narrow Gauge Railroad' },
            { title: 'Attractions & Activities', subtitle: 'Museums, Galleries, Restaurants, Outdoor Recreation' },
          ].map((section, idx) => (
            <motion.div
              key={idx}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                idx % 2 === 1 ? 'lg:grid-flow-dense' : ''
              }`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* Photo Placeholder */}
              <div className={`relative w-full aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-lg border-2 border-dashed border-gray-400 ${idx % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <Camera size={48} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500 font-sans">{section.title}</p>
                    <p className="text-sm text-gray-400">(1:1 aspect ratio optimized)</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={idx % 2 === 1 ? 'lg:col-start-1' : ''}>
                <h3 className="text-3xl font-bold font-display text-primary-dark mb-2">
                  {section.title}
                </h3>
                <p className="text-lg text-primary-light font-display mb-4">
                  {section.subtitle}
                </p>
                <div className="space-y-4 text-primary-dark">
                  <p className="text-lg font-sans leading-relaxed">
                    [CONTENT PLACEHOLDER: Detailed information about {section.title}]
                  </p>
                  <p className="text-lg font-sans leading-relaxed">
                    [CONTENT PLACEHOLDER: Additional context and visitor information]
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section id="gallery" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold font-display text-primary-dark mb-12 text-center">
            Durango Gallery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, idx) => (
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
