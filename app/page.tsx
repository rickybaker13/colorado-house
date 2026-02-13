'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary-medium to-primary-light"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2000&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 text-center text-white max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold font-display mb-6 leading-tight"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover Purgatory
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-accent-sky mb-8 font-sans"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Alpine beauty of Colorado's San Juan Mountains
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              href="/purgatory-resort"
              className="px-8 py-4 bg-primary-light text-primary-dark font-bold rounded-lg hover:bg-accent-sky transition-colors font-display text-lg"
            >
              Explore Resort
            </Link>
            <Link
              href="/needles-mountains"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-primary-dark transition-colors font-display text-lg"
            >
              Needles Mountains
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 px-4 bg-neutral-light">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display text-primary-dark mb-4">
              Explore the Region
            </h2>
            <p className="text-xl text-primary-dark font-sans max-w-2xl mx-auto">
              From world-class ski resorts to alpine peaks and pristine lakes, discover what makes Purgatory special.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Card 1: Resort */}
            <motion.div
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow h-full flex flex-col"
              variants={itemVariants}
            >
              <div 
                className="h-48 bg-gradient-to-br from-primary-medium to-primary-light"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="inset-0 bg-black bg-opacity-20 h-full"></div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-2xl font-bold font-display text-primary-dark mb-2">Purgatory Resort</h3>
                <p className="text-primary-dark mb-4 flex-grow">
                  World-class skiing with 1,600 acres of terrain and stunning views of the San Juan Mountains.
                </p>
                <Link
                  href="/purgatory-resort"
                  className="text-primary-light font-semibold hover:text-primary-dark transition-colors"
                >
                  Learn More →
                </Link>
              </div>
            </motion.div>

            {/* Card 2: Needles */}
            <motion.div
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow h-full flex flex-col"
              variants={itemVariants}
            >
              <div 
                className="h-48 bg-gradient-to-br from-accent-slate to-primary-medium"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="inset-0 bg-black bg-opacity-20 h-full"></div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-2xl font-bold font-display text-primary-dark mb-2">Needles Mountains</h3>
                <p className="text-primary-dark mb-4 flex-grow">
                  Epic granite peaks including Mount Eolus and the iconic Chicago Basin. A backpacker's paradise.
                </p>
                <Link
                  href="/needles-mountains"
                  className="text-primary-light font-semibold hover:text-primary-dark transition-colors"
                >
                  Learn More →
                </Link>
              </div>
            </motion.div>

            {/* Card 3: Lakes */}
            <motion.div
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow h-full flex flex-col"
              variants={itemVariants}
            >
              <div 
                className="h-48 bg-gradient-to-br from-accent-water to-accent-sky"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=500&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="inset-0 bg-black bg-opacity-20 h-full"></div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-2xl font-bold font-display text-primary-dark mb-2">Alpine Lakes</h3>
                <p className="text-primary-dark mb-4 flex-grow">
                  Crystal-clear alpine lakes and hot springs. Perfect for camping, fishing, and summer recreation.
                </p>
                <Link
                  href="/lakes-water"
                  className="text-primary-light font-semibold hover:text-primary-dark transition-colors"
                >
                  Learn More →
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {[
              { number: '1,600', label: 'Acres of Ski Terrain' },
              { number: '14,083 ft', label: 'Mount Eolus Elevation' },
              { number: '25 mi', label: 'From Durango' },
              { number: '365 days', label: 'Recreation Year-Round' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold font-display text-primary-light mb-2">
                  {stat.number}
                </div>
                <p className="text-primary-dark font-sans">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-dark to-primary-medium">
        <motion.div
          className="max-w-4xl mx-auto text-center text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Ready to Explore?
          </h2>
          <p className="text-xl text-accent-sky mb-8 font-sans">
            Discover more about the Purgatory area and start planning your alpine adventure.
          </p>
          <Link
            href="/experience"
            className="inline-block px-8 py-4 bg-accent-water text-primary-dark font-bold rounded-lg hover:bg-white transition-colors font-display text-lg"
          >
            Plan Your Visit
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
