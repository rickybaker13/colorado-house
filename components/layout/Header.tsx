'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

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
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? 'rgba(250,250,248,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between" style={{ height: '80px' }}>
          {/* Logo */}
          <Link href="/" className="relative z-10 shrink-0">
            <span
              className="font-display transition-colors duration-500"
              style={{
                fontSize: '30px',
                fontWeight: 300,
                letterSpacing: '0.03em',
                color: scrolled && !isOpen ? '#1a1a2e' : '#ffffff',
              }}
            >
              Purgatory
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center" style={{ gap: '32px' }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans transition-colors duration-300"
                style={{
                  fontSize: '15px',
                  fontWeight: 400,
                  color: scrolled ? 'rgba(26,26,46,0.6)' : 'rgba(255,255,255,0.75)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = scrolled ? '#1a1a2e' : '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = scrolled ? 'rgba(26,26,46,0.6)' : 'rgba(255,255,255,0.75)'}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="https://www.airbnb.com/rooms/1205985906587842742"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center rounded-full transition-all duration-300 font-sans"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                padding: '10px 24px',
                gap: '6px',
                backgroundColor: scrolled ? '#1a1a2e' : 'rgba(255,255,255,0.15)',
                color: scrolled ? '#fafaf8' : '#ffffff',
                border: scrolled ? 'none' : '1px solid rgba(255,255,255,0.2)',
                backdropFilter: scrolled ? 'none' : 'blur(8px)',
              }}
            >
              Book
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Hamburger — custom animated lines */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden relative z-10 flex flex-col justify-center items-center"
            style={{ width: '36px', height: '36px', gap: isOpen ? '0px' : '7px' }}
            aria-label="Toggle menu"
          >
            <span
              className="block transition-all duration-300"
              style={{
                width: '24px',
                height: '1.5px',
                backgroundColor: isOpen || !scrolled ? '#ffffff' : '#1a1a2e',
                transform: isOpen ? 'rotate(45deg) translateY(0.75px)' : 'none',
              }}
            />
            <span
              className="block transition-all duration-300"
              style={{
                width: isOpen ? '24px' : '18px',
                height: '1.5px',
                backgroundColor: isOpen || !scrolled ? '#ffffff' : '#1a1a2e',
                transform: isOpen ? 'rotate(-45deg) translateY(-0.75px)' : 'none',
              }}
            />
          </button>
        </nav>
      </header>

      {/* Fullscreen menu — clean, Dunton-inspired */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center"
            style={{ backgroundColor: '#1a1a2e' }}
          >
            <nav className="flex flex-col items-center">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    className="block font-display text-center transition-colors duration-300"
                    style={{
                      fontSize: 'clamp(28px, 5vw, 48px)',
                      fontWeight: 300,
                      padding: '10px 0',
                      lineHeight: 1.3,
                      color: 'rgba(255,255,255,0.75)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#d4a574'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + navLinks.length * 0.05, duration: 0.5 }}
                style={{ marginTop: '40px' }}
              >
                <Link
                  href="https://www.airbnb.com/rooms/1205985906587842742"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center font-sans rounded-full transition-colors"
                  style={{
                    fontSize: '13px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase' as const,
                    padding: '14px 36px',
                    gap: '8px',
                    color: '#d4a574',
                    border: '1px solid rgba(212,165,116,0.4)',
                  }}
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
