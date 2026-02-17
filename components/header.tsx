'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-secondary/30 text-secondary-foreground shadow-md border-b border-secondary/20">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
              DR
            </div>
            <span className="font-bold text-lg hidden sm:inline">Charles Dwamena</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            <Link href="/" className="hover:text-accent transition">Home</Link>
            <Link href="/about" className="hover:text-accent transition">About</Link>
            <Link href="/vision" className="hover:text-accent transition">Vision</Link>
            <Link href="/news" className="hover:text-accent transition">News</Link>
            <Link href="/volunteer" className="hover:text-accent transition">Volunteer</Link>
            <Link href="/contact" className="hover:text-accent transition">Contact</Link>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex gap-3">
            <Link
              href="/donate"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-semibold transition"
            >
              Donate
            </Link>
            <Link
              href="/admin"
              className="border border-accent text-accent px-4 py-2 rounded-lg hover:bg-accent/10 transition"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden flex flex-col gap-4 mt-4 pt-4 border-t border-secondary-foreground/20">
            <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/about" onClick={() => setIsOpen(false)}>About</Link>
            <Link href="/vision" onClick={() => setIsOpen(false)}>Vision</Link>
            <Link href="/news" onClick={() => setIsOpen(false)}>News</Link>
            <Link href="/volunteer" onClick={() => setIsOpen(false)}>Volunteer</Link>
            <Link href="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
            <div className="flex flex-col gap-2 pt-4">
              <Link
                href="/donate"
                onClick={() => setIsOpen(false)}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold text-center"
              >
                Donate
              </Link>
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="border border-accent text-accent px-4 py-2 rounded-lg text-center"
              >
                Admin
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
