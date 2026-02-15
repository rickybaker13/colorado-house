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
  Wifi,
  Flame,
  Car,
  Tv,
  Wind,
  Coffee,
  ArrowUpRight,
  Check,
  Gamepad2,
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

export default function PropertyPage() {
  const features = [
    { icon: Wifi, label: 'High-Speed WiFi' },
    { icon: Flame, label: 'Gas Fireplace' },
    { icon: Tv, label: 'Smart TVs & Streaming' },
    { icon: Car, label: 'Garage + Parking' },
    { icon: Wind, label: 'Central Heat & AC' },
    { icon: Coffee, label: 'Full Gourmet Kitchen' },
    { icon: BedDouble, label: 'In-Unit Washer/Dryer' },
    { icon: Gamepad2, label: 'Xbox Game Console' },
  ];

  /* Correct photo mapping based on actual image content */
  const rooms = [
    {
      name: 'Great Room',
      detail: 'Vaulted ceilings, fireplace, open to kitchen with mountain views',
      image: '/images/views-1.jpg', /* landscape 1280x960 — open floor plan with fireplace + kitchen */
    },
    {
      name: 'Master Suite',
      detail: 'King bed, Pendleton blanket, mountain-modern decor',
      image: '/images/exterior-3.jpg', /* portrait 960x1280 — master bedroom with Pendleton */
    },
    {
      name: 'Gourmet Kitchen',
      detail: 'Quartz counters, rustic knotty alder cabinets, island seating',
      image: '/images/kitchen-2.jpg', /* landscape 1280x960 — kitchen with island */
    },
    {
      name: 'Bunk Room',
      detail: 'Two bunks, sectional sofa, TV, and Xbox — kids love it',
      image: '/images/living-room-2.jpg', /* landscape 1280x960 — bunk room with TV + sofa */
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

  return (
    <main className="bg-snow min-h-screen">
      {/* Hero image grid — EXTERIOR (kitchen-1.jpg) as main */}
      <section className="relative h-[60vh] md:h-[75vh] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 h-full gap-1">
          <div className="md:col-span-8 relative h-full">
            <Image
              src="/images/kitchen-1.jpg"
              alt="Purgatory Townhouse — modern mountain architecture with deck and garage"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 66vw"
              priority
            />
          </div>
          <div className="hidden md:grid md:col-span-4 grid-rows-2 gap-1">
            <div className="relative">
              <Image
                src="/images/views-2.jpg"
                alt="Living room with vaulted ceiling and loft"
                fill
                className="object-cover"
                sizes="34vw"
              />
            </div>
            <div className="relative">
              <Image
                src="/images/bedroom-guest-2.jpg"
                alt="Fireplace and living area from sofa"
                fill
                className="object-cover"
                sizes="34vw"
              />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

        {/* Overlaid title */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="font-sans text-caption uppercase tracking-[0.25em] text-white/70 mb-3 drop-shadow-md">
              <MapPin size={14} className="inline mr-1.5 -mt-0.5" />
              Purgatory, Durango, Colorado
            </p>
            <h1 className="font-display text-display-lg text-white mb-3 drop-shadow-lg">
              Purgatory Townhouse
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-base font-sans drop-shadow-md">
              <span className="flex items-center gap-1.5">
                <Star size={16} className="text-stone-light fill-stone-light" />
                4.9
              </span>
              <span>24 Reviews</span>
              <span>8 Guests</span>
              <span>4 Bedrooms</span>
              <span>3 Baths</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick actions bar */}
      <section className="border-b border-stone-pale/40">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-3">
            <Link
              href="/gallery"
              className="font-sans text-label-sm tracking-wide text-charcoal border border-stone-pale/60 px-6 py-3 rounded-full hover:border-charcoal/30 transition-colors"
            >
              All Photos
            </Link>
            <Link
              href="/about"
              className="font-sans text-label-sm tracking-wide text-charcoal border border-stone-pale/60 px-6 py-3 rounded-full hover:border-charcoal/30 transition-colors"
            >
              Contact
            </Link>
          </div>
          <Link
            href="https://www.airbnb.com/rooms/1205985906587842742"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-sans text-label-sm font-medium tracking-wide bg-charcoal text-snow px-8 py-3 rounded-full hover:bg-charcoal-light transition-colors"
          >
            Book on Airbnb
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            {...fadeInUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
          >
            {[
              { icon: Mountain, value: '8,793\'', label: 'Elevation' },
              { icon: Users, value: '8', label: 'Max Guests' },
              { icon: BedDouble, value: '4', label: 'Bedrooms' },
              { icon: Bath, value: '3', label: 'Bathrooms' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon size={24} className="mx-auto text-stone mb-4" />
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
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            <div className="lg:col-span-3">
              <p className="font-sans text-caption uppercase tracking-[0.25em] text-stone mb-5">
                About the property
              </p>
              <h2 className="font-display text-display-md text-charcoal mb-8">
                Mountain living, refined
              </h2>
              <div className="space-y-6 text-body-lg text-warm-gray-dark leading-relaxed">
                <p>
                  This brand-new townhouse sits at the base of Purgatory Resort in the San Juan
                  Mountains — one of the most dramatic mountain ranges in all of Colorado. With
                  vaulted ceilings, a floor-to-ceiling stone fireplace, and walls of windows
                  framing the surrounding peaks, every room connects you to the landscape.
                </p>
                <p>
                  The main level features an open great room flowing into a gourmet kitchen with
                  knotty alder cabinets, quartz countertops, and a large island. Downstairs, the
                  bunk room with its own TV and Xbox console gives families and groups their own
                  space to spread out.
                </p>
              </div>
            </div>

            {/* Quick info card */}
            <div className="lg:col-span-2">
              <div className="bg-cream p-8 md:p-10">
                <h3 className="font-display text-3xl text-charcoal mb-6">
                  Details
                </h3>
                <ul className="space-y-5">
                  {[
                    { label: 'Check-in', value: '4:00 PM' },
                    { label: 'Check-out', value: '10:00 AM' },
                    { label: 'Minimum Stay', value: '2 nights' },
                    { label: 'Pets', value: 'By arrangement' },
                    { label: 'Parking', value: 'Garage + driveway' },
                    { label: 'Entry', value: 'Smart lock keypad' },
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* Room showcase — CORRECTED image assignments */}
      <section className="px-4 md:px-6 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto">
          <motion.p
            {...fadeInUp}
            className="font-sans text-caption uppercase tracking-[0.25em] text-stone mb-5 px-2"
          >
            Spaces
          </motion.p>
          <motion.h2
            {...fadeInUp}
            className="font-display text-display-md text-charcoal mb-12 px-2"
          >
            Rooms &amp; living areas
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {rooms.map((room, i) => (
              <motion.div
                key={room.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="relative aspect-[4/3] overflow-hidden group"
              >
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                  <h3 className="font-display text-3xl text-white mb-1 drop-shadow-lg">
                    {room.name}
                  </h3>
                  <p className="font-sans text-base text-white/80 drop-shadow-md">{room.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* More interior photos strip */}
      <section className="px-4 md:px-6 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { src: '/images/dining-1.jpg', alt: 'Dining area with tree-ring art' },
            { src: '/images/detail-1.jpg', alt: 'Living room leather sofa and art' },
            { src: '/images/bathroom-2.jpg', alt: 'Main bathroom with glass shower' },
            { src: '/images/laundry.jpg', alt: 'In-unit LG washer and dryer' },
          ].map((img, i) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="relative aspect-square overflow-hidden"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Amenities */}
      <section className="bg-cream py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="max-w-2xl mb-16">
            <p className="font-sans text-caption uppercase tracking-[0.25em] text-stone mb-5">
              Amenities
            </p>
            <h2 className="font-display text-display-md text-charcoal">
              Everything you need
            </h2>
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8"
          >
            {features.map((feature) => (
              <div key={feature.label} className="flex items-center gap-4">
                <feature.icon size={22} className="text-stone flex-shrink-0" />
                <span className="font-sans text-label text-charcoal">
                  {feature.label}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="mt-14 pt-10 border-t border-stone-pale/50"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[
                'Washer & Dryer',
                'Blackout Curtains',
                'Deck with Mountain Views',
                'Dishwasher',
                'Coffee Maker & Grinder',
                'Hair Dryer',
                'Iron & Ironing Board',
                'Smart Lock Entry',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Check size={16} className="text-forest-soft flex-shrink-0" />
                  <span className="font-sans text-label-sm text-warm-gray-dark">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="mb-16">
            <div className="flex items-center gap-3 mb-5">
              <Star size={20} className="text-stone fill-stone" />
              <span className="font-display text-4xl text-charcoal">4.9</span>
              <span className="font-sans text-label text-warm-gray">&middot; 24 reviews</span>
            </div>
            <h2 className="font-display text-display-md text-charcoal">
              What guests say
            </h2>
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
          >
            {reviews.map((review) => (
              <div key={review.author} className="border-t border-stone-pale/50 pt-8">
                <p className="font-sans text-body-lg text-warm-gray-dark leading-relaxed italic mb-6">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div>
                  <p className="font-sans text-label text-charcoal font-medium">
                    {review.author}
                  </p>
                  <p className="font-sans text-label-sm text-warm-gray mt-1">
                    {review.date}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA — scenic image */}
      <section className="relative h-[55vh] md:h-[65vh] overflow-hidden grain">
        <Image
          src="/images/bullion-king-lake-6.jpg"
          alt="San Juan Mountains alpine scenery"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/15" />
        <div className="relative z-10 h-full flex flex-col items-center justify-end text-center pb-16 md:pb-24 px-6">
          <motion.div {...fadeInUp}>
            <h2 className="font-display text-display-lg text-white mb-8 drop-shadow-lg">
              Ready to book?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/gallery"
                className="font-sans text-base tracking-widest uppercase px-10 py-4 border border-white/30 text-white rounded-full hover:bg-white/15 transition-all duration-300"
              >
                View Gallery
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
