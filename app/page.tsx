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
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
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
          className="object-cover cinematic-image"
          sizes="100vw"
          priority={priority}
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
      subtitle: 'Where the Rockies reach their wildest heights',
      description:
        'Fourteen-thousand-foot peaks, ancient volcanic formations, and wilderness that stretches to every horizon. The San Juans are Colorado at its most raw and magnificent.',
      link: '/san-juan-mountains',
      image: '/images/alpine-valley.jpg',
    },
    {
      id: 'hiking',
      title: 'Alpine Trails',
      subtitle: 'Trails that lead above the timberline',
      description:
        'From gentle wildflower meadows to exposed ridgelines above 13,000 feet, every trail here tells a different story. Lace up and discover terrain that challenges and rewards in equal measure.',
      link: '/hiking',
      image: '/images/wildflowers-pass.jpg',
    },
    {
      id: 'alpine-lakes',
      title: 'Crystal Waters',
      subtitle: 'Alpine lakes carved by ancient glaciers',
      description:
        'Bullion King Lake, Ice Lakes Basin, and dozens more — waters so clear they mirror the sky. These high-country jewels are worth every switchback to reach them.',
      link: '/alpine-lakes',
      image: '/images/bullion-king-lake.jpg',
    },
    {
      id: 'durango',
      title: 'Durango',
      subtitle: 'Where the Old West meets mountain culture',
      description:
        'A historic railroad town nestled along the Animas River. Craft breweries, farm-to-table dining, galleries, and a downtown that still feels like stepping back in time.',
      link: '/durango',
      image: '/images/views-1.jpg',
    },
    {
      id: 'purgatory-resort',
      title: 'Purgatory Resort',
      subtitle: 'Four seasons of mountain recreation',
      description:
        'World-class skiing in winter, mountain biking and alpine slides in summer. 1,600 acres of terrain with 107 trails, just minutes from our front door.',
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
            src="/images/hero-front-page.jpg"
            alt="San Juan Mountains panorama"
            fill
            className="object-cover cinematic-image"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
        >
          <motion.p
            className="font-sans text-caption uppercase tracking-[0.25em] text-white/60 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Purgatory, Colorado &middot; Elevation 8,793&apos;
          </motion.p>

          <motion.h1
            className="font-display text-display-xl text-white font-light max-w-5xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Where the mountains{' '}
            <em className="italic font-light">meet the sky</em>
          </motion.h1>

          <motion.p
            className="font-sans text-lg md:text-xl text-white/70 mt-6 max-w-xl font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            A luxury mountain retreat in the heart of Colorado&apos;s San Juan Mountains
          </motion.p>

          <motion.div
            className="mt-10 flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <Link
              href="/property"
              className="font-sans text-sm tracking-widest uppercase px-8 py-3.5 bg-white/10 text-white border border-white/25 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300"
            >
              Explore the Townhouse
            </Link>
            <Link
              href="https://www.airbnb.com/rooms/1205985906587842742"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm tracking-widest uppercase px-8 py-3.5 bg-white text-charcoal rounded-full hover:bg-stone-pale transition-all duration-300 flex items-center gap-2"
            >
              Book Now
              <ArrowUpRight size={14} />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={24} className="text-white/50" />
        </motion.div>
      </section>

      {/* === PROPERTY INTRO === */}
      <section className="relative py-32 md:py-40 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="max-w-3xl">
            <p className="font-sans text-caption uppercase tracking-[0.2em] text-stone mb-6">
              The Townhouse
            </p>
            <h2 className="font-display text-display-lg text-charcoal mb-8">
              Your private mountain sanctuary
            </h2>
            <p className="text-body-lg text-warm-gray-dark font-light leading-relaxed mb-6">
              Nestled among the pines at the base of Purgatory Resort, this spacious four-bedroom
              townhouse is designed for those who come to the mountains seeking both adventure and
              comfort. Wake to alpine views, gather around the fireplace after a day on the slopes,
              and fall asleep to the silence of the high country.
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
                <stat.icon size={20} className="text-stone mb-4" />
                <p className="font-display text-3xl md:text-4xl text-charcoal font-light">
                  {stat.value}
                </p>
                <p className="font-sans text-sm text-warm-gray mt-1 tracking-wide">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === PROPERTY IMAGE GRID === */}
      <section className="px-4 md:px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            {...fadeInUp}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4"
          >
            {/* Large left image */}
            <div className="md:col-span-7 relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/exterior-1.jpg"
                alt="Townhouse exterior"
                fill
                className="object-cover cinematic-image hover:scale-[1.02] transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 58vw"
              />
            </div>
            {/* Right stack */}
            <div className="md:col-span-5 grid grid-rows-2 gap-3 md:gap-4">
              <div className="relative aspect-[16/9] md:aspect-auto overflow-hidden">
                <Image
                  src="/images/living-room-1.jpg"
                  alt="Living room"
                  fill
                  className="object-cover cinematic-image hover:scale-[1.02] transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 42vw"
                />
              </div>
              <div className="relative aspect-[16/9] md:aspect-auto overflow-hidden">
                <Image
                  src="/images/views-1.jpg"
                  alt="Mountain views from property"
                  fill
                  className="object-cover cinematic-image hover:scale-[1.02] transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 42vw"
                />
              </div>
            </div>
          </motion.div>

          {/* View Property + Gallery links */}
          <motion.div
            {...fadeInUp}
            className="flex flex-wrap gap-6 mt-10 justify-center"
          >
            <Link
              href="/property"
              className="font-sans text-sm tracking-widest uppercase text-charcoal border-b border-charcoal/30 pb-1 hover:border-charcoal transition-colors"
            >
              View the property
            </Link>
            <Link
              href="/gallery"
              className="font-sans text-sm tracking-widest uppercase text-charcoal border-b border-charcoal/30 pb-1 hover:border-charcoal transition-colors"
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
            className="w-full h-[70vh] md:h-[80vh]"
          />

          {/* Overlapping content card */}
          <div className="relative z-10 -mt-32 md:-mt-40 pb-20 md:pb-32 px-6">
            <motion.div
              {...fadeInUp}
              className={`max-w-xl ${idx % 2 === 0 ? 'ml-auto mr-6 md:mr-[10%]' : 'mr-auto ml-6 md:ml-[10%]'}`}
            >
              <div className="bg-snow/95 backdrop-blur-sm p-10 md:p-14">
                <p className="font-sans text-caption uppercase tracking-[0.2em] text-stone mb-4">
                  {section.subtitle}
                </p>
                <h2 className="font-display text-display-md text-charcoal mb-6">
                  {section.title}
                </h2>
                <p className="text-body-lg text-warm-gray-dark font-light leading-relaxed mb-8">
                  {section.description}
                </p>
                <Link
                  href={section.link}
                  className="inline-flex items-center gap-2 font-sans text-sm tracking-widest uppercase text-charcoal group"
                >
                  Discover
                  <span className="block w-6 h-px bg-charcoal group-hover:w-10 transition-all duration-300" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* === CLOSING CTA === */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden grain">
        <Image
          src="/images/bullion-king-lake-3.jpg"
          alt="Alpine lake at sunset"
          fill
          className="object-cover cinematic-image"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent" />
        <div className="relative z-10 h-full flex flex-col items-center justify-end text-center pb-20 md:pb-28 px-6">
          <motion.div {...fadeInUp}>
            <p className="font-sans text-caption uppercase tracking-[0.25em] text-white/50 mb-4">
              Begin your stay
            </p>
            <h2 className="font-display text-display-lg text-white font-light mb-8 max-w-3xl">
              The mountains are waiting
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/property"
                className="font-sans text-sm tracking-widest uppercase px-8 py-3.5 border border-white/30 text-white rounded-full hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
              >
                Explore the Townhouse
              </Link>
              <Link
                href="https://www.airbnb.com/rooms/1205985906587842742"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm tracking-widest uppercase px-8 py-3.5 bg-white text-charcoal rounded-full hover:bg-stone-pale transition-all duration-300 flex items-center justify-center gap-2"
              >
                Book on Airbnb
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
