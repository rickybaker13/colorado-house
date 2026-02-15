'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Waves, Mountain, Ruler, MapPin } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

export default function AlpineLakes() {
  const lakes = [
    {
      name: 'Ice Lake',
      elevation: '12,270 ft',
      description: 'The most iconic alpine lake in the San Juans. Ice Lake sits in a dramatic cirque surrounded by jagged 13,000-foot peaks, its waters an almost unbelievable shade of turquoise. The color comes from glacial rock flour — fine sediment suspended in the water that catches and refracts light. On a sunny day, the blues and greens are so vivid they look digitally enhanced, but this is the real thing.',
      hike: '8.4 miles round trip via Ice Lakes Trail',
      driveTime: '45 min from the house',
      image: '/images/ice-lake-panoramic.jpg',
      imageAlt: 'Turquoise waters of Ice Lake surrounded by jagged peaks',
      orientation: 'landscape' as const,
    },
    {
      name: 'Molas Lake',
      elevation: '10,515 ft',
      description: 'Just twenty minutes up the Million Dollar Highway, Molas Lake is the most accessible alpine lake in the area — and one of the most photogenic. The lake sits in an open meadow with panoramic views of the Grenadier Range and the Needle Mountains. Kayak, paddleboard, or fish for stocked rainbow trout. The lake is also a popular starting point for backpacking trips into the Weminuche Wilderness.',
      hike: 'Drive-up access, no hiking required',
      driveTime: '20 min from the house',
      image: '/images/kayak-mountain-lake.jpg',
      imageAlt: 'Kayaking on a mountain lake with San Juan peaks in the background',
      orientation: 'landscape' as const,
    },
    {
      name: 'Columbine Lake',
      elevation: '12,693 ft',
      description: 'A brilliant sapphire-colored alpine pool at the head of Mill Creek, reached by a challenging but rewarding trail off the Million Dollar Highway. The lake sits at nearly 12,700 feet surrounded by loose talus and alpine tundra, with the option to continue to Columbine Pass at 13,094 feet for even bigger views. Brook trout fishing is excellent here.',
      hike: '6.6–8.2 miles round trip via Columbine Lake Trail #509',
      driveTime: '50 min from the house',
      image: '/images/columbine-lake.jpg',
      imageAlt: 'Columbine Lake — sapphire waters surrounded by alpine tundra',
      orientation: 'landscape' as const,
    },
    {
      name: 'Island Lake',
      elevation: '12,392 ft',
      description: 'Just beyond Ice Lake, Island Lake sits 120 feet higher in an even more dramatic setting — a crystal-clear tarn ringed by towering peaks on three sides with a small rocky island breaking the surface. The reflection of the surrounding peaks in the still water is one of the most photographed scenes in all of Colorado. Worth the extra 0.7-mile push from Ice Lake.',
      hike: 'Continue 0.7 miles past Ice Lake',
      driveTime: '45 min from the house',
      image: '/images/island-lake-panoramic.jpg',
      imageAlt: 'Island Lake reflecting towering San Juan peaks',
      orientation: 'landscape' as const,
    },
    {
      name: 'Bullion King Lake',
      elevation: '11,400 ft',
      description: 'A hidden gem tucked into the mountains above Purgatory, Bullion King Lake rewards hikers with a serene alpine setting surrounded by rugged peaks and wildflower meadows. Less trafficked than the Ice Lakes trail, this moderate hike climbs through dense spruce forest before opening into a wide basin with the sparkling lake at its center. The trailhead is just a short drive from the house, making it a perfect half-day adventure.',
      hike: '6.0 miles round trip',
      driveTime: '15 min from the house',
      image: '/images/bullion-king-lake-7.jpg',
      imageAlt: 'Bullion King Lake nestled among rugged San Juan peaks',
      orientation: 'landscape' as const,
    },
  ];

  return (
    <main style={{ backgroundColor: '#fafaf8', minHeight: '100vh' }}>
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden grain" style={{ height: '70vh', minHeight: '450px' }}>
        <Image
          src="/images/ice-lakes-trail.jpg"
          alt="Trail leading to Ice Lake in the San Juan Mountains"
          fill
          className="object-cover"
          sizes="100vw"
          priority
          quality={90}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.5) 100%)' }}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.p
            className="font-sans"
            style={{ fontSize: '13px', letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            San Juan Mountains &middot; 10,000–12,700&apos;
          </motion.p>
          <motion.h1
            className="font-display max-w-4xl"
            style={{ fontSize: 'clamp(42px, 7vw, 88px)', fontWeight: 300, color: '#ffffff', textShadow: '0 2px 15px rgba(0,0,0,0.3)', lineHeight: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Alpine Lakes
          </motion.h1>
          <motion.p
            className="font-sans max-w-2xl"
            style={{ fontSize: 'clamp(17px, 2.2vw, 22px)', color: 'rgba(255,255,255,0.85)', marginTop: '20px', fontWeight: 300, lineHeight: 1.5, textShadow: '0 1px 8px rgba(0,0,0,0.2)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Glacier-carved lakes with impossible colors, hidden above 12,000 feet
          </motion.p>
        </div>
      </section>

      {/* ===================== INTRO ===================== */}
      <section style={{ padding: 'clamp(60px, 8vw, 120px) 24px' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp}>
            <p className="font-sans" style={{ fontSize: '12px', letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: '#c4956a', marginBottom: '20px' }}>
              Crystal Waters
            </p>
            <h2 className="font-display" style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 300, lineHeight: 1.15, color: '#1a1a2e', marginBottom: '28px' }}>
              Waters so clear they mirror the sky
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <p className="font-sans" style={{ fontSize: '18px', fontWeight: 300, lineHeight: 1.7, color: '#4a4540' }}>
                The San Juan Mountains are home to dozens of alpine lakes carved by glaciers thousands of years ago. Fed by snowmelt and underground springs, these high-country jewels shimmer in shades of turquoise, sapphire, and emerald — colors so vivid they defy description. From drive-up access at Molas Lake to hard-earned summits above Ice Lake, every lake tells a different story.
              </p>
              <p className="font-sans" style={{ fontSize: '18px', fontWeight: 300, lineHeight: 1.7, color: '#4a4540' }}>
                Most alpine lakes are accessible from mid-July through mid-September, when snowfields have melted enough to reveal the trails. Bring layers — weather above 12,000 feet can change in minutes — and arrive early to catch the still morning light on the water.
              </p>
            </div>
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="grid grid-cols-2 md:grid-cols-4"
            style={{ gap: '1px', marginTop: '56px', backgroundColor: 'rgba(212,165,116,0.2)', borderRadius: '2px', overflow: 'hidden' }}
          >
            {[
              { icon: Waves, value: '5', label: 'Featured Lakes' },
              { icon: Mountain, value: '12,693\'', label: 'Highest Lake' },
              { icon: Ruler, value: '0–8.4', label: 'Miles to Reach' },
              { icon: MapPin, value: '15–50 min', label: 'Drive from House' },
            ].map((stat) => (
              <div key={stat.label} className="text-center" style={{ backgroundColor: '#fafaf8', padding: '24px 16px' }}>
                <stat.icon size={20} style={{ margin: '0 auto', color: '#c4956a', marginBottom: '10px' }} />
                <p className="font-display" style={{ fontSize: '28px', fontWeight: 300, color: '#1a1a2e' }}>
                  {stat.value}
                </p>
                <p className="font-sans" style={{ fontSize: '13px', color: '#9a9590', marginTop: '4px', letterSpacing: '0.04em' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================== LAKE SECTIONS ===================== */}
      {lakes.map((lake, idx) => (
        <section key={lake.name}>
          {/* Image + text layout alternating */}
          <div className={`grid grid-cols-1 lg:grid-cols-2 ${idx % 2 === 1 ? 'lg:direction-rtl' : ''}`}>
            {/* Image */}
            <motion.div
              {...fadeInUp}
              className={`relative overflow-hidden ${idx % 2 === 1 ? 'lg:order-2' : ''}`}
              style={{ minHeight: '450px', aspectRatio: lake.orientation === 'landscape' ? '4/3' : undefined }}
            >
              <Image
                src={lake.image}
                alt={lake.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={85}
              />
            </motion.div>

            {/* Content */}
            <motion.div
              {...fadeInUp}
              className={`flex items-center ${idx % 2 === 1 ? 'lg:order-1' : ''}`}
              style={{ padding: 'clamp(40px, 6vw, 80px)', backgroundColor: idx % 2 === 0 ? '#fafaf8' : '#f5f0eb' }}
            >
              <div style={{ maxWidth: '560px' }}>
                <div className="flex items-center" style={{ gap: '16px', marginBottom: '16px' }}>
                  <p className="font-sans" style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#c4956a' }}>
                    {lake.elevation}
                  </p>
                </div>
                <h2 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 300, color: '#1a1a2e', marginBottom: '24px', lineHeight: 1.15 }}>
                  {lake.name}
                </h2>
                <p className="font-sans" style={{ fontSize: '17px', fontWeight: 300, lineHeight: 1.7, color: '#4a4540', marginBottom: '28px' }}>
                  {lake.description}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                  <div className="flex items-center" style={{ gap: '10px' }}>
                    <Ruler size={15} style={{ color: '#c4956a', flexShrink: 0 }} />
                    <span className="font-sans" style={{ fontSize: '15px', color: '#4a4540' }}>
                      {lake.hike}
                    </span>
                  </div>
                  <div className="flex items-center" style={{ gap: '10px' }}>
                    <MapPin size={15} style={{ color: '#c4956a', flexShrink: 0 }} />
                    <span className="font-sans" style={{ fontSize: '15px', color: '#4a4540' }}>
                      {lake.driveTime}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* ===================== CTA ===================== */}
      <section className="relative overflow-hidden grain" style={{ height: 'clamp(400px, 60vh, 700px)' }}>
        <Image
          src="/images/alpenglow-sunset.jpg"
          alt="Alpenglow sunset on the San Juan Mountains"
          fill
          className="object-cover"
          sizes="100vw"
          quality={85}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)' }}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-end text-center px-6" style={{ paddingBottom: 'clamp(48px, 8vw, 100px)' }}>
          <motion.div {...fadeInUp}>
            <p className="font-sans" style={{ fontSize: '13px', letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>
              Your basecamp for lake country
            </p>
            <h2 className="font-display max-w-3xl" style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 300, color: '#ffffff', textShadow: '0 2px 20px rgba(0,0,0,0.3)', marginBottom: '36px' }}>
              Every lake is worth the trek
            </h2>
            <div className="flex flex-col sm:flex-row justify-center" style={{ gap: '16px' }}>
              <Link
                href="/hiking"
                className="font-sans rounded-full transition-all duration-300"
                style={{ fontSize: '15px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '16px 40px', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', backdropFilter: 'blur(8px)' }}
              >
                Trail Guide
              </Link>
              <Link
                href="https://www.airbnb.com/rooms/1205985906587842742"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans rounded-full transition-all duration-300 flex items-center justify-center"
                style={{ fontSize: '15px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '16px 40px', backgroundColor: '#fff', color: '#1a1a2e', gap: '8px' }}
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
