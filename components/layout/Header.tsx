'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/property', label: 'The Townhouse' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/san-juan-mountains', label: 'San Juans' },
    { href: '/hiking', label: 'Trails' },
    { href: '/alpine-lakes', label: 'Lakes' },
    { href: '/durango', label: 'Durango' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out-expo ${
          scrolled
            ? 'bg-snow/95 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10 group">
            <span
              className={`font-display text-2xl font-light tracking-wide transition-colors duration-500 ${
                scrolled ? 'text-charcoal' : 'text-white'
              }`}
            >
              Purgatory
            </span>
            <span
              className={`block h-px w-0 group-hover:w-full transition-all duration-300 ${
                scrolled ? 'bg-stone' : 'bg-white/60'
              }`}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-sans font-light tracking-wide transition-all duration-300 hover:opacity-100 ${
                  scrolled
                    ? 'text-charcoal/70 hover:text-charcoal'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="https://www.airbnb.com/rooms/1205985906587842742"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 text-sm font-sans font-medium px-5 py-2 rounded-full transition-all duration-300 ${
                scrolled
                  ? 'bg-charcoal text-snow hover:bg-charcoal-light'
                  : 'bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 border border-white/20'
              }`}
            >
              Book
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden relative z-10 p-2 transition-colors duration-300 ${
              isOpen ? 'text-snow' : scrolled ? 'text-charcoal' : 'text-white'
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-charcoal flex items-center justify-center"
          >
            <nav className="text-center">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    className="block font-display text-4xl font-light text-snow/80 hover:text-stone-light py-3 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.06, duration: 0.4 }}
                className="mt-10"
              >
                <Link
                  href="https://www.airbnb.com/rooms/1205985906587842742"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-sans tracking-widest uppercase text-stone-light border border-stone-light/40 px-8 py-3 rounded-full hover:bg-stone-light/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Book Your Stay
                  <ArrowUpRight size={14} />
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
