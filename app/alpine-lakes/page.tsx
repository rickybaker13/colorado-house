'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Camera, Home } from 'lucide-react';

export default function AlpineLakes() {
  return (
    <main className="bg-white pt-16">
      {/* Hero */}
      <section className="relative w-full h-80 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-accent-water to-accent-sky"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=2000&q=90)',
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
          <h1 className="text-5xl md:text-6xl font-bold font-display mb-4">Alpine Lakes</h1>
          <p className="text-xl text-accent-sky">Crystal Waters & Mountain Reflections</p>
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
              Pristine Alpine Waters
            </h2>
            <div className="space-y-6 text-lg text-primary-dark font-sans leading-relaxed">
              <p>
                [CONTENT PLACEHOLDER: Introduction to alpine lakes in the region - formation, characteristics, best seasons]
              </p>
              <p>
                [CONTENT PLACEHOLDER: Activities: fishing, camping, photography, hiking]
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Lakes */}
      <section className="py-20 px-4 bg-neutral-light">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold font-display text-primary-dark mb-12 text-center">
            Notable Lakes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: 'Bullion King Lake', elev: '11,710 ft', distance: '20 mi SW' },
              { name: 'Ice Lakes Basin', elev: '12,260 ft', distance: '12 mi S' },
              { name: 'Columbine Lake', elev: '11,860 ft', distance: '18 mi SW' },
              { name: 'Additional Lake', elev: 'TBD', distance: 'TBD' },
            ].map((lake, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-6 rounded-lg shadow-md border-t-4 border-accent-water"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold font-display text-primary-dark mb-3">
                  {lake.name}
                </h3>
                <p className="text-sm text-accent-water font-semibold mb-3">
                  {lake.elev} • {lake.distance}
                </p>
                <p className="text-primary-dark font-sans leading-relaxed">
                  [CONTENT PLACEHOLDER: Lake description, hiking route, features, and best time to visit]
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
            Lake Photography
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
