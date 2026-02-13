'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/purgatory-resort', label: 'Resort' },
    { href: '/needles-mountains', label: 'Needles' },
    { href: '/lakes-water', label: 'Lakes' },
    { href: '/experience', label: 'Experience' },
    { href: '/practical-info', label: 'Info' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white bg-opacity-95 backdrop-blur-md border-b border-neutral-medium">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-medium to-primary-dark rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg font-display">P</span>
          </div>
          <span className="hidden sm:inline font-display text-xl font-semibold text-primary-dark">
            Purgatory
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-primary-dark hover:text-primary-light font-medium transition-colors font-sans"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-neutral-medium bg-white">
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-primary-dark hover:text-primary-light font-medium font-sans"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
