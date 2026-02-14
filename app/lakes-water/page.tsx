'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function LakesWater() {
  return (
    <main className="bg-white pt-16">
      {/* Hero Section */}
      <section className="relative w-full h-96 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-accent-water to-accent-sky"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=2000&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <motion.div
          className="relative z-10 text-center text-white max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold font-display mb-4">Alpine Lakes & Water</h1>
          <p className="text-xl text-accent-sky">Crystal-Clear Waters and Hot Springs</p>
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
              Water Recreation Paradise
            </h2>
            <p className="text-lg text-primary-dark mb-6 leading-relaxed">
              The Purgatory area is dotted with pristine alpine lakes and natural hot springs, offering excellent opportunities for camping, fishing, swimming, and relaxation. The region's extensive water systems make it a premier destination for water recreation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Lake - Bullion King */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/bullion-king-lake.jpg"
                alt="Bullion King Lake"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold font-display text-primary-dark mb-4">
                Bullion King Lake
              </h2>
              <p className="text-accent-water font-semibold mb-4">
                11,710 ft • 20 miles southwest • Moderate difficulty
              </p>
              <p className="text-primary-dark mb-4 leading-relaxed">
                Experience the serenity of Bullion King Lake, a 10-acre alpine gem nestled in the San Juan Mountains. Surrounded by 13,000-foot peaks, this moderately difficult 6.4-mile round trip hike offers breathtaking views and excellent golden trout fishing.
              </p>
              <p className="text-primary-dark mb-6 leading-relaxed">
                The pristine waters reflect the dramatic mountain landscape, making it an ideal destination for hikers, photographers, and anglers. Best visited from summer through early fall when trails are snow-free and weather is stable.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Hiking', 'Fishing', 'Photography'].map((activity) => (
                  <span key={activity} className="bg-accent-sky bg-opacity-20 text-primary-dark text-sm px-4 py-2 rounded-full font-semibold">
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Photo Gallery */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold font-display text-primary-dark mb-6">Photo Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { src: '/images/bullion-king-lake-2.jpg', alt: 'Dramatic rocky peaks above Bullion King Lake' },
                { src: '/images/bullion-king-lake-3.jpg', alt: 'Alpine lake surrounded by mountains' },
                { src: '/images/bullion-king-lake-4.jpg', alt: 'Emerald waters and snow patches' },
                { src: '/images/bullion-king-lake-5.jpg', alt: 'Wildflowers with lake and cliffs' },
                { src: '/images/bullion-king-lake-6.jpg', alt: 'Scenic alpine vista' },
                { src: '/images/bullion-king-lake-7.jpg', alt: 'Rocky shoreline reflections' },
                { src: '/images/bullion-king-lake-8.jpg', alt: 'Panoramic mountain views' },
                { src: '/images/bullion-king-lake-9.jpg', alt: 'Crystal clear alpine waters' },
              ].map((photo, idx) => (
                <motion.div
                  key={idx}
                  className="relative h-72 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  whileHover={{ scale: 1.02 }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-contain bg-gray-100 hover:scale-105 transition-transform duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lakes Section */}
      <section className="py-16 px-4 bg-neutral-light">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-4xl font-bold font-display text-primary-dark mb-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            More Alpine Lakes
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: 'Ice Lakes Basin',
                elev: '12,260 ft',
                distance: '12 miles south',
                difficulty: 'Difficult',
                activities: ['Hiking', 'Backpacking', 'Photography'],
                desc: 'Embark on a challenging 7.8-mile round trip hike to the enchanting Ice Lakes Basin. Marvel at vibrant turquoise lakes framed by rugged peaks, making it a perfect spot for avid photographers and adventurous hikers. Best visited from mid-summer to early fall.',
              },
              {
                name: 'Columbine Lake',
                elev: '11,860 ft',
                distance: '18 miles southwest',
                difficulty: 'Moderate',
                activities: ['Hiking', 'Fishing', 'Camping'],
                desc: 'Discover the beauty of Columbine Lake on a 5.6-mile moderately difficult round trip hike. Surrounded by aspen and conifer forests, this alpine lake features a captivating waterfall. Ideal destination for hikers, campers, and anglers from late spring to early fall.',
              },
              {
                name: 'Molas Lake',
                elev: '10,908 ft',
                distance: 'Near Silverton',
                difficulty: 'Easy',
                activities: ['Boating', 'Fishing', 'Scenic Views'],
                desc: 'One of the highest accessible alpine lakes in the region with crystal-clear waters and panoramic vistas of the San Juan Mountains. Perfect for a scenic drive or easy lakeside visit.',
              },
            ].map((lake, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 border-accent-water"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold font-display text-primary-dark mb-2">
                  {lake.name}
                </h3>
                <div className="flex gap-4 mb-3 text-sm text-accent-water font-semibold">
                  <span>{lake.elev}</span>
                  <span>{lake.distance}</span>
                  {lake.difficulty && <span className="text-primary-light">{lake.difficulty}</span>}
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {lake.activities.map((activity) => (
                    <span key={activity} className="bg-accent-sky bg-opacity-20 text-primary-dark text-xs px-3 py-1 rounded-full">
                      {activity}
                    </span>
                  ))}
                </div>
                <p className="text-primary-dark text-sm leading-relaxed">{lake.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Springs Section */}
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
                Natural Hot Springs
              </h3>
              <p className="text-primary-dark mb-4 leading-relaxed">
                The Durango area is home to several excellent natural hot spring resorts where you can relax and rejuvenate.
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold font-display text-primary-dark mb-1">
                    Durango Hot Springs Resort & Spa
                  </h4>
                  <p className="text-sm text-primary-dark">
                    Full-service spa facility with naturally heated geothermal waters.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold font-display text-primary-dark mb-1">
                    Trimble Spa & Natural Hot Springs
                  </h4>
                  <p className="text-sm text-primary-dark">
                    Scenic hot springs facility with mountain views and relaxation pools.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold font-display text-primary-dark mb-4">
                Waterways & Rivers
              </h3>
              <p className="text-primary-dark mb-4 leading-relaxed">
                The Animas River is a major waterway flowing through the region, offering excellent recreation opportunities.
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold font-display text-primary-dark mb-1">
                    Rafting & Kayaking
                  </h4>
                  <p className="text-sm text-primary-dark">
                    The Animas River offers varied sections from beginner to expert difficulty levels.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold font-display text-primary-dark mb-1">
                    Fly Fishing
                  </h4>
                  <p className="text-sm text-primary-dark">
                    Excellent trout fishing throughout the river system and alpine lakes.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Water Activities Section */}
      <section className="py-16 px-4 bg-neutral-light">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-4xl font-bold font-display text-primary-dark mb-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Year-Round Activities
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { season: 'Summer', activities: ['Swimming', 'Fishing', 'Boating', 'Kayaking', 'Picnicking'] },
              { season: 'Fall', activities: ['Fishing', 'Scenic hiking', 'Photography', 'Camping'] },
              { season: 'Winter', activities: ['Hot springs soaking', 'Ice fishing', 'Backcountry'] },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-6 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold font-display text-primary-dark mb-4">
                  {item.season}
                </h3>
                <ul className="space-y-2">
                  {item.activities.map((activity) => (
                    <li key={activity} className="flex items-center gap-2 text-primary-dark">
                      <span className="w-2 h-2 bg-primary-light rounded-full"></span>
                      {activity}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-accent-water to-accent-sky">
        <motion.div
          className="max-w-4xl mx-auto text-center text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold font-display mb-6">
            Dive Into Water Recreation
          </h2>
          <p className="text-xl text-white text-opacity-90 mb-8">
            Explore lakes, rivers, and hot springs throughout the Purgatory region.
          </p>
          <Link
            href="/practical-info"
            className="inline-block px-8 py-4 bg-white text-accent-water font-bold rounded-lg hover:bg-neutral-light transition-colors font-display text-lg"
          >
            Plan Your Water Adventure
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
