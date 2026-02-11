import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-mountain-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">
              Purgatory Townhouse
            </h3>
            <p className="text-gray-300 text-sm">
              Your perfect mountain getaway in the heart of Durango, Colorado.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/property" className="hover:text-gold transition-colors">
                  Property Details
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-gold transition-colors">
                  Book Now
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-gold" />
                <a href="tel:+1234567890" className="hover:text-gold transition-colors">
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-gold" />
                <a href="mailto:info@purgatorytownhouse.com" className="hover:text-gold transition-colors">
                  info@purgatory.local
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-gold" />
                <span>Durango, CO 81301</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold mb-4">Hours</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Check-in: 4:00 PM</li>
              <li>Check-out: 10:00 AM</li>
              <li>Support: 24/7</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-mountain-medium pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; {currentYear} Purgatory Townhouse. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-gold transition-colors">Privacy</a>
              <a href="#" className="hover:text-gold transition-colors">Terms</a>
              <a href="#" className="hover:text-gold transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
