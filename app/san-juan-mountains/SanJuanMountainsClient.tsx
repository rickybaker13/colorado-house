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

export default function SanJuanMountainsClient() {
  return (
    <main className="bg-snow min-h-screen">
      {/* Hero */}
      <section className="relative h-[65vh] md:h-[75vh] overflow-hidden">
        <Image
          src="/images/alpine-valley.jpg"
          alt="San Juan Mountains alpine valley in southwestern Colorado"
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
              Southwestern Colorado &middot; 35 million years in the making
            </p>
            <h1 className="font-display text-display-hero text-white mb-4 drop-shadow-lg">
              San Juan Mountains
            </h1>
            <p className="font-sans text-body-xl text-white/85 max-w-2xl mx-auto drop-shadow-lg">
              Colorado&apos;s most dramatic mountain range, born from ancient
              volcanoes
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp}>
            <p className="font-sans text-caption uppercase tracking-[0.25em] text-stone mb-5">
              Volcanic Origins
            </p>
            <h2 className="font-display text-display-md text-charcoal mb-8">
              Fire, ice, and deep time
            </h2>
            <div className="space-y-6 text-body-lg text-warm-gray-dark leading-relaxed">
              <p>
                The San Juan Mountains formed roughly 35 million years ago
                through a series of violent volcanic eruptions that deposited
                thousands of feet of ash, lava, and debris across southwestern
                Colorado. Over the millennia that followed, glaciers carved the
                volcanic rock into the jagged peaks, deep valleys, and
                U-shaped cirques that define the range today. The result is
                some of the most dramatic mountain scenery in all of the Rocky
                Mountains.
              </p>
              <p>
                The range contains some of Colorado&apos;s highest and most
                rugged terrain. Seven fourteeners -- peaks above 14,000 feet
                -- stand within 20 miles of Purgatory Resort. Hundreds of
                additional summits exceed 13,000 feet, separated by alpine
                basins, high passes, and valleys that remain snowbound well
                into summer. The mountains stretch from Ouray and Telluride in
                the north to Pagosa Springs in the east and the New Mexico
                border to the south, covering thousands of square miles of
                backcountry.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Wilderness & Forest */}
      <section className="bg-cream py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3">
              <p className="font-sans text-caption uppercase tracking-[0.25em] text-stone mb-5">
                Protected Lands
              </p>
              <h2 className="font-display text-display-md text-charcoal mb-8">
                Half a million acres of wilderness
              </h2>
              <div className="space-y-6 text-body-lg text-warm-gray-dark leading-relaxed">
                <p>
                  The Weminuche Wilderness is the largest designated
                  wilderness area in Colorado, spanning roughly 500,000 acres
                  across the heart of the San Juans. No roads, no motorized
                  equipment, no structures -- just trail, rock, and sky. The
                  wilderness contains dozens of alpine lakes, several
                  fourteener summits, and hundreds of miles of backcountry
                  trail that see few visitors even in peak season.
                </p>
                <p>
                  The broader San Juan National Forest, established in 1905
                  by President Theodore Roosevelt, surrounds the wilderness
                  and provides the managed forest land where Purgatory Resort
                  and many popular trailheads are located. The Colorado Trail
                  -- the 486-mile hiking route from Denver to Durango --
                  passes through the range on its final leg, with some of its
                  most challenging and scenic sections crossing high passes
                  above 12,000 feet.
                </p>
              </div>
            </div>
            <div className="lg:col-span-2 bg-snow p-8">
              <h3 className="font-display text-3xl text-charcoal mb-6">
                By the Numbers
              </h3>
              <ul className="space-y-4">
                {[
                  { label: 'Age of range', value: '~35 million years' },
                  { label: 'Weminuche Wilderness', value: '500,000 acres' },
                  { label: 'Nearby fourteeners', value: '7 within 20 mi' },
                  { label: 'Forest established', value: '1905' },
                  { label: 'Alpine tundra begins', value: '~12,000 ft' },
                  { label: 'Colorado Trail', value: '486 mi total' },
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

      {/* Ecosystems & Wildlife */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="mb-16">
            <p className="font-sans text-caption uppercase tracking-[0.25em] text-stone mb-5">
              Ecosystems &amp; Wildlife
            </p>
            <h2 className="font-display text-display-md text-charcoal">
              From river valley to alpine tundra
            </h2>
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10"
          >
            <div>
              <h3 className="font-display text-3xl text-charcoal mb-4">
                Alpine Tundra
              </h3>
              <p className="text-body-lg text-warm-gray-dark leading-relaxed">
                Above approximately 12,000 feet, the forest gives way to
                alpine tundra -- a fragile, wind-scoured landscape of low
                grasses, cushion plants, and tiny wildflowers that bloom in a
                brief window between snowmelt and the first September frosts.
                This ecosystem is among the most delicate in the Rockies; the
                plants grow only fractions of an inch per year, and a single
                footstep off-trail can leave a mark visible for decades.
              </p>
            </div>
            <div>
              <h3 className="font-display text-3xl text-charcoal mb-4">
                Subalpine Forest
              </h3>
              <p className="text-body-lg text-warm-gray-dark leading-relaxed">
                Between roughly 9,000 and 12,000 feet, dense stands of
                Engelmann spruce and subalpine fir cover the mountainsides.
                These forests are home to black bear, mountain lion, and the
                elusive pine marten. In autumn, groves of quaking aspen
                punctuate the dark conifers with brilliant gold, creating the
                fall color displays that draw photographers from across the
                country.
              </p>
            </div>
            <div>
              <h3 className="font-display text-3xl text-charcoal mb-4">
                Large Mammals
              </h3>
              <p className="text-body-lg text-warm-gray-dark leading-relaxed">
                The San Juans support healthy populations of elk, mule deer,
                and bighorn sheep. Black bears are common in the lower
                valleys and oak brush, while mountain lions range across all
                elevations. In the highest terrain, white-tailed ptarmigan
                -- Colorado&apos;s only year-round alpine bird -- blend into
                the rocks and snow, nearly invisible until they move.
              </p>
            </div>
            <div>
              <h3 className="font-display text-3xl text-charcoal mb-4">
                Mining History
              </h3>
              <p className="text-body-lg text-warm-gray-dark leading-relaxed">
                The San Juans were the site of some of Colorado&apos;s richest
                gold and silver strikes, beginning in the 1860s and
                continuing through the 1990s. Historic mining districts dot
                the range, with ghost towns, abandoned mills, and old wagon
                roads scattered across the high country. Towns like
                Silverton, Ouray, and Telluride all began as mining camps
                before reinventing themselves as mountain communities.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recreation */}
      <section className="bg-cream py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp}>
            <p className="font-sans text-caption uppercase tracking-[0.25em] text-stone mb-5">
              Recreation
            </p>
            <h2 className="font-display text-display-md text-charcoal mb-8">
              A lifetime of exploration
            </h2>
            <div className="space-y-6 text-body-lg text-warm-gray-dark leading-relaxed">
              <p>
                The San Juans offer four-season recreation on a scale that is
                difficult to match anywhere in the lower 48 states. In summer,
                hundreds of miles of trail lead to alpine lakes, wildflower
                meadows, and summit ridges. The Colorado Trail, the Continental
                Divide Trail, and countless local paths weave through the range.
                Peak-bagging, backpacking, fly-fishing, and rock climbing are
                all within reach of a single basecamp.
              </p>
              <p>
                In winter, Purgatory Resort provides lift-served skiing and
                snowboarding, while the backcountry offers cross-country
                skiing, snowshoeing, and ice climbing. The Million Dollar
                Highway and San Juan Skyway scenic loop remain open year-round,
                offering dramatic drives through snow-covered passes. Jeep
                roads and the Alpine Loop Byway open in summer for those who
                want to explore the most remote corners of the range by
                vehicle.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative h-[50vh] md:h-[55vh] overflow-hidden">
        <Image
          src="/images/bullion-king-lake-8.jpg"
          alt="Mountain lake in the San Juan Mountains"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/15" />
        <div className="relative z-10 h-full flex flex-col items-center justify-end text-center pb-16 md:pb-24 px-6">
          <motion.div {...fadeInUp}>
            <h2 className="font-display text-display-lg text-white mb-4 drop-shadow-lg">
              Your door to the San Juans
            </h2>
            <p className="font-sans text-body-lg text-white/80 mb-8 max-w-xl mx-auto drop-shadow-md">
              Stay at the base of Purgatory Resort, surrounded by the peaks,
              trails, and wilderness of the San Juan Mountains.
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
