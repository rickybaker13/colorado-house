'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PracticalInfoClient() {
  return (
    <main className="bg-white pt-16">
      {/* Hero Section */}
      <section className="relative w-full h-96 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary-medium to-primary-dark"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2000&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <motion.div
          className="relative z-10 text-center text-white max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold font-display mb-4">Practical Information</h1>
          <p className="text-xl text-accent-sky">Everything You Need to Know</p>
        </motion.div>
      </section>

      {/* Getting There Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-display text-primary-dark mb-6">
              Getting There
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold font-display text-primary-dark mb-4">
                  Distance from Durango
                </h3>
                <div className="space-y-3 text-primary-dark">
                  <p><span className="font-semibold">To Purgatory Resort:</span> 25 miles, 45 minutes</p>
                  <p><span className="font-semibold">To Chicago Basin:</span> 45+ miles, 2-3 hours</p>
                  <p><span className="font-semibold">To Alpine Lakes:</span> 20-40 miles, 1-2 hours</p>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-display text-primary-dark mb-4">
                  By Car
                </h3>
                <div className="space-y-2 text-primary-dark">
                  <p>US-550 North from Durango to Purgatory Resort (main highway)</p>
                  <p>Well-maintained mountain roads with seasonal closures possible</p>
                  <p>All-wheel drive or chains recommended in winter</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Seasons & Weather Section */}
      <section className="py-16 px-4 bg-neutral-light">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-4xl font-bold font-display text-primary-dark mb-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Seasons & Weather
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                season: 'Winter',
                months: 'Nov-Mar',
                temp: '15-30°F',
                highlights: 'Skiing, Snow activities',
              },
              {
                season: 'Spring',
                months: 'Apr-May',
                temp: '35-55°F',
                highlights: 'Wildflowers, Hiking begins',
              },
              {
                season: 'Summer',
                months: 'Jun-Aug',
                temp: '50-75°F',
                highlights: 'Peak season, All activities',
              },
              {
                season: 'Fall',
                months: 'Sep-Oct',
                temp: '40-60°F',
                highlights: 'Aspen colors, Wildlife',
              },
            ].map((season, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-6 rounded-lg border-t-4 border-primary-light"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold font-display text-primary-dark mb-2">
                  {season.season}
                </h3>
                <p className="text-sm text-primary-light font-semibold mb-2">{season.months}</p>
                <p className="text-sm text-primary-dark mb-3">{season.temp}</p>
                <p className="text-sm text-primary-dark">{season.highlights}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accommodations Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-display text-primary-dark mb-12">
              Where to Stay
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  type: 'Mountain Lodges',
                  locations: ['Purgatory Resort area', 'Nearby mountain communities'],
                  desc: 'Full-service lodges with dining and ski-in/out access',
                },
                {
                  type: 'Vacation Rentals',
                  locations: ['Durango area', 'Mountain towns'],
                  desc: 'Cabins, condos, and homes with full amenities',
                },
                {
                  type: 'Hotels & Motels',
                  locations: ['Durango downtown', 'US-550 corridor'],
                  desc: 'Full range from budget to luxury accommodations',
                },
                {
                  type: 'Campgrounds',
                  locations: ['National Forest', 'Private campgrounds'],
                  desc: 'Backcountry and developed camping options',
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="bg-neutral-light p-6 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-bold font-display text-primary-dark mb-2">
                    {item.type}
                  </h3>
                  <p className="text-sm text-primary-light font-semibold mb-2">
                    {item.locations.join(' • ')}
                  </p>
                  <p className="text-primary-dark">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Planning Checklist Section */}
      <section className="py-16 px-4 bg-neutral-light">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-display text-primary-dark mb-12 text-center">
              Planning Checklist
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold font-display text-primary-dark mb-4">
                  Before You Go
                </h3>
                <ul className="space-y-3">
                  {[
                    'Check weather forecasts',
                    'Book accommodations early',
                    'Plan your activities',
                    'Get proper permits if needed',
                    'Pack appropriate clothing',
                    'Buy maps and guides',
                    'Fill vehicle gas tank',
                    'Check road conditions',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-primary-light font-bold text-lg">✓</span>
                      <span className="text-primary-dark">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-primary-dark mb-4">
                  What to Bring
                </h3>
                <ul className="space-y-3">
                  {[
                    'Layers for altitude changes',
                    'Sun protection & sunscreen',
                    'Water bottles & hydration',
                    'Navigation tools (map, GPS)',
                    'First aid kit',
                    'Headlamp or flashlight',
                    'Snacks & energy food',
                    'Emergency communication device',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-primary-light font-bold text-lg">✓</span>
                      <span className="text-primary-dark">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Safety & Resources Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-display text-primary-dark mb-8">
              Safety & Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold font-display text-primary-dark mb-4">
                  Important Safety Tips
                </h3>
                <ul className="space-y-3 text-primary-dark">
                  <li className="flex gap-3">
                    <span className="text-primary-light font-bold">⚠️</span>
                    <span>Altitude: 8,000-14,000 ft. Take time to acclimate.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-light font-bold">⚠️</span>
                    <span>Weather: Mountain weather changes rapidly. Be prepared.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-light font-bold">⚠️</span>
                    <span>Wildlife: Keep distance from bears, elk, and mountain lions.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-light font-bold">⚠️</span>
                    <span>Terrain: Many trails are technical and exposed. Know your limits.</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-display text-primary-dark mb-4">
                  Helpful Resources
                </h3>
                <ul className="space-y-3 text-primary-dark">
                  <li className="flex gap-3">
                    <span className="text-primary-light font-bold">📍</span>
                    <span>US Forest Service (San Juan National Forest)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-light font-bold">🏔️</span>
                    <span>Purgatory Resort (conditions and operations)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-light font-bold">🗺️</span>
                    <span>Colorado Trail Foundation (trail conditions)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-light font-bold">💬</span>
                    <span>Local visitor centers and ranger stations</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary-dark to-primary-medium">
        <motion.div
          className="max-w-4xl mx-auto text-center text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold font-display mb-6">
            Questions?
          </h2>
          <p className="text-xl text-accent-sky mb-8">
            Explore more about the Purgatory area and start planning your adventure.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-accent-water text-primary-dark font-bold rounded-lg hover:bg-white transition-colors font-display text-lg"
          >
            Back to Home
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
