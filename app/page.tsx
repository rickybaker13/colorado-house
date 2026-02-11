import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/common/Button';
import ImageCarousel from '@/components/common/ImageCarousel';
import AmenityCard from '@/components/property/AmenityCard';
import {
  Mountain,
  Snowflake,
  Users,
  Wifi,
  Utensils,
  Armchair,
} from 'lucide-react';

export default function Home() {
  const propertyImages = [
    'https://images.unsplash.com/photo-1511316695145-4992006ffddb?w=1200&q=80',
    'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1200&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80',
  ];

  const amenities = [
    {
      icon: <Mountain size={24} />,
      title: 'Mountain Views',
      description: 'Stunning panoramic views of the San Juan Mountains from multiple rooms',
    },
    {
      icon: <Snowflake size={24} />,
      title: 'Winter Perfect',
      description: 'Walking distance to Purgatory Ski Resort with easy access year-round',
    },
    {
      icon: <Wifi size={24} />,
      title: 'High-Speed WiFi',
      description: 'Reliable internet throughout the property for work or streaming',
    },
    {
      icon: <Utensils size={24} />,
      title: 'Gourmet Kitchen',
      description: 'Fully equipped kitchen with premium appliances for home-cooked meals',
    },
    {
      icon: <Armchair size={24} />,
      title: 'Luxury Furnishings',
      description: 'Elegant, comfortable spaces designed for relaxation and gatherings',
    },
    {
      icon: <Users size={24} />,
      title: 'Spacious Layouts',
      description: 'Sleeps up to 8 guests with multiple bedrooms and bathrooms',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-screen max-h-[800px] bg-gray-900 overflow-hidden hero-overlay">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
          alt="Mountain landscape at sunset"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20 flex flex-col items-center justify-center">
          <div className="text-center text-white max-w-3xl mx-auto px-4 animate-fade-in">
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">
              Purgatory Townhouse
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Luxury Mountain Living in the Heart of Durango
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/property" size="lg" variant="primary">
                Explore Property
              </Button>
              <Button href="/booking" size="lg" variant="secondary">
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Property Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">
                Your Perfect Mountain Escape
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Nestled in the picturesque Purgatory area near Durango, Colorado, our townhouse
                offers the ultimate mountain getaway. Whether you&apos;re seeking a winter ski
                adventure or a summer mountain retreat, this luxurious property provides the
                perfect base for unforgettable memories.
              </p>
              <p className="text-gray-700 mb-8 leading-relaxed">
                With stunning views, premium amenities, and convenient access to world-class
                skiing, outdoor activities, and local attractions, Purgatory Townhouse is your
                gateway to authentic Colorado mountain living.
              </p>
              <Button href="/property" size="lg" variant="outline">
                View Full Details
              </Button>
            </div>

            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1616394584738-fc6e612802e1?w=600&q=80"
                alt="Modern townhouse interior"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">
              Premium Amenities
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Everything you need for a comfortable and memorable stay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {amenities.map((amenity, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <AmenityCard {...amenity} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Photos Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-gray-900 mb-12 text-center">
            Gallery
          </h2>
          <ImageCarousel images={propertyImages} alt="Purgatory Townhouse" interval={6000} />
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-16 md:py-24 bg-mountain-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-serif text-4xl md:text-5xl font-bold text-gold mb-2">
                8
              </div>
              <p className="text-gray-300">Max Guests</p>
            </div>
            <div>
              <div className="font-serif text-4xl md:text-5xl font-bold text-gold mb-2">
                4
              </div>
              <p className="text-gray-300">Bedrooms</p>
            </div>
            <div>
              <div className="font-serif text-4xl md:text-5xl font-bold text-gold mb-2">
                3
              </div>
              <p className="text-gray-300">Bathrooms</p>
            </div>
            <div>
              <div className="font-serif text-4xl md:text-5xl font-bold text-gold mb-2">
                ⭐4.9
              </div>
              <p className="text-gray-300">Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">
            Ready for Your Mountain Adventure?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Book your stay today and experience the ultimate luxury mountain getaway
          </p>
          <Button href="/booking" size="lg">
            Reserve Your Dates
          </Button>
        </div>
      </section>
    </div>
  );
}
