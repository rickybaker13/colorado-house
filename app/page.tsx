'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { ArrowUpRight, ChevronDown, Mountain, Users, BedDouble, Bath } from 'lucide-react';

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
  const heroScale = useTransform(heroScroll, [0, 0.6], [1, 1.08]);

  const sections = [
    {
      title: 'San Juan Mountains',
      subtitle: 'Ancient peaks, endless wilderness',
      description: 'Born from volcanic fire 35 million years ago, the San Juans hold some of Colorado\'s most dramatic scenery — jagged fourteeners, alpine tundra, and wilderness that stretches to every horizon. Seven peaks over 14,000 feet lie within twenty miles of our door.',
      link: '/san-juan-mountains',
      image: '/images/alpine-valley.jpg',
      imageAlt: 'Alpine valley in the San Juan Mountains',
    },
    {
      title: 'Alpine Trails',
      subtitle: '500 miles of maintained trails',
      description: 'From the wildflower meadows of the Colorado Trail to the exposed ridgelines of the Needles, every trail tells a different story. The Weminuche Wilderness — Colorado\'s largest at 500,000 acres — is your backyard.',
      link: '/hiking',
      image: '/images/wildflowers-pass.jpg',
      imageAlt: 'Wildflower meadow at alpine pass',
    },
    {
      title: 'Crystal Waters',
      subtitle: 'Glacier-carved alpine lakes',
      description: 'Bullion King Lake at 11,710 feet, Ice Lakes Basin\'s impossible turquoise, and dozens more. These high-country jewels are worth every switchback — waters so clear they mirror the peaks above.',
      link: '/alpine-lakes',
      image: '/images/bullion-king-lake-4.jpg',
      imageAlt: 'Alpine lake in the San Juans',
    },
    {
      title: 'Durango',
      subtitle: 'Founded 1880 · Elevation 6,512\'',
      description: 'A historic railroad town along the Animas River. Ride the Durango & Silverton Narrow Gauge Railroad — a National Historic Landmark since 1882 — explore Mesa Verde National Park, or raft Class IV rapids. Just 25 miles south.',
      link: '/durango',
      image: '/images/waterfall.jpg',
      imageAlt: 'Waterfall near Durango in the San Juans',
    },
    {
      title: 'Purgatory Resort',
      subtitle: '1,600 acres · 105 trails · 260" snowfall',
      description: 'World-class skiing with a 2,029-foot vertical drop and kids 12 & under ski free. Come summer: the Inferno Mountain Coaster, alpine slide, and mountain biking. Minutes from our front door.',
      link: '/purgatory-resort',
      image: '/images/hero-mountain.jpg',
      imageAlt: 'Snow-capped peaks near Purgatory Resort',
    },
  ];

  return (
    <main style={{ backgroundColor: '#fafaf8' }}>
      {/* ===================== HERO — FULL SCREEN ===================== */}
      <section ref={heroRef} className="relative w-full overflow-hidden grain" style={{ height: '100vh' }}>
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <Image
            src="/images/alpenglow-sunset.jpg"
            alt="Alpenglow sunset on the San Juan Mountains"
            fill
            className="object-cover"
            sizes="100vw"
            priority
            quality={90}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.55) 100%)' }}
          />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
        >
          <motion.p
            className="font-sans"
            style={{ fontSize: '14px', letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.8)', marginBottom: '28px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Purgatory, Colorado &middot; 8,793&apos;
          </motion.p>

          <motion.h1
            className="font-display max-w-5xl"
            style={{ fontSize: 'clamp(48px, 9vw, 120px)', fontWeight: 300, lineHeight: 1.0, letterSpacing: '-0.03em', color: '#ffffff', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Where the mountains{' '}
            <em style={{ fontStyle: 'italic' }}>meet the sky</em>
          </motion.h1>

          <motion.p
            className="font-sans max-w-2xl"
            style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', color: 'rgba(255,255,255,0.85)', marginTop: '28px', fontWeight: 300, lineHeight: 1.5, textShadow: '0 1px 10px rgba(0,0,0,0.2)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            A luxury mountain retreat in the heart of the San Juan Mountains
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row"
            style={{ marginTop: '44px', gap: '16px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <Link
              href="/property"
              className="font-sans rounded-full transition-all duration-300"
              style={{ fontSize: '15px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '16px 40px', backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}
            >
              Explore the Townhouse
            </Link>
            <Link
              href="/booking"
              className="font-sans rounded-full transition-all duration-300 flex items-center justify-center"
              style={{ fontSize: '15px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '16px 40px', backgroundColor: '#ffffff', color: '#1a1a2e', gap: '8px' }}
            >
              Book Now
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute left-1/2 z-20"
          style={{ bottom: '36px', transform: 'translateX(-50%)' }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={28} style={{ color: 'rgba(255,255,255,0.6)' }} />
        </motion.div>
      </section>

      {/* ===================== THE TOWNHOUSE INTRO ===================== */}
      <section style={{ padding: 'clamp(80px, 12vw, 160px) 0' }} className="px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="max-w-3xl">
            <p className="font-sans" style={{ fontSize: '13px', letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: '#c4956a', marginBottom: '24px' }}>
              The Townhouse
            </p>
            <h2 className="font-display" style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, lineHeight: 1.1, color: '#1a1a2e', marginBottom: '32px' }}>
              Your private mountain sanctuary
            </h2>
            <p className="font-sans" style={{ fontSize: '20px', fontWeight: 300, lineHeight: 1.7, color: '#4a4540' }}>
              Nestled among the pines at the base of Purgatory Resort, this spacious four-bedroom
              townhouse is designed for those who come to the mountains seeking both adventure and
              comfort. Wake to alpine views, gather around the floor-to-ceiling stone fireplace after
              a day on the slopes, and fall asleep to the silence of the high country.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div {...fadeInUp} className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '24px', marginTop: '64px' }}>
            {[
              { icon: Mountain, value: '8,793\'', label: 'Elevation' },
              { icon: Users, value: '10', label: 'Guests' },
              { icon: BedDouble, value: '4', label: 'Bedrooms' },
              { icon: Bath, value: '3.5', label: 'Bathrooms' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                style={{ paddingTop: '28px', borderTop: '1px solid rgba(212,165,116,0.3)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <stat.icon size={22} style={{ color: '#c4956a', marginBottom: '14px' }} />
                <p className="font-display" style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 300, color: '#1a1a2e' }}>
                  {stat.value}
                </p>
                <p className="font-sans" style={{ fontSize: '15px', color: '#4a4540', marginTop: '6px', letterSpacing: '0.04em' }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================== PROPERTY IMAGES — exterior first ===================== */}
      <section className="px-4 md:px-6" style={{ paddingBottom: 'clamp(60px, 8vw, 120px)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="grid grid-cols-1 md:grid-cols-12" style={{ gap: '12px' }}>
            {/* Main: exterior (kitchen-1.jpg) */}
            <div className="md:col-span-7 relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
              <Image
                src="/images/kitchen-1.jpg"
                alt="Purgatory Townhouse — modern mountain architecture"
                fill
                className="object-cover hover:scale-[1.02] transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 58vw"
                quality={85}
              />
            </div>
            {/* Right stack */}
            <div className="md:col-span-5 grid grid-rows-2" style={{ gap: '12px' }}>
              <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <Image
                  src="/images/views-1.jpg"
                  alt="Open living room with vaulted ceilings and fireplace"
                  fill
                  className="object-cover hover:scale-[1.02] transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 42vw"
                  quality={85}
                />
              </div>
              <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <Image
                  src="/images/exterior-3.jpg"
                  alt="Master bedroom with Pendleton blanket and mountain decor"
                  fill
                  className="object-cover hover:scale-[1.02] transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 42vw"
                  quality={85}
                />
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} className="flex flex-wrap justify-center" style={{ gap: '32px', marginTop: '44px' }}>
            <Link href="/property" className="font-sans" style={{ fontSize: '16px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#1a1a2e', borderBottom: '2px solid rgba(26,26,46,0.2)', paddingBottom: '4px' }}>
              View the property
            </Link>
            <Link href="/gallery" className="font-sans" style={{ fontSize: '16px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#1a1a2e', borderBottom: '2px solid rgba(26,26,46,0.2)', paddingBottom: '4px' }}>
              Full gallery
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===================== DESTINATION SECTIONS — full-bleed + overlay ===================== */}
      {sections.map((section, idx) => (
        <section key={section.title} className="relative">
          {/* Full-bleed image */}
          <div className="relative w-full overflow-hidden" style={{ height: 'clamp(500px, 85vh, 900px)' }}>
            <Image
              src={section.image}
              alt={section.imageAlt}
              fill
              className="object-cover"
              sizes="100vw"
              quality={85}
            />
            {/* Dark overlay for readable text */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.6) 100%)' }} />
          </div>

          {/* Content card — overlapping the image */}
          <div className="relative z-10 px-6" style={{ marginTop: '-160px', paddingBottom: 'clamp(40px, 6vw, 100px)' }}>
            <motion.div
              {...fadeInUp}
              className={`max-w-xl ${idx % 2 === 0 ? 'ml-auto mr-6 md:mr-[10%]' : 'mr-auto ml-6 md:ml-[10%]'}`}
            >
              <div style={{ backgroundColor: 'rgba(250,250,248,0.97)', backdropFilter: 'blur(8px)', padding: 'clamp(32px, 5vw, 56px)', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
                <p className="font-sans" style={{ fontSize: '12px', letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: '#c4956a', marginBottom: '16px' }}>
                  {section.subtitle}
                </p>
                <h2 className="font-display" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 300, lineHeight: 1.15, color: '#1a1a2e', marginBottom: '20px' }}>
                  {section.title}
                </h2>
                <p className="font-sans" style={{ fontSize: '18px', fontWeight: 300, lineHeight: 1.7, color: '#4a4540', marginBottom: '28px' }}>
                  {section.description}
                </p>
                <Link
                  href={section.link}
                  className="inline-flex items-center font-sans group"
                  style={{ fontSize: '15px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#1a1a2e', gap: '12px' }}
                >
                  Discover
                  <span className="block group-hover:w-14 transition-all duration-300" style={{ width: '32px', height: '1px', backgroundColor: '#1a1a2e' }} />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* ===================== CLOSING CTA ===================== */}
      <section className="relative overflow-hidden grain" style={{ height: 'clamp(500px, 85vh, 900px)' }}>
        <Image
          src="/images/bullion-king-lake-3.jpg"
          alt="Mountain landscape near Purgatory"
          fill
          className="object-cover"
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.15) 100%)' }} />
        <div className="relative z-10 h-full flex flex-col items-center justify-end text-center px-6" style={{ paddingBottom: 'clamp(60px, 10vw, 120px)' }}>
          <motion.div {...fadeInUp}>
            <p className="font-sans" style={{ fontSize: '13px', letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>
              Begin your stay
            </p>
            <h2 className="font-display max-w-3xl" style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 300, color: '#ffffff', textShadow: '0 2px 20px rgba(0,0,0,0.3)', marginBottom: '40px' }}>
              The mountains are waiting
            </h2>
            <div className="flex flex-col sm:flex-row justify-center" style={{ gap: '16px' }}>
              <Link
                href="/property"
                className="font-sans rounded-full transition-all duration-300"
                style={{ fontSize: '15px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '16px 40px', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', backdropFilter: 'blur(8px)' }}
              >
                Explore the Townhouse
              </Link>
              <Link
                href="/booking"
                className="font-sans rounded-full transition-all duration-300 flex items-center justify-center"
                style={{ fontSize: '15px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '16px 40px', backgroundColor: '#fff', color: '#1a1a2e', gap: '8px' }}
              >
                Book Your Stay
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
