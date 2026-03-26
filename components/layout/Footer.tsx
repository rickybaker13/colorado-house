'use client';

import Link from 'next/link';
import { MapPin, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10" style={{ paddingTop: '80px', paddingBottom: '48px' }}>
        <div className="grid grid-cols-1 md:grid-cols-12" style={{ gap: '48px', marginBottom: '64px' }}>
          {/* Brand column */}
          <div className="md:col-span-5">
            <h3 className="font-display" style={{ fontSize: '30px', fontWeight: 300, marginBottom: '16px', letterSpacing: '0.03em', color: '#ffffff' }}>
              San Juans
            </h3>
            <p className="font-sans" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', maxWidth: '380px', lineHeight: 1.6, fontWeight: 300 }}>
              A luxury mountain retreat in the San Juan Mountains of Colorado.
              Four bedrooms, ten guests, and access to world-class
              skiing, hiking, and alpine adventure.
            </p>
          </div>

          {/* Explore */}
          <div className="md:col-span-3">
            <h4 className="font-sans" style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>
              Explore
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { href: '/property', label: 'The Townhouse' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/san-juan-mountains', label: 'San Juan Mountains' },
                { href: '/hiking', label: 'Alpine Trails' },
                { href: '/alpine-lakes', label: 'Lakes' },
                { href: '/durango', label: 'Durango' },
                { href: '/blog', label: 'Stories' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans transition-colors duration-300"
                    style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', fontWeight: 300 }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h4 className="font-sans" style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>
              Location
            </h4>
            <div className="flex items-start" style={{ gap: '8px', marginBottom: '24px' }}>
              <MapPin size={14} style={{ color: '#c4956a', marginTop: '3px', flexShrink: 0 }} />
              <p className="font-sans" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', fontWeight: 300, lineHeight: 1.6 }}>
                108 Travertine Trl<br />
                Durango, Colorado 81301<br />
                United States
              </p>
            </div>
            <Link
              href="/booking"
              className="inline-flex items-center font-sans transition-colors duration-300"
              style={{ gap: '8px', fontSize: '15px', letterSpacing: '0.06em', color: '#c4956a' }}
            >
              Book Direct
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '32px', gap: '16px' }}>
          <p className="font-sans" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)', fontWeight: 300 }}>
            &copy; {currentYear} Purgatory Townhouse. All rights reserved.
          </p>
          <div className="flex" style={{ gap: '32px' }}>
            {['Privacy', 'Terms'].map((item) => (
              <Link
                key={item}
                href="#"
                className="font-sans transition-colors duration-300"
                style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)', fontWeight: 300 }}
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
