'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-95 backdrop-blur-md border-b border-neutral-medium">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold font-display text-primary-dark">
          Purgatory
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8">
          <Link href="/" className="text-primary-dark hover:text-primary-medium transition font-sans">
            Home
          </Link>
          <Link href="/purgatory-resort" className="text-primary-dark hover:text-primary-medium transition font-sans">
            Resort
          </Link>
          <Link href="/needles-mountains" className="text-primary-dark hover:text-primary-medium transition font-sans">
            Needles
          </Link>
          <Link href="/lakes-water" className="text-primary-dark hover:text-primary-medium transition font-sans">
            Lakes
          </Link>
          <Link href="/experience" className="text-primary-dark hover:text-primary-medium transition font-sans">
            Experience
          </Link>
          <Link href="/practical-info" className="text-primary-dark hover:text-primary-medium transition font-sans">
            Info
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-primary-dark"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-neutral-medium px-4 py-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-primary-dark hover:text-primary-medium" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/purgatory-resort" className="text-primary-dark hover:text-primary-medium" onClick={() => setIsOpen(false)}>Resort</Link>
            <Link href="/needles-mountains" className="text-primary-dark hover:text-primary-medium" onClick={() => setIsOpen(false)}>Needles</Link>
            <Link href="/lakes-water" className="text-primary-dark hover:text-primary-medium" onClick={() => setIsOpen(false)}>Lakes</Link>
            <Link href="/experience" className="text-primary-dark hover:text-primary-medium" onClick={() => setIsOpen(false)}>Experience</Link>
            <Link href="/practical-info" className="text-primary-dark hover:text-primary-medium" onClick={() => setIsOpen(false)}>Info</Link>
          </div>
        </div>
      )}
    </header>
  );
}
