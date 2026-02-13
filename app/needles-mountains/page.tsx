'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NeedlesMountains() {
  return (
    <main className="bg-white pt-16">
      {/* Hero Section */}
      <section className="relative w-full h-96 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary-dark to-accent-slate"
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
          <h1 className="text-5xl md:text-6xl font-bold font-display mb-4">Needles Mountains</h1>
          <p className="text-xl text-accent-sky">Alpine Peaks and Technical Hiking</p>
        </motion.div>
      </section>

      {/* Overview Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-display text-primary-dark mb-6">
              A Hiker's Paradise
            </h2>
            <p className="text-lg text-primary-dark mb-6 leading-relaxed">
              The Needle Mountains are a subrange of the San Juan Mountains, famous for their rugged beauty and technical alpine terrain. Composed primarily of 1.5 billion-year-old pink granite, these peaks offer some of the most stunning and challenging hiking in Colorado.
            </p>
            <p className="text-lg text-primary-dark mb-6 leading-relaxed">
              Mount Eolus, the centerpiece of the Needle Range, stands at 14,083 feet and represents one of Colorado's premier mountaineering destinations. The climb is technical, challenging, and absolutely worth it for the panoramic views.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Peaks Section */}
      <section className="py-16 px-4 bg-neutral-light">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-4xl font-bold font-display text-primary-dark mb-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Notable Peaks
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: 'Mount Eolus',
                elev: '14,083 ft',
                desc: 'The highest peak in the Needle Range and 48th highest in Colorado. A challenging and technical climb with stunning summit views.',
                color: 'from-primary-light to-primary-medium',
              },
              {
                name: 'Purgatory Peak',
                elev: '12,800 ft',
                desc: 'A prominent peak named for the nearby ski resort. Offers excellent views of the surrounding San Juan Mountains.',
                color: 'from-accent-water to-primary-light',
              },
              {
                name: 'Chicago Basin',
                elev: 'Alpine Basin',
                desc: 'A historically significant basin, once a mining area, now part of Weminuche Wilderness. Perfect base for peak-bagging expeditions.',
                color: 'from-accent-sky to-accent-water',
              },
              {
                name: 'Other Notable Peaks',
                elev: '12,000-13,000 ft',
                desc: 'Turk\'s Head, Electric Peak, and numerous other 12,000+ foot summits. The range offers endless alpine exploration.',
                color: 'from-accent-slate to-primary-dark',
              },
            ].map((peak, idx) => (
              <motion.div
                key={idx}
                className={`bg-gradient-to-br ${peak.color} p-6 rounded-lg text-white`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold font-display mb-1">{peak.name}</h3>
                <p className="text-sm text-white text-opacity-90 mb-3">{peak.elev}</p>
                <p className="text-white text-opacity-95">{peak.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Geology Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div>
              <h3 className="text-3xl font-bold font-display text-primary-dark mb-4">
                Unique Geology
              </h3>
              <p className="text-primary-dark mb-4 leading-relaxed">
                The Needle Mountains are primarily composed of Precambrian pink granite, formed 1.5 billion years ago. This ancient stone creates a unique visual character, especially striking at sunrise and sunset.
              </p>
              <p className="text-primary-dark leading-relaxed">
                The geological features, combined with high elevation and clear alpine air, make these peaks exceptionally photogenic and geologically fascinating.
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-bold font-display text-primary-dark mb-4">
                Photography Appeal
              </h3>
              <ul className="space-y-3 text-primary-dark">
                <li className="flex gap-3">
                  <span className="text-primary-light font-bold">⛰️</span>
                  <span>Pink granite formations</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-light font-bold">🌄</span>
                  <span>Dramatic sunrise/sunset lighting</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-light font-bold">☁️</span>
                  <span>Alpine sky clarity</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-light font-bold">📸</span>
                  <span>360-degree panoramic views</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hiking Routes Section */}
      <section className="py-16 px-4 bg-neutral-light">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-display text-primary-dark mb-12 text-center">
              Popular Hiking Routes
            </h2>
            <div className="space-y-6">
              {[
                {
                  trail: 'Chicago Basin Approach',
                  distance: 'Variable',
                  difficulty: 'Challenging',
                  desc: 'Accessible via the Durango & Silverton Narrow Gauge Railroad, this approach to Mount Eolus and the basin is historically significant.',
                },
                {
                  trail: 'Needle Creek Trail',
                  distance: '8-15 miles',
                  difficulty: 'Difficult',
                  desc: 'Popular for backcountry skiing and snowboarding. Beautiful creek-side hiking with alpine basin at the end.',
                },
                {
                  trail: 'Colorado Trail Section',
                  distance: 'Multiple sections',
                  difficulty: 'Moderate to Difficult',
                  desc: 'The Colorado Trail passes through the region, offering multi-day backpacking with access to numerous peaks.',
                },
              ].map((route, idx) => (
                <motion.div
                  key={idx}
                  className="bg-white p-6 rounded-lg border-l-4 border-primary-light"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl font-bold font-display text-primary-dark mb-2">
                    {route.trail}
                  </h3>
                  <div className="flex gap-4 mb-3 text-sm">
                    <span className="text-primary-light font-semibold">Distance: {route.distance}</span>
                    <span className="text-primary-light font-semibold">Difficulty: {route.difficulty}</span>
                  </div>
                  <p className="text-primary-dark">{route.desc}</p>
                </motion.div>
              ))}
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
            Ready for an Alpine Adventure?
          </h2>
          <p className="text-xl text-accent-sky mb-8">
            Plan your Needle Mountains expedition with practical information and resources.
          </p>
          <Link
            href="/practical-info"
            className="inline-block px-8 py-4 bg-accent-water text-primary-dark font-bold rounded-lg hover:bg-white transition-colors font-display text-lg"
          >
            Get Practical Info
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
