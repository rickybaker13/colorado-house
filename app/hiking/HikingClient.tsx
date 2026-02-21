'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Clock, TrendingUp, Ruler, Mountain, MapPin, Star, Footprints } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

interface Trail {
  name: string;
  tagline: string;
  distance: string;
  elevationGain: string;
  highPoint: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Very Hard';
  time: string;
  trailhead: string;
  driveTime: string;
  description: string[];
  highlights: string[];
  bestSeason: string;
  alltrailsUrl: string;
  image: string;
  imageAlt: string;
  recommended?: boolean;
  badge?: string;
}

export default function HikingClient() {
  const trails: Trail[] = [
    {
      name: 'Purgatory Trail',
      tagline: 'Walk out the front door',
      distance: '8.6 miles',
      elevationGain: '1,656 ft',
      highPoint: '8,800 ft',
      difficulty: 'Hard',
      time: '4–5 hours',
      trailhead: 'Purgatory neighborhood',
      driveTime: '2-minute walk from the house',
      description: [
        'The trailhead sits right in the neighborhood — a short walk down the street from the townhouse. Purgatory Trail (#511) descends about 800 vertical feet over the first mile to the flats, then follows the contour of Cascade Creek for three miles to its confluence with the Animas River.',
        'The terrain is wonderfully varied: a rocky initial descent, flat meadow hiking through Purgatory Flats, then a series of five up-and-down sections through old-growth forest before a final steep descent to the Animas River and the Animas River Bridge. Wildflowers, river views, and the chance to spot bears make this a quintessential San Juan experience.',
      ],
      highlights: [
        'Trailhead steps from the townhouse',
        'Cascade Creek & Animas River views',
        'Purgatory Flats meadow camping',
        'Diverse terrain — forest, meadow, river',
        'Bear and wildlife sightings common',
      ],
      bestSeason: 'June – October',
      alltrailsUrl: 'https://www.alltrails.com/trail/us/colorado/purgatory-trail',
      image: '/images/waterfall-gorge.jpg',
      imageAlt: 'Waterfall gorge along the Purgatory Trail',
      badge: 'From Your Doorstep',
    },
    {
      name: 'Ice Lakes & Island Lake',
      tagline: 'Colorado\'s most beautiful alpine lakes',
      distance: '8.4 miles',
      elevationGain: '2,550 ft',
      highPoint: '12,392 ft',
      difficulty: 'Very Hard',
      time: '5–7 hours',
      trailhead: 'South Mineral Campground',
      driveTime: '45 min from the house',
      description: [
        'This is the premier hike out of Silverton and one of the most photographed trails in all of Colorado. The Ice Lakes Trail climbs relentlessly from the trailhead at 9,840 feet through dense forest, breaking above timberline into a lower basin of wildflower meadows before the final push to two of the most stunning alpine lakes in the Lower 48.',
        'Ice Lake sits at 12,270 feet — a surreal, impossibly turquoise pool cradled beneath jagged 13,000-foot ridgelines. Continue another 0.7 miles to Island Lake at 12,392 feet for an even more dramatic setting, ringed by towering peaks reflected in crystal-clear waters. The colors of these lakes have to be seen to be believed.',
      ],
      highlights: [
        'Two jaw-dropping turquoise alpine lakes',
        'Wildflower meadows in lower basin',
        'Views of 13,000-ft peaks from every angle',
        'Widely considered Colorado\'s most scenic hike',
        'Good fishing for brook trout at Columbine Lake nearby',
      ],
      bestSeason: 'Mid-July – Mid-September',
      alltrailsUrl: 'https://www.alltrails.com/trail/us/colorado/island-lake-and-ice-lake-via-ice-lakes-trail',
      image: '/images/ice-lakes-trail.jpg',
      imageAlt: 'Trail through wildflower meadows toward Ice Lake and surrounding peaks',
      recommended: true,
      badge: 'Top Pick',
    },
    {
      name: 'Columbine Lake',
      tagline: 'Sapphire waters off the Million Dollar Highway',
      distance: '6.6–8.2 miles',
      elevationGain: '2,540 ft',
      highPoint: '12,693 ft',
      difficulty: 'Hard',
      time: '5–6 hours',
      trailhead: 'Forest Road 820, off US-550',
      driveTime: '50 min from the house',
      description: [
        'One of the most rewarding day hikes off the Million Dollar Highway, the Columbine Lake Trail (#509) climbs through 13 steep switchbacks before breaking above timberline into some of the most beautiful alpine terrain in the San Juans. The initial mile is demanding — gaining elevation rapidly from the trailhead at 10,340 feet — but the payoff is extraordinary.',
        'At the two-mile mark, you reach a saddle at 12,448 feet where the grade softens and the trail becomes a pleasant walk into the upper basin of Mill Creek. The trail follows the creek to its source: Columbine Lake, a brilliantly sapphire-colored alpine pool at 12,693 feet. Brook trout fishing is good here, and strong hikers can continue to Columbine Pass at 13,094 feet for even bigger views.',
      ],
      highlights: [
        'Brilliant sapphire-colored alpine lake',
        'Above-treeline hiking with panoramic views',
        'Good brook trout fishing',
        'Option to continue to Columbine Pass (13,094 ft)',
        'Accessible from the Million Dollar Highway',
      ],
      bestSeason: 'Mid-July – Mid-September',
      alltrailsUrl: 'https://www.alltrails.com/trail/us/colorado/columbine-lake-trail-509',
      image: '/images/sunflowers-mountain-valley.jpg',
      imageAlt: 'Sunflowers and alpine valley in the San Juan Mountains',
    },
    {
      name: 'Coal Bank Pass to Engineer Mountain',
      tagline: 'The best wildflower hike in the San Juans',
      distance: '6.0 miles',
      elevationGain: '2,425 ft',
      highPoint: '12,968 ft',
      difficulty: 'Hard',
      time: '4–6 hours',
      trailhead: 'Coal Bank Pass, US-550',
      driveTime: '15 min from the house',
      description: [
        'Just up the road from the townhouse, Coal Bank Pass is the starting point for one of the finest wildflower hikes in all of Colorado. The trail climbs northeast from the pass through spruce-fir forest before emerging into expansive alpine meadows that explode with color from mid-July through August — columbines, paintbrush, lupine, and dozens more.',
        'From the meadows, the trail steepens as it approaches Engineer Mountain, a dramatic 12,968-foot peak that towers above the surrounding landscape. The final push to the summit involves some Class 3 scrambling over rocky terrain, but you don\'t need to summit to have an incredible day — the meadow views alone are worth the trip. No fees, no registration, just wildflowers and big mountain scenery.',
      ],
      highlights: [
        'Spectacular wildflower meadows in summer',
        'Dramatic views of Engineer Mountain',
        'Just 15 minutes from the townhouse',
        'No fees or permits required',
        'Meadow hike is family-friendly (skip the summit scramble)',
      ],
      bestSeason: 'Mid-July – August (peak wildflowers)',
      alltrailsUrl: 'https://www.alltrails.com/trail/us/colorado/coal-bank-pass-to-engineer-summit',
      image: '/images/wildflower-meadow-peaks.jpg',
      imageAlt: 'Wildflower meadow with dramatic San Juan peaks',
      recommended: true,
      badge: 'Wildflower Paradise',
    },
  ];

  const difficultyColor = (d: string) => {
    switch (d) {
      case 'Easy': return '#4a7c59';
      case 'Moderate': return '#c4956a';
      case 'Hard': return '#b87333';
      case 'Very Hard': return '#8b4513';
      default: return '#4a4540';
    }
  };

  return (
    <main style={{ backgroundColor: '#fafaf8', minHeight: '100vh' }}>
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden grain" style={{ height: '70vh', minHeight: '450px' }}>
        <Image
          src="/images/sunflowers-mountain-valley.jpg"
          alt="Alpine wildflowers and mountain valley in the San Juans"
          fill
          className="object-cover"
          sizes="100vw"
          priority
          quality={90}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.55) 100%)' }}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.p
            className="font-sans"
            style={{ fontSize: '13px', letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            San Juan Mountains &middot; 8,000–13,000&apos;
          </motion.p>
          <motion.h1
            className="font-display max-w-4xl"
            style={{ fontSize: 'clamp(42px, 7vw, 88px)', fontWeight: 300, color: '#ffffff', textShadow: '0 2px 15px rgba(0,0,0,0.3)', lineHeight: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Hiking the San Juans
          </motion.h1>
          <motion.p
            className="font-sans max-w-2xl"
            style={{ fontSize: 'clamp(17px, 2.2vw, 22px)', color: 'rgba(255,255,255,0.85)', marginTop: '20px', fontWeight: 300, lineHeight: 1.5, textShadow: '0 1px 8px rgba(0,0,0,0.2)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Alpine lakes, wildflower meadows, and 13,000-foot peaks — with trails that start right from the front door
          </motion.p>
        </div>
      </section>

      {/* ===================== INTRO ===================== */}
      <section style={{ padding: 'clamp(60px, 8vw, 120px) 24px' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp}>
            <p className="font-sans" style={{ fontSize: '12px', letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: '#c4956a', marginBottom: '20px' }}>
              Trail Guide
            </p>
            <h2 className="font-display" style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 300, lineHeight: 1.15, color: '#1a1a2e', marginBottom: '28px' }}>
              Four trails we love
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <p className="font-sans" style={{ fontSize: '18px', fontWeight: 300, lineHeight: 1.7, color: '#4a4540' }}>
                The San Juan Mountains offer some of the most spectacular hiking in all of Colorado — from gentle meadow walks to lung-burning climbs above 12,000 feet. Here are four of our favorite trails, ranging from one that starts steps from the townhouse to the iconic turquoise lakes above Silverton.
              </p>
              <p className="font-sans" style={{ fontSize: '18px', fontWeight: 300, lineHeight: 1.7, color: '#4a4540' }}>
                A note on altitude: our townhouse sits at 8,793 feet, and several of these trails climb above 12,000 feet. If you&apos;re coming from sea level, give yourself a day or two to acclimate before tackling the harder hikes. Start with the Purgatory Trail or the meadow section of Coal Bank Pass, then work up to Ice Lakes.
              </p>
            </div>
          </motion.div>

          {/* Quick reference bar */}
          <motion.div
            {...fadeInUp}
            className="grid grid-cols-2 md:grid-cols-4"
            style={{ gap: '1px', marginTop: '56px', backgroundColor: 'rgba(212,165,116,0.2)', borderRadius: '2px', overflow: 'hidden' }}
          >
            {[
              { icon: Footprints, value: '4', label: 'Trails' },
              { icon: Ruler, value: '6–8.4', label: 'Miles (round trip)' },
              { icon: TrendingUp, value: '12,693\'', label: 'Highest Point' },
              { icon: MapPin, value: '2 min – 50 min', label: 'Drive from House' },
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

      {/* ===================== TRAIL CARDS ===================== */}
      {trails.map((trail, idx) => (
        <section key={trail.name} style={{ paddingBottom: 'clamp(40px, 6vw, 80px)' }}>
          {/* Full-bleed image */}
          <div className="relative w-full overflow-hidden" style={{ height: 'clamp(350px, 55vh, 600px)' }}>
            <Image
              src={trail.image}
              alt={trail.imageAlt}
              fill
              className="object-cover"
              sizes="100vw"
              quality={85}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.6) 100%)' }}
            />

            {/* Trail name overlay */}
            <div className="absolute bottom-0 left-0 right-0 z-10" style={{ padding: 'clamp(24px, 4vw, 48px)' }}>
              <div className="max-w-6xl mx-auto flex flex-wrap items-end justify-between" style={{ gap: '16px' }}>
                <div>
                  {trail.badge && (
                    <span className="font-sans inline-block" style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#ffffff', backgroundColor: 'rgba(196,149,106,0.9)', padding: '6px 14px', marginBottom: '14px', borderRadius: '2px' }}>
                      {trail.badge}
                    </span>
                  )}
                  <h2 className="font-display" style={{ fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 300, color: '#ffffff', textShadow: '0 2px 12px rgba(0,0,0,0.4)', lineHeight: 1.1 }}>
                    {trail.name}
                  </h2>
                  <p className="font-sans" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', marginTop: '8px', textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}>
                    {trail.tagline}
                  </p>
                </div>
                <div className="flex flex-wrap" style={{ gap: '20px' }}>
                  <span className="font-sans" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                    {trail.distance}
                  </span>
                  <span className="font-sans" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                    ↑ {trail.elevationGain}
                  </span>
                  <span className="font-sans" style={{ fontSize: '15px', color: difficultyColor(trail.difficulty), fontWeight: 500, textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                    {trail.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Trail detail card */}
          <div className="max-w-6xl mx-auto px-6" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
            <motion.div
              {...fadeInUp}
              style={{ backgroundColor: 'rgba(250,250,248,0.97)', backdropFilter: 'blur(8px)', padding: 'clamp(28px, 4vw, 48px)', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: '48px' }}>
                {/* Description */}
                <div className="lg:col-span-2">
                  {trail.description.map((p, i) => (
                    <p key={i} className="font-sans" style={{ fontSize: '17px', fontWeight: 300, lineHeight: 1.7, color: '#4a4540', marginBottom: i < trail.description.length - 1 ? '18px' : '0' }}>
                      {p}
                    </p>
                  ))}
                </div>

                {/* Stats sidebar */}
                <div>
                  {/* Stats grid */}
                  <div className="grid grid-cols-2" style={{ gap: '1px', backgroundColor: 'rgba(212,165,116,0.2)', marginBottom: '24px' }}>
                    {[
                      { icon: Ruler, label: 'Distance', value: trail.distance },
                      { icon: TrendingUp, label: 'Elevation', value: trail.elevationGain },
                      { icon: Mountain, label: 'High Point', value: trail.highPoint },
                      { icon: Clock, label: 'Time', value: trail.time },
                    ].map((stat) => (
                      <div key={stat.label} style={{ backgroundColor: '#fafaf8', padding: '16px' }}>
                        <stat.icon size={16} style={{ color: '#c4956a', marginBottom: '6px' }} />
                        <p className="font-sans" style={{ fontSize: '11px', color: '#9a9590', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                          {stat.label}
                        </p>
                        <p className="font-sans" style={{ fontSize: '16px', color: '#1a1a2e', fontWeight: 500, marginTop: '2px' }}>
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Location */}
                  <div style={{ marginBottom: '20px' }}>
                    <p className="font-sans" style={{ fontSize: '12px', color: '#9a9590', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '4px' }}>
                      Trailhead
                    </p>
                    <p className="font-sans" style={{ fontSize: '15px', color: '#1a1a2e' }}>
                      {trail.trailhead}
                    </p>
                    <p className="font-sans" style={{ fontSize: '14px', color: '#c4956a', marginTop: '2px' }}>
                      {trail.driveTime}
                    </p>
                  </div>

                  {/* Best season */}
                  <div style={{ marginBottom: '24px' }}>
                    <p className="font-sans" style={{ fontSize: '12px', color: '#9a9590', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '4px' }}>
                      Best Season
                    </p>
                    <p className="font-sans" style={{ fontSize: '15px', color: '#1a1a2e' }}>
                      {trail.bestSeason}
                    </p>
                  </div>

                  {/* AllTrails link */}
                  <Link
                    href={trail.alltrailsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-sans transition-all duration-300"
                    style={{ fontSize: '14px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#1a1a2e', gap: '8px', borderBottom: '1px solid rgba(26,26,46,0.2)', paddingBottom: '4px' }}
                  >
                    View on AllTrails
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Highlights */}
              <div style={{ marginTop: '36px', paddingTop: '28px', borderTop: '1px solid rgba(212,165,116,0.25)' }}>
                <p className="font-sans" style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#c4956a', marginBottom: '16px' }}>
                  Highlights
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '10px' }}>
                  {trail.highlights.map((h) => (
                    <div key={h} className="flex items-start" style={{ gap: '10px' }}>
                      <Star size={13} style={{ color: '#c4956a', flexShrink: 0, marginTop: '4px' }} />
                      <span className="font-sans" style={{ fontSize: '15px', color: '#4a4540', lineHeight: 1.5 }}>
                        {h}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* ===================== SAFETY TIPS ===================== */}
      <section style={{ backgroundColor: '#f5f0eb', padding: 'clamp(60px, 8vw, 100px) 24px' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp}>
            <p className="font-sans" style={{ fontSize: '12px', letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: '#c4956a', marginBottom: '16px' }}>
              Before You Go
            </p>
            <h2 className="font-display" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 300, color: '#1a1a2e', marginBottom: '32px' }}>
              High-altitude hiking tips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '32px' }}>
              {[
                {
                  title: 'Acclimate first',
                  text: 'Give yourself a day or two at the townhouse (8,793 ft) before attempting trails above 12,000 ft. Hydrate well and take it easy.',
                },
                {
                  title: 'Start early',
                  text: 'Summer thunderstorms build by early afternoon, especially during monsoon season (July–August). Aim to be above treeline before noon and heading down by 1 PM.',
                },
                {
                  title: 'Layer up',
                  text: 'Temperatures can swing 40°F in a single hike. Bring a rain shell, warm layer, and sun protection — even on bluebird days.',
                },
                {
                  title: 'Bear country',
                  text: 'Black bears are common in the San Juans. Make noise on the trail, carry bear spray, and store food properly. Bears with cubs are often spotted on the Purgatory Trail.',
                },
                {
                  title: 'Know your limits',
                  text: 'If you feel symptoms of altitude sickness (headache, nausea, dizziness), descend immediately. Every trail here has beautiful scenery well before the high point.',
                },
                {
                  title: 'Leave no trace',
                  text: 'Alpine meadows are fragile and take decades to recover. Stay on trail, pack out all waste, and avoid trampling wildflowers for photos.',
                },
              ].map((tip) => (
                <div key={tip.title} style={{ borderLeft: '2px solid rgba(196,149,106,0.4)', paddingLeft: '20px' }}>
                  <h3 className="font-sans" style={{ fontSize: '16px', fontWeight: 500, color: '#1a1a2e', marginBottom: '8px' }}>
                    {tip.title}
                  </h3>
                  <p className="font-sans" style={{ fontSize: '15px', fontWeight: 300, lineHeight: 1.6, color: '#4a4540' }}>
                    {tip.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="relative overflow-hidden grain" style={{ height: 'clamp(400px, 60vh, 700px)' }}>
        <Image
          src="/images/bullion-king-lake-3.jpg"
          alt="Mountain landscape near Purgatory"
          fill
          className="object-cover"
          sizes="100vw"
          quality={85}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.1) 100%)' }}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-end text-center px-6" style={{ paddingBottom: 'clamp(48px, 8vw, 100px)' }}>
          <motion.div {...fadeInUp}>
            <p className="font-sans" style={{ fontSize: '13px', letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>
              Your basecamp awaits
            </p>
            <h2 className="font-display max-w-3xl" style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 300, color: '#ffffff', textShadow: '0 2px 20px rgba(0,0,0,0.3)', marginBottom: '36px' }}>
              The trail starts here
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
