'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Mountain } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

export default function PurgatoryResort() {
  return (
    <main className="bg-snow min-h-screen">
      {/* Hero */}
      <section className="relative h-[65vh] md:h-[75vh] overflow-hidden">
        <Image
          src="/images/hero-mountain.jpg"
          alt="Purgatory Resort in the San Juan Mountains, Colorado"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/50" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="font-sans text-caption uppercase tracking-[0.25em] text-white/70 mb-4 drop-shadow-lg">
              Summit 10,822 ft &middot; 25 miles north of Durango
            </p>
            <h1 className="font-display text-display-hero text-white mb-4 drop-shadow-lg">
              Purgatory Resort
            </h1>
            <p className="font-sans text-body-xl text-white/85 max-w-2xl mx-auto drop-shadow-lg">
              Four-season mountain resort in the heart of the San Juans
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            {...fadeInUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
          >
            {[
              { value: '1,500+', label: 'Skiable Acres' },
              { value: '105', label: 'Trails' },
              { value: '2,029\'', label: 'Vertical Drop' },
              { value: '260"', label: 'Avg. Snowfall' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <Mountain size={24} className="mx-auto text-stone mb-4" />
                <p className="font-display text-5xl text-charcoal">
                  {stat.value}
                </p>
                <p className="font-sans text-label-sm text-warm-gray-dark mt-2 tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="px-6 pb-20 md:pb-28">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp}>
            <p className="font-sans text-caption uppercase tracking-[0.25em] text-stone mb-5">
              Founded 1965
            </p>
            <h2 className="font-display text-display-md text-charcoal mb-8">
              Born from a forest ranger&apos;s dream
            </h2>
            <div className="space-y-6 text-body-lg text-warm-gray-dark leading-relaxed">
              <p>
                Purgatory Resort was founded in 1965 by Chet Anderson, a U.S.
                Forest Service ranger who knew the San Juan Mountains as well as
                anyone alive, and Ray Duncan, a Farmington oilman with the means
                to build. Together they carved a ski area from the spruce-covered
                slopes 25 miles north of Durango along Highway 550. The resort
                sits at a base elevation of 8,793 feet, with its summit reaching
                10,822 feet and a vertical drop of 2,029 feet.
              </p>
              <p>
                The name carries a wry local history. A witty farmer named the
                nearby creek after the Rio de las Animas Perdidas -- the River of
                Lost Souls -- and the resort took its name from that tributary.
                The mythology stuck: trail names include Angel&apos;s Tread,
                Demon, Styx, and Nirvana, weaving themes of the afterlife through
                the trail map. Today the resort has grown to 105 trails, 5
                terrain parks, and 12 lifts spread across more than 1,500 skiable
                acres, averaging 260 inches of snowfall each winter.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Winter + Terrain */}
      <section className="bg-cream py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3">
              <p className="font-sans text-caption uppercase tracking-[0.25em] text-stone mb-5">
                Winter Season
              </p>
              <h2 className="font-display text-display-md text-charcoal mb-8">
                Skiing for everyone
              </h2>
              <div className="space-y-6 text-body-lg text-warm-gray-dark leading-relaxed">
                <p>
                  Purgatory has been named the best ski area for beginners in
                  North America, with wide, groomed runs that give first-timers
                  room to learn without feeling overwhelmed. But the mountain
                  holds plenty for experts too: steep glades, mogul fields, and
                  five terrain parks with features ranging from small rollers to
                  competition-grade jumps.
                </p>
                <p>
                  Kids 12 and under ski free at Purgatory -- a policy that has
                  made the resort a favorite among families. The ski season
                  typically runs from late November through early April. With
                  12 lifts and 105 trails, lift lines are rare even on the
                  busiest holiday weekends.
                </p>
              </div>
            </div>
            <div className="lg:col-span-2 bg-snow p-8">
              <h3 className="font-display text-3xl text-charcoal mb-6">
                Mountain Stats
              </h3>
              <ul className="space-y-4">
                {[
                  { label: 'Base elevation', value: '8,793 ft' },
                  { label: 'Summit', value: '10,822 ft' },
                  { label: 'Vertical drop', value: '2,029 ft' },
                  { label: 'Trails', value: '105' },
                  { label: 'Lifts', value: '12' },
                  { label: 'Terrain parks', value: '5' },
                  { label: 'Skiable acres', value: '1,500+' },
                  { label: 'Avg. snowfall', value: '260 inches' },
                ].map((item) => (
                  <li
                    key={item.label}
                    className="flex justify-between items-center border-b border-stone-pale/50 pb-3"
                  >
                    <span className="font-sans text-label-sm text-warm-gray tracking-wide">
                      {item.label}
                    </span>
                    <span className="font-sans text-label-sm text-charcoal font-medium">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Summer Activities */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="mb-16">
            <p className="font-sans text-caption uppercase tracking-[0.25em] text-stone mb-5">
              Summer Season
            </p>
            <h2 className="font-display text-display-md text-charcoal">
              When the snow melts
            </h2>
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10"
          >
            {[
              {
                title: 'Inferno Mountain Coaster',
                text: 'A 4,000-foot alpine rollercoaster that winds through the forest and down the mountainside. Riders control their own speed on individual carts, making it suitable for both thrill-seekers and those who prefer a gentler ride. It is one of the longest mountain coasters in Colorado.',
              },
              {
                title: 'Mountain Biking',
                text: 'Purgatory operates a full lift-served mountain bike park in summer, with trails from flowy beginner paths to technical black diamonds. The Divinity Flow Trail is a standout -- a purpose-built descending singletrack with bermed turns, gentle rollers, and sweeping views of the Animas Valley.',
              },
              {
                title: 'Alpine Slide & Bungee',
                text: 'The alpine slide sends riders down a concrete track on wheeled sleds, while the bungee trampoline launches kids and adults 30 feet into the air. Go-karts, an outdoor swimming pool, and archery round out the options for families spending the day on the mountain.',
              },
              {
                title: 'Scenic Chairlift Rides',
                text: 'The chairlift operates through the summer months, carrying hikers and sightseers to the upper mountain for panoramic views of the Needle Mountains, the Weminuche Wilderness, and the Animas River valley. The wildflower bloom in July and early August is particularly spectacular from elevation.',
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="font-display text-3xl text-charcoal mb-4">
                  {item.title}
                </h3>
                <p className="text-body-lg text-warm-gray-dark leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Location Context */}
      <section className="bg-cream py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp}>
            <p className="font-sans text-caption uppercase tracking-[0.25em] text-stone mb-5">
              Location
            </p>
            <h2 className="font-display text-display-md text-charcoal mb-8">
              Between Durango and Silverton
            </h2>
            <div className="space-y-6 text-body-lg text-warm-gray-dark leading-relaxed">
              <p>
                Purgatory sits along US Highway 550, the main corridor through
                the San Juan Mountains. Durango is 25 miles south -- about a
                30-minute drive -- with its historic downtown, restaurants, and
                the train depot. Silverton is 25 miles north, accessible via
                the same highway as it climbs toward the Million Dollar Highway
                and Red Mountain Pass.
              </p>
              <p>
                The resort sits within the San Juan National Forest, established
                by President Theodore Roosevelt in 1905. The Weminuche
                Wilderness, Colorado&apos;s largest wilderness area at 500,000
                acres, begins just miles from the base area. Trailheads for
                hikes to alpine lakes, fourteener summits, and the Colorado
                Trail are all within a short drive.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative h-[50vh] md:h-[55vh] overflow-hidden">
        <Image
          src="/images/bullion-king-lake-3.jpg"
          alt="Alpine scenery in the San Juan Mountains near Purgatory"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/15" />
        <div className="relative z-10 h-full flex flex-col items-center justify-end text-center pb-16 md:pb-24 px-6">
          <motion.div {...fadeInUp}>
            <h2 className="font-display text-display-lg text-white mb-4 drop-shadow-lg">
              Steps from the lifts
            </h2>
            <p className="font-sans text-body-lg text-white/80 mb-8 max-w-xl mx-auto drop-shadow-md">
              Our townhouse sits at the base of Purgatory Resort -- ski-in
              access and mountain views from every window.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="font-sans text-base tracking-widest uppercase px-10 py-4 border border-white/30 text-white rounded-full hover:bg-white/15 transition-all duration-300"
              >
                Back to Home
              </Link>
              <Link
                href="/booking"
                className="font-sans text-base tracking-widest uppercase px-10 py-4 bg-white text-charcoal rounded-full hover:bg-stone-pale transition-all duration-300 flex items-center justify-center gap-2"
              >
                Book Your Stay
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
