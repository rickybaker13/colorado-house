'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  Star,
  Mountain,
  Users,
  BedDouble,
  Bath,
  ArrowUpRight,
  Check,
  X,
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

export default function PropertyPage() {
  /* Correct photo mapping based on actual image content */
  const rooms = [
    {
      name: 'Great Room',
      detail: 'Vaulted ceilings, floor-to-ceiling stone fireplace, open to kitchen with mountain views',
      image: '/images/views-1.jpg',
      landscape: true,
    },
    {
      name: 'Master Suite',
      detail: 'King bed, Pendleton blanket, mountain-modern decor',
      image: '/images/exterior-3.jpg',
      landscape: false,
    },
    {
      name: 'Gourmet Kitchen',
      detail: 'Quartz counters, knotty alder cabinets, island seating, fully stocked',
      image: '/images/kitchen-2.jpg',
      landscape: true,
    },
    {
      name: 'Bunk Room',
      detail: 'Two bunks, sectional sofa, TV, and Xbox — kids love it',
      image: '/images/living-room-2.jpg',
      landscape: true,
    },
  ];

  const reviews = [
    {
      author: 'Sarah M.',
      text: 'Absolutely stunning place. The vaulted ceilings and floor-to-ceiling fireplace make it feel so grand. We spent every evening around that fireplace after skiing all day at Purgatory.',
      date: 'January 2025',
    },
    {
      author: 'James R.',
      text: 'Perfect for our group ski trip. The bunk room was a huge hit with the kids — they loved having their own space with the Xbox. Kitchen is incredibly well-stocked too.',
      date: 'December 2024',
    },
    {
      author: 'Emily T.',
      text: 'The attention to detail in this home is remarkable. From the Pendleton blankets to the tree-ring art to the southwestern textiles — it truly feels like a mountain retreat, not just a rental.',
      date: 'October 2024',
    },
  ];

  /* Full amenity list organized by category */
  const amenityCategories = [
    {
      title: 'Scenic Views',
      items: ['Mountain views', 'Resort views'],
    },
    {
      title: 'Bathroom',
      items: ['Shampoo', 'Conditioner', 'Body soap', 'Hot water', 'Shower gel', 'Hair dryer'],
    },
    {
      title: 'Bedroom & Laundry',
      items: [
        'Washer — free, in unit',
        'Dryer — free, in unit',
        'Essentials (towels, bed sheets, soap, toilet paper)',
        'Hangers',
        'Iron',
        'Egyptian cotton linens',
        'Extra pillows and blankets',
        'Room-darkening shades',
      ],
    },
    {
      title: 'Entertainment',
      items: ['TV', 'Game console — Xbox', 'Ping pong table', 'Pool table', 'Exercise equipment'],
    },
    {
      title: 'Family',
      items: ['Pack \'n play / travel crib', 'Children\'s dinnerware', 'Board games'],
    },
    {
      title: 'Heating & Cooling',
      items: ['Indoor fireplace — gas', 'Radiant heating', 'Portable fans'],
    },
    {
      title: 'Home Safety',
      items: ['Smoke alarm', 'Carbon monoxide alarm', 'Fire extinguisher'],
    },
    {
      title: 'Internet & Office',
      items: ['WiFi', 'Dedicated workspace'],
    },
    {
      title: 'Kitchen & Dining',
      items: [
        'Full kitchen',
        'Refrigerator',
        'Microwave',
        'Cooking basics (pots, pans, oil, salt, pepper)',
        'Dishes and silverware',
        'Dishwasher',
        'Stove',
        'Oven',
        'Coffee maker',
        'Wine glasses',
        'Baking sheet',
        'BBQ utensils (tongs, spatula, grill brush)',
        'Dining table',
        'Trash compactor',
      ],
    },
    {
      title: 'Location Features',
      items: [
        'Lake access',
        'Ski-in/ski-out — on free shuttle route',
        'Private entrance',
        'Resort access',
      ],
    },
    {
      title: 'Outdoor',
      items: [
        'Private patio or balcony',
        'Outdoor furniture',
        'Hammock',
        'BBQ grill — charcoal',
        'Outdoor dining area',
      ],
    },
    {
      title: 'Parking & Facilities',
      items: ['Free parking on premises', 'Hot tub — shared', 'Gym — shared'],
    },
    {
      title: 'Services',
      items: [
        'Pets allowed',
        'Luggage dropoff allowed',
        'Self check-in',
        'Smart lock',
        'Long-term stays allowed',
      ],
    },
  ];

  const notIncluded = ['Air conditioning'];

  return (
    <main style={{ backgroundColor: '#fafaf8', minHeight: '100vh' }}>
      {/* Hero image grid — EXTERIOR (kitchen-1.jpg) as main */}
      <section className="relative overflow-hidden" style={{ height: '75vh', minHeight: '500px' }}>
        <div className="grid grid-cols-1 md:grid-cols-12 h-full" style={{ gap: '4px' }}>
          <div className="md:col-span-8 relative h-full">
            <Image
              src="/images/kitchen-1.jpg"
              alt="Purgatory Townhouse — modern mountain architecture with deck and garage"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 66vw"
              priority
              quality={90}
            />
          </div>
          <div className="hidden md:grid md:col-span-4 grid-rows-2" style={{ gap: '4px' }}>
            <div className="relative">
              <Image
                src="/images/views-2.jpg"
                alt="Living room with vaulted ceiling and loft"
                fill
                className="object-cover"
                sizes="34vw"
                quality={85}
              />
            </div>
            <div className="relative">
              <Image
                src="/images/bedroom-guest-2.jpg"
                alt="Fireplace and living area from sofa"
                fill
                className="object-cover"
                sizes="34vw"
                quality={85}
              />
            </div>
          </div>
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%, rgba(0,0,0,0.15) 100%)' }}
        />

        {/* Overlaid title */}
        <div className="absolute bottom-0 left-0 right-0 z-10" style={{ padding: 'clamp(24px, 5vw, 48px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="font-sans flex items-center" style={{ fontSize: '14px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.8)', marginBottom: '14px', textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}>
              <MapPin size={14} style={{ marginRight: '8px' }} />
              Purgatory, Durango, Colorado
            </p>
            <h1 className="font-display" style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 300, color: '#ffffff', marginBottom: '16px', textShadow: '0 2px 15px rgba(0,0,0,0.3)' }}>
              Purgatory Townhouse
            </h1>
            <div className="flex flex-wrap items-center font-sans" style={{ gap: '20px', fontSize: '17px', color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}>
              <span className="flex items-center" style={{ gap: '6px' }}>
                <Star size={16} style={{ color: '#d4a574', fill: '#d4a574' }} />
                4.9
              </span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>·</span>
              <span>24 Reviews</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>·</span>
              <span>10 Guests</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>·</span>
              <span>4 Bedrooms</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>·</span>
              <span>3.5 Baths</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick actions bar */}
      <section style={{ borderBottom: '1px solid rgba(212,165,116,0.25)' }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between" style={{ padding: '18px 24px', gap: '16px' }}>
          <div className="flex" style={{ gap: '12px' }}>
            <Link
              href="/gallery"
              className="font-sans rounded-full transition-colors duration-300"
              style={{ fontSize: '14px', letterSpacing: '0.06em', color: '#1a1a2e', border: '1px solid rgba(212,165,116,0.4)', padding: '10px 28px' }}
            >
              All Photos
            </Link>
          </div>
          <Link
            href="/booking"
            className="flex items-center font-sans rounded-full transition-all duration-300"
            style={{ fontSize: '14px', fontWeight: 500, letterSpacing: '0.06em', backgroundColor: '#1a1a2e', color: '#fafaf8', padding: '10px 32px', gap: '8px' }}
          >
            Book Direct
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) 24px' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="grid grid-cols-2 md:grid-cols-5" style={{ gap: '32px' }}>
            {[
              { icon: Mountain, value: '8,793\'', label: 'Elevation' },
              { icon: Users, value: '10', label: 'Guests' },
              { icon: BedDouble, value: '7', label: 'Beds' },
              { icon: BedDouble, value: '4', label: 'Bedrooms' },
              { icon: Bath, value: '3.5', label: 'Bathrooms' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon size={24} style={{ margin: '0 auto', color: '#c4956a', marginBottom: '14px' }} />
                <p className="font-display" style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 300, color: '#1a1a2e' }}>
                  {stat.value}
                </p>
                <p className="font-sans" style={{ fontSize: '14px', color: '#4a4540', marginTop: '6px', letterSpacing: '0.08em' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="px-6" style={{ paddingBottom: 'clamp(60px, 8vw, 120px)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="grid grid-cols-1 lg:grid-cols-5" style={{ gap: '64px' }}>
            <div className="lg:col-span-3">
              <p className="font-sans" style={{ fontSize: '12px', letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: '#c4956a', marginBottom: '20px' }}>
                About the property
              </p>
              <h2 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 300, lineHeight: 1.15, color: '#1a1a2e', marginBottom: '28px' }}>
                Mountain living, refined
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <p className="font-sans" style={{ fontSize: '18px', fontWeight: 300, lineHeight: 1.7, color: '#4a4540' }}>
                  This brand-new townhouse sits at the base of Purgatory Resort in the San Juan
                  Mountains — one of the most dramatic mountain ranges in all of Colorado. With
                  vaulted ceilings, a floor-to-ceiling stone fireplace, and walls of windows
                  framing the surrounding peaks, every room connects you to the landscape.
                </p>
                <p className="font-sans" style={{ fontSize: '18px', fontWeight: 300, lineHeight: 1.7, color: '#4a4540' }}>
                  The main level features an open great room flowing into a gourmet kitchen with
                  knotty alder cabinets, quartz countertops, and a large island. Downstairs, the
                  bunk room with its own TV and Xbox console gives families and groups their own
                  space to spread out. Outside, a private patio and balcony with a hammock and
                  charcoal BBQ grill let you take in the mountain air.
                </p>
              </div>
            </div>

            {/* Quick info card */}
            <div className="lg:col-span-2">
              <div style={{ backgroundColor: '#f5f0eb', padding: 'clamp(28px, 4vw, 44px)' }}>
                <h3 className="font-display" style={{ fontSize: '28px', fontWeight: 300, color: '#1a1a2e', marginBottom: '24px' }}>
                  Details
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'Check-in', value: '4:00 PM' },
                    { label: 'Check-out', value: '10:00 AM' },
                    { label: 'Minimum Stay', value: '2 nights' },
                    { label: 'Pets', value: 'Allowed' },
                    { label: 'Parking', value: 'Free, on premises' },
                    { label: 'Entry', value: 'Smart lock keypad' },
                    { label: 'Luggage', value: 'Early dropoff available' },
                  ].map((item) => (
                    <li
                      key={item.label}
                      className="flex justify-between items-center"
                      style={{ borderBottom: '1px solid rgba(212,165,116,0.3)', paddingBottom: '12px' }}
                    >
                      <span className="font-sans" style={{ fontSize: '14px', color: '#9a9590', letterSpacing: '0.04em' }}>
                        {item.label}
                      </span>
                      <span className="font-sans" style={{ fontSize: '14px', color: '#1a1a2e', fontWeight: 500 }}>
                        {item.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Room showcase — CORRECTED image assignments */}
      <section className="px-4 md:px-6" style={{ paddingBottom: 'clamp(60px, 8vw, 120px)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.p
            {...fadeInUp}
            className="font-sans"
            style={{ fontSize: '12px', letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: '#c4956a', marginBottom: '16px', paddingLeft: '8px' }}
          >
            Spaces
          </motion.p>
          <motion.h2
            {...fadeInUp}
            className="font-display"
            style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 300, color: '#1a1a2e', marginBottom: '48px', paddingLeft: '8px' }}
          >
            Rooms &amp; living areas
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '12px' }}>
            {rooms.map((room, i) => (
              <motion.div
                key={room.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="relative overflow-hidden group"
                style={{ aspectRatio: room.landscape ? '4/3' : '3/4' }}
              >
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 40%, transparent 100%)' }}
                />
                <div className="absolute bottom-0 left-0" style={{ padding: 'clamp(20px, 3vw, 36px)' }}>
                  <h3 className="font-display" style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300, color: '#ffffff', marginBottom: '6px', textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
                    {room.name}
                  </h3>
                  <p className="font-sans" style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}>
                    {room.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* More interior photos strip */}
      <section className="px-4 md:px-6" style={{ paddingBottom: 'clamp(60px, 8vw, 120px)' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4" style={{ gap: '8px' }}>
          {[
            { src: '/images/dining-1.jpg', alt: 'Dining area with tree-ring art' },
            { src: '/images/detail-1.jpg', alt: 'Living room leather sofa and art' },
            { src: '/images/bathroom-2.jpg', alt: 'Main bathroom with marble vanity' },
            { src: '/images/laundry.jpg', alt: 'In-unit LG washer and dryer' },
          ].map((img, i) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="relative overflow-hidden"
              style={{ aspectRatio: '1/1' }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                quality={85}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Full Amenities Section */}
      <section style={{ backgroundColor: '#f5f0eb', padding: 'clamp(60px, 8vw, 120px) 24px' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} style={{ maxWidth: '640px', marginBottom: '64px' }}>
            <p className="font-sans" style={{ fontSize: '12px', letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: '#c4956a', marginBottom: '16px' }}>
              Amenities
            </p>
            <h2 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 300, color: '#1a1a2e' }}>
              Everything you need
            </h2>
          </motion.div>

          <motion.div {...fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '48px' }}>
            {amenityCategories.map((cat) => (
              <div key={cat.title}>
                <h3 className="font-sans" style={{ fontSize: '16px', fontWeight: 500, color: '#1a1a2e', marginBottom: '16px', letterSpacing: '0.03em' }}>
                  {cat.title}
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-start" style={{ gap: '10px' }}>
                      <Check size={15} style={{ color: '#4a7c59', flexShrink: 0, marginTop: '3px' }} />
                      <span className="font-sans" style={{ fontSize: '15px', color: '#4a4540', lineHeight: 1.5 }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>

          {/* Not included */}
          <motion.div {...fadeInUp} style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(212,165,116,0.3)' }}>
            <h3 className="font-sans" style={{ fontSize: '16px', fontWeight: 500, color: '#1a1a2e', marginBottom: '16px' }}>
              Not included
            </h3>
            <div className="flex flex-wrap" style={{ gap: '16px' }}>
              {notIncluded.map((item) => (
                <div key={item} className="flex items-center" style={{ gap: '8px' }}>
                  <X size={15} style={{ color: '#9a9590', flexShrink: 0 }} />
                  <span className="font-sans" style={{ fontSize: '15px', color: '#9a9590' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reviews */}
      <section style={{ padding: 'clamp(60px, 8vw, 120px) 24px' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} style={{ marginBottom: '56px' }}>
            <div className="flex items-center" style={{ gap: '12px', marginBottom: '16px' }}>
              <Star size={22} style={{ color: '#c4956a', fill: '#c4956a' }} />
              <span className="font-display" style={{ fontSize: '36px', fontWeight: 300, color: '#1a1a2e' }}>4.9</span>
              <span className="font-sans" style={{ fontSize: '16px', color: '#9a9590' }}>&middot; 24 reviews</span>
            </div>
            <h2 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 300, color: '#1a1a2e' }}>
              What guests say
            </h2>
          </motion.div>

          <motion.div {...fadeInUp} className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '48px' }}>
            {reviews.map((review) => (
              <div key={review.author} style={{ borderTop: '1px solid rgba(212,165,116,0.3)', paddingTop: '28px' }}>
                <p className="font-sans" style={{ fontSize: '17px', fontWeight: 300, lineHeight: 1.7, color: '#4a4540', fontStyle: 'italic', marginBottom: '24px' }}>
                  &ldquo;{review.text}&rdquo;
                </p>
                <div>
                  <p className="font-sans" style={{ fontSize: '15px', color: '#1a1a2e', fontWeight: 500 }}>
                    {review.author}
                  </p>
                  <p className="font-sans" style={{ fontSize: '14px', color: '#9a9590', marginTop: '4px' }}>
                    {review.date}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA — scenic image */}
      <section className="relative overflow-hidden grain" style={{ height: 'clamp(500px, 70vh, 800px)' }}>
        <Image
          src="/images/bullion-king-lake-6.jpg"
          alt="San Juan Mountains alpine scenery"
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
            <h2 className="font-display" style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 300, color: '#ffffff', textShadow: '0 2px 20px rgba(0,0,0,0.3)', marginBottom: '32px' }}>
              Ready to book?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center" style={{ gap: '16px' }}>
              <Link
                href="/gallery"
                className="font-sans rounded-full transition-all duration-300"
                style={{ fontSize: '15px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '16px 40px', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', backdropFilter: 'blur(8px)' }}
              >
                View Gallery
              </Link>
              <Link
                href="/booking"
                className="font-sans rounded-full transition-all duration-300 flex items-center justify-center"
                style={{ fontSize: '15px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '16px 40px', backgroundColor: '#ffffff', color: '#1a1a2e', gap: '8px' }}
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
