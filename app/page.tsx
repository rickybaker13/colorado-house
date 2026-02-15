'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { ArrowUpRight, ChevronDown, Mountain, Users, BedDouble, Bath } from 'lucide-react';

function ParallaxImage({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="relative w-full h-[120%] -mt-[10%]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>
    </div>
  );
}

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
};

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 0.6], [1, 1.1]);

  const sections = [
    {
      id: 'san-juan-mountains',
      title: 'San Juan Mountains',
      subtitle: 'Ancient peaks, endless wilderness',
      description:
        'Born from volcanic fire 35 million years ago, the San Juans hold some of Colorado\'s most dramatic scenery — jagged fourteeners, alpine tundra, and wilderness that stretches to every horizon. Seven peaks over 14,000 feet lie within twenty miles of our door.',
      link: '/san-juan-mountains',
      image: '/images/alpine-valley.jpg',
    },
    {
      id: 'hiking',
      title: 'Alpine Trails',
      subtitle: '500 miles of maintained trails',
      description:
        'From the wildflower meadows of the Colorado Trail to the exposed ridgelines of the Needles, every trail tells a different story. The Weminuche Wilderness — Colorado\'s largest — is your backyard.',
      link: '/hiking',
      image: '/images/wildflowers-pass.jpg',
    },
    {
      id: 'alpine-lakes',
      title: 'Crystal Waters',
      subtitle: 'Glacier-carved alpine lakes',
      description:
        'Bullion King Lake at 11,710 feet, Ice Lakes Basin\'s impossible turquoise, and dozens more. These high-country jewels are worth every switchback — waters so clear they mirror the peaks above.',
      link: '/alpine-lakes',
      image: '/images/bullion-king-lake.jpg',
    },
    {
      id: 'durango',
      title: 'Durango',
      subtitle: 'Founded 1880 · Elevation 6,512\'',
      description:
        'A historic railroad town along the Animas River where Victorian architecture meets craft breweries and farm-to-table dining. Ride the Durango & Silverton Narrow Gauge Railroad, explore Mesa Verde National Park, or raft Class IV rapids.',
      link: '/durango',
      image: '/images/waterfall.jpg',
    },
    {
      id: 'purgatory-resort',
      title: 'Purgatory Resort',
      subtitle: '1,600 acres · 105 trails · 260" annual snowfall',
      description:
        'World-class skiing in winter with a 2,029-foot vertical drop. Come summer, the slopes transform into mountain biking trails, alpine coasters, and chairlift-accessed hiking. Just minutes from our front door.',
      link: '/purgatory-resort',
      image: '/images/hero-mountain.jpg',
    },
  ];

  return (
    <main className="bg-snow">
      {/* === HERO === */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden grain">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <Image
            src="/images/bullion-king-lake.jpg"
            alt="Bullion King Lake in the San Juan Mountains"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          {/* Strong dark overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
        >
          <motion.p
            className="font-sans text-caption uppercase tracking-[0.3em] text-white/80 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Purgatory, Colorado &middot; 8,793&apos;
          </motion.p>

          <motion.h1
            className="font-display text-display-hero text-white max-w-5xl drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Where the mountains{' '}
            <em className="italic">meet the sky</em>
          </motion.h1>

          <motion.p
            className="font-sans text-xl md:text-2xl text-white/80 mt-8 max-w-2xl font-light leading-relaxed drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            A luxury mountain retreat in the heart of the San Juan Mountains
          </motion.p>

          <motion.div
            className="mt-12 flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <Link
              href="/property"
              className="font-sans text-base tracking-widest uppercase px-10 py-4 bg-white/15 text-white border border-white/30 backdrop-blur-sm rounded-full hover:bg-white/25 transition-all duration-300"
            >
              Explore the Townhouse
            </Link>
            <Link
              href="https://www.airbnb.com/rooms/1205985906587842742"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-base tracking-widest uppercase px-10 py-4 bg-white text-charcoal rounded-full hover:bg-stone-pale transition-all duration-300 flex items-center justify-center gap-2"
            >
              Book Now
              <ArrowUpRight size={16} />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={28} className="text-white/60" />
        </motion.div>
      </section>

      {/* === PROPERTY INTRO === */}
      <section className="relative py-28 md:py-36 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="max-w-3xl">
            <p className="font-sans text-caption uppercase tracking-[0.25em] text-stone mb-6">
              The Townhouse
            </p>
            <h2 className="font-display text-display-lg text-charcoal mb-10">
              Your private mountain sanctuary
            </h2>
            <p className="text-body-lg text-warm-gray-dark leading-relaxed mb-6">
              Nestled among the pines at the base of Purgatory Resort, this spacious four-bedroom
              townhouse is designed for those who come to the mountains seeking both adventure and
              comfort. Wake to alpine views, gather around the floor-to-ceiling stone fireplace after
              a day on the slopes, and fall asleep to the silence of the high country.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            {...fadeInUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {[
              { icon: Mountain, value: '8,793\'', label: 'Elevation' },
              { icon: Users, value: '8', label: 'Guests' },
              { icon: BedDouble, value: '4', label: 'Bedrooms' },
              { icon: Bath, value: '3', label: 'Bathrooms' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="py-8 border-t border-stone-pale/60"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <stat.icon size={22} className="text-stone mb-4" />
                <p className="font-display text-4xl md:text-5xl text-charcoal">
                  {stat.value}
                </p>
                <p className="font-sans text-label-sm text-warm-gray-dark mt-2 tracking-wide">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === PROPERTY IMAGE GRID — exterior first === */}
      <section className="px-4 md:px-6 pb-28">
        <div className="max-w-7xl mx-auto">
          <motion.div
            {...fadeInUp}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4"
          >
            {/* Large left image — EXTERIOR of townhouse (kitchen-1.jpg = actual exterior) */}
            <div className="md:col-span-7 relative aspect-[3/4] md:aspect-[4/3] overflow-hidden">
              <Image
                src="/images/kitchen-1.jpg"
                alt="Purgatory Townhouse — modern mountain architecture"
                fill
                className="object-cover hover:scale-[1.02] transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 58vw"
              />
            </div>
            {/* Right stack */}
            <div className="md:col-span-5 grid grid-rows-2 gap-3 md:gap-4">
              {/* Main living room wide shot (views-1.jpg) */}
              <div className="relative aspect-[16/9] md:aspect-auto overflow-hidden">
                <Image
                  src="/images/views-1.jpg"
                  alt="Open living room with vaulted ceilings and mountain views"
                  fill
                  className="object-cover hover:scale-[1.02] transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 42vw"
                />
              </div>
              {/* Master bedroom (exterior-3.jpg = actual master with Pendleton) */}
              <div className="relative aspect-[16/9] md:aspect-auto overflow-hidden">
                <Image
                  src="/images/exterior-3.jpg"
                  alt="Master bedroom with Pendleton blanket and mountain decor"
                  fill
                  className="object-cover hover:scale-[1.02] transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 42vw"
                />
              </div>
            </div>
          </motion.div>

          {/* View Property + Gallery links */}
          <motion.div
            {...fadeInUp}
            className="flex flex-wrap gap-8 mt-12 justify-center"
          >
            <Link
              href="/property"
              className="font-sans text-label tracking-widest uppercase text-charcoal border-b-2 border-charcoal/20 pb-1 hover:border-charcoal transition-colors"
            >
              View the property
            </Link>
            <Link
              href="/gallery"
              className="font-sans text-label tracking-widest uppercase text-charcoal border-b-2 border-charcoal/20 pb-1 hover:border-charcoal transition-colors"
            >
              Full gallery
            </Link>
          </motion.div>
        </div>
      </section>

      {/* === EDITORIAL DESTINATION SECTIONS === */}
      {sections.map((section, idx) => (
        <section key={section.id} className="relative">
          {/* Full-bleed image */}
          <ParallaxImage
            src={section.image}
            alt={section.title}
            className="w-full h-[70vh] md:h-[85vh]"
          />

          {/* Overlapping content card */}
          <div className="relative z-10 -mt-32 md:-mt-44 pb-16 md:pb-28 px-6">
            <motion.div
              {...fadeInUp}
              className={`max-w-xl ${idx % 2 === 0 ? 'ml-auto mr-6 md:mr-[10%]' : 'mr-auto ml-6 md:ml-[10%]'}`}
            >
              <div className="bg-snow/95 backdrop-blur-sm p-10 md:p-14 shadow-lg">
                <p className="font-sans text-caption uppercase tracking-[0.25em] text-stone mb-5">
                  {section.subtitle}
                </p>
                <h2 className="font-display text-display-md text-charcoal mb-6">
                  {section.title}
                </h2>
                <p className="text-body-lg text-warm-gray-dark leading-relaxed mb-8">
                  {section.description}
                </p>
                <Link
                  href={section.link}
                  className="inline-flex items-center gap-3 font-sans text-label tracking-widest uppercase text-charcoal group"
                >
                  Discover
                  <span className="block w-8 h-px bg-charcoal group-hover:w-14 transition-all duration-300" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* === CLOSING CTA === */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden grain">
        <Image
          src="/images/bullion-king-lake-3.jpg"
          alt="Mountain landscape near Purgatory"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
        <div className="relative z-10 h-full flex flex-col items-center justify-end text-center pb-20 md:pb-28 px-6">
          <motion.div {...fadeInUp}>
            <p className="font-sans text-caption uppercase tracking-[0.3em] text-white/60 mb-5">
              Begin your stay
            </p>
            <h2 className="font-display text-display-lg text-white mb-10 max-w-3xl drop-shadow-lg">
              The mountains are waiting
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/property"
                className="font-sans text-base tracking-widest uppercase px-10 py-4 border border-white/30 text-white rounded-full hover:bg-white/15 backdrop-blur-sm transition-all duration-300"
              >
                Explore the Townhouse
              </Link>
              <Link
                href="https://www.airbnb.com/rooms/1205985906587842742"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-base tracking-widest uppercase px-10 py-4 bg-white text-charcoal rounded-full hover:bg-stone-pale transition-all duration-300 flex items-center justify-center gap-2"
              >
                Book on Airbnb
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
