import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">
              Purgatory
            </h3>
            <p className="text-accent-sky text-sm">
              Discover the alpine beauty of Colorado's San Juan Mountains.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold font-display mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-accent-sky">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/purgatory-resort" className="hover:text-white transition-colors">
                  Resort
                </Link>
              </li>
              <li>
                <Link href="/needles-mountains" className="hover:text-white transition-colors">
                  Needles Mountains
                </Link>
              </li>
              <li>
                <Link href="/experience" className="hover:text-white transition-colors">
                  Experience
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold font-display mb-4">Location</h4>
            <ul className="space-y-3 text-sm text-accent-sky">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-accent-water" />
                <span>Purgatory, CO</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-accent-water" />
                <span>Durango, Colorado, USA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-accent-slate pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-accent-sky">
            <p>&copy; {currentYear} Purgatory Area. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
