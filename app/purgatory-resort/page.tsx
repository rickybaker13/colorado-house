'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PurgatoryResort() {
  return (
    <main className="bg-white pt-16">
      {/* Hero Section */}
      <section className="relative w-full h-96 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary-dark to-primary-medium"
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
          <h1 className="text-5xl md:text-6xl font-bold font-display mb-4">Purgatory Resort</h1>
          <p className="text-xl text-accent-sky">World-Class Skiing in the San Juan Mountains</p>
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
              About Purgatory
            </h2>
            <p className="text-lg text-primary-dark mb-6 leading-relaxed">
              Purgatory Resort, located in the San Juan Mountains just 25 miles north of Durango, Colorado, is one of the region's premier ski destinations. Founded in 1965, the resort has been welcoming skiers and snowboarders for nearly 60 years.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-neutral-light p-4 rounded-lg">
                <div className="text-3xl font-bold text-primary-light mb-2">1,600</div>
                <p className="text-sm text-primary-dark">Acres of Terrain</p>
              </div>
              <div className="bg-neutral-light p-4 rounded-lg">
                <div className="text-3xl font-bold text-primary-light mb-2">107</div>
                <p className="text-sm text-primary-dark">Trails</p>
              </div>
              <div className="bg-neutral-light p-4 rounded-lg">
                <div className="text-3xl font-bold text-primary-light mb-2">2,029 ft</div>
                <p className="text-sm text-primary-dark">Vertical Drop</p>
              </div>
              <div className="bg-neutral-light p-4 rounded-lg">
                <div className="text-3xl font-bold text-primary-light mb-2">11</div>
                <p className="text-sm text-primary-dark">Lifts</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Elevation Section */}
      <section className="py-16 px-4 bg-neutral-light">
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
                Elevation & Terrain
              </h3>
              <ul className="space-y-4 text-primary-dark">
                <li className="flex gap-3">
                  <span className="text-primary-light font-bold">Base:</span>
                  <span>8,793 feet</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-light font-bold">Summit:</span>
                  <span>10,822 feet</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-light font-bold">Vertical:</span>
                  <span>2,029 feet</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-light font-bold">Beginner:</span>
                  <span>25%</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-light font-bold">Intermediate:</span>
                  <span>50%</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-light font-bold">Expert:</span>
                  <span>25%</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-3xl font-bold font-display text-primary-dark mb-4">
                Ski Season
              </h3>
              <p className="text-primary-dark mb-4">
                The ski season typically runs from late November through early April, depending on snow conditions. The resort receives an average of 260+ inches of annual snowfall.
              </p>
              <p className="text-primary-dark">
                With 107 trails spanning over 1,600 acres, Purgatory offers something for every skill level, from gentle beginner slopes to challenging expert terrain.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-display text-primary-dark mb-12 text-center">
              What to Expect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'World-Class Skiing', desc: 'Extensive trail network with terrain for all abilities' },
                { title: 'Modern Lift System', desc: '11 lifts providing efficient access to the mountain' },
                { title: 'Snowsports School', desc: 'Professional instruction for all ages and levels' },
                { title: 'Dining Options', desc: 'Multiple restaurants and cafes throughout the resort' },
                { title: 'Family-Friendly', desc: 'Ski school, rentals, and activities for children' },
                { title: 'Summer Recreation', desc: 'Hiking, mountain biking, and scenic chairlift rides' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="bg-neutral-light p-6 rounded-lg hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-bold font-display text-primary-dark mb-2">
                    {item.title}
                  </h3>
                  <p className="text-primary-dark">{item.desc}</p>
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
            Ready to Hit the Slopes?
          </h2>
          <p className="text-xl text-accent-sky mb-8">
            Visit Purgatory Resort for an unforgettable mountain experience.
          </p>
          <Link
            href="/practical-info"
            className="inline-block px-8 py-4 bg-accent-water text-primary-dark font-bold rounded-lg hover:bg-white transition-colors font-display text-lg"
          >
            Plan Your Visit
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
