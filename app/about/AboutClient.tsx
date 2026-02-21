import Image from 'next/image';
import Button from '@/components/common/Button';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

export default function AboutClient() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 bg-gray-900 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80"
          alt="Owner portrait"
          fill
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 flex flex-col items-center justify-center">
          <h1 className="font-serif text-5xl font-bold text-white text-center">
            About Purgatory Townhouse
          </h1>
        </div>
      </section>

      {/* Owner Story Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-gray-700">
                <p>
                  Purgatory Townhouse was born from a passion for the Colorado mountains and
                  a desire to create a special place where families and friends could gather to
                  create unforgettable memories.
                </p>
                <p>
                  Located in the heart of Durango&apos;s Purgatory area, this carefully curated
                  property was designed with guests in mind. Every detail, from the luxurious
                  furnishings to the thoughtful amenities, reflects our commitment to providing
                  an exceptional mountain experience.
                </p>
                <p>
                  Whether you&apos;re visiting for world-class skiing, summer hiking, or simply
                  to escape the hustle and bustle of everyday life, our townhouse offers the
                  perfect mountain sanctuary.
                </p>
              </div>
            </div>

            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1507842531917-b4c73b2d4b66?w=600&q=80"
                alt="Mountain landscape"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-gray-900 text-center mb-12">
            Why Choose Us?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Premium Quality</h3>
              <p className="text-gray-600">
                Meticulously maintained property with high-end furnishings and modern
                amenities throughout.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Perfect Location</h3>
              <p className="text-gray-600">
                Minutes from Purgatory Ski Resort and close to hiking trails, restaurants,
                and local attractions.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Personal Service</h3>
              <p className="text-gray-600">
                Owner-managed property with a commitment to guest satisfaction and exceptional
                hospitality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-gray-900 text-center mb-12">
            Get In Touch
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h3 className="font-semibold text-xl text-gray-900 mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mountain-medium"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mountain-medium"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mountain-medium"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mountain-medium"
                    placeholder="Your message..."
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-xl text-gray-900 mb-8">Contact Information</h3>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <Phone className="text-mountain-medium flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Phone</h4>
                    <a href="tel:+1234567890" className="text-mountain-medium hover:text-mountain-dark">
                      (123) 456-7890
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="text-mountain-medium flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                    <a href="mailto:info@purgatory.local" className="text-mountain-medium hover:text-mountain-dark">
                      info@purgatory.local
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="text-mountain-medium flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                    <p className="text-gray-600">
                      Purgatory Area<br />
                      Durango, Colorado 81301<br />
                      United States
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
                  <div className="flex gap-4">
                    <a href="#" className="p-2 bg-gray-100 text-mountain-medium hover:bg-mountain-light hover:text-white rounded-lg transition-colors">
                      <Facebook size={20} />
                    </a>
                    <a href="#" className="p-2 bg-gray-100 text-mountain-medium hover:bg-mountain-light hover:text-white rounded-lg transition-colors">
                      <Instagram size={20} />
                    </a>
                    <a href="#" className="p-2 bg-gray-100 text-mountain-medium hover:bg-mountain-light hover:text-white rounded-lg transition-colors">
                      <Linkedin size={20} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="mt-12 bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Support Hours</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday - Sunday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Emergency Support</span>
                    <span>24/7</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Map Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-gray-900 text-center mb-12">
            Find Us
          </h2>
          <div className="rounded-lg overflow-hidden shadow-lg h-96 bg-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3090.3267676333255!2d-107.77999!3d37.49899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87411d9d9f9f9f9f%3A0x9f9f9f9f9f9f9f9f!2sPurgatory%20Mountain%20Resort!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
