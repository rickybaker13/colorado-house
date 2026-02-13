'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  return (
    <main className="bg-white">
      {/* Hero Section - House as Main Focus */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/images/hero-mountain.jpg)',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 text-center text-white max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold font-display mb-4 leading-tight"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Alpine Modern Townhome
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-accent-sky mb-4 font-sans"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Your luxury basecamp in Purgatory, Colorado
          </motion.p>
          <motion.p
            className="text-lg md:text-xl text-white text-opacity-90 mb-8 font-sans max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            4 Bedrooms • 3.5 Bathrooms • Sleeps 10 • Hot Tub • Mountain Views
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <a
              href="#booking"
              className="px-8 py-4 bg-primary-light text-primary-dark font-bold rounded-lg hover:bg-accent-sky transition-colors font-display text-lg"
            >
              Reserve Now
            </a>
            <a
              href="#details"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-primary-dark transition-colors font-display text-lg"
            >
              Learn More
            </a>
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

      {/* Quick Property Overview */}
      <section id="details" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {[
              { icon: '🏠', label: 'Bedrooms', value: '4' },
              { icon: '🛁', label: 'Bathrooms', value: '3.5' },
              { icon: '👥', label: 'Guests', value: '10' },
              { icon: '📍', label: 'Location', value: 'Purgatory' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-neutral-light p-6 rounded-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-2">{item.icon}</div>
                <p className="text-primary-dark text-sm mb-1">{item.label}</p>
                <p className="text-3xl font-bold text-primary-light">{item.value}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-3xl font-bold font-display text-primary-dark mb-4">
                Your Mountain Escape
              </h2>
              <p className="text-primary-dark mb-4 leading-relaxed">
                Newly renovated 2,700 sq ft modern townhome with stunning Engineer Mountain views. Perfect for families, groups, or anyone seeking a luxury mountain retreat near world-class skiing and alpine adventures.
              </p>
              <p className="text-primary-dark mb-6 leading-relaxed">
                Located just 20 minutes from Purgatory Resort and minutes from Durango's vibrant downtown. Your perfect basecamp for skiing, hiking, mountain biking, and exploring the San Juan Mountains.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold font-display text-primary-dark mb-4">
                Premium Amenities
              </h3>
              <ul className="space-y-3">
                {[
                  '🛁 Private hot tub with mountain views',
                  '🔥 Wood-burning fireplace',
                  '🍽️ Full kitchen with dining area',
                  '📺 Smart TV & entertainment',
                  '🛏️ Luxury bedding throughout',
                  '🚿 Modern bathrooms',
                  '🏔️ Wraparound deck',
                  '🅿️ Parking for multiple vehicles',
                ].map((amenity, idx) => (
                  <li key={idx} className="text-primary-dark flex items-start gap-3">
                    <span>{amenity.split(' ')[0]}</span>
                    <span>{amenity.substring(amenity.indexOf(' ') + 1)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing & Booking CTA */}
      <section id="booking" className="py-16 px-4 bg-neutral-light">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-display text-primary-dark mb-4">
              Book Your Stay
            </h2>
            <p className="text-xl text-primary-dark mb-8">
              Competitive nightly rates with premium amenities included
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {[
              { season: 'Off-Season', rate: '$400/night', dates: 'Mar-May, Sept-Nov' },
              { season: 'Peak Season', rate: '$600/night', dates: 'Dec-Feb, July-Aug' },
              { season: 'Special Events', rate: 'Contact us', dates: 'Custom rates available' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-6 rounded-lg border-t-4 border-primary-light"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold font-display text-primary-dark mb-2">
                  {item.season}
                </h3>
                <p className="text-3xl font-bold text-primary-light mb-2">{item.rate}</p>
                <p className="text-sm text-primary-dark">{item.dates}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-lg border-2 border-primary-light text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-primary-dark mb-4 font-sans">
              Ready to book? Minimum 2-night stays. Hot tub, utilities, and Wi-Fi included.
            </p>
            <a
              href="https://airbnb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-primary-light text-primary-dark font-bold rounded-lg hover:bg-primary-medium transition-colors font-display text-lg"
            >
              View on Airbnb
            </a>
          </motion.div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl font-bold font-display text-primary-dark mb-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Experience the View
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {[
              { src: '/images/lake-kayak.jpg', alt: 'Alpine Lake' },
              { src: '/images/waterfall.jpg', alt: 'Mountain Waterfall' },
              { src: '/images/wildflowers-pass.jpg', alt: 'Wildflower Meadow' },
              { src: '/images/alpine-valley.jpg', alt: 'Alpine Valley' },
            ].map((img, idx) => (
              <motion.div
                key={idx}
                className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Explore the Area Section */}
      <section className="py-16 px-4 bg-neutral-light">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-display text-primary-dark mb-4">
              Explore the Area
            </h2>
            <p className="text-xl text-primary-dark">
              Your home base for endless mountain adventures
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {[
              {
                title: 'Purgatory Resort',
                desc: '20 min away • 1,600 acres of skiing',
                link: '/purgatory-resort',
              },
              {
                title: 'Needles Mountains',
                desc: 'Epic peaks • Mount Eolus • Technical hiking',
                link: '/needles-mountains',
              },
              {
                title: 'Alpine Lakes',
                desc: 'Kayaking • Fishing • Swimming',
                link: '/lakes-water',
              },
              {
                title: 'Colorado Trail',
                desc: 'Multi-day backpacking • World-class route',
                link: '/experience',
              },
              {
                title: 'Durango',
                desc: '25 min away • Restaurants & culture',
                link: '/practical-info',
              },
              {
                title: 'Local Activities',
                desc: 'Mountain biking • Rafting • Hiking',
                link: '/experience',
              },
            ].map((item, idx) => (
              <motion.a
                key={idx}
                href={item.link}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold font-display text-primary-dark mb-2">
                  {item.title}
                </h3>
                <p className="text-primary-dark text-sm">{item.desc}</p>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary-dark to-primary-medium">
        <motion.div
          className="max-w-4xl mx-auto text-center text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold font-display mb-6">
            Ready to Book?
          </h2>
          <p className="text-xl text-accent-sky mb-8">
            Check availability and reserve your mountain escape today
          </p>
          <a
            href="https://airbnb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-accent-water text-primary-dark font-bold rounded-lg hover:bg-white transition-colors font-display text-lg"
          >
            Book Now
          </a>
        </motion.div>
      </section>
    </main>
  );
}
