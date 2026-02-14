'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Camera, BookOpen } from 'lucide-react';

export default function Home() {
  const sections = [
    {
      id: 'san-juan-mountains',
      title: 'San Juan Mountains',
      subtitle: 'Heart of Colorado',
      link: '/san-juan-mountains',
      photoAlt: 'San Juan Mountains landscape',
      hasDetailPage: true,
    },
    {
      id: 'hiking',
      title: 'Hiking Adventures',
      subtitle: 'Alpine Trails & Peaks',
      link: '/hiking',
      photoAlt: 'Mountain hiking trail',
      hasDetailPage: true,
    },
    {
      id: 'alpine-lakes',
      title: 'Alpine Lakes',
      subtitle: 'Crystal Waters',
      link: '/alpine-lakes',
      photoAlt: 'Alpine lake scenery',
      hasDetailPage: true,
    },
    {
      id: 'durango',
      title: 'Durango',
      subtitle: 'Historic Mountain Town',
      link: '/durango',
      photoAlt: 'Downtown Durango',
      hasDetailPage: true,
    },
    {
      id: 'purgatory-resort',
      title: 'Purgatory Resort',
      subtitle: 'Year-Round Recreation',
      link: '/purgatory-resort',
      photoAlt: 'Purgatory ski area',
      hasDetailPage: true,
    },
    {
      id: 'silverton',
      title: 'Silverton',
      subtitle: 'Historic Mining Town',
      link: '/silverton',
      photoAlt: 'Silverton historic downtown',
      hasDetailPage: true,
    },
  ];

  return (
    <main className="bg-white">
      {/* Hero Section - Dramatic Mountain Scene */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background with gradient overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-primary-dark via-primary-medium to-primary-light"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2560&q=90)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        {/* Content */}
        <motion.div
          className="relative z-10 text-center text-white max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.h1
            className="text-6xl md:text-7xl lg:text-8xl font-bold font-display mb-6 leading-tight"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            San Juan Adventure
          </motion.h1>
          <motion.p
            className="text-2xl md:text-3xl text-accent-sky mb-8 font-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Discover Alpine Beauty, Mountain Culture, and Unforgettable Experiences
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <Link
              href="#property"
              className="inline-block px-8 py-4 bg-primary-light text-primary-dark font-bold rounded-lg hover:bg-accent-sky transition-colors font-display text-lg"
            >
              Explore Our Townhouse
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={32} className="text-white" />
        </motion.div>
      </section>

      {/* Property Section */}
      <section id="property" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Photo Placeholder */}
            <div className="relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-lg border-2 border-dashed border-gray-400">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <Camera size={48} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500 font-sans">Property Photo</p>
                  <p className="text-sm text-gray-400">(16:9 aspect ratio optimized)</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold font-display text-primary-dark mb-6">
                Purgatory Townhouse
              </h2>
              <div className="space-y-4 text-primary-dark mb-8">
                <p className="text-lg font-sans leading-relaxed">
                  [CONTENT PLACEHOLDER: Introduction to the property and what makes it special]
                </p>
                <p className="text-lg font-sans leading-relaxed">
                  [CONTENT PLACEHOLDER: Key amenities and features]
                </p>
              </div>
              <div className="flex gap-4">
                <Link
                  href="/property"
                  className="px-8 py-3 bg-primary-light text-white font-bold rounded-lg hover:bg-primary-dark transition-colors font-display"
                >
                  View Property
                </Link>
                <Link
                  href="https://www.airbnb.com/rooms/1205985906587842742"
                  className="px-8 py-3 border-2 border-primary-light text-primary-light font-bold rounded-lg hover:bg-primary-light hover:text-white transition-colors font-display"
                >
                  Book on Airbnb
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scrolling Sections */}
      {sections.map((section, idx) => (
        <section 
          key={section.id} 
          className={`py-20 px-4 ${idx % 2 === 0 ? 'bg-neutral-light' : 'bg-white'}`}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
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
                    <p className="text-gray-500 font-sans">{section.photoAlt}</p>
                    <p className="text-sm text-gray-400">(1:1 aspect ratio optimized)</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={idx % 2 === 1 ? 'lg:col-start-1' : ''}>
                <h2 className="text-4xl md:text-5xl font-bold font-display text-primary-dark mb-4">
                  {section.title}
                </h2>
                <p className="text-xl text-primary-light font-display mb-6">
                  {section.subtitle}
                </p>
                <div className="space-y-4 text-primary-dark mb-8">
                  <p className="text-lg font-sans leading-relaxed">
                    [CONTENT PLACEHOLDER: General information and history about {section.title}]
                  </p>
                  <p className="text-lg font-sans leading-relaxed">
                    [CONTENT PLACEHOLDER: Additional details and context]
                  </p>
                </div>
                
                {/* Action Links */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={`${section.link}#gallery`}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-light text-white font-bold rounded-lg hover:bg-primary-dark transition-colors font-display text-sm md:text-base"
                  >
                    <Camera size={18} />
                    View Photos
                  </Link>
                  {section.hasDetailPage && (
                    <Link
                      href={section.link}
                      className="flex items-center gap-2 px-6 py-3 border-2 border-primary-light text-primary-light font-bold rounded-lg hover:bg-primary-light hover:text-white transition-colors font-display text-sm md:text-base"
                    >
                      <BookOpen size={18} />
                      Learn More
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* Footer CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-dark to-primary-medium">
        <motion.div
          className="max-w-4xl mx-auto text-center text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Ready for Your San Juan Adventure?
          </h2>
          <p className="text-xl text-accent-sky mb-8 font-sans">
            Book your stay at Purgatory Townhouse and explore the beauty of Colorado's San Juan Mountains.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/property"
              className="px-8 py-4 bg-accent-water text-primary-dark font-bold rounded-lg hover:bg-white transition-colors font-display text-lg"
            >
              Explore Property
            </Link>
            <Link
              href="https://www.airbnb.com/rooms/1205985906587842742"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-primary-dark transition-colors font-display text-lg"
            >
              Book Now
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
