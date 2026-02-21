'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ExperienceClient() {
  return (
    <main className="bg-white pt-16">
      {/* Hero Section */}
      <section className="relative w-full h-96 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary-light to-accent-sky"
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
          <h1 className="text-5xl md:text-6xl font-bold font-display mb-4">Outdoor Experience</h1>
          <p className="text-xl text-accent-sky">A Complete Guide to Recreation</p>
        </motion.div>
      </section>

      {/* Colorado Trail Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-display text-primary-dark mb-6">
              The Colorado Trail
            </h2>
            <p className="text-lg text-primary-dark mb-6 leading-relaxed">
              The Colorado Trail passes through the Purgatory area, traversing the San Juan Mountains from Denver to Durango. The section near Purgatory features some of the most challenging terrain on the entire trail, with steep inclines and high elevations.
            </p>
            <p className="text-lg text-primary-dark mb-6 leading-relaxed">
              The trail is known for its diverse landscapes, abundant wildlife, and access to remote wilderness areas. It's perfect for multi-day backpacking adventures and offers numerous access points for day hikes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Recreation Options Section */}
      <section className="py-16 px-4 bg-neutral-light">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-4xl font-bold font-display text-primary-dark mb-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Recreation Options by Season
          </motion.h2>
          
          <div className="space-y-8">
            {[
              {
                season: 'Winter (Nov-Mar)',
                color: 'from-accent-sky to-accent-water',
                activities: [
                  { name: 'Skiing & Snowboarding', desc: 'World-class at Purgatory Resort with 1,600 acres of terrain' },
                  { name: 'Cross-Country Skiing', desc: 'Groomed trails and backcountry options throughout the region' },
                  { name: 'Snowshoeing', desc: 'Explore the alpine landscape in winter silence' },
                  { name: 'Ice Climbing', desc: 'Technical climbing on frozen waterfalls and ice formations' },
                ],
              },
              {
                season: 'Spring (Mar-May)',
                color: 'from-primary-light to-accent-sky',
                activities: [
                  { name: 'Wildflower Hikes', desc: 'Alpine flowers begin blooming in late spring' },
                  { name: 'Mountain Biking', desc: 'Trails open as snow melts' },
                  { name: 'Fishing', desc: 'Streams and lakes come alive with activity' },
                  { name: 'Photography', desc: 'Dramatic weather and emerging landscape colors' },
                ],
              },
              {
                season: 'Summer (Jun-Aug)',
                color: 'from-accent-water to-primary-medium',
                activities: [
                  { name: 'Peak Bagging', desc: 'Climb to 14,000+ foot summits' },
                  { name: 'Backpacking', desc: 'Multi-day expeditions through alpine basins' },
                  { name: 'Lake Swimming', desc: 'Alpine lakes warm up for swimming' },
                  { name: 'Trail Running', desc: 'High-altitude trail running on established routes' },
                ],
              },
              {
                season: 'Fall (Sep-Oct)',
                color: 'from-primary-dark to-accent-slate',
                activities: [
                  { name: 'Aspen Colors', desc: 'Golden aspen groves throughout the region' },
                  { name: 'Hiking', desc: 'Perfect weather and fewer crowds' },
                  { name: 'Wildlife Viewing', desc: 'Elk bugling season and animal migrations' },
                  { name: 'Photography', desc: 'Stunning color palettes and clear skies' },
                ],
              },
            ].map((season, idx) => (
              <motion.div
                key={idx}
                className={`bg-gradient-to-r ${season.color} rounded-lg p-8 text-white`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl font-bold font-display mb-6">{season.season}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {season.activities.map((activity, aidx) => (
                    <div key={aidx}>
                      <h4 className="font-semibold font-display mb-1">{activity.name}</h4>
                      <p className="text-sm text-white text-opacity-90">{activity.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Durango as Hub Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-display text-primary-dark mb-6">
              Durango: Outdoor Recreation Hub
            </h2>
            <p className="text-lg text-primary-dark mb-6 leading-relaxed">
              Durango is a vibrant, historic town that serves as the perfect base for exploring the Purgatory region. Known for its thriving outdoor recreation scene, Durango offers:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: '⛰️', title: 'Hiking Hub', desc: 'Starting point for trails throughout the San Juans' },
                { icon: '🚴', title: 'Mountain Biking Capital', desc: 'World-class trails for all skill levels' },
                { icon: '🚣', title: 'Rafting', desc: 'Guided rafting trips on the Animas River' },
                { icon: '🍽️', title: 'Dining & Culture', desc: 'Vibrant restaurants, galleries, and local arts scene' },
                { icon: '🛏️', title: 'Accommodations', desc: 'Hotels, lodges, and vacation rentals' },
                { icon: '🏪', title: 'Outfitters', desc: 'Gear shops and outdoor supply stores' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="bg-neutral-light p-6 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <h3 className="font-bold font-display text-primary-dark mb-2">{item.title}</h3>
                  <p className="text-primary-dark text-sm">{item.desc}</p>
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
            Ready to Experience Purgatory?
          </h2>
          <p className="text-xl text-accent-sky mb-8">
            Get the practical information you need to plan your perfect mountain adventure.
          </p>
          <Link
            href="/practical-info"
            className="inline-block px-8 py-4 bg-accent-water text-primary-dark font-bold rounded-lg hover:bg-white transition-colors font-display text-lg"
          >
            Practical Information
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
