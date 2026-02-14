import Image from 'next/image';
import Button from '@/components/common/Button';
import ImageCarousel from '@/components/common/ImageCarousel';
import ReviewCard from '@/components/property/ReviewCard';
import {
  Home,
  MapPin,
  Users,
  Wind,
  Trees,
  Wifi,
  UtensilsCrossed,
  Sofa,
  Key,
  Tv,
  Check,
} from 'lucide-react';

export default function PropertyPage() {
  const images = [
    'https://images.unsplash.com/photo-1511316695145-4992006ffddb?w=1200&q=80',
    'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1200&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80',
  ];

  const features = [
    'Fully Stocked Kitchen',
    'Washer & Dryer',
    'Central Heating & AC',
    'Smart TV with Streaming',
    'Free High-Speed WiFi',
    'Fireplace',
    'Hot Tub',
    'Deck with Mountain Views',
    'Parking for 4 Vehicles',
    'In-Unit Laundry',
    'Air Purifiers',
    'Blackout Curtains',
  ];

  const reviews = [
    {
      author: 'Sarah Mitchell',
      rating: 5,
      text: 'Absolutely stunning property! The views are breathtaking and the attention to detail is incredible. We felt like we were in our own private mountain sanctuary. Highly recommend!',
      date: 'Jan 2024',
    },
    {
      author: 'James Rodriguez',
      rating: 5,
      text: 'Perfect for a ski trip with friends. The townhouse is spacious, clean, and everything works perfectly. The location is ideal for Purgatory access. Will definitely be back!',
      date: 'Dec 2023',
    },
    {
      author: 'Emily Thompson',
      rating: 4,
      text: 'Beautiful home with great amenities. The kitchen is well-equipped and the living spaces are comfortable. Only minor suggestion would be slightly better signage from the main road.',
      date: 'Nov 2023',
    },
  ];

  const bedrooms = [
    { name: 'Master Bedroom', description: 'King bed, en-suite bathroom, mountain views, walk-in closet' },
    { name: 'Bedroom 2', description: 'Queen bed, shared bathroom, sleek modern design' },
    { name: 'Bedroom 3', description: 'Queen bed, shared bathroom, cozy mountain aesthetic' },
    { name: 'Bedroom 4', description: 'Twin beds, shared bathroom, perfect for kids or single travelers' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                Purgatory Townhouse
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin size={18} />
                  <span>Durango, Colorado 81301</span>
                </div>
                <span>⭐ 4.9 (24 Reviews)</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button href="https://www.airbnb.com/rooms/1205985906587842742" size="lg">
                View on Airbnb
              </Button>
              <Button href="/booking" size="lg">
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Image Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <ImageCarousel images={images} alt="Property" />
      </section>

      {/* Property Details Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <Home className="mx-auto mb-3 text-mountain-medium" size={32} />
            <p className="text-2xl font-bold text-gray-900">4,200</p>
            <p className="text-gray-600">Square Feet</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <Users className="mx-auto mb-3 text-mountain-medium" size={32} />
            <p className="text-2xl font-bold text-gray-900">8</p>
            <p className="text-gray-600">Max Guests</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <Key className="mx-auto mb-3 text-mountain-medium" size={32} />
            <p className="text-2xl font-bold text-gray-900">4</p>
            <p className="text-gray-600">Bedrooms</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <UtensilsCrossed className="mx-auto mb-3 text-mountain-medium" size={32} />
            <p className="text-2xl font-bold text-gray-900">3</p>
            <p className="text-gray-600">Bathrooms</p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">
              Property Overview
            </h2>
            <div className="space-y-6 text-gray-700">
              <p>
                Welcome to Purgatory Townhouse, your gateway to Colorado&apos;s finest mountain
                living. Situated in the scenic Purgatory area just minutes from world-renowned
                Purgatory Ski Resort, this luxurious townhouse offers the perfect blend of
                comfort, style, and adventure.
              </p>
              <p>
                Whether you&apos;re planning a winter ski getaway, a family summer vacation, or
                an intimate mountain retreat, this property provides an exceptional home base with
                all the amenities you need and more.
              </p>
              <p>
                With 4,200 square feet of thoughtfully designed living space, accommodations for
                up to 8 guests, and premium furnishings throughout, this is truly a special place
                to create lasting memories.
              </p>
            </div>
          </div>

          <div className="bg-mountain-dark text-white rounded-lg p-8">
            <h3 className="font-semibold text-lg mb-6">Quick Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Check size={20} className="text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Check-in</p>
                  <p className="text-sm text-gray-300">4:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Check-out</p>
                  <p className="text-sm text-gray-300">10:00 AM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Minimum Stay</p>
                  <p className="text-sm text-gray-300">2 nights</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Pets</p>
                  <p className="text-sm text-gray-300">By arrangement</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bedrooms Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-12">
            Bedrooms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bedrooms.map((bedroom, index) => (
              <div key={index} className="bg-white rounded-lg p-8 border border-gray-200">
                <h3 className="font-semibold text-xl text-gray-900 mb-3">
                  {bedroom.name}
                </h3>
                <p className="text-gray-600">{bedroom.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-12">
          Featured Amenities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Check size={24} className="text-mountain-medium flex-shrink-0" />
              <span className="text-gray-700 font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-12">
            Guest Reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <ReviewCard key={index} {...review} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-r from-primary-light to-primary-medium rounded-lg p-12 text-white text-center">
            <h2 className="font-serif text-3xl font-bold mb-4">
              View Full Gallery
            </h2>
            <p className="text-lg mb-8 text-gray-100">
              See all 32 photos of the property
            </p>
            <Button href="/gallery" size="lg" variant="secondary">
              Photo Gallery
            </Button>
          </div>
          <div className="bg-gradient-to-r from-mountain-dark to-mountain-medium rounded-lg p-12 text-white text-center">
            <h2 className="font-serif text-4xl font-bold mb-4">
              Ready to Book?
            </h2>
            <p className="text-lg mb-8 text-gray-100">
              Secure your dates and experience the best of mountain living
            </p>
            <Button href="/booking" size="lg" variant="secondary">
              Check Availability
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
