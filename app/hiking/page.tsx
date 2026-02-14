'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Camera, Home } from 'lucide-react';

export default function Hiking() {
  return (
    <main className="bg-white pt-16">
      {/* Hero */}
      <section className="relative w-full h-80 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-accent-slate to-primary-medium"
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
          <h1 className="text-5xl md:text-6xl font-bold font-display mb-4">Hiking Adventures</h1>
          <p className="text-xl text-accent-sky">Alpine Trails & Mountain Peaks</p>
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
              Trail Guide
            </h2>
            <div className="space-y-6 text-lg text-primary-dark font-sans leading-relaxed">
              <p>
                [CONTENT PLACEHOLDER: Introduction to hiking in the area - difficulty levels, seasons, elevation profiles]
              </p>
              <p>
                [CONTENT PLACEHOLDER: Hiking safety tips, preparation, and what to bring]
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Trails */}
      <section className="py-20 px-4 bg-neutral-light">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold font-display text-primary-dark mb-12 text-center">
            Popular Trails
          </h2>
          <div className="space-y-12">
            {[
              { name: 'Trail 1', difficulty: 'Moderate', elevation: '2,000 ft' },
              { name: 'Trail 2', difficulty: 'Difficult', elevation: '3,500 ft' },
              { name: 'Trail 3', difficulty: 'Easy', elevation: '1,200 ft' },
            ].map((trail, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-8 rounded-lg shadow-md border-l-4 border-primary-light"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold font-display text-primary-dark mb-3">
                  {trail.name}
                </h3>
                <p className="text-primary-dark mb-4 font-sans">
                  Difficulty: <span className="font-bold">{trail.difficulty}</span> • 
                  Elevation Gain: <span className="font-bold">{trail.elevation}</span>
                </p>
                <p className="text-primary-dark font-sans leading-relaxed">
                  [CONTENT PLACEHOLDER: Trail description, distance, estimated time, highlights, and directions]
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section id="gallery" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold font-display text-primary-dark mb-12 text-center">
            Trail Photos
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
