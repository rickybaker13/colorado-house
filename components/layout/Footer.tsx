import Link from 'next/link';
import { MapPin, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          {/* Brand column */}
          <div className="md:col-span-5">
            <h3 className="font-display text-3xl font-light mb-4 tracking-wide">
              Purgatory
            </h3>
            <p className="font-sans text-sm text-white/40 max-w-sm leading-relaxed font-light">
              A luxury mountain retreat in the San Juan Mountains of Colorado.
              Four bedrooms, breathtaking views, and access to world-class
              skiing, hiking, and alpine adventure.
            </p>
          </div>

          {/* Explore */}
          <div className="md:col-span-3">
            <h4 className="font-sans text-caption uppercase tracking-[0.2em] text-white/30 mb-5">
              Explore
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/property', label: 'The Townhouse' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/san-juan-mountains', label: 'San Juan Mountains' },
                { href: '/hiking', label: 'Alpine Trails' },
                { href: '/alpine-lakes', label: 'Lakes' },
                { href: '/durango', label: 'Durango' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-white/50 hover:text-white transition-colors font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h4 className="font-sans text-caption uppercase tracking-[0.2em] text-white/30 mb-5">
              Location
            </h4>
            <div className="flex items-start gap-2 mb-6">
              <MapPin size={14} className="text-stone mt-0.5 flex-shrink-0" />
              <p className="font-sans text-sm text-white/50 font-light leading-relaxed">
                Purgatory Area<br />
                Durango, Colorado 81301<br />
                United States
              </p>
            </div>
            <Link
              href="https://www.airbnb.com/rooms/1205985906587842742"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-sm tracking-wider text-stone hover:text-stone-light transition-colors"
            >
              Book on Airbnb
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-xs text-white/25 font-light">
            &copy; {currentYear} Purgatory Townhouse. All rights reserved.
          </p>
          <div className="flex gap-8">
            {['Privacy', 'Terms', 'Contact'].map((item) => (
              <Link
                key={item}
                href={item === 'Contact' ? '/about' : '#'}
                className="font-sans text-xs text-white/25 hover:text-white/50 transition-colors font-light"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
