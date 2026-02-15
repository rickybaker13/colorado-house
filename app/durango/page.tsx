'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

export default function Durango() {
  return (
    <main className="bg-snow min-h-screen">
      {/* Hero */}
      <section className="relative h-[65vh] md:h-[75vh] overflow-hidden">
        <Image
          src="/images/bullion-king-lake-4.jpg"
          alt="Mountain scenery near Durango, Colorado"
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
              Elevation 6,512 ft &middot; Animas River Valley
            </p>
            <h1 className="font-display text-display-hero text-white mb-4 drop-shadow-lg">
              Durango
            </h1>
            <p className="font-sans text-body-xl text-white/85 max-w-2xl mx-auto drop-shadow-lg">
              Historic railroad town, gateway to the San Juan Mountains
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp}>
            <p className="font-sans text-caption uppercase tracking-[0.25em] text-stone mb-5">
              Founded 1880
            </p>
            <h2 className="font-display text-display-md text-charcoal mb-8">
              A town shaped by the railroad and the river
            </h2>
            <div className="space-y-6 text-body-lg text-warm-gray-dark leading-relaxed">
              <p>
                Durango was founded in 1880 by the Denver &amp; Rio Grande Railroad as a
                smelting hub for the silver mines of the San Juan Mountains. Sitting at
                6,512 feet along the Animas River, the town quickly grew into the cultural
                and commercial heart of southwestern Colorado. Its downtown, now a
                National Historic District, still wears its Victorian-era architecture
                with pride -- iron-front buildings, arched windows, and awning-covered
                sidewalks line Main Avenue much as they did over a century ago.
              </p>
              <p>
                Today Durango balances that heritage with a thriving outdoor culture.
                Craft breweries and farm-to-table restaurants fill the historic
                storefronts. The Animas River runs through the center of town, offering
                Class II through IV rafting from spring snowmelt through late summer. Over
                1,000 miles of singletrack radiate into the surrounding mountains, making
                the area one of the top mountain-biking destinations in the West.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Train */}
      <section className="bg-cream py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp}>
            <p className="font-sans text-caption uppercase tracking-[0.25em] text-stone mb-5">
              National Historic Landmark
            </p>
            <h2 className="font-display text-display-md text-charcoal mb-8">
              Durango &amp; Silverton Narrow Gauge Railroad
            </h2>
          </motion.div>
          <motion.div {...fadeInUp} className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3 space-y-6 text-body-lg text-warm-gray-dark leading-relaxed">
              <p>
                Built in 1882 to haul silver and gold ore from the mines above
                Silverton, the narrow-gauge railroad has run continuously for over 140
                years. The coal-fired steam locomotives follow the Animas River through
                a wilderness canyon that is inaccessible by road, climbing from 6,512
                feet at the Durango depot to 9,318 feet in Silverton -- a 45-mile
                journey each way.
              </p>
              <p>
                Designated a National Historic Landmark, the railroad is one of the
                most photographed trains in North America. The route passes through the
                San Juan National Forest and the Weminuche Wilderness, offering views of
                sheer granite walls, cascading waterfalls, and alpine meadows. Round-trip
                excursions run daily from May through October, with holiday and winter
                service on shorter routes.
              </p>
            </div>
            <div className="lg:col-span-2 bg-snow p-8">
              <h3 className="font-display text-3xl text-charcoal mb-6">
                Quick Facts
              </h3>
              <ul className="space-y-4">
                {[
                  { label: 'Built', value: '1882' },
                  { label: 'Distance', value: '45 miles one way' },
                  { label: 'Elevation gain', value: '2,806 ft' },
                  { label: 'Gauge', value: '3 ft narrow gauge' },
                  { label: 'Designation', value: 'National Historic Landmark' },
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

      {/* Mesa Verde */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp}>
            <p className="font-sans text-caption uppercase tracking-[0.25em] text-stone mb-5">
              UNESCO World Heritage Site
            </p>
            <h2 className="font-display text-display-md text-charcoal mb-8">
              Mesa Verde National Park
            </h2>
            <div className="space-y-6 text-body-lg text-warm-gray-dark leading-relaxed">
              <p>
                Just 35 miles west of Durango, Mesa Verde National Park preserves
                nearly 5,000 archaeological sites, including 600 cliff dwellings built
                by the Ancestral Puebloan people between the sixth and thirteenth
                centuries. The park is a UNESCO World Heritage Site and one of the most
                significant archaeological preserves in the United States.
              </p>
              <p>
                Cliff Palace, the largest cliff dwelling in North America, contains 150
                rooms and 23 kivas. Ranger-led tours take visitors onto the alcove
                ledges and into the structures themselves. The drive from Durango takes
                roughly 45 minutes, making it an easy day trip from town or from the
                Purgatory area.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* San Juan Skyway + Activities */}
      <section className="bg-cream py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="mb-16">
            <p className="font-sans text-caption uppercase tracking-[0.25em] text-stone mb-5">
              Scenic Drives &amp; Outdoor Recreation
            </p>
            <h2 className="font-display text-display-md text-charcoal">
              Adventures in every direction
            </h2>
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10"
          >
            {[
              {
                title: 'San Juan Skyway',
                text: 'This 230-mile scenic loop connects Durango, Silverton, Ouray, Telluride, and Cortez. The stretch between Silverton and Ouray -- the Million Dollar Highway -- is one of the most dramatic mountain roads in the country, carved into sheer cliff faces above 10,000 feet.',
              },
              {
                title: 'River Rafting',
                text: 'The Animas River runs right through downtown Durango, offering Class II float trips for families and Class III-IV whitewater for experienced paddlers. Several outfitters operate guided half-day and full-day trips from May through September.',
              },
              {
                title: 'Mountain Biking',
                text: 'With over 1,000 miles of singletrack in the surrounding mountains, Durango has hosted multiple national and world mountain-biking championships. Trails range from smooth riverside paths to technical alpine descents with thousands of feet of elevation change.',
              },
              {
                title: 'Purgatory Resort',
                text: 'Just 25 miles north of downtown, Purgatory offers over 1,500 skiable acres in winter and an alpine coaster, mountain biking park, and summer activities the rest of the year. The drive from Durango takes about 30 minutes along US Highway 550.',
              },
            ].map((item, i) => (
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

      {/* CTA */}
      <section className="relative h-[50vh] md:h-[55vh] overflow-hidden">
        <Image
          src="/images/bullion-king-lake-6.jpg"
          alt="Alpine lake in the San Juan Mountains near Durango"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/15" />
        <div className="relative z-10 h-full flex flex-col items-center justify-end text-center pb-16 md:pb-24 px-6">
          <motion.div {...fadeInUp}>
            <h2 className="font-display text-display-lg text-white mb-4 drop-shadow-lg">
              Stay at the base of the mountains
            </h2>
            <p className="font-sans text-body-lg text-white/80 mb-8 max-w-xl mx-auto drop-shadow-md">
              Our Purgatory townhouse puts you 25 miles from Durango and steps from
              the ski lifts.
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
