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

export default function Silverton() {
  return (
    <main className="bg-snow min-h-screen">
      {/* Hero */}
      <section className="relative h-[65vh] md:h-[75vh] overflow-hidden">
        <Image
          src="/images/bullion-king-lake-7.jpg"
          alt="High alpine scenery near Silverton, Colorado"
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
              Elevation 9,318 ft &middot; Population ~700
            </p>
            <h1 className="font-display text-display-hero text-white mb-4 drop-shadow-lg">
              Silverton
            </h1>
            <p className="font-sans text-body-xl text-white/85 max-w-2xl mx-auto drop-shadow-lg">
              A mining town frozen in time, surrounded by fourteeners
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp}>
            <p className="font-sans text-caption uppercase tracking-[0.25em] text-stone mb-5">
              Founded 1874
            </p>
            <h2 className="font-display text-display-md text-charcoal mb-8">
              Nine thousand feet and a century behind
            </h2>
            <div className="space-y-6 text-body-lg text-warm-gray-dark leading-relaxed">
              <p>
                Silverton sits at 9,318 feet in a high mountain valley along the
                Animas River, surrounded on every side by peaks that rise well above
                13,000 feet. Founded in 1874 during the great San Juan mining rush,
                the town once teemed with prospectors, mule trains, and saloons. Long
                before the miners arrived, the valley served as hunting grounds for
                the Ute people, and Spanish explorers passed through the region in the
                1700s searching for gold.
              </p>
              <p>
                Today Silverton is home to roughly 700 year-round residents. The
                entire downtown is a National Historic District -- the Grand Imperial
                Hotel still operates on Greene Street, the old county jail still
                stands, and many of the false-front buildings date to the 1880s and
                1890s. With no stoplights and no chain stores, the town feels closer
                to 1890 than to the present day. Seven of Colorado&apos;s 58
                fourteeners lie within 20 miles.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mining Heritage */}
      <section className="bg-cream py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="mb-16">
            <p className="font-sans text-caption uppercase tracking-[0.25em] text-stone mb-5">
              Mining Heritage
            </p>
            <h2 className="font-display text-display-md text-charcoal">
              Into the mountain
            </h2>
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10"
          >
            <div>
              <h3 className="font-display text-3xl text-charcoal mb-4">
                Old Hundred Gold Mine
              </h3>
              <p className="text-body-lg text-warm-gray-dark leading-relaxed">
                The Old Hundred Gold Mine Tour takes visitors one-third of a mile
                into the heart of Galena Mountain, a peak that rises to over 13,000
                feet. Inside the mine, original tracks, ore veins, and pneumatic
                drills remain as they were when miners last worked the tunnels.
                Guides demonstrate period mining equipment and share the stories of
                the men who spent their lives underground.
              </p>
            </div>
            <div>
              <h3 className="font-display text-3xl text-charcoal mb-4">
                Mayflower Gold Mill
              </h3>
              <p className="text-body-lg text-warm-gray-dark leading-relaxed">
                One of the few intact precious-metal stamp mills in Colorado, the
                Mayflower Gold Mill processed ore from nearby mines from the 1930s
                through the 1990s. Guided tours walk visitors through the
                multi-story mill building, explaining how raw ore was crushed,
                separated, and refined into gold and silver concentrate. The
                industrial machinery remains in place, offering a rare look at the
                complete milling process.
              </p>
            </div>
            <div>
              <h3 className="font-display text-3xl text-charcoal mb-4">
                Animas Forks Ghost Town
              </h3>
              <p className="text-body-lg text-warm-gray-dark leading-relaxed">
                Founded in 1873 at 11,200 feet, Animas Forks is one of the
                best-preserved ghost towns in the San Juans. Several original
                buildings still stand, including the distinctive Bay Window House.
                The town is accessible via the Alpine Loop Byway, a high-clearance
                road that connects Silverton to Lake City and Ouray through some of
                the most remote terrain in the state.
              </p>
            </div>
            <div>
              <h3 className="font-display text-3xl text-charcoal mb-4">
                Christ of the Mines Shrine
              </h3>
              <p className="text-body-lg text-warm-gray-dark leading-relaxed">
                Perched on Anvil Mountain above town, the Christ of the Mines
                Shrine was erected in 1959 to watch over the community and its
                mining heritage. The 12-ton Carrara marble statue stands on a
                granite base and is visible from throughout the valley. A short
                trail from town leads to the shrine and offers sweeping views of
                Silverton and the surrounding peaks.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Outdoor Adventures */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="mb-16">
            <p className="font-sans text-caption uppercase tracking-[0.25em] text-stone mb-5">
              Alpine Recreation
            </p>
            <h2 className="font-display text-display-md text-charcoal">
              Above treeline
            </h2>
          </motion.div>

          <motion.div {...fadeInUp} className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3 space-y-6 text-body-lg text-warm-gray-dark leading-relaxed">
              <p>
                Ice Lakes Trail is one of the most popular hikes in the San Juan
                Mountains. The 7-mile round-trip route climbs from the South
                Mineral Creek trailhead through wildflower meadows and dense
                spruce forest before emerging above treeline at Lower Ice Lake.
                The upper lake, at roughly 12,600 feet, is renowned for its
                striking turquoise color -- the result of glacial flour suspended
                in the water. On a clear day, the lake reflects the surrounding
                peaks like a mirror.
              </p>
              <p>
                For those seeking steeper challenges, Silverton Mountain Ski Area
                operates as the steepest ski area in Colorado. With a single
                chairlift, no grooming, and a maximum capacity of roughly 80
                skiers per day, it offers expert-only terrain in a backcountry
                setting. Heli-skiing is available for those who want to access
                even more remote terrain in the surrounding San Juans.
              </p>
            </div>
            <div className="lg:col-span-2 bg-cream p-8">
              <h3 className="font-display text-3xl text-charcoal mb-6">
                By the Numbers
              </h3>
              <ul className="space-y-4">
                {[
                  { label: 'Elevation', value: '9,318 ft' },
                  { label: 'Nearby fourteeners', value: '7 within 20 mi' },
                  { label: 'Ice Lakes Trail', value: '7 mi round-trip' },
                  { label: 'Silverton Mtn vertical', value: '1,819 ft' },
                  { label: 'Million Dollar Hwy', value: '25 mi to Ouray' },
                  { label: 'Train from Durango', value: '45 mi each way' },
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

      {/* Getting There */}
      <section className="bg-cream py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp}>
            <p className="font-sans text-caption uppercase tracking-[0.25em] text-stone mb-5">
              Getting There
            </p>
            <h2 className="font-display text-display-md text-charcoal mb-8">
              Two ways into town
            </h2>
            <div className="space-y-6 text-body-lg text-warm-gray-dark leading-relaxed">
              <p>
                The most dramatic approach is the Million Dollar Highway from the
                north, connecting Silverton to Ouray along US Highway 550. The road
                climbs over Red Mountain Pass at 11,018 feet, hugging cliff edges
                with no guardrails and crossing avalanche paths. It is one of the
                most scenic -- and most nerve-testing -- drives in the American
                West.
              </p>
              <p>
                From the south, Highway 550 climbs from Durango through the Animas
                River valley, passing Purgatory Resort along the way. The drive takes
                roughly an hour and follows much of the same route as the narrow
                gauge railroad. In summer, the train itself is one of the most
                memorable ways to arrive, pulling into Silverton&apos;s depot just as
                it has since 1882.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative h-[50vh] md:h-[55vh] overflow-hidden">
        <Image
          src="/images/bullion-king-lake-5.jpg"
          alt="Alpine lake and peaks in the San Juan Mountains"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/15" />
        <div className="relative z-10 h-full flex flex-col items-center justify-end text-center pb-16 md:pb-24 px-6">
          <motion.div {...fadeInUp}>
            <h2 className="font-display text-display-lg text-white mb-4 drop-shadow-lg">
              Your base camp in the San Juans
            </h2>
            <p className="font-sans text-body-lg text-white/80 mb-8 max-w-xl mx-auto drop-shadow-md">
              Stay at Purgatory, halfway between Durango and Silverton on
              Highway 550.
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
