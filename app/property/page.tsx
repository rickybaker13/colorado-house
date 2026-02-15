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
    { icon: Flame, label: 'Fireplace' },
    { icon: Mountain, label: 'Hot Tub' },
    { icon: Tv, label: 'Smart TV & Streaming' },
    { icon: Car, label: 'Parking for 4' },
    { icon: Wind, label: 'Central Heat & AC' },
    { icon: Coffee, label: 'Full Kitchen' },
    { icon: BedDouble, label: 'In-Unit Laundry' },
  ];

  const rooms = [
    {
      name: 'Master Suite',
      detail: 'King bed, en-suite bath, mountain views',
      image: '/images/bedroom-master-1.jpg',
    },
    {
      name: 'Living Room',
      detail: 'Open floor plan, fireplace, views',
      image: '/images/living-room-1.jpg',
    },
    {
      name: 'Kitchen',
      detail: 'Fully stocked, modern appliances',
      image: '/images/kitchen-1.jpg',
    },
    {
      name: 'Guest Bedroom',
      detail: 'Queen bed, cozy mountain aesthetic',
      image: '/images/bedroom-guest-1.jpg',
    },
  ];

  const reviews = [
    {
      author: 'Sarah M.',
      text: 'The views are breathtaking and the attention to detail is incredible. We felt like we were in our own private mountain sanctuary.',
      date: 'January 2024',
    },
    {
      author: 'James R.',
      text: 'Perfect for a ski trip with friends. The townhouse is spacious, clean, and the location is ideal for Purgatory access.',
      date: 'December 2023',
    },
    {
      author: 'Emily T.',
      text: 'Beautiful home with great amenities. The kitchen is well-equipped and the living spaces are incredibly comfortable.',
      date: 'November 2023',
    },
  ];

  return (
    <main className="bg-snow min-h-screen">
      {/* Hero image grid */}
      <section className="relative h-[60vh] md:h-[75vh] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 h-full gap-1">
          <div className="md:col-span-8 relative h-full">
            <Image
              src="/images/exterior-1.jpg"
              alt="Purgatory Townhouse exterior"
              fill
              className="object-cover cinematic-image"
              sizes="(max-width: 768px) 100vw, 66vw"
              priority
            />
          </div>
          <div className="hidden md:grid md:col-span-4 grid-rows-2 gap-1">
            <div className="relative">
              <Image
                src="/images/living-room-2.jpg"
                alt="Living area"
                fill
                className="object-cover cinematic-image"
                sizes="34vw"
              />
            </div>
            <div className="relative">
              <Image
                src="/images/views-2.jpg"
                alt="Mountain views"
                fill
                className="object-cover cinematic-image"
                sizes="34vw"
              />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Overlaid title */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="font-sans text-caption uppercase tracking-[0.2em] text-white/50 mb-3">
              <MapPin size={12} className="inline mr-1.5 -mt-0.5" />
              Purgatory, Durango, Colorado
            </p>
            <h1 className="font-display text-display-lg text-white font-light mb-3">
              Purgatory Townhouse
            </h1>
            <div className="flex items-center gap-4 text-white/60 text-sm font-sans">
              <span className="flex items-center gap-1">
                <Star size={14} className="text-stone-light fill-stone-light" />
                4.9
              </span>
              <span>24 Reviews</span>
              <span>8 Guests</span>
              <span>4 Bedrooms</span>
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
              className="font-sans text-sm tracking-wide text-charcoal border border-stone-pale/60 px-5 py-2.5 rounded-full hover:border-charcoal/30 transition-colors"
            >
              All Photos
            </Link>
            <Link
              href="/about"
              className="font-sans text-sm tracking-wide text-charcoal border border-stone-pale/60 px-5 py-2.5 rounded-full hover:border-charcoal/30 transition-colors"
            >
              Contact
            </Link>
          </div>
          <Link
            href="https://www.airbnb.com/rooms/1205985906587842742"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-sans text-sm font-medium tracking-wide bg-charcoal text-snow px-6 py-2.5 rounded-full hover:bg-charcoal-light transition-colors"
          >
            Book on Airbnb
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-20 px-6">
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
                <stat.icon size={22} className="mx-auto text-stone mb-3" />
                <p className="font-display text-4xl text-charcoal font-light">
                  {stat.value}
                </p>
                <p className="font-sans text-sm text-warm-gray mt-1 tracking-wide">
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
              <p className="font-sans text-caption uppercase tracking-[0.2em] text-stone mb-4">
                About the property
              </p>
              <h2 className="font-display text-display-md text-charcoal mb-8">
                Mountain living, refined
              </h2>
              <div className="space-y-5 text-body-lg text-warm-gray-dark font-light leading-relaxed">
                <p>
                  Situated in the scenic Purgatory area just minutes from the ski resort,
                  this luxurious townhouse offers the perfect blend of comfort, style, and
                  mountain access. 4,200 square feet of thoughtfully designed living space
                  with premium furnishings throughout.
                </p>
                <p>
                  Whether you&apos;re planning a winter ski getaway, a summer hiking
                  expedition, or simply seeking the quiet of the high country, this is your
                  home base for everything the San Juans have to offer.
                </p>
              </div>
            </div>

            {/* Quick info card */}
            <div className="lg:col-span-2">
              <div className="bg-cream p-8 md:p-10">
                <h3 className="font-display text-2xl text-charcoal mb-6">
                  Details
                </h3>
                <ul className="space-y-5">
                  {[
                    { label: 'Check-in', value: '4:00 PM' },
                    { label: 'Check-out', value: '10:00 AM' },
                    { label: 'Minimum Stay', value: '2 nights' },
                    { label: 'Pets', value: 'By arrangement' },
                    { label: 'Parking', value: '4 vehicles' },
                  ].map((item) => (
                    <li
                      key={item.label}
                      className="flex justify-between items-center border-b border-stone-pale/50 pb-3"
                    >
                      <span className="font-sans text-sm text-warm-gray tracking-wide">
                        {item.label}
                      </span>
                      <span className="font-sans text-sm text-charcoal font-medium">
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

      {/* Room showcase */}
      <section className="px-4 md:px-6 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto">
          <motion.p
            {...fadeInUp}
            className="font-sans text-caption uppercase tracking-[0.2em] text-stone mb-4 px-2"
          >
            Spaces
          </motion.p>
          <motion.h2
            {...fadeInUp}
            className="font-display text-display-md text-charcoal mb-12 px-2"
          >
            Rooms & living areas
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                  <h3 className="font-display text-2xl text-white font-light mb-1">
                    {room.name}
                  </h3>
                  <p className="font-sans text-sm text-white/60">{room.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="bg-cream py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="max-w-2xl mb-16">
            <p className="font-sans text-caption uppercase tracking-[0.2em] text-stone mb-4">
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
                <feature.icon size={20} className="text-stone flex-shrink-0" />
                <span className="font-sans text-sm text-charcoal tracking-wide">
                  {feature.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Full amenity list */}
          <motion.div
            {...fadeInUp}
            className="mt-14 pt-10 border-t border-stone-pale/50"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                'Washer & Dryer',
                'Air Purifiers',
                'Blackout Curtains',
                'Deck with Views',
                'Fully Stocked Kitchen',
                'Dishwasher',
                'Coffee Maker',
                'Hair Dryer',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check size={14} className="text-forest-soft flex-shrink-0" />
                  <span className="font-sans text-sm text-warm-gray-dark">
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
            <div className="flex items-center gap-3 mb-4">
              <Star size={18} className="text-stone fill-stone" />
              <span className="font-display text-3xl text-charcoal font-light">
                4.9
              </span>
              <span className="font-sans text-sm text-warm-gray">&middot; 24 reviews</span>
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
                <p className="font-sans text-body-lg text-warm-gray-dark font-light leading-relaxed italic mb-6">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div>
                  <p className="font-sans text-sm text-charcoal font-medium">
                    {review.author}
                  </p>
                  <p className="font-sans text-xs text-warm-gray mt-0.5">
                    {review.date}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden grain">
        <Image
          src="/images/exterior-2.jpg"
          alt="Townhouse at dusk"
          fill
          className="object-cover cinematic-image"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />
        <div className="relative z-10 h-full flex flex-col items-center justify-end text-center pb-16 md:pb-20 px-6">
          <motion.div {...fadeInUp}>
            <h2 className="font-display text-display-md text-white font-light mb-6">
              Ready to book?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/gallery"
                className="font-sans text-sm tracking-widest uppercase px-8 py-3.5 border border-white/30 text-white rounded-full hover:bg-white/10 transition-all duration-300"
              >
                View Gallery
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
