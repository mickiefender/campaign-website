'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://www.facebook.com/DrCDwamena',
      color: 'hover:text-blue-600'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com',
      color: 'hover:text-blue-400'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com',
      color: 'hover:text-pink-600'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://linkedin.com',
      color: 'hover:text-blue-700'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://youtube.com',
      color: 'hover:text-red-600'
    }
  ]

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '#about' },
    { label: 'Vision', href: '#vision' },
    { label: 'Contact', href: '/contact' },
    { label: 'Donate', href: '/donate' },
    { label: 'Volunteer', href: '/volunteer' }
  ]

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/image/campaign-logo1.png"
                alt="Dr Charles Dwamena Logo"
                width={140}
                height={45}
                className="object-contain brightness-110"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Building a stronger Ghana through visionary leadership, integrity, and a commitment to every citizen's success.
            </p>
            <div className="flex gap-3 pt-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center transition-all duration-300 hover:bg-gray-700 ${social.color}`}
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-b border-red-500 pb-3">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-red-500 transition-colors duration-300 text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-b border-red-500 pb-3">
              Contact Info
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm font-medium">Accra, Ghana</p>
                  <p className="text-gray-400 text-xs">National Campaign Headquarters</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm font-medium">+233 XXX XXX XXX</p>
                  <p className="text-gray-400 text-xs">Available 24/7</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm font-medium">info@dwamena.org</p>
                  <p className="text-gray-400 text-xs">Contact us anytime</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Campaign Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-b border-red-500 pb-3">
              Campaign 2028
            </h3>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-red-600/20 to-blue-600/20 rounded-lg p-4 border border-red-500/30">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">Support Us</p>
                <p className="text-white font-semibold text-sm mb-3">Dial <span className="font-mono text-red-400">*713*2028#</span></p>
                <Link
                  href="/donate"
                  className="inline-block w-full text-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors duration-300 text-sm"
                >
                  Donate Now
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8"></div>

        {/* Bottom Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © {currentYear} Dr. Charles Dwamena. All rights reserved.
            </p>
          </div>

          {/* Center Legal Links */}
          <div className="flex justify-center gap-6">
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Use
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>

          {/* Right Text */}
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
              Transforming Ghana Together
            </p>
          </div>

        </div>
      </div>

      {/* Top Accent Line */}
      <div className="h-1 bg-gradient-to-r from-red-600 via-blue-600 to-red-600"></div>
    </footer>
  )
}
